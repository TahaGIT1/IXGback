import express from "express";
import {
  generateInviteCodes,
  getInviteCodes,
   
} from "../controllers/inviteCodeController.js";

const router = express.Router();

router.post("/generate", generateInviteCodes);

router.get("/:runId", getInviteCodes);


export default router;