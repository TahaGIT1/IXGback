import express from "express";
import {
  createOrder,
  verifyOrderPayment,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.post("/verify", verifyOrderPayment); // ✅ merch orders → verifyOrderPayment


export default router;