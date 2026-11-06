import { Command } from "commander";
import * as fs from "node:fs";
import * as path from "node:path";
import { runFunnelAudit } from "./gemini-auditor.js";
import { parseFunnelFromCsv } from "./funnel-parser.js";

const program = new Command();

program
  .name("funneldoctor")
  .description("Autonomous Multimodal Conversion & Root-Cause-Analysis CLI")
  .version("0.1.0");

program
  .command("audit")
  .description("Run a multimodal CRO audit on a funnel CSV file")
  .requiredOption("-f, --file <path>", "Path to funnel events CSV export")
  .option("-u, --url <url>", "Live website or checkout URL to correlate")
  .option("-o, --output <path>", "Output file path for the RCA report (JSON or Markdown)")
  .option("-k, --api-key <key>", "Google Gemini API key (defaults to GEMINI_API_KEY env)")
  .action(async (options) => {
    try {
      const filePath = path.resolve(process.cwd(), options.file);
      if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found at ${filePath}`);
        process.exit(1);
      }

      console.log(`🔍 [FunnelDoctor] Reading funnel data from ${options.file}...`);
      const csvContent = fs.readFileSync(filePath, "utf-8");
      const metrics = parseFunnelFromCsv(csvContent);

      console.log(`📊 Total Initial Visitors: ${metrics.totalInitialVisitors.toLocaleString()}`);
      console.log(`🎯 Overall Conversion Rate: ${(metrics.overallConversionRate * 100).toFixed(2)}%`);
      console.log(
        `🚨 Biggest Bottleneck: Step "${metrics.biggestDropStep.name}" with ${(
          metrics.biggestDropStep.dropoffRate * 100
        ).toFixed(1)}% drop-off (${metrics.biggestDropStep.dropoffCount.toLocaleString()} dropped users)`
      );

      console.log(`🤖 Running Multimodal Heuristic Audit...`);
      const report = await runFunnelAudit(metrics, [], {
        apiKey: options.apiKey,
        projectUrl: options.url,
      });

      console.log(`\n================= RCA EXECUTIVE SUMMARY =================`);
      console.log(report.executiveSummary);
      console.log(`=========================================================\n`);

      console.log(`Top Actionable Findings:`);
      report.findings.forEach((f, i) => {
        console.log(`  [${f.severity}] ${i + 1}. ${f.headline}`);
        console.log(`     Fix: ${f.actionableFix}`);
      });

      if (options.output) {
        const outPath = path.resolve(process.cwd(), options.output);
        const content = options.output.endsWith(".md")
          ? report.generatedPRD
          : JSON.stringify(report, null, 2);
        fs.writeFileSync(outPath, content, "utf-8");
        console.log(`\n✅ Saved complete audit report to ${outPath}`);
      }
    } catch (err: any) {
      console.error("Execution failed:", err.message || err);
      process.exit(1);
    }
  });

program.parse(process.argv);
