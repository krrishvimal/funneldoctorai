import { NextResponse } from "next/server";
import { parseFunnelFromCsv, runFunnelAudit, auditDomainWithGemini, StepScreenshot } from "@funneldoctor/core";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain") || searchParams.get("url");

    if (!domain) {
      return NextResponse.json(
        { error: "Query parameter 'domain' or 'url' is required." },
        { status: 400 }
      );
    }

    const report = await auditDomainWithGemini(domain, {
      apiKey: process.env.GEMINI_API_KEY,
    });

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error("GET /api/audit error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to audit domain." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { csvText, websiteUrl, screenshots } = body;

    // Mode A: Direct URL audit (Zero-friction, autonomous)
    if (!csvText || typeof csvText !== "string" || !csvText.trim()) {
      if (!websiteUrl || typeof websiteUrl !== "string") {
        return NextResponse.json(
          { error: "Please provide either a 'websiteUrl' or 'csvText' payload." },
          { status: 400 }
        );
      }

      const domainReport = await auditDomainWithGemini(websiteUrl, {
        apiKey: process.env.GEMINI_API_KEY,
      });

      return NextResponse.json({ success: true, report: domainReport, mode: "domain" });
    }

    // Mode B: Custom CSV Telemetry Ingestion
    const metrics = parseFunnelFromCsv(csvText);

    const validScreenshots: StepScreenshot[] = Array.isArray(screenshots)
      ? screenshots.map((s: any) => ({
          stepName: s.stepName || "Screen",
          viewport: s.viewport === "mobile" ? "mobile" : "desktop",
          base64Data: s.base64Data,
          mimeType: s.mimeType || "image/png",
        }))
      : [];

    const report = await runFunnelAudit(metrics, validScreenshots, {
      projectUrl: websiteUrl,
      apiKey: process.env.GEMINI_API_KEY,
    });

    return NextResponse.json({ success: true, report, mode: "csv" });
  } catch (err: any) {
    console.error("Audit API Route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to complete audit." },
      { status: 500 }
    );
  }
}
