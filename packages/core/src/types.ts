import { z } from "zod";

export const FunnelStepSchema = z.object({
  name: z.string(),
  index: z.number().int().nonnegative(),
  visitors: z.number().nonnegative(),
  conversions: z.number().nonnegative().optional(),
  dropoffs: z.number().nonnegative().optional(),
  dropoffRate: z.number().min(0).max(1).optional(),
  avgTimeSpentSec: z.number().nonnegative().optional(),
  device: z.enum(["all", "mobile", "desktop"]).default("all"),
});

export type FunnelStep = z.infer<typeof FunnelStepSchema>;

export interface FunnelAnalysisResult {
  steps: Array<FunnelStep & { dropoffRate: number; dropoffs: number }>;
  totalInitialVisitors: number;
  totalFinalConversions: number;
  overallConversionRate: number;
  biggestDropStep: {
    name: string;
    index: number;
    dropoffCount: number;
    dropoffRate: number;
  };
}

export interface StepScreenshot {
  stepName: string;
  viewport: "mobile" | "desktop";
  base64Data?: string;
  url?: string;
  mimeType?: string;
}

export type HeuristicCategory =
  | "clarity"
  | "cognitive_load"
  | "trust_and_security"
  | "fitts_law_and_touch"
  | "hidden_costs_and_pricing"
  | "form_friction";

export interface AuditFinding {
  id: string;
  stepName: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: HeuristicCategory;
  headline: string;
  explanation: string;
  visualElementSelector?: string;
  dropoffContributionEstPercent: number;
  actionableFix: string;
  recommendedCodeDiff?: string;
}

export interface RCAReport {
  projectUrl?: string;
  generatedAt: string;
  executiveSummary: string;
  funnelMetrics: FunnelAnalysisResult;
  findings: AuditFinding[];
  generatedPRD: string;
  redesignCodeSuggestion?: string;
}
