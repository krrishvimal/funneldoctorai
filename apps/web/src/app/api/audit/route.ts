import { NextResponse } from "next/server";
import { parseFunnelFromCsv, runFunnelAudit, StepScreenshot } from "@funneldoctor/core";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { csvText, websiteUrl, screenshots } = body;

    if (!csvText || typeof csvText !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'csvText' payload." },
        { status: 400 }
      );
    }

    // 1. Compute funnel metrics using core engine
    const metrics = parseFunnelFromCsv(csvText);

    // 2. Prepare screenshots (if provided)
    const validScreenshots: StepScreenshot[] = Array.isArray(screenshots)
      ? screenshots.map((s: any) => ({
          stepName: s.stepName || "Screen",
          viewport: s.viewport === "mobile" ? "mobile" : "desktop",
          base64Data: s.base64Data,
          mimeType: s.mimeType || "image/png",
        }))
      : [];

    // 3. Run multimodal audit with Gemini
    const report = await runFunnelAudit(metrics, validScreenshots, {
      projectUrl: websiteUrl,
      apiKey: process.env.GEMINI_API_KEY,
    });

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error("Audit API Route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to complete audit." },
      { status: 500 }
    );
  }
}
