# 🩺 FunnelDoctor AI

> **Autonomous Multimodal Conversion & Root-Cause-Analysis Agent for Web & D2C Stores.**  
> Built for the **Startup Buildathon** & Published as an Open-Source Developer Engine.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Powered By Gemini](https://img.shields.io/badge/Google%20Gemini-Omni%20Vision%20%2B%20Live-orange.svg?style=flat-square)](https://deepmind.google/technologies/gemini/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 🌟 The Vision

Every founder, D2C brand owner, and Product Manager watches users drop off in their checkout funnels (e.g., *"70% of users abandon at the payment screen"*), but small teams don't have a dedicated Data Analyst + UX Researcher to diagnose why and fix it.

**FunnelDoctor AI** is an autonomous AI Product Manager & UX Auditor:
1. **Input:** The founder pastes their live website URL and uploads funnel event telemetry (CSV, Mixpanel, or PostHog).
2. **Multimodal Audit:** Cross-references quantitative funnel drop-offs with visual UI screenshots using Google Gemini Omni (spatial layout, Fitts's Law, cognitive load, hidden cost shock).
3. **Live Voice RCA Consult:** Real-time voice consultation with Gemini Live: *"Why did mobile conversion drop 15% yesterday?"*
4. **1-Click Deliverables:** Generates complete Root Cause Analysis (RCA) reports, production-ready PRDs, and ready-to-copy frontend component fixes.

---

## 🏗️ Repository Architecture

This repository is organized as a monorepo:

- [`packages/core`](./packages/core): The standalone open-source npm library and CLI engine (`@funneldoctor/core`).
- [`apps/web`](./apps/web): The interactive Next.js 15 SaaS application & live dashboard.

---

## 🚀 Quickstart

### 1. Install & Run Web Dashboard
```bash
# Clone the repository
git clone https://github.com/krrishvimal/funneldoctor.git
cd funneldoctor

# Install dependencies
npm install

# Run the web dashboard
npm run dev:web
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Using the Open-Source CLI
```bash
npx @funneldoctor/core audit --file ./packages/core/sample-funnel.csv --url https://aura-direct-wear.com
```

---

## 📜 License
MIT License &copy; 2026 [Krrish Vimal](https://github.com/krrishvimal)
