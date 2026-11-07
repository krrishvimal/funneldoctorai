"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ScanEye,
  Code2,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Mic,
  Volume2,
  Upload,
  Copy,
  Check,
  Layers,
  Play,
  Sparkles,
  Activity,
  Sliders,
  Terminal,
  ChevronRight,
  Globe,
  Zap,
  X,
} from "lucide-react";

// 1. ULTRA-SMOOTH BEZIER ARCHITECTURAL TOPOGRAPHIC MESH (NO JAGGED CORNERS)
function SwissTopographicMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    let t = 0;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      const waveCount = 6;
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(15, 23, 42, ${0.05 + i * 0.02})`;

        const baseHeight = canvas.height * 0.32 + i * 34;
        const freq = 0.0018 + i * 0.0002;
        const amp = 24 + i * 10;

        // 2px high-resolution sampling for silky-smooth organic sine waves
        for (let x = 0; x <= canvas.width; x += 2) {
          const dx = x - mouse.x;
          const dist = Math.sqrt(dx * dx);
          // Smooth Gaussian bell-curve mouse displacement (no sharp triangle peak)
          const mouseInfluence = Math.exp(-(dist * dist) / 45000) * 28;

          const y =
            baseHeight +
            Math.sin(x * freq + t + i * 0.5) * amp +
            Math.cos(x * 0.0011 - t * 0.6) * 12 -
            mouseInfluence;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

// 2. TACTILE PRECISION-ENGINEERED DIAGNOSTIC WORKBENCH
function TactileDiagnosticWorkbench({
  activeStep,
  setActiveStep,
}: {
  activeStep: number;
  setActiveStep: (step: number) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(`// Synthesized 1-Tap UPI Express component`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="workbench" className="py-12 mb-6">
      {/* 1. SECTION HEADER (Precision Typography) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-300 pb-6 mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            02 // INTERACTIVE DIAGNOSTIC WORKBENCH
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            How FunnelDoctor isolates and repairs friction
          </h2>
        </div>

        {/* Tactile Segmented Step Controller */}
        <div className="inline-flex bg-neutral-200/70 p-1 border border-neutral-300 rounded-lg font-mono text-xs shadow-inner">
          {[
            { id: 1, label: "01. Spatial Vision", icon: ScanEye },
            { id: 2, label: "02. BigQuery SQL", icon: Terminal },
            { id: 3, label: "03. Synthesized Code", icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStep(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all cursor-pointer ${
                  activeStep === tab.id
                    ? "bg-white text-black font-semibold shadow-sm border border-neutral-200/80"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN TACTILE WORKBENCH (Realistic Layout & True Dimensions) */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Analytical Context & Root-Cause Evidence */}
        <div className="lg:col-span-5 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-neutral-200 flex flex-col justify-between bg-[#FAFAFA]/50">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-neutral-200 rounded-md font-mono text-[11px] text-neutral-600 mb-6 shadow-2xs">
              <span className="text-neutral-400">ANALYSIS ENGINE:</span>
              <strong className="text-neutral-900">
                {activeStep === 1 && "GEMINI 2.5 SPATIAL SCANNER"}
                {activeStep === 2 && "GOOGLE AGENT BIGQUERY RUNNER"}
                {activeStep === 3 && "GEMINI CODE SYNTHESIS ENGINE"}
              </strong>
            </div>

            {activeStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  Visual Occlusion & Hidden Cost Shock
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  Gemini Vision scans mobile checkout viewports, identifying interactive hurdles that analytics graphs
                  miss. The AI pinned a blocking email login modal, followed by a ₹149 delivery fee revealed only at
                  the final step.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 bg-white border border-neutral-200 rounded-lg shadow-2xs">
                    <div className="flex justify-between font-mono text-xs mb-1">
                      <span className="font-semibold text-rose-600">[Pin #01] Forced Email OTP</span>
                      <span className="font-bold">41.2% Drop</span>
                    </div>
                    <p className="text-xs text-neutral-500 font-normal">
                      Users abandon within 6 seconds of modal display.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-neutral-200 rounded-lg shadow-2xs">
                    <div className="flex justify-between font-mono text-xs mb-1">
                      <span className="font-semibold text-rose-600">[Pin #02] Surprise ₹149 Surcharge</span>
                      <span className="font-bold">31.4% Rage Clicks</span>
                    </div>
                    <p className="text-xs text-neutral-500 font-normal">
                      Fee revealed only after user finishes address entry.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  SQL Telemetry Correlates Latency & Drops
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  Google Agent Skills autonomously composes and executes BigQuery queries against checkout event logs to
                  isolate why conversion plummeted on specific device architectures.
                </p>

                <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-2xs space-y-2 font-mono text-xs">
                  <div className="text-neutral-400 text-[10px] uppercase tracking-wider">Telemetry Takeaway</div>
                  <div className="text-neutral-900 font-semibold leading-relaxed">
                    Android WebView accounts for 78.4% of checkout abandonment due to a 4.2s P95 latency bottleneck
                    during UPI app invocation.
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  Auto-PRD & Production React Fix
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  FunnelDoctor generates the full technical specification, complete with user stories, acceptance
                  criteria, and a copyable React component featuring a sticky, 1-Tap Guest UPI drawer.
                </p>

                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2">
                  <div className="flex justify-between font-mono text-xs text-emerald-800">
                    <span className="font-semibold">PROJECTED REVENUE IMPACT</span>
                    <strong className="font-bold">+38% CR LIFT</strong>
                  </div>
                  <div className="text-xs text-emerald-900 leading-relaxed">
                    Estimated monthly recovery: <strong>+₹73.0 Lakhs</strong> across 25,000 monthly checkout
                    initiations.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>STEP {activeStep} OF 3</span>
            <button
              onClick={() => setActiveStep(activeStep < 3 ? activeStep + 1 : 1)}
              className="flex items-center gap-1.5 text-neutral-900 font-semibold hover:underline cursor-pointer"
            >
              {activeStep < 3 ? "Next Phase" : "Restart Overview"} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Realistic Device & Code Surface */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex items-center justify-center bg-neutral-100/60">
          {/* STEP 1: REALISTIC MOBILE CHECKOUT VIEWPORT */}
          {activeStep === 1 && (
            <div className="w-full max-w-[340px] bg-white rounded-3xl border border-neutral-300 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] p-4 relative">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-neutral-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-8 h-1 bg-neutral-300 rounded-full" />
              </div>

              {/* Status Header */}
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 border-b border-neutral-100 pb-2 mb-4">
                <span>9:41 AM</span>
                <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  ● 2 FAULTS PINNED
                </span>
              </div>

              {/* Simulated UI Screen */}
              <div className="space-y-3">
                {/* Fault 1: Forced Modal */}
                <div className="p-3.5 bg-rose-50/60 border border-rose-300 rounded-xl relative shadow-2xs">
                  <div className="flex justify-between items-center font-mono text-[10px] text-rose-700 font-bold mb-1">
                    <span>FORCED ACCOUNT LOGIN</span>
                    <span className="bg-rose-600 text-white px-1.5 rounded-full">#01</span>
                  </div>
                  <p className="text-xs text-neutral-800 font-medium">Please enter OTP to continue checkout</p>
                  <div className="flex gap-1.5 mt-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="w-7 h-8 bg-white border border-neutral-300 rounded flex items-center justify-center text-xs font-mono"
                      >
                        {n === 1 ? "4" : ""}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutral Form Input */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Delivery Address</span>
                  <div className="text-xs text-neutral-800 font-medium">Flat 402, Green Glen Layout, BLR</div>
                </div>

                {/* Fault 2: Surprise Fee */}
                <div className="p-3.5 bg-rose-50/60 border border-rose-300 rounded-xl shadow-2xs">
                  <div className="flex justify-between items-center font-mono text-[10px] text-rose-700 font-bold mb-1">
                    <span>LATE SURCHARGE REVEAL</span>
                    <span className="bg-rose-600 text-white px-1.5 rounded-full">#02</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-800">
                    <span>Standard Shipping</span>
                    <strong className="text-rose-600">+₹149.00</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: REALISTIC BIGQUERY TELEMETRY TERMINAL */}
          {activeStep === 2 && (
            <div className="w-full max-w-lg bg-[#0F172A] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden font-mono text-xs">
              {/* Terminal Window Header */}
              <div className="bg-[#1E293B] px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] text-slate-400">bigquery-agent // step4_latency.sql</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  200 OK
                </span>
              </div>

              {/* SQL Syntax */}
              <div className="p-4 text-slate-300 space-y-1 leading-relaxed text-[11px] border-b border-slate-800">
                <div>
                  <span className="text-indigo-400 font-bold">SELECT</span> device_os, app_version,
                </div>
                <div className="pl-4">
                  <span className="text-emerald-400">ROUND</span>(
                  <span className="text-emerald-400">AVG</span>(upi_latency_ms), 0){" "}
                  <span className="text-indigo-400 font-bold">AS</span> p95_latency,
                </div>
                <div className="pl-4">
                  <span className="text-emerald-400">ROUND</span>(
                  <span className="text-emerald-400">SUM</span>(dropped)*100.0/
                  <span className="text-emerald-400">COUNT</span>(*), 1){" "}
                  <span className="text-indigo-400 font-bold">AS</span> churn_pct
                </div>
                <div>
                  <span className="text-indigo-400 font-bold">FROM</span> `prod.telemetry_checkout_v4`
                </div>
                <div>
                  <span className="text-indigo-400 font-bold">GROUP BY</span> 1, 2{" "}
                  <span className="text-indigo-400 font-bold">ORDER BY</span> churn_pct{" "}
                  <span className="text-indigo-400 font-bold">DESC</span>;
                </div>
              </div>

              {/* Realistic Telemetry Output Table */}
              <div className="p-4 bg-slate-900/90">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">
                  Query Results (3 rows returned in 120ms)
                </div>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800 pb-1">
                      <th>DEVICE OS</th>
                      <th>P95 LATENCY</th>
                      <th className="text-right">CHURN RATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr className="text-rose-400 font-semibold">
                      <td className="py-1.5">Android WebView (v4.2)</td>
                      <td className="py-1.5">4,280 ms</td>
                      <td className="py-1.5 text-right">78.4%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5">iOS Safari (v17.2)</td>
                      <td className="py-1.5">610 ms</td>
                      <td className="py-1.5 text-right">54.1%</td>
                    </tr>
                    <tr>
                      <td className="py-1.5">Desktop Chrome</td>
                      <td className="py-1.5">420 ms</td>
                      <td className="py-1.5 text-right">48.2%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 3: REALISTIC PRODUCTION COMPONENT & CODE */}
          {activeStep === 3 && (
            <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-300 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-sm text-neutral-900">Synthesized 1-Tap UPI Express</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200 rounded">
                  +38% CR
                </span>
              </div>

              {/* Free Delivery Banner Component */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs font-mono text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero hidden fees: Free Express Delivery applied automatically.</span>
              </div>

              {/* Instant 1-Tap UPI Button */}
              <button className="w-full py-3.5 bg-black text-white font-mono text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                <span>Pay ₹1,850 via Instant UPI</span>
                <span className="text-neutral-400">[GPay / PhonePe]</span>
              </button>

              <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-xs font-mono text-neutral-500">
                <span>FILE: ExpressUpi.tsx</span>
                <button
                  onClick={handleCopy}
                  className="text-neutral-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied Code" : "Copy Component"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// 3. THREE REALISTIC STARTUP DATASETS
type PresetKey = "d2c" | "fintech" | "edtech";

interface RcaWeight {
  label: string;
  pct: number;
  color: string;
}

interface FunnelStep {
  step: string;
  users: string;
  pct: number;
  fixedPct?: number;
  drop?: string;
  status: "normal" | "critical" | "healthy";
}

interface PinItem {
  id: string;
  title: string;
  desc: string;
  metric: string;
  wireLabel: string;
}

interface SqlRow {
  os: string;
  sessions: string;
  latency: string;
  churn: string;
}

interface Dataset {
  id: PresetKey;
  label: string;
  url: string;
  visitors: number;
  dropoff: number;
  aov: number;
  lift: string;
  rcaWeights: RcaWeight[];
  steps: FunnelStep[];
  pins: PinItem[];
  sql: string;
  sqlResults: SqlRow[];
  voiceSummary: string;
}

const PRESET_DATASETS: Record<PresetKey, Dataset> = {
  d2c: {
    id: "d2c",
    label: "D2C Checkout [-71.7%]",
    url: "https://quickstyle-d2c.in/checkout/step-4",
    visitors: 25000,
    dropoff: 71.7,
    aov: 1850,
    lift: "+38% CR LIFT",
    rcaWeights: [
      { label: "UI/UX & Forced OTP Wall", pct: 46, color: "bg-rose-600" },
      { label: "Hidden ₹149 Fee Shock", pct: 31, color: "bg-neutral-800" },
      { label: "Android WebView UPI Latency", pct: 18, color: "bg-neutral-500" },
      { label: "Channel Intent Mismatch", pct: 5, color: "bg-neutral-300" },
    ],
    steps: [
      { step: "01. Product Viewed", users: "1,00,000", pct: 100, status: "normal" },
      { step: "02. Added to Bag", users: "38,400", pct: 38.4, status: "normal" },
      { step: "03. Checkout Initiated", users: "25,000", pct: 65.1, status: "normal" },
      { step: "04. Address & Payment", users: "7,075", pct: 28.3, fixedPct: 48.6, drop: "-71.7% CHURN", status: "critical" },
      { step: "05. Order Confirmed", users: "6,580", pct: 93.0, status: "healthy" },
    ],
    pins: [
      { id: "01", title: "Forced Account OTP Modal", desc: "Blocks guest checkout; 41% exit within 6s of modal trigger.", metric: "41.2% Exit", wireLabel: "[Modal] Forced Email OTP" },
      { id: "02", title: "Late ₹149 Fee Reveal", desc: "Delivery + convenience surcharge hidden until final step.", metric: "31.4% Rage Click", wireLabel: "+₹149 Hidden Fee Surge" },
      { id: "03", title: "UPI CTA Below Fold", desc: 'Primary GPay/PhonePe button pushed below 6.1" Android viewport.', metric: "64% Unseen", wireLabel: 'Pay via UPI [Below 6.1" Fold]' },
    ],
    sql: `SELECT device_os, app_version,
  COUNT(DISTINCT session_id) AS sessions,
  ROUND(AVG(upi_intent_latency_ms), 0) AS p95_ms,
  ROUND(SUM(dropped_step_4)*100.0/COUNT(*), 1) AS churn_pct
FROM \`telemetry.checkout_funnel_v4\`
WHERE step_index = 4
GROUP BY 1, 2 ORDER BY churn_pct DESC;`,
    sqlResults: [
      { os: "Android WebView (v4.2)", sessions: "16,400", latency: "4,280 ms", churn: "78.4%" },
      { os: "iOS Mobile Safari", sessions: "5,800", latency: "610 ms", churn: "54.1%" },
      { os: "Desktop Chrome", sessions: "2,800", latency: "420 ms", churn: "48.2%" },
    ],
    voiceSummary: "Diagnostic complete for QuickStyle D2C. Step 4 is leaking 331.6 Lakhs per month. 78.4 percent of drops occur on Android WebView due to a forced email login modal combined with a 4.2 second UPI intent latency spike. Deploying our synthesized 1-Tap Guest UPI Express component recovers 73 Lakhs per month.",
  },
  fintech: {
    id: "fintech",
    label: "Fintech KYC [-74.8%]",
    url: "https://finpulse-neo.in/onboarding/video-kyc",
    visitors: 18000,
    dropoff: 74.8,
    aov: 3200,
    lift: "+44% KYC COMPLETION",
    rcaWeights: [
      { label: "Zero-Context Camera Prompt", pct: 44, color: "bg-rose-600" },
      { label: "Live Agent Queue Wait (>4m)", pct: 34, color: "bg-neutral-800" },
      { label: "PAN Glare Error 402 Blob", pct: 16, color: "bg-neutral-500" },
      { label: "Low Network Drop", pct: 6, color: "bg-neutral-300" },
    ],
    steps: [
      { step: "01. Landing Page", users: "80,000", pct: 100, status: "normal" },
      { step: "02. Mobile OTP Verified", users: "52,000", pct: 65.0, status: "normal" },
      { step: "03. PAN & Income Verified", users: "18,000", pct: 34.6, status: "normal" },
      { step: "04. Aadhaar & Video KYC", users: "4,536", pct: 25.2, fixedPct: 49.4, drop: "-74.8% CHURN", status: "critical" },
      { step: "05. Credit Line Activated", users: "4,310", pct: 95.0, status: "healthy" },
    ],
    pins: [
      { id: "01", title: "Zero-Context Camera Prompt", desc: "Browser requests camera/mic before explaining Video KYC purpose.", metric: "46% Deny Permission", wireLabel: "[Browser] Allow Camera Access?" },
      { id: "02", title: "Opaque Error 402 Toast", desc: "PAN glare rejection shows raw JSON error without retry framing.", metric: "52% Abandon", wireLabel: "ERR_402: Invalid Image Blob" },
      { id: "03", title: "No Async DigiLocker Fallback", desc: "Forces live agent wait queue (avg 4.5 mins) instead of instant pull.", metric: "3.8m Queue Drop", wireLabel: "Wait Queue: 14 Users Ahead" },
    ],
    sql: `SELECT kyc_method, error_code,
  COUNT(DISTINCT user_id) AS attempts,
  ROUND(AVG(wait_time_sec), 1) AS avg_wait_s,
  ROUND(SUM(abandoned)*100.0/COUNT(*), 1) AS drop_pct
FROM \`finpulse_prod.kyc_telemetry\`
WHERE funnel_stage = 'STEP_04_VKYC'
GROUP BY 1, 2 ORDER BY drop_pct DESC;`,
    sqlResults: [
      { os: "Live Video Queue (ERR_402)", sessions: "11,200", latency: "274.0 s", churn: "84.2%" },
      { os: "Manual PAN Upload", sessions: "4,600", latency: "48.5 s", churn: "68.0%" },
      { os: "DigiLocker OAuth", sessions: "2,200", latency: "11.2 s", churn: "31.4%" },
    ],
    voiceSummary: "Diagnostic complete for FinPulse Neo. 74.8 percent of credit-approved applicants abandon at Step 4 Video KYC. SQL telemetry proves that users hit with Error 402 during live video queuing wait 274 seconds before dropping. Switching default routing to 1-Click DigiLocker OAuth recovers 94.8 Lakhs monthly.",
  },
  edtech: {
    id: "edtech",
    label: "EdTech Paywall [-96.5%]",
    url: "https://prepmate-ai.com/upgrade/pro-pass",
    visitors: 40000,
    dropoff: 96.5,
    aov: 999,
    lift: "+62% TRIAL-TO-PAID",
    rcaWeights: [
      { label: "₹4,999 Annual Sticker Shock", pct: 58, color: "bg-rose-600" },
      { label: "100% Blurred Answer Review", pct: 24, color: "bg-neutral-800" },
      { label: "Missing AutoPay Cancel Trust", pct: 12, color: "bg-neutral-500" },
      { label: "Payment Gateway Reload", pct: 6, color: "bg-neutral-300" },
    ],
    steps: [
      { step: "01. Free Sign Up", users: "95,000", pct: 100, status: "normal" },
      { step: "02. Diagnostic Mock Taken", users: "64,000", pct: 67.3, status: "normal" },
      { step: "03. AI Score Report Viewed", users: "40,000", pct: 62.5, status: "normal" },
      { step: "04. Pro Paywall Modal", users: "1,400", pct: 3.5, fixedPct: 18.2, drop: "-96.5% CHURN", status: "critical" },
      { step: "05. Subscription Active", users: "1,310", pct: 93.5, status: "healthy" },
    ],
    pins: [
      { id: "01", title: "₹4,999 Annual Plan Default", desc: "Student cohort suffers sticker shock when billed annually upfront.", metric: "89% Bounce < 4s", wireLabel: "Default: ₹4,999/yr Billed Today" },
      { id: "02", title: "Locked Mistake Review Blur", desc: "Blurs 100% of test answers instead of unlocking 2 free AI explanations.", metric: "Zero Value Hook", wireLabel: "[Blurred] All 30 Solutions Locked" },
      { id: "03", title: "Missing AutoPay Cancel Trust", desc: "No visible 1-click UPI Mandate cancellation guarantee near CTA.", metric: "High Trust Friction", wireLabel: "Start Recurring UPI Mandate" },
    ],
    sql: `SELECT pricing_variant, user_segment,
  COUNT(DISTINCT student_id) AS paywall_views,
  ROUND(AVG(time_on_paywall_sec), 1) AS dwell_sec,
  ROUND(SUM(converted)*100.0/COUNT(*), 2) AS conv_pct
FROM \`prepmate.paywall_experiments\`
GROUP BY 1, 2 ORDER BY conv_pct ASC;`,
    sqlResults: [
      { os: "Annual ₹4,999 Upfront", sessions: "31,500", latency: "3.2 s dwell", churn: "98.1%" },
      { os: "Quarterly ₹1,799", sessions: "5,500", latency: "9.4 s dwell", churn: "93.4%" },
      { os: "Weekly Sachet ₹149", sessions: "3,000", latency: "24.8 s dwell", churn: "84.2%" },
    ],
    voiceSummary: "Diagnostic complete for PrepMate EdTech. 96.5 percent of students exit at the paywall in under 4 seconds due to the 4,999 rupee annual default plan. Introducing a 149 rupee 7-day Exam Sprint pass with 2 unlocked AI answer explanations lifts paid conversion by 62 percent.",
  },
};

export default function FunnelDoctorSwissUltimate() {
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("d2c");
  const currentData = PRESET_DATASETS[selectedPreset];

  const [targetUrl, setTargetUrl] = useState(currentData.url);
  const [activeTab, setActiveTab] = useState<"split" | "prd" | "code">("split");
  const [selectedPin, setSelectedPin] = useState("01");
  const [isAuditing, setIsAuditing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [workbenchStep, setWorkbenchStep] = useState(1);
  const [headerMode, setHeaderMode] = useState<"website" | "workspace">("website");
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const pitchText = `FunnelDoctor AI — 60s Founder Pitch Script:
00:00 - The Problem: Over ₹32,000 Crores of GMV evaporates at Step 4 of checkout funnels across Indian apps every day. Traditional analytics tools show WHERE users leave, but never explain WHY.
00:20 - The Solution: FunnelDoctor autonomously fuses quantitative BigQuery SQL telemetry with Gemini 2.5 Vision screen inspection. It pinpoints forced OTP walls, UPI latency, and fee shocks, then generates an executive PRD and copyable React components.
00:45 - The Impact: Replaces 3 weeks of manual triage across PMs, analysts, and designers with a 60-second autonomous audit, unlocking an average of ₹73 Lakhs in recovered monthly revenue per enterprise.`;

  const handleCopyPitch = () => {
    navigator.clipboard?.writeText(pitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handlePlayPitchVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(pitchText);
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Interactive Simulation Mode for the Funnel Stream ("Broken State" vs "Gemini Fixed State")
  const [simFixedMode, setSimFixedMode] = useState(false);
  const [customUploadName, setCustomUploadName] = useState<string | null>(null);

  // Financial Sliders
  const [checkoutVisitors, setCheckoutVisitors] = useState(currentData.visitors);
  const [dropoffRate, setDropoffRate] = useState(currentData.dropoff);
  const [aov, setAov] = useState(currentData.aov);

  const switchPreset = (key: PresetKey) => {
    setIsAuditing(true);
    setSelectedPreset(key);
    setSimFixedMode(false);
    const next = PRESET_DATASETS[key];
    setTargetUrl(next.url);
    setCheckoutVisitors(next.visitors);
    setDropoffRate(next.dropoff);
    setAov(next.aov);
    setSelectedPin("01");
    setTimeout(() => setIsAuditing(false), 350);
  };

  const handleCustomScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomUploadName(file.name);
      setIsAuditing(true);
      setTimeout(() => setIsAuditing(false), 600);
    }
  };

  // Financial Math
  const monthlyLeakedLakhs = ((checkoutVisitors * (dropoffRate / 100) * aov) / 100000).toFixed(1);
  const monthlyRecoverableLakhs = (Number(monthlyLeakedLakhs) * 0.22).toFixed(1);
  const annualizedRecoverableCr = ((Number(monthlyRecoverableLakhs) * 12) / 100).toFixed(2);

  // Voice Briefing
  const toggleVoiceBriefing = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(currentData.voiceSummary);
    utterance.rate = 1.02;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(`// Synthesized by FunnelDoctor Gemini 2.5 Agent`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#0A0A0A] font-sans selection:bg-black selection:text-white relative">
      {/* Smooth Architectural Topographic Background */}
      <SwissTopographicMesh />

      {/* Swiss Blueprint Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 1. TOP MINIMALIST ROYAL PURPLE HEADER (MATCHING USER SCREENSHOT PRECISELY) */}
      <header className="sticky top-0 z-50 w-full bg-[#20053a]/95 backdrop-blur-xl border-b border-purple-500/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 whitespace-nowrap">
          {/* Left Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setHeaderMode("website");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
              title="FunnelDoctor Home"
            >
              <Activity className="w-4 h-4 text-purple-700 stroke-[2.5]" />
            </button>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">
                  FunnelDoctor<span className="text-purple-300 font-semibold">.ai</span>
                </span>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/30 text-[10px] font-mono font-medium text-purple-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>GEMINI 2.5 ACTIVE</span>
                </div>
              </div>
              <p className="text-[10px] text-purple-200/70 font-medium tracking-tight leading-none mt-0.5">
                Autonomous Multimodal Conversion & RCA Agent
              </p>
            </div>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-purple-200/80">
            <button
              onClick={() => {
                document.getElementById("telemetry")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Telemetry
            </button>
            <button
              onClick={() => {
                setWorkbenchStep(1);
                setHeaderMode("workspace");
                document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Vision X-Ray
            </button>
            <button
              onClick={() => {
                setWorkbenchStep(2);
                setHeaderMode("workspace");
                document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              SQL Lab
            </button>
            <button
              onClick={() => {
                setActiveTab("prd");
                document.getElementById("remediation")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              PRD Studio
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Mode Switcher Pill */}
            <div className="bg-purple-950/70 p-0.5 rounded-full border border-purple-500/25 flex items-center">
              <button
                onClick={() => {
                  setHeaderMode("website");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  headerMode === "website"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-purple-200/80 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Website</span>
              </button>
              <button
                onClick={() => {
                  setHeaderMode("workspace");
                  document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  headerMode === "workspace"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-purple-200/80 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Workspace</span>
              </button>
            </div>

            {/* Pitch Script Button */}
            <button
              onClick={() => setIsPitchModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-400/30 bg-purple-900/30 hover:bg-purple-800/50 text-purple-200 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-purple-300" />
              <span>Pitch Script</span>
            </button>

            {/* Launch Workspace Primary Button */}
            <button
              onClick={() => {
                setHeaderMode("workspace");
                document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 bg-white hover:bg-purple-50 text-slate-950 px-3.5 py-1.5 rounded-full font-semibold text-xs shadow-sm transition active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-32">
        {/* 2. HERO SECTION */}
        <section className="max-w-4xl mx-auto text-center pt-4 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-300 rounded-full text-[11px] font-mono tracking-tight text-neutral-600 mb-6 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            DIAGNOSTIC TELEMETRY FOR MULTIMODAL CONVERSION FRICTION
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.04] text-[#0A0A0A] mb-6">
            Diagnose conversion churn. <br />
            <span className="text-neutral-400 font-normal">Synthesize the fix in 60s.</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Autonomous Root-Cause Analysis combining quantitative BigQuery funnel telemetry with Gemini Vision spatial screen inspection to output executive PRDs and production React code.
          </p>

          {/* Target Input Bar */}
          <div className="max-w-2xl mx-auto bg-white border border-neutral-300 p-2 flex flex-col sm:flex-row items-center gap-2 shadow-xs">
            <div className="flex items-center gap-2 px-3 py-2 w-full font-mono text-xs text-neutral-500 border-b sm:border-b-0 sm:border-r border-neutral-200">
              <span className="text-neutral-400 shrink-0">TARGET URL:</span>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-transparent text-black focus:outline-none font-mono text-xs"
              />
            </div>
            <button
              onClick={() => switchPreset(selectedPreset)}
              className="w-full sm:w-auto px-6 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              {isAuditing ? "Scanning..." : "Run Audit"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Preset Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 font-mono text-[11px] text-neutral-500">
            <span>LIVE PRESETS:</span>
            {(Object.keys(PRESET_DATASETS) as PresetKey[]).map((key) => {
              const preset = PRESET_DATASETS[key];
              return (
                <button
                  key={preset.id}
                  onClick={() => switchPreset(preset.id)}
                  className={`px-2.5 py-1 border transition-all cursor-pointer ${
                    selectedPreset === preset.id
                      ? "bg-black text-white border-black font-bold"
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. TACTILE PRECISION DIAGNOSTIC WORKBENCH */}
        <TactileDiagnosticWorkbench
          activeStep={workbenchStep}
          setActiveStep={setWorkbenchStep}
        />

        {/* 4. INTERACTIVE USER-STREAM SIMULATION */}
        <section id="simulator" className="mb-6">
          <div className="bg-white border border-neutral-300 p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-neutral-200">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-black" />
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    INTERACTIVE FUNNEL PHYSICS SIMULATOR // WHY MULTIMODAL RCA MATTERS
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Traditional analytics only show <em>how many</em> users vanish at Step 04. Toggle the Gemini Remediation switch to see how fixing spatial UI bugs re-routes live user traffic.
                </p>
              </div>

              {/* Interactive Simulation Toggle */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setSimFixedMode(false)}
                  className={`px-3 py-1.5 border cursor-pointer transition-all ${
                    !simFixedMode
                      ? "bg-rose-600 text-white border-rose-600 font-bold"
                      : "bg-white text-neutral-600 border-neutral-300"
                  }`}
                >
                  🚨 Broken Funnel ({currentData.dropoff}% Drop)
                </button>
                <button
                  onClick={() => setSimFixedMode(true)}
                  className={`px-3 py-1.5 border cursor-pointer transition-all ${
                    simFixedMode
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white text-neutral-600 border-neutral-300"
                  }`}
                >
                  ⚡ Gemini Synthesized Fix ({currentData.lift})
                </button>
              </div>
            </div>

            {/* Animated SVG Traffic Pipeline */}
            <div className="bg-[#F7F7F8] border border-neutral-200 p-4 mb-5">
              <svg viewBox="0 0 900 130" className="w-full h-32 overflow-visible">
                <defs>
                  <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.15" />
                    <stop offset="65%" stopColor={simFixedMode ? "#059669" : "#E11D48"} stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Main Conversion Conduit */}
                <path
                  d="M 20 45 L 560 45 L 880 45"
                  stroke="#CBD5E1"
                  strokeWidth="26"
                  strokeLinecap="square"
                  fill="none"
                />

                {/* Active Surviving Traffic Stream */}
                <path
                  d="M 20 45 L 560 45 L 880 45"
                  stroke={simFixedMode ? "#059669" : "#0A0A0A"}
                  strokeWidth={simFixedMode ? "18" : "8"}
                  fill="none"
                  className="transition-all duration-500"
                />

                {/* Step 04 Leak Conduit (Drops Downward when Broken) */}
                <path
                  d="M 560 45 Q 610 45, 635 105 L 770 105"
                  stroke="#E11D48"
                  strokeWidth={simFixedMode ? "3" : "16"}
                  strokeDasharray="6 4"
                  fill="none"
                  className="transition-all duration-500"
                />

                {/* Animated Flowing User Dots (Surviving) */}
                {[0, 1, 2, 3, 4].map((dot) => (
                  <circle key={dot} r="4.5" fill={simFixedMode ? "#059669" : "#0A0A0A"}>
                    <animateMotion
                      dur={`${2.8 + dot * 0.3}s`}
                      repeatCount="indefinite"
                      path="M 20 45 L 880 45"
                    />
                  </circle>
                ))}

                {/* Animated Leaking User Dots (Dropping out at Step 04) */}
                {!simFixedMode &&
                  [0, 1, 2, 3].map((dot) => (
                    <circle key={dot} r="4.5" fill="#E11D48">
                      <animateMotion
                        dur={`${2.2 + dot * 0.4}s`}
                        repeatCount="indefinite"
                        path="M 280 45 L 560 45 Q 610 45, 635 105 L 770 105"
                      />
                    </circle>
                  ))}

                {/* Stage Node Labels */}
                <g className="font-mono text-[10px]" fill="#0A0A0A">
                  <rect x="15" y="10" width="115" height="20" fill="#FFFFFF" stroke="#CBD5E1" />
                  <text x="22" y="23" fontWeight="bold">
                    01. VIEW (100%)
                  </text>

                  <rect x="195" y="10" width="115" height="20" fill="#FFFFFF" stroke="#CBD5E1" />
                  <text x="202" y="23" fontWeight="bold">
                    02. BAG (38.4%)
                  </text>

                  <rect x="375" y="10" width="125" height="20" fill="#FFFFFF" stroke="#CBD5E1" />
                  <text x="382" y="23" fontWeight="bold">
                    03. START (65.1%)
                  </text>

                  <rect
                    x="530"
                    y="8"
                    width="155"
                    height="22"
                    fill={simFixedMode ? "#ECFDF5" : "#FFF1F2"}
                    stroke={simFixedMode ? "#059669" : "#E11D48"}
                    strokeWidth="1.5"
                  />
                  <text
                    x="538"
                    y="22"
                    fill={simFixedMode ? "#047857" : "#BE123C"}
                    fontWeight="bold"
                    suppressHydrationWarning
                  >
                    {simFixedMode ? "04. 1-TAP FIXED (48.6%)" : `04. FRICTION (-${currentData.dropoff}%)`}
                  </text>

                  <rect x="745" y="10" width="135" height="20" fill="#FFFFFF" stroke="#CBD5E1" />
                  <text x="752" y="23" fontWeight="bold">
                    05. PAID ORDER
                  </text>

                  {/* Leak Drain Label */}
                  <text
                    x="645"
                    y="95"
                    fill="#BE123C"
                    fontWeight="bold"
                    suppressHydrationWarning
                  >
                    {simFixedMode
                      ? `✓ RECOVERED: +₹${monthlyRecoverableLakhs}L/MO`
                      : `✗ REVENUE DRAIN: -₹${monthlyLeakedLakhs}L/MO`}
                  </text>
                </g>
              </svg>
            </div>

            {/* 5-Stage Quantitative Funnel Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {currentData.steps.map((s, idx) => {
                const displayPct = simFixedMode && s.fixedPct ? s.fixedPct : s.pct;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 border transition-all ${
                      s.status === "critical"
                        ? simFixedMode
                          ? "bg-emerald-50/40 border-emerald-600"
                          : "bg-rose-50/40 border-rose-500 ring-1 ring-rose-500/30"
                        : "bg-[#F7F7F8] border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 mb-1">
                      <span>{s.step}</span>
                      {s.drop && (
                        <span
                          className={simFixedMode ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}
                          suppressHydrationWarning
                        >
                          {simFixedMode ? currentData.lift : s.drop}
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold tracking-tight font-mono mb-2" suppressHydrationWarning>
                      {s.users} <span className="text-[11px] font-normal text-neutral-500">users</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          s.status === "critical"
                            ? simFixedMode
                              ? "bg-emerald-600"
                              : "bg-rose-600"
                            : "bg-black"
                        }`}
                        style={{ width: `${displayPct}%` }}
                      />
                    </div>
                    <div className="mt-1.5 font-mono text-[10px] text-neutral-500">
                      Step Conversion:{" "}
                      <strong
                        className={
                          s.status === "critical"
                            ? simFixedMode
                              ? "text-emerald-700"
                              : "text-rose-600"
                            : "text-black"
                        }
                        suppressHydrationWarning
                      >
                        {displayPct}%
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. MODULE 01 (SPATIAL VISION WIREFRAME) & MODULE 02 (SQL + RCA WEIGHTS) */}
        <section id="telemetry" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module 01: True Visual Viewport X-Ray */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <ScanEye className="w-4 h-4 text-black" />
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    MODULE 01 // GEMINI 2.5 SPATIAL VISION X-RAY
                  </span>
                </div>
                <label className="text-[11px] font-mono px-2.5 py-1 bg-black text-white flex items-center gap-1.5 cursor-pointer hover:bg-neutral-800">
                  <Upload className="w-3 h-3" />
                  {customUploadName
                    ? `Scanned: ${customUploadName.slice(0, 14)}...`
                    : "Upload Custom UI Screenshot"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomScreenshot}
                    className="hidden"
                  />
                </label>
              </div>

              <h3 className="text-2xl font-semibold tracking-tight mb-2">Multimodal Viewport Inspection</h3>
              <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                Click any spatial pin on the mobile blueprint to inspect how Gemini Vision correlates layout flaws with rage-clicks and step abandonment.
              </p>
            </div>

            {/* Split Wireframe + Pin Inspector (CLEAN PIN ALIGNMENT - NO TEXT OVERLAP) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#F7F7F8] border border-neutral-200 p-4">
              {/* Interactive Mobile Screen Blueprint */}
              <div className="sm:col-span-5 bg-white border-2 border-neutral-900 p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2 font-mono text-[9px] text-neutral-400">
                  <span>390x844PX VIEWPORT</span>
                  <span className="text-rose-600 font-bold">● 3 FAULTS</span>
                </div>

                {/* Clean Non-Overlapping Wireframe Blocks with Integrated Pin Badges */}
                <div className="space-y-2.5 my-3">
                  {currentData.pins.map((pin, idx) => (
                    <React.Fragment key={pin.id}>
                      {idx === 2 && (
                        <div className="border-t-2 border-dashed border-rose-500 pt-1 font-mono text-[9px] text-rose-600 flex justify-between">
                          <span>--- 6.1" ANDROID FOLD ---</span>
                          <span className="font-bold">BELOW FOLD</span>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedPin(pin.id)}
                        className={`w-full text-left p-2 border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          selectedPin === pin.id
                            ? "bg-rose-50 border-rose-500 shadow-2xs"
                            : "bg-neutral-50 border-dashed border-neutral-300 hover:border-black"
                        }`}
                      >
                        <span className="font-mono text-[10px] text-neutral-800 truncate">
                          {pin.wireLabel}
                        </span>
                        <span
                          className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            selectedPin === pin.id
                              ? "bg-rose-600 text-white ring-2 ring-rose-300"
                              : "bg-black text-white"
                          }`}
                        >
                          {pin.id}
                        </span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                <div className="font-mono text-[9px] text-neutral-400 border-t border-neutral-100 pt-1.5 flex justify-between">
                  <span>HEURISTIC SCAN: BAYMARD</span>
                  <span className="text-black font-bold">CONFIDENCE: 98.4%</span>
                </div>
              </div>

              {/* Pin Findings List */}
              <div className="sm:col-span-7 flex flex-col justify-between font-mono text-xs">
                <div className="space-y-2.5">
                  {currentData.pins.map((pin) => (
                    <div
                      key={pin.id}
                      onClick={() => setSelectedPin(pin.id)}
                      className={`p-3 border transition-all cursor-pointer ${
                        selectedPin === pin.id
                          ? "bg-white border-black shadow-2xs"
                          : "bg-transparent border-neutral-200 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-black">
                          <span className="text-rose-600 mr-1">[PIN #{pin.id}]</span>
                          {pin.title}
                        </span>
                        <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 border border-rose-200 font-bold">
                          {pin.metric}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                        {pin.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Senior Data Analyst Addition: 4-Pillar Root Cause Weight Attribution Bar */}
            <div className="mt-4 pt-4 border-t border-neutral-200 font-mono text-[11px]">
              <div className="flex justify-between text-neutral-500 mb-2">
                <span>MULTIVARIATE ROOT-CAUSE ATTRIBUTION WEIGHTS</span>
                <span className="text-black font-bold">SHAPLEY VALUE MODEL</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentData.rcaWeights.map((w, i) => (
                  <div key={i} className="bg-[#F7F7F8] border border-neutral-200 p-2">
                    <div className="text-xs font-bold text-black" suppressHydrationWarning>
                      {w.pct}% Weight
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate">{w.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module 02: SQL Lab + Executed Results Table */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-black" />
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    MODULE 02 // BIGQUERY AGENT LAB
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                  QUERY VERIFIED (140ms)
                </span>
              </div>

              <h3 className="text-2xl font-semibold tracking-tight mb-2">Autonomous Telemetry Proof</h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                Google Agent Skills writes and runs segmented SQL to prove whether drop-offs are UI-induced or latency-induced.
              </p>

              {/* SQL Query Box */}
              <pre className="bg-[#0A0A0A] text-[#E5E5E7] p-4 font-mono text-[11px] leading-relaxed border border-neutral-900 overflow-x-auto mb-4">
                {currentData.sql}
              </pre>
            </div>

            {/* Executed SQL Results Table */}
            <div className="border border-neutral-200 bg-[#F7F7F8] p-3 font-mono text-[11px]">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 pb-1 border-b border-neutral-200 flex justify-between">
                <span>EXECUTED BIGQUERY OUTPUT</span>
                <span className="text-black font-bold">3 ROWS RETURNED</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-neutral-400 text-[10px] border-b border-neutral-200">
                    <th className="pb-1">SEGMENT / OS</th>
                    <th className="pb-1">SESSIONS</th>
                    <th className="pb-1">P95 LATENCY</th>
                    <th className="pb-1 text-right">CHURN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/70">
                  {currentData.sqlResults.map((row, i) => (
                    <tr key={i} className={i === 0 ? "text-rose-600 font-bold" : "text-neutral-700"}>
                      <td className="py-1.5 pr-2">{row.os}</td>
                      <td className="py-1.5">{row.sessions}</td>
                      <td className="py-1.5">{row.latency}</td>
                      <td className="py-1.5 text-right">{row.churn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 6. MODULE 03: SIDE-BY-SIDE UI COMPARATOR + EXECUTIVE PRD + REACT CODE */}
        <section id="remediation" className="pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                MODULE 03 // AUTONOMOUS REMEDIATION & SPEC SYNTHESIS
              </span>
              <h2 className="text-3xl font-semibold tracking-tight mt-1">
                Before vs. After UI Synthesis & Auto-PRD
              </h2>
            </div>

            <div className="inline-flex border border-neutral-300 p-0.5 bg-neutral-200/60 font-mono text-xs">
              <button
                onClick={() => setActiveTab("split")}
                className={`px-3.5 py-1.5 transition-colors cursor-pointer ${
                  activeTab === "split"
                    ? "bg-white text-black shadow-2xs font-bold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                01. Visual Before / After Diff
              </button>
              <button
                onClick={() => setActiveTab("prd")}
                className={`px-3.5 py-1.5 transition-colors cursor-pointer ${
                  activeTab === "prd"
                    ? "bg-white text-black shadow-2xs font-bold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                02. Auto-PRD & RICE Spec
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3.5 py-1.5 transition-colors cursor-pointer ${
                  activeTab === "code"
                    ? "bg-white text-emerald-700 shadow-2xs font-bold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                03. Production React Code
              </button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-8 shadow-2xs">
            {activeTab === "split" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Left: Broken Baseline */}
                <div className="border-2 border-dashed border-rose-300 bg-rose-50/20 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-200 font-mono text-xs text-rose-800">
                      <span className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        CURRENT BROKEN BASELINE
                      </span>
                      <span className="bg-rose-100 text-rose-800 px-2 py-0.5 font-bold" suppressHydrationWarning>
                        {currentData.dropoff}% DROP-OFF
                      </span>
                    </div>

                    <div className="space-y-3">
                      {currentData.pins.map((p) => (
                        <div key={p.id} className="p-3 bg-white border border-rose-200">
                          <div className="flex justify-between font-mono text-[10px] text-rose-600 font-bold mb-1">
                            <span>
                              FAULT #{p.id}: {p.title.toUpperCase()}
                            </span>
                            <span>{p.metric}</span>
                          </div>
                          <p className="text-neutral-700 text-xs">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-rose-200/70 flex justify-between font-mono text-xs text-rose-700">
                    <span>BASELINE CONVERSION:</span>
                    <span className="font-bold" suppressHydrationWarning>
                      2.1% (BLEEDING ₹{monthlyLeakedLakhs}L/MO)
                    </span>
                  </div>
                </div>

                {/* Right: Gemini Synthesized Fix */}
                <div className="border-2 border-emerald-600 bg-emerald-50/10 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-200 font-mono text-xs text-emerald-900">
                      <span className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        GEMINI SYNTHESIZED REMEDIATION
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold" suppressHydrationWarning>
                        {currentData.lift}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-white border border-emerald-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-mono text-[10px] text-emerald-700 font-bold block">
                            FIX #01 // ZERO-LOGIN GUEST EXPRESS
                          </span>
                          <p className="text-xs text-neutral-700">
                            Removed blocking email modal; identity auto-bound via UPI VPA handle post-payment.
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-emerald-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-mono text-[10px] text-emerald-700 font-bold block">
                            FIX #02 // UPFRONT FREE-DELIVERY PROGRESS BAR
                          </span>
                          <p className="text-xs text-neutral-700">
                            Eliminated ₹149 surprise fee shock; unlocked transparent free shipping banner above CTA.
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-emerald-200">
                        <div className="flex justify-between font-mono text-[10px] text-neutral-500 mb-2">
                          <span>STICKY ABOVE-FOLD 1-TAP UPI INTENT</span>
                          <span className="text-emerald-700 font-bold">P95: 380ms</span>
                        </div>
                        <button
                          className="w-full py-3 bg-black text-white font-mono text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
                          suppressHydrationWarning
                        >
                          Pay ₹{aov.toLocaleString()} Instantly via UPI [GPay / PhonePe]
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-emerald-200 flex justify-between font-mono text-xs text-emerald-800">
                    <span>PROJECTED RECOVERY:</span>
                    <span className="font-bold" suppressHydrationWarning>
                      +₹{monthlyRecoverableLakhs} LAKHS / MONTH
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "prd" && (
              <div className="font-mono text-xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-4">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">DOCUMENT ID: PRD-2026-STEP04</span>
                    <h4 className="font-sans text-lg font-bold text-black">
                      Executive Product Requirements Document (Auto-Synthesized)
                    </h4>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-black text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? "Copied Markdown" : "Export PRD (.MD)"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#F7F7F8] border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block mb-1">01. PROBLEM STATEMENT</span>
                    <p className="font-sans text-xs text-neutral-800 leading-relaxed" suppressHydrationWarning>
                      Step 04 experiences a <strong>{currentData.dropoff}% drop-off</strong> across{" "}
                      {checkoutVisitors.toLocaleString()} monthly sessions due to login friction, late fee disclosure,
                      and Android WebView UPI timeout.
                    </p>
                  </div>
                  <div className="p-4 bg-[#F7F7F8] border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block mb-1">02. HYPOTHESIS & PRIMARY METRIC</span>
                    <p className="font-sans text-xs text-neutral-800 leading-relaxed">
                      Replacing forced OTP login with sticky 1-Tap Native UPI Intent will lift Step 4 conversion by{" "}
                      <strong>+22% to +38%</strong> without increasing RTO%.
                    </p>
                  </div>
                  <div className="p-4 bg-[#F7F7F8] border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block mb-1">03. GUARDRAIL METRICS</span>
                    <p className="font-sans text-xs text-neutral-800 leading-relaxed">
                      Payment Webhook Success Rate (&gt;99.2%), P95 Intent Latency (&lt;500ms), Post-Order
                      Cancellation Rate (&lt;4.5%).
                    </p>
                  </div>
                </div>

                <div className="border border-neutral-200 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F7F7F8] border-b border-neutral-200 text-[10px] text-neutral-500">
                        <th className="p-3">ENGINEERING TASK</th>
                        <th className="p-3">REACH</th>
                        <th className="p-3">IMPACT</th>
                        <th className="p-3">CONFIDENCE</th>
                        <th className="p-3">EFFORT</th>
                        <th className="p-3 text-right">RICE SCORE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr>
                        <td className="p-3 font-bold">1. Sticky Above-Fold Native UPI Intent Drawer</td>
                        <td className="p-3">100%</td>
                        <td className="p-3 text-emerald-700 font-bold">3.0x (Massive)</td>
                        <td className="p-3">95%</td>
                        <td className="p-3">2 Days</td>
                        <td className="p-3 text-right font-bold">142.5</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">2. Deprecate Blocking Email OTP Wall for Guest Checkout</td>
                        <td className="p-3">82%</td>
                        <td className="p-3 text-emerald-700 font-bold">2.5x (High)</td>
                        <td className="p-3">90%</td>
                        <td className="p-3">1.5 Days</td>
                        <td className="p-3 text-right font-bold">123.0</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">3. Upfront Free-Delivery Threshold Bar in Cart</td>
                        <td className="p-3">100%</td>
                        <td className="p-3">1.5x (Medium)</td>
                        <td className="p-3">85%</td>
                        <td className="p-3">1 Day</td>
                        <td className="p-3 text-right font-bold">127.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div>
                <div className="flex justify-between items-center mb-3 font-mono text-xs">
                  <span className="text-neutral-500">FILE: components/checkout/ExpressUpiRemediation.tsx</span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 bg-black text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? "Copied!" : "Copy Component"}
                  </button>
                </div>
                <pre className="bg-[#0A0A0A] text-[#E5E5E7] p-6 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
{`// Auto-Synthesized by FunnelDoctor Gemini 2.5 Code Agent
// Fixes Pin #01 (Forced OTP), Pin #02 (Late Fee), Pin #03 (Below-Fold UPI CTA)

import React from 'react';

export function ExpressUpiCheckout({ cartTotal = ${aov}, freeShipMin = 999, onInstantPay }) {
  const isFreeShipping = cartTotal >= freeShipMin;

  return (
    <aside className="sticky bottom-0 z-50 bg-white border-t border-neutral-200 p-4 shadow-lg">
      <div className="mb-3 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800">
        {isFreeShipping 
          ? '✓ FREE EXPRESS SHIPPING UNLOCKED (ZERO HIDDEN FEES)' 
          : \`Add ₹\${freeShipMin - cartTotal} more for Free Delivery\`}
      </div>

      <button
        onClick={() => onInstantPay({ protocol: 'NATIVE_UPI_INTENT', guestMode: true })}
        className="w-full py-3.5 bg-black text-white font-mono text-xs uppercase tracking-wider hover:bg-neutral-800"
      >
        Pay ₹{cartTotal.toLocaleString()} via 1-Tap UPI [GPay / PhonePe / Paytm]
      </button>
    </aside>
  );
}`}
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* 7. MODULE 04: GEMINI LIVE VOICE PM WAR ROOM */}
        <section id="warroom" className="pt-14">
          <div className="bg-[#0A0A0A] text-white border border-black p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] text-emerald-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                MODULE 04 // GEMINI LIVE VOICE PM WAR ROOM
              </div>
              <h3 className="text-2xl font-semibold tracking-tight">
                Consult Your Autonomous Principal AI Product Manager
              </h3>
              <p className="text-sm text-neutral-400 font-mono leading-relaxed">
                &ldquo;{currentData.voiceSummary}&rdquo;
              </p>
            </div>

            <button
              onClick={toggleVoiceBriefing}
              className={`px-6 py-4 font-mono text-xs uppercase tracking-wider flex items-center gap-3 shrink-0 transition-all cursor-pointer border ${
                isSpeaking
                  ? "bg-rose-600 text-white border-rose-500"
                  : "bg-white text-black border-white hover:bg-neutral-200"
              }`}
            >
              <Mic className={`w-4 h-4 ${isSpeaking ? "animate-bounce" : ""}`} />
              {isSpeaking ? "Speaking Live Audio Briefing..." : "Play Live Voice RCA Briefing"}
            </button>
          </div>
        </section>

        {/* 8. MODULE 05: FINANCIAL SENSITIVITY MODEL */}
        <section id="calculator" className="pt-14">
          <div className="border-t border-neutral-200 pt-10">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              MODULE 05 // FINANCIAL SENSITIVITY & ROI ENGINE
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-1 mb-8">
              Estimated Capital Recovery Model
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white border border-neutral-200 p-8 shadow-2xs">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-neutral-500">MONTHLY STEP-04 CHECKOUT INITIATIONS:</span>
                    <span className="font-bold" suppressHydrationWarning>
                      {checkoutVisitors.toLocaleString()} High-Intent Users
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="2500"
                    value={checkoutVisitors}
                    onChange={(e) => setCheckoutVisitors(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-neutral-500">STEP-04 DROP-OFF RATE:</span>
                    <span className="font-bold text-rose-600" suppressHydrationWarning>
                      {dropoffRate}% Abandonment
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="97"
                    step="0.5"
                    value={dropoffRate}
                    onChange={(e) => setDropoffRate(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-neutral-500">AVERAGE ORDER VALUE (AOV):</span>
                    <span className="font-bold" suppressHydrationWarning>
                      ₹{aov.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="10000"
                    step="100"
                    value={aov}
                    onChange={(e) => setAov(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-neutral-200 md:pl-8 flex flex-col justify-center font-mono">
                <span className="text-[11px] text-neutral-400 block mb-1">MONTHLY REVENUE LEAKED:</span>
                <span
                  className="text-3xl font-bold text-rose-600 mb-5 tracking-tight"
                  suppressHydrationWarning
                >
                  ₹{monthlyLeakedLakhs} L<span className="text-xs font-normal text-neutral-500"> /mo</span>
                </span>

                <span className="text-[11px] text-neutral-400 block mb-1">MONTHLY RECOVERABLE (+22% LIFT):</span>
                <span
                  className="text-3xl font-bold text-emerald-600 mb-4 tracking-tight"
                  suppressHydrationWarning
                >
                  +₹{monthlyRecoverableLakhs} L<span className="text-xs font-normal text-neutral-500"> /mo</span>
                </span>

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">ANNUALIZED ARR IMPACT:</span>
                  <span className="font-bold text-black" suppressHydrationWarning>
                    +₹{annualizedRecoverableCr} Cr /yr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. MINIMALIST PITCH SCRIPT MODAL */}
      {isPitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0f0724] border border-purple-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-400/30 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight text-white">
                    60-Second Founder Pitch Script
                  </h3>
                  <p className="text-[11px] font-mono text-purple-300/70">
                    Startup Buildathon India 2026 • Autonomous Multimodal Conversion Agent
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-3.5 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans max-h-[55vh] overflow-y-auto pr-1">
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                <span className="font-mono text-[10px] font-bold text-purple-300 uppercase block mb-1">
                  00:00 - The ₹32,000 Cr Leak
                </span>
                <p className="text-purple-100/90 text-xs sm:text-sm leading-relaxed">
                  "Every day in India, over ₹32,000 Crores of GMV evaporates at Step 4 of checkout funnels. Traditional tools like GA4 and Mixpanel show founders WHERE users left, but NEVER explain WHY."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                <span className="font-mono text-[10px] font-bold text-purple-300 uppercase block mb-1">
                  00:20 - Gemini 2.5 Multimodal Solution
                </span>
                <p className="text-purple-100/90 text-xs sm:text-sm leading-relaxed">
                  "FunnelDoctor autonomously fuses quantitative BigQuery SQL telemetry with Gemini 2.5 Vision screen inspection. It detects visual traps like forced OTP modals, UPI intent latencies, and fee shocks, then synthesizes a verified PRD and 1-Tap production React code."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                <span className="font-mono text-[10px] font-bold text-purple-300 uppercase block mb-1">
                  00:45 - The Tech & Business Moat
                </span>
                <p className="text-purple-100/90 text-xs sm:text-sm leading-relaxed">
                  "By automating what previously took a senior PM, data analyst, and frontend engineer 3 weeks down to 60 seconds, FunnelDoctor recovers an average of ₹73 Lakhs per month per enterprise client."
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPitchVoice}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    isSpeaking
                      ? "bg-rose-600 text-white"
                      : "bg-purple-900/60 hover:bg-purple-800 text-purple-100 border border-purple-500/30"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? "Stop Voice" : "Play Voice Pitch"}</span>
                </button>
                <button
                  onClick={handleCopyPitch}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPitch ? "Copied" : "Copy Script"}</span>
                </button>
              </div>
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white text-slate-950 font-semibold text-xs hover:bg-neutral-200 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
