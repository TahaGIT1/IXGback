import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
  registerRunner,
  getRegistrations,
  deleteRegistration,
} from "../controllers/registrationController.js";

const router = express.Router();

router.get("/", protectAdmin, getRegistrations);

router.post("/", registerRunner);

router.delete("/:id", protectAdmin, deleteRegistration);

export default router;
