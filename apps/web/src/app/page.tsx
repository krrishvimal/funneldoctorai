"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Cpu,
  Database,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Globe,
  HelpCircle,
  Info,
  Key,
  Laptop,
  Layers,
  Lightbulb,
  Lock,
  Maximize2,
  Mic,
  MicOff,
  Monitor,
  MoveRight,
  Play,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Terminal,
  TrendingDown,
  TrendingUp,
  Users,
  Volume2,
  Wand2,
  X,
  Zap,
} from "lucide-react";

// ==========================================
// DATASET DEFINITIONS (3 RICH INDIAN STARTUP FUNNELS)
// ==========================================
type DatasetId = "d2c" | "kyc" | "edtech";

interface FunnelStepData {
  id: string;
  name: string;
  visitors: number;
  conversionFromPrev: number; // e.g. 0.42
  dropoffRate: number; // e.g. 0.717
  dropoffCount: number;
  isBleedingBottleneck?: boolean;
}

interface HotspotPin {
  id: number;
  label: string;
  title: string;
  xPercent: number;
  yPercent: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  telemetryEvidence: string;
  heuristicViolated: string;
  geminiVisionFinding: string;
  prescribedFix: string;
}

interface DatasetDetails {
  id: DatasetId;
  name: string;
  tagline: string;
  companyCategory: string;
  overallConversion: number;
  monthlyVisitors: number;
  aov: number;
  monthlyLeakedRevenue: string;
  recoverableRevenue: string;
  bleedingStepName: string;
  bleedingDropRate: number;
  steps: FunnelStepData[];
  retentionMatrix: { cohort: string; w0: number; w1: number; w2: number; w3: number; w4: number; w5: number }[];
  hotspots: HotspotPin[];
  weightedRca: { pillar: string; weight: number; color: string; explanation: string }[];
  sqlPresets: { prompt: string; sql: string; resultRows: Record<string, string | number>[]; geminiTakeaway: string }[];
  prdMarkdown: string;
  brokenUiWireframeTitle: string;
  brokenUiItems: string[];
  redesignedUiTitle: string;
  redesignedUiFeatures: string[];
  codeDiff: string;
}

const DATASETS: Record<DatasetId, DatasetDetails> = {
  d2c: {
    id: "d2c",
    name: "QuickStyle D2C Fashion",
    tagline: "Omnichannel Streetwear & Apparel Checkout",
    companyCategory: "E-Commerce / D2C",
    overallConversion: 2.8,
    monthlyVisitors: 100000,
    aov: 1850,
    monthlyLeakedRevenue: "₹68.4 Lakhs/mo",
    recoverableRevenue: "₹26.0 Lakhs/mo (+38% Lift)",
    bleedingStepName: "Checkout & Address Wall (Step 4)",
    bleedingDropRate: 71.7,
    steps: [
      { id: "s1", name: "1. Homepage & Catalog", visitors: 100000, conversionFromPrev: 1.0, dropoffRate: 0.58, dropoffCount: 58000 },
      { id: "s2", name: "2. Product Details (PDP)", visitors: 42000, conversionFromPrev: 0.42, dropoffRate: 0.571, dropoffCount: 24000 },
      { id: "s3", name: "3. Bag & Cart Drawer", visitors: 18000, conversionFromPrev: 0.428, dropoffRate: 0.717, dropoffCount: 12900 },
      { id: "s4", name: "4. Checkout & Address Wall", visitors: 5100, conversionFromPrev: 0.283, dropoffRate: 0.717, dropoffCount: 3657, isBleedingBottleneck: true },
      { id: "s5", name: "5. Payment & Order Confirmed", visitors: 2800, conversionFromPrev: 0.549, dropoffRate: 0, dropoffCount: 0 },
    ],
    retentionMatrix: [
      { cohort: "Oct 2026", w0: 100, w1: 42, w2: 28, w3: 21, w4: 18, w5: 16 },
      { cohort: "Sep 2026", w0: 100, w1: 39, w2: 25, w3: 19, w4: 17, w5: 15 },
      { cohort: "Aug 2026", w0: 100, w1: 36, w2: 24, w3: 18, w4: 15, w5: 14 },
      { cohort: "Jul 2026", w0: 100, w1: 33, w2: 22, w3: 16, w4: 14, w5: 12 },
    ],
    hotspots: [
      {
        id: 1,
        label: "#1",
        title: "Forced 6-Field Account Login Wall",
        xPercent: 50,
        yPercent: 32,
        severity: "CRITICAL",
        telemetryEvidence: "64.2% of users abandon the page without focusing on the first input field.",
        heuristicViolated: "Nielsen #3: User Control & Freedom (Zero Guest Checkout option)",
        geminiVisionFinding: "Gemini Vision detected an intrusive, full-screen modal blocking the bag items with no visible close [X] icon on 390px viewports.",
        prescribedFix: "Enable 1-Tap OTP login and allow Guest Checkout with SMS order tracking.",
      },
      {
        id: 2,
        label: "#2",
        title: "Surprise ₹149 Delivery & Convenience Fee Surge",
        xPercent: 78,
        yPercent: 62,
        severity: "HIGH",
        telemetryEvidence: "Rage-click rate spikes to 38.4% on the order breakdown summary.",
        heuristicViolated: "Pricing Transparency & Trust Anxiety",
        geminiVisionFinding: "Free shipping promise on PDP is contradicted by a hidden ₹149 convenience fee injected at the final payment step.",
        prescribedFix: "Display an interactive 'Free Shipping Progress Meter' on the cart drawer and calculate taxes early.",
      },
      {
        id: 3,
        label: "#3",
        title: "UPI Intent Button Occluded Below Mobile Keyboard Fold",
        xPercent: 50,
        yPercent: 88,
        severity: "CRITICAL",
        telemetryEvidence: "Mobile conversion is 4.1x worse than desktop (1.8% vs 7.4%).",
        heuristicViolated: "Fitts's Law & Mobile Viewport Ergonomics",
        geminiVisionFinding: "When Android virtual keyboard opens for PIN entry, the primary green CTA is pushed 260px below the viewport scroll boundary.",
        prescribedFix: "Implement a persistent, CSS fixed-bottom sticky CTA bar with 1-Tap Google Pay & PhonePe.",
      },
    ],
    weightedRca: [
      { pillar: "UI/UX & Visual Friction", weight: 45, color: "bg-rose-500", explanation: "Forced login modal & below-the-fold CTA account for nearly half of checkout abandonment." },
      { pillar: "Hidden Fee Shock", weight: 30, color: "bg-amber-500", explanation: "Surprise ₹149 fee injected at the final commitment step triggers immediate sticker shock." },
      { pillar: "Mobile Android Latency", weight: 18, color: "bg-indigo-500", explanation: "P95 payment gateway redirect latency is 4.8 seconds on 4G networks." },
      { pillar: "Traffic Intent Mismatch", weight: 7, color: "bg-emerald-500", explanation: "Meta ad creative targeting mismatched sizes resulting in dead inventory clicks." },
    ],
    sqlPresets: [
      {
        prompt: "Compare Step 4 checkout drop-off by Device OS & App Version",
        sql: `SELECT device_os, app_version,
       COUNT(DISTINCT session_id) as total_sessions,
       ROUND(AVG(is_dropoff) * 100, 1) as dropoff_pct,
       ROUND(AVG(p95_api_latency_ms), 0) as avg_latency_ms
FROM checkout_telemetry_events
WHERE step_name = 'checkout_address'
GROUP BY 1, 2
ORDER BY dropoff_pct DESC;`,
        resultRows: [
          { device_os: "Android 13/14", app_version: "v4.2.1", total_sessions: "34,200", dropoff_pct: "78.4%", avg_latency_ms: "4,820ms" },
          { device_os: "iOS 17/18", app_version: "v4.2.1", total_sessions: "11,800", dropoff_pct: "52.1%", avg_latency_ms: "1,240ms" },
          { device_os: "Desktop Web", app_version: "Chrome/Safari", total_sessions: "5,000", dropoff_pct: "41.6%", avg_latency_ms: "820ms" },
        ],
        geminiTakeaway: "Android sessions experience 3.8x higher API latency and an acute 78.4% drop-off compared to iOS, directly tied to the unoptimized WebView input container.",
      },
      {
        prompt: "Correlate Payment Gateway Latency with Cart Abandonment",
        sql: `SELECT latency_bucket,
       COUNT(user_id) as attempts,
       ROUND(SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as success_rate
FROM upi_gateway_transactions
GROUP BY 1
ORDER BY 1 ASC;`,
        resultRows: [
          { latency_bucket: "< 1.5s", attempts: "14,200", success_rate: "89.4%" },
          { latency_bucket: "1.5s - 3.0s", attempts: "8,900", success_rate: "74.1%" },
          { latency_bucket: "> 3.0s (Spike)", attempts: "3,100", success_rate: "28.6%" },
        ],
        geminiTakeaway: "Transactions exceeding 3.0 seconds suffer a catastrophic 71.4% failure rate as users reflexively press back or cancel UPI intent.",
      },
    ],
    prdMarkdown: `# Product Requirements Document (PRD): Checkout Friction Elimination & UPI Acceleration
**Target Release:** Sprint 42 • **Author:** FunnelDoctor Autonomous AI PM
**Status:** Approved for Engineering Implementation • **Priority:** P0

## 1. Executive Summary & Root Cause
QuickStyle D2C loses ₹68.4 Lakhs/mo at Step 4 (Checkout & Address Wall) due to a 71.7% drop-off rate. 
Gemini Multimodal inspection identifies:
1. Forced 6-field account creation modal blocking guest users.
2. Undisclosed ₹149 delivery fee injected on final payment screen.
3. UPI intent CTA rendered below the fold on mobile devices.

## 2. Core Metrics & Expected Impact
- **Primary Metric:** Step 4 to 5 Conversion Rate (Target: 28.3% ➔ 45.0%).
- **Secondary Metric:** Mobile P95 Checkout Latency (< 1,800ms).
- **Financial Projection:** Recover ₹26.0 Lakhs/mo (+38% relative conversion lift).

## 3. RICE-Scored Engineering Backlog
| Rank | Feature / Task | Reach | Impact | Confidence | Effort | RICE Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P0** | Sticky Bottom Bar with 1-Tap UPI (GPay/PhonePe) | 5,100/mo | 3.0 (Huge) | 90% | 1.0 wk | **13,770** |
| **P0** | Free Shipping Progress Meter on Bag Drawer | 18,000/mo | 2.0 (High) | 85% | 0.5 wk | **61,200** |
| **P1** | 1-Click WhatsApp OTP Login & Guest Checkout | 5,100/mo | 2.0 (High) | 80% | 1.5 wk | **5,440** |

## 4. Technical Acceptance Criteria
- [ ] Primary CTA adheres to 54px touch target height and stays fixed at \`bottom-0\`.
- [ ] Full address pre-filled using Google Maps Places Autocomplete API.
- [ ] Zero cumulative layout shifts (\`CLS < 0.05\`) on Android WebView.`,
    brokenUiWireframeTitle: "Current Broken UI (Step 4)",
    brokenUiItems: [
      "❌ Mandatory 6-Field Account Creation Form",
      "❌ No Guest Checkout Option",
      "❌ Hidden ₹149 Surcharge Added at Final Click",
      "❌ CTA Hidden 260px Below Keyboard Fold",
    ],
    redesignedUiTitle: "Gemini Redesigned High-Converting UI (+38% Lift)",
    redesignedUiFeatures: [
      "⚡ 1-Tap Google Pay & PhonePe Sticky Bottom Bar",
      "🚚 Upfront Free-Shipping Eligibility Bar",
      "🔑 1-Click WhatsApp OTP Verification",
      "🛡️ Verified 256-Bit SSL Trust Badges",
    ],
    codeDiff: `// Redesigned High-Converting Sticky Checkout Component
import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export function ExpressCheckoutBar({ cartTotal = 1850, onPay }: { cartTotal?: number; onPay?: () => void }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FREE EXPRESS DELIVERY UNLOCKED</span>
        </div>
        <p className="text-xl font-extrabold text-white">₹{cartTotal.toLocaleString()}</p>
      </div>

      <button 
        onClick={onPay}
        className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
      >
        <Zap className="w-4 h-4 fill-slate-950" />
        <span>1-TAP UPI FAST-PAY</span>
      </button>
    </div>
  );
}`,
  },
  kyc: {
    id: "kyc",
    name: "FinPulse Neo Bank (Video-KYC)",
    tagline: "Digital Savings & Credit Line Onboarding",
    companyCategory: "Fintech / Banking",
    overallConversion: 10.1,
    monthlyVisitors: 80000,
    aov: 4200,
    monthlyLeakedRevenue: "₹1.12 Cr/mo",
    recoverableRevenue: "₹42.8 Lakhs/mo (+38% Lift)",
    bleedingStepName: "Aadhaar Video-KYC (Step 4)",
    bleedingDropRate: 74.8,
    steps: [
      { id: "s1", name: "1. App Install & Open", visitors: 80000, conversionFromPrev: 1.0, dropoffRate: 0.15, dropoffCount: 12000 },
      { id: "s2", name: "2. Mobile OTP Verification", visitors: 68000, conversionFromPrev: 0.85, dropoffRate: 0.338, dropoffCount: 23000 },
      { id: "s3", name: "3. PAN & Credit Check", visitors: 45000, conversionFromPrev: 0.662, dropoffRate: 0.748, dropoffCount: 33700 },
      { id: "s4", name: "4. Live Aadhaar Video-KYC", visitors: 11300, conversionFromPrev: 0.251, dropoffRate: 0.748, dropoffCount: 8452, isBleedingBottleneck: true },
      { id: "s5", name: "5. Active Credit Account", visitors: 8100, conversionFromPrev: 0.716, dropoffRate: 0, dropoffCount: 0 },
    ],
    retentionMatrix: [
      { cohort: "Oct 2026", w0: 100, w1: 68, w2: 54, w3: 48, w4: 42, w5: 39 },
      { cohort: "Sep 2026", w0: 100, w1: 65, w2: 51, w3: 45, w4: 40, w5: 37 },
      { cohort: "Aug 2026", w0: 100, w1: 61, w2: 48, w3: 42, w4: 38, w5: 35 },
      { cohort: "Jul 2026", w0: 100, w1: 58, w2: 46, w3: 39, w4: 36, w5: 33 },
    ],
    hotspots: [
      {
        id: 1,
        label: "#1",
        title: "Front-Camera Permission Denial with Zero Recovery UX",
        xPercent: 50,
        yPercent: 30,
        severity: "CRITICAL",
        telemetryEvidence: "42% of mobile drop-offs trigger an unhandled 'CAMERA_DENIED' JavaScript error.",
        heuristicViolated: "Nielsen #9: Help Users Recognize, Diagnose, and Recover from Errors",
        geminiVisionFinding: "When Android denies system camera prompt, the app displays a blank dark grey box without an 'Open Settings' deep-link button.",
        prescribedFix: "Implement a warm-up permissions preview screen with an OS deep-link recovery modal.",
      },
      {
        id: 2,
        label: "#2",
        title: "15-Second Hard Timeout on 4G Video Stream",
        xPercent: 80,
        yPercent: 58,
        severity: "HIGH",
        telemetryEvidence: "Drop-off spikes in Tier 2/3 cities where latency exceeds 800ms.",
        heuristicViolated: "System Status Visibility & Reliability",
        geminiVisionFinding: "The WebRTC stream kills the connection abruptly without attempting packet downscaling or fallback audio verification.",
        prescribedFix: "Implement adaptive WebRTC bitrate degradation and 45s fallback buffer.",
      },
      {
        id: 3,
        label: "#3",
        title: "Ambiguous 'Waiting for Agent' Queue Counter",
        xPercent: 50,
        yPercent: 82,
        severity: "HIGH",
        telemetryEvidence: "Average wait time is 4m 12s, but users exit after 45 seconds.",
        heuristicViolated: "Expectation Management & Cognitive Load",
        geminiVisionFinding: "The screen shows a static spinner with zero indication of queue position or estimated wait minutes.",
        prescribedFix: "Add a live queue counter ('Position #2 - ~1m wait') and offer scheduled callback appointments.",
      },
    ],
    weightedRca: [
      { pillar: "Technical Video-WebRTC Latency", weight: 42, color: "bg-indigo-500", explanation: "Camera permission drops and WebRTC socket disconnects drive the bulk of failed calls." },
      { pillar: "Queue Anxiety & Expectation Mismatch", weight: 32, color: "bg-rose-500", explanation: "Indefinite spinner with no estimated wait time causes panic abandonment." },
      { pillar: "Form Re-entry Friction", weight: 16, color: "bg-amber-500", explanation: "Requiring manual typing of 12-digit Aadhaar instead of DigiLocker XML fetch." },
      { pillar: "Branch Opening Reluctance", weight: 10, color: "bg-emerald-500", explanation: "Older demographics preferring in-person branch assistance." },
    ],
    sqlPresets: [
      {
        prompt: "Check WebRTC Video-KYC Drop-off by Network Speed Bucket",
        sql: `SELECT network_type, 
       COUNT(*) as kyc_sessions,
       ROUND(AVG(webrtc_latency_ms), 0) as avg_latency,
       ROUND(SUM(CASE WHEN kyc_status = 'ABANDONED' THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 1) as dropoff_pct
FROM kyc_telemetry_logs
GROUP BY 1
ORDER BY dropoff_pct DESC;`,
        resultRows: [
          { network_type: "Cellular 4G (Tier 2/3)", kyc_sessions: "38,400", avg_latency: "1,420ms", dropoff_pct: "81.2%" },
          { network_type: "Cellular 5G", kyc_sessions: "28,100", avg_latency: "280ms", dropoff_pct: "54.0%" },
          { network_type: "Broadband Wi-Fi", kyc_sessions: "13,500", avg_latency: "140ms", dropoff_pct: "36.8%" },
        ],
        geminiTakeaway: "Over 81% of Tier-2 4G users fail video verification due to rigid WebRTC bitrate locks. Adding dynamic downscaling will instantly recover 22% of dropouts.",
      },
    ],
    prdMarkdown: `# Product Requirements Document (PRD): Video-KYC Friction Removal
**Target:** FinPulse Neo-Bank • **Priority:** P0 • **Expected Recovery:** ₹42.8 Lakhs/mo

## 1. Objective
Reduce Aadhaar Video-KYC drop-off from 74.8% to 42.0% within 30 days by resolving permissions barriers and providing clear queue status.

## 2. Key User Stories
- **US-1:** As a user on 4G, I want the video stream to adaptively downscale so my call doesn't terminate on network fluctuations.
- **US-2:** As a busy applicant, I want to see my exact queue position and estimated wait time, or schedule an automated callback.`,
    brokenUiWireframeTitle: "Current Broken Video-KYC Screen",
    brokenUiItems: [
      "❌ Blank Grey Box on Camera Permission Denial",
      "❌ Indefinite Spinner with No Queue Position",
      "❌ Abrupt 15s Disconnect on Low Bandwidth",
      "❌ No Scheduled Callback Option",
    ],
    redesignedUiTitle: "Gemini Adaptive KYC Room (+42% Lift)",
    redesignedUiFeatures: [
      "⚡ Pre-Call Camera & Mic Warmup Check",
      "🕒 Live Queue Counter ('Position #2 • ~1 min')",
      "📶 Adaptive 360p WebRTC Auto-Downscaling",
      "📅 1-Tap 'Schedule Video Call for Tomorrow' Button",
    ],
    codeDiff: `// Adaptive WebRTC Warmup & Queue Status Component
import React, { useState } from 'react';
import { Camera, Clock, Calendar } from 'lucide-react';

export function KYCQueueRoom({ queuePosition = 2, estMinutes = 1 }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center max-w-sm mx-auto shadow-2xl">
      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
        <Camera className="w-8 h-8 animate-pulse" />
      </div>
      <h3 className="font-extrabold text-white text-base">Bank Officer Connecting</h3>
      <p className="text-xs text-slate-400 mt-1">Queue Position: #{queuePosition} • ~{estMinutes} min wait</p>
      
      <button className="mt-5 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
        <span>Schedule for Later</span>
      </button>
    </div>
  );
}`,
  },
  edtech: {
    id: "edtech",
    name: "PrepMate IIT-JEE Prep",
    tagline: "Test Prep & Rank Predictor Paywall",
    companyCategory: "EdTech / SaaS",
    overallConversion: 1.33,
    monthlyVisitors: 120000,
    aov: 5200,
    monthlyLeakedRevenue: "₹84.0 Lakhs/mo",
    recoverableRevenue: "₹31.9 Lakhs/mo (+38% Lift)",
    bleedingStepName: "Annual Pro Paywall (Step 4)",
    bleedingDropRate: 96.5,
    steps: [
      { id: "s1", name: "1. Free Mock Test", visitors: 120000, conversionFromPrev: 1.0, dropoffRate: 0.183, dropoffCount: 22000 },
      { id: "s2", name: "2. Detailed Scorecard", visitors: 98000, conversionFromPrev: 0.816, dropoffRate: 0.448, dropoffCount: 44000 },
      { id: "s3", name: "3. AIR Rank Predictor", visitors: 54000, conversionFromPrev: 0.551, dropoffRate: 0.965, dropoffCount: 52100 },
      { id: "s4", name: "4. Annual Pro Paywall", visitors: 1900, conversionFromPrev: 0.035, dropoffRate: 0.965, dropoffCount: 300, isBleedingBottleneck: true },
      { id: "s5", name: "5. Enrolled Paid Subscriber", visitors: 1600, conversionFromPrev: 0.842, dropoffRate: 0, dropoffCount: 0 },
    ],
    retentionMatrix: [
      { cohort: "Oct 2026", w0: 100, w1: 72, w2: 60, w3: 55, w4: 51, w5: 48 },
      { cohort: "Sep 2026", w0: 100, w1: 69, w2: 57, w3: 52, w4: 48, w5: 45 },
      { cohort: "Aug 2026", w0: 100, w1: 65, w2: 53, w3: 49, w4: 45, w5: 42 },
      { cohort: "Jul 2026", w0: 100, w1: 61, w2: 50, w3: 46, w4: 42, w5: 39 },
    ],
    hotspots: [
      {
        id: 1,
        label: "#1",
        title: "Rigid ₹18,000 Upfront Annual Commitment",
        xPercent: 50,
        yPercent: 40,
        severity: "CRITICAL",
        telemetryEvidence: "96.5% of high-intent students abandon within 8 seconds of seeing the price tag.",
        heuristicViolated: "Pricing Psychology & Commitment Staircase",
        geminiVisionFinding: "Zero monthly (₹999/mo) or no-cost EMI options provided; student users have no authority to approve large card charges.",
        prescribedFix: "Add a 3-month ₹1,499 quarterly tier and No-Cost EMI with Bajaj Finserv.",
      },
      {
        id: 2,
        label: "#2",
        title: "Intrusive 60-Second Countdown Panic Modal",
        xPercent: 78,
        yPercent: 20,
        severity: "HIGH",
        telemetryEvidence: "Back-button exit rate is 88.2% immediately upon timer activation.",
        heuristicViolated: "Dark Pattern Friction & Anxiety Induction",
        geminiVisionFinding: "Flashy red countdown banner triggers high anxiety for students seeking serious academic guidance.",
        prescribedFix: "Replace countdown timer with institutional trust credentials (IIT Alumni faculty list).",
      },
      {
        id: 3,
        label: "#3",
        title: "Missing 'Share Payment Link with Parents' Trigger",
        xPercent: 50,
        yPercent: 80,
        severity: "CRITICAL",
        telemetryEvidence: "76% of student survey responses cite: 'Had to ask dad to pay from his phone'.",
        heuristicViolated: "Payer vs. User Divergence in Indian EdTech",
        geminiVisionFinding: "The checkout only supports card/UPI directly on the student's phone, with zero WhatsApp payment link forwarding.",
        prescribedFix: "Introduce a 1-Tap 'Send UPI Payment Link to Papa on WhatsApp' button.",
      },
    ],
    weightedRca: [
      { pillar: "Pricing Model & Payment Divergence", weight: 52, color: "bg-rose-500", explanation: "Students lack the ability to pay ₹18,000 without forwarding the link to parents." },
      { pillar: "Panic Countdown Dark Patterns", weight: 26, color: "bg-amber-500", explanation: "Aggressive timer banners scare off students looking for transparent academic prep." },
      { pillar: "Lack of Free Trial Micro-Tier", weight: 14, color: "bg-indigo-500", explanation: "No low-risk 7-day trial before full commitment." },
      { pillar: "Organic Intent Drop", weight: 8, color: "bg-emerald-500", explanation: "General interest users checking predicted ranks with zero purchase intent." },
    ],
    sqlPresets: [
      {
        prompt: "Analyze Student Paywall Drop-off by Price Plan Selected",
        sql: `SELECT plan_name, price_inr, 
       COUNT(DISTINCT user_id) as views,
       ROUND(AVG(is_completed) * 100, 2) as conversion_rate
FROM subscription_attempts
GROUP BY 1, 2
ORDER BY conversion_rate DESC;`,
        resultRows: [
          { plan_name: "Annual Plan (Full Access)", price_inr: "₹18,000", views: "52,100", conversion_rate: "3.5%" },
          { plan_name: "Quarterly Pilot (Hidden)", price_inr: "₹3,999", views: "1,200", conversion_rate: "18.4%" },
        ],
        geminiTakeaway: "The hidden quarterly plan converts at 5.2x higher rate than the annual lump-sum. Surfacing flexible tiers will immediately triple revenue throughput.",
      },
    ],
    prdMarkdown: `# Product Requirements Document (PRD): Paywall Re-architecture & WhatsApp Parent Flow
**Target:** PrepMate IIT-JEE • **Priority:** P0 • **Expected Recovery:** ₹31.9 Lakhs/mo

## 1. Problem Statement
96.5% of students abandon Step 4 because they are presented with an ₹18,000 lump sum and have no way to forward the bill to their parents.

## 2. Core User Stories
- **US-1 (Parent Link):** As a high school student, I want to tap 'Send WhatsApp Payment Link to Parents' so my father can pay directly from his UPI.
- **US-2 (Staircase Pricing):** As an applicant, I want to subscribe for ₹1,499/mo or use No-Cost EMI.`,
    brokenUiWireframeTitle: "Current Broken Paywall",
    brokenUiItems: [
      "❌ ₹18,000 Annual Only (No Monthly/EMI)",
      "❌ Panic 60-Second Countdown Modal",
      "❌ No WhatsApp Share to Parents Button",
      "❌ Zero Free Trial Access",
    ],
    redesignedUiTitle: "Gemini High-Converting Parent-Student Paywall (+48% Lift)",
    redesignedUiFeatures: [
      "📱 1-Tap 'Send UPI Bill to Papa on WhatsApp'",
      "💳 ₹1,499/mo Flexible Quarterly Staircase Tier",
      "🎓 IIT Bombay Faculty Trust Credentials",
      "✨ 7-Day 100% Refund Money-Back Guarantee",
    ],
    codeDiff: `// WhatsApp Parent Forwarding & Flexible Paywall Component
import React from 'react';
import { Send, ShieldCheck } from 'lucide-react';

export function StudentPaywallCard({ onSendWhatsApp }: { onSendWhatsApp?: () => void }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center max-w-sm mx-auto">
      <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
        IIT-JEE CRACKER BATCH 2027
      </span>
      <h3 className="text-xl font-extrabold text-white mt-2">₹1,499 <span className="text-xs text-slate-400 font-normal">/ month</span></h3>
      
      <button 
        onClick={onSendWhatsApp}
        className="mt-5 w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
      >
        <Send className="w-4 h-4" />
        <span>Send Payment Link to Papa on WhatsApp</span>
      </button>
    </div>
  );
}`,
  },
};

export default function FunnelDoctorApp() {
  // Navigation & View Mode State
  const [viewMode, setViewMode] = useState<"website" | "workspace">("website");
  const [activeDatasetId, setActiveDatasetId] = useState<DatasetId>("d2c");
  const [activeTab, setActiveTab] = useState<"telemetry" | "vision" | "rca" | "prd" | "warroom">("telemetry");

  // API Key & Settings Modal
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [tempApiKeyInput, setTempApiKeyInput] = useState<string>("");

  // Live Hero Audit Simulation Progress Modal
  const [isAuditingHero, setIsAuditingHero] = useState<boolean>(false);
  const [auditProgressStep, setAuditProgressStep] = useState<number>(0);
  const [heroUrlInput, setHeroUrlInput] = useState<string>("https://quickstyle-d2c.in/checkout");

  // Interactive UI Fix Studio Toggle (Tab 4)
  const [uiFixViewMode, setUiFixViewMode] = useState<"broken" | "redesigned" | "code">("redesigned");

  // Vision X-Ray Selected Pin (Tab 2)
  const [selectedPinId, setSelectedPinId] = useState<number>(1);
  const [uploadedVisionImage, setUploadedVisionImage] = useState<string | null>(null);
  const [visionAnalyzing, setVisionAnalyzing] = useState<boolean>(false);

  // SQL Lab Selected Preset (Tab 3)
  const [selectedSqlPresetIdx, setSelectedSqlPresetIdx] = useState<number>(0);

  // AI PM Voice War Room (Tab 5)
  const [voiceMessages, setVoiceMessages] = useState<
    { sender: "user" | "ai"; text: string; timestamp: string }[]
  >([
    {
      sender: "ai",
      text: "Hello! I am your Autonomous Principal AI PM. I've correlated your Step 4 drop-off telemetry with the mobile UI vision x-ray. What would you like to drill into?",
      timestamp: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState<boolean>(false);

  // ROI Calculator Sliders (Website Part 1)
  const [calcVisitors, setCalcVisitors] = useState<number>(100000);
  const [calcDropRate, setCalcDropRate] = useState<number>(71);
  const [calcAov, setCalcAov] = useState<number>(1850);

  // 60-Sec Judge Pitch Script Modal
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dataset = DATASETS[activeDatasetId];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync API Key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("funneldoctor_gemini_key");
    if (saved) {
      setGeminiApiKey(saved);
      setTempApiKeyInput(saved);
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem("funneldoctor_gemini_key", tempApiKeyInput.trim());
    setGeminiApiKey(tempApiKeyInput.trim());
    setShowSettingsModal(false);
    showToast("Gemini 2.5 API Key Saved Successfully");
  };

  // Launch Live AI Diagnosis from Website Hero
  const handleLaunchHeroDiagnosis = (targetDataset: DatasetId = "d2c") => {
    setActiveDatasetId(targetDataset);
    setIsAuditingHero(true);
    setAuditProgressStep(1);

    setTimeout(() => setAuditProgressStep(2), 700);
    setTimeout(() => setAuditProgressStep(3), 1400);
    setTimeout(() => {
      setIsAuditingHero(false);
      setViewMode("workspace");
      setActiveTab("telemetry");
      showToast(`Audit Complete: Loaded ${DATASETS[targetDataset].name}`);
    }, 2100);
  };

  // Copy helpers
  const copyToClipboard = (text: string, label: string = "Content") => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  // Browser Voice Input (SpeechRecognition) & Output (SpeechSynthesis)
  const handleToggleVoiceRecording = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("Web Speech API not supported in this browser. Use text input!");
      return;
    }

    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListeningVoice(true);
      recognition.onend = () => setIsListeningVoice(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendVoiceQuery(transcript);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListeningVoice(false);
    }
  };

  const handleSendVoiceQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const newMsg = {
      sender: "user" as const,
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setVoiceMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    // Simulate AI response based on dataset context
    setTimeout(() => {
      let reply = "";
      const q = queryText.toLowerCase();

      if (q.includes("summary") || q.includes("executive") || q.includes("why")) {
        reply = `Executive Summary: At Step 4 (${dataset.bleedingStepName}), you are losing ${dataset.bleedingDropRate}% of prospective users. Correlating SQL telemetry with Gemini Vision reveals that 64% of users exit due to the forced login wall and hidden fees. Deploying our fixed 1-Tap UPI component will recover an estimated ${dataset.recoverableRevenue}.`;
      } else if (q.includes("first") || q.includes("deploy") || q.includes("fix") || q.includes("engineer")) {
        reply = `Top Engineering Priority: Implement the Sticky 1-Tap UPI Bottom Bar (P0 RICE score 13,770). It immediately bypasses keyboard occlusion on Android 13/14 and stops the 71.7% drop-off in less than 2 days of dev effort.`;
      } else {
        reply = `Understood. Cross-referencing your event telemetry logs with the Gemini Vision X-Ray confirms this friction point directly accounts for ${dataset.monthlyLeakedRevenue} in leaked revenue. Review the Auto-PRD tab for exact technical acceptance criteria.`;
      }

      setVoiceMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // Speak reply via SpeechSynthesis
      if ("speechSynthesis" in window) {
        setIsSpeakingAudio(true);
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.rate = 1.05;
        utterance.onend = () => setIsSpeakingAudio(false);
        window.speechSynthesis.speak(utterance);
      }
    }, 900);
  };

  // Custom Screenshot Upload Simulation for Tab 2
  const handleUploadCustomScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVisionAnalyzing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedVisionImage(event.target?.result as string);
      setTimeout(() => {
        setVisionAnalyzing(false);
        showToast("Gemini Vision X-Ray Analysis Complete!");
      }, 1600);
    };
    reader.readAsDataURL(file);
  };

  // ROI Math
  const calculatedLeaked = Math.round(calcVisitors * (calcDropRate / 100) * calcAov);
  const calculatedRecoverable = Math.round(calculatedLeaked * 0.22); // Conservative 22% lift

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400 flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================== */}
      {/* GLOBAL PERSISTENT HEADER (TOP BAR)          */}
      {/* ========================================== */}
      <header className="sticky top-0 z-40 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setViewMode("website")}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  FunnelDoctor<span className="text-indigo-400 font-black">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hidden sm:inline">
                  Google Gemini 2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Autonomous Multimodal Conversion & RCA Agent
              </p>
            </div>
          </div>

          {/* Persistent Mode Switcher: Website vs App Workspace */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setViewMode("website")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "website"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Product Website</span>
              </button>
              <button
                onClick={() => setViewMode("workspace")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "workspace"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Live App Workspace</span>
              </button>
            </div>

            {/* Gemini API Key Button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                geminiApiKey
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {geminiApiKey ? "Gemini Active" : "API Key"}
              </span>
              <Settings className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* VIEW MODE A: THE PUBLIC SAAS MARKETING WEBSITE (STORYTELLING LANDING PAGE) */}
      {/* ========================================================================= */}
      {viewMode === "website" && (
        <div className="flex-1 flex flex-col">
          {/* HERO SECTION */}
          <section className="relative pt-12 pb-20 px-4 md:px-8 overflow-hidden border-b border-slate-800/80">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 mb-6 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>🏆 Built for Startup Buildathon India 2026</span>
                <span className="text-slate-500">•</span>
                <span className="text-indigo-400 font-bold">Multimodal AI Product Analyst</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
                Your Checkout Funnel Is Leaking Revenue.{" "}
                <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                  Our Multimodal AI Finds Why
                </span>
                —And Writes The Fix in 60 Seconds.
              </h1>

              {/* Subheadline */}
              <p className="mt-5 text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
                FunnelDoctor AI combines <strong>Quantitative Funnel Telemetry</strong> (SQL & Event Logs) with{" "}
                <strong>Qualitative Gemini Vision</strong> (UI Screenshot X-Rays) to pinpoint exact drop-off root causes, generate an executive PRD, and output ready-to-ship redesigned UI code.
              </p>

              {/* Interactive Hero Audit Bar */}
              <div className="w-full max-w-2xl mt-8 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-2 flex-1 w-full px-2">
                  <Search className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={heroUrlInput}
                    onChange={(e) => setHeroUrlInput(e.target.value)}
                    placeholder="https://quickstyle-d2c.in/checkout"
                    className="w-full bg-transparent text-xs md:text-sm text-slate-200 focus:outline-none font-mono"
                  />
                </div>
                <button
                  onClick={() => handleLaunchHeroDiagnosis(activeDatasetId)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold text-xs md:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run Live AI Diagnosis ➔</span>
                </button>
              </div>

              {/* Instant 3 Demo Dataset Chips */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Or test real startup data:</span>
                <button
                  onClick={() => handleLaunchHeroDiagnosis("d2c")}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition flex items-center gap-1.5"
                >
                  <span>🛍️ D2C Fashion Checkout</span>
                  <span className="text-rose-400 font-bold font-mono">(-71.7% Drop)</span>
                </button>
                <button
                  onClick={() => handleLaunchHeroDiagnosis("kyc")}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition flex items-center gap-1.5"
                >
                  <span>💳 Fintech Video-KYC</span>
                  <span className="text-rose-400 font-bold font-mono">(-74.8% Drop)</span>
                </button>
                <button
                  onClick={() => handleLaunchHeroDiagnosis("edtech")}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition flex items-center gap-1.5"
                >
                  <span>🎓 EdTech Paywall</span>
                  <span className="text-rose-400 font-bold font-mono">(-96.5% Drop)</span>
                </button>
              </div>

              {/* Floating Hero Visual Preview Card */}
              <div className="mt-12 w-full max-w-4xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-slate-300 font-semibold">
                      Live Telemetry + Vision Fusion Engine
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +38% Projected Conversion Lift
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  {/* Left: Bleeding Funnel Chart Card */}
                  <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-rose-400 font-mono font-bold uppercase">
                        1. Quantitative Telemetry
                      </span>
                      <h4 className="font-bold text-sm text-slate-200 mt-1">Bleeding Step 4</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        18,000 Bag Visitors ➔ 5,100 Address Checkouts (<strong>-71.7% Churn</strong>).
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500">Revenue Leaked:</span>
                      <p className="text-base font-extrabold text-rose-400">₹68.4 Lakhs/mo</p>
                    </div>
                  </div>

                  {/* Middle: Screen X-Ray with Red Hotspot Pins */}
                  <div className="p-4 bg-slate-950/70 rounded-2xl border border-rose-500/30 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/40">
                      Gemini Vision X-Ray
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase">
                        2. Qualitative Spatial X-Ray
                      </span>
                      <h4 className="font-bold text-sm text-slate-200 mt-1">3 Visual Friction Pins</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        • #1 Forced Account Login Wall
                        <br />
                        • #2 Hidden ₹149 Convenience Surcharge
                        <br />• #3 UPI CTA Below Virtual Keyboard
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Nielsen Heuristics:</span>
                      <span className="text-rose-400 font-bold">3 Violations</span>
                    </div>
                  </div>

                  {/* Right: Auto-Generated Redesign & Code */}
                  <div className="p-4 bg-slate-950/70 rounded-2xl border border-emerald-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                        3. Auto-Remediation
                      </span>
                      <h4 className="font-bold text-sm text-slate-200 mt-1">Ready-to-Ship Code Fix</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Sticky 1-Tap UPI Express component + complete engineering PRD generated in 60s.
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500">Recoverable Revenue:</span>
                      <p className="text-base font-extrabold text-emerald-400">₹26.0 Lakhs/mo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: THE OLD BROKEN WAY VS. FUNNELDOCTOR AI */}
          <section id="problem" className="py-20 px-4 md:px-8 border-b border-slate-800/80">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                  The Workflow Revolution
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-2">
                  The Old Broken Way vs. The FunnelDoctor AI Way
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Why traditional analytics dashboards leave founders stuck guessing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* The Old Broken Way */}
                <div className="bg-slate-900/50 border border-rose-500/30 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-4">
                      <X className="w-5 h-5" />
                      <span>THE OLD BROKEN WORKFLOW (Takes 3 Weeks)</span>
                    </div>
                    <ul className="flex flex-col gap-3.5 text-xs text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-400 shrink-0 font-bold font-mono">1.</span>
                        <span>
                          <strong>Mixpanel / GA4 only show the number:</strong> They tell you 70% of people left, but never explain *why* or what visual bug caused it.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-400 shrink-0 font-bold font-mono">2.</span>
                        <span>
                          <strong>Watching 50+ Hours of Replay Videos:</strong> Founders and PMs spend weeks watching session replays in Hotjar trying to spot patterns manually.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-400 shrink-0 font-bold font-mono">3.</span>
                        <span>
                          <strong>Weeks of Internal Debate:</strong> Designers argue about button colors while engineers argue about API latency.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-400 shrink-0 font-bold font-mono">4.</span>
                        <span>
                          <strong>Manual PRD Writing:</strong> Writing requirements, user stories, and acceptance criteria drags on for 2 sprints before code is touched.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-rose-400 font-mono">
                    Avg. Time to Ship Fix: 18 - 24 Days
                  </div>
                </div>

                {/* The FunnelDoctor AI Way */}
                <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
                      <Check className="w-5 h-5" />
                      <span>THE FUNNELDOCTOR AI WORKFLOW (Takes 60 Seconds)</span>
                    </div>
                    <ul className="flex flex-col gap-3.5 text-xs text-slate-200">
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 shrink-0 font-bold font-mono">1.</span>
                        <span>
                          <strong>Upload Funnel Data + Screen:</strong> Simply paste your checkout URL and funnel numbers or sync with your existing analytics.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 shrink-0 font-bold font-mono">2.</span>
                        <span>
                          <strong>Gemini Omni Vision Spots Visual Friction:</strong> Instantly detects keyboard occlusion, surprise shipping fees, and dark pattern layout shifts.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 shrink-0 font-bold font-mono">3.</span>
                        <span>
                          <strong>Google Agent Skills SQL Verification:</strong> Writes and executes segmented queries across OS versions and API response times.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 shrink-0 font-bold font-mono">4.</span>
                        <span>
                          <strong>Ready-to-Ship Code + PRD in 60s:</strong> Generates a full engineering PRD with RICE prioritization and copyable React + Tailwind code.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-emerald-400 font-mono font-bold">
                    Avg. Time to Ship Fix: 60 Seconds ⚡
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: 4-STAGE GOOGLE AI ARCHITECTURE */}
          <section id="architecture" className="py-20 px-4 md:px-8 border-b border-slate-800/80 bg-slate-950/40">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                  Technical Innovation
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-2">
                  Our 4-Stage Google AI Architecture
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Built on Google Cloud and Gemini 2.5 multimodal foundational models.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold mb-3">
                      01
                    </div>
                    <h3 className="font-bold text-sm text-white">Funnel & Cohort Telemetry</h3>
                    <p className="text-xs text-indigo-400 font-mono mt-0.5">Cloud SQL + BigQuery</p>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                      Ingests event drops and isolates the exact cohort, OS version, and checkout step bleeding revenue.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold mb-3">
                      02
                    </div>
                    <h3 className="font-bold text-sm text-white">Multimodal Vision X-Ray</h3>
                    <p className="text-xs text-emerald-400 font-mono mt-0.5">Gemini 2.5 Flash Vision</p>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                      Scans mobile and desktop viewports to spot dark patterns, keyboard occlusion, and Nielsen heuristic flaws.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold mb-3">
                      03
                    </div>
                    <h3 className="font-bold text-sm text-white">Root-Cause SQL Lab</h3>
                    <p className="text-xs text-amber-400 font-mono mt-0.5">Google Agent Skills</p>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                      Autonomously generates and executes segmented SQL queries to prove whether drops are UX- or latency-driven.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold mb-3">
                      04
                    </div>
                    <h3 className="font-bold text-sm text-white">Auto-PRD & Code Fix</h3>
                    <p className="text-xs text-purple-400 font-mono mt-0.5">Gemini Code Synthesis</p>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                      Outputs a production-grade Product Requirements Document and copyable React + Tailwind component.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: INTERACTIVE REVENUE LEAKAGE & ROI CALCULATOR */}
          <section id="calculator" className="py-20 px-4 md:px-8 border-b border-slate-800/80">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
              <div className="text-center mb-8">
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                  Interactive Financial Model
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                  How Much Revenue Is Your Checkout Funnel Leaking?
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust your metrics to calculate monthly leaked revenue and your conservative recovery potential.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Sliders */}
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                      <span>Monthly Funnel Visitors</span>
                      <span className="text-indigo-400 font-mono">{calcVisitors.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="10000"
                      value={calcVisitors}
                      onChange={(e) => setCalcVisitors(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                      <span>Checkout Drop-Off Rate (%)</span>
                      <span className="text-rose-400 font-mono">{calcDropRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="90"
                      step="1"
                      value={calcDropRate}
                      onChange={(e) => setCalcDropRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                      <span>Average Order Value (₹)</span>
                      <span className="text-emerald-400 font-mono">₹{calcAov.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="250"
                      value={calcAov}
                      onChange={(e) => setCalcAov(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center flex flex-col justify-between shadow-xl">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Monthly Revenue Leaked
                    </span>
                    <p className="text-2xl md:text-3xl font-extrabold text-rose-400 mt-1">
                      ₹{(calculatedLeaked / 100000).toFixed(1)} Lakhs
                      <span className="text-xs font-normal text-slate-500"> / month</span>
                    </p>
                  </div>

                  <div className="my-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[11px] text-emerald-300 uppercase font-extrabold">
                      Recoverable with FunnelDoctor AI (+22% lift)
                    </span>
                    <p className="text-xl md:text-2xl font-black text-emerald-400 mt-1">
                      +₹{(calculatedRecoverable / 100000).toFixed(1)} Lakhs/mo
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setViewMode("workspace");
                      setActiveTab("prd");
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    <span>Recover This Revenue Now ➔</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: TRANSPARENT SAAS PRICING TIERS */}
          <section id="pricing" className="py-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto text-center">
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                Simple Pricing
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1">
                Predictable Pricing for High-Growth Startups
              </h2>
              <p className="text-sm text-slate-400 mt-1 mb-12">
                100x cheaper than hiring an agency. 100x faster than traditional analytics.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Tier 1: Starter */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white">Starter Sandbox</h3>
                    <p className="text-xs text-slate-400 mt-1">For early-stage side projects</p>
                    <div className="mt-4 mb-6">
                      <span className="text-2xl font-black text-white">Free</span>
                      <span className="text-xs text-slate-400"> / forever</span>
                    </div>
                    <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>1 Funnel Audit per month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Gemini Vision UI X-Ray</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Basic RCA Diagnostics</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setViewMode("workspace")}
                    className="mt-6 w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-white transition"
                  >
                    Start Free
                  </button>
                </div>

                {/* Tier 2: Growth Pro (POPULAR) */}
                <div className="bg-gradient-to-b from-indigo-900/60 to-slate-900 border-2 border-indigo-500 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] uppercase font-black px-3 py-0.5 rounded-full shadow-md">
                    MOST POPULAR
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Growth Pro</h3>
                    <p className="text-xs text-slate-400 mt-1">For scaling D2C, SaaS & Fintech apps</p>
                    <div className="mt-4 mb-6">
                      <span className="text-2xl font-black text-white">₹4,999</span>
                      <span className="text-xs text-slate-400"> ($59) / mo</span>
                    </div>
                    <ul className="flex flex-col gap-2.5 text-xs text-slate-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Unlimited Funnel Audits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Natural-Language-to-SQL Lab</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Auto-PRD & React Code Fix Studio</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Gemini Live Voice PM War Room</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setViewMode("workspace")}
                    className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg transition"
                  >
                    Launch Pro Workspace
                  </button>
                </div>

                {/* Tier 3: Enterprise */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white">Enterprise Autopilot</h3>
                    <p className="text-xs text-slate-400 mt-1">For enterprise data engineering teams</p>
                    <div className="mt-4 mb-6">
                      <span className="text-2xl font-black text-white">₹19,999</span>
                      <span className="text-xs text-slate-400"> ($249) / mo</span>
                    </div>
                    <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Real-time GA4/PostHog Webhook Sync</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Weekly Slack Root-Cause Alerts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Custom Cloud SQL / BigQuery Pipelines</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setViewMode("workspace")}
                    className="mt-6 w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-white transition"
                  >
                    Contact Enterprise
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-800/80 px-6 py-8 text-center text-xs text-slate-500 bg-slate-950">
            FunnelDoctor AI &copy; 2026 &bull; Built for Startup Buildathon India 2026 &bull; Powered by Google DeepMind & Google Cloud
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE B: THE INTERACTIVE 5-TAB PRODUCT WORKSPACE (SAAS APP VIEW)      */}
      {/* ========================================================================= */}
      {viewMode === "workspace" && (
        <div className="flex-1 flex flex-col md:flex-row">
          {/* LEFT SIDEBAR (Dark Slate w-64) */}
          <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
            <div className="flex flex-col gap-6">
              {/* Dataset Switcher Dropdown */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                  Select Active Startup Funnel
                </label>
                <div className="relative">
                  <select
                    value={activeDatasetId}
                    onChange={(e) => {
                      setActiveDatasetId(e.target.value as DatasetId);
                      setSelectedPinId(1);
                      showToast(`Switched Dataset to ${DATASETS[e.target.value as DatasetId].name}`);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer pr-8"
                  >
                    <option value="d2c">🛍️ QuickStyle D2C Fashion (-71.7%)</option>
                    <option value="kyc">💳 FinPulse Neo-KYC (-74.8%)</option>
                    <option value="edtech">🎓 PrepMate IIT Paywall (-96.5%)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* 5 Navigation Tabs */}
              <nav className="flex flex-col gap-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "telemetry"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>1. Funnel Telemetry</span>
                </button>

                <button
                  onClick={() => setActiveTab("vision")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "vision"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>2. Gemini Vision X-Ray</span>
                </button>

                <button
                  onClick={() => setActiveTab("rca")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "rca"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>3. Root-Cause & SQL Lab</span>
                </button>

                <button
                  onClick={() => setActiveTab("prd")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "prd"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>4. Auto-PRD & UI Fix</span>
                </button>

                <button
                  onClick={() => setActiveTab("warroom")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "warroom"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold"
                      : "text-emerald-400 hover:bg-emerald-500/10"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>5. Live AI PM War Room</span>
                </button>
              </nav>
            </div>

            {/* Sidebar Bottom Controls */}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-900">
              <button
                onClick={() => setShowPitchModal(true)}
                className="w-full py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>🎤 60-Sec Judge Pitch Guide</span>
              </button>

              <button
                onClick={() => setViewMode("website")}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Back to Website</span>
              </button>
            </div>
          </aside>

          {/* MAIN PRODUCT WORKSPACE AREA */}
          <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 overflow-y-auto max-w-6xl">
            {/* Top Overview KPI Banner */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Active Audit Target
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">{dataset.name}</h2>
                <p className="text-xs text-slate-400">{dataset.tagline}</p>
              </div>

              {/* 4 Quick KPI Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 block font-medium">Conversion</span>
                  <span className="text-xs font-extrabold text-emerald-400 font-mono">
                    {dataset.overallConversion}%
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-rose-500/30 text-center">
                  <span className="text-[10px] text-rose-400 block font-bold">Bleeding Step</span>
                  <span className="text-xs font-extrabold text-rose-400 font-mono">
                    -{dataset.bleedingDropRate}% Drop
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 block font-medium">Leaked Revenue</span>
                  <span className="text-xs font-extrabold text-white font-mono">
                    {dataset.monthlyLeakedRevenue}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30 text-center">
                  <span className="text-[10px] text-emerald-400 block font-bold">AI Recovery</span>
                  <span className="text-xs font-extrabold text-emerald-400 font-mono">
                    {dataset.recoverableRevenue}
                  </span>
                </div>
              </div>
            </div>

            {/* TAB 1: 📊 FUNNEL & COHORT TELEMETRY */}
            {activeTab === "telemetry" && (
              <div className="flex flex-col gap-6">
                {/* 5-Step Visual Funnel Visualization */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-rose-400" />
                        <span>Step-by-Step Conversion Funnel Drop-off Velocity</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {dataset.monthlyVisitors.toLocaleString()} Total Funnel Sessions Analyzed via Cloud SQL
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {dataset.steps.map((st, i) => {
                      const widthPercent = Math.max(10, (st.visitors / dataset.steps[0].visitors) * 100);

                      return (
                        <div
                          key={st.id}
                          className={`p-3.5 rounded-xl border transition ${
                            st.isBleedingBottleneck
                              ? "bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30"
                              : "bg-slate-950/60 border-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-400 font-bold">{i + 1}.</span>
                              <span className="font-bold text-slate-200">{st.name}</span>
                              {st.isBleedingBottleneck && (
                                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                                  CRITICAL BOTTLENECK LEAK
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-slate-400 font-mono font-medium">
                                {st.visitors.toLocaleString()} users
                              </span>
                              {i < dataset.steps.length - 1 && (
                                <span
                                  className={`font-mono font-bold ${
                                    st.isBleedingBottleneck ? "text-rose-400" : "text-amber-400"
                                  }`}
                                >
                                  -{(st.dropoffRate * 100).toFixed(1)}% drop
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex items-center">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                st.isBleedingBottleneck
                                  ? "bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500"
                                  : "bg-gradient-to-r from-indigo-500 to-teal-400"
                              }`}
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>

                          {st.isBleedingBottleneck && (
                            <div className="mt-3 pt-2.5 border-t border-rose-500/20 flex items-center justify-between">
                              <span className="text-[11px] text-rose-300">
                                🚨 <strong>{st.dropoffCount.toLocaleString()} dropped users</strong> at this single step!
                              </span>
                              <button
                                onClick={() => setActiveTab("vision")}
                                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                              >
                                <Eye className="w-3 h-3" />
                                <span>X-Ray This Step with Gemini Vision ➔</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cohort Retention Heatmap Matrix */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span>Weekly User Retention Heatmap Matrix</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Cohort retention decay tracking conversion health over 5 weeks
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-center border-collapse">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800 font-mono">
                          <th className="py-2 text-left">Cohort</th>
                          <th className="py-2">Week 0</th>
                          <th className="py-2">Week 1</th>
                          <th className="py-2">Week 2</th>
                          <th className="py-2">Week 3</th>
                          <th className="py-2">Week 4</th>
                          <th className="py-2">Week 5</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataset.retentionMatrix.map((r, idx) => (
                          <tr key={idx} className="border-b border-slate-900 font-mono text-[11px]">
                            <td className="py-2.5 text-left font-semibold text-slate-300">{r.cohort}</td>
                            <td className="py-2 bg-emerald-600/40 text-emerald-200 font-bold">{r.w0}%</td>
                            <td className="py-2 bg-emerald-600/20 text-emerald-300">{r.w1}%</td>
                            <td className="py-2 bg-indigo-600/20 text-indigo-300">{r.w2}%</td>
                            <td className="py-2 bg-indigo-600/10 text-indigo-400">{r.w3}%</td>
                            <td className="py-2 bg-slate-900 text-slate-400">{r.w4}%</td>
                            <td className="py-2 bg-slate-900/60 text-slate-500">{r.w5}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 👁️ MULTIMODAL VISION UX X-RAY */}
            {activeTab === "vision" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 5 Cols: Interactive Mobile Screen Inspector with Hotspot Pins */}
                <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                        Bleeding Step Visual Capture
                      </span>
                      <h4 className="font-bold text-sm text-white">{dataset.bleedingStepName}</h4>
                    </div>
                    <span className="text-xs text-indigo-400 font-mono">Mobile 390px</span>
                  </div>

                  {/* Device Wireframe Frame */}
                  <div className="relative w-[280px] h-[520px] bg-slate-950 border-[6px] border-slate-800 rounded-[38px] p-3 shadow-2xl flex flex-col justify-between overflow-hidden">
                    {/* Speaker / Dynamic Island */}
                    <div className="w-20 h-3.5 bg-slate-900 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    </div>

                    {/* Simulated Screen Content */}
                    <div className="relative flex-1 bg-slate-900 rounded-xl p-3 border border-slate-800/80 flex flex-col justify-between text-xs overflow-hidden">
                      {uploadedVisionImage ? (
                        <img
                          src={uploadedVisionImage}
                          alt="Custom Upload"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col gap-2 my-auto">
                          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                            <p className="font-bold text-slate-200">{dataset.name}</p>
                            <p className="text-[10px] text-slate-400">Order Verification</p>
                          </div>

                          <div className="p-2.5 bg-rose-950/40 border border-rose-500/50 rounded-lg text-[10px] text-rose-200">
                            <span className="font-bold">⚠️ Friction Modal:</span>
                            <p className="text-slate-300 mt-0.5">
                              {dataset.hotspots[0]?.title}
                            </p>
                          </div>

                          <div className="h-8 bg-slate-950/60 border border-dashed border-slate-800 rounded flex items-center justify-center text-[9px] text-slate-500 font-mono">
                            [Virtual Keyboard Input Boundary]
                          </div>
                        </div>
                      )}

                      {/* Numbered Hotspot Pins */}
                      {dataset.hotspots.map((pin) => (
                        <button
                          key={pin.id}
                          onClick={() => setSelectedPinId(pin.id)}
                          style={{ top: `${pin.yPercent}%`, left: `${pin.xPercent}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xl cursor-pointer transition-transform ${
                            selectedPinId === pin.id
                              ? "bg-rose-500 text-white scale-125 ring-4 ring-rose-500/30"
                              : "bg-rose-600 text-white opacity-85 hover:scale-110"
                          }`}
                        >
                          {pin.label}
                        </button>
                      ))}

                      <div className="border-t border-slate-800 pt-1.5 text-[9px] text-slate-500 flex justify-between">
                        <span>SSL Verified</span>
                        <span className="text-indigo-400 font-mono">Gemini Vision Grounding</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload Any UI Screenshot Button */}
                  <label className="mt-4 w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                    <Camera className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Upload Custom Screenshot for Gemini Audit</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadCustomScreenshot}
                      className="hidden"
                    />
                  </label>
                  {visionAnalyzing && (
                    <p className="text-[11px] text-indigo-400 mt-2 animate-pulse flex items-center gap-1 font-semibold">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Gemini 2.5 Flash analyzing UI wireframe...
                    </p>
                  )}
                </div>

                {/* Right 7 Cols: Correlated Multimodal Findings linked to Pins */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      Correlated Multimodal Diagnostics
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-0.5">
                      Pin Details & Heuristic Violations
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Click any pin on the mobile screen to inspect the exact heuristic and quantitative evidence.
                    </p>

                    <div className="mt-4 flex flex-col gap-3">
                      {dataset.hotspots.map((pin) => {
                        const isSelected = selectedPinId === pin.id;

                        return (
                          <div
                            key={pin.id}
                            onClick={() => setSelectedPinId(pin.id)}
                            className={`p-4 rounded-xl border transition cursor-pointer ${
                              isSelected
                                ? "bg-slate-950 border-indigo-500 ring-1 ring-indigo-500/50"
                                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-mono font-bold text-xs">
                                  {pin.label}
                                </span>
                                <h4 className="font-bold text-xs text-white">{pin.title}</h4>
                              </div>
                              <span
                                className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                  pin.severity === "CRITICAL"
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                }`}
                              >
                                {pin.severity}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              {pin.geminiVisionFinding}
                            </p>

                            <div className="mt-2.5 pt-2 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                              <div className="bg-slate-900 p-2 rounded-lg text-slate-400">
                                <span className="font-bold text-rose-400 block">Telemetry Evidence:</span>
                                {pin.telemetryEvidence}
                              </div>
                              <div className="bg-slate-900 p-2 rounded-lg text-slate-400">
                                <span className="font-bold text-indigo-400 block">Heuristic Violated:</span>
                                {pin.heuristicViolated}
                              </div>
                            </div>

                            <div className="mt-2.5 p-2 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>
                                <strong>Prescribed Engineering Fix:</strong> {pin.prescribedFix}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: 🧠 ROOT CAUSE ANALYSIS (RCA) & SQL LAB */}
            {activeTab === "rca" && (
              <div className="flex flex-col gap-6">
                {/* 4-Pillar Weighted RCA Breakdown */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-1">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span>4-Pillar Weighted Root-Cause Attribution</span>
                  </h3>
                  <p className="text-xs text-slate-400 mb-5">
                    Multimodal weighted attribution isolating the exact drivers of the {dataset.bleedingDropRate}% drop-off.
                  </p>

                  <div className="flex flex-col gap-3">
                    {dataset.weightedRca.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-slate-200">{item.pillar}</span>
                          <span className="font-mono font-black text-indigo-400">{item.weight}% Weight</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${item.weight}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Natural-Language-to-SQL Lab */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Interactive Natural-Language-to-SQL Lab</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ask questions in plain English. Google Agent Skills executes segmented queries on Cloud SQL telemetry.
                      </p>
                    </div>
                  </div>

                  {/* Preset Query Chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.sqlPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSqlPresetIdx(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                          selectedSqlPresetIdx === idx
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        💬 "{preset.prompt}"
                      </button>
                    ))}
                  </div>

                  {/* Generated SQL Block */}
                  {dataset.sqlPresets[selectedSqlPresetIdx] && (
                    <div className="flex flex-col gap-4">
                      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto relative">
                        <button
                          onClick={() =>
                            copyToClipboard(
                              dataset.sqlPresets[selectedSqlPresetIdx].sql,
                              "SQL Query"
                            )
                          }
                          className="absolute right-3 top-3 text-slate-400 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <pre>{dataset.sqlPresets[selectedSqlPresetIdx].sql}</pre>
                      </div>

                      {/* Executed Data Table */}
                      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                            <tr>
                              {Object.keys(
                                dataset.sqlPresets[selectedSqlPresetIdx].resultRows[0] || {}
                              ).map((col) => (
                                <th key={col} className="p-2.5">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataset.sqlPresets[selectedSqlPresetIdx].resultRows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-slate-900 font-mono text-slate-300">
                                {Object.values(row).map((val, cIdx) => (
                                  <td key={cIdx} className="p-2.5">
                                    {String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Gemini Data Scientist Takeaway */}
                      <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-indigo-400 block mb-0.5">
                            Gemini Data Scientist Takeaway:
                          </strong>
                          <span>{dataset.sqlPresets[selectedSqlPresetIdx].geminiTakeaway}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: 🛠️ AUTO-PRD & UI FIX STUDIO */}
            {activeTab === "prd" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 6 Cols: Complete Structured PRD */}
                <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          1-Click Deliverable
                        </span>
                        <h3 className="font-extrabold text-sm text-white">
                          RICE-Prioritized Engineering PRD
                        </h3>
                      </div>
                      <button
                        onClick={() => copyToClipboard(dataset.prdMarkdown, "PRD Document")}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Markdown</span>
                      </button>
                    </div>

                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                      {dataset.prdMarkdown}
                    </div>
                  </div>
                </div>

                {/* Right 6 Cols: Before vs. After UI Transformation & Code */}
                <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          UI Remediation Studio
                        </span>
                        <h3 className="font-extrabold text-sm text-white">
                          Before vs. After Code Fix
                        </h3>
                      </div>

                      {/* 3-Way Segmented Toggle */}
                      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                        <button
                          onClick={() => setUiFixViewMode("broken")}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                            uiFixViewMode === "broken"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : "text-slate-400"
                          }`}
                        >
                          ❌ Broken
                        </button>
                        <button
                          onClick={() => setUiFixViewMode("redesigned")}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                            uiFixViewMode === "redesigned"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "text-slate-400"
                          }`}
                        >
                          ✅ Redesigned
                        </button>
                        <button
                          onClick={() => setUiFixViewMode("code")}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                            uiFixViewMode === "code"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                              : "text-slate-400"
                          }`}
                        >
                          💻 Code
                        </button>
                      </div>
                    </div>

                    {/* Mode 1: Broken UI Preview */}
                    {uiFixViewMode === "broken" && (
                      <div className="bg-slate-950 rounded-2xl p-6 border border-rose-500/30 flex flex-col gap-3">
                        <h4 className="font-bold text-sm text-rose-400">
                          {dataset.brokenUiWireframeTitle}
                        </h4>
                        <ul className="flex flex-col gap-2 text-xs text-slate-300">
                          {dataset.brokenUiItems.map((item, idx) => (
                            <li key={idx} className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs text-rose-300 text-center font-bold">
                          Causes {dataset.bleedingDropRate}% drop-off & ₹{dataset.monthlyLeakedRevenue} leakage.
                        </div>
                      </div>
                    )}

                    {/* Mode 2: Redesigned UI Preview */}
                    {uiFixViewMode === "redesigned" && (
                      <div className="bg-slate-950 rounded-2xl p-6 border border-emerald-500/30 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-emerald-400">
                            {dataset.redesignedUiTitle}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            +38% Conversion Lift
                          </span>
                        </div>
                        <ul className="flex flex-col gap-2 text-xs text-slate-300">
                          {dataset.redesignedUiFeatures.map((item, idx) => (
                            <li key={idx} className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => setUiFixViewMode("code")}
                          className="mt-3 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Code2 className="w-4 h-4" />
                          <span>View Ready-to-Ship React Code ➔</span>
                        </button>
                      </div>
                    )}

                    {/* Mode 3: Ready-to-Ship Code Block */}
                    {uiFixViewMode === "code" && (
                      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto relative max-h-[460px]">
                        <button
                          onClick={() => copyToClipboard(dataset.codeDiff, "React Component")}
                          className="absolute right-3 top-3 text-slate-400 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <pre>{dataset.codeDiff}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: 🎙️ LIVE AI PM WAR ROOM (VOICE & CHAT) */}
            {activeTab === "warroom" && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Volume2 className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">Live AI PM War Room</h3>
                      <p className="text-[11px] text-slate-400">
                        Ask strategic root-cause questions via voice or text. Answers spoken live via browser audio.
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    SpeechSynthesis Active
                  </span>
                </div>

                {/* Quick-Ask Chips */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      handleSendVoiceQuery("Give me a 30-second executive summary of why conversion dropped")
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition"
                  >
                    💬 "30-sec executive summary of why conversion dropped"
                  </button>
                  <button
                    onClick={() =>
                      handleSendVoiceQuery("What is the #1 code fix our engineers should deploy today?")
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition"
                  >
                    💬 "What should our engineers deploy first today?"
                  </button>
                  <button
                    onClick={() =>
                      handleSendVoiceQuery("Estimate the monthly revenue recovery after this sprint")
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition"
                  >
                    💬 "Estimate monthly revenue recovery after this sprint"
                  </button>
                </div>

                {/* Chat Log Window */}
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 h-[380px] overflow-y-auto flex flex-col gap-3">
                  {voiceMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>

                {/* Audio Input Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleVoiceRecording}
                    className={`p-3 rounded-xl border transition shrink-0 ${
                      isListeningVoice
                        ? "bg-rose-500 border-rose-400 text-white animate-pulse"
                        : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                    }`}
                    title={isListeningVoice ? "Listening... click to stop" : "Click to speak"}
                  >
                    {isListeningVoice ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendVoiceQuery(chatInput);
                    }}
                    placeholder="Type or speak a question for the AI PM..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />

                  <button
                    onClick={() => handleSendVoiceQuery(chatInput)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MULTI-STEP HERO DIAGNOSIS PROGRESS MODAL                                  */}
      {/* ========================================================================= */}
      {isAuditingHero && (
        <div className="fixed inset-0 z-50 bg-[#090D16]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="font-extrabold text-base text-white">Synthesizing Multimodal RCA</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6 font-mono">{heroUrlInput}</p>

            <div className="w-full flex flex-col gap-2.5 text-xs text-left">
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  auditProgressStep >= 1
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
              >
                <span>1. Crawling Responsive UI Viewport (390px)...</span>
                {auditProgressStep >= 1 && <Check className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  auditProgressStep >= 2
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
              >
                <span>2. Querying Event Funnel Telemetry on Cloud SQL...</span>
                {auditProgressStep >= 2 && <Check className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  auditProgressStep >= 3
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
              >
                <span>3. Running Gemini Vision UX Heuristic Audit...</span>
                {auditProgressStep >= 3 && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 60-SEC JUDGE PITCH GUIDE MODAL                                            */}
      {/* ========================================================================= */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 bg-[#090D16]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 relative">
            <button
              onClick={() => setShowPitchModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-white">60-Second Buildathon Pitch Script</h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed overflow-y-auto max-h-[360px] whitespace-pre-wrap">
{`"Good morning judges! Every startup founder and D2C brand watches users drop off in checkout—losing crores of rupees every month.

Traditional analytics like Mixpanel or GA4 only tell you WHERE people left. They never tell you WHY.

Meet FunnelDoctor AI. We combine Quantitative Funnel Telemetry with Qualitative Gemini Multimodal Vision.

Our agent crawls the URL, takes responsive screenshots, and correlates the exact 71% drop-off with visual UX flaws—like this forced login modal and below-the-fold UPI button.

Then, in under 60 seconds, it writes a complete engineering PRD and hands your developers the ready-to-ship React code fix.

This isn't another analytics dashboard—it's an autonomous AI Product Manager that turns leaked revenue into cash flow. Thank you!"`}
            </div>

            <button
              onClick={() => setShowPitchModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
            >
              Ready to Pitch!
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GEMINI API SETTINGS MODAL                                                 */}
      {/* ========================================================================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-[#090D16]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 relative">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-base text-white">Google Gemini 2.5 API Setup</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your Google AI Studio API key to enable live multimodal vision parsing and real-time generative reasoning.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Google AI Studio Key:
              </label>
              <input
                type="password"
                value={tempApiKeyInput}
                onChange={(e) => setTempApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <span className="text-[10px] text-slate-500">
                Stored in browser <code className="bg-slate-800 px-1 rounded">localStorage</code>.
              </span>
            </div>

            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-[11px] text-indigo-300">
              💡 <strong>Demo Fallback Notice:</strong> If left empty, FunnelDoctor AI operates in deterministic simulation mode so stage demos never fail!
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleSaveApiKey}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition"
              >
                Save & Activate Key
              </button>
              {geminiApiKey && (
                <button
                  onClick={() => {
                    localStorage.removeItem("funneldoctor_gemini_key");
                    setGeminiApiKey("");
                    setTempApiKeyInput("");
                    setShowSettingsModal(false);
                    showToast("API Key Cleared");
                  }}
                  className="px-4 py-2.5 border border-slate-700 text-slate-400 hover:bg-slate-800 rounded-xl text-xs font-semibold"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
