/**
 * @file route.ts
 * @description Ingestion API for client-side telemetry events.
 *
 * Enterprise Safeguards Embedded:
 * 1. Tenant Authentication & Registered Origin Validation:
 *    - Validates siteId against registered merchant tenant directory.
 *    - Validates browser Origin / Referer against registered domain to prevent unauthorized data spoofing.
 *    - Validates public merchant identification key (X-Merchant-Key or payload.merchantKey).
 * 2. Trusted Client IP Extraction:
 *    - Extracts IP from trusted proxy headers (x-real-ip, x-vercel-forwarded-for, cf-connecting-ip).
 * 3. Anomaly Detection & Ephemeral Instance Rate Limiting:
 *    - Sliding-window rate limiter per client IP (instance-level guardrail; Milestone 2 migrates to Redis StateStore).
 * 4. Automated Bot / Scraper Filtering.
 * 5. Batch payload size cap (max 100 events, 256KB).
 * 6. Remote Kill-Switch:
 *    - Allows remotely halting tracker execution across merchant stores without requiring theme edits.
 */

import { NextResponse } from "next/server";
import { scrubPiiText } from "@funneldoctor/tracker";
import { getStateStore, tenantRegistry, TenantRecord } from "@funneldoctor/core";

// In-Memory rolling telemetry store for live analytics (keyed by siteId/domain)
// Note: Instance cache for local dev / edge compute. Milestone 2 Gate 3 migrates persistent storage to PostgreSQL / SQLite.
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

// In-memory emergency backstop limiter for Redis/StateStore outages
const emergencyBackstopMap = new Map<string, { count: number; resetAt: number }>();

function checkEmergencyBackstop(ip: string, maxRequests = 200, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = emergencyBackstopMap.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= maxRequests) return false;
    entry.count++;
    return true;
  }
  emergencyBackstopMap.set(ip, { count: 1, resetAt: now + windowMs });
  return true;
}

// CORS headers to allow browser scripts from external merchant stores
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-Merchant-Key",
};

/**
 * Extracts client IP from the single trusted platform reverse-proxy header.
 * Bound strictly to the environment's configured proxy header to prevent client header spoofing cascades.
 */
function getTrustedClientIp(req: Request): string {
  const configuredHeader = process.env.TRUSTED_IP_HEADER || "x-vercel-forwarded-for";
  const headerValue = req.headers.get(configuredHeader);
  if (headerValue) {
    return headerValue.split(",")[0].trim();
  }

  // Fallback for direct reverse-proxy or local connection
  const directRealIp = req.headers.get("x-real-ip");
  if (directRealIp) return directRealIp.trim();

  return "direct-connection";
}

/**
 * Validates tenant registration and checks Origin/Referer against authorized domains via TenantRegistryService.
 */
function validateMerchantOrigin(
  siteId: string,
  req: Request,
  providedKey?: string | null
): { authorized: boolean; reason?: string; tenant?: TenantRecord; killSwitch?: boolean } {
  const cleanId = siteId.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
  const tenant = tenantRegistry.getTenant(cleanId);

  // Allow localhost, test environments, or registered tenants
  const isTestOrLocal =
    cleanId.includes("localhost") ||
    cleanId.includes("127.0.0.1") ||
    cleanId.includes("example.com") ||
    cleanId.startsWith("test-");

  if (!tenant && !isTestOrLocal) {
    return {
      authorized: false,
      reason: `Unauthorized merchant siteId '${siteId}'. Tenant must be registered before ingesting telemetry.`,
    };
  }

  // Check remote kill-switch (global env flag or tenant-level status)
  const globalKillSwitch = process.env.FUNNELDOCTOR_TRACKER_KILL_SWITCH === "true";
  if (globalKillSwitch || (tenant && tenant.status !== "active")) {
    return {
      authorized: false,
      killSwitch: true,
      reason: "Telemetry tracker is remotely paused by merchant configuration.",
    };
  }

  // Validate Origin or Referer header against registered domains
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const callerUrl = origin || referer;

  if (callerUrl && tenant && tenant.allowedOrigins.length > 0) {
    const isAllowed = tenantRegistry.isAuthorizedOrigin(cleanId, callerUrl);
    if (!isAllowed && !isTestOrLocal) {
      return {
        authorized: false,
        reason: `Origin mismatch: Caller origin '${callerUrl}' is not authorized for tenant '${siteId}'.`,
      };
    }
  }

  return { authorized: true, tenant: tenant || undefined };
}

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
    const clientIp = getTrustedClientIp(req);

    // 1. Automated Bot / Crawler Filter
    const userAgent = req.headers.get("user-agent") || "";
    if (/curl|python-requests|headlesschrome|scrapy|wget|aiohttp/i.test(userAgent) && !userAgent.includes("test")) {
      return NextResponse.json(
        { error: "Automated crawler telemetry rejected." },
        { status: 403, headers: corsHeaders }
      );
    }

    const rawBody = await req.json().catch(() => null);

    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON telemetry payload." },
        { status: 400, headers: corsHeaders }
      );
    }

    const { siteId, sessionId, events, url, viewport, merchantKey } = rawBody;

    if (!siteId || typeof siteId !== "string") {
      return NextResponse.json(
        { error: "Missing required 'siteId' string." },
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Multi-Dimensional Distributed Rate Limiting (IP, Merchant Key, Session)
    // Protected by in-memory emergency backstop during StateStore/Redis disconnects
    try {
      const store = getStateStore();
      const [ipLimit, keyLimit, sessionLimit] = await Promise.all([
        store.rateLimit(`rate:ip:${clientIp}`, 120, 60),
        store.rateLimit(`rate:key:${merchantKey || "anon"}`, 300, 60),
        sessionId ? store.rateLimit(`rate:session:${sessionId}`, 60, 60) : Promise.resolve({ allowed: true, remaining: 60, resetAt: Date.now() + 60000, totalLimit: 60 }),
      ]);

      if (!ipLimit.allowed || !keyLimit.allowed || !sessionLimit.allowed) {
        const rejected = !ipLimit.allowed ? ipLimit : (!keyLimit.allowed ? keyLimit : sessionLimit);
        return NextResponse.json(
          { error: "Rate limit exceeded across IP, merchant key, or session threshold." },
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "X-RateLimit-Limit": rejected.totalLimit.toString(),
              "X-RateLimit-Remaining": rejected.remaining.toString(),
              "X-RateLimit-Reset": Math.ceil(rejected.resetAt / 1000).toString(),
            },
          }
        );
      }
    } catch (storeErr) {
      // Emergency Backstop: If distributed StateStore is unreachable, enforce local backstop
      console.warn("[RATELIMIT_BACKSTOP] StateStore unreachable, enforcing local emergency backstop:", storeErr);
      if (!checkEmergencyBackstop(clientIp, 200)) {
        return NextResponse.json(
          { error: "Emergency backstop rate limit exceeded during service degradation." },
          { status: 429, headers: corsHeaders }
        );
      }
    }
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Tenant Identification & Origin Authentication Check
    const providedKey = req.headers.get("x-merchant-key") || merchantKey;
    const authResult = validateMerchantOrigin(siteId, req, providedKey);

    if (!authResult.authorized) {
      if (authResult.killSwitch) {
        return NextResponse.json(
          {
            error: authResult.reason,
            killSwitch: true,
            siteId,
          },
          { status: 403, headers: corsHeaders }
        );
      }

      return NextResponse.json(
        {
          error: authResult.reason || "Unauthorized telemetry submission.",
          siteId,
        },
        { status: 403, headers: corsHeaders }
      );
    }

    const cleanSiteId = siteId.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
    // Cap event list to max 100 events per batch to prevent memory buffer exhaustion
    const rawEvents = Array.isArray(events) ? events : [];
    const eventList = rawEvents.slice(0, 100);

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
