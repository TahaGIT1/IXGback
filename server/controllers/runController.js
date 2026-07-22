import Run from "../models/Run.js";
import Registration from "../models/Registration.js";

// GET all runs
const getRuns = async (req, res) => {
  try {
    const runs = await Run.find().sort({ createdAt: -1 });
    res.status(200).json(runs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new run
const createRun = async (req, res) => {
  try {
    const run = await Run.create(req.body);
    res.status(201).json(run);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a run and every registration belonging to it
export const deleteRun = async (req, res) => {
  try {
    const run = await Run.findById(req.params.id);

    if (!run) {
      return res.status(404).json({
        message: "Run not found",
      });
    }

    await Registration.deleteMany({ run: run._id });
    await Run.findByIdAndDelete(run._id);

    res.status(200).json({
      message: "Run and its registrations deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateRun = async (req, res) => {
  try {
    const run = await Run.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!run) {
      return res.status(404).json({
        message: "Run not found",
      });
    }

    res.status(200).json(run);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { getRuns, createRun };