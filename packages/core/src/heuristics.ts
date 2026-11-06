import { AuditFinding, FunnelAnalysisResult, StepScreenshot } from "./types.js";

export const CRO_HEURISTICS_GUIDELINES = `
You are FunnelDoctor AI, an elite Product Manager, Lead UX Researcher, and Conversion Rate Optimization (CRO) expert.
You diagnose why users drop off in digital conversion funnels by marrying quantitative event analytics with visual UI inspection.

When inspecting user funnels and UI screenshots, evaluate:
1. CLARITY & VALUE PROPOSITION:
   - Does the page communicate what the user gets within 3 seconds?
   - Is the primary Call-To-Action (CTA) visually distinct from secondary actions?

2. COGNITIVE LOAD & VISUAL HIERARCHY:
   - Are there too many competing focal points, popups, or banner distractions?
   - Does visual clutter drown out the core path to purchase/signup?

3. FITTS'S LAW & MOBILE ERGONOMICS:
   - Are touch targets on mobile at least 48x48px with adequate padding?
   - Is the primary action placed in the thumb-accessible bottom third of the screen?

4. TRUST, SECURITY & ANXIETY:
   - Are security badges, accepted payment icons, return policies, and customer reviews visible before asking for sensitive card info?
   - Is there a sudden surprise cost (hidden shipping fees, uncalculated taxes) causing shock drop-offs?

5. FORM FRICTION:
   - Does the form ask for unnecessary fields?
   - Are inline validation and autofill supported?
`;

export function generateSyntheticFindings(
  metrics: FunnelAnalysisResult,
  screenshots: StepScreenshot[]
): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const worstStep = metrics.biggestDropStep;

  findings.push({
    id: "finding-1",
    stepName: worstStep.name,
    severity: "CRITICAL",
    category: "fitts_law_and_touch",
    headline: `Major drop-off detected at ${worstStep.name} (${(worstStep.dropoffRate * 100).toFixed(1)}% drop-off)`,
    explanation: `Users are abandoning the funnel at the highest velocity right after ${worstStep.name}. Visual review indicates lack of a sticky primary CTA on mobile devices and high visual friction competing with the main checkout action.`,
    visualElementSelector: "button[type='submit'], .checkout-action-container",
    dropoffContributionEstPercent: Math.round(worstStep.dropoffRate * 50),
    actionableFix: `Implement a high-contrast sticky bottom CTA bar on mobile viewports with Apple Pay / Google Pay 1-click Express Checkout.`,
    recommendedCodeDiff: `// Sticky Mobile CTA implementation
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-slate-200 z-50 flex items-center justify-between">
  <div>
    <p className="text-xs text-slate-500">Total Due</p>
    <p className="text-lg font-bold text-slate-900">$49.00</p>
  </div>
  <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all active:scale-95">
    Express Checkout ⚡
  </button>
</div>`,
  });

  findings.push({
    id: "finding-2",
    stepName: worstStep.name,
    severity: "HIGH",
    category: "trust_and_security",
    headline: "Absence of Visible Trust Signals Prior to Payment Commitment",
    explanation:
      "Users on this step are presented with price commitment before reassurance. Adding SSL badges, money-back guarantees, and secure payment icons directly below the payment button directly reduces final-step cart abandonment.",
    visualElementSelector: ".payment-form, .security-badges",
    dropoffContributionEstPercent: 25,
    actionableFix: "Embed trusted payment badges (Stripe, Visa, Mastercard) and a 30-day money-back guarantee banner within 100px of the primary CTA.",
  });

  return findings;
}
