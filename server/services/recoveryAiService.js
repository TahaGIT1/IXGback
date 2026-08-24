import axios from "axios";

const ALLOWED_PRIORITIES = new Set(["HIGH", "MEDIUM", "LOW"]);

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function parseRecoveryAiResponse(content) {
  let parsed;

  try {
    const json = String(content || "")
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "");
    parsed = JSON.parse(json);
  } catch {
    throw new Error("AI returned an invalid recovery recommendation.");
  }

  const priority = String(parsed.priority || "").toUpperCase();
  const score = Number(parsed.score);
  const reason = cleanText(parsed.reason, 500);
  const recommendedAction = cleanText(parsed.recommendedAction, 300);
  const message = cleanText(parsed.message, 1200);

  if (!ALLOWED_PRIORITIES.has(priority) || !Number.isFinite(score) || score < 0 || score > 100 || !reason || !recommendedAction || !message) {
    throw new Error("AI response did not match the required recovery format.");
  }

  return { priority, score: Math.round(score), reason, recommendedAction, message };
}

export function buildFallbackRecommendation(context) {
  const score = Math.min(95, Math.max(20, 78 - context.recoveryAttempts * 12 + (context.runOpen ? 8 : -20)));
  const priority = score >= 70 ? "HIGH" : score >= 45 ? "MEDIUM" : "LOW";
  const runName = context.runTitle || "the IXG Run";

  return {
    priority,
    score,
    reason: context.runOpen
      ? "The payment is still pending and registration for this run is open."
      : "The payment remains pending, but the run is no longer open.",
    recommendedAction: context.runOpen
      ? "Send a friendly reminder now."
      : "Review manually before contacting this runner.",
    message: `Hey ${context.firstName} 👋\n\nLooks like your registration for ${runName} wasn't completed. Your details are saved, but payment is still pending.\n\nReturn to the IXG Run Club registration page to complete your ₹${context.amount} payment and confirm your spot.\n\nSee you at the run! 🏃`,
  };
}

export async function generateRecoveryRecommendation(context) {
  if (!process.env.AI_API_KEY) {
    return buildFallbackRecommendation(context);
  }

  const endpoint = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const prompt = {
    registrationAgeMinutes: context.registrationAgeMinutes,
    amount: context.amount,
    runTitle: context.runTitle,
    runDate: context.runDate,
    runTime: context.runTime,
    runOpen: context.runOpen,
    recoveryAttempts: context.recoveryAttempts,
    hasPreviouslyPaid: context.hasPreviouslyPaid,
    firstName: context.firstName,
  };

  const response = await axios.post(
    endpoint,
    {
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a revenue recovery assistant for a running club. Return only JSON with priority (HIGH, MEDIUM, LOW), score (0-100), reason, recommendedAction, and a friendly non-spammy message. Never claim payment failed, invent discounts, payment links, or payment confirmation.",
        },
        { role: "user", content: JSON.stringify(prompt) },
      ],
    },
    {
      headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` },
      timeout: 15000,
    }
  );

  return parseRecoveryAiResponse(response.data?.choices?.[0]?.message?.content);
}
