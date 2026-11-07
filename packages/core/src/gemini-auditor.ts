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
  const projectUrl = options.projectUrl || "Unknown URL";

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

  const promptText = `
${CRO_HEURISTICS_GUIDELINES}

TARGET DOMAIN / URL: "${projectUrl}"

FUNNEL TELEMETRY METRICS:
${JSON.stringify(metrics, null, 2)}

TASK:
1. Determine the true business archetype of "${projectUrl}" (e.g. Consumer Social Network, B2B SaaS, D2C Fashion, Fintech).
2. DOMAIN-TELEMETRY CONSISTENCY CHECK: Check if the provided sequential funnel steps logically match the nature of "${projectUrl}".
   - If there is a semantic conflict (e.g. retail checkout stages like "Storefront Home" or "Added to Cart" provided for Instagram, Linear, or GitHub):
     Explicitly clarify this in the executiveSummary: State whether this data represents an isolated sub-product (like "Instagram Shop / Social Commerce Storefront") or if the provided CSV stages conflict with the core platform.
3. Cross-reference visual bottlenecks in the screenshots (if attached) with the quantitative drop-off data.
4. Return a strict JSON object with the following fields:
{
  "executiveSummary": "A concise executive briefing explaining the macro funnel health, domain alignment, and primary root cause.",
  "findings": [
    {
      "id": "finding-1",
      "stepName": "string",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "category": "clarity" | "cognitive_load" | "trust_and_security" | "fitts_law_and_touch" | "hidden_costs_and_pricing" | "form_friction",
      "headline": "string",
      "explanation": "Detailed root cause linking the step to user dropoff",
      "visualElementSelector": "css selector or descriptive element name",
      "dropoffContributionEstPercent": number,
      "actionableFix": "Concrete engineering/design fix",
      "recommendedCodeDiff": "Clean JSX/HTML/Tailwind snippet fixing the issue"
    }
  ],
  "generatedPRD": "A complete, production-ready Markdown Product Requirements Document (PRD).",
  "redesignCodeSuggestion": "A complete, self-contained Next.js / Tailwind CSS component rewriting the worst-performing step."
}
`;

  const candidateModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-lite-latest"];

  for (const modelName of candidateModels) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

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
      console.warn(`Gemini model ${modelName} failed, trying next candidate:`, error);
    }
  }

  // Fallback if all models fail
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
