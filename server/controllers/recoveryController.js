import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import RecoveryAttempt from "../models/RecoveryAttempt.js";
import { sendRecoveryEmail } from "../utils/sendEmail.js";
import { generateRecoveryRecommendation } from "../services/recoveryAiService.js";
import { getRecoveryCandidates, getRecoveryAnalytics, getRegistrationAmount, isRecoveryEligible } from "../services/recoveryService.js";

const serializeCandidate = (registration) => ({
  _id: registration._id,
  name: registration.name,
  email: registration.email,
  amount: getRegistrationAmount(registration),
  createdAt: registration.createdAt,
  paymentAgeMinutes: Math.floor((Date.now() - new Date(registration.createdAt).getTime()) / 60000),
  run: registration.run,
  recoveryStatus: registration.recoveryStatus,
  recoveryPriority: registration.recoveryPriority,
  recoveryScore: registration.recoveryScore,
  recoveryReason: registration.recoveryReason,
  recoveryMessage: registration.recoveryMessage,
  recoveryMetadata: registration.recoveryMetadata,
  recoveryAttempts: registration.recoveryAttempts || 0,
});

function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function findRegistration(id) {
  return Registration.findById(id).populate("run", "title date time location registrationOpen");
}

async function analyzeRegistration(registration) {
  if (!registration || registration.paymentStatus !== "Pending" || !isRecoveryEligible(registration)) {
    const error = new Error("This registration is not an eligible pending payment.");
    error.status = 400;
    throw error;
  }
  const hasPreviouslyPaid = await Registration.exists({
    _id: { $ne: registration._id }, run: registration.run._id, paymentStatus: "Paid",
    $or: [{ email: registration.email }, { phone: registration.phone }],
  });
  const result = await generateRecoveryRecommendation({
    registrationAgeMinutes: Math.floor((Date.now() - new Date(registration.createdAt).getTime()) / 60000),
    amount: getRegistrationAmount(registration),
    runTitle: registration.run?.title,
    runDate: registration.run?.date,
    runTime: registration.run?.time,
    runOpen: Boolean(registration.run?.registrationOpen),
    recoveryAttempts: registration.recoveryAttempts || 0,
    hasPreviouslyPaid: Boolean(hasPreviouslyPaid),
    firstName: registration.name.split(" ")[0],
  });
  registration.recoveryPriority = result.priority;
  registration.recoveryScore = result.score;
  registration.recoveryReason = result.reason;
  registration.recoveryMessage = result.message;
  registration.recoveryStatus = "Identified";
  registration.recoveryMetadata = { analyzedAt: new Date(), reason: result.reason, recommendedAction: result.recommendedAction };
  await registration.save();
  return registration;
}

export const getRecoveryDashboard = async (req, res) => {
  try {
    const candidates = await getRecoveryCandidates();
    res.json({ metrics: await getRecoveryAnalytics(candidates), candidates: candidates.map(serializeCandidate) });
  } catch {
    res.status(500).json({ message: "Could not load recovery data." });
  }
};

export const getRecoveryDetail = async (req, res) => {
  try {
    if (!validId(req.params.registrationId)) return res.status(400).json({ message: "Invalid registration ID." });
    const registration = await findRegistration(req.params.registrationId);
    if (!registration) return res.status(404).json({ message: "Registration not found." });
    const attempts = await RecoveryAttempt.find({ registration: registration._id }).sort({ createdAt: -1 });
    res.json({ registration: serializeCandidate(registration), attempts });
  } catch {
    res.status(500).json({ message: "Could not load recovery details." });
  }
};

export const analyzeOne = async (req, res) => {
  try {
    if (!validId(req.params.registrationId)) return res.status(400).json({ message: "Invalid registration ID." });
    const registration = await analyzeRegistration(await findRegistration(req.params.registrationId));
    res.json({ registration: serializeCandidate(registration) });
  } catch (error) {
    res.status(error.status || 502).json({ message: error.message || "AI analysis failed. Payment remains operational." });
  }
};

export const analyzeAll = async (req, res) => {
  try {
    const candidates = await getRecoveryCandidates();
    const results = await Promise.allSettled(candidates.map((candidate) => analyzeRegistration(candidate)));
    const analyzed = results.filter((result) => result.status === "fulfilled").length;
    const failed = results.length - analyzed;
    res.json({ analyzed, failed, message: `Analyzed ${analyzed} eligible payment${analyzed === 1 ? "" : "s"}.` });
  } catch {
    res.status(502).json({ message: "AI analysis failed. Payment remains operational." });
  }
};

export const regenerate = analyzeOne;

export const sendRecovery = async (req, res) => {
  try {
    if (!validId(req.params.registrationId)) return res.status(400).json({ message: "Invalid registration ID." });
    const registration = await findRegistration(req.params.registrationId);
    if (!registration || registration.paymentStatus !== "Pending") return res.status(400).json({ message: "This payment is no longer pending." });
    if (registration.recoveryStatus === "Contacted") return res.status(409).json({ message: "A recovery email has already been sent for this payment." });
    if (!registration.recoveryMessage || !registration.recoveryPriority) return res.status(400).json({ message: "Analyze this payment before sending a recovery email." });
    await sendRecoveryEmail(registration, registration.run);
    const sentAt = new Date();
    registration.recoveryStatus = "Contacted";
    registration.recoveryAttempts = (registration.recoveryAttempts || 0) + 1;
    registration.lastRecoveryAttemptAt = sentAt;
    await registration.save();
    await RecoveryAttempt.create({ registration: registration._id, message: registration.recoveryMessage, sentAt, aiScore: registration.recoveryScore, aiReason: registration.recoveryReason });
    res.json({ message: "Recovery email sent.", registration: serializeCandidate(registration) });
  } catch {
    res.status(502).json({ message: "Could not send recovery email." });
  }
};

export const ignoreRecovery = async (req, res) => {
  try {
    if (!validId(req.params.registrationId)) return res.status(400).json({ message: "Invalid registration ID." });
    const registration = await Registration.findById(req.params.registrationId);
    if (!registration || registration.paymentStatus !== "Pending") return res.status(400).json({ message: "This payment is no longer pending." });
    registration.recoveryStatus = "Ignored";
    await registration.save();
    res.json({ message: "Recovery candidate ignored." });
  } catch {
    res.status(500).json({ message: "Could not ignore recovery candidate." });
  }
};
