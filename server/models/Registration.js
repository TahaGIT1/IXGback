import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    run: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Run",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    inviteCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InviteCode",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    // Stored in rupees. Older registrations may not have this value, so the
    // recovery service falls back to the configured legacy registration price.
    paymentAmount: {
      type: Number,
      min: 0,
    },

    recoveryStatus: {
      type: String,
      enum: ["None", "Identified", "Contacted", "Recovered", "Ignored"],
      default: "None",
      index: true,
    },

    recoveryPriority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
    },

    recoveryScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    recoveryAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastRecoveryAttemptAt: Date,
    recoveredAt: Date,
    recoveryMessage: String,
    recoveryReason: String,

    recoveryMetadata: {
      analyzedAt: Date,
      reason: String,
      recommendedAction: String,
    },

    // 👇 Add it here
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Registration", registrationSchema);
