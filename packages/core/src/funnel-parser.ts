import { parse } from "csv-parse/sync";
import { FunnelAnalysisResult, FunnelStep } from "./types.js";

interface RawRow {
  [key: string]: string | number;
}

/**
 * Normalizes column keys to detect common analytics export headers
 */
function findKey(row: RawRow, candidates: string[]): string | undefined {
  const keys = Object.keys(row);
  for (const candidate of candidates) {
    const found = keys.find(
      (k) => k.toLowerCase().replace(/[^a-z0-9]/g, "") === candidate
    );
    if (found) return found;
  }
  return undefined;
}

export function parseFunnelFromCsv(csvContent: string): FunnelAnalysisResult {
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as RawRow[];

  if (records.length === 0) {
    throw new Error("CSV file contains no data rows.");
  }

  const firstRow = records[0];
  const stepCol = findKey(firstRow, ["step", "stepname", "stagename", "event", "eventname", "page", "url"]);
  const visitorsCol = findKey(firstRow, ["visitors", "users", "sessions", "count", "uniqueusers", "visitorscount"]);

  if (!stepCol || !visitorsCol) {
    throw new Error(
      `Unable to auto-detect funnel columns. Found headers: ${Object.keys(firstRow).join(", ")}. Expected columns representing Step Name and Visitor Count.`
    );
  }

  const rawSteps: FunnelStep[] = records.map((row, index) => {
    const name = String(row[stepCol]).trim();
    const countVal = Number(String(row[visitorsCol]).replace(/[^0-9.-]+/g, ""));
    const visitors = isNaN(countVal) ? 0 : Math.max(0, countVal);

    return {
      name,
      index,
      visitors,
      device: "all",
    };
  });

  return computeFunnelMetrics(rawSteps);
}

export function computeFunnelMetrics(rawSteps: FunnelStep[]): FunnelAnalysisResult {
  if (rawSteps.length === 0) {
    throw new Error("No funnel steps provided.");
  }

  // Sort by index ascending
  const sorted = [...rawSteps].sort((a, b) => a.index - b.index);
  const totalInitialVisitors = sorted[0].visitors;

  let maxDropCount = -1;
  let biggestDropStep = {
    name: sorted[0].name,
    index: 0,
    dropoffCount: 0,
    dropoffRate: 0,
  };

  const processedSteps = sorted.map((step, i) => {
    let dropoffs = 0;
    let dropoffRate = 0;

    if (i < sorted.length - 1) {
      const nextStepVisitors = sorted[i + 1].visitors;
      dropoffs = Math.max(0, step.visitors - nextStepVisitors);
      dropoffRate = step.visitors > 0 ? dropoffs / step.visitors : 0;
    } else {
      dropoffs = 0;
      dropoffRate = 0;
    }

    if (dropoffs > maxDropCount) {
      maxDropCount = dropoffs;
      biggestDropStep = {
        name: step.name,
        index: step.index,
        dropoffCount: dropoffs,
        dropoffRate,
      };
    }

    return {
      ...step,
      dropoffs,
      dropoffRate,
    };
  });

  const finalStep = sorted[sorted.length - 1];
  const totalFinalConversions = finalStep.visitors;
  const overallConversionRate =
    totalInitialVisitors > 0 ? totalFinalConversions / totalInitialVisitors : 0;

  return {
    steps: processedSteps,
    totalInitialVisitors,
    totalFinalConversions,
    overallConversionRate,
    biggestDropStep,
  };
}
