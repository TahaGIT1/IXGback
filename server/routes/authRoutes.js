import express from "express";
import {
  loginAdmin,
  verifyAdmin,
} from "../controllers/authController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

// Verify JWT
router.get("/verify", protectAdmin, verifyAdmin);

export default router;