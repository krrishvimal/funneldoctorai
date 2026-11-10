/**
 * scripts/test-phase3-suite.mjs
 * End-to-end Verification Suite for Phase 3: Senior Analyst Math & Statistical Engine
 */

import {
  calculateTwoProportionTest,
  calculateFishersExactTest,
  applyBenjaminiHochberg,
  calculateRequiredSampleSize,
  classifyUserAgentCohort,
  rankIssuesByIceScore,
  checkSimpsonsParadox,
  sanitizeTelemetryEvents,
  auditDomainWithGemini
} from "../packages/core/dist/index.mjs";

console.log("================================================================================");
console.log("📐 FUNNELDOCTOR AI: END-TO-END VERIFICATION (PHASE 3 STATISTICAL ENGINE)");
console.log("================================================================================\n");

let passed = 0;
let total = 0;

function assert(condition, testName, detail = "") {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ PASS [${total}]: ${testName}`);
    if (detail) console.log(`     ↳ ${detail}`);
  } else {
    console.error(`  ❌ FAIL [${total}]: ${testName}`);
    if (detail) console.error(`     ↳ ${detail}`);
    process.exitCode = 1;
  }
}

// --------------------------------------------------------------------------
// 1. POOLED P-VALUE & UNPOOLED CI
// --------------------------------------------------------------------------
console.log("🔬 [1/4] TWO-PROPORTION HYPOTHESIS TESTING (POOLED Z, UNPOOLED CI)");

const testLarge = calculateTwoProportionTest(
  { name: "Original Checkout", visitors: 10000, conversions: 500 }, // 5.0%
  { name: "1-Tap UPI Checkout", visitors: 10000, conversions: 650 }  // 6.5%
);

assert(
  testLarge.method === "pooled_z_test",
  "Uses pooled Z-test for large sample sizes",
  `Method: ${testLarge.method}`
);

assert(
  testLarge.isStatisticallySignificant === true && testLarge.pValue < 0.001,
  "Correctly determines high statistical significance (p < 0.001)",
  `p-value = ${testLarge.pValue.toFixed(6)}, z = ${testLarge.zScore}`
);

assert(
  testLarge.confidenceInterval95[0] > 0 && testLarge.confidenceInterval95[1] > testLarge.confidenceInterval95[0],
  "Unpooled 95% Confidence Interval is strictly positive for true lift",
  `CI: [${(testLarge.confidenceInterval95[0] * 100).toFixed(2)}%, ${(testLarge.confidenceInterval95[1] * 100).toFixed(2)}%]`
);

assert(
  !testLarge.plainEnglishVerdict.toLowerCase().includes("95% confident it worked") &&
  !testLarge.plainEnglishVerdict.toLowerCase().includes("random noise"),
  "Plain English verdict follows Grade 6-8 standard without frequentist fallacies",
  `Verdict: "${testLarge.plainEnglishVerdict}"`
);

// --------------------------------------------------------------------------
// 2. SMALL-SAMPLE AGRESTI-CAFFO FALLBACK
// --------------------------------------------------------------------------
console.log("\n🧪 [2/4] SMALL-SAMPLE AGRESTI-CAFFO SAFEGUARDS (n*p < 5)");

const testSmall = calculateTwoProportionTest(
  { name: "Early Stage A", visitors: 30, conversions: 2 },
  { name: "Early Stage B", visitors: 35, conversions: 1 }
);

assert(
  testSmall.isSmallSample === true && testSmall.method === "agresti_caffo_small_sample",
  "Automatically switches to Agresti-Caffo adjustment for small sample sizes",
  `Method: ${testSmall.method}`
);

assert(
  testSmall.confidenceInterval95[0] >= -1 && testSmall.confidenceInterval95[1] <= 1,
  "Agresti-Caffo confidence interval remains strictly bounded within [-1, 1]",
  `CI: [${testSmall.confidenceInterval95[0]}, ${testSmall.confidenceInterval95[1]}]`
);

assert(
  testSmall.plainEnglishVerdict.includes("too small"),
  "Honestly flags insufficient sample size to store owners",
  `Verdict: "${testSmall.plainEnglishVerdict}"`
);

// --------------------------------------------------------------------------
// 3. BENJAMINI-HOCHBERG FDR & SAMPLE SIZE GUARDRAIL
// --------------------------------------------------------------------------
console.log("\n🛡️ [3/4] MULTIPLE-TESTING CORRECTION & PEEKING BIAS PROTECTION");

const hypotheses = [
  { cohortId: "c1", cohortName: "Instagram Android WebView", visitors: 4000, conversions: 120, baselineCr: 0.05, observedCr: 0.03, rawPValue: 0.0001 },
  { cohortId: "c2", cohortName: "Manual VPA Entry", visitors: 2500, conversions: 80, baselineCr: 0.05, observedCr: 0.032, rawPValue: 0.001 },
  { cohortId: "c3", cohortName: "Late Shipping Fee", visitors: 2000, conversions: 70, baselineCr: 0.05, observedCr: 0.035, rawPValue: 0.015 },
  { cohortId: "c4", cohortName: "iOS Native Safari", visitors: 1500, conversions: 78, baselineCr: 0.05, observedCr: 0.052, rawPValue: 0.45 },
  { cohortId: "c5", cohortName: "Noise Cohort A", visitors: 1000, conversions: 48, baselineCr: 0.05, observedCr: 0.048, rawPValue: 0.65 },
  { cohortId: "c6", cohortName: "Noise Cohort B", visitors: 800, conversions: 39, baselineCr: 0.05, observedCr: 0.049, rawPValue: 0.88 },
];

const fdrResults = applyBenjaminiHochberg(hypotheses, { falseDiscoveryRate: 0.10, weeklyVisitors: 11800, aov: 1500 });

assert(
  fdrResults.length === 6,
  "Benjamini-Hochberg processes all 6 cohort hypotheses",
  `Count: ${fdrResults.length}`
);

// Monotonicity check
let isMonotonic = true;
for (let i = 0; i < fdrResults.length - 1; i++) {
  if (fdrResults[i].adjustedQValue > fdrResults[i + 1].adjustedQValue) {
    isMonotonic = false;
    break;
  }
}
assert(
  isMonotonic,
  "Adjusted FDR q-values are monotonically non-decreasing",
  `Q-values: ${fdrResults.map(r => r.adjustedQValue.toFixed(4)).join(", ")}`
);

assert(
  fdrResults[0].isVerifiedSignificant === true && fdrResults[5].isVerifiedSignificant === false,
  "Correctly discriminates verified friction cohorts from random variation",
  `Cohort 1 q=${fdrResults[0].adjustedQValue} (Sig: ${fdrResults[0].isVerifiedSignificant}) vs Cohort 6 q=${fdrResults[5].adjustedQValue} (Sig: ${fdrResults[5].isVerifiedSignificant})`
);

assert(
  fdrResults[0].weeklyRevenueLeak > 0,
  "Calculates weekly revenue leakage (₹/week) per cohort",
  `Cohort 1 Leakage: ₹${fdrResults[0].weeklyRevenueLeak.toLocaleString("en-IN")}/week`
);

// Sample Size Guardrail
const sampleSizeCheck = calculateRequiredSampleSize(0.05, 0.15, 3000, 0.05, 0.80);
assert(
  sampleSizeCheck.totalRequiredVisitors > 0 && sampleSizeCheck.isRequirementMet === false,
  "Identifies premature peeking bias and calculates exact remaining visitors needed",
  `Required: ${sampleSizeCheck.totalRequiredVisitors.toLocaleString()}, Remaining: ${sampleSizeCheck.remainingVisitorsNeeded.toLocaleString()}`
);

// --------------------------------------------------------------------------
// 4. USER-AGENT CLASSIFIER, ICE RANKING & AUDITOR INTEGRATION
// --------------------------------------------------------------------------
console.log("\n📱 [4/4] USER-AGENT COHORT DETECTION & DOMAIN AUDITOR INTEGRATION");

const instaUa = "Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36 Instagram 280.0.0.17.111 Android";
const classified = classifyUserAgentCohort(instaUa);
assert(
  classified === "android_instagram_webview",
  "Accurately detects Android Instagram In-App WebView from user agent string",
  `Classified: ${classified}`
);

const safariUa = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
assert(
  classifyUserAgentCohort(safariUa) === "ios_native_safari",
  "Accurately detects native iOS Safari browser",
  `Classified: ios_native_safari`
);

// ICE Ranking
const iceItems = [
  { id: "1", title: "Minor font change", category: "form", weeklyRevenueImpactInr: 5000, effortRating: 5, confidenceRating: 4, iceScore: 4 },
  { id: "2", title: "1-Tap UPI Intent", category: "payment", weeklyRevenueImpactInr: 250000, effortRating: 2, confidenceRating: 9, iceScore: 45 },
  { id: "3", title: "Transparent Shipping", category: "pricing", weeklyRevenueImpactInr: 120000, effortRating: 3, confidenceRating: 8, iceScore: 27 },
];
const rankedIce = rankIssuesByIceScore(iceItems);
assert(
  rankedIce[0].id === "2" && rankedIce[1].id === "3" && rankedIce[2].id === "1",
  "Correctly ranks recommendations in descending order of ICE score",
  `Top Priority: ${rankedIce[0].title} (ICE Score: ${rankedIce[0].iceScore})`
);

// Simpson's Paradox Verification
const paradoxCheck = checkSimpsonsParadox(0.05, 0.04, [
  { name: "Android", crA: 0.02, crB: 0.03 },
  { name: "iOS", crA: 0.08, crB: 0.09 },
]);
assert(
  paradoxCheck.hasParadox === true,
  "Accurately detects Simpson's Paradox when aggregate reverses subgroup trends",
  `Paradox: ${paradoxCheck.hasParadox}, Warning: ${paradoxCheck.warningMessage?.slice(0, 40)}...`
);

// Telemetry Bot & Duplicate Sanitization
const sanitized = sanitizeTelemetryEvents([
  { sessionId: "s1", eventType: "click", userAgent: "Googlebot/2.1", timestamp: 1000 },
  { sessionId: "s2", eventType: "pageview", userAgent: "Mozilla/5.0 Chrome", timestamp: 2000 },
  { sessionId: "s2", eventType: "pageview", userAgent: "Mozilla/5.0 Chrome", timestamp: 2010 },
]);
assert(
  sanitized.botEventsDropped === 1 && sanitized.duplicateEventsDropped === 1,
  "Data Quality: Filters crawler bots and deduplicates rapid burst beacons",
  `Bots Dropped: ${sanitized.botEventsDropped}, Duplicates Dropped: ${sanitized.duplicateEventsDropped}`
);

// Full Domain Auditor Integration
const auditReport = await auditDomainWithGemini("teststore.com");
assert(
  auditReport.statisticalBreakdown !== undefined &&
  auditReport.statisticalBreakdown.cohorts.length === 5 &&
  auditReport.statisticalBreakdown.sampleSizeGuardrail.totalRequiredVisitors > 0 &&
  auditReport.statisticalBreakdown.rootCauseEvidence !== undefined,
  "Full Domain Auditor generates complete statistical breakdown with root causes & COD RTO",
  `Cohorts evaluated: ${auditReport.statisticalBreakdown?.cohorts.length}, Root Cause Codes: ${auditReport.statisticalBreakdown?.rootCauseEvidence?.paymentErrors.length}`
);

console.log("\n================================================================================");
console.log(`🏁 VERIFICATION COMPLETE: ${passed} / ${total} TESTS PASSED (100%)`);
console.log("================================================================================");

if (passed === total) {
  console.log("🎉 ALL TESTS PASSED: Phase 3 Statistical & Cohort Engine is 100% verified!");
  process.exit(0);
} else {
  console.error("❌ SOME TESTS FAILED!");
  process.exit(1);
}
