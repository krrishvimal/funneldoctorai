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
  Radio,
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
  VolumeX,
  Wand2,
  X,
  Zap,
} from "lucide-react";

// Deterministic Number Formatter to guarantee 100% hydration matching across Node & Browser
function formatNumber(val: number): string {
  if (typeof val !== "number" || isNaN(val)) return "0";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ==========================================
// DATASET DEFINITIONS (3 RICH INDIAN STARTUP FUNNELS)
// ==========================================
type DatasetId = "d2c" | "kyc" | "edtech";

interface FunnelStepData {
  id: string;
  name: string;
  visitors: number;
  conversionFromPrev: number;
  dropoffRate: number;
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
      { id: "s5", name: "5. UPI Payment Screen", visitors: 1443, conversionFromPrev: 0.283, dropoffRate: 0.35, dropoffCount: 505 },
      { id: "s6", name: "6. Order Confirmation", visitors: 938, conversionFromPrev: 0.65, dropoffRate: 0.0, dropoffCount: 0 },
    ],
    retentionMatrix: [
      { cohort: "Oct 01 - 07", w0: 100, w1: 34, w2: 24, w3: 18, w4: 15, w5: 12 },
      { cohort: "Oct 08 - 14", w0: 100, w1: 38, w2: 26, w3: 21, w4: 17, w5: 14 },
      { cohort: "Oct 15 - 21", w0: 100, w1: 32, w2: 22, w3: 17, w4: 14, w5: 11 },
      { cohort: "Oct 22 - 28", w0: 100, w1: 41, w2: 29, w3: 24, w4: 19, w5: 16 },
    ],
    hotspots: [
      {
        id: 1,
        label: "#1",
        title: "Forced Sign-In Wall Blocks Guest Checkout",
        xPercent: 50,
        yPercent: 32,
        severity: "CRITICAL",
        telemetryEvidence: "64.2% of users abandon the page without focusing on the first input field.",
        heuristicViolated: "Nielsen #3: User Control & Freedom (Zero Guest Checkout option)",
        geminiVisionFinding: "Intrusive full-screen modal blocks bag items with zero visible close or guest continue button on 390px mobile viewports.",
        prescribedFix: "Enable 1-Tap OTP login and allow Guest Checkout with SMS order tracking.",
      },
      {
        id: 2,
        label: "#2",
        title: "Unexpected ₹99 Delivery Surcharge Revealed at Final Step",
        xPercent: 78,
        yPercent: 62,
        severity: "HIGH",
        telemetryEvidence: "42.1% drop-off coincides with the dynamic calculation of delivery fee after pin-code entry.",
        heuristicViolated: "Nielsen #1: Visibility of System Status & Pricing Transparency",
        geminiVisionFinding: "Price escalated from ₹1,499 in bag drawer to ₹1,648 at payment step without itemized explanation.",
        prescribedFix: "Display a 'Add ₹150 for Free Shipping' progress meter directly on the bag drawer.",
      },
      {
        id: 3,
        label: "#3",
        title: "UPI Intent Button Occluded Below Keyboard Fold",
        xPercent: 50,
        yPercent: 88,
        severity: "CRITICAL",
        telemetryEvidence: "Average dwell time on address form is 48s, followed by browser back button click (82% mobile bounce).",
        heuristicViolated: "Nielsen #8: Aesthetic and Minimalist Design (Excessive Form Clutter)",
        geminiVisionFinding: "On Android viewports with virtual keyboard active, the primary 'Pay with UPI' CTA is pushed 240px below the viewport fold.",
        prescribedFix: "Pin a sticky bottom bar with 1-Tap GPay/PhonePe button above the keyboard fold.",
      },
    ],
    weightedRca: [
      { pillar: "Mobile UX Friction & Keyboard Occlusion", weight: 42, color: "bg-rose-500", explanation: "42% of mobile shoppers cannot see the payment CTA while keyboard is active." },
      { pillar: "Forced Account Creation Wall", weight: 34, color: "bg-amber-500", explanation: "34% of first-time shoppers abandon upon seeing mandatory password creation." },
      { pillar: "Hidden Shipping Fee Shock", weight: 24, color: "bg-indigo-500", explanation: "24% bounce after ₹99 delivery fee is added post pin-code entry." },
    ],
    sqlPresets: [
      {
        prompt: "Find drop-off rate by device viewport width during Step 4",
        sql: `SELECT 
  device_category,
  screen_width_bucket,
  COUNT(DISTINCT session_id) AS sessions,
  COUNT(DISTINCT CASE WHEN step_4_reached = 1 THEN session_id END) AS step_4_users,
  COUNT(DISTINCT CASE WHEN step_5_reached = 1 THEN session_id END) AS step_5_users,
  ROUND((1 - COUNT(DISTINCT CASE WHEN step_5_reached = 1 THEN session_id END) * 1.0 / 
    COUNT(DISTINCT CASE WHEN step_4_reached = 1 THEN session_id END)) * 100, 1) AS dropoff_pct
FROM \`funnel_telemetry.d2c_checkout_events\`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY 1, 2
ORDER BY dropoff_pct DESC;`,
        resultRows: [
          { device: "Mobile (Android 390px)", sessions: 42100, step4: 3120, step5: 642, dropoff: "79.4%" },
          { device: "Mobile (iOS 393px)", sessions: 31400, step4: 1420, step5: 512, dropoff: "63.9%" },
          { device: "Desktop (1440px+)", sessions: 26500, step4: 560, step5: 289, dropoff: "48.4%" },
        ],
        geminiTakeaway: "Android 390px viewports experience a catastrophic 79.4% drop-off compared to 48.4% on desktop, confirming mobile keyboard occlusion.",
      },
      {
        prompt: "Correlate drop-off with cart value vs free shipping threshold (₹1,500)",
        sql: `SELECT 
  CASE WHEN cart_value < 1500 THEN 'Below Free Shipping (< ₹1500)'
       ELSE 'Above Free Shipping (>= ₹1500)' END AS cart_segment,
  COUNT(DISTINCT session_id) AS step_4_users,
  ROUND(AVG(CASE WHEN step_5_reached = 0 THEN 1.0 ELSE 0.0 END) * 100, 1) AS abandonment_pct
FROM \`funnel_telemetry.d2c_checkout_events\`
GROUP BY 1;`,
        resultRows: [
          { segment: "Below Free Shipping (< ₹1500)", step4: 3410, abandonment: "81.2%" },
          { segment: "Above Free Shipping (>= ₹1500)", step4: 1690, abandonment: "52.4%" },
        ],
        geminiTakeaway: "Shoppers below ₹1,500 abandon at 81.2% due to ₹99 shipping shock, while those with free shipping abandon at only 52.4%.",
      },
    ],
    prdMarkdown: `# Product Requirements Document (PRD)
**Feature:** Express 1-Tap Checkout Bar & Transparent Bag Drawer  
**Target:** QuickStyle D2C Fashion • **Priority:** P0 • **Expected Recovery:** ₹26.0 Lakhs/mo

## 1. Executive Summary & Root Cause
Funnel telemetry identifies a catastrophic **71.7% drop-off** at Step 4 (Checkout & Address Wall). Gemini Multimodal inspection identifies:
1. Virtual keyboard on 390px mobile viewports occludes the primary 'Pay' button by 240px.
2. Unannounced ₹99 delivery fee triggers pricing shock.
3. Forced account creation creates Nielsen #3 violation.

## 2. RICE Prioritization Matrix
| Priority | Proposed Solution | Reach | Impact | Confidence | Effort | RICE Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P0** | Sticky Bottom Bar with 1-Tap UPI (GPay/PhonePe) | 5,100/mo | 3.0 (Huge) | 90% | 1.0 wk | **13,770** |
| **P0** | Free Shipping Progress Meter on Bag Drawer | 18,000/mo | 2.0 (High) | 85% | 0.5 wk | **61,200** |
| **P1** | 1-Click WhatsApp OTP Login & Guest Checkout | 5,100/mo | 2.0 (High) | 80% | 1.5 wk | **5,440** |`,
    brokenUiWireframeTitle: "Current Broken UI (Step 4)",
    brokenUiItems: [
      "❌ Mandatory 6-Field Account Creation Form",
      "❌ Primary CTA Pushed 240px Below Mobile Virtual Keyboard",
      "❌ Hidden ₹99 Shipping Fee Surcharge at Final Step",
      "❌ No Direct UPI Intent Deep-Links (GPay/PhonePe/Paytm)",
    ],
    redesignedUiTitle: "FunnelDoctor AI Fixed Component",
    redesignedUiFeatures: [
      "⚡ Sticky Bottom Bar Locked Above Keyboard (`z-50 bottom-0`)",
      "⚡ 1-Tap Instant UPI Intent Flow (Zero Manual Form Filling)",
      "⚡ Dynamic Free Shipping Progress Meter Unlocked in Bag Drawer",
      "⚡ 1-Click Guest Checkout with SMS Live Delivery Tracking",
    ],
    codeDiff: `// ExpressCheckoutBar.tsx — Production Component Generated by FunnelDoctor AI
import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export function ExpressCheckoutBar({ cartTotal = 1850, onPay }: { cartTotal?: number; onPay?: () => void }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#090D16]/95 backdrop-blur-xl border-t border-white/10 p-4 shadow-2xl flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FREE EXPRESS DELIVERY UNLOCKED</span>
        </div>
        <p className="text-xl font-extrabold text-white">₹1,850</p>
      </div>

      <button 
        onClick={onPay}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 transition active:scale-95"
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>1-Tap UPI Pay</span>
      </button>
    </div>
  );
}`,
  },

  kyc: {
    id: "kyc",
    name: "FinPulse Neo-Bank Video-KYC",
    tagline: "Instant Digital Savings Account Onboarding",
    companyCategory: "Fintech / Banking",
    overallConversion: 3.4,
    monthlyVisitors: 80000,
    aov: 2400,
    monthlyLeakedRevenue: "₹42.8 Lakhs/mo",
    recoverableRevenue: "₹18.4 Lakhs/mo (+43% Lift)",
    bleedingStepName: "Live Agent Video-KYC (Step 4)",
    bleedingDropRate: 74.8,
    steps: [
      { id: "k1", name: "1. Phone Number & OTP", visitors: 80000, conversionFromPrev: 1.0, dropoffRate: 0.22, dropoffCount: 17600 },
      { id: "k2", name: "2. PAN & Aadhaar OCR Verification", visitors: 62400, conversionFromPrev: 0.78, dropoffRate: 0.38, dropoffCount: 23712 },
      { id: "k3", name: "3. Address & Nominee Details", visitors: 38688, conversionFromPrev: 0.62, dropoffRate: 0.44, dropoffCount: 17022 },
      { id: "k4", name: "4. Live Agent Video-KYC Queue", visitors: 21665, conversionFromPrev: 0.56, dropoffRate: 0.748, dropoffCount: 16205, isBleedingBottleneck: true },
      { id: "k5", name: "5. Digital Signature & VPA Setup", visitors: 5460, conversionFromPrev: 0.252, dropoffRate: 0.28, dropoffCount: 1528 },
      { id: "k6", name: "6. Account Active & Funded", visitors: 3932, conversionFromPrev: 0.72, dropoffRate: 0.0, dropoffCount: 0 },
    ],
    retentionMatrix: [
      { cohort: "Oct 01 - 07", w0: 100, w1: 48, w2: 38, w3: 32, w4: 28, w5: 25 },
      { cohort: "Oct 08 - 14", w0: 100, w1: 52, w2: 41, w3: 35, w4: 31, w5: 28 },
      { cohort: "Oct 15 - 21", w0: 100, w1: 45, w2: 36, w3: 30, w4: 26, w5: 23 },
      { cohort: "Oct 22 - 28", w0: 100, w1: 55, w2: 44, w3: 39, w4: 34, w5: 31 },
    ],
    hotspots: [
      {
        id: 1,
        label: "#1",
        title: "Silent Browser Camera/Microphone Permission Failure",
        xPercent: 50,
        yPercent: 28,
        severity: "CRITICAL",
        telemetryEvidence: "54.8% of users terminate session within 12 seconds of queue screen mount.",
        heuristicViolated: "Nielsen #9: Help Users Recognize, Diagnose, and Recover from Errors",
        geminiVisionFinding: "Viewport displays a blank grey placeholder when WebRTC camera permission is denied, with zero troubleshooting instructions.",
        prescribedFix: "Inject an animated pre-call device permission diagnostic wizard with 1-tap browser settings deep-link.",
      },
      {
        id: 2,
        label: "#2",
        title: "Undefined Queue Time Induces Anxiety Bounce",
        xPercent: 50,
        yPercent: 54,
        severity: "CRITICAL",
        telemetryEvidence: "Median abandonment time is 3m 42s while waiting in queue with no audio or visual feedback.",
        heuristicViolated: "Nielsen #1: Visibility of System Status",
        geminiVisionFinding: "Screen displays an indefinite spinning circle with ambiguous text 'Connecting to banking officer shortly...'",
        prescribedFix: "Display real-time queue position ('You are #3 in line • ~2 mins') with option to 'Schedule for Tomorrow'.",
      },
      {
        id: 3,
        label: "#3",
        title: "Zero Asynchronous Callback Fallback",
        xPercent: 74,
        yPercent: 82,
        severity: "HIGH",
        telemetryEvidence: "78% of abandoned users never return to complete KYC unless re-targeted via expensive WhatsApp API.",
        heuristicViolated: "Nielsen #3: User Control & Freedom",
        geminiVisionFinding: "No button exists to pause onboarding or schedule an appointment for when the user has stable Wi-Fi.",
        prescribedFix: "Provide 1-tap WhatsApp slot booking for asynchronous assisted verification.",
      },
    ],
    weightedRca: [
      { pillar: "Silent Camera/Mic WebRTC Permissions Denials", weight: 46, color: "bg-rose-500", explanation: "46% fail camera initialization without clear recovery prompts." },
      { pillar: "Ambiguous Queue Wait Time & Officer Shortage", weight: 36, color: "bg-amber-500", explanation: "36% leave after waiting >3 minutes with zero queue status indication." },
      { pillar: "Mobile Bandwidth Fluctuations on 4G", weight: 18, color: "bg-indigo-500", explanation: "18% suffer WebRTC connection drops during agent handover." },
    ],
    sqlPresets: [
      {
        prompt: "Analyze KYC drop-off by browser WebRTC permission status",
        sql: `SELECT 
  browser_family,
  webrtc_permission_state,
  COUNT(DISTINCT applicant_id) AS total_applicants,
  ROUND(AVG(CASE WHEN kyc_completed = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) AS completion_rate,
  ROUND(AVG(CASE WHEN drop_step = 'video_queue' THEN 1.0 ELSE 0.0 END) * 100, 1) AS queue_abandon_pct
FROM \`finpulse_kyc.telemetry_stream\`
GROUP BY 1, 2
ORDER BY queue_abandon_pct DESC;`,
        resultRows: [
          { browser: "Chrome Mobile (Permission Denied)", applicants: 11200, completion: "8.2%", abandon: "84.6%" },
          { browser: "Safari Mobile (Permission Denied)", applicants: 4800, completion: "6.1%", abandon: "89.2%" },
          { browser: "Chrome Mobile (Permission Granted)", applicants: 32400, completion: "68.4%", abandon: "21.1%" },
        ],
        geminiTakeaway: "Denied WebRTC permissions result in an 84-89% abandonment rate, proving that failure to recover permissions is the primary bottleneck.",
      },
    ],
    prdMarkdown: `# Product Requirements Document (PRD)
**Feature:** Pre-Call Device Warmup & Live Queue Status System  
**Target:** FinPulse Neo-Bank • **Priority:** P0 • **Expected Recovery:** ₹42.8 Lakhs/mo

## 1. Objective
Reduce Aadhaar Video-KYC drop-off from 74.8% to 42.0% within 30 days by resolving permissions barriers and providing clear queue status.`,
    brokenUiWireframeTitle: "Current Broken Video-KYC Screen",
    brokenUiItems: [
      "❌ Blank Grey Box on Camera Permission Denial",
      "❌ Indefinite Spinning Indicator with Ambiguous 'Please Wait'",
      "❌ No Audio Ringtone or Queue Position Counter",
      "❌ Zero Option to Schedule Video KYC for Later",
    ],
    redesignedUiTitle: "FunnelDoctor AI Fixed Component",
    redesignedUiFeatures: [
      "⚡ Pre-Call Device Diagnostic Check (Camera, Mic, Network 4G)",
      "⚡ Real-Time Live Queue Counter ('You are #3 in queue • ~90s')",
      "⚡ 1-Tap 'Schedule Video Call for Tomorrow' Button",
    ],
    codeDiff: `// Adaptive WebRTC Warmup & Queue Status Component
import React from 'react';
import { Camera, Clock, Calendar } from 'lucide-react';

export function VideoKycQueueCard({ queuePosition = 3, waitTimeSeconds = 90 }) {
  return (
    <div className="bg-[#090D16] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
          <Clock className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-extrabold text-white text-sm">Next Agent Ready Shortly</h4>
          <p className="text-xs text-slate-400">Position #{queuePosition} in line • Est. {waitTimeSeconds}s</p>
        </div>
      </div>

      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg">
        Keep Screen On & Ring Me
      </button>

      <button className="w-full py-2.5 rounded-xl border border-white/10 text-slate-300 font-bold text-xs hover:bg-slate-800/60 flex items-center justify-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" />
        <span>Schedule for Tomorrow</span>
      </button>
    </div>
  );
}`,
  },

  edtech: {
    id: "edtech",
    name: "PrepMate IIT-JEE Paywall",
    tagline: "Freemium Mock Tests to Premium Annual Pass",
    companyCategory: "EdTech / SaaS",
    overallConversion: 1.1,
    monthlyVisitors: 150000,
    aov: 4999,
    monthlyLeakedRevenue: "₹84.2 Lakhs/mo",
    recoverableRevenue: "₹38.5 Lakhs/mo (+45% Lift)",
    bleedingStepName: "Annual Pass Paywall (Step 3)",
    bleedingDropRate: 96.5,
    steps: [
      { id: "e1", name: "1. Free Mock Test Landing", visitors: 150000, conversionFromPrev: 1.0, dropoffRate: 0.35, dropoffCount: 52500 },
      { id: "e2", name: "2. Test Submission & Partial Score", visitors: 97500, conversionFromPrev: 0.65, dropoffRate: 0.42, dropoffCount: 40950 },
      { id: "e3", name: "3. Annual Pass Paywall", visitors: 56550, conversionFromPrev: 0.58, dropoffRate: 0.965, dropoffCount: 54570, isBleedingBottleneck: true },
      { id: "e4", name: "4. Razorpay Gateway", visitors: 1980, conversionFromPrev: 0.035, dropoffRate: 0.22, dropoffCount: 435 },
      { id: "e5", name: "5. Enrolled Student Dashboard", visitors: 1545, conversionFromPrev: 0.78, dropoffRate: 0.0, dropoffCount: 0 },
    ],
    retentionMatrix: [
      { cohort: "Oct 01 - 07", w0: 100, w1: 28, w2: 19, w3: 15, w4: 12, w5: 10 },
      { cohort: "Oct 08 - 14", w0: 100, w1: 31, w2: 22, w3: 17, w4: 14, w5: 12 },
      { cohort: "Oct 15 - 21", w0: 100, w1: 26, w2: 18, w3: 14, w4: 11, w5: 9 },
      { cohort: "Oct 22 - 28", w0: 100, w1: 34, w2: 24, w3: 19, w4: 16, w5: 13 },
    ],
    hotspots: [
      {
        id: 1,
        label: "#1",
        title: "All-or-Nothing ₹4,999 Annual Lockout (Zero Monthly Option)",
        xPercent: 50,
        yPercent: 42,
        severity: "CRITICAL",
        telemetryEvidence: "96.5% drop-off occurs on first paywall impression without tapping any plan.",
        heuristicViolated: "Nielsen #4: Consistency & Standards / Pricing Elasticity",
        geminiVisionFinding: "Only a single upfront ₹4,999 yearly payment option exists. No ₹499 monthly or ₹99 single-test access.",
        prescribedFix: "Introduce a ₹399/mo subscription toggle and a ₹99 single-test micro-transaction unlock.",
      },
      {
        id: 2,
        label: "#2",
        title: "Obscured Value Prop: Solutions Locked Behind Blur Effect",
        xPercent: 50,
        yPercent: 68,
        severity: "HIGH",
        telemetryEvidence: "88% of users immediately exit back to Google to search for free answer keys.",
        heuristicViolated: "Nielsen #2: Match Between System and the Real World",
        geminiVisionFinding: "The paywall blur effect completely obscures whether video solutions exist or if it's text-only.",
        prescribedFix: "Provide 1 free video solution preview to prove pedagogical superiority before asking for payment.",
      },
      {
        id: 3,
        label: "#3",
        title: "Absence of Social Proof and Rank Predictor Hook",
        xPercent: 78,
        yPercent: 88,
        severity: "MEDIUM",
        telemetryEvidence: "Adding AIR 24 topper testimonial on test landing increased CTR by 18%, but paywall lacks it.",
        heuristicViolated: "Nielsen #10: Help & Social Proof",
        geminiVisionFinding: "Zero testimonials from IIT-JEE toppers or percentile benchmarks on the paywall screen.",
        prescribedFix: "Embed real-time AIR Rank Predictor comparison alongside Kota faculty credentials.",
      },
    ],
    weightedRca: [
      { pillar: "Extreme Upfront Price Barrier (₹4,999 Lockout)", weight: 58, color: "bg-rose-500", explanation: "58% of students cannot afford annual upfront payment without parental consent." },
      { pillar: "Zero Free Sample Video Solution Preview", weight: 26, color: "bg-amber-500", explanation: "26% distrust solution quality due to completely blurred previews." },
      { pillar: "Missing No-Cost EMI & UPI Autopay Options", weight: 16, color: "bg-indigo-500", explanation: "16% bounce at gateway due to lack of UPI Autopay support." },
    ],
    sqlPresets: [
      {
        prompt: "Analyze Paywall Bounce Rate by User Academic Cohort",
        sql: `SELECT 
  student_target_year,
  COUNT(DISTINCT user_id) AS paywall_views,
  ROUND(AVG(CASE WHEN purchased = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) AS conversion_rate,
  ROUND(AVG(CASE WHEN bounced_under_5s = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) AS instant_exit_pct
FROM \`prepmate_edtech.paywall_events\`
GROUP BY 1
ORDER BY paywall_views DESC;`,
        resultRows: [
          { cohort: "IIT-JEE 2026 Aspirants", views: 34100, conversion: "0.84%", exit: "88.4%" },
          { cohort: "NEET 2026 Aspirants", views: 18200, conversion: "1.42%", exit: "82.1%" },
          { cohort: "Foundation (Class 10/11)", views: 4250, conversion: "2.10%", exit: "71.0%" },
        ],
        geminiTakeaway: "IIT-JEE aspirants show an 88.4% instant exit under 5 seconds, confirming immense price shock at the single ₹4,999 tier.",
      },
    ],
    prdMarkdown: `# Product Requirements Document (PRD)
**Feature:** Flexible Micro-Paywall & Free Solution Teaser  
**Target:** PrepMate IIT-JEE • **Priority:** P0 • **Expected Recovery:** ₹38.5 Lakhs/mo

## 1. Objective
Recover at least 25% of the 96.5% paywall drop-off by unbundling the ₹4,999 annual pass into a ₹399/mo pass and offering a free video preview.`,
    brokenUiWireframeTitle: "Current Broken Paywall Screen",
    brokenUiItems: [
      "❌ Single ₹4,999 Annual Lockout (No Monthly/Per-Test Options)",
      "❌ 100% Blurred Answers without Sample Video Quality Proof",
      "❌ No Rank Predictor or Kota Faculty Endorsements",
      "❌ Missing UPI Autopay / No-Cost EMI Options",
    ],
    redesignedUiTitle: "FunnelDoctor AI Fixed Component",
    redesignedUiFeatures: [
      "⚡ Dual Billing Toggle: ₹399/mo or ₹99 Instant Test Unlock",
      "⚡ 1 Free Video Solution Preview with Step-by-Step Breakdown",
      "⚡ Live AIR Rank Benchmark ('You are in Top 4.8% of 42k test takers')",
    ],
    codeDiff: `// FlexiblePlanSelector.tsx — Production Component Generated by FunnelDoctor AI
import React, { useState } from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

export function FlexiblePlanSelector({ onSelect }: { onSelect?: (plan: string) => void }) {
  const [billing, setBilling] = useState<'monthly' | 'test'>('monthly');

  return (
    <div className="bg-[#090D16] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4">
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5">
        <button 
          onClick={() => setBilling('monthly')} 
          className={\`flex-1 py-2 rounded-xl text-xs font-bold \${billing === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400'}\`}
        >
          Monthly Pass (₹399/mo)
        </button>
        <button 
          onClick={() => setBilling('test')} 
          className={\`flex-1 py-2 rounded-xl text-xs font-bold \${billing === 'test' ? 'bg-indigo-600 text-white' : 'text-slate-400'}\`}
        >
          Unlock 1 Test (₹99)
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <p className="text-xs text-indigo-300 font-bold">Includes Video Solutions + AIR Rank Benchmark</p>
      </div>

      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg">
        Unlock Now via UPI
      </button>
    </div>
  );
}`,
  },
};

// ==========================================
// MAIN MULTIMODAL APPLICATION COMPONENT
// ==========================================
export default function FunnelDoctorApp() {
  // Navigation & Mode
  const [viewMode, setViewMode] = useState<"website" | "workspace">("website");
  const [activeTab, setActiveTab] = useState<"telemetry" | "vision" | "rca" | "prd" | "pm">("telemetry");

  // Active Startup Dataset
  const [activeDatasetId, setActiveDatasetId] = useState<DatasetId>("d2c");

  // Gemini API Key Management
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [tempApiKeyInput, setTempApiKeyInput] = useState<string>("");

  // Website Hero Audit State
  const [heroUrlInput, setHeroUrlInput] = useState<string>("https://quickstyle-d2c.in/checkout");
  const [isAuditingHero, setIsAuditingHero] = useState<boolean>(false);
  const [auditProgressStep, setAuditProgressStep] = useState<number>(0);

  // Vision UX X-Ray State (Tab 2)
  const [selectedPinId, setSelectedPinId] = useState<number>(1);
  const [isVisionAnalyzing, setVisionAnalyzing] = useState<boolean>(false);
  const [uploadedVisionImage, setUploadedVisionImage] = useState<string | null>(null);

  // SQL & RCA Lab State (Tab 3)
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

  // Browser Voice Input & Output
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
      timestamp: "Just now",
    };
    setVoiceMessages((prev) => [...prev, newMsg]);
    setChatInput("");

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
          timestamp: "Just now",
        },
      ]);

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
  const calculatedRecoverable = Math.round(calculatedLeaked * 0.22);
  const calculatedAnnualLift = Math.round(calculatedRecoverable * 12);

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative bg-grid-pattern overflow-x-hidden">
      {/* Radiant Ambient Mesh Lighting Backgrounds */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[160px] pointer-events-none animate-mesh-float-1 z-0" />
      <div className="fixed top-1/3 -right-24 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none animate-mesh-float-2 z-0" />
      <div className="fixed bottom-10 -left-20 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border-indigo-400/40 flex items-center gap-2.5 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GLOBAL PERSISTENT HEADER (COMMAND BAR)                                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#02040a]/80 backdrop-blur-2xl border-b border-white/[0.08] px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setViewMode("website")}
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#050814] rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  FunnelDoctor<span className="text-indigo-400 font-black">.ai</span>
                </span>
                <span className="text-[9px] uppercase font-mono font-bold tracking-[0.18em] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 hidden sm:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Autonomous Multimodal Conversion & RCA Agent
              </p>
            </div>
          </div>

          {/* Center / Right Control Hub */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Mode Switch Capsule */}
            <div className="bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-white/[0.08] flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setViewMode("website")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "website"
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Product Website</span>
              </button>
              <button
                onClick={() => setViewMode("workspace")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "workspace"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-black"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Live App Workspace</span>
              </button>
            </div>

            {/* 60s Judge Pitch Script Button */}
            <button
              onClick={() => setShowPitchModal(true)}
              className="glass-pill px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hidden lg:flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pitch Script</span>
            </button>

            {/* Gemini API Key Button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                geminiApiKey
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm"
                  : "bg-indigo-500/10 border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/20"
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
      {/* VIEW MODE A: MULTI-CRORE PUBLIC SAAS MARKETING WEBSITE                    */}
      {/* ========================================================================= */}
      {viewMode === "website" && (
        <div className="flex-1 flex flex-col relative z-10">
          {/* HERO SECTION */}
          <section className="relative pt-20 pb-28 px-4 md:px-8 overflow-hidden border-b border-white/[0.08] bg-radial-hero">
            <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
              {/* Shimmering Top Pill Badge */}
              <div className="shimmer-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-semibold text-slate-300 mb-8 shadow-2xl backdrop-blur-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">Startup Buildathon India 2026</span>
                <span className="text-slate-600">•</span>
                <span className="text-indigo-400 font-bold">Google DeepMind & Cloud Track</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[1.08] text-center max-w-4xl mx-auto">
                Your Checkout Funnel <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                  Is Leaking Crores.
                </span>{" "}
                <br className="hidden sm:inline" />
                <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Our Multimodal AI Fixes It In 60s.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
                Traditional analytics only show <span className="text-slate-200 font-semibold">WHERE</span> users left. 
                FunnelDoctor AI fuses <span className="text-indigo-300 font-semibold">Cloud SQL Telemetry</span> with{" "}
                <span className="text-indigo-300 font-semibold">Gemini 2.5 Vision UI X-Rays</span> to uncover{" "}
                <span className="text-emerald-300 font-semibold">WHY</span>, author a complete PRD, and write ready-to-ship React code.
              </p>

              {/* Interactive Raycast-Style Command Palette Hero Audit Bar */}
              <div className="mt-10 w-full max-w-2xl">
                <div className="glass-panel p-2 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border-white/10 focus-within:border-indigo-500/50 transition-all">
                  <div className="flex items-center gap-2.5 px-3 w-full flex-1">
                    <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      value={heroUrlInput}
                      onChange={(e) => setHeroUrlInput(e.target.value)}
                      placeholder="Paste your checkout URL (e.g. quickstyle-d2c.in/checkout)"
                      className="bg-transparent border-none text-xs sm:text-sm text-slate-100 focus:outline-none w-full font-mono placeholder:text-slate-500"
                    />
                    <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-slate-400 shrink-0">
                      Enter ↵
                    </kbd>
                  </div>
                  <button
                    onClick={() => handleLaunchHeroDiagnosis("d2c")}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Diagnosis ➔</span>
                  </button>
                </div>

                {/* 3 Instant Demo Funnel Chips */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="text-[11px] text-slate-500 font-semibold mr-1">Instant Demos:</span>
                  <button
                    onClick={() => {
                      setHeroUrlInput("https://quickstyle-d2c.in/checkout");
                      handleLaunchHeroDiagnosis("d2c");
                    }}
                    className="glass-pill px-3 py-1.5 rounded-xl text-slate-300 hover:text-white transition flex items-center gap-1.5 hover:border-rose-500/40"
                  >
                    <span>🛍️ QuickStyle D2C</span>
                    <span className="text-rose-400 font-mono font-bold">-71.7% Drop</span>
                  </button>

                  <button
                    onClick={() => {
                      setHeroUrlInput("https://finpulse.bank/kyc-agent");
                      handleLaunchHeroDiagnosis("kyc");
                    }}
                    className="glass-pill px-3 py-1.5 rounded-xl text-slate-300 hover:text-white transition flex items-center gap-1.5 hover:border-rose-500/40"
                  >
                    <span>💳 FinPulse Neo-KYC</span>
                    <span className="text-rose-400 font-mono font-bold">-74.8% Drop</span>
                  </button>

                  <button
                    onClick={() => {
                      setHeroUrlInput("https://prepmate.in/iit-jee/paywall");
                      handleLaunchHeroDiagnosis("edtech");
                    }}
                    className="glass-pill px-3 py-1.5 rounded-xl text-slate-300 hover:text-white transition flex items-center gap-1.5 hover:border-rose-500/40"
                  >
                    <span>🎓 PrepMate EdTech</span>
                    <span className="text-rose-400 font-mono font-bold">-96.5% Drop</span>
                  </button>
                </div>
              </div>

              {/* 3D-Angled Hero Preview Mockup Card */}
              <div className="mt-14 w-full max-w-4xl relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition duration-1000" />
                <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 text-left shadow-2xl">
                  {/* Top Bar of the Mockup */}
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08] text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 font-mono text-[11px] text-slate-400">
                        FunnelDoctor_Multimodal_Kernel.exe &bull; QuickStyle D2C Checkout Session
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Live Telemetry Correlated
                    </span>
                  </div>

                  {/* 2-Column Split: Telemetry Chart on Left + Gemini Vision Phone on Right */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Left: Bleeding Step 4 Telemetry */}
                    <div className="bg-[#030712] p-5 rounded-2xl border border-white/[0.08] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                            Funnel Stage 4 Telemetry
                          </span>
                          <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                            -71.7% Drop-off
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-white mt-1">
                          Step 4: Checkout & Address Wall
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          5,100 visitors entered &bull; Only 1,443 reached UPI payment.
                        </p>
                      </div>

                      {/* Drop Bar Visualization */}
                      <div className="my-5 flex flex-col gap-2">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Conversion: 28.3%</span>
                          <span className="text-rose-400 font-bold">Lost: 3,657 shoppers</span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-white/5">
                          <div className="bg-emerald-500 h-full w-[28%]" />
                          <div className="bg-rose-500/80 h-full w-[72%] animate-pulse" />
                        </div>
                      </div>

                      {/* Leaked Cash Counter */}
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">
                            Estimated Monthly Revenue Leak
                          </p>
                          <p className="text-lg font-black text-rose-400">₹68.4 Lakhs / mo</p>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                      </div>
                    </div>

                    {/* Right: Gemini Vision Screenshot Frame */}
                    <div className="relative bg-[#030712] p-4 rounded-2xl border border-white/[0.08] flex flex-col items-center">
                      <div className="w-full flex items-center justify-between mb-3 text-[11px]">
                        <span className="font-mono text-indigo-400 flex items-center gap-1 font-bold">
                          <Eye className="w-3.5 h-3.5" />
                          Gemini 2.5 Vision X-Ray
                        </span>
                        <span className="text-slate-500 font-mono">Viewport: 390 x 844</span>
                      </div>

                      {/* Simulated Phone Viewport with Scanning Radar */}
                      <div className="relative w-full max-w-[240px] aspect-[9/16] bg-slate-950 rounded-2xl border-2 border-slate-800 p-2 overflow-hidden shadow-2xl flex flex-col justify-between">
                        {/* Radar Scanline */}
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#6366f1] animate-radar-scan z-20 pointer-events-none" />

                        {/* Simulated Checkout Screen Mockup */}
                        <div className="flex flex-col gap-1.5 opacity-80 text-[8px]">
                          <div className="h-4 bg-slate-800 rounded flex items-center px-1.5 text-slate-300">
                            🔒 QuickStyle Checkout
                          </div>
                          <div className="p-2 bg-slate-900 rounded border border-slate-800 flex flex-col gap-1">
                            <div className="h-2 w-16 bg-slate-700 rounded" />
                            <div className="h-2 w-full bg-slate-800 rounded" />
                            <div className="h-2 w-3/4 bg-slate-800 rounded" />
                          </div>
                          <div className="p-2 bg-slate-900 rounded border border-slate-800 flex flex-col gap-1">
                            <div className="h-2 w-12 bg-slate-700 rounded" />
                            <div className="h-2 w-full bg-slate-800 rounded" />
                          </div>
                        </div>

                        {/* Flaw Highlight Pin #3 */}
                        <div className="relative p-2 rounded-xl bg-rose-500/20 border border-rose-500 text-[9px] text-rose-300 font-mono flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 font-bold text-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            <span>FLAW #3: BUTTON OCCLUDED</span>
                          </div>
                          <span>Virtual keyboard pushed UPI button 240px below fold.</span>
                        </div>
                      </div>

                      <p className="mt-3 text-[10px] text-slate-500 text-center font-mono">
                        Nielsen Heuristic #8 Violated: Aesthetic and Minimalist Design
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROBLEM SECTION: OLD WAY VS FUNNELDOCTOR AI */}
          <section className="py-24 px-4 md:px-8 border-b border-white/[0.08] relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-indigo-400">
                  The Paradigm Shift
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
                  Why Traditional Funnel Analytics Leave You Bleeding Cash
                </h2>
                <p className="mt-4 text-sm text-slate-400">
                  Google Analytics and Mixpanel give you numbers with zero visual empathy. FunnelDoctor AI connects the telemetry to the exact pixels.
                </p>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* The Old Way */}
                <div className="glass-panel p-8 rounded-3xl border-rose-500/20 bg-rose-950/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-rose-400 font-extrabold text-sm mb-4">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
                        <X className="w-4 h-4 text-rose-400" />
                      </div>
                      <span>The Old Way (Mixpanel, GA4, Hotjar)</span>
                    </div>

                    <ul className="flex flex-col gap-4 text-xs text-slate-400">
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>Shows you dropped users as a percentage with zero explanation of why they abandoned.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>Forces engineers and PMs to spend 3 weeks debating subjective opinions and digging logs.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>Zero integration with responsive viewport rendering or virtual keyboard occlusion.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>Leaves the fix unwritten while your checkout bleeds lakhs every single week.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-mono">
                    Outcome: 3 weeks of meetings &bull; ₹15 Lakhs lost during deliberation
                  </div>
                </div>

                {/* The FunnelDoctor AI Breakthrough */}
                <div className="glass-panel p-8 rounded-3xl border-emerald-500/30 bg-emerald-950/5 flex flex-col justify-between shadow-2xl shadow-emerald-500/10">
                  <div>
                    <div className="flex items-center gap-3 text-emerald-400 font-extrabold text-sm mb-4">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span>The FunnelDoctor AI Autonomous Agent</span>
                    </div>

                    <ul className="flex flex-col gap-4 text-xs text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Correlates raw Cloud SQL session events with Gemini 2.5 Multimodal UI Vision X-Rays.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Pins exact UI hotspot flaws evaluated against Nielsen Norman Heuristics.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Generates a complete engineering PRD with RICE prioritization matrix.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>Outputs ready-to-ship production React code to deploy the fix in under 60 seconds.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono flex items-center justify-between">
                    <span>Outcome: Fixed in 60s &bull; Estimated +₹26 Lakhs/mo revenue lift</span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* THE MULTI-CRORE ASYMMETRIC BENTO GRID */}
          <section className="py-24 px-4 md:px-8 border-b border-white/[0.08] relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-indigo-400">
                  Multimodal Architecture
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
                  Engineered with Google DeepMind & Google Cloud
                </h2>
                <p className="mt-4 text-sm text-slate-400">
                  Four autonomous intelligence layers working in concert to diagnose and repair conversion bottlenecks.
                </p>
              </div>

              {/* Asymmetric Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tile 1: Large 2-Col - Gemini Vision X-Ray */}
                <div className="md:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold">
                      Layer 01 &bull; Qualitative Vision
                    </span>
                    <span className="text-xs text-slate-500 font-mono">gemini-2.5-flash</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Gemini 2.5 Vision UI X-Ray</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-xl">
                    Crawls your live URL at 390px, 768px, and 1440px viewports. Inspects visual hierarchy, occluded buttons, contrast ratios, and Nielsen Norman UX heuristic violations.
                  </p>

                  <div className="mt-6 bg-[#030712] p-4 rounded-2xl border border-white/[0.08] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                      <Eye className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-mono">
                      <p className="text-indigo-300 font-bold">Heuristic #8 Violation Detected</p>
                      <p className="text-slate-400">UPI CTA pushed below virtual keyboard fold on Android viewports.</p>
                    </div>
                  </div>
                </div>

                {/* Tile 2: 1-Col - BigQuery Telemetry Engine */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold">
                      Layer 02 &bull; Quantitative
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-2">Cloud SQL Telemetry Engine</h3>
                    <p className="text-xs text-slate-400 mt-2">
                      Translates natural language questions into BigQuery SQL, ingesting raw event logs to pinpoint drop-offs with statistical confidence.
                    </p>
                  </div>
                  <div className="mt-6 p-3 bg-[#030712] rounded-xl border border-white/[0.08] text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                    <span>⚡ 100k events/sec</span>
                    <Database className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* Tile 3: 1-Col - RCA Heuristics Engine */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold">
                      Layer 03 &bull; Synthesis
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-2">Root-Cause Heuristics</h3>
                    <p className="text-xs text-slate-400 mt-2">
                      Weighs drop-offs across User Friction, Network Latency, and Pricing Transparency to build a mathematical causality model.
                    </p>
                  </div>
                  <div className="mt-6 p-3 bg-[#030712] rounded-xl border border-white/[0.08] text-[11px] font-mono text-amber-300 flex items-center justify-between">
                    <span>42% Friction &bull; 34% Wall</span>
                    <Flame className="w-4 h-4 text-amber-400" />
                  </div>
                </div>

                {/* Tile 4: Large 2-Col - Auto-PRD & Production React Code */}
                <div className="md:col-span-2 glass-panel p-8 rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-400 font-bold">
                        Layer 04 &bull; Autonomous Action
                      </span>
                      <span className="text-xs text-slate-500 font-mono">React + Tailwind CSS</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">Auto-PRD & Production Code Studio</h3>
                    <p className="text-xs text-slate-400 mt-2">
                      Does not just diagnose—FunnelDoctor AI authors an executive PRD with RICE scores and produces production-grade React code components ready to commit into your repository.
                    </p>
                  </div>

                  <div className="mt-6 bg-[#030712] p-4 rounded-2xl border border-white/[0.08] font-mono text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="text-emerald-400">export function ExpressCheckoutBar() &#123; ... &#125;</span>
                    <span className="text-slate-500 text-[10px]">1-Click Copy Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE ROI RECOVERY CALCULATOR */}
          <section className="py-24 px-4 md:px-8 border-b border-white/[0.08] relative">
            <div className="max-w-4xl mx-auto">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Value Realization
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
                  Calculate Your Recoverable Revenue
                </h2>
                <p className="mt-4 text-sm text-slate-400">
                  Drag the sliders to model your startup’s funnel metrics and see how much cash FunnelDoctor AI can recover.
                </p>
              </div>

              {/* Calculator Box */}
              <div className="glass-panel p-8 sm:p-10 rounded-3xl border-white/10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Left: Sliders */}
                  <div className="flex flex-col gap-6">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
                        <span>Monthly Funnel Visitors</span>
                        <span className="text-indigo-400 font-mono font-bold" suppressHydrationWarning>
                          {formatNumber(calcVisitors)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="500000"
                        step="10000"
                        value={calcVisitors}
                        onChange={(e) => setCalcVisitors(Number(e.target.value))}
                        className="w-full accent-indigo-500 bg-slate-900 rounded-lg cursor-pointer h-2"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                        <span>10,000</span>
                        <span>500,000</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
                        <span>Drop-off Rate at Worst Bottleneck</span>
                        <span className="text-rose-400 font-mono font-bold" suppressHydrationWarning>
                          {calcDropRate}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="95"
                        step="1"
                        value={calcDropRate}
                        onChange={(e) => setCalcDropRate(Number(e.target.value))}
                        className="w-full accent-rose-500 bg-slate-900 rounded-lg cursor-pointer h-2"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                        <span>20% (Healthy)</span>
                        <span>95% (Catastrophic)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
                        <span>Average Order Value (AOV)</span>
                        <span className="text-emerald-400 font-mono font-bold" suppressHydrationWarning>
                          ₹{formatNumber(calcAov)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="200"
                        max="10000"
                        step="100"
                        value={calcAov}
                        onChange={(e) => setCalcAov(Number(e.target.value))}
                        className="w-full accent-emerald-500 bg-slate-900 rounded-lg cursor-pointer h-2"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                        <span>₹200</span>
                        <span>₹10,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Revenue Impact Output Card */}
                  <div className="bg-[#030712] p-8 rounded-2xl border border-white/[0.08] flex flex-col justify-between shadow-2xl text-center">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                        Monthly Revenue Leaking
                      </span>
                      <p className="text-3xl sm:text-4xl font-extrabold text-rose-400 mt-2" suppressHydrationWarning>
                        ₹{(calculatedLeaked / 100000).toFixed(1)} Lakhs
                        <span className="text-xs font-normal text-slate-500"> / month</span>
                      </p>
                    </div>

                    <div className="my-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                      <span className="text-[10px] uppercase font-mono font-extrabold text-emerald-300 tracking-wider">
                        Recoverable ARR Boost (+22% Lift)
                      </span>
                      <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1" suppressHydrationWarning>
                        +₹{(calculatedRecoverable / 100000).toFixed(1)} Lakhs/mo
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-1" suppressHydrationWarning>
                        (~₹{(calculatedAnnualLift / 10000000).toFixed(2)} Crores Annual ARR)
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setViewMode("workspace");
                        setActiveTab("prd");
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Recover This Revenue Now ➔</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SAAS PRICING MATRIX */}
          <section className="py-24 px-4 md:px-8 border-b border-white/[0.08] relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-indigo-400">
                  Transparent SaaS Pricing
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
                  Built to Pay for Itself on Day 1
                </h2>
                <p className="mt-4 text-sm text-slate-400">
                  Start with our developer CLI or deploy the full multimodal autonomous agent across your startup funnels.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tier 1: Starter */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Developer</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">Free</span>
                      <span className="text-xs text-slate-500">/ forever (OSS)</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Local CLI & CSV heuristic auditor for open-source builders.
                    </p>

                    <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>CLI & CSV Funnel Parser</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Nielsen Heuristic Diagnostics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Markdown PRD Generation</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setViewMode("workspace")}
                    className="mt-8 w-full py-2.5 rounded-xl border border-white/10 hover:bg-slate-800 text-xs font-bold text-white transition"
                  >
                    Launch Open Source
                  </button>
                </div>

                {/* Tier 2: Pro (Multimodal Vision) - Highlighted */}
                <div className="glass-panel p-8 rounded-3xl border-indigo-500/50 bg-indigo-950/10 flex flex-col justify-between shadow-2xl shadow-indigo-500/20 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-black uppercase tracking-wider text-white">
                    Most Popular &bull; Buildathon Special
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Startup Pro</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">₹7,999</span>
                      <span className="text-xs text-slate-500">/ month</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Full Multimodal Vision X-Ray, SQL Telemetry & React Code Generator.
                    </p>

                    <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Unlimited Gemini 2.5 Vision Audits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>BigQuery Natural-Language SQL Lab</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Production React UI Component Diff</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Autonomous AI PM Voice Agent</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleLaunchHeroDiagnosis("d2c")}
                    className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 transition"
                  >
                    Start 14-Day Free Trial
                  </button>
                </div>

                {/* Tier 3: Enterprise */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Enterprise Scale</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">₹39,999</span>
                      <span className="text-xs text-slate-500">/ month</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Real-time telemetry pipelines and automated PR deployment to GitHub.
                    </p>

                    <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Automated GitHub PR Pull Requests</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Weekly Slack Root-Cause Alerts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Dedicated Cloud SQL / BigQuery Pipelines</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setViewMode("workspace")}
                    className="mt-8 w-full py-2.5 rounded-xl border border-white/10 hover:bg-slate-800 text-xs font-bold text-white transition"
                  >
                    Contact Enterprise
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-white/[0.08] px-6 py-12 text-center text-xs text-slate-500 bg-[#02040a]">
            <p>
              FunnelDoctor AI &copy; 2026 &bull; Built for Startup Buildathon India 2026 &bull; Powered by Google DeepMind & Google Cloud
            </p>
            <p className="mt-2 text-[11px] text-slate-600 font-mono">
              Designed with precision for founders and growth engineers losing crores in checkout.
            </p>
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE B: THE INTERACTIVE 5-TAB APP COMMAND CENTER WORKSPACE          */}
      {/* ========================================================================= */}
      {viewMode === "workspace" && (
        <div className="flex-1 flex flex-col md:flex-row relative z-10">
          {/* LEFT SIDEBAR (Dark Obsidian w-64) */}
          <aside className="w-full md:w-64 bg-[#02040a]/90 backdrop-blur-2xl border-r border-white/[0.08] p-4 flex flex-col justify-between shrink-0">
            <div className="flex flex-col gap-6">
              {/* Dataset Switcher Pills */}
              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-[0.18em] block mb-2">
                  Active Startup Funnel
                </label>
                <div className="flex flex-col gap-1.5">
                  {(["d2c", "kyc", "edtech"] as DatasetId[]).map((id) => {
                    const d = DATASETS[id];
                    const isSelected = activeDatasetId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setActiveDatasetId(id);
                          setSelectedPinId(1);
                          showToast(`Loaded ${d.name}`);
                        }}
                        className={`w-full p-2.5 rounded-2xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? "bg-slate-800/90 border-indigo-500/40 shadow-lg text-white font-bold"
                            : "glass-pill text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="truncate">
                          <p className="text-xs truncate">{d.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{d.companyCategory}</p>
                        </div>
                        <span className="text-[10px] font-mono text-rose-400 font-bold shrink-0">
                          -{d.bleedingDropRate}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5 Navigation Tabs */}
              <nav className="flex flex-col gap-1.5 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "telemetry"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>1. Funnel Telemetry</span>
                </button>

                <button
                  onClick={() => setActiveTab("vision")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "vision"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>2. Gemini Vision X-Ray</span>
                </button>

                <button
                  onClick={() => setActiveTab("rca")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "rca"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>3. Root-Cause & SQL Lab</span>
                </button>

                <button
                  onClick={() => setActiveTab("prd")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "prd"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <FileCode2 className="w-4 h-4" />
                  <span>4. Auto-PRD & UI Fix</span>
                </button>

                <button
                  onClick={() => setActiveTab("pm")}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                    activeTab === "pm"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>5. Live AI PM War Room</span>
                </button>
              </nav>

              {/* Active Dataset Quick Summary Card */}
              <div className="bg-[#030712] p-3.5 rounded-2xl border border-white/[0.08] text-[11px] flex flex-col gap-2">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Overall Conv:</span>
                  <span className="text-emerald-400 font-bold">{dataset.overallConversion}%</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Leaked ARR:</span>
                  <span className="text-rose-400 font-bold">{dataset.monthlyLeakedRevenue}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Recoverable:</span>
                  <span className="text-indigo-400 font-bold">{dataset.recoverableRevenue}</span>
                </div>
              </div>
            </div>

            {/* Bottom 60s Pitch Script Launcher */}
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setShowPitchModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/5"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>60-Sec Pitch Script</span>
              </button>
            </div>
          </aside>

          {/* MAIN WORKSPACE CONTENT PANE */}
          <main className="flex-1 bg-[#02040a] p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
            {/* Top Workspace Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    {dataset.companyCategory} &bull; Funnel Audit
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">Live Telemetry Ingested</span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">{dataset.name}</h2>
                <p className="text-xs text-slate-400">{dataset.tagline}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(dataset.prdMarkdown, "Engineering PRD")}
                  className="glass-pill px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy PRD</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("prd");
                    showToast("Switched to Auto-PRD & Code Studio");
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>View Code Fix</span>
                </button>
              </div>
            </div>

            {/* ================================================================= */}
            {/* TAB 1: FUNNEL TELEMETRY                                           */}
            {/* ================================================================= */}
            {activeTab === "telemetry" && (
              <div className="flex flex-col gap-6">
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Initial Visitors</span>
                    <p className="text-2xl font-extrabold text-white mt-2" suppressHydrationWarning>
                      {formatNumber(dataset.monthlyVisitors)}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1">Ingested via BigQuery</span>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border-rose-500/30 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-rose-300 uppercase tracking-wider">Bleeding Bottleneck</span>
                    <p className="text-2xl font-extrabold text-rose-400 mt-2">
                      -{dataset.bleedingDropRate}% Drop
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 truncate">{dataset.bleedingStepName}</span>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">Monthly Revenue Leaked</span>
                    <p className="text-2xl font-extrabold text-amber-400 mt-2">
                      {dataset.monthlyLeakedRevenue}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1">AOV: ₹{formatNumber(dataset.aov)}</span>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider">Recoverable Lift (+22%)</span>
                    <p className="text-2xl font-extrabold text-emerald-400 mt-2">
                      {dataset.recoverableRevenue}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1">With 1-Tap Component Fix</span>
                  </div>
                </div>

                {/* Funnel Waterfall Steps */}
                <div className="glass-panel p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-extrabold text-base text-white">Full-Funnel Stage-by-Stage Telemetry</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Click any stage to run vision correlation.</p>
                    </div>
                    <span className="text-xs font-mono text-slate-500">N=6 Sequential Steps</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {dataset.steps.map((st, idx) => {
                      const pctOfInitial = Math.round((st.visitors / dataset.monthlyVisitors) * 100);
                      return (
                        <div
                          key={st.id}
                          className={`p-4 rounded-2xl border transition ${
                            st.isBleedingBottleneck
                              ? "bg-rose-950/20 border-rose-500/40 shadow-xl"
                              : "bg-[#030712] border-white/[0.08]"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}.</span>
                              <span className="text-sm font-extrabold text-white">{st.name}</span>
                              {st.isBleedingBottleneck && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                                  🚨 CRITICAL LEAK POINT
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 font-mono text-xs">
                              <span className="text-slate-300" suppressHydrationWarning>
                                {formatNumber(st.visitors)} sessions
                              </span>
                              <span className="text-slate-500">({pctOfInitial}%)</span>
                              {st.dropoffRate > 0 && (
                                <span className="text-rose-400 font-bold">
                                  -{(st.dropoffRate * 100).toFixed(1)}% drop
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-white/5">
                            <div
                              className={`h-full transition-all duration-500 ${
                                st.isBleedingBottleneck ? "bg-rose-500" : "bg-indigo-500"
                              }`}
                              style={{ width: `${pctOfInitial}%` }}
                            />
                          </div>

                          {st.isBleedingBottleneck && (
                            <div className="mt-3 flex items-center justify-between text-xs text-rose-300 pt-2 border-t border-rose-500/20">
                              <span suppressHydrationWarning>
                                ⚠️ <strong>{formatNumber(st.dropoffCount)} shoppers</strong> dropped at this exact step.
                              </span>
                              <button
                                onClick={() => setActiveTab("vision")}
                                className="underline font-bold hover:text-white"
                              >
                                View Vision X-Ray ➔
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cohort Retention Heatmap */}
                <div className="glass-panel p-6 rounded-3xl">
                  <h3 className="font-extrabold text-base text-white mb-1">Weekly Cohort Retention Matrix</h3>
                  <p className="text-xs text-slate-400 mb-6">Tracking repeat checkout activity post-drop-off intervention.</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-white/[0.08] text-slate-500 font-mono text-[10px] uppercase">
                          <th className="pb-3">Cohort</th>
                          <th className="pb-3 text-center">Week 0</th>
                          <th className="pb-3 text-center">Week 1</th>
                          <th className="pb-3 text-center">Week 2</th>
                          <th className="pb-3 text-center">Week 3</th>
                          <th className="pb-3 text-center">Week 4</th>
                          <th className="pb-3 text-center">Week 5</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {dataset.retentionMatrix.map((r, i) => (
                          <tr key={i} className="font-mono">
                            <td className="py-2.5 text-slate-300 font-semibold">{r.cohort}</td>
                            <td className="text-center py-2.5 bg-indigo-500/25 text-indigo-200">{r.w0}%</td>
                            <td className="text-center py-2.5 bg-indigo-500/20 text-indigo-200">{r.w1}%</td>
                            <td className="text-center py-2.5 bg-indigo-500/15 text-indigo-300">{r.w2}%</td>
                            <td className="text-center py-2.5 bg-indigo-500/10 text-indigo-300">{r.w3}%</td>
                            <td className="text-center py-2.5 bg-indigo-500/5 text-slate-400">{r.w4}%</td>
                            <td className="text-center py-2.5 text-slate-500">{r.w5}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 2: GEMINI VISION UX X-RAY                                     */}
            {/* ================================================================= */}
            {activeTab === "vision" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side (5 Cols): Interactive Smartphone Device Mockup */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="glass-panel p-4 rounded-3xl w-full flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-4 text-xs">
                      <span className="font-mono text-indigo-400 font-bold flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        Viewport: 390px Mobile Viewport
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Gemini Vision 2.5</span>
                    </div>

                    {/* Smartphone Titanium Frame */}
                    <div className="relative w-[280px] sm:w-[320px] aspect-[9/18] bg-[#030712] rounded-[48px] border-4 border-slate-700 shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
                      {/* Top Dynamic Island */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-950 ml-16" />
                      </div>

                      {/* Radar Scanline Animation */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#6366f1] animate-radar-scan z-20 pointer-events-none" />

                      {/* Simulated Screen Content */}
                      <div className="relative w-full h-full bg-slate-950 rounded-[38px] p-4 pt-10 flex flex-col justify-between text-[10px] overflow-hidden">
                        {/* Mockup Elements */}
                        <div className="flex flex-col gap-2 opacity-80">
                          <div className="h-4 bg-slate-800 rounded-lg flex items-center px-2 text-slate-300 font-bold">
                            {dataset.name}
                          </div>
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                            <div className="h-2.5 w-20 bg-slate-700 rounded" />
                            <div className="h-2 w-full bg-slate-800 rounded" />
                            <div className="h-2 w-4/5 bg-slate-800 rounded" />
                          </div>
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-1.5">
                            <div className="h-2.5 w-16 bg-slate-700 rounded" />
                            <div className="h-2 w-full bg-slate-800 rounded" />
                          </div>
                        </div>

                        {/* Interactive Pulsing Hotspot Pins */}
                        {dataset.hotspots.map((pin) => {
                          const isSelected = selectedPinId === pin.id;
                          return (
                            <button
                              key={pin.id}
                              onClick={() => setSelectedPinId(pin.id)}
                              style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                              className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-transform ${
                                isSelected ? "scale-125" : "hover:scale-110"
                              }`}
                            >
                              <span className="relative flex h-8 w-8 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-600 text-white font-black text-[11px] items-center justify-center shadow-lg border border-white">
                                  {pin.id}
                                </span>
                              </span>
                            </button>
                          );
                        })}

                        {/* Bottom Phone Indicator Bar */}
                        <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto" />
                      </div>
                    </div>

                    {/* Screenshot Upload Dropzone */}
                    <div className="mt-4 w-full">
                      <label className="w-full py-2.5 rounded-xl border border-dashed border-white/10 hover:border-indigo-400/50 text-[11px] font-mono text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Upload Custom Screenshot to Audit</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadCustomScreenshot}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Side (7 Cols): Hotspot Diagnostic Inspector */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {/* Pin Selection Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {dataset.hotspots.map((pin) => (
                      <button
                        key={pin.id}
                        onClick={() => setSelectedPinId(pin.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                          selectedPinId === pin.id
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                            : "glass-pill text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>Flaw #{pin.id}</span>
                        <span className="text-[10px] opacity-80">{pin.severity}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Pin Details Card */}
                  {(() => {
                    const pin = dataset.hotspots.find((p) => p.id === selectedPinId) || dataset.hotspots[0];
                    return (
                      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-6 shadow-2xl">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                              Identified Bottleneck Flaw #{pin.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                              {pin.severity} SEVERITY
                            </span>
                          </div>
                          <h3 className="text-xl font-extrabold text-white mt-1">{pin.title}</h3>
                        </div>

                        {/* Nielsen Heuristic Tag */}
                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                          <span className="text-[10px] font-mono uppercase font-bold text-indigo-300">
                            Heuristic Violated:
                          </span>
                          <p className="text-xs font-semibold text-indigo-200 mt-0.5">
                            {pin.heuristicViolated}
                          </p>
                        </div>

                        {/* Gemini Vision Multimodal Finding */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            Gemini 2.5 Vision Observation:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed bg-[#030712] p-4 rounded-2xl border border-white/[0.08]">
                            {pin.geminiVisionFinding}
                          </p>
                        </div>

                        {/* Telemetry Correlation */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-emerald-400" />
                            Correlated SQL Telemetry Evidence:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed bg-[#030712] p-4 rounded-2xl border border-white/[0.08]">
                            {pin.telemetryEvidence}
                          </p>
                        </div>

                        {/* Prescribed Solution */}
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-[10px] font-mono uppercase font-bold text-emerald-300">
                            Prescribed Engineering Fix:
                          </span>
                          <p className="text-xs font-bold text-emerald-200 mt-0.5">
                            {pin.prescribedFix}
                          </p>
                        </div>

                        {/* Jump to Code CTA */}
                        <button
                          onClick={() => {
                            setActiveTab("prd");
                            showToast("Navigated to Auto-PRD & Code Studio");
                          }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Generate Code Fix for Flaw #{pin.id} ➔</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 3: ROOT-CAUSE & SQL LAB                                       */}
            {/* ================================================================= */}
            {activeTab === "rca" && (
              <div className="flex flex-col gap-6">
                {/* Natural Language Prompt & SQL Presets */}
                <div className="glass-panel p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-base text-white">Natural Language SQL Telemetry Studio</h3>
                      <p className="text-xs text-slate-400">Ask any question about drop-off causality. Ingested via BigQuery Sandbox.</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      ⚡ BigQuery Connected
                    </span>
                  </div>

                  {/* Preset Query Chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.sqlPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSqlPresetIdx(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          selectedSqlPresetIdx === idx
                            ? "bg-indigo-600 text-white font-bold"
                            : "glass-pill text-slate-400 hover:text-white"
                        }`}
                      >
                        {preset.prompt}
                      </button>
                    ))}
                  </div>

                  {/* IDE-Style SQL Code Block */}
                  {(() => {
                    const preset = dataset.sqlPresets[selectedSqlPresetIdx] || dataset.sqlPresets[0];
                    return (
                      <div className="flex flex-col gap-4">
                        <div className="bg-[#030712] rounded-2xl border border-white/[0.08] p-4 font-mono text-xs overflow-x-auto text-indigo-300">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[10px] text-slate-500">
                            <span>BigQuery Engine &bull; Standard SQL 2.0</span>
                            <button
                              onClick={() => copyToClipboard(preset.sql, "SQL Query")}
                              className="hover:text-white flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy SQL</span>
                            </button>
                          </div>
                          <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap">{preset.sql}</pre>
                        </div>

                        {/* Query Execution Result Table */}
                        <div className="bg-[#030712] rounded-2xl border border-white/[0.08] p-4">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-3">
                            Query Result Set (3 Rows Returned &bull; Latency: 182ms)
                          </span>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className="border-b border-white/[0.08] text-slate-500 font-mono text-[10px] uppercase">
                                  {Object.keys(preset.resultRows[0]).map((k) => (
                                    <th key={k} className="pb-2">{k}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/[0.04]">
                                {preset.resultRows.map((row, i) => (
                                  <tr key={i} className="font-mono text-slate-300">
                                    {Object.values(row).map((val, vi) => (
                                      <td key={vi} className="py-2">{val}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Gemini Takeaway Card */}
                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white">Gemini Multimodal Takeaway: </strong>
                            <span>{preset.geminiTakeaway}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Weighted RCA Distribution */}
                <div className="glass-panel p-6 rounded-3xl">
                  <h3 className="font-extrabold text-base text-white mb-1">Root-Cause Weight Distribution</h3>
                  <p className="text-xs text-slate-400 mb-6">Quantitative correlation of friction contributors.</p>

                  <div className="flex flex-col gap-4">
                    {dataset.weightedRca.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-white">{item.pillar}</span>
                          <span className="font-mono text-slate-300 font-bold">{item.weight}% weight</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-white/5">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.weight}%` }} />
                        </div>
                        <p className="text-[11px] text-slate-400">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 4: AUTO-PRD & PRODUCTION UI FIX STUDIO                        */}
            {/* ================================================================= */}
            {activeTab === "prd" && (
              <div className="flex flex-col gap-8">
                {/* Top Section: Markdown PRD Document */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-extrabold text-base text-white">Autonomous Engineering PRD</h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(dataset.prdMarkdown, "Engineering PRD")}
                      className="glass-pill px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full PRD</span>
                    </button>
                  </div>

                  <div className="bg-[#030712] p-6 rounded-2xl border border-white/[0.08] text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {dataset.prdMarkdown}
                  </div>
                </div>

                {/* Split Interactive View: Current Broken UI vs Redesigned UI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Broken UI Flaws */}
                  <div className="glass-panel p-6 rounded-3xl border-rose-500/20 bg-rose-950/5">
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                      {dataset.brokenUiWireframeTitle}
                    </span>
                    <h4 className="text-base font-extrabold text-white mt-1 mb-4">Current Pain Points</h4>

                    <div className="flex flex-col gap-2.5 text-xs text-slate-300">
                      {dataset.brokenUiItems.map((item, i) => (
                        <div key={i} className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.06]">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: FunnelDoctor Redesigned Component */}
                  <div className="glass-panel p-6 rounded-3xl border-emerald-500/30 bg-emerald-950/5 shadow-xl shadow-emerald-500/10">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      {dataset.redesignedUiTitle}
                    </span>
                    <h4 className="text-base font-extrabold text-white mt-1 mb-4">Production Interventions</h4>

                    <div className="flex flex-col gap-2.5 text-xs text-slate-200">
                      {dataset.redesignedUiFeatures.map((feat, i) => (
                        <div key={i} className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20 text-emerald-200 font-semibold">
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Production Ready React Component Code Diff */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 font-bold">
                      <Code2 className="w-4 h-4" />
                      <span>Ready-to-Ship React Component (TypeScript + Tailwind)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(dataset.codeDiff, "React Component Code")}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 fill-current" />
                      <span>Copy Component Code</span>
                    </button>
                  </div>

                  <div className="bg-[#030712] p-5 rounded-2xl border border-white/[0.08] font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                    <pre className="text-slate-300 whitespace-pre-wrap">{dataset.codeDiff}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 5: LIVE AI PM WAR ROOM                                        */}
            {/* ================================================================= */}
            {activeTab === "pm" && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between min-h-[550px] shadow-2xl">
                {/* Header & Waveform */}
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-white">Autonomous AI Principal PM</h3>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Trained on 1,400+ D2C, Fintech & EdTech Funnels
                        </p>
                      </div>
                    </div>

                    {/* Animated Audio Waveform & Speech Toggle */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-end gap-1 h-6">
                        <span className="w-1 bg-indigo-500 rounded-full animate-wave-1" />
                        <span className="w-1 bg-purple-500 rounded-full animate-wave-2" />
                        <span className="w-1 bg-emerald-400 rounded-full animate-wave-3" />
                        <span className="w-1 bg-indigo-400 rounded-full animate-wave-4" />
                        <span className="w-1 bg-violet-400 rounded-full animate-wave-5" />
                      </div>

                      <button
                        onClick={() => {
                          if ("speechSynthesis" in window) {
                            if (isSpeakingAudio) {
                              window.speechSynthesis.cancel();
                              setIsSpeakingAudio(false);
                            } else {
                              const lastMsg = voiceMessages[voiceMessages.length - 1];
                              if (lastMsg) {
                                const u = new SpeechSynthesisUtterance(lastMsg.text);
                                u.onend = () => setIsSpeakingAudio(false);
                                setIsSpeakingAudio(true);
                                window.speechSynthesis.speak(u);
                              }
                            }
                          }
                        }}
                        className={`p-2 rounded-xl border transition ${
                          isSpeakingAudio
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                            : "glass-pill text-slate-400 hover:text-white"
                        }`}
                        title={isSpeakingAudio ? "Mute Speech" : "Listen to Audio Briefing"}
                      >
                        {isSpeakingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages Thread */}
                  <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2">
                    {voiceMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col max-w-[85%] ${
                          msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium"
                              : "bg-[#030712] border border-white/[0.08] text-slate-200"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 font-mono">{msg.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prompt Suggestions */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => handleSendVoiceQuery("Give me an executive summary of this funnel")}
                    className="glass-pill px-3 py-1.5 rounded-xl text-slate-400 hover:text-white transition"
                  >
                    💬 Executive Summary
                  </button>
                  <button
                    onClick={() => handleSendVoiceQuery("What should our engineers deploy first?")}
                    className="glass-pill px-3 py-1.5 rounded-xl text-slate-400 hover:text-white transition"
                  >
                    🚀 Top Engineering Priority
                  </button>
                  <button
                    onClick={() => handleSendVoiceQuery("How does this compare to industry benchmarks?")}
                    className="glass-pill px-3 py-1.5 rounded-xl text-slate-400 hover:text-white transition"
                  >
                    📊 Benchmark Comparison
                  </button>
                </div>

                {/* Chat Input Bar with Voice Recognition */}
                <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center gap-2">
                  <button
                    onClick={handleToggleVoiceRecording}
                    className={`p-2.5 rounded-xl border transition shrink-0 ${
                      isListeningVoice
                        ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                        : "glass-pill text-slate-400 hover:text-white"
                    }`}
                    title={isListeningVoice ? "Listening..." : "Click to Speak"}
                  >
                    {isListeningVoice ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendVoiceQuery(chatInput);
                    }}
                    placeholder="Ask the AI PM anything (e.g. 'Why are users dropping off at Step 4?')..."
                    className="flex-1 bg-[#030712] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                  />

                  <button
                    onClick={() => handleSendVoiceQuery(chatInput)}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white p-2.5 rounded-xl transition shrink-0 shadow-lg"
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
        <div className="fixed inset-0 z-50 bg-[#02040a]/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel rounded-3xl max-w-md w-full p-8 shadow-2xl flex flex-col items-center text-center border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="font-extrabold text-base text-white">Synthesizing Multimodal RCA</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6 font-mono">{heroUrlInput}</p>

            <div className="w-full flex flex-col gap-2.5 text-xs text-left">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  auditProgressStep >= 1
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-[#030712] border-white/[0.08] text-slate-500"
                }`}
              >
                <span>1. Crawling Responsive UI Viewport (390px)...</span>
                {auditProgressStep >= 1 && <Check className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  auditProgressStep >= 2
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-[#030712] border-white/[0.08] text-slate-500"
                }`}
              >
                <span>2. Querying Event Funnel Telemetry on Cloud SQL...</span>
                {auditProgressStep >= 2 && <Check className="w-4 h-4 text-emerald-400" />}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  auditProgressStep >= 3
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-[#030712] border-white/[0.08] text-slate-500"
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
        <div className="fixed inset-0 z-50 bg-[#02040a]/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-8 shadow-2xl flex flex-col gap-4 relative border-white/10">
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

            <div className="bg-[#030712] p-5 rounded-2xl border border-white/[0.08] text-xs font-mono text-slate-300 leading-relaxed overflow-y-auto max-h-[360px] whitespace-pre-wrap">
{`"Good morning judges! Every startup founder and D2C brand watches users drop off in checkout—losing crores of rupees every month.

Traditional analytics like Mixpanel or GA4 only tell you WHERE people left. They never tell you WHY.

Meet FunnelDoctor AI. We combine Quantitative Funnel Telemetry with Qualitative Gemini Multimodal Vision.

Our agent crawls the URL, takes responsive screenshots, and correlates the exact 71% drop-off with visual UX flaws—like this forced login modal and below-the-fold UPI button.

Then, in under 60 seconds, it writes a complete engineering PRD and hands your developers the ready-to-ship React code fix.

This isn't another analytics dashboard—it's an autonomous AI Product Manager that turns leaked revenue into cash flow. Thank you!"`}
            </div>

            <button
              onClick={() => setShowPitchModal(false)}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white text-xs font-bold rounded-xl transition"
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
        <div className="fixed inset-0 z-50 bg-[#02040a]/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel rounded-3xl max-w-md w-full p-8 shadow-2xl flex flex-col gap-4 relative border-white/10">
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
                className="bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
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
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white font-bold rounded-xl text-xs transition"
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
