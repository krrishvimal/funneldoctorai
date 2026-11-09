# 🩺 FunnelDoctor Core (`@funneldoctor/core`)

> **Autonomous Multimodal Conversion Rate Optimization (CRO) & Root-Cause-Analysis Engine.**  
> Powered by OpenAI Codex, Multimodal Reasoning & Quantitative Event Analytics.

[![npm version](https://img.shields.io/npm/v/@funneldoctor/core.svg?style=flat-square)](https://www.npmjs.com/package/@funneldoctor/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![OpenAI Codex Ready](https://img.shields.io/badge/OpenAI-Codex%20%26%20GPT--4o%20Ready-black.svg?style=flat-square&logo=openai)](https://openai.com/)

---

## 🎯 The Problem

Analytics dashboards like Mixpanel, PostHog, or Google Analytics 4 tell you **where** users drop off (e.g. *"70% abandon checkout"*), but they never tell you **why** or **how to fix it**.

**FunnelDoctor AI** bridges the gap between **quantitative funnel metrics** and **qualitative UX heuristic vision**, autonomously generating:
- 📊 **Step-by-Step Velocity & Drop-off Math**
- 👁️ **Visual UI Heuristic Inspection** (Nielsen Norman principles, Fitts's Law, cognitive friction)
- 📝 **Production-Ready PRDs** (Product Requirements Documents)
- ⚡ **Redesigned Tailwind / React Component Diffs**

---

## 📦 Quickstart CLI

Run a live audit directly from your terminal with `npx`:

```bash
# 1. Install or run directly via npx
npx @funneldoctor/core audit --file ./funnel.csv --url https://your-store.com --output ./report.json
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

```typescript
import { parseFunnelFromCsv, runFunnelAudit } from "@funneldoctor/core";
import * as fs from "node:fs";

// 1. Parse your funnel CSV (Mixpanel, PostHog, GA4, or custom export)
const csvData = fs.readFileSync("./funnel.csv", "utf-8");
const metrics = parseFunnelFromCsv(csvData);

console.log(`Worst bottleneck: ${metrics.biggestDropStep.name} (${metrics.biggestDropStep.dropoffRate * 100}% drop-off)`);

// 2. Run the Multimodal RCA Audit with Gemini
const report = await runFunnelAudit(metrics, [
  {
    stepName: "Checkout Page",
    viewport: "mobile",
    base64Data: "...", // Optional base64 screenshot of the checkout screen
    mimeType: "image/png"
  }
], {
  apiKey: process.env.GEMINI_API_KEY
});

// 3. Inspect findings and generated PRD
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

## 🧪 Testing

```bash
npm run test
```

---

## 📄 License

MIT © [Krrish Vimal](https://github.com/krrishvimal)
