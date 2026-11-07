import { GoogleGenerativeAI } from "@google/generative-ai";
import { CRO_HEURISTICS_GUIDELINES, generateSyntheticFindings } from "./heuristics.js";
import { AuditFinding, FunnelAnalysisResult, RCAReport, StepScreenshot } from "./types.js";

export interface AuditOptions {
  apiKey?: string;
  projectUrl?: string;
  modelName?: string;
}

export async function runFunnelAudit(
  metrics: FunnelAnalysisResult,
  screenshots: StepScreenshot[] = [],
  options: AuditOptions = {}
): Promise<RCAReport> {
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
  const modelName = options.modelName || process.env.GEMINI_MODEL || "gemini-3.5-flash";

  if (!apiKey) {
    // Deterministic fallback mode (ideal for unit testing, offline CI/CD, and demo without keys)
    const findings = generateSyntheticFindings(metrics, screenshots);
    return {
      projectUrl: options.projectUrl,
      generatedAt: new Date().toISOString(),
      executiveSummary: `Funnel analysis evaluated ${metrics.steps.length} sequential stages with ${metrics.totalInitialVisitors.toLocaleString()} initial sessions. The overall conversion rate is ${(metrics.overallConversionRate * 100).toFixed(2)}%. The primary bottleneck occurs at "${metrics.biggestDropStep.name}", accounting for a loss of ${metrics.biggestDropStep.dropoffCount.toLocaleString()} potential customers (${(metrics.biggestDropStep.dropoffRate * 100).toFixed(1)}% drop-off).`,
      funnelMetrics: metrics,
      findings,
      generatedPRD: generateStandardPRD(metrics, findings),
      redesignCodeSuggestion: findings[0]?.recommendedCodeDiff,
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const promptText = `
${CRO_HEURISTICS_GUIDELINES}

Analyze the following quantitative conversion funnel data alongside the attached UI screenshots:

FUNNEL METRICS:
${JSON.stringify(metrics, null, 2)}

TASK:
1. Cross-reference visual bottlenecks in the screenshots with the quantitative drop-off data.
2. Return a strict JSON object with the following fields:
{
  "executiveSummary": "A concise executive briefing (2-3 paragraphs) explaining the macro funnel health and the primary root cause.",
  "findings": [
    {
      "id": "finding-1",
      "stepName": "string",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "category": "clarity" | "cognitive_load" | "trust_and_security" | "fitts_law_and_touch" | "hidden_costs_and_pricing" | "form_friction",
      "headline": "string",
      "explanation": "Detailed root cause linking the visual element to the numbers",
      "visualElementSelector": "css selector or descriptive element name",
      "dropoffContributionEstPercent": number,
      "actionableFix": "Concrete engineering/design fix",
      "recommendedCodeDiff": "Clean JSX/HTML/Tailwind snippet fixing the issue"
    }
  ],
  "generatedPRD": "A complete, production-ready Markdown Product Requirements Document (PRD) detailing problem statement, user stories, acceptance criteria, and measurement metrics.",
  "redesignCodeSuggestion": "A complete, self-contained Next.js / Tailwind CSS component rewriting the worst-performing step."
}
`;

  const contents: any[] = [promptText];

  for (const shot of screenshots) {
    if (shot.base64Data) {
      contents.push({
        inlineData: {
          mimeType: shot.mimeType || "image/png",
          data: shot.base64Data,
        },
      });
    }
  }

  try {
    const result = await model.generateContent(contents);
    const text = result.response.text() || "{}";
    const parsed = JSON.parse(text);

    return {
      projectUrl: options.projectUrl,
      generatedAt: new Date().toISOString(),
      executiveSummary: parsed.executiveSummary || "Analysis completed.",
      funnelMetrics: metrics,
      findings: parsed.findings || generateSyntheticFindings(metrics, screenshots),
      generatedPRD: parsed.generatedPRD || generateStandardPRD(metrics, []),
      redesignCodeSuggestion: parsed.redesignCodeSuggestion,
    };
  } catch (error) {
    console.warn("Gemini API call encountered an error. Falling back to heuristic engine:", error);
    const findings = generateSyntheticFindings(metrics, screenshots);
    return {
      projectUrl: options.projectUrl,
      generatedAt: new Date().toISOString(),
      executiveSummary: `Fallback audit: Bottleneck detected at "${metrics.biggestDropStep.name}".`,
      funnelMetrics: metrics,
      findings,
      generatedPRD: generateStandardPRD(metrics, findings),
      redesignCodeSuggestion: findings[0]?.recommendedCodeDiff,
    };
  }
}

function generateStandardPRD(metrics: FunnelAnalysisResult, findings: AuditFinding[]): string {
  const worst = metrics.biggestDropStep;
  return `# Product Requirements Document (PRD): ${worst.name} Conversion Optimization

## 1. Executive Summary & Problem Statement
Currently, the conversion funnel experiences an acute drop-off at **${worst.name}**, where **${(worst.dropoffRate * 100).toFixed(1)}%** of users abandon the journey (${worst.dropoffCount.toLocaleString()} lost users). This PRD outlines UX interventions to recover lost conversion revenue.

## 2. Quantitative Baseline & Target Metrics
- **Current Baseline Funnel Conversion:** ${(metrics.overallConversionRate * 100).toFixed(2)}%
- **Current ${worst.name} Drop-off Rate:** ${(worst.dropoffRate * 100).toFixed(1)}%
- **Target Objective:** Reduce drop-off at ${worst.name} by at least **25%** within 14 days of deployment.

## 3. High-Priority User Stories
- **US-1 (Mobile Ergonomics):** As a mobile shopper, I want a sticky, persistent one-click checkout button so I don't have to scroll through clutter to purchase.
- **US-2 (Trust Assurance):** As a first-time buyer, I want explicit security and guarantee badges visible before entering payment information.

## 4. Acceptance Criteria
- [ ] Primary CTA adheres to 48x48px minimum touch target size.
- [ ] Cart total, shipping, and tax breakdowns are explicitly calculated without hidden surcharges.
- [ ] Integrated Apple Pay / Google Pay express buttons.
- [ ] Verified A/B test setup tracking event: \`checkout_cta_clicked\`.
`;
}
