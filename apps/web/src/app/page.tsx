"use client";

import React, { useState, useEffect } from "react";
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
  FileText,
  Filter,
  Flame,
  Globe,
  HelpCircle,
  Info,
  Key,
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
// DATASET DEFINITIONS (3 RICH STARTUP FUNNELS)
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
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FREE EXPRESS DELIVERY UNLOCKED</span>
        </div>
        <p className="text-xl font-extrabold text-slate-900">₹1,850</p>
      </div>

      <button 
        onClick={onPay}
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition active:scale-95"
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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Clock className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Next Agent Ready Shortly</h4>
          <p className="text-xs text-slate-500">Position #{queuePosition} in line • Est. {waitTimeSeconds}s</p>
        </div>
      </div>

      <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">
        Keep Screen On & Ring Me
      </button>

      <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 flex items-center justify-center gap-1.5">
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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl flex flex-col gap-4">
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button 
          onClick={() => setBilling('monthly')} 
          className={\`flex-1 py-2 rounded-lg text-xs font-bold \${billing === 'monthly' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600'}\`}
        >
          Monthly Pass (₹399/mo)
        </button>
        <button 
          onClick={() => setBilling('test')} 
          className={\`flex-1 py-2 rounded-lg text-xs font-bold \${billing === 'test' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600'}\`}
        >
          Unlock 1 Test (₹99)
        </button>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
        <p className="text-xs text-indigo-800 font-bold">Includes Video Solutions + AIR Rank Benchmark</p>
      </div>

      <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GLOBAL PERSISTENT HEADER (REMOTE.COM STYLE)                               */}
      {/* ========================================================================= */}
      <header className={`sticky top-0 z-40 transition-colors ${
        viewMode === "website" ? "bg-[#53147e] text-white border-b border-purple-800/40" : "bg-white text-slate-900 border-b border-slate-200 shadow-sm"
      } px-4 md:px-8 py-3.5`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setViewMode("website")}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-md transition-transform group-hover:scale-105 ${
              viewMode === "website" ? "bg-white text-purple-900" : "bg-indigo-600 text-white"
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-base tracking-tight ${viewMode === "website" ? "text-white" : "text-slate-950"}`}>
                  FunnelDoctor<span className={viewMode === "website" ? "text-cyan-300" : "text-indigo-600"}>.ai</span>
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 ${
                  viewMode === "website" ? "bg-white/10 text-cyan-200 border border-white/20" : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 2.5 Active
                </span>
              </div>
              <p className={`text-[11px] font-medium ${viewMode === "website" ? "text-purple-200/80" : "text-slate-500"}`}>
                Autonomous Multimodal Conversion & RCA Agent
              </p>
            </div>
          </div>

          {/* Navigation Links (Remote.com style) */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold">
            <button onClick={() => setViewMode("website")} className={`transition hover:opacity-100 ${viewMode === "website" ? "text-white/80" : "text-slate-600"}`}>
              Telemetry
            </button>
            <button onClick={() => { setViewMode("workspace"); setActiveTab("vision"); }} className={`transition hover:opacity-100 ${viewMode === "website" ? "text-white/80" : "text-slate-600"}`}>
              Vision X-Ray
            </button>
            <button onClick={() => { setViewMode("workspace"); setActiveTab("rca"); }} className={`transition hover:opacity-100 ${viewMode === "website" ? "text-white/80" : "text-slate-600"}`}>
              SQL Lab
            </button>
            <button onClick={() => { setViewMode("workspace"); setActiveTab("prd"); }} className={`transition hover:opacity-100 ${viewMode === "website" ? "text-white/80" : "text-slate-600"}`}>
              PRD Studio
            </button>
          </div>

          {/* Controls & CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle Pill */}
            <div className={`p-1 rounded-xl flex items-center gap-1 border ${
              viewMode === "website" ? "bg-black/20 border-white/15" : "bg-slate-100 border-slate-200"
            }`}>
              <button
                onClick={() => setViewMode("website")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "website"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Website</span>
              </button>
              <button
                onClick={() => setViewMode("workspace")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "workspace"
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : viewMode === "website" ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Workspace</span>
              </button>
            </div>

            {/* Pitch Script */}
            <button
              onClick={() => setShowPitchModal(true)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                viewMode === "website" ? "bg-white/10 hover:bg-white/20 text-white border-white/20" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-cyan-300" />
              <span>Pitch Script</span>
            </button>

            {/* Primary Action Button (White in hero, Indigo in app) */}
            <button
              onClick={() => {
                if (viewMode === "website") {
                  setViewMode("workspace");
                } else {
                  setShowSettingsModal(true);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition active:scale-95 ${
                viewMode === "website" ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {viewMode === "website" ? "Launch Workspace ➔" : "Gemini API"}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* VIEW MODE A: REMOTE.COM EXACT RADIANT GRADIENT + SCULPTURAL HERO          */}
      {/* ========================================================================= */}
      {viewMode === "website" && (
        <div className="flex-1 flex flex-col relative z-10">
          {/* THE ICONIC REMOTE.COM SKY GRADIENT HERO */}
          <section className="relative pt-8 pb-24 px-4 md:px-8 bg-remote-gradient overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
              {/* Top Subtext Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                <span>Startup Buildathon India 2026</span>
                <span className="text-white/40">•</span>
                <span className="text-cyan-200">Powered by Google DeepMind & Cloud</span>
              </div>

              {/* MASSIVE ICONIC SCULPTURAL WORDMARK (LIKE "REMOTE" IN IMAGE 2) */}
              <div className="w-full max-w-5xl my-4 sm:my-8 px-2 select-none pointer-events-none">
                <svg
                  viewBox="0 0 1000 170"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto drop-shadow-sm"
                >
                  {/* Sculptural geometric letters in pale ice-cyan #CCFBF1 */}
                  {/* 'f' */}
                  <path
                    d="M 50 170 L 50 80 Q 50 15 115 15 L 140 15 L 140 55 L 115 55 Q 92 55 92 80 L 92 170 Z M 25 75 L 135 75 L 135 110 L 25 110 Z"
                    fill="#CCFBF1"
                  />
                  {/* 'u' */}
                  <path
                    d="M 165 75 L 205 75 L 205 130 Q 205 170 245 170 Q 285 170 285 130 L 285 75 L 325 75 L 325 135 Q 325 205 245 205 Q 165 205 165 135 Z"
                    fill="#CCFBF1"
                  />
                  {/* 'n' (first) */}
                  <path
                    d="M 355 75 L 395 75 L 395 95 Q 415 75 455 75 Q 515 75 515 130 L 515 170 L 475 170 L 475 130 Q 475 110 445 110 Q 395 110 395 140 L 395 170 L 355 170 Z"
                    fill="#CCFBF1"
                  />
                  {/* 'n' (second) */}
                  <path
                    d="M 545 75 L 585 75 L 585 95 Q 605 75 645 75 Q 705 75 705 130 L 705 170 L 665 170 L 665 130 Q 665 110 635 110 Q 585 110 585 140 L 585 170 L 545 170 Z"
                    fill="#CCFBF1"
                  />
                  {/* 'e' */}
                  <path
                    d="M 795 75 Q 865 75 865 125 L 755 125 Q 755 145 775 155 Q 795 165 835 160 L 845 190 Q 805 200 765 190 Q 725 170 725 125 Q 725 75 795 75 Z M 795 102 Q 765 102 757 115 L 833 115 Q 833 102 795 102 Z"
                    fill="#CCFBF1"
                  />
                  {/* 'l' */}
                  <path
                    d="M 895 20 Q 895 15 915 15 L 945 15 L 945 170 L 895 170 Z"
                    fill="#CCFBF1"
                  />
                </svg>
              </div>

              {/* REMOTE.COM EXACT HEADLINE STYLE */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] max-w-3xl mx-auto mt-2">
                The conversion operating system for modern product teams.
              </h1>

              {/* Subheadline */}
              <p className="mt-5 text-base sm:text-lg text-slate-800 max-w-2xl mx-auto font-medium leading-relaxed">
                One platform for quantitative Cloud SQL telemetry, Gemini 2.5 Vision UI X-Rays, and ready-to-ship React fixes. Built for Startup Buildathon India 2026.
              </p>

              {/* Remote-Style Solid Dual Hero Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setViewMode("workspace")}
                  className="px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-xl transition active:scale-95 flex items-center gap-2"
                >
                  <span>Launch Live Workspace ➔</span>
                </button>

                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="px-7 py-3.5 rounded-xl bg-white/70 hover:bg-white text-slate-950 border-2 border-slate-950 font-bold text-sm shadow-sm transition flex items-center gap-2"
                >
                  <Key className="w-4 h-4 text-slate-700" />
                  <span>Connect Gemini API</span>
                </button>
              </div>

              {/* Integrated Remote-Style Hero URL Audit Bar */}
              <div className="mt-12 w-full max-w-2xl">
                <div className="bg-white p-2.5 rounded-2xl border border-slate-300 shadow-2xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-indigo-600 transition-all">
                  <div className="flex items-center gap-2.5 px-3 w-full flex-1">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={heroUrlInput}
                      onChange={(e) => setHeroUrlInput(e.target.value)}
                      placeholder="Paste your checkout URL (e.g. quickstyle-d2c.in/checkout)"
                      className="bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-none w-full font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={() => handleLaunchHeroDiagnosis("d2c")}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Run AI Diagnosis ➔</span>
                  </button>
                </div>

                {/* 3 Instant Demo Funnel Chips */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="text-[11px] text-slate-700 font-semibold mr-1">Instant Demos:</span>
                  <button
                    onClick={() => {
                      setHeroUrlInput("https://quickstyle-d2c.in/checkout");
                      handleLaunchHeroDiagnosis("d2c");
                    }}
                    className="bg-white/90 hover:bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-slate-800 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>🛍️ QuickStyle D2C</span>
                    <span className="text-rose-600 font-bold font-mono">71.7% Drop</span>
                  </button>

                  <button
                    onClick={() => {
                      setHeroUrlInput("https://finpulse.bank/kyc-agent");
                      handleLaunchHeroDiagnosis("kyc");
                    }}
                    className="bg-white/90 hover:bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-slate-800 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>💳 FinPulse Neo-KYC</span>
                    <span className="text-rose-600 font-bold font-mono">74.8% Drop</span>
                  </button>

                  <button
                    onClick={() => {
                      setHeroUrlInput("https://prepmate.in/iit-jee/paywall");
                      handleLaunchHeroDiagnosis("edtech");
                    }}
                    className="bg-white/90 hover:bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-slate-800 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>🎓 PrepMate EdTech</span>
                    <span className="text-rose-600 font-bold font-mono">96.5% Drop</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* REMOTE-STYLE ELEVATED PRODUCT SHOWCASE CARD */}
          <section className="py-16 px-4 md:px-8 bg-white border-b border-slate-200">
            <div className="max-w-5xl mx-auto">
              <div className="remote-card rounded-3xl p-6 sm:p-8 text-left shadow-xl border-slate-200">
                {/* Showcase Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      Step 4: Checkout & Address Wall
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-mono">QuickStyle D2C Session</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Live Telemetry Correlated
                  </span>
                </div>

                {/* 2-Column Split: Telemetry on Left + Mobile Viewport on Right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Left Column: Drop-Off Telemetry Card */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                          Bottleneck Analysis
                        </span>
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                          -71.7% Drop-off
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mt-2">
                        Checkout & Address Wall
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        5,100 visitors reached checkout, but only 1,443 made it to UPI payment.
                      </p>
                    </div>

                    <div className="my-5 flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-medium text-slate-600">
                        <span>28.3% Completed</span>
                        <span className="text-rose-600 font-bold">3,657 Abandoned</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full w-[28%]" />
                        <div className="bg-rose-500 h-full w-[72%]" />
                      </div>
                    </div>

                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-rose-700 font-bold uppercase tracking-wider">
                          Monthly Revenue Bleed
                        </p>
                        <p className="text-xl font-extrabold text-rose-600">₹68.4 Lakhs / mo</p>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                  </div>

                  {/* Right Column: Clean Mobile Screenshot with Radar Scan */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-3 text-xs">
                      <span className="font-bold text-indigo-600 flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        Gemini 2.5 Vision X-Ray
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">390px Viewport</span>
                    </div>

                    {/* Clean Mobile Frame */}
                    <div className="relative w-full max-w-[240px] aspect-[9/16] bg-white rounded-2xl border-2 border-slate-300 p-2 overflow-hidden shadow-md flex flex-col justify-between">
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent shadow-[0_0_10px_#4f46e5] animate-radar-scan z-20 pointer-events-none" />

                      <div className="flex flex-col gap-1.5 opacity-90 text-[8px]">
                        <div className="h-4 bg-slate-100 rounded flex items-center px-2 text-slate-700 font-bold">
                          QuickStyle Checkout
                        </div>
                        <div className="p-2 bg-slate-50 rounded border border-slate-200 flex flex-col gap-1">
                          <div className="h-2 w-16 bg-slate-300 rounded" />
                          <div className="h-2 w-full bg-slate-200 rounded" />
                          <div className="h-2 w-3/4 bg-slate-200 rounded" />
                        </div>
                        <div className="p-2 bg-slate-50 rounded border border-slate-200 flex flex-col gap-1">
                          <div className="h-2 w-12 bg-slate-300 rounded" />
                          <div className="h-2 w-full bg-slate-200 rounded" />
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-rose-50 border border-rose-300 text-[9px] text-rose-800 font-medium">
                        <div className="flex items-center gap-1 font-bold text-rose-700">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>FLAW #3: BUTTON OCCLUDED</span>
                        </div>
                        <span>UPI CTA pushed 240px below the virtual keyboard fold.</span>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] text-slate-500 font-medium">
                      Nielsen Heuristic #8: Aesthetic & Minimalist Design
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* REMOTE-STYLE MODULAR 4-PILLAR ARCHITECTURE */}
          <section className="py-20 px-4 md:px-8 border-b border-slate-200 bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Autonomous Architecture
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mt-2">
                  Four layers of conversion intelligence
                </h2>
                <p className="mt-4 text-base text-slate-600">
                  Engineered with Google Cloud and DeepMind Gemini 2.5 Flash infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pillar 1 */}
                <div className="remote-card p-8 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                      <Eye className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                      Layer 01 &bull; Qualitative Vision
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">Gemini 2.5 Vision UI X-Ray</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Crawls viewports at 390px, 768px, and 1440px. Inspects visual hierarchy, occluded buttons, contrast failures, and Nielsen Norman UX violations.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Model: gemini-2.5-flash</span>
                    <span className="text-indigo-600 font-bold">Heuristic Engine ➔</span>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="remote-card p-8 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                      <Database className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">
                      Layer 02 &bull; Quantitative SQL
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">Cloud SQL Telemetry Ingestion</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Translates natural language questions into BigQuery SQL, ingesting raw checkout event streams to isolate drop-off inflection points.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Throughput: 100k events/s</span>
                    <span className="text-emerald-600 font-bold">Zero ETL Required ➔</span>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="remote-card p-8 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                      <Flame className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">
                      Layer 03 &bull; Synthesis
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">Heuristic Root-Cause Modeling</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Decomposes friction into mathematical causality pillars: UX friction, surprise delivery fees, and forced account creation barriers.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Causality Weight Distribution</span>
                    <span className="text-amber-600 font-bold">RICE Scoring ➔</span>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="remote-card p-8 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 font-mono">
                      Layer 04 &bull; Autonomous Action
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">Auto-PRD & Production React Code</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Authors an executive engineering PRD and outputs tested React components with micro-animations and accessibility compliance.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Output: TypeScript + Tailwind</span>
                    <span className="text-purple-600 font-bold">1-Click Deploy ➔</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE ROI RECOVERY CALCULATOR (REMOTE.COM STYLE) */}
          <section className="py-20 px-4 md:px-8 border-b border-slate-200 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Interactive Calculator
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mt-2">
                  Calculate your recoverable revenue
                </h2>
                <p className="mt-4 text-base text-slate-600">
                  Model your checkout traffic and drop-off rates to see how much ARR FunnelDoctor AI can recover.
                </p>
              </div>

              {/* Calculator Card */}
              <div className="remote-card p-8 sm:p-10 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Left: Interactive Sliders */}
                  <div className="flex flex-col gap-6">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>Monthly Funnel Visitors</span>
                        <span className="text-indigo-600 font-mono text-sm" suppressHydrationWarning>
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
                        className="w-full accent-indigo-600 bg-slate-200 rounded-lg cursor-pointer h-2"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                        <span>10,000</span>
                        <span>500,000</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>Drop-off Rate at Worst Bottleneck</span>
                        <span className="text-rose-600 font-mono text-sm" suppressHydrationWarning>
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
                        className="w-full accent-rose-600 bg-slate-200 rounded-lg cursor-pointer h-2"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                        <span>20% (Healthy)</span>
                        <span>95% (Catastrophic)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>Average Order Value (AOV)</span>
                        <span className="text-emerald-600 font-mono text-sm" suppressHydrationWarning>
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
                        className="w-full accent-emerald-600 bg-slate-200 rounded-lg cursor-pointer h-2"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                        <span>₹200</span>
                        <span>₹10,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Revenue Summary Box (Remote.com Style High Contrast) */}
                  <div className="bg-slate-900 text-white p-8 rounded-2xl flex flex-col justify-between shadow-xl">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        Monthly Revenue Bleeding
                      </span>
                      <p className="text-3xl sm:text-4xl font-extrabold text-rose-400 mt-2" suppressHydrationWarning>
                        ₹{(calculatedLeaked / 100000).toFixed(1)} Lakhs
                        <span className="text-xs font-normal text-slate-400"> / month</span>
                      </p>
                    </div>

                    <div className="my-6 p-4 rounded-xl bg-slate-800 border border-slate-700">
                      <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider">
                        Recoverable ARR (+22% Lift)
                      </span>
                      <p className="text-2xl sm:text-3xl font-black text-white mt-1" suppressHydrationWarning>
                        +₹{(calculatedRecoverable / 100000).toFixed(1)} Lakhs/mo
                      </p>
                      <p className="text-xs text-slate-400 mt-1" suppressHydrationWarning>
                        (~₹{(calculatedAnnualLift / 10000000).toFixed(2)} Crores Annual Valuation Boost)
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setViewMode("workspace");
                        setActiveTab("prd");
                      }}
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Recover This Revenue Now ➔</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* REMOTE.COM STYLE TRANSPARENT PRICING */}
          <section className="py-20 px-4 md:px-8 border-b border-slate-200 bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Transparent Pricing
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mt-2">
                  Built to pay for itself on day 1
                </h2>
                <p className="mt-4 text-base text-slate-600">
                  Simple, transparent tiers designed for startups and high-growth brands.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Starter */}
                <div className="remote-card p-8 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Developer OSS</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">Free</span>
                      <span className="text-xs text-slate-500">/ forever</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Local CLI & CSV heuristic auditor for open-source builders.
                    </p>

                    <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>CLI & CSV Funnel Parser</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Nielsen Heuristic Diagnostics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Markdown PRD Generation</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setViewMode("workspace")}
                    className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
                  >
                    Launch Open Source
                  </button>
                </div>

                {/* Pro Tier (Highlighted) */}
                <div className="remote-card p-8 rounded-2xl border-2 border-indigo-600 flex flex-col justify-between shadow-xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most Popular &bull; Buildathon Special
                  </div>

                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Startup Pro</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">₹7,999</span>
                      <span className="text-xs text-slate-500">/ month</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Full Multimodal Vision X-Ray, SQL Telemetry & React Code Generator.
                    </p>

                    <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Unlimited Gemini 2.5 Vision Audits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>BigQuery Natural-Language SQL Lab</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Production React UI Component Diff</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Autonomous AI PM Voice Agent</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleLaunchHeroDiagnosis("d2c")}
                    className="mt-8 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Start 14-Day Free Trial
                  </button>
                </div>

                {/* Enterprise */}
                <div className="remote-card p-8 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enterprise Scale</span>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">₹39,999</span>
                      <span className="text-xs text-slate-500">/ month</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Real-time telemetry pipelines and automated PR deployment to GitHub.
                    </p>

                    <ul className="mt-6 flex flex-col gap-3 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Automated GitHub PR Pull Requests</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Weekly Slack Root-Cause Alerts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Dedicated Cloud SQL / BigQuery Pipelines</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setViewMode("workspace")}
                    className="mt-8 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
                  >
                    Contact Enterprise
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-slate-200 px-6 py-12 text-center text-xs text-slate-500 bg-white">
            <p className="font-medium">
              FunnelDoctor AI &copy; 2026 &bull; Built for Startup Buildathon India 2026 &bull; Powered by Google DeepMind & Google Cloud
            </p>
            <p className="mt-2 text-[11px] text-slate-400 font-mono">
              The autonomous multimodal conversion intelligence platform for modern product teams.
            </p>
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE B: THE INTERACTIVE 5-TAB APP COMMAND CENTER WORKSPACE          */}
      {/* ========================================================================= */}
      {viewMode === "workspace" && (
        <div className="flex-1 flex flex-col md:flex-row relative z-10 bg-[#F8FAFC]">
          {/* LEFT SIDEBAR (Remote.com Style Light Workspace Nav) */}
          <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 shadow-sm">
            <div className="flex flex-col gap-6">
              {/* Dataset Switcher */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
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
                        className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-200 text-indigo-950 font-bold shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <div className="truncate">
                          <p className="text-xs truncate">{d.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{d.companyCategory}</p>
                        </div>
                        <span className="text-[10px] font-mono text-rose-600 font-bold shrink-0">
                          -{d.bleedingDropRate}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5 Navigation Tabs */}
              <nav className="flex flex-col gap-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                    activeTab === "telemetry"
                      ? "bg-indigo-600 text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>1. Funnel Telemetry</span>
                </button>

                <button
                  onClick={() => setActiveTab("vision")}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                    activeTab === "vision"
                      ? "bg-indigo-600 text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>2. Gemini Vision X-Ray</span>
                </button>

                <button
                  onClick={() => setActiveTab("rca")}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                    activeTab === "rca"
                      ? "bg-indigo-600 text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>3. Root-Cause & SQL Lab</span>
                </button>

                <button
                  onClick={() => setActiveTab("prd")}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                    activeTab === "prd"
                      ? "bg-indigo-600 text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FileCode2 className="w-4 h-4" />
                  <span>4. Auto-PRD & UI Fix</span>
                </button>

                <button
                  onClick={() => setActiveTab("pm")}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                    activeTab === "pm"
                      ? "bg-indigo-600 text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>5. Live AI PM War Room</span>
                </button>
              </nav>

              {/* Quick Metrics Summary */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Overall Conv:</span>
                  <span className="text-emerald-600 font-bold">{dataset.overallConversion}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Leaked ARR:</span>
                  <span className="text-rose-600 font-bold">{dataset.monthlyLeakedRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recoverable:</span>
                  <span className="text-indigo-600 font-bold">{dataset.recoverableRevenue}</span>
                </div>
              </div>
            </div>

            {/* Bottom 60s Pitch Script Launcher */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowPitchModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>60-Sec Pitch Script</span>
              </button>
            </div>
          </aside>

          {/* MAIN WORKSPACE CONTENT PANE */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
            {/* Top Bar of Workspace */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {dataset.companyCategory} &bull; Funnel Audit
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Telemetry Ingested
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">{dataset.name}</h2>
                <p className="text-xs text-slate-600">{dataset.tagline}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(dataset.prdMarkdown, "Engineering PRD")}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy PRD</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("prd");
                    showToast("Switched to Auto-PRD & Code Studio");
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
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
                  <div className="remote-card p-5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Initial Visitors</span>
                    <p className="text-2xl font-extrabold text-slate-900 mt-2" suppressHydrationWarning>
                      {formatNumber(dataset.monthlyVisitors)}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1">Ingested via BigQuery</span>
                  </div>

                  <div className="remote-card p-5 rounded-2xl border-rose-200 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Bleeding Bottleneck</span>
                    <p className="text-2xl font-extrabold text-rose-600 mt-2">
                      -{dataset.bleedingDropRate}% Drop
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 truncate">{dataset.bleedingStepName}</span>
                  </div>

                  <div className="remote-card p-5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Monthly Revenue Leaked</span>
                    <p className="text-2xl font-extrabold text-amber-600 mt-2">
                      {dataset.monthlyLeakedRevenue}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1">AOV: ₹{formatNumber(dataset.aov)}</span>
                  </div>

                  <div className="remote-card p-5 rounded-2xl border-emerald-200 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Recoverable Lift (+22%)</span>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-2">
                      {dataset.recoverableRevenue}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1">With 1-Tap Component Fix</span>
                  </div>
                </div>

                {/* Funnel Waterfall Stages */}
                <div className="remote-card p-6 sm:p-8 rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">Stage-by-Stage Funnel Telemetry</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Click any stage to view vision correlation.</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">N=6 Sequential Steps</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {dataset.steps.map((st, idx) => {
                      const pctOfInitial = Math.round((st.visitors / dataset.monthlyVisitors) * 100);
                      return (
                        <div
                          key={st.id}
                          className={`p-4 rounded-2xl border transition ${
                            st.isBleedingBottleneck
                              ? "bg-rose-50/60 border-rose-300 shadow-sm"
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}.</span>
                              <span className="text-sm font-bold text-slate-900">{st.name}</span>
                              {st.isBleedingBottleneck && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold">
                                  🚨 CRITICAL LEAK POINT
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 font-mono text-xs">
                              <span className="text-slate-700 font-semibold" suppressHydrationWarning>
                                {formatNumber(st.visitors)} sessions
                              </span>
                              <span className="text-slate-400">({pctOfInitial}%)</span>
                              {st.dropoffRate > 0 && (
                                <span className="text-rose-600 font-bold">
                                  -{(st.dropoffRate * 100).toFixed(1)}% drop
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                            <div
                              className={`h-full transition-all duration-500 ${
                                st.isBleedingBottleneck ? "bg-rose-500" : "bg-indigo-600"
                              }`}
                              style={{ width: `${pctOfInitial}%` }}
                            />
                          </div>

                          {st.isBleedingBottleneck && (
                            <div className="mt-3 flex items-center justify-between text-xs text-rose-800 pt-2 border-t border-rose-200">
                              <span suppressHydrationWarning>
                                ⚠️ <strong>{formatNumber(st.dropoffCount)} shoppers</strong> dropped at this exact step.
                              </span>
                              <button
                                onClick={() => setActiveTab("vision")}
                                className="underline font-bold text-rose-700 hover:text-rose-900"
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

                {/* Retention Heatmap */}
                <div className="remote-card p-6 sm:p-8 rounded-3xl">
                  <h3 className="font-extrabold text-base text-slate-900 mb-1">Weekly Cohort Retention Matrix</h3>
                  <p className="text-xs text-slate-500 mb-6">Tracking repeat checkout activity post-drop-off intervention.</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px] uppercase">
                          <th className="pb-3">Cohort</th>
                          <th className="pb-3 text-center">Week 0</th>
                          <th className="pb-3 text-center">Week 1</th>
                          <th className="pb-3 text-center">Week 2</th>
                          <th className="pb-3 text-center">Week 3</th>
                          <th className="pb-3 text-center">Week 4</th>
                          <th className="pb-3 text-center">Week 5</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dataset.retentionMatrix.map((r, i) => (
                          <tr key={i} className="font-mono">
                            <td className="py-2.5 text-slate-700 font-bold">{r.cohort}</td>
                            <td className="text-center py-2.5 bg-indigo-50 text-indigo-700 font-semibold">{r.w0}%</td>
                            <td className="text-center py-2.5 bg-indigo-50/80 text-indigo-700 font-semibold">{r.w1}%</td>
                            <td className="text-center py-2.5 bg-indigo-50/60 text-indigo-600">{r.w2}%</td>
                            <td className="text-center py-2.5 bg-indigo-50/40 text-slate-600">{r.w3}%</td>
                            <td className="text-center py-2.5 text-slate-500">{r.w4}%</td>
                            <td className="text-center py-2.5 text-slate-400">{r.w5}%</td>
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
                {/* Left Side: Mobile Device Mockup */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="remote-card p-6 rounded-3xl w-full flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-4 text-xs">
                      <span className="font-bold text-indigo-600 flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        Viewport: 390px Mobile Viewport
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Gemini Vision 2.5</span>
                    </div>

                    {/* Smartphone Mockup */}
                    <div className="relative w-[280px] sm:w-[320px] aspect-[9/18] bg-slate-900 rounded-[44px] border-4 border-slate-700 shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-full z-30" />
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_#6366f1] animate-radar-scan z-20 pointer-events-none" />

                      <div className="relative w-full h-full bg-white rounded-[34px] p-4 pt-10 flex flex-col justify-between text-[10px] overflow-hidden">
                        <div className="flex flex-col gap-2">
                          <div className="h-5 bg-slate-100 rounded-lg flex items-center px-2 text-slate-800 font-bold">
                            {dataset.name}
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
                            <div className="h-2.5 w-20 bg-slate-300 rounded" />
                            <div className="h-2 w-full bg-slate-200 rounded" />
                            <div className="h-2 w-4/5 bg-slate-200 rounded" />
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
                            <div className="h-2.5 w-16 bg-slate-300 rounded" />
                            <div className="h-2 w-full bg-slate-200 rounded" />
                          </div>
                        </div>

                        {/* Interactive Pins */}
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
                                <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-600 text-white font-black text-[11px] items-center justify-center shadow-md border-2 border-white">
                                  {pin.id}
                                </span>
                              </span>
                            </button>
                          );
                        })}

                        <div className="w-24 h-1 bg-slate-300 rounded-full mx-auto" />
                      </div>
                    </div>

                    {/* Screenshot Upload Dropzone */}
                    <div className="mt-4 w-full">
                      <label className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-indigo-600 text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50">
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

                {/* Right Side: Hotspot Diagnostic Inspector */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {/* Pin Selection Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {dataset.hotspots.map((pin) => (
                      <button
                        key={pin.id}
                        onClick={() => setSelectedPinId(pin.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                          selectedPinId === pin.id
                            ? "bg-rose-600 text-white shadow-md"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>Flaw #{pin.id}</span>
                        <span className="text-[10px] opacity-80">{pin.severity}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Pin Inspector Card */}
                  {(() => {
                    const pin = dataset.hotspots.find((p) => p.id === selectedPinId) || dataset.hotspots[0];
                    return (
                      <div className="remote-card p-6 sm:p-8 rounded-3xl flex flex-col gap-6">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                              Identified Bottleneck Flaw #{pin.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              {pin.severity} SEVERITY
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mt-1">{pin.title}</h3>
                        </div>

                        {/* Nielsen Heuristic */}
                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                          <span className="text-[10px] uppercase font-bold text-indigo-700">
                            Heuristic Violated:
                          </span>
                          <p className="text-xs font-bold text-indigo-950 mt-0.5">
                            {pin.heuristicViolated}
                          </p>
                        </div>

                        {/* Gemini Observation */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-indigo-600" />
                            Gemini 2.5 Vision Finding:
                          </span>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                            {pin.geminiVisionFinding}
                          </p>
                        </div>

                        {/* Telemetry Correlation */}
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-emerald-600" />
                            Correlated SQL Telemetry:
                          </span>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                            {pin.telemetryEvidence}
                          </p>
                        </div>

                        {/* Prescribed Fix */}
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                          <span className="text-[10px] uppercase font-bold text-emerald-800">
                            Prescribed Engineering Fix:
                          </span>
                          <p className="text-xs font-bold text-emerald-950 mt-0.5">
                            {pin.prescribedFix}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setActiveTab("prd");
                            showToast("Navigated to Auto-PRD & Code Studio");
                          }}
                          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
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
                <div className="remote-card p-6 sm:p-8 rounded-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">Natural Language SQL Telemetry Studio</h3>
                      <p className="text-xs text-slate-500">Ask any question about drop-off causality. Powered by BigQuery.</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      ⚡ BigQuery Connected
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.sqlPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSqlPresetIdx(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          selectedSqlPresetIdx === idx
                            ? "bg-indigo-600 text-white font-bold"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {preset.prompt}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const preset = dataset.sqlPresets[selectedSqlPresetIdx] || dataset.sqlPresets[0];
                    return (
                      <div className="flex flex-col gap-4">
                        <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs overflow-x-auto text-indigo-300 shadow-md">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                            <span>BigQuery Engine &bull; Standard SQL 2.0</span>
                            <button
                              onClick={() => copyToClipboard(preset.sql, "SQL Query")}
                              className="hover:text-white flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy SQL</span>
                            </button>
                          </div>
                          <pre className="text-slate-200 leading-relaxed whitespace-pre-wrap">{preset.sql}</pre>
                        </div>

                        {/* Result Table */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-3">
                            Query Result Set (3 Rows Returned &bull; Latency: 182ms)
                          </span>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                                  {Object.keys(preset.resultRows[0]).map((k) => (
                                    <th key={k} className="pb-2">{k}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {preset.resultRows.map((row, i) => (
                                  <tr key={i} className="font-mono text-slate-800">
                                    {Object.values(row).map((val, vi) => (
                                      <td key={vi} className="py-2">{val}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Gemini Takeaway */}
                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-950">Gemini Multimodal Takeaway: </strong>
                            <span>{preset.geminiTakeaway}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Weighted RCA */}
                <div className="remote-card p-6 sm:p-8 rounded-3xl">
                  <h3 className="font-extrabold text-base text-slate-900 mb-1">Root-Cause Weight Distribution</h3>
                  <p className="text-xs text-slate-500 mb-6">Quantitative correlation of friction contributors.</p>

                  <div className="flex flex-col gap-4">
                    {dataset.weightedRca.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-900">{item.pillar}</span>
                          <span className="font-mono text-slate-600 font-bold">{item.weight}% weight</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.weight}%` }} />
                        </div>
                        <p className="text-[11px] text-slate-500">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 4: AUTO-PRD & UI FIX STUDIO                                   */}
            {/* ================================================================= */}
            {activeTab === "prd" && (
              <div className="flex flex-col gap-8">
                {/* Markdown PRD */}
                <div className="remote-card p-6 sm:p-8 rounded-3xl">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-extrabold text-base text-slate-900">Autonomous Engineering PRD</h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(dataset.prdMarkdown, "Engineering PRD")}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full PRD</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {dataset.prdMarkdown}
                  </div>
                </div>

                {/* Interactive Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Broken */}
                  <div className="remote-card p-6 rounded-2xl border-rose-200 bg-rose-50/30">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      {dataset.brokenUiWireframeTitle}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1 mb-4">Current Pain Points</h4>

                    <div className="flex flex-col gap-2.5 text-xs text-slate-700">
                      {dataset.brokenUiItems.map((item, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Redesigned */}
                  <div className="remote-card p-6 rounded-2xl border-indigo-200 bg-indigo-50/30">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      {dataset.redesignedUiTitle}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1 mb-4">Production Interventions</h4>

                    <div className="flex flex-col gap-2.5 text-xs text-slate-800">
                      {dataset.redesignedUiFeatures.map((feat, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-indigo-200 text-indigo-900 font-semibold shadow-sm">
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Production React Code Diff */}
                <div className="remote-card p-6 sm:p-8 rounded-3xl">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-xs text-indigo-600">
                      <Code2 className="w-4 h-4" />
                      <span>Ready-to-Ship React Component (TypeScript + Tailwind)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(dataset.codeDiff, "React Component Code")}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 fill-current" />
                      <span>Copy Component Code</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed shadow-md">
                    <pre className="text-slate-200 whitespace-pre-wrap">{dataset.codeDiff}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 5: LIVE AI PM WAR ROOM                                        */}
            {/* ================================================================= */}
            {activeTab === "pm" && (
              <div className="remote-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between min-h-[550px]">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">Autonomous AI Principal PM</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Trained on 1,400+ D2C, Fintech & EdTech Funnels
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-end gap-1 h-6">
                        <span className="w-1 bg-indigo-600 rounded-full animate-wave-1" />
                        <span className="w-1 bg-purple-600 rounded-full animate-wave-2" />
                        <span className="w-1 bg-emerald-500 rounded-full animate-wave-3" />
                        <span className="w-1 bg-indigo-500 rounded-full animate-wave-4" />
                        <span className="w-1 bg-violet-500 rounded-full animate-wave-5" />
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
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                            : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                        }`}
                        title={isSpeakingAudio ? "Mute Speech" : "Listen to Audio Briefing"}
                      >
                        {isSpeakingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages */}
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
                              ? "bg-indigo-600 text-white font-medium shadow-sm"
                              : "bg-slate-50 border border-slate-200 text-slate-800"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 font-mono">{msg.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prompt Suggestions */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => handleSendVoiceQuery("Give me an executive summary of this funnel")}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-medium"
                  >
                    💬 Executive Summary
                  </button>
                  <button
                    onClick={() => handleSendVoiceQuery("What should our engineers deploy first?")}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-medium"
                  >
                    🚀 Top Engineering Priority
                  </button>
                  <button
                    onClick={() => handleSendVoiceQuery("How does this compare to industry benchmarks?")}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-medium"
                  >
                    📊 Benchmark Comparison
                  </button>
                </div>

                {/* Input Bar */}
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2">
                  <button
                    onClick={handleToggleVoiceRecording}
                    className={`p-2.5 rounded-xl border transition shrink-0 ${
                      isListeningVoice
                        ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
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
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />

                  <button
                    onClick={() => handleSendVoiceQuery(chatInput)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition shrink-0 shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl flex flex-col items-center text-center border border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Synthesizing Multimodal RCA</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6 font-mono">{heroUrlInput}</p>

            <div className="w-full flex flex-col gap-2.5 text-xs text-left">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  auditProgressStep >= 1
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span>1. Crawling Responsive UI Viewport (390px)...</span>
                {auditProgressStep >= 1 && <Check className="w-4 h-4 text-emerald-600" />}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  auditProgressStep >= 2
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span>2. Querying Event Funnel Telemetry on Cloud SQL...</span>
                {auditProgressStep >= 2 && <Check className="w-4 h-4 text-emerald-600" />}
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  auditProgressStep >= 3
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span>3. Running Gemini Vision UX Heuristic Audit...</span>
                {auditProgressStep >= 3 && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 60-SEC JUDGE PITCH GUIDE MODAL                                            */}
      {/* ========================================================================= */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl flex flex-col gap-4 relative border border-slate-200">
            <button
              onClick={() => setShowPitchModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-slate-900">60-Second Buildathon Pitch Script</h3>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed overflow-y-auto max-h-[360px] whitespace-pre-wrap">
{`"Good morning judges! Every startup founder and D2C brand watches users drop off in checkout—losing crores of rupees every month.

Traditional analytics like Mixpanel or GA4 only tell you WHERE people left. They never tell you WHY.

Meet FunnelDoctor AI. We combine Quantitative Funnel Telemetry with Qualitative Gemini Multimodal Vision.

Our agent crawls the URL, takes responsive screenshots, and correlates the exact 71% drop-off with visual UX flaws—like this forced login modal and below-the-fold UPI button.

Then, in under 60 seconds, it writes a complete engineering PRD and hands your developers the ready-to-ship React code fix.

This isn't another analytics dashboard—it's an autonomous AI Product Manager that turns leaked revenue into cash flow. Thank you!"`}
            </div>

            <button
              onClick={() => setShowPitchModal(false)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl flex flex-col gap-4 relative border border-slate-200">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-base text-slate-900">Google Gemini 2.5 API Setup</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Connect your Google AI Studio API key to enable live multimodal vision parsing and real-time generative reasoning.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Google AI Studio Key:
              </label>
              <input
                type="password"
                value={tempApiKeyInput}
                onChange={(e) => setTempApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
              />
              <span className="text-[10px] text-slate-400">
                Stored in browser <code className="bg-slate-100 px-1 rounded">localStorage</code>.
              </span>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-[11px] text-indigo-800">
              💡 <strong>Demo Fallback Notice:</strong> If left empty, FunnelDoctor AI operates in deterministic simulation mode so stage demos never fail!
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleSaveApiKey}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
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
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold"
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
