import { NextResponse } from "next/server";
import { scrubPiiText } from "@funneldoctor/tracker";

// In-Memory rolling telemetry store for live analytics (keyed by siteId/domain)
interface SiteTelemetrySummary {
  siteId: string;
  totalSessions: number;
  totalEvents: number;
  lastActive: number;
  fieldDwellTimes: Record<string, { totalMs: number; count: number; avgMs: number }>;
  rageClicks: Record<string, number>;
  abandonmentCount: number;
}

const rollingTelemetryStore = new Map<string, SiteTelemetrySummary>();

// CORS headers to allow browser scripts from external merchant stores
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId") || searchParams.get("domain");

  if (!siteId) {
    return NextResponse.json(
      { error: "siteId or domain query parameter is required." },
      { status: 400, headers: corsHeaders }
    );
  }

  const cleanSiteId = siteId.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
  const summary = rollingTelemetryStore.get(cleanSiteId) || {
    siteId: cleanSiteId,
    totalSessions: 0,
    totalEvents: 0,
    lastActive: Date.now(),
    fieldDwellTimes: {},
    rageClicks: {},
    abandonmentCount: 0,
  };

  return NextResponse.json({ success: true, summary }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json().catch(() => null);

    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON telemetry payload." },
        { status: 400, headers: corsHeaders }
      );
    }

    const { siteId, sessionId, events, url, viewport } = rawBody;

    if (!siteId || typeof siteId !== "string") {
      return NextResponse.json(
        { error: "Missing required 'siteId' string." },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanSiteId = siteId.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
    const eventList = Array.isArray(events) ? events : [];

    // Get or initialize site record
    let siteSummary = rollingTelemetryStore.get(cleanSiteId);
    if (!siteSummary) {
      siteSummary = {
        siteId: cleanSiteId,
        totalSessions: 0,
        totalEvents: 0,
        lastActive: Date.now(),
        fieldDwellTimes: {},
        rageClicks: {},
        abandonmentCount: 0,
      };
      rollingTelemetryStore.set(cleanSiteId, siteSummary);
    }

    siteSummary.totalSessions += 1;
    siteSummary.lastActive = Date.now();

    // Process batched events
    for (const evt of eventList) {
      if (!evt || typeof evt !== "object") continue;
      siteSummary.totalEvents += 1;

      const rawTarget = typeof evt.target === "string" ? evt.target : "unknown";
      // Secondary server-side PII scrub insurance
      const target = scrubPiiText(rawTarget).slice(0, 100);

      if (evt.type === "field_dwell" && typeof evt.dwellMs === "number" && evt.dwellMs > 0) {
        const dwell = Math.min(evt.dwellMs, 120000); // cap at 2 mins to prevent idle tab skew
        const current = siteSummary.fieldDwellTimes[target] || { totalMs: 0, count: 0, avgMs: 0 };
        current.totalMs += dwell;
        current.count += 1;
        current.avgMs = Math.round(current.totalMs / current.count);
        siteSummary.fieldDwellTimes[target] = current;
      } else if (evt.type === "rage_click") {
        siteSummary.rageClicks[target] = (siteSummary.rageClicks[target] || 0) + 1;
      } else if (evt.type === "abandonment") {
        siteSummary.abandonmentCount += 1;
      }
    }

    return NextResponse.json(
      {
        success: true,
        siteId: cleanSiteId,
        received: eventList.length,
        processedAt: Date.now(),
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("Telemetry ingestion error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process telemetry batch." },
      { status: 500, headers: corsHeaders }
    );
  }
}
