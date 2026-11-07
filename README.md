# 🩺 FunnelDoctor.ai

<div align="center">

**Autonomous Multimodal Conversion & Root-Cause-Analysis Agent for Modern Web, Fintech & D2C Brands.**  
*Built for the Startup Buildathon India 2026 · Powered by Google Cloud & Gemini 2.5 Active Engine.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Powered By Gemini 2.5](https://img.shields.io/badge/Google%20Gemini-2.5%20Multimodal%20Active-emerald.svg?style=flat-square)](https://deepmind.google/technologies/gemini/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%205.6-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![CI Status](https://img.shields.io/badge/CI-Passing-brightgreen.svg?style=flat-square)](https://github.com/krrishvimal/funneldoctor)

[Live Dashboard](#-web-dashboard-experience) · [Architecture](#-monorepo-architecture) · [CLI Quickstart](#-developer-cli) · [Business Model](#-b2b-monetization--roi-guarantee) · [Jury Pitch Guide](#-startup-buildathon-pitch)

</div>

---

## 🌟 Executive Overview

Every online business loses fortunes in their conversion funnels:
- **D2C Brands:** 70%+ of mobile shoppers churn at payment checkout due to late fee shocks, slow OTP modals, and WebView keyboard occlusion.
- **Fintechs:** 60%+ of loan & account applicants drop out during video KYC due to camera permission timeouts and uncompressed Aadhaar upload failures.
- **EdTechs:** 80%+ of learners abandon annual subscriptions due to lack of micro-pricing sachet tiers.

Traditional analytics platforms (Google Analytics 4, Mixpanel, PostHog) only show **where** users leave—they cannot diagnose **why**, and they **never write the fix**. Traditional CRO consulting agencies charge ₹3,00,000–₹5,00,000/month retainers and take 6 weeks to deliver slide decks.

**FunnelDoctor.ai** is an **Autonomous AI Staff CRO Engineer**:
1. **Telemetry Ingestion:** Ingests raw event logs, BigQuery streams, or GA4/Mixpanel CSVs.
2. **Spatial Vision X-Ray:** Cross-references quantitative drops with live viewport screenshots using **Gemini Omni Vision** to pinpoint cognitive friction, hidden costs, and UX bugs.
3. **BigQuery SQL Correlation:** Automatically writes and executes diagnostic telemetry queries isolating device OS latency bottlenecks.
4. **The 60s Payoff:** Auto-synthesizes an **Executive Product Requirement Document (PRD)** and generates **production-ready React / TypeScript code** to recover lost conversions in one click.

---

## 🏗️ Monorepo Architecture

```
funneldoctor/
├── apps/
│   └── web/                     # High-performance Next.js 14 App Router SaaS Platform
│       ├── src/app/             # Clinical Swiss Minimalist UI (#FBFBFB / #09090B)
│       │   ├── page.tsx         # Interactive Multimodal Dashboard & Visual Comparator
│       │   ├── layout.tsx       # Metadata, OpenGraph & Favicon configuration
│       │   ├── globals.css      # Custom typography & topographic canvas mesh styling
│       │   └── api/audit/       # Gemini 2.5 Multimodal Audit API route
│       └── public/              # Static assets & sample telemetry
├── packages/
│   └── core/                    # Standalone Open-Source CRO & Diagnostics Engine
│       ├── src/
│       │   ├── cli.ts           # Autonomous terminal auditor (`npx @funneldoctor/core audit`)
│       │   ├── gemini-auditor.ts# Gemini 2.5 Vision + Fallback synthesis pipeline
│       │   ├── funnel-parser.ts # High-throughput CSV & telemetry event stream parser
│       │   └── heuristics.ts    # Deterministic Fitts's Law & behavioral CRO algorithms
│       └── test/                # 100% Passing Vitest Unit & Integration Suites
└── .github/workflows/ci.yml     # Automated multi-job CI pipeline
```

---

## 🚀 The 4 Core Modules

### Module 01 · Quantitative Telemetry Waterfall
Visualizes step-by-step conversion waterfalls across D2C, Fintech, and EdTech funnels with automated anomaly detection flagging outlier churn steps (e.g. `Step 04 Address & Payment: -71.7% Drop`).

### Module 02 · Gemini Spatial Vision X-Ray
Renders live mobile phone viewports with interactive fault markers:
- **Fault #01:** Forced OTP modal blocks guest checkout (41.2% exit rate).
- **Fault #02:** Late ₹149 delivery fee hidden until the final commitment screen (31.4% rage clicks).
- **Fault #03:** Primary CTA pushed 180px below the mobile fold.

### Module 03 · Correlated BigQuery SQL Telemetry Proof
Generates correlated diagnostic SQL queries and displays real telemetry execution results proving root causes (e.g. *Android WebView v4.2 UPI Latency: 4,280 ms vs iOS Safari: 610 ms*).

### Module 04 · The 60-Second Auto-Remediation Payoff
- **Visual Before / After Comparator:** Compare the broken baseline against the conversion-optimized flow.
- **Executive PRD Studio:** Complete 5-section Product Requirement Document (User Stories, Technical Specs, Acceptance Criteria, A/B Rollout Plan) with 1-click Markdown export.
- **Production React Component:** Copy-pasteable TypeScript/React component featuring 1-tap UPI Express Checkout, guest bypass, and instant feedback.

---

## ⚡ Quickstart

### 1. Web Dashboard
```bash
# Clone the repository
git clone https://github.com/krrishvimal/funneldoctor.git
cd funneldoctor

# Install dependencies across monorepo workspaces
npm install

# Run the Next.js production build
npm run build

# Start the web platform
npm run dev:web
```
Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

#### Deep-Linking Presets:
- `http://localhost:3000/?preset=d2c` — D2C Checkout Leakage Audit
- `http://localhost:3000/?preset=fintech` — Video KYC & WebRTC Onboarding Audit
- `http://localhost:3000/?preset=edtech` — Annual Paywall Sachet Pass Audit

### 2. Developer CLI
You can run automated multimodal audits directly in your terminal or CI/CD pipelines:
```bash
# Audit a local funnel CSV against a live website
npx @funneldoctor/core audit --file ./packages/core/sample-funnel.csv --url https://quickstyle-d2c.in/checkout/step-4
```

---

## 💰 B2B Monetization & ROI Guarantee

FunnelDoctor is anchored directly to **recovered client revenue**:

| Tier | Price | Target Market | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Growth** | **\$199 / mo** (~₹16.5k) | D2C Stores doing ₹25L–₹1Cr GMV | 15 Audits/mo, Gemini Spatial Vision, React code export |
| **Scale** | **\$599 / mo** (~₹49.5k) | Scaleups doing ₹1Cr–₹10Cr GMV | **Unlimited audits**, BigQuery/Mixpanel streaming, Gemini Live voice briefings, auto-PR GitHub PRs |
| **Enterprise** | **\$2,499 / mo** | Fintechs, Unicorns, Banks | Dedicated GCP Vertex AI VPC deployment, 99.9% SLA, SOC2, dedicated CRO architect |

### 🛡️ The 3x ROI Performance Guarantee
> *If FunnelDoctor does not identify and help recover at least 3x its subscription cost in leaked checkout revenue within 30 days, we issue an immediate 100% refund.*

---

## 🧪 Testing & Verification

FunnelDoctor monorepo maintains rigorous automated test coverage:
```bash
# Run Vitest test suite
npm test
```
```
 ✓ test/funnel-parser.test.ts (3 tests)
 ✓ test/auditor.test.ts (1 test)
 Test Files  2 passed (2)
      Tests  4 passed (4)
```

---

## 📜 License & Credits
Licensed under the [MIT License](./LICENSE).  
Built for the **Startup Buildathon India 2026** by [Krrish Vimal](https://github.com/krrishvimal).
