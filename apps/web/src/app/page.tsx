"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Zap,
  Globe,
  Mic,
  ArrowRight,
  Sparkles,
  Smartphone,
  FileCode,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Check,
  Copy,
  BarChart3,
  ScanEye,
  Code2,
  Database,
  Terminal,
  CheckCircle2,
  Volume2,
  Play,
  Square,
  Download,
  RefreshCw,
  Layers,
  X,
  CreditCard,
  ShoppingBag,
  GraduationCap,
} from "lucide-react";

// Deterministic Number Formatter to guarantee 100% hydration matching
function formatNumber(val: number): string {
  if (typeof val !== "number" || isNaN(val)) return "0";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ==========================================
// KINETIC SINE-WAVE MESH CANVAS BACKGROUND
// ==========================================
function WaveMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    const linesCount = 15;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseNormY = (mouseRef.current.y / height - 0.5) * 50;
      const centerY = height * 0.36;

      for (let i = 0; i < linesCount; i++) {
        ctx.beginPath();
        const progress = i / linesCount;
        const yOffset = (i - linesCount / 2) * 16 + mouseNormY * (progress - 0.5);

        // Pulsating gradient wave opacity
        const alpha = 0.14 + Math.sin(time + i * 0.35) * 0.07;
        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(168, 85, 247, ${alpha})`
            : `rgba(56, 189, 248, ${alpha * 0.85})`;
        ctx.lineWidth = 1.25;

        for (let x = 0; x <= width; x += 15) {
          const dx = x - mouseRef.current.x;
          const dy = centerY + yOffset - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseInfluence = Math.max(0, 1 - dist / 320) * 32;

          const wave1 = Math.sin(x * 0.0032 + time * 0.75 + i * 0.28) * 36;
          const wave2 = Math.cos(x * 0.0055 - time * 0.45 + i * 0.18) * 20;
          const y = centerY + yOffset + wave1 + wave2 - mouseInfluence;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
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
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}

// ==========================================
// PRESET STARTUP DATASETS FOR CHIPS
// ==========================================
type DatasetKey = "d2c" | "kyc" | "edtech";

interface PresetData {
  key: DatasetKey;
  label: string;
  badge: string;
  url: string;
  churn: number;
  visitors: number;
  aov: number;
  bottleneckName: string;
  codeSnippet: string;
}

const PRESETS: Record<DatasetKey, PresetData> = {
  d2c: {
    key: "d2c",
    label: "🛍️ QuickStyle D2C (-71.7% Drop)",
    badge: "-71.7% Churn",
    url: "quickstyle-d2c.in/checkout",
    churn: 71.7,
    visitors: 100000,
    aov: 1850,
    bottleneckName: "Checkout & Address Wall (Step 4)",
    codeSnippet: `// Auto-generated remediation: Express 1-Tap UPI Component
import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export default function ExpressCheckoutBar({ cartTotal = 1850, onPay }: { cartTotal?: number; onPay?: () => void }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#090D16]/95 backdrop-blur-xl border-t border-purple-500/20 p-4 shadow-2xl flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FREE EXPRESS DELIVERY UNLOCKED</span>
        </div>
        <p className="text-xl font-extrabold text-white">₹{cartTotal.toLocaleString()}</p>
      </div>

      <button 
        onClick={onPay}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 transition active:scale-95"
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>1-Tap UPI Pay</span>
      </button>
    </div>
  );
}`,
  },
  kyc: {
    key: "kyc",
    label: "💳 FinPulse Neo-KYC (-74.8% Drop)",
    badge: "-74.8% Churn",
    url: "finpulse.bank/kyc-agent",
    churn: 74.8,
    visitors: 80000,
    aov: 2400,
    bottleneckName: "Live Agent Video-KYC (Step 4)",
    codeSnippet: `// Auto-generated remediation: Adaptive WebRTC Queue Status
import React from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function VideoKycQueueCard({ queuePosition = 3, waitTimeSeconds = 90 }) {
  return (
    <div className="bg-[#090D16] p-6 rounded-3xl border border-purple-500/20 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
          <Clock className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-extrabold text-white text-sm">Next Banking Officer Ready Shortly</h4>
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
    key: "edtech",
    label: "🎓 PrepMate EdTech (-96.5% Drop)",
    badge: "-96.5% Churn",
    url: "prepmate.in/iit-jee/paywall",
    churn: 96.5,
    visitors: 150000,
    aov: 4999,
    bottleneckName: "Annual Pass Paywall (Step 3)",
    codeSnippet: `// Auto-generated remediation: Flexible Micro-Plan Selector
import React, { useState } from 'react';

export default function FlexiblePlanSelector() {
  const [billing, setBilling] = useState<'monthly' | 'test'>('monthly');

  return (
    <div className="bg-[#090D16] p-6 rounded-3xl border border-purple-500/20 shadow-2xl flex flex-col gap-4">
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5">
        <button 
          onClick={() => setBilling('monthly')} 
          className={\`flex-1 py-2 rounded-xl text-xs font-bold \${billing === 'monthly' ? 'bg-purple-600 text-white' : 'text-slate-400'}\`}
        >
          Monthly Pass (₹399/mo)
        </button>
        <button 
          onClick={() => setBilling('test')} 
          className={\`flex-1 py-2 rounded-xl text-xs font-bold \${billing === 'test' ? 'bg-purple-600 text-white' : 'text-slate-400'}\`}
        >
          Unlock 1 Test (₹99)
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
        <p className="text-xs text-purple-300 font-bold">Includes Video Solutions + AIR Rank Benchmark</p>
      </div>

      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg">
        Unlock Now via UPI
      </button>
    </div>
  );
}`,
  },
};

export default function FunnelDoctorApp() {
  // Navigation & View Mode: "website" (Mode A) or "workspace" (Mode B)
  const [viewMode, setViewMode] = useState<"website" | "workspace">("website");
  const [activeTab, setActiveTab] = useState<"telemetry" | "vision" | "sql" | "prd" | "warroom">("telemetry");

  // Pitch Script Modal
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Starter dataset & URL audit state
  const [selectedDataset, setSelectedDataset] = useState<DatasetKey>("d2c");
  const [urlInput, setUrlInput] = useState<string>("quickstyle-d2c.in/checkout");

  // Before / After comparison toggle
  const [comparisonMode, setComparisonMode] = useState<"visual" | "code">("visual");
  const [copiedCode, setCopiedCode] = useState(false);

  // Financial Model Sliders
  const [calcVisitors, setCalcVisitors] = useState<number>(100000);
  const [calcDropRate, setCalcDropRate] = useState<number>(71.7);
  const [calcAov, setCalcAov] = useState<number>(1850);

  // Hotspot pin selection in Vision X-Ray
  const [selectedPin, setSelectedPin] = useState<number>(1);

  // SQL Lab query execution state
  const [runningQuery, setRunningQuery] = useState(false);
  const [queryExecuted, setQueryExecuted] = useState(true);

  // Voice War Room Simulation
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>(
    "Gemini 2.5 Live: Detected severe drop-off on Android 13/14 checkout. Virtual keyboard is occluding the UPI Intent button by 240px. Recommend mounting sticky 1-tap UPI bar above keyboard fold."
  );

  // Handle starter chip click
  const handleSelectChip = (key: DatasetKey) => {
    setSelectedDataset(key);
    const data = PRESETS[key];
    setUrlInput(data.url);
    setCalcVisitors(data.visitors);
    setCalcDropRate(data.churn);
    setCalcAov(data.aov);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2400);
  };

  const handleCopyPitch = () => {
    const pitch = `Startup Buildathon India 2026 - FunnelDoctor AI Pitch:
Indian startups lose over ₹32,000 Crores every year in checkout funnel drop-offs.
Traditional tools like GA4 or Mixpanel tell founders WHERE users dropped off, but NEVER why.
FunnelDoctor AI is the first autonomous multimodal RCA agent:
1. It queries Cloud SQL telemetry to pinpoint exact latency and friction drop-offs.
2. Gemini 2.5 Vision inspects mobile UI screenshots and flags Nielsen heuristic violations.
3. In under 60 seconds, it writes the executive PRD and copy-paste React code to recover +22% conversion.`;
    navigator.clipboard.writeText(pitch);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2400);
  };

  // Financial Model Math
  const calculatedLeaked = Math.round(calcVisitors * (calcDropRate / 100) * calcAov);
  const calculatedRecoverable = Math.round(calculatedLeaked * 0.22);
  const calculatedAnnualCrores = (calculatedRecoverable * 12) / 10000000;

  const currentPreset = PRESETS[selectedDataset];

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden selection:bg-purple-500/30 font-sans relative">
      {/* ========================================================================= */}
      {/* 1. TOP MINIMALIST ROYAL PURPLE HEADER (MATCHING IMAGE 4 EXACTLY)          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#29074b] via-[#380761] to-[#20043c] border-b border-purple-500/25 shadow-2xl backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Left Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-purple-700 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  FunnelDoctor<span className="text-purple-300">.ai</span>
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/40 text-[10px] font-mono font-bold text-purple-200 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>GEMINI 2.5 ACTIVE</span>
                </div>
              </div>
              <p className="text-[11px] text-purple-200/70 font-medium tracking-tight">
                Autonomous Multimodal Conversion & RCA Agent
              </p>
            </div>
          </div>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-purple-200/80">
            <button
              onClick={() => {
                setViewMode("workspace");
                setActiveTab("telemetry");
              }}
              className="hover:text-white transition"
            >
              Telemetry
            </button>
            <button
              onClick={() => {
                setViewMode("workspace");
                setActiveTab("vision");
              }}
              className="hover:text-white transition"
            >
              Vision X-Ray
            </button>
            <button
              onClick={() => {
                setViewMode("workspace");
                setActiveTab("sql");
              }}
              className="hover:text-white transition"
            >
              SQL Lab
            </button>
            <button
              onClick={() => {
                setViewMode("workspace");
                setActiveTab("prd");
              }}
              className="hover:text-white transition"
            >
              PRD Studio
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Mode Switcher Pill */}
            <div className="bg-purple-950/70 p-1 rounded-full border border-purple-500/30 flex items-center shadow-inner">
              <button
                onClick={() => setViewMode("website")}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  viewMode === "website"
                    ? "bg-white text-slate-950 shadow-md"
                    : "text-purple-200 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Website</span>
              </button>
              <button
                onClick={() => setViewMode("workspace")}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  viewMode === "workspace"
                    ? "bg-white text-slate-950 shadow-md"
                    : "text-purple-200 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Workspace</span>
              </button>
            </div>

            {/* Pitch Script Button */}
            <button
              onClick={() => setIsPitchModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-400/30 bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 hover:text-white text-xs font-semibold transition"
            >
              <Mic className="w-3.5 h-3.5 text-purple-300" />
              <span>Pitch Script</span>
            </button>

            {/* Launch Workspace Primary Button */}
            <button
              onClick={() => {
                setViewMode("workspace");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 px-4 py-2 rounded-full font-bold text-xs shadow-lg shadow-purple-950/40 transition active:scale-95 whitespace-nowrap"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MODE A: HIGH-END REMOTE.COM STYLE MARKETING LANDING PAGE               */}
      {/* ========================================================================= */}
      {viewMode === "website" ? (
        <main className="relative z-10">
          {/* A. REMOTE.COM INSPIRED VIBRANT PURPLE HERO SECTION */}
          <section className="relative pt-20 pb-24 px-6 max-w-6xl mx-auto text-center flex flex-col items-center overflow-hidden">
            {/* Interactive Kinetic Sine Wave Background */}
            <WaveMeshBackground />

            {/* Radiant Remote.com style electric purple to cyan ambient mesh aura */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />

            {/* Hackathon Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-400/30 mb-8 backdrop-blur-md shadow-inner"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-purple-200 tracking-wide">
                Startup Buildathon India 2026 • Powered by Google DeepMind & Cloud
              </span>
            </motion.div>

            {/* Bold Display Headline (Remote.com aesthetic) */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 leading-[1.05] text-white max-w-4xl"
            >
              Your checkout funnel is <br />
              <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                leaking revenue.
              </span>
              <br />
              Our multimodal AI writes the fix in 60s.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-purple-100/70 max-w-2xl font-normal leading-relaxed mb-10"
            >
              Traditional analytics tools like GA4 and Mixpanel show where users leave. FunnelDoctor AI fuses Cloud SQL Telemetry with Gemini 2.5 Vision UI X-Rays to diagnose why, author an engineering PRD, and output ready-to-ship React code.
            </motion.p>

            {/* Floating URL Input Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-2xl relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-2xl blur-md opacity-35 group-hover:opacity-70 transition duration-500" />
              <div className="relative flex items-center bg-[#090D16]/95 border border-purple-400/30 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                <div className="pl-4 pr-1 text-purple-300/50 font-mono text-xs">https://</div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="your-startup.com/checkout"
                  className="w-full bg-transparent text-white focus:outline-none font-mono text-xs sm:text-sm placeholder:text-purple-300/30"
                />
                <button
                  onClick={() => {
                    setViewMode("workspace");
                    setActiveTab("vision");
                  }}
                  className="flex items-center gap-2 bg-white text-slate-950 px-5 sm:px-6 py-3 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all shadow-md shrink-0 active:scale-95"
                >
                  <span>Run AI Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* 3 Interactive Starter Demo Chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs"
            >
              <span className="text-[11px] font-semibold text-purple-200/50 mr-1">Instant Demos:</span>
              {(["d2c", "kyc", "edtech"] as DatasetKey[]).map((key) => {
                const chip = PRESETS[key];
                const isSelected = selectedDataset === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectChip(key)}
                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-purple-600/40 border-purple-400 text-white shadow-lg shadow-purple-600/30 scale-105"
                        : "bg-white/[0.04] border-white/10 text-purple-200/70 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </section>

          {/* B. SECTION 2: INTERACTIVE BEFORE-VS-AFTER UI COMPARATOR */}
          <section id="comparator" className="py-20 px-6 max-w-7xl mx-auto border-t border-purple-500/15">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MULTIMODAL REMEDIATION STUDIO</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                  Before & After UI Diagnostics
                </h2>
                <p className="text-purple-200/60 text-sm sm:text-base mt-2 max-w-xl">
                  Gemini Vision inspects mobile viewport screenshots, isolates Nielsen UX heuristic violations, and writes production-ready React code.
                </p>
              </div>

              {/* Toggle: Visual Comparison vs Code Diff */}
              <div className="bg-[#090D16] p-1.5 rounded-2xl border border-purple-500/20 flex items-center gap-1.5 self-start md:self-auto shadow-inner">
                <button
                  onClick={() => setComparisonMode("visual")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    comparisonMode === "visual"
                      ? "bg-white text-slate-950 shadow-md"
                      : "text-purple-200/60 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Visual Comparison</span>
                </button>
                <button
                  onClick={() => setComparisonMode("code")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    comparisonMode === "code"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-purple-200/60 hover:text-white"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Production React Code</span>
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {comparisonMode === "visual" ? (
                <motion.div
                  key="visual"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
                >
                  {/* LEFT WINDOW: THE BROKEN SCREEN */}
                  <div className="relative rounded-3xl bg-[#090D16]/90 border border-rose-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/10 rounded-full blur-[90px] pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                          <span className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider">
                            Current Broken UI ({currentPreset.bottleneckName})
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/25 font-bold">
                          {currentPreset.badge}
                        </span>
                      </div>

                      {/* Mobile Card Mockup with 3 Red Indicator Tags */}
                      <div className="bg-[#030712] rounded-2xl border border-white/[0.08] p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs text-white/50 pb-2 border-b border-white/[0.06]">
                          <span>Viewport: 390 x 844 (Mobile)</span>
                          <span className="text-rose-400 font-mono">3 Critical Flaws</span>
                        </div>

                        {/* Flaw 1 */}
                        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                          <div className="w-6 h-6 rounded-lg bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </div>
                          <div>
                            <p className="text-xs font-bold text-rose-200">Forced Email OTP Wall</p>
                            <p className="text-[11px] text-white/50 mt-0.5">
                              Mandatory 6-field registration modal blocks bag review without a guest checkout option (Nielsen #3).
                            </p>
                          </div>
                        </div>

                        {/* Flaw 2 */}
                        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                          <div className="w-6 h-6 rounded-lg bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </div>
                          <div>
                            <p className="text-xs font-bold text-rose-200">Surprise ₹149 Shipping Surcharge</p>
                            <p className="text-[11px] text-white/50 mt-0.5">
                              Dynamic delivery fee added only after pin-code entry causes instant price shock and checkout abandonment.
                            </p>
                          </div>
                        </div>

                        {/* Flaw 3 */}
                        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                          <div className="w-6 h-6 rounded-lg bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            3
                          </div>
                          <div>
                            <p className="text-xs font-bold text-rose-200">UPI CTA Pushed Below Keyboard Fold</p>
                            <p className="text-[11px] text-white/50 mt-0.5">
                              When virtual keyboard appears on Android 13/14, the primary 'Pay' button is pushed 240px below screen viewport.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-mono flex items-center justify-between">
                      <span>Outcome: Severe drop-off & customer abandonment</span>
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                    </div>
                  </div>

                  {/* RIGHT WINDOW: GEMINI AUTO-REMEDIATION */}
                  <div className="relative rounded-3xl bg-[#090D16]/90 border border-emerald-500/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-bold text-emerald-300 font-mono uppercase tracking-wider">
                            Gemini Auto-Remediation (Production Ready)
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 font-extrabold flex items-center gap-1.5 shadow-sm">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+38% Projected Conversion</span>
                        </span>
                      </div>

                      {/* Remediation Component Preview */}
                      <div className="bg-[#030712] rounded-2xl border border-white/[0.08] p-5 flex flex-col gap-4">
                        {/* Upfront Free Delivery Progress Bar */}
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="flex items-center justify-between text-xs font-semibold text-emerald-300 mb-1.5">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>Free Express Delivery Unlocked!</span>
                            </span>
                            <span className="font-mono text-[11px]">₹1,850 / ₹1,500</span>
                          </div>
                          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full w-full" />
                          </div>
                        </div>

                        {/* 1-Tap Guest OTP Flow */}
                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-white">1-Click WhatsApp / SMS Guest Checkout</p>
                            <p className="text-[11px] text-white/50">Auto-fills saved delivery address & live tracking</p>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Active
                          </span>
                        </div>

                        {/* Sticky 1-Tap UPI Express Bar (Above Keyboard) */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-purple-500/15 border border-emerald-500/30 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                              Locked Above Keyboard
                            </span>
                            <p className="text-base font-extrabold text-white">₹{formatNumber(currentPreset.aov)}</p>
                          </div>

                          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 hover:scale-[1.02] transition active:scale-95">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>1-Tap UPI Pay</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono flex items-center justify-between">
                      <span>Ready-to-deploy React component</span>
                      <button
                        onClick={() => setComparisonMode("code")}
                        className="underline font-bold text-emerald-200 hover:text-white"
                      >
                        View Code Diff ➔
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl bg-[#090D16] border border-purple-500/20 p-6 sm:p-8 shadow-2xl relative"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-purple-300">
                      <Code2 className="w-4 h-4" />
                      <span>Auto-Remediated Production Component ({currentPreset.key}.tsx)</span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(currentPreset.codeSnippet)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-md hover:bg-slate-200 transition active:scale-95"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copied to Clipboard!" : "Copy React Component"}</span>
                    </button>
                  </div>

                  <div className="bg-[#030712] p-5 rounded-2xl border border-white/[0.08] font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                    <pre className="text-slate-200 whitespace-pre-wrap">{currentPreset.codeSnippet}</pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* C. SECTION 3: VISUAL FUNNEL FLOW & FINANCIAL CALCULATOR */}
          <section id="pipeline" className="py-20 px-6 max-w-7xl mx-auto border-t border-purple-500/15">
            {/* 4-Step Waterfall Pipeline */}
            <div className="mb-20">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-purple-400">
                  Telemetry Funnel Waterfall
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
                  Pinpoint Where Cash Is Leaking
                </h2>
                <p className="text-purple-200/60 text-sm mt-2">
                  FunnelDoctor maps raw Cloud SQL clickstream rows into an end-to-end drop-off pipeline.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className="p-6 rounded-2xl bg-[#090D16]/90 border border-purple-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-white/40 uppercase">Stage 01</span>
                    <h4 className="text-base font-extrabold text-white mt-1">Catalog & Search</h4>
                    <p className="text-2xl font-black text-white mt-3" suppressHydrationWarning>
                      {formatNumber(calcVisitors)}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">100% Initial Sessions</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-emerald-400 font-mono">
                    <span>Healthy</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-2xl bg-[#090D16]/90 border border-purple-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-white/40 uppercase">Stage 02</span>
                    <h4 className="text-base font-extrabold text-white mt-1">Product Details</h4>
                    <p className="text-2xl font-black text-white mt-3" suppressHydrationWarning>
                      {formatNumber(Math.round(calcVisitors * 0.42))}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">42.0% Conversion</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50 font-mono">
                    <span>PDP Views</span>
                    <span>42.0%</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-2xl bg-[#090D16]/90 border border-purple-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-white/40 uppercase">Stage 03</span>
                    <h4 className="text-base font-extrabold text-white mt-1">Add to Bag Drawer</h4>
                    <p className="text-2xl font-black text-white mt-3" suppressHydrationWarning>
                      {formatNumber(Math.round(calcVisitors * 0.18))}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">18.0% of Initial</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50 font-mono">
                    <span>Cart Items</span>
                    <span>18.0%</span>
                  </div>
                </div>

                {/* Step 4: Bleeding Bottleneck */}
                <div className="p-6 rounded-2xl bg-[#090D16] border border-rose-500/50 shadow-xl shadow-rose-500/10 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/15 rounded-full blur-2xl" />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">Stage 04</span>
                      <span className="text-[10px] font-mono font-black text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
                        -{calcDropRate}%
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-rose-300 mt-1">Checkout & Address Wall</h4>
                    <p className="text-2xl font-black text-rose-400 mt-3" suppressHydrationWarning>
                      {formatNumber(Math.round(calcVisitors * 0.051 * (1 - calcDropRate / 100)))}
                    </p>
                    <p className="text-xs text-rose-300/60 mt-0.5">Severe Revenue Leak</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-rose-500/20 flex items-center justify-between text-xs text-rose-400 font-mono font-bold">
                    <span>ACUTE BOTTLENECK</span>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Financial Calculator with 3 Glowing Sliders */}
            <div id="calculator" className="max-w-4xl mx-auto">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Interactive ROI Engine
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
                  Calculate Leaked Revenue & Recovery
                </h3>
                <p className="text-purple-200/60 text-xs sm:text-sm mt-1.5">
                  Drag the glowing sliders to model your startup’s funnel metrics in real-time.
                </p>
              </div>

              <div className="rounded-3xl bg-[#090D16]/95 border border-purple-500/25 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Sliders Column */}
                  <div className="flex flex-col gap-6">
                    {/* Slider 1: Monthly Visitors */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-white/80 mb-2">
                        <span>Monthly Funnel Visitors</span>
                        <span className="text-purple-300 font-mono font-bold" suppressHydrationWarning>
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
                        className="w-full accent-purple-500 bg-slate-900 rounded-lg cursor-pointer h-2"
                      />
                      <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
                        <span>10k</span>
                        <span>500k</span>
                      </div>
                    </div>

                    {/* Slider 2: Bottleneck Drop-off % */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-white/80 mb-2">
                        <span>Worst Step Drop-off %</span>
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
                      <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
                        <span>20% (Healthy)</span>
                        <span>95% (Critical)</span>
                      </div>
                    </div>

                    {/* Slider 3: Average Order Value (AOV) */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-white/80 mb-2">
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
                      <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
                        <span>₹200</span>
                        <span>₹10,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Output Card */}
                  <div className="bg-[#030712] p-8 rounded-2xl border border-white/[0.08] flex flex-col justify-between shadow-2xl text-center">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 font-bold">
                        Monthly Revenue Leaking
                      </span>
                      <p className="text-3xl sm:text-4xl font-extrabold text-rose-400 mt-2" suppressHydrationWarning>
                        ₹{(calculatedLeaked / 100000).toFixed(1)} Lakhs
                        <span className="text-xs font-normal text-white/40"> / month</span>
                      </p>
                    </div>

                    <div className="my-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                      <span className="text-[10px] uppercase font-mono font-extrabold text-emerald-300 tracking-wider">
                        Recoverable Lift (+22% Lift)
                      </span>
                      <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1" suppressHydrationWarning>
                        +₹{(calculatedRecoverable / 100000).toFixed(1)} Lakhs/mo
                      </p>
                      <p className="text-[11px] text-white/50 font-mono mt-1" suppressHydrationWarning>
                        (~₹{calculatedAnnualCrores.toFixed(2)} Crores Annual ARR)
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setViewMode("workspace");
                        setActiveTab("prd");
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Deploy AI Remediation In Workspace ➔</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* D. SECTION 4: ASYMMETRIC BENTO GRID */}
          <section id="bento" className="py-24 px-6 max-w-7xl mx-auto border-t border-purple-500/15">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-purple-400">
                Autonomous Stack
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
                Three Layers of DeepMind Intelligence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bento Box 1: Multimodal Vision */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-purple-500/20 p-10 hover:bg-white/[0.04] transition-colors group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-all" />
                <ScanEye className="w-10 h-10 text-purple-400 mb-6" />
                <h3 className="text-3xl font-semibold tracking-tight mb-4">Multimodal Vision X-Ray</h3>
                <p className="text-purple-200/60 text-lg max-w-md">
                  Gemini 2.5 scans your mobile UI screenshots, identifying hidden fees, keyboard occlusions, and CTA layout flaws instantly.
                </p>
                <div className="mt-8 border border-white/10 rounded-xl bg-black/50 p-4 backdrop-blur-md w-full max-w-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-rose-400 font-mono">🚨 Friction Detected</span>
                    <span className="text-xs text-white/30">Heuristic #4</span>
                  </div>
                  <p className="text-sm text-white/80">
                    "Apply Coupon" accordion pushes the primary checkout button below the fold on 6.1" displays.
                  </p>
                </div>
              </motion.div>

              {/* Bento Box 2: Autonomous SQL Lab */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-purple-500/20 p-10 flex flex-col justify-between hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <BarChart3 className="w-10 h-10 text-indigo-400 mb-6" />
                  <h3 className="text-2xl font-semibold tracking-tight mb-4">Autonomous SQL Lab</h3>
                  <p className="text-purple-200/60 text-sm">
                    Our agents write and execute segmented BigQuery SQL to prove if a drop-off is UI-driven or API latency-driven.
                  </p>
                </div>
                <div className="mt-8 font-mono text-xs text-indigo-300/70 bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed">
                  SELECT device_os, <br />
                  AVG(api_latency) as ms <br />
                  FROM telemetry <br />
                  WHERE step = 'checkout'
                </div>
              </motion.div>

              {/* Bento Box 3: Ready-to-Ship React Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="md:col-span-3 relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-white/[0.02] to-purple-500/[0.02] border border-purple-500/20 p-10 flex flex-col md:flex-row items-center gap-12"
              >
                <div className="flex-1">
                  <Code2 className="w-10 h-10 text-emerald-400 mb-6" />
                  <h3 className="text-3xl font-semibold tracking-tight mb-4">Ready-to-Ship React Code</h3>
                  <p className="text-purple-200/60 text-lg">
                    We don't just diagnose the problem. Gemini Code Gen outputs a RICE-prioritized PRD alongside the copy-paste React + Tailwind components to fix it.
                  </p>
                </div>
                <div className="flex-1 w-full h-48 bg-[#0A0A0A] rounded-2xl border border-white/10 p-6 flex flex-col justify-center relative group overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <div className="relative font-mono text-sm text-emerald-400/80">
                    <span className="text-white/30">{"// Auto-generated fix"}</span>
                    <br />
                    export default function ExpressCheckout() {"{"}
                    <br />
                    &nbsp;&nbsp;return (
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{"<UpiIntentButton />"}
                    <br />
                    &nbsp;&nbsp;);
                    <br />
                    {"}"}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-purple-500/15 px-6 py-12 text-center text-xs text-purple-200/40 bg-[#030712]">
            FunnelDoctor AI &copy; 2026 &bull; Startup Buildathon India 2026 &bull; Powered by Google DeepMind & Google Cloud
          </footer>
        </main>
      ) : (
        /* ========================================================================= */
        /* 3. MODE B: APP COMMAND CENTER WORKSPACE (5 INTERACTIVE DIAGNOSTIC TABS)   */
        /* ========================================================================= */
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Workspace Sub-Header & Diagnostic Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-500/20 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
                  Live Diagnostic Session Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Workspace Command Center: <span className="text-purple-300">{currentPreset.url}</span>
              </h1>
            </div>

            {/* 5 Tab Switchers */}
            <div className="flex flex-wrap items-center bg-[#090D16] p-1.5 rounded-2xl border border-purple-500/25 gap-1 shadow-inner">
              <button
                onClick={() => setActiveTab("telemetry")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "telemetry" ? "bg-purple-600 text-white shadow-md" : "text-purple-200/60 hover:text-white"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Telemetry</span>
              </button>
              <button
                onClick={() => setActiveTab("vision")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "vision" ? "bg-purple-600 text-white shadow-md" : "text-purple-200/60 hover:text-white"
                }`}
              >
                <ScanEye className="w-3.5 h-3.5" />
                <span>Vision X-Ray</span>
              </button>
              <button
                onClick={() => setActiveTab("sql")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "sql" ? "bg-purple-600 text-white shadow-md" : "text-purple-200/60 hover:text-white"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>SQL Lab</span>
              </button>
              <button
                onClick={() => setActiveTab("prd")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "prd" ? "bg-purple-600 text-white shadow-md" : "text-purple-200/60 hover:text-white"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>PRD Studio</span>
              </button>
              <button
                onClick={() => setActiveTab("warroom")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "warroom" ? "bg-emerald-600 text-white shadow-md" : "text-purple-200/60 hover:text-white"
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Live War Room</span>
              </button>
            </div>
          </div>

          {/* TAB 1: FUNNEL TELEMETRY */}
          {activeTab === "telemetry" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#090D16] border border-purple-500/20">
                  <span className="text-[11px] text-white/40 font-mono uppercase">Funnel Ingestion</span>
                  <p className="text-2xl font-black text-white mt-1">100,000</p>
                  <span className="text-xs text-emerald-400 font-mono">+14.2% DoD</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#090D16] border border-purple-500/20">
                  <span className="text-[11px] text-white/40 font-mono uppercase">Step 4 Churn Rate</span>
                  <p className="text-2xl font-black text-rose-400 mt-1">71.7%</p>
                  <span className="text-xs text-rose-400 font-mono">Critical Bottleneck</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#090D16] border border-purple-500/20">
                  <span className="text-[11px] text-white/40 font-mono uppercase">Estimated Revenue Lost</span>
                  <p className="text-2xl font-black text-rose-400 mt-1">₹1.32 Cr</p>
                  <span className="text-xs text-white/40 font-mono">This Month</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#090D16] border border-purple-500/20">
                  <span className="text-[11px] text-white/40 font-mono uppercase">Recoverable Uplift</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">+₹29.1 Lakhs</p>
                  <span className="text-xs text-emerald-400 font-mono">Via 1-Tap Express Pay</span>
                </div>
              </div>

              {/* Telemetry Stage Breakdown */}
              <div className="p-6 rounded-3xl bg-[#090D16] border border-purple-500/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                  <span>Detailed Funnel Stage Telemetry</span>
                  <span className="text-xs font-mono text-purple-300">Cloud SQL Clickstream Streamed</span>
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Stage 1: Catalog & Search</p>
                      <p className="text-white/40 text-[11px]">Session Start & Keyword Queries</p>
                    </div>
                    <span className="text-emerald-400 font-bold">100% Inflow (100,000)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Stage 2: Product Detail Page (PDP)</p>
                      <p className="text-white/40 text-[11px]">Size Selector & Variant Clicks</p>
                    </div>
                    <span className="text-emerald-400 font-bold">42.0% (42,000)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Stage 3: Cart / Bag Review</p>
                      <p className="text-white/40 text-[11px]">Cart Drawer Slide-in</p>
                    </div>
                    <span className="text-emerald-400 font-bold">18.0% (18,000)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-rose-300">Stage 4: Checkout Wall & Address Form</p>
                      <p className="text-rose-300/60 text-[11px]">71.7% of shoppers abandon here!</p>
                    </div>
                    <span className="text-rose-400 font-bold">5.1% Reached UPI (Only 1,443)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISION UX X-RAY */}
          {activeTab === "vision" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Interactive Mobile Screen with Glowing Hotspots */}
              <div className="p-6 rounded-3xl bg-[#090D16] border border-purple-500/25 relative flex flex-col items-center">
                <span className="text-xs font-mono text-purple-300 mb-4 block text-center">
                  Click hotspot pins (1, 2, 3) to inspect Gemini Vision X-Ray violations:
                </span>

                <div className="relative w-[300px] h-[580px] bg-slate-950 rounded-[2.5rem] border-4 border-slate-800 p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
                  <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

                  {/* Hotspot 1 */}
                  <button
                    onClick={() => setSelectedPin(1)}
                    className={`absolute top-24 left-8 w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition shadow-lg ${
                      selectedPin === 1
                        ? "bg-rose-500 text-white scale-125 ring-4 ring-rose-500/40 animate-pulse"
                        : "bg-rose-600/80 text-white hover:scale-110"
                    }`}
                  >
                    1
                  </button>

                  {/* Hotspot 2 */}
                  <button
                    onClick={() => setSelectedPin(2)}
                    className={`absolute top-64 right-8 w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition shadow-lg ${
                      selectedPin === 2
                        ? "bg-rose-500 text-white scale-125 ring-4 ring-rose-500/40 animate-pulse"
                        : "bg-rose-600/80 text-white hover:scale-110"
                    }`}
                  >
                    2
                  </button>

                  {/* Hotspot 3 */}
                  <button
                    onClick={() => setSelectedPin(3)}
                    className={`absolute bottom-20 left-12 w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition shadow-lg ${
                      selectedPin === 3
                        ? "bg-rose-500 text-white scale-125 ring-4 ring-rose-500/40 animate-pulse"
                        : "bg-rose-600/80 text-white hover:scale-110"
                    }`}
                  >
                    3
                  </button>

                  <div className="space-y-4 text-center mt-12">
                    <div className="p-3 bg-slate-900 rounded-xl text-left border border-white/5">
                      <p className="text-[10px] text-white/50">Simulated Screen: Step 4 Wall</p>
                      <p className="text-xs text-white font-bold mt-1">QuickStyle Order Bag #9401</p>
                    </div>

                    <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-left">
                      <p className="text-xs text-rose-300 font-bold">Mandatory Sign-Up Wall</p>
                      <p className="text-[10px] text-white/40 mt-1">OTP input blocking checkout</p>
                    </div>
                  </div>

                  <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-4" />
                </div>
              </div>

              {/* Pin Detail Inspector */}
              <div className="p-8 rounded-3xl bg-[#090D16] border border-purple-500/25 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-bold mb-4">
                    <ScanEye className="w-3.5 h-3.5" />
                    <span>GEMINI 2.5 VISION X-RAY ANALYSIS</span>
                  </div>

                  {selectedPin === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">Hotspot #1: Forced Email OTP Registration</h3>
                      <p className="text-xs text-rose-400 font-mono">VIOLATION: Nielsen Heuristic #3 (User Control & Freedom)</p>
                      <p className="text-sm text-white/70 leading-relaxed">
                        The current UI presents a mandatory 6-field registration modal before allowing the user to view final pricing or select delivery options. No guest checkout or 1-tap WhatsApp authentication is offered.
                      </p>
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                        <p className="font-bold">AI Recommended Remediation:</p>
                        <p className="mt-1 text-white/70">
                          Swap registration wall for 1-Click WhatsApp / SMS Guest Checkout with deferred profile creation post-payment.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPin === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">Hotspot #2: Surprise ₹149 Shipping Surcharge</h3>
                      <p className="text-xs text-rose-400 font-mono">VIOLATION: Nielsen Heuristic #2 (Match between System & Real World)</p>
                      <p className="text-sm text-white/70 leading-relaxed">
                        A dynamic shipping fee is injected into the order total only after pincode validation, creating instant sticker shock and 42.4% immediate bounce.
                      </p>
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                        <p className="font-bold">AI Recommended Remediation:</p>
                        <p className="mt-1 text-white/70">
                          Implement an upfront "Add ₹150 for Free Delivery" gamified progress meter right on the cart drawer.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPin === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">Hotspot #3: UPI CTA Pushed Below Virtual Keyboard</h3>
                      <p className="text-xs text-rose-400 font-mono">VIOLATION: Nielsen Heuristic #7 (Flexibility & Efficiency of Use)</p>
                      <p className="text-sm text-white/70 leading-relaxed">
                        On Android 13 and 14 viewports, the soft keyboard pushes the primary 'Pay via UPI' CTA 240px off-screen, leading to user drop-offs when trying to dismiss the keyboard.
                      </p>
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                        <p className="font-bold">AI Recommended Remediation:</p>
                        <p className="mt-1 text-white/70">
                          Lock a sticky 1-Tap UPI Express pay bar above the software keyboard using viewport resize event listeners.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab("prd")}
                  className="mt-8 py-3 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Generate PRD & React Code Fix ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SQL LAB */}
          {activeTab === "sql" && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#090D16] border border-purple-500/25">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-purple-300">
                    <Terminal className="w-4 h-4" />
                    <span>Cloud SQL Clickstream Console</span>
                  </div>

                  <button
                    onClick={() => {
                      setRunningQuery(true);
                      setTimeout(() => setRunningQuery(false), 900);
                    }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${runningQuery ? "animate-spin" : ""}`} />
                    <span>{runningQuery ? "Executing Query..." : "Run SQL Query"}</span>
                  </button>
                </div>

                <div className="bg-[#030712] p-4 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto">
                  <p className="text-white/40">-- Segmented drop-off correlation by device OS and checkout step</p>
                  <p className="text-purple-300">SELECT</p>
                  <p className="pl-4">device_os, funnel_step, COUNT(session_id) as visitors,</p>
                  <p className="pl-4">ROUND(AVG(api_latency_ms), 1) as avg_latency,</p>
                  <p className="pl-4">ROUND(SUM(abandoned_flag)/COUNT(*)*100, 1) as drop_percent</p>
                  <p className="text-purple-300">FROM</p>
                  <p className="pl-4">`analytics_warehouse.checkout_sessions`</p>
                  <p className="text-purple-300">WHERE</p>
                  <p className="pl-4">event_date &gt;= CURRENT_DATE() - 7</p>
                  <p className="text-purple-300">GROUP BY 1, 2 ORDER BY drop_percent DESC;</p>
                </div>

                {/* Query Results Table */}
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50">
                        <th className="py-2.5 px-3">device_os</th>
                        <th className="py-2.5 px-3">funnel_step</th>
                        <th className="py-2.5 px-3">visitors</th>
                        <th className="py-2.5 px-3">avg_latency</th>
                        <th className="py-2.5 px-3">drop_percent</th>
                        <th className="py-2.5 px-3">verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="bg-rose-500/10 text-rose-300">
                        <td className="py-3 px-3 font-bold">Android 14</td>
                        <td className="py-3 px-3">step_4_checkout</td>
                        <td className="py-3 px-3">48,200</td>
                        <td className="py-3 px-3">412ms</td>
                        <td className="py-3 px-3 font-extrabold">71.7%</td>
                        <td className="py-3 px-3">UI Occlusion Flaw</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 text-white">iOS 18</td>
                        <td className="py-3 px-3 text-white/70">step_4_checkout</td>
                        <td className="py-3 px-3 text-white/70">31,500</td>
                        <td className="py-3 px-3 text-white/70">210ms</td>
                        <td className="py-3 px-3 text-amber-400">44.1%</td>
                        <td className="py-3 px-3 text-white/50">OTP Friction</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 text-white">Desktop Chrome</td>
                        <td className="py-3 px-3 text-white/70">step_4_checkout</td>
                        <td className="py-3 px-3 text-white/70">20,300</td>
                        <td className="py-3 px-3 text-white/70">185ms</td>
                        <td className="py-3 px-3 text-emerald-400">22.8%</td>
                        <td className="py-3 px-3 text-emerald-400">Normal Baseline</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRD STUDIO */}
          {activeTab === "prd" && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#090D16] border border-purple-500/25">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                      Gemini Auto-Generated Engineering PRD
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      PRD-2026-081: 1-Tap UPI Express Checkout & Delivery Meter
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(currentPreset.codeSnippet)}
                      className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow hover:bg-slate-200 transition"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copied" : "Copy React Code"}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-sm text-white/80 leading-relaxed font-sans">
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <h4 className="font-bold text-purple-200 text-xs uppercase font-mono">1. Problem Summary</h4>
                    <p className="mt-1 text-xs text-white/80">
                      71.7% of QuickStyle shoppers drop out at Step 4 due to forced email registration, surprise shipping fees, and keyboard obstruction on Android devices.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <h4 className="font-bold text-purple-200 text-xs uppercase font-mono">2. RICE Prioritization Score</h4>
                    <p className="mt-1 text-xs text-emerald-400 font-mono font-bold">
                      Reach: 100k/mo • Impact: High (3x) • Confidence: 95% • Effort: 1 Sprint = RICE Score: 84 / 100
                    </p>
                  </div>

                  {/* Remediation Code Preview */}
                  <div className="mt-6 bg-[#030712] p-5 rounded-2xl border border-white/10 font-mono text-xs text-emerald-300">
                    <pre className="whitespace-pre-wrap">{currentPreset.codeSnippet}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LIVE AI VOICE WAR ROOM */}
          {activeTab === "warroom" && (
            <div className="p-8 rounded-3xl bg-[#090D16] border border-emerald-500/30 text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>GEMINI 2.5 LIVE AUDIO WAR ROOM</span>
              </div>

              <h2 className="text-3xl font-extrabold text-white">Live Voice Conversion Diagnostic</h2>
              <p className="text-sm text-white/60 max-w-md mx-auto">
                Speak directly with the autonomous agent to discuss root-cause findings and adjust PRD priorities in real-time.
              </p>

              {/* Pulsing Audio Wave Visualizer */}
              <div className="h-24 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-center gap-1.5 px-8">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isVoiceActive
                        ? [12, Math.floor(Math.random() * 50) + 16, 12]
                        : 8,
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.04,
                    }}
                    className={`w-1.5 rounded-full ${
                      isVoiceActive ? "bg-emerald-400" : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              {/* Voice Transcript Card */}
              <div className="p-4 rounded-xl bg-slate-900 text-left border border-white/5 font-mono text-xs text-emerald-300">
                <span className="text-white/40 block text-[10px] mb-1">Live Audio Stream &bull; Low-Latency Multimodal</span>
                <p>{voiceTranscript}</p>
              </div>

              <button
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`px-8 py-3.5 rounded-full font-bold text-xs shadow-xl transition active:scale-95 ${
                  isVoiceActive
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : "bg-emerald-400 hover:bg-emerald-300 text-slate-950"
                }`}
              >
                {isVoiceActive ? "End Voice War Room" : "Start Live Voice War Room"}
              </button>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 4. EXECUTIVE PITCH SCRIPT MODAL (Startup Buildathon India 2026)          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPitchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#090D16] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-lg">Startup Buildathon India 2026 Founder Pitch</h3>
                </div>
                <button
                  onClick={() => setIsPitchModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-6 space-y-4 text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-h-[60vh] overflow-y-auto pr-2">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="font-mono text-[10px] font-bold text-purple-300 uppercase block mb-1">
                    00:00 - The Massive Problem (₹32,000 Cr Leak)
                  </span>
                  <p>
                    "Every day in India, over ₹32,000 Crores of GMV evaporates at Step 4 of the checkout funnel. Traditional tools like GA4 and Mixpanel show founders WHERE users left, but NEVER explain WHY."
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="font-mono text-[10px] font-bold text-purple-300 uppercase block mb-1">
                    00:30 - The Multimodal Breakthrough
                  </span>
                  <p>
                    "FunnelDoctor AI fuses raw Cloud SQL clickstream telemetry with Gemini 2.5 Vision UI X-Rays. It flags hidden shipping fees, OTP walls, and keyboard occlusions on mobile viewports."
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="font-mono text-[10px] font-bold text-emerald-300 uppercase block mb-1">
                    01:00 - Instant Remediation (Ship in 60s)
                  </span>
                  <p>
                    "In under 60 seconds, it writes the executive engineering PRD and the exact copy-paste React + Tailwind components to recover +22% in conversion revenue."
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <button
                  onClick={handleCopyPitch}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? "Pitch Copied!" : "Copy Pitch Script"}</span>
                </button>

                <button
                  onClick={() => setIsPitchModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
