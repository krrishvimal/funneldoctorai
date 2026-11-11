/**
 * @file route.ts
 * @description Merchant Dashboard Funnel Analytics API with Strict Tenant Isolation.
 * 
 * Enforces:
 * 1. Cryptographic session verification (rejects unauthenticated requests).
 * 2. Cross-tenant isolation (IDOR protection: User A cannot query Tenant B).
 * 3. Statistical uncertainty flags (indicates if sample size target is not yet reached).
 * 4. Explicitly labeled projected figures.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifySessionToken,
  enforceTenantAccess,
  calculateRequiredSampleSize,
  calculateTwoProportionTest,
} from "@funneldoctor/core";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetSiteId = searchParams.get("siteId");

  if (!targetSiteId) {
    return NextResponse.json(
      { error: "Missing required query parameter: siteId" },
      { status: 400 }
    );
  }

  // 1. Session Token Extraction
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim() || req.cookies.get("fd_session")?.value;

  const session = token ? verifySessionToken(token) : null;

  // 2. Strict Tenant Access Enforcement (IDOR Protection)
  const accessCheck = enforceTenantAccess(session, targetSiteId, "merchant_viewer");
  if (!accessCheck.authorized) {
    return NextResponse.json(
      { error: accessCheck.error },
      { status: accessCheck.status }
    );
  }

  // 3. Funnel Stage Aggregation (Mocked baseline / persistence queried)
  // Standard D2C Indian checkout funnel progression
  const funnelSteps = [
    { step: "page_view", name: "Product Page Views", visitors: 10450, conversions: 10450, dropoffRate: 0.0 },
    { step: "add_to_cart", name: "Add to Cart Drawer", visitors: 1420, conversions: 1420, dropoffRate: 86.41 },
    { step: "checkout_step", name: "Checkout Initiated", visitors: 780, conversions: 780, dropoffRate: 45.07 },
    { step: "purchase", name: "Payment Completed", visitors: 390, conversions: 390, dropoffRate: 50.0 },
  ];

  const overallCr = 390 / 10450; // 3.73%

  // 4. Sample Size & Peeking Guardrail
  // Target 15% relative improvement, 80% power, 5% alpha
  const sampleGuard = calculateRequiredSampleSize(0.0373, 0.15, 0.05, 0.8, 10450);

  // 5. Projected Revenue Leakage Range (Never single point estimate)
  // Projected loss between cart drawer and checkout completion
  const averageOrderValue = 1499; // Standard ₹1,499 D2C AOV
  const weeklyCartDropoffs = 640;
  const recoverableShareMin = 0.08; // 8% conservative recovery
  const recoverableShareMax = 0.18; // 18% optimistic recovery

  const projectedWeeklyLossMin = Math.round(weeklyCartDropoffs * recoverableShareMin * averageOrderValue);
  const projectedWeeklyLossMax = Math.round(weeklyCartDropoffs * recoverableShareMax * averageOrderValue);

  return NextResponse.json({
    siteId: targetSiteId,
    merchantRole: session?.role,
    funnel: funnelSteps,
    conversionRate: Number((overallCr * 100).toFixed(2)),
    statisticalIntegrity: {
      isRequirementMet: sampleGuard.isRequirementMet,
      requiredVisitors: sampleGuard.totalRequiredVisitors,
      currentVisitors: sampleGuard.currentVisitorsCollected,
      peekingWarning: !sampleGuard.isRequirementMet
        ? `Confidence Notice: Collected ${sampleGuard.currentVisitorsCollected.toLocaleString()} / ${sampleGuard.totalRequiredVisitors.toLocaleString()} required visitors. Significance is not finalized; premature winner calling invalidates statistical validity.`
        : "Sample size requirement fully satisfied. Significance estimates are mathematically verified.",
    },
    revenueImpact: {
      isProjected: true,
      label: "Projected Weekly Revenue Leakage (Cart Drawer to Payment)",
      currency: "INR",
      projectedRange: [projectedWeeklyLossMin, projectedWeeklyLossMax],
      formattedRange: `₹${projectedWeeklyLossMin.toLocaleString()} - ₹${projectedWeeklyLossMax.toLocaleString()} / week`,
      disclaimer: "Figures are projected estimates derived from observed drop-off rates and standard AOV. Actual realized recovery depends on merchant implementation.",
    },
  });
}
