import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Run from "../models/Run.js";
import Razorpay from "razorpay";
import InviteCode from "../models/InviteCode.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a registration for one specific run.
export const registerRunner = async (req, res) => {
  
  try {
    const { name, phone, email, age, runId, inviteCode } = req.body;

    if (!runId) {
      return res.status(400).json({
        message: "Please select a run.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(runId)) {
      return res.status(400).json({
        message: "Invalid run selected.",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Name is required.",
      });
    }

    if (!/^\d{10}$/.test(String(phone))) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits.",
      });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (Number(age) < 10 || Number(age) > 100) {
      return res.status(400).json({
        message: "Age must be between 10 and 100.",
      });
    }
if (!inviteCode?.trim()) {
  return res.status(400).json({
    message: "Invite code is required.",
  });
}

const invite = await InviteCode.findOne({
  code: inviteCode.trim().toUpperCase(),
  runId,
  status: "Available",
});


if (!invite) {
  return res.status(400).json({
    message: "Invalid , Unavailable or already used invite code.",
  });
}
    /*
      This is important:
      It finds the exact selected run AND requires it to be open.
      A closed run cannot register, even if someone bypasses the frontend.
    */
    const run = await Run.findOne({
      _id: runId,
      registrationOpen: true,
    });

    if (!run) {
      return res.status(400).json({
        message: "This run does not exist or registrations are closed.",
      });
    }
 

    const razorpayOrder = await razorpay.orders.create({
  amount: 100,
  currency: "INR",
 receipt: `run_${run._id.toString().slice(-8)}_${Date.now().toString().slice(-6)}`,
});

   let registration = await Registration.findOne({
  run: run._id,
  paymentStatus: "Pending",
  $or: [
    { email: email.trim().toLowerCase() },
    { phone: String(phone) },
  ],
});

if (registration) {
  // User already has a pending registration.
  // Update it with the latest Razorpay order and details.
  registration.name = name.trim();
  registration.phone = String(phone);
  registration.age = Number(age);
  registration.inviteCode = invite._id;
  registration.razorpayOrderId = razorpayOrder.id;

  await registration.save();
} else {
  registration = await Registration.create({
    run: run._id,
    name: name.trim(),
    phone: String(phone),
    email: email.trim().toLowerCase(),
    age: Number(age),
    paymentStatus: "Pending",
    razorpayOrderId: razorpayOrder.id,
    inviteCode: invite._id,
  });
}



    res.status(201).json({
      registration,
      order: razorpayOrder,
    });
  } catch (error) {
    

    res.status(500).json({
      message: "Could not create registration.",
    });
  }
};

// Admin can request registrations for one run:
// GET /api/register?runId=RUN_ID
export const getRegistrations = async (req, res) => {
  try {
    const { runId } = req.query;
    const filter = {
  paymentStatus: "Paid",
};

    if (runId) {
      if (!mongoose.Types.ObjectId.isValid(runId)) {
        return res.status(400).json({
          message: "Invalid run ID.",
        });
      }

      filter.run = runId;
    }

    const registrations = await Registration.find(filter)
      .populate("run", "title date time location registrationOpen")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    

    res.status(500).json({
      message: "Could not load registrations.",
    });
  }
};

export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found.",
      });
    }

    if (registration.run) {
      await Run.findByIdAndUpdate(registration.run, {
        $inc: { registered: -1 },
      });
    }

    res.status(200).json({
      message: "Registration deleted successfully.",
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Could not delete registration.",
    });
  }
};