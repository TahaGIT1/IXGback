//orderController.js
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import crypto from "crypto";
import Registration from "../models/Registration.js";
import Run from "../models/Run.js";
import InviteCode from "../models/InviteCode.js";
import {
  sendConfirmationEmail,
  sendOwnerNotification,
} from "../utils/sendEmail.js";

// Timing-safe comparison for Razorpay's HMAC signature.
function isValidSignature(orderId, paymentId, signature) {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const a = Buffer.from(generatedSignature);
  const b = Buffer.from(signature || "");

  // timingSafeEqual throws if lengths differ, so guard that first.
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

export const createOrder = async (req, res) => {
  try {
    const { name, email, phone, size, product } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 79900;

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      name,
      email,
      phone,
      product,
      size,
      amount: amount / 100,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "Pending",
    });

    res.status(200).json({
      ...razorpayOrder,
      orderId: order._id,
    });
  } catch (error) {
   

    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyOrderPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !isValidSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order || order.razorpayOrderId !== razorpay_order_id) {
      return res.status(404).json({
        success: false,
        message: "Order not found or does not match payment.",
      });
    }

    order.paymentStatus = "Paid";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Send customer email
    try {
      await sendConfirmationEmail(order.email, order.name, order);
     
    } catch (err) {
     
    }

    // Send owner email
    try {
      await sendOwnerNotification(order);
    
    } catch (err) {
      
    }

    res.json({
      success: true,
      order,
    });

  } catch (error) {
   

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyPayment = async (req, res) => {
  try {
   

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
    } = req.body;

    

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: "Registration ID is required.",
      });
    }

   

    if (
      !isValidSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    

    const existingRegistration = await Registration.findById(registrationId);

    

    if (!existingRegistration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    if (existingRegistration.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment order does not match this registration.",
      });
    }

    

    if (existingRegistration.paymentStatus === "Paid") {
      

      return res.status(200).json({
        success: true,
        message: "Payment was already verified.",
        registration: existingRegistration,
      });
    }

    if (!existingRegistration.run) {
      return res.status(400).json({
        success: false,
        message: "This registration is not linked to a run.",
      });
    }

    

   const registration = await Registration.findOneAndUpdate(
  {
    _id: registrationId,
    paymentStatus: "Pending",
  },
  {
    paymentStatus: "Paid",
    razorpayPaymentId: razorpay_payment_id,
    emailSent: false,
  },
  {
    new: true,
  }
);

   

    if (!registration) {
      return res.status(200).json({
        success: true,
        message: "Payment was already verified.",
      });
    }

    

    const run = await Run.findByIdAndUpdate(
      registration.run,
      {
        $inc: { registered: 1 },
      },
      {
        new: true,
      }
    );

   

    if (!run) {
      return res.status(404).json({
        success: false,
        message: "The selected run was not found.",
      });
    }

    if (registration.inviteCode) {
      
      await InviteCode.findByIdAndUpdate(
        registration.inviteCode,
        {
          status: "Used",
          usedAt: new Date(),
          usedBy: registration._id,
        }
      );

     
    }

   

    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      registration,
    });
    

    

   try {
  await sendConfirmationEmail(
    registration.email,
    registration.name,
    run
  );
  
} catch (err) {
 
}

  
  } catch (error) {
   
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};