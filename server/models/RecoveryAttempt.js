import mongoose from "mongoose";

const recoveryAttemptSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      index: true,
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["Sent", "Recovered"],
      default: "Sent",
      index: true,
    },
    sentAt: { type: Date, default: Date.now },
    respondedAt: Date,
    recoveredAt: Date,
    aiScore: { type: Number, min: 0, max: 100 },
    aiReason: String,
  },
  { timestamps: true }
);

export default mongoose.model("RecoveryAttempt", recoveryAttemptSchema);
