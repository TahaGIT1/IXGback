import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";

import {
  getRuns,
  createRun,
  deleteRun,
  updateRun,
} from "../controllers/runController.js";

const router = express.Router();

router.get("/", getRuns);
router.post("/", protectAdmin, createRun);
router.put("/:id", protectAdmin, updateRun);
router.delete("/:id", protectAdmin, deleteRun);

export default router;