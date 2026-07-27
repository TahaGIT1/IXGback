import InviteCode from "../models/InviteCode.js";
import crypto from "crypto";

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 10;

const generateCode = () => {
  let code = "IXG-";

  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS.charAt(crypto.randomInt(0, CODE_CHARS.length));
  }

  return code;
};

// Generate random invite codes (additive — never deletes existing codes)
export const generateInviteCodes = async (req, res) => {
  try {
    const { runId, quantity } = req.body;

    if (!runId) {
      return res.status(400).json({
        message: "Run ID is required.",
      });
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1 || qty > 500) {
      return res.status(400).json({
        message: "Quantity must be a whole number between 1 and 500.",
      });
    }

    const inviteCodes = [];

    for (let i = 0; i < qty; i++) {
      let code;
      let exists = true;

      while (exists) {
        code = generateCode();
        exists = await InviteCode.findOne({ code });
      }

      inviteCodes.push({
        code,
        runId,
      });
    }

    await InviteCode.insertMany(inviteCodes);

    res.status(201).json({
      success: true,
      message: `${qty} invite codes generated.`,
    });
  } catch (error) {
   

    res.status(500).json({
      message: error.message,
    });
  }
};



// Get all invite codes for a run
export const getInviteCodes = async (req, res) => {
  try {
    const { runId } = req.params;

    const codes = await InviteCode.find({ runId }).sort({ createdAt: -1 });

    res.status(200).json(codes);
  } catch (error) {
    

    res.status(500).json({
      message: error.message,
    });
  }
};