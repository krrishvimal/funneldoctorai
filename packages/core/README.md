# 🩺 FunnelDoctor Core (`@funneldoctor/core`)

> **Autonomous Multimodal Conversion Rate Optimization (CRO) & Root-Cause-Analysis Engine.**  
> Powered by OpenAI Codex, Multimodal Reasoning & Quantitative Event Analytics.

[![npm version](https://img.shields.io/npm/v/@funneldoctor/core.svg?style=flat-square)](https://www.npmjs.com/package/@funneldoctor/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![OpenAI Codex & GPT-4o Ready](https://img.shields.io/badge/OpenAI-Codex%20%26%20GPT--4o%20Ready-black.svg?style=flat-square&logo=openai)](https://openai.com/)

---

## 🎯 The Problem

Analytics dashboards like Mixpanel, PostHog, or Google Analytics 4 tell you **where** users drop off (e.g. *"70% abandon checkout"*), but they never tell you **why** or **how to fix it**.

**FunnelDoctor Core** bridges the gap between **quantitative funnel metrics** and **qualitative UX heuristic vision**, autonomously generating:
- 📊 **Step-by-Step Velocity & Drop-off Math** (calculates exact drop rates and leaked revenue)
- 👁️ **Visual UI Heuristic Inspection** (identifies forced login walls, hidden fee sticker shocks, and form friction)
- 📝 **Production-Ready PRDs** (Product Requirements Documents with user stories and acceptance criteria)
- ⚡ **Redesigned Tailwind / React Component Code** (drop-in remedies in under 60 seconds)
- 💬 **Grade 6–8 Plain English** (zero dense corporate consulting jargon)

---

## 📦 Quickstart CLI

Run a live audit directly from your terminal with `npx`:

```bash
# 1. Audit a local funnel CSV against a live website
npx @funneldoctor/core audit --file ./funnel.csv --url https://quickstyle-d2c.in/checkout/step-4 --output ./report.json
```

Or install locally in your repository:

```bash
npm install @funneldoctor/core
# or
pnpm add @funneldoctor/core
# or
yarn add @funneldoctor/core
```

---

## 🚀 Programmatic SDK Usage

FunnelDoctor Core provides two high-level workflows:

### Workflow A: Instant Live URL / Domain Audit
Audit any public website, agency portfolio, or checkout URL with archetype intelligence:

```typescript
import { auditDomainWithGemini } from "@funneldoctor/core";

const report = await auditDomainWithGemini("https://merang.ad", {
  openaiApiKey: process.env.OPENAI_API_KEY, // Powered by OpenAI GPT-4o / Codex
  // or apiKey: process.env.GEMINI_API_KEY,
});

console.log(`Brand: ${report.brandName} (${report.category})`);
console.log(`Worst Step: ${report.worstStepName} (-${report.dropoffRate}%)`);
console.log(`Monthly Leaked: ₹${report.leakedMonthlyLakhs} Lakhs`);
console.log(`Recoverable: ₹${report.recoverableMonthlyLakhs} Lakhs`);

// Inspect plain-English findings
report.findings.forEach((finding) => {
  console.log(`- [${finding.category.toUpperCase()}] ${finding.title}: ${finding.plainEnglish}`);
});

// Drop-in React code & PRD markdown
console.log(report.reactCode);
console.log(report.prdMarkdown);
```

### Workflow B: Custom CSV Telemetry Ingestion
Parse event exports from Mixpanel, PostHog, or GA4 and cross-reference with viewport screenshots:

```typescript
import { parseFunnelFromCsv, runFunnelAudit } from "@funneldoctor/core";
import * as fs from "node:fs";

// 1. Parse your funnel CSV
const csvData = fs.readFileSync("./funnel.csv", "utf-8");
const metrics = parseFunnelFromCsv(csvData);

console.log(`Biggest Drop: ${metrics.biggestDropStep.name} (${metrics.biggestDropStep.dropoffRate * 100}% drop-off)`);

// 2. Run the Multimodal RCA Engine
const report = await runFunnelAudit(
  metrics,
  [
    {
      stepName: "Checkout Page",
      viewport: "mobile",
      base64Data: "...", // Optional base64 screenshot
      mimeType: "image/png"
    }
  ],
  {
    apiKey: process.env.GEMINI_API_KEY,
  }
);

console.log(report.executiveSummary);
console.log(report.generatedPRD);
```

---

## 📁 Sample CSV Format

FunnelDoctor automatically detects common column formats from Mixpanel, PostHog, and standard exports:

```csv
step,visitors
Landing Page,10000
Product Details,4200
Add to Cart,2100
Checkout Information,850
Order Confirmation,380
```

---

## 🧠 Built-In Archetypes

FunnelDoctor Core automatically detects and adapts diagnostic criteria for:
- **D2C E-Commerce** (cart churn, surprise shipping charges, UPI input friction)
- **B2B SaaS** (signup wizard friction, premature paywalls, slow activation)
- **Creative Studios & Agencies** (intake questionnaire friction, missing pricing ranges, portfolio media lag)
- **Fintech & Banking** (KYC camera timeouts, Aadhaar OTP latency, document upload failures)

---

## 🧪 Testing

```bash
# Run Vitest unit & integration test suite
npm test
```

---

## 📄 License

MIT © [Krrish Vimal](https://github.com/krrishvimal)
