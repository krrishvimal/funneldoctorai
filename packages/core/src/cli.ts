import { Command } from "commander";
import * as fs from "node:fs";
import * as path from "node:path";
import { runFunnelAudit } from "./gemini-auditor.js";
import { parseFunnelFromCsv } from "./funnel-parser.js";
import { auditDomainWithGemini } from "./domain-auditor.js";

const program = new Command();

program
  .name("funneldoctor")
  .description("Autonomous Multimodal Conversion & Root-Cause-Analysis CLI")
  .version("0.1.0");

program
  .command("audit")
  .description("Run a multimodal CRO audit on a funnel CSV file or live website URL")
  .option("-f, --file <path>", "Path to funnel events CSV export")
  .option("-u, --url <url>", "Live website or checkout URL to correlate")
  .option("-o, --output <path>", "Output file path for the RCA report (JSON or Markdown)")
  .option("-k, --api-key <key>", "Google Gemini API key (defaults to GEMINI_API_KEY env)")
  .action(async (options) => {
    try {
      if (!options.file && !options.url) {
        console.error("Error: Please provide either --file <path-to-csv> or --url <website-url>.");
        process.exit(1);
      }

      // Mode A: File-based telemetry audit
      if (options.file) {
        const filePath = path.resolve(process.cwd(), options.file);
        if (!fs.existsSync(filePath)) {
          console.error(`Error: File not found at ${filePath}`);
          process.exit(1);
        }

        console.log(`🔍 [FunnelDoctor] Automatically reading funnel telemetry from ${options.file}...`);
        const csvContent = fs.readFileSync(filePath, "utf-8");
        const metrics = parseFunnelFromCsv(csvContent);

        console.log(`📊 Initial Sessions Evaluated: ${metrics.totalInitialVisitors.toLocaleString()}`);
        console.log(`🎯 Overall Conversion Rate: ${(metrics.overallConversionRate * 100).toFixed(2)}%`);
        console.log(
          `🚨 Primary Bottleneck: Step "${metrics.biggestDropStep.name}" with ${(
            metrics.biggestDropStep.dropoffRate * 100
          ).toFixed(1)}% drop-off (${metrics.biggestDropStep.dropoffCount.toLocaleString()} dropped users)`
        );

        console.log(`🤖 Synthesizing Multimodal Heuristics with Gemini...`);
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
        return;
      }

      // Mode B: URL-based Autonomous Telemetry Audit
      if (options.url) {
        console.log(`🌐 [FunnelDoctor] Automatically evaluating domain telemetry for: ${options.url}...`);
        const domainReport = await auditDomainWithGemini(options.url, {
          apiKey: options.apiKey,
        });

        console.log(`\n🏢 Brand: ${domainReport.brandName} (${domainReport.category})`);
        console.log(`📊 Evaluated Traffic: ${domainReport.visitors.toLocaleString()} sessions · AOV: ₹${domainReport.aov}`);
        console.log(`💸 Monthly Lost Revenue: ₹${domainReport.leakedMonthlyLakhs} Lakhs / mo`);
        console.log(`🚨 Primary Churn Step: ${domainReport.worstStepName} (-${domainReport.dropoffRate}% drop-off)`);

        console.log(`\nSequential Conversion Stages:`);
        domainReport.steps.forEach((s) => {
          console.log(`  - ${s.name}: ${s.visitors.toLocaleString()} users (${s.dropoffRate > 0 ? `-${s.dropoffRate}%` : 'Final'}) ${s.isBottleneck ? '[BOTTLENECK]' : ''}`);
        });

        console.log(`\n================= ROOT CAUSES ISOLATED =================`);
        domainReport.findings.forEach((f, i) => {
          console.log(`  ${i + 1}. [${f.impact}] ${f.title}`);
          console.log(`     ${f.plainEnglish}`);
        });
        console.log(`=========================================================\n`);

        if (options.output) {
          const outPath = path.resolve(process.cwd(), options.output);
          const content = options.output.endsWith(".md")
            ? domainReport.prdMarkdown
            : JSON.stringify(domainReport, null, 2);
          fs.writeFileSync(outPath, content, "utf-8");
          console.log(`\n✅ Saved complete audit report to ${outPath}`);
        }
      }
    } catch (err: any) {
      console.error("Execution failed:", err.message || err);
      process.exit(1);
    }
  });

program.parse(process.argv);
