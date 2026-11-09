# 🩺 FunnelDoctor.ai

<div align="center">

**Autonomous Multimodal Conversion & Root-Cause-Analysis Engine for Modern Web & E-Commerce Apps.**  
*See where your users drop off. Fix it with clean code in 60s.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![OpenAI Codex & GPT-4o Ready](https://img.shields.io/badge/OpenAI-Codex%20%26%20GPT--4o%20Ready-black.svg?style=flat-square&logo=openai)](https://openai.com/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%205.6-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![CI Status](https://img.shields.io/badge/CI-Passing-brightgreen.svg?style=flat-square)](https://github.com/krrishvimal/funneldoctor)

[Overview](#-executive-overview) · [Why FunnelDoctor](#-why-funneldoctor-vs-traditional-analytics) · [Monorepo Architecture](#-monorepo-architecture) · [Core Modules](#-the-4-core-modules) · [Universal Archetypes](#-universal-archetype-intelligence) · [Quickstart](#-quickstart) · [Developer CLI & SDK](#-developer-cli--programmatic-sdk) · [Monetization](#-b2b-monetization--roi-guarantee) · [Testing](#-testing--verification)

</div>

---

## 🌟 Executive Overview

Every online business loses fortunes in their conversion funnels:
- **D2C Brands:** 70%+ of mobile shoppers abandon checkout due to unexpected delivery fee shocks, forced OTP modal walls, and manual UPI ID typing friction.
- **B2B SaaS & DevTools:** 65%+ of signups drop out during onboarding wizards due to complex multi-field forms and premature credit card barriers.
- **Creative Studios & Agencies:** 60%+ of potential high-ticket clients leave without reaching out because inquiry questionnaires ask too many questions upfront or hide pricing ballpark guidance.
- **Fintechs & Banking:** 60%+ of loan and account applicants abandon during KYC due to camera permission timeouts and uncompressed Aadhaar upload failures.

Traditional analytics platforms (Google Analytics 4, Mixpanel, PostHog) only show **where** users leave—they cannot diagnose **why**, and they **never write the fix**. Traditional CRO consulting agencies charge ₹3,00,000–₹5,00,000/month retainers and take 6 weeks to deliver slide decks.

**FunnelDoctor.ai** operates as an **Autonomous AI Staff CRO Engineer**:
1. **Instant Audit or Event Ingestion:** Input any live URL (e.g. `quickstyle-d2c.in`, `merang.ad`, `linear.app`) or upload Mixpanel/GA4 event CSVs.
2. **Visual Screen X-Ray:** Cross-references quantitative drops with live viewport inspections using multimodal reasoning to pinpoint cognitive friction, hidden costs, and UX bugs.
3. **Correlated Diagnostic SQL Telemetry:** Formulates and runs diagnostic queries isolating device OS latency bottlenecks (e.g. Android WebView vs iOS Safari).
4. **The 60s Auto-Remediation Payoff:** Auto-synthesizes an **Executive Product Requirement Document (PRD)** and generates **production-ready React / Tailwind code** to recover lost conversions in one click.

---

## ⚖️ Why FunnelDoctor vs. Traditional Analytics?

| Feature | Google Analytics 4 / Mixpanel | Traditional CRO Agencies | Generic LLM Chatbots | 🩺 **FunnelDoctor.ai** |
| :--- | :--- | :--- | :--- | :--- |
| **Identifies Churn Step** | ✅ Yes (Numbers only) | ✅ Yes (Manual) | ⚠️ Only if told | **✅ Automated Anomaly Waterfall** |
| **Inspects Visual Viewport** | ❌ No | ⚠️ Subjective review | ❌ No visual layout parsing | **✅ Multimodal Viewport X-Ray** |
| **Pinpoints Exact Root Cause** | ❌ No | ⚠️ 4–6 week study | ⚠️ Vague advice ("improve CTA") | **✅ Exact Root-Cause Diagnosis** |
| **Plain English (Grade 6–8)** | ❌ Raw charts & metrics | ❌ Dense corporate jargon | ⚠️ Overly verbose essays | **✅ Crystal-Clear & Direct** |
| **Calculates Revenue Impact** | ❌ No | ⚠️ Custom spreadsheet | ❌ No | **✅ Instant Leaked & Recoverable ₹** |
| **Generates Production Code** | ❌ Never | ❌ Never | ⚠️ Disconnected snippets | **✅ Drop-In React Component in 60s** |
| **Generates Executive PRD** | ❌ Never | ⚠️ 30-page slide deck (weeks) | ⚠️ Generic bullet points | **✅ Complete 5-Section Markdown PRD** |
| **Turnaround Time** | Weeks to analyze | 4 to 8 Weeks | Instant (shallow) | **⚡ Under 60 Seconds** |

---

## 🏗️ Monorepo Architecture

FunnelDoctor is architected as an ultra-lean, type-safe TypeScript monorepo with clean separation between the user-facing web dashboard and the standalone diagnostic core engine:

```
funneldoctor/
├── apps/
│   └── web/                         # High-performance Next.js 14 App Router SaaS Platform
│       ├── src/app/                 # Clinical Swiss Minimalist UI (#FBFBFB / #09090B)
│       │   ├── page.tsx             # Multimodal Dashboard, Visual Comparator & CSV Uploader
│       │   ├── layout.tsx           # Global Metadata, OpenGraph & Favicon configuration
│       │   ├── globals.css          # Clean typography & topographic mesh styling
│       │   ├── audit/[slug]/        # Dynamic archetype audit route (e.g. /audit/merang.ad)
│       │   └── api/audit/           # Multi-provider Audit API (OpenAI GPT-4o / Codex & Gemini)
│       └── public/                  # Static assets & sample telemetry datasets
├── packages/
│   └── core/                        # Standalone Open-Source CRO & Diagnostics Engine
│       ├── src/
│       │   ├── cli.ts               # Autonomous terminal auditor (`npx @funneldoctor/core audit`)
│       │   ├── domain-auditor.ts    # Multi-archetype crawler, plain-English RCA & code generator
│       │   ├── gemini-auditor.ts    # Multimodal vision & heuristic reasoning pipeline
│       │   ├── funnel-parser.ts     # High-throughput CSV & telemetry event stream parser
│       │   ├── heuristics.ts        # Deterministic Fitts's Law & behavioral CRO algorithms
│       │   └── types.ts             # Complete shared type definitions
│       └── test/                    # 100% Passing Vitest Unit & Integration Suites
└── scripts/
    └── full-system-test.mjs         # 36/36 Automated End-to-End System Verification Suite
```

---

## 🚀 The 4 Core Modules

### Module 01 · Quantitative Telemetry Waterfall
Visualizes step-by-step conversion waterfalls across D2C, B2B SaaS, Creative Agencies, and Fintech funnels with automated anomaly detection flagging outlier churn steps (e.g. `Step 04 Address & Payment: -71.7% Drop`).

### Module 02 · Visual Mobile X-Ray & Heuristic Inspection
Renders mobile phone viewports with interactive fault markers:
- **Fault #01 (UX):** Forced login or OTP modal blocks guest users (41.2% exit rate).
- **Fault #02 (Pricing):** Late ₹149 delivery fee hidden until final commitment screen (31.4% rage clicks).
- **Fault #03 (Payment Friction):** Manual UPI ID typing friction with frequent typos vs. 1-Tap UPI App Selector (Google Pay, PhonePe, Paytm).

### Module 03 · Correlated BigQuery SQL Telemetry Proof
Generates correlated diagnostic SQL queries and displays real telemetry execution results proving root causes (e.g. *Android WebView v4.2 UPI Latency: 4,280 ms vs iOS Safari: 610 ms*).

### Module 04 · The 60-Second Auto-Remediation Payoff
- **Visual Before / After Comparator:** Compare the broken baseline against the conversion-optimized flow with interactive toggle.
- **Executive PRD Studio:** Complete 5-section Product Requirement Document (User Stories, Technical Specs, Acceptance Criteria, A/B Rollout Plan) with 1-click Markdown export.
- **Production React Component:** Copy-pasteable TypeScript/React component featuring 1-tap UPI Express Checkout, guest bypass, and instant feedback.

---

## 🧠 Universal Archetype Intelligence

FunnelDoctor is trained across distinct business archetypes with tailored drop-off modeling:

1. **D2C E-Commerce & Retail** *(e.g. Nike, Amazon, QuickStyle)*:
   - Funnel: `Catalog -> Product Selection -> Shopping Bag -> Address & Payment -> Order Confirmed`
   - Common Leaks: Hidden shipping fees at checkout, OTP login walls, manual UPI VPA input friction.
2. **B2B SaaS & Software Platforms** *(e.g. Linear, TaskFlow)*:
   - Funnel: `Landing Page -> Signup / Google SSO -> Workspace Setup -> Team Invites -> Active Usage`
   - Common Leaks: Excessive form fields, mandatory credit card input on free trials, slow time-to-value.
3. **Creative Agencies & Design Studios** *(e.g. Merang, CraftStudio)*:
   - Funnel: `Portfolio Homepage -> Case Studies -> Inquiry Questionnaire -> Call Booking -> Kickoff`
   - Common Leaks: Too many intake questions upfront, missing starting price guidance, heavy unoptimized media.
4. **Fintech, Banking & Wealth** *(e.g. Zerodha, Cred)*:
   - Funnel: `PAN Verification -> Bank Linking -> Video KYC -> Aadhaar OTP -> Account Funded`
   - Common Leaks: Camera permission failures, government SMS OTP timeouts, uncompressed document upload errors.

---

## 📖 Plain English, Not Consulting Jargon

FunnelDoctor enforces a strict **Grade 6–8 Plain English standard**. All reports deliberately ban dense consulting buzzwords (such as *"asynchronous validation loops"*, *"causal architecture"*, or *"spatial vision"*). Every issue is explained in 1 to 2 clear, honest sentences so founders, marketers, and developers can immediately take action without needing a dictionary.

---

## ⚡ Quickstart

### 1. Web Dashboard
```bash
# Clone the repository
git clone https://github.com/krrishvimal/funneldoctor.git
cd funneldoctor

# Install dependencies across monorepo workspaces
npm install

# Run the production build
npm run build

# Start the web platform
npm run dev:web
```
Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

#### Two Instant Audit Modes:
- **Instant URL Audit:** Enter any website URL directly (e.g. `quickstyle-d2c.in`, `merang.ad`, `linear.app`) or click any pre-calibrated benchmark (Nike, Amazon, Linear, Zerodha).
- **Deep-Linking Presets:**
  - `http://localhost:3000/?preset=d2c` — D2C Checkout Leakage Audit
  - `http://localhost:3000/?preset=fintech` — Video KYC & WebRTC Onboarding Audit
  - `http://localhost:3000/?preset=edtech` — Annual Paywall Sachet Pass Audit
- **Analytics CSV Ingestion:** Click *"Have analytics CSV? Upload Funnel"* to upload event data from Mixpanel, PostHog, or GA4.

---

## 💻 Developer CLI & Programmatic SDK

### Autonomous Developer CLI
Run conversion rate audits directly inside your terminal or CI/CD pipelines:
```bash
# Audit a funnel CSV against a live website
npx @funneldoctor/core audit --file ./packages/core/sample-funnel.csv --url https://quickstyle-d2c.in/checkout/step-4
```

### Programmatic SDK Usage
```typescript
import { auditDomainWithGemini, parseFunnelFromCsv, runFunnelAudit } from "@funneldoctor/core";

// 1. Instant Domain Audit (Powered by OpenAI GPT-4o / Codex or Gemini)
const report = await auditDomainWithGemini("https://quickstyle-d2c.in", {
  openaiApiKey: process.env.OPENAI_API_KEY, // or apiKey: process.env.GEMINI_API_KEY
});

console.log(`Brand: ${report.brandName} (${report.category})`);
console.log(`Worst Bottleneck: ${report.worstStepName} (-${report.dropoffRate}% drop-off)`);
console.log(`Monthly Leaked Revenue: ₹${report.leakedMonthlyLakhs} Lakhs`);
console.log(`Recoverable Revenue: ₹${report.recoverableMonthlyLakhs} Lakhs`);

// 2. Access the Generated React Code & PRD
console.log(report.reactCode);   // Drop-in React / Tailwind component
console.log(report.prdMarkdown); // 5-Section Product Requirement Document
```

---

## 💰 B2B Monetization & ROI Guarantee

FunnelDoctor is anchored directly to **recovered client revenue**:

| Tier | Price | Target Market | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Growth** | **\$199 / mo** (~₹16.5k) | D2C Stores doing ₹25L–₹1Cr GMV | 15 Audits/mo, Visual Screen X-Ray, React code export |
| **Scale** | **\$599 / mo** (~₹49.5k) | Scaleups doing ₹1Cr–₹10Cr GMV | **Unlimited audits**, BigQuery/Mixpanel streaming, automated PR generation |
| **Enterprise** | **\$2,499 / mo** | Fintechs, Unicorns, Banks | Custom cloud deployment, 99.9% SLA, SOC2, dedicated CRO architect |

### 🛡️ The 3x ROI Performance Guarantee
> *If FunnelDoctor does not identify and help recover at least 3x its subscription cost in leaked checkout revenue within 30 days, we issue an immediate 100% refund.*

---

## 🧪 Testing & Verification

FunnelDoctor maintains rigorous automated test coverage across both unit tests and end-to-end system verification suites:

### 1. Vitest Unit & Integration Tests (100% Passing)
```bash
npm test
```
```
 ✓ test/funnel-parser.test.ts (3 tests)
 ✓ test/domain-auditor.test.ts (4 tests)
 ✓ test/auditor.test.ts (1 test)

 Test Files  3 passed (3)
      Tests  8 passed (8)
```

### 2. Full System Verification Suite (36/36 Passing)
```bash
node scripts/full-system-test.mjs
```
```
==================================================
  FUNNELDOCTOR AI — 36/36 FULL SYSTEM VERIFICATION
==================================================
  ✔ Suite 1: Health & Landing Page (4/4)
  ✔ Suite 2: D2C Preset & Mobile Viewport (4/4)
  ✔ Suite 3: Fintech & WebRTC Preset (4/4)
  ✔ Suite 4: EdTech & Sachet Pass Preset (4/4)
  ✔ Suite 5: Pre-Calibrated Brand Audits (Nike, Amazon, Linear, Zerodha) (4/4)
  ✔ Suite 6: Live Dynamic Archetypes (Merang.ad, CraftStudio, TaskFlow) (4/4)
  ✔ Suite 7: Remediation Studio (React Code & PRD Studio) (4/4)
  ✔ Suite 8: API Route Contracts (GET & POST) (4/4)
  ✔ Suite 9: Production Resilience & Plain English Enforcement (4/4)

  ALL 36 VERIFICATION SUITES PASSED (100% SUCCESS)
==================================================
```

---

## 📜 License & Credits

- **License:** Distributed under the [MIT License](./LICENSE). Free for open-source and commercial use.
- **Maintainer:** [Krrish Vimal](https://github.com/krrishvimal)
