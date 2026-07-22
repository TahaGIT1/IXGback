import mongoose from "mongoose";

const inviteCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

   runId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Run",
  required: true,
  index: true,
},
    status: {
  type: String,
  enum: ["Available", "Used"],
  default: "Available",
},

    usedAt: {
      type: Date,
    },

    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
  },
  {
    timestamps: true,
  }
);
const InviteCode = mongoose.model("InviteCode", inviteCodeSchema);

export default InviteCode;