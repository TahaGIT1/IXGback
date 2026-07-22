import mongoose from "mongoose";

const runSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      required: true,
      trim: true,
    },
    registered: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Must be Boolean — never String.
    registrationOpen: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Run", runSchema);