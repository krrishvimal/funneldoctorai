"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ScanEye,
  Code2,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mic,
  Volume2,
  Upload,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Layers,
} from "lucide-react";

// 1. SMOOTH ARCHITECTURAL TOPOGRAPHIC MESH
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
      t += 0.006;

      const waveCount = 6;
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(15, 23, 42, ${0.06 + i * 0.025})`;

        const baseHeight = canvas.height * 0.34 + i * 38;
        const freq = 0.0014 + i * 0.0002;
        const amp = 28 + i * 14;

        // 4px step for ultra-smooth curves (no jagged polygon corners)
        for (let x = 0; x <= canvas.width; x += 4) {
          const dx = x - mouse.x;
          const dist = Math.abs(dx);
          const mouseInfluence = Math.max(0, (240 - dist) / 240) * 22;

          const y =
            baseHeight +
            Math.sin(x * freq + t + i * 0.6) * amp +
            Math.cos(x * 0.0009 - t * 0.5) * 14 -
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
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
}

// 2. THREE REALISTIC STARTUP DATASETS (DYNAMIC STATE MACHINE)
type PresetKey = "d2c" | "fintech" | "edtech";

interface FunnelStep {
  step: string;
  users: string;
  pct: number;
  drop?: string;
  status: "normal" | "critical" | "healthy";
}

interface SpatialPin {
  id: string;
  x: string;
  y: string;
  title: string;
  desc: string;
  metric: string;
}

interface SqlResultRow {
  os: string;
  sessions: string;
  latency: string;
  churn: string;
}

interface PresetDataset {
  id: PresetKey;
  label: string;
  url: string;
  visitors: number;
  dropoff: number;
  aov: number;
  lift: string;
  steps: FunnelStep[];
  pins: SpatialPin[];
  sql: string;
  sqlResults: SqlResultRow[];
  voiceSummary: string;
}

const PRESET_DATASETS: Record<PresetKey, PresetDataset> = {
  d2c: {
    id: "d2c",
    label: "D2C Checkout [-71.7%]",
    url: "https://quickstyle-d2c.in/checkout/step-4",
    visitors: 25000,
    dropoff: 71.7,
    aov: 1850,
    lift: "+38% CR LIFT",
    steps: [
      { step: "01. Product Viewed", users: "1,00,000", pct: 100, status: "normal" },
      { step: "02. Added to Bag", users: "38,400", pct: 38.4, status: "normal" },
      { step: "03. Checkout Initiated", users: "25,000", pct: 65.1, status: "normal" },
      { step: "04. Address & Payment", users: "7,075", pct: 28.3, drop: "-71.7% CHURN", status: "critical" },
      { step: "05. Order Confirmed", users: "6,580", pct: 93.0, status: "healthy" },
    ],
    pins: [
      { id: "01", x: "22%", y: "28%", title: "Forced Account OTP Modal", desc: "Blocks guest checkout; 41% exit within 6s of modal trigger.", metric: "41.2% Exit" },
      { id: "02", x: "68%", y: "56%", title: "Late ₹149 Fee Reveal", desc: "Delivery + convenience surcharge hidden until final step.", metric: "31.4% Rage Click" },
      { id: "03", x: "48%", y: "84%", title: "UPI CTA Below Fold", desc: 'Primary GPay/PhonePe button pushed below 6.1" Android viewport.', metric: "64% Unseen" },
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
    voiceSummary: "Diagnostic complete for QuickStyle D2C. Step 4 is leaking 316.9 Lakhs per month. 78.4 percent of drops occur on Android WebView due to a forced email login modal combined with a 4.2 second UPI intent latency spike. Deploying our synthesized 1-Tap Guest UPI Express component is projected to recover 69.7 Lakhs per month.",
  },
  fintech: {
    id: "fintech",
    label: "Fintech KYC [-74.8%]",
    url: "https://finpulse-neo.in/onboarding/video-kyc",
    visitors: 18000,
    dropoff: 74.8,
    aov: 3200,
    lift: "+44% KYC COMPLETION",
    steps: [
      { step: "01. Landing Page", users: "80,000", pct: 100, status: "normal" },
      { step: "02. Mobile OTP Verified", users: "52,000", pct: 65.0, status: "normal" },
      { step: "03. PAN & Income Verified", users: "18,000", pct: 34.6, status: "normal" },
      { step: "04. Aadhaar & Video KYC", users: "4,536", pct: 25.2, drop: "-74.8% CHURN", status: "critical" },
      { step: "05. Credit Line Activated", users: "4,310", pct: 95.0, status: "healthy" },
    ],
    pins: [
      { id: "01", x: "30%", y: "25%", title: "Zero-Context Camera Prompt", desc: "Browser requests camera/mic before explaining Video KYC purpose.", metric: "46% Deny Permission" },
      { id: "02", x: "60%", y: "55%", title: "Opaque Error 402 Toast", desc: "PAN glare rejection shows raw JSON error without retry framing.", metric: "52% Abandon" },
      { id: "03", x: "45%", y: "82%", title: "No Async DigiLocker Fallback", desc: "Forces live agent wait queue (avg 4.5 mins) instead of instant pull.", metric: "3.8m Queue Drop" },
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
    voiceSummary: "Diagnostic complete for FinPulse Neo. 74.8 percent of credit-approved applicants abandon at Step 4 Video KYC. SQL telemetry proves that users hit with Error 402 during live video queuing wait 274 seconds before dropping. Switching default routing to 1-Click DigiLocker OAuth with an anti-glare overlay recovers 94.8 Lakhs monthly.",
  },
  edtech: {
    id: "edtech",
    label: "EdTech Paywall [-96.5%]",
    url: "https://prepmate-ai.com/upgrade/pro-pass",
    visitors: 40000,
    dropoff: 96.5,
    aov: 999,
    lift: "+62% TRIAL-TO-PAID",
    steps: [
      { step: "01. Free Sign Up", users: "95,000", pct: 100, status: "normal" },
      { step: "02. Diagnostic Mock Taken", users: "64,000", pct: 67.3, status: "normal" },
      { step: "03. AI Score Report Viewed", users: "40,000", pct: 62.5, status: "normal" },
      { step: "04. Pro Paywall Modal", users: "1,400", pct: 3.5, drop: "-96.5% CHURN", status: "critical" },
      { step: "05. Subscription Active", users: "1,310", pct: 93.5, status: "healthy" },
    ],
    pins: [
      { id: "01", x: "25%", y: "30%", title: "₹4,999 Annual Plan Default", desc: "Student cohort suffers sticker shock when billed annually upfront.", metric: "89% Bounce < 4s" },
      { id: "02", x: "65%", y: "58%", title: "Locked Mistake Review Blur", desc: "Blurs 100% of test answers instead of unlocking 2 free AI explanations.", metric: "Zero Value Hook" },
      { id: "03", x: "50%", y: "85%", title: "Missing AutoPay Cancel Trust", desc: "No visible 1-click UPI Mandate cancellation guarantee near CTA.", metric: "High Trust Friction" },
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
    voiceSummary: "Diagnostic complete for PrepMate EdTech. 96.5 percent of students exit at the paywall in under 4 seconds due to the 4,999 rupee annual default plan. Introducing a 149 rupee 7-day Exam Sprint sachet pass with 2 unlocked AI answer explanations lifts paid conversion by 62 percent.",
  },
};

export default function FunnelDoctorSwissPerfect() {
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("d2c");
  const currentData = PRESET_DATASETS[selectedPreset];

  const [targetUrl, setTargetUrl] = useState(currentData.url);
  const [activeTab, setActiveTab] = useState<"split" | "prd" | "code">("split");
  const [selectedPin, setSelectedPin] = useState("01");
  const [isAuditing, setIsAuditing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Financial Sliders (Synced with selected dataset, adjustable by user)
  const [checkoutVisitors, setCheckoutVisitors] = useState(currentData.visitors);
  const [dropoffRate, setDropoffRate] = useState(currentData.dropoff);
  const [aov, setAov] = useState(currentData.aov);

  const switchPreset = (key: PresetKey) => {
    setIsAuditing(true);
    setSelectedPreset(key);
    const next = PRESET_DATASETS[key];
    setTargetUrl(next.url);
    setCheckoutVisitors(next.visitors);
    setDropoffRate(next.dropoff);
    setAov(next.aov);
    setSelectedPin("01");
    setTimeout(() => setIsAuditing(false), 450);
  };

  // Accurate Financial Math (No Contradictory Labels)
  const monthlyLeakedLakhs = ((checkoutVisitors * (dropoffRate / 100) * aov) / 100000).toFixed(1);
  const monthlyRecoverableLakhs = (Number(monthlyLeakedLakhs) * 0.22).toFixed(1);
  const annualizedRecoverableCr = ((Number(monthlyRecoverableLakhs) * 12) / 100).toFixed(2);

  // Web Speech API for Gemini Live War Room Demo
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
      {/* Smooth Topographic Background */}
      <SwissTopographicMesh />

      {/* Swiss Blueprint Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 1. PRECISION SWISS HEADER */}
      <header className="sticky top-0 z-50 bg-[#F7F7F8]/85 backdrop-blur-md border-b border-[#E5E5E7]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-black flex items-center justify-center font-mono font-bold text-xs bg-white">
              FD
            </div>
            <span className="font-semibold tracking-tight text-sm uppercase">
              FunnelDoctor<span className="text-neutral-400"> / System</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 text-[11px] font-mono bg-white rounded text-neutral-700 border border-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              GEMINI 2.5 MULTIMODAL
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-neutral-500">
            <a href="#telemetry" className="hover:text-black transition-colors">
              01. Funnel & X-Ray
            </a>
            <a href="#remediation" className="hover:text-black transition-colors">
              02. UI & PRD Synthesis
            </a>
            <a href="#warroom" className="hover:text-black transition-colors">
              03. Voice War Room
            </a>
            <a href="#calculator" className="hover:text-black transition-colors">
              04. ROI Model
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoiceBriefing}
              className={`px-3 py-2 text-xs font-mono uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
                isSpeaking
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-white text-black border-neutral-300 hover:border-black"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              {isSpeaking ? "Stop Audio" : "AI Audio Brief"}
            </button>
            <a
              href="#telemetry"
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-black text-white hover:bg-neutral-800 transition-colors border border-black"
            >
              Live Workspace [↵]
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32">
        {/* 2. HERO SECTION */}
        <section className="max-w-4xl mx-auto text-center pt-6 pb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-300 rounded-full text-[11px] font-mono tracking-tight text-neutral-600 mb-6 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            DIAGNOSTIC TELEMETRY FOR MULTIMODAL CONVERSION FRICTION
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.04] text-[#0A0A0A] mb-6">
            Diagnose conversion churn. <br />
            <span className="text-neutral-400 font-normal">Synthesize the fix in 60s.</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Autonomous Root-Cause Analysis combining quantitative BigQuery funnel telemetry with Gemini Vision spatial screen inspection to output executive PRDs and production React code.
          </p>

          {/* Fixed Target Input Bar */}
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

          {/* Interactive Preset Switcher (Updates Entire Page State) */}
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

        {/* 3. 5-STAGE VISUAL FUNNEL TELEMETRY BAR (PROVES THE FUNNEL ANOMALY) */}
        <section id="telemetry" className="mb-6">
          <div className="bg-white border border-neutral-200 p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-black" />
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                  STAGE 00 // QUANTITATIVE FUNNEL TELEMETRY STREAM ({currentData.id.toUpperCase()})
                </span>
              </div>
              <span className="text-[11px] font-mono text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 border border-rose-200">
                ANOMALY ISOLATED AT STEP 04 ({currentData.dropoff}% DROP-OFF)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {currentData.steps.map((s, idx) => (
                <div
                  key={idx}
                  className={`p-4 border transition-all ${
                    s.status === "critical"
                      ? "bg-rose-50/40 border-rose-500 ring-1 ring-rose-500/30"
                      : "bg-[#F7F7F8] border-neutral-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 mb-1">
                    <span>{s.step}</span>
                    {s.drop && <span className="text-rose-600 font-bold">{s.drop}</span>}
                  </div>
                  <div className="text-xl font-bold tracking-tight font-mono mb-2" suppressHydrationWarning>
                    {s.users} <span className="text-xs font-normal text-neutral-500">users</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 overflow-hidden">
                    <div
                      className={`h-full ${s.status === "critical" ? "bg-rose-600" : "bg-black"}`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 font-mono text-[10px] text-neutral-500">
                    Step Conversion:{" "}
                    <strong className={s.status === "critical" ? "text-rose-600" : "text-black"} suppressHydrationWarning>
                      {s.pct}%
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. MODULE 01 (SPATIAL VISION WIREFRAME) & MODULE 02 (SQL + EXECUTED TABLE) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module 01: True Visual Viewport X-Ray with Interactive Hotspot Pins */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <ScanEye className="w-4 h-4 text-black" />
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    MODULE 01 // GEMINI 2.5 SPATIAL VISION X-RAY
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                  3 SPATIAL FAULTS PINNED
                </span>
              </div>

              <h3 className="text-2xl font-semibold tracking-tight mb-2">Multimodal Viewport Inspection</h3>
              <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                Click any spatial pin on the mobile wireframe to inspect how Gemini Vision correlates layout flaws with rage-clicks and step abandonment.
              </p>
            </div>

            {/* Split Wireframe + Pin Inspector */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#F7F7F8] border border-neutral-200 p-4">
              {/* Interactive Mobile Screen Blueprint */}
              <div className="sm:col-span-5 bg-white border-2 border-neutral-900 p-3 relative min-h-[250px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 font-mono text-[9px] text-neutral-400">
                  <span>390x844PX</span>
                  <span className="text-rose-600 font-bold">● REC VIEWPORT</span>
                </div>

                {/* Simulated UI Wireframe Blocks */}
                <div className="space-y-2 my-2">
                  <div className="h-8 bg-rose-50 border border-dashed border-rose-300 p-1.5 font-mono text-[9px] text-rose-700 flex items-center justify-between">
                    <span>[Modal] Forced OTP Login</span>
                    <span className="font-bold">#01</span>
                  </div>
                  <div className="h-6 bg-neutral-100 border border-neutral-200 p-1 font-mono text-[9px] text-neutral-400">
                    Address Line 1...
                  </div>
                  <div className="h-8 bg-rose-50 border border-dashed border-rose-300 p-1.5 font-mono text-[9px] text-rose-700 flex items-center justify-between">
                    <span>+₹149 Hidden Fee Surge</span>
                    <span className="font-bold">#02</span>
                  </div>
                </div>

                {/* Fold Line */}
                <div className="border-t-2 border-dashed border-rose-500 pt-1.5 font-mono text-[9px] text-rose-600 flex justify-between items-center">
                  <span>--- 6.1" SCREEN FOLD ---</span>
                  <span className="bg-rose-600 text-white px-1 font-bold">#03 BELOW FOLD</span>
                </div>

                {/* Clickable Pulsing Pins */}
                {currentData.pins.map((pin) => (
                  <button
                    key={pin.id}
                    onClick={() => setSelectedPin(pin.id)}
                    style={{ left: pin.x, top: pin.y }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full font-mono text-[10px] font-bold flex items-center justify-center transition-transform cursor-pointer shadow-md ${
                      selectedPin === pin.id
                        ? "bg-rose-600 text-white scale-125 ring-4 ring-rose-500/30"
                        : "bg-black text-white hover:scale-110"
                    }`}
                  >
                    {pin.id}
                  </button>
                ))}
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

        {/* 5. MODULE 03: SIDE-BY-SIDE UI COMPARATOR + EXECUTIVE PRD + REACT CODE */}
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

            {/* 3-Mode Switch: Side-by-Side Diff | Executive PRD | React Code */}
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
            {/* TAB A: SIDE-BY-SIDE VISUAL DIFF (NO EMPTY WHITE SPACE) */}
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
                      <span className="bg-rose-100 text-rose-800 px-2 py-0.5 font-bold">
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
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
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
                          className="w-full py-3 bg-black text-white font-mono text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors"
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

            {/* TAB B: EXECUTIVE AUTO-PRD & RICE PRIORITIZATION SPEC */}
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

            {/* TAB C: PRODUCTION REACT + TAILWIND CODE */}
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

        {/* 6. MODULE 04: GEMINI LIVE VOICE PM WAR ROOM */}
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

        {/* 7. MODULE 05: FIXED FINANCIAL SENSITIVITY MODEL */}
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

              {/* Accurate Financial Output Column */}
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
    </div>
  );
}
