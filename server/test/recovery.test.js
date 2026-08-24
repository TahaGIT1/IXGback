import test from "node:test";
import assert from "node:assert/strict";
import { parseRecoveryAiResponse } from "../services/recoveryAiService.js";
import { buildRecoveryMetrics, deduplicateRecoveryCandidates, isRecoveryEligible } from "../services/recoveryService.js";

test("AI recovery response follows the strict supported structure", () => {
  const parsed = parseRecoveryAiResponse('{"priority":"HIGH","score":87,"reason":"Recent","recommendedAction":"Send now","message":"Hello"}');
  assert.equal(parsed.priority, "HIGH");
  assert.equal(parsed.score, 87);
  assert.throws(() => parseRecoveryAiResponse('{"priority":"URGENT"}'));
});

test("old pending payments are eligible while paid and new records are not", () => {
  const now = new Date();
  assert.equal(isRecoveryEligible({ paymentStatus: "Pending", createdAt: new Date(now - 31 * 60000), recoveryStatus: "None" }, now), true);
  assert.equal(isRecoveryEligible({ paymentStatus: "Paid", createdAt: new Date(now - 60 * 60000) }, now), false);
  assert.equal(isRecoveryEligible({ paymentStatus: "Pending", createdAt: now }, now), false);
});

test("duplicate checkout retries retain the latest candidate per runner and run", () => {
  const records = [
    { _id: "old", run: "run1", email: "A@Example.com", phone: "9999999999", createdAt: new Date("2020-01-01") },
    { _id: "new", run: "run1", email: "a@example.com", phone: "9999999999", createdAt: new Date("2020-01-02") },
  ];
  assert.deepEqual(deduplicateRecoveryCandidates(records).map((item) => item._id), ["new"]);
});

test("metrics use payment amounts and handle zero attempts without division errors", () => {
  const metrics = buildRecoveryMetrics([{ paymentAmount: 100 }], 0, []);
  assert.equal(metrics.revenueAtRisk, 100);
  assert.equal(metrics.recoveryRate, 0);
  const recovered = buildRecoveryMetrics([], 2, [{ paymentAmount: 100 }, { paymentAmount: 50 }]);
  assert.equal(recovered.revenueRecovered, 150);
  assert.equal(recovered.recoveryRate, 100);
});
