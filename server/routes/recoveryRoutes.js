import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { analyzeAll, analyzeOne, getRecoveryDashboard, getRecoveryDetail, ignoreRecovery, regenerate, sendRecovery } from "../controllers/recoveryController.js";

const router = express.Router();
router.use(protectAdmin);
router.get("/", getRecoveryDashboard);
router.post("/analyze-all", analyzeAll);
router.post("/:registrationId/analyze", analyzeOne);
router.post("/:registrationId/regenerate", regenerate);
router.post("/:registrationId/send", sendRecovery);
router.post("/:registrationId/ignore", ignoreRecovery);
router.get("/:registrationId", getRecoveryDetail);
export default router;
