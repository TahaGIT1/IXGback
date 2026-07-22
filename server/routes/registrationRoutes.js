import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
  registerRunner,
  getRegistrations,
  deleteRegistration,
} from "../controllers/registrationController.js";
import { verifyPayment } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", protectAdmin, getRegistrations);

router.post("/", registerRunner);

router.post("/verify", verifyPayment); 

router.delete("/:id", protectAdmin, deleteRegistration);

export default router;