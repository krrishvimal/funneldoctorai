"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ScanEye,
  Code2,
  BarChart3,
  Terminal,
  Activity,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  FileText,
} from "lucide-react";

// Kinetic Topographic Contour Background
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

      const waveCount = 5;
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        // Fine graphite ink lines with subtle opacity
        ctx.strokeStyle = `rgba(15, 23, 42, ${0.08 + i * 0.03})`;

        const baseHeight = canvas.height * 0.38 + i * 36;
        const freq = 0.0015 + i * 0.0002;
        const amp = 30 + i * 15;

        for (let x = 0; x <= canvas.width; x += 12) {
          const dx = x - mouse.x;
          const dist = Math.abs(dx);
          const mouseInfluence = Math.max(0, (200 - dist) / 200) * 20;

          const y =
            baseHeight +
            Math.sin(x * freq + t + i * 0.6) * amp +
            Math.cos(x * 0.001 - t * 0.5) * 15 -
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
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  );
}

export default function FunnelDoctorSwiss() {
  const [activeTab, setActiveTab] = useState<"broken" | "fixed" | "code">("broken");
  const [targetUrl, setTargetUrl] = useState("https://quickstyle-d2c.in/checkout");
  const [monthlyVisitors, setMonthlyVisitors] = useState(100000);
  const [dropoffRate, setDropoffRate] = useState(71);
  const [aov, setAov] = useState(1850);

  // Financial calculations
  const leakedRevenueLakhs = ((monthlyVisitors * (dropoffRate / 100) * aov) / 100000).toFixed(1);
  const recoverableLakhs = (Number(leakedRevenueLakhs) * 0.22).toFixed(1);

  const applyPreset = (preset: "d2c" | "kyc" | "edtech") => {
    if (preset === "d2c") {
      setTargetUrl("https://quickstyle-d2c.in/checkout");
      setDropoffRate(71);
      setAov(1850);
      setMonthlyVisitors(100000);
    } else if (preset === "kyc") {
      setTargetUrl("https://finpulse.bank/kyc-agent");
      setDropoffRate(75);
      setAov(2400);
      setMonthlyVisitors(80000);
    } else if (preset === "edtech") {
      setTargetUrl("https://prepmate.in/iit-jee/paywall");
      setDropoffRate(96);
      setAov(4999);
      setMonthlyVisitors(150000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#0A0A0A] font-sans selection:bg-black selection:text-white relative">
      {/* Topographic Background */}
      <SwissTopographicMesh />

      {/* Blueprint Dot Matrix Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 1. Precision Swiss Header */}
      <header className="sticky top-0 z-50 bg-[#F7F7F8]/80 backdrop-blur-md border-b border-[#E5E5E7]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-black flex items-center justify-center font-mono font-bold text-xs bg-white">
              FD
            </div>
            <span className="font-semibold tracking-tight text-sm uppercase">
              FunnelDoctor<span className="text-neutral-400"> / System</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-mono bg-neutral-200/60 rounded text-neutral-600 border border-neutral-300/60">
              SPEC: GEMINI 2.5
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-neutral-500">
            <a href="#audit" className="hover:text-black transition-colors">
              01. Telemetry
            </a>
            <a href="#comparator" className="hover:text-black transition-colors">
              02. Remediation
            </a>
            <a href="#calculator" className="hover:text-black transition-colors">
              03. Impact
            </a>
          </nav>

          <button
            onClick={() => {
              const el = document.getElementById("comparator");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-black text-white hover:bg-neutral-800 transition-colors rounded-none border border-black shadow-sm"
          >
            Launch Workspace [↵]
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* 2. Hero Section: Clinical Diagnostics */}
        <section className="max-w-4xl mx-auto text-center pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-300/80 rounded-full text-[11px] font-mono tracking-tight text-neutral-600 mb-6 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            DIAGNOSTIC TELEMETRY FOR MULTIMODAL CONVERSION FRICTION
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[#0A0A0A] mb-6">
            Diagnose conversion churn. <br />
            <span className="text-neutral-400 font-normal">Synthesize the fix in 60s.</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Autonomous Root-Cause Analysis combining quantitative SQL funnel drop-offs with Gemini Vision spatial screen inspection to output production-ready React code.
          </p>

          {/* Precision Clinical Search Bar */}
          <div className="max-w-2xl mx-auto bg-white border border-neutral-300 p-2 flex flex-col sm:flex-row items-center gap-2 shadow-sm">
            <div className="flex items-center gap-2 px-3 py-2 w-full font-mono text-xs text-neutral-500 border-b sm:border-b-0 sm:border-r border-neutral-200">
              <span className="text-neutral-400">TARGET:</span>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-transparent text-black focus:outline-none font-mono text-xs"
              />
            </div>
            <button
              onClick={() => {
                const el = document.getElementById("comparator");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Run Audit <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 font-mono text-[11px] text-neutral-500">
            <span>PRESETS:</span>
            <button
              onClick={() => applyPreset("d2c")}
              className="px-2 py-0.5 bg-white border border-neutral-200 hover:border-black transition-colors"
            >
              D2C Checkout [-71.7%]
            </button>
            <button
              onClick={() => applyPreset("kyc")}
              className="px-2 py-0.5 bg-white border border-neutral-200 hover:border-black transition-colors"
            >
              Fintech KYC [-74.8%]
            </button>
            <button
              onClick={() => applyPreset("edtech")}
              className="px-2 py-0.5 bg-white border border-neutral-200 hover:border-black transition-colors"
            >
              EdTech Paywall [-96.5%]
            </button>
          </div>
        </section>

        {/* 3. Swiss Bento Grid: Structural Architecture */}
        <section id="audit" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {/* Card 1: Multimodal Spatial X-Ray */}
          <div className="md:col-span-2 bg-white border border-neutral-200 p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <ScanEye className="w-4 h-4 text-black" />
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                    MODULE 01 // SPATIAL VISION INSPECTION
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200">
                  3 FAULTS DETECTED
                </span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight mb-3">Multimodal Viewport X-Ray</h3>
              <p className="text-sm text-neutral-600 max-w-lg mb-6 leading-relaxed">
                Gemini 2.5 scans mobile viewports against live telemetry logs, cross-referencing visual occlusion with rage-clicks and session drop-offs.
              </p>
            </div>

            {/* Visual Inspection Card */}
            <div className="bg-[#F7F7F8] border border-neutral-200 p-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-3">
                <span className="text-neutral-500">VIEWPORT: 390x844 (Mobile)</span>
                <span className="text-rose-600 font-bold">DROP-OFF INDEX: CRITICAL</span>
              </div>
              <div className="space-y-2 text-neutral-700">
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">[!]</span>
                  <span>
                    <strong>Pin 01:</strong> Forced Email OTP modal blocks guest checkout path.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">[!]</span>
                  <span>
                    <strong>Pin 02:</strong> ₹149 delivery fee revealed only at final submit step.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: BigQuery SQL Lab */}
          <div className="bg-white border border-neutral-200 p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-4">
                <BarChart3 className="w-4 h-4 text-black" />
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                  MODULE 02 // SQL LAB
                </span>
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-3">Autonomous Telemetry Verification</h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                Automated BigQuery execution confirming whether abandonment is latency-driven or UX-driven.
              </p>
            </div>

            <div className="bg-[#0A0A0A] text-[#E5E5E7] p-4 font-mono text-[11px] leading-relaxed border border-neutral-900">
              <span className="text-neutral-500">-- Automated Hypothesis Test</span>
              <br />
              <span className="text-amber-400">SELECT</span> device_os, <br />
              &nbsp;&nbsp;<span className="text-emerald-400">COUNT</span>(1) <span className="text-amber-400">AS</span> churn_count
              <br />
              <span className="text-amber-400">FROM</span> `telemetry.checkout_drops`
              <br />
              <span className="text-amber-400">WHERE</span> step = 4<br />
              <span className="text-amber-400">GROUP BY</span> 1;
            </div>
          </div>
        </section>

        {/* 4. Interactive Remediation Comparator */}
        <section id="comparator" className="pt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                MODULE 03 // SPECIFICATION & SYNTHESIS
              </span>
              <h2 className="text-3xl font-semibold tracking-tight mt-1">Autonomous UI Remediation</h2>
            </div>

            {/* Segmented Control Switch */}
            <div className="inline-flex border border-neutral-300 p-0.5 bg-neutral-200/50 font-mono text-xs">
              <button
                onClick={() => setActiveTab("broken")}
                className={`px-3 py-1.5 transition-colors ${
                  activeTab === "broken"
                    ? "bg-white text-black shadow-xs font-bold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Broken Baseline
              </button>
              <button
                onClick={() => setActiveTab("fixed")}
                className={`px-3 py-1.5 transition-colors ${
                  activeTab === "fixed"
                    ? "bg-white text-emerald-700 shadow-xs font-bold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Synthesized Fix [+38%]
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1.5 transition-colors ${
                  activeTab === "code"
                    ? "bg-white text-black shadow-xs font-bold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                React Source
              </button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-8 shadow-xs">
            {activeTab === "broken" && (
              <div className="max-w-md mx-auto border-2 border-dashed border-rose-300 bg-rose-50/20 p-6 font-mono text-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-200 text-rose-800">
                  <span className="font-bold">FAULT LOG: CHECKOUT STEP 4</span>
                  <span>CONV: 2.1%</span>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-white border border-rose-200">
                    <span className="text-neutral-400 block mb-1">MANDATORY STEP</span>
                    <p className="text-neutral-700 font-sans text-sm">Please log in or create an account to finalize shipping.</p>
                  </div>
                  <div className="p-3 bg-white border border-rose-200">
                    <span className="text-neutral-400 block mb-1">UNEXPECTED CHARGE</span>
                    <p className="text-neutral-700 font-sans text-sm">+₹149 Delivery & Convenience Fee added.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "fixed" && (
              <div className="max-w-md mx-auto border-2 border-emerald-500 bg-white p-6 shadow-md">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-100 text-emerald-800 font-mono text-xs">
                  <span className="font-bold">OPTIMIZED: 1-TAP EXPRESS</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">+38% CR LIFT</span>
                </div>
                <div className="space-y-3 font-sans text-sm">
                  <div className="p-3 bg-emerald-50/40 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free shipping threshold unlocked (Cart exceeds ₹999).</span>
                  </div>
                  <button className="w-full py-3 bg-black text-white font-medium text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                    Pay ₹1,850 via Instant UPI [GPay/PhonePe]
                  </button>
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <pre className="bg-[#0A0A0A] text-[#E5E5E7] p-6 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
{`// Synthesized by Gemini Code Agent (Zero-Login UPI Express)
export function ExpressCheckout({ amount, onComplete }) {
  return (
    <div className="border border-neutral-200 p-4 bg-white">
      <FreeShippingProgress threshold={999} current={amount} />
      <UPIIntentButton 
        amount={amount} 
        onSuccess={onComplete}
        fallbackToCard={true} 
      />
    </div>
  );
}`}
              </pre>
            )}
          </div>
        </section>

        {/* 5. Financial Leakage Model */}
        <section id="calculator" className="pt-16">
          <div className="border-t border-neutral-200 pt-10">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              MODULE 04 // FINANCIAL SENSITIVITY
            </span>
            <h2 className="text-3xl font-semibold tracking-tight mt-1 mb-8">Estimated Capital Recovery Model</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white border border-neutral-200 p-8 shadow-xs">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-neutral-500">MONTHLY TRAFFIC:</span>
                    <span className="font-bold" suppressHydrationWarning>
                      {monthlyVisitors.toLocaleString()} Visitors
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="500000"
                    step="10000"
                    value={monthlyVisitors}
                    onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-neutral-500">STEP 4 DROP-OFF RATE:</span>
                    <span className="font-bold text-rose-600" suppressHydrationWarning>
                      {dropoffRate}% Churn
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="1"
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
                    min="500"
                    max="10000"
                    step="250"
                    value={aov}
                    onChange={(e) => setAov(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
              </div>

              {/* Financial Output Column */}
              <div className="border-t md:border-t-0 md:border-l border-neutral-200 md:pl-8 flex flex-col justify-center font-mono">
                <span className="text-xs text-neutral-400 block mb-1">ANNUALIZED CHURN:</span>
                <span
                  className="text-3xl font-bold text-rose-600 mb-6 tracking-tight"
                  suppressHydrationWarning
                >
                  ₹{leakedRevenueLakhs} L<span className="text-sm font-normal text-neutral-500">/mo</span>
                </span>

                <span className="text-xs text-neutral-400 block mb-1">RECOVERABLE VIA 1-TAP SYNTHESIS:</span>
                <span
                  className="text-3xl font-bold text-emerald-600 tracking-tight"
                  suppressHydrationWarning
                >
                  +₹{recoverableLakhs} L<span className="text-sm font-normal text-neutral-500">/mo</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
