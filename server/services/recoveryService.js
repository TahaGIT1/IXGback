import Registration from "../models/Registration.js";
import RecoveryAttempt from "../models/RecoveryAttempt.js";

export const getRegistrationAmount = (registration) => Number(registration.paymentAmount ?? process.env.RUN_REGISTRATION_AMOUNT ?? 1);
export const getRecoveryMinAgeMinutes = () => Math.max(1, Number(process.env.RECOVERY_MIN_AGE_MINUTES || 30));

export function isRecoveryEligible(registration, now = new Date()) {
  return registration.paymentStatus === "Pending" &&
    !["Ignored", "Recovered"].includes(registration.recoveryStatus || "None") &&
    now.getTime() - new Date(registration.createdAt).getTime() >= getRecoveryMinAgeMinutes() * 60 * 1000;
}

// One latest pending attempt per run + normalized email/phone is shown. This avoids
// inflating at-risk revenue from historic checkout retries without merging records.
export function deduplicateRecoveryCandidates(registrations) {
  const candidates = new Map();
  for (const registration of registrations) {
    const runId = String(registration.run?._id || registration.run);
    const email = String(registration.email || "").trim().toLowerCase();
    const phone = String(registration.phone || "").replace(/\D/g, "");
    const key = `${runId}:${email || phone}`;
    const existing = candidates.get(key);
    if (!existing || new Date(registration.createdAt) > new Date(existing.createdAt)) candidates.set(key, registration);
  }
  return [...candidates.values()];
}

export async function getRecoveryCandidates() {
  const pending = await Registration.find({ paymentStatus: "Pending" })
    .populate("run", "title date time location registrationOpen")
    .sort({ createdAt: -1 });
  const eligible = deduplicateRecoveryCandidates(pending.filter((item) => isRecoveryEligible(item)));

  // A paid registration for the same runner and run removes the stale pending retry
  // from analytics; records are kept untouched for auditability.
  const paid = await Registration.find({ paymentStatus: "Paid" }).select("run email phone");
  const paidKeys = new Set(paid.flatMap((item) => {
    const runId = String(item.run);
    return [`${runId}:${String(item.email || "").trim().toLowerCase()}`, `${runId}:${String(item.phone || "").replace(/\D/g, "")}`];
  }));
  return eligible.filter((item) => {
    const runId = String(item.run?._id || item.run);
    return !paidKeys.has(`${runId}:${String(item.email || "").trim().toLowerCase()}`) && !paidKeys.has(`${runId}:${String(item.phone || "").replace(/\D/g, "")}`);
  });
}

export function buildRecoveryMetrics(candidates, attempts, recovered) {
  const revenueRecovered = recovered.reduce((sum, item) => sum + getRegistrationAmount(item), 0);
  return {
    totalPendingPayments: candidates.length,
    revenueAtRisk: candidates.reduce((sum, item) => sum + getRegistrationAmount(item), 0),
    recoveryAttempts: attempts,
    recoveredPayments: recovered.length,
    revenueRecovered,
    recoveryRate: attempts ? Number(((recovered.length / attempts) * 100).toFixed(1)) : 0,
  };
}

export async function getRecoveryAnalytics(candidates) {
  const [attempts, recovered] = await Promise.all([
    RecoveryAttempt.countDocuments({ status: { $in: ["Sent", "Recovered"] } }),
    Registration.find({ paymentStatus: "Paid", recoveryStatus: "Recovered" }),
  ]);
  return buildRecoveryMetrics(candidates, attempts, recovered);
}

export async function markRecoveryAsPaid(registration) {
  if (!registration || ["None", "Ignored", "Recovered"].includes(registration.recoveryStatus)) return;
  const now = new Date();
  await Registration.updateOne({ _id: registration._id, recoveryStatus: { $ne: "Recovered" } }, { recoveryStatus: "Recovered", recoveredAt: now });
  await RecoveryAttempt.updateMany(
    { registration: registration._id, status: "Sent" },
    { status: "Recovered", recoveredAt: now, respondedAt: now }
  );
}
