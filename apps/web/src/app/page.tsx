"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ScanEye, 
  Terminal, 
  Volume2, 
  Copy, 
  Check, 
  Sparkles,
  Database,
  Layers
} from 'lucide-react';

// ULTRA-SMOOTH BEZIER TOPOGRAPHIC MESH BACKGROUND
function TopographicMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let t = 0;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.006;

      const waveCount = 6;
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.03 + i * 0.012})`;

        const baseHeight = canvas.height * 0.25 + i * 40;
        const freq = 0.0016 + i * 0.00018;
        const amp = 22 + i * 9;

        for (let x = 0; x <= canvas.width; x += 2) {
          const dx = x - mouse.x;
          const dist = Math.sqrt(dx * dx);
          const mouseInfluence = Math.exp(-(dist * dist) / 50000) * 24;

          const y =
            baseHeight +
            Math.sin(x * freq + t + i * 0.5) * amp +
            Math.cos(x * 0.001 - t * 0.5) * 10 -
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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
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

interface FunnelStep {
  step: string;
  users: string;
  pct: number;
  drop?: string;
  critical?: boolean;
}

interface PinItem {
  id: string;
  title: string;
  desc: string;
  metric: string;
}

interface SqlRow {
  os: string;
  latency: string;
  churn: string;
}

interface Dataset {
  label: string;
  url: string;
  visitors: number;
  dropoff: number;
  aov: number;
  lift: string;
  steps: FunnelStep[];
  pins: PinItem[];
  sql: string;
  sqlResults: SqlRow[];
  voiceSummary: string;
}

const PRESET_DATASETS: Record<string, Dataset> = {
  d2c: {
    label: 'D2C Checkout [-71.7%]',
    url: 'https://quickstyle-d2c.in/checkout/step-4',
    visitors: 25000,
    dropoff: 71.7,
    aov: 1850,
    lift: '+38% CR LIFT',
    steps: [
      { step: '01. Product Viewed', users: '1,00,000', pct: 100 },
      { step: '02. Added to Bag', users: '38,400', pct: 38.4 },
      { step: '03. Checkout Initiated', users: '25,000', pct: 65.1 },
      { step: '04. Address & Payment', users: '7,075', pct: 28.3, drop: '-71.7% CHURN', critical: true },
      { step: '05. Order Confirmed', users: '6,580', pct: 93.0 },
    ],
    pins: [
      { id: '01', title: 'Forced Account OTP Modal', desc: 'Blocks guest checkout; 41% exit within 6 seconds of display.', metric: '41.2% Exit' },
      { id: '02', title: 'Late ₹149 Fee Surcharge', desc: 'Delivery + convenience fee hidden until the absolute final step.', metric: '31.4% Rage Clicks' },
    ],
    sql: `SELECT device_os, app_version,
  ROUND(AVG(upi_latency_ms), 0) AS p95_ms,
  ROUND(SUM(dropped_step_4)*100.0/COUNT(*), 1) AS churn_pct
FROM \`telemetry.checkout_funnel_v4\`
WHERE step_index = 4 GROUP BY 1, 2;`,
    sqlResults: [
      { os: 'Android WebView (v4.2)', latency: '4,280 ms', churn: '78.4%' },
      { os: 'iOS Safari (v17.2)', latency: '610 ms', churn: '54.1%' },
    ],
    voiceSummary: 'Diagnostic complete for QuickStyle D2C. Step 4 leaks 331.6 Lakhs per month, primarily driven by Android WebView latency bottlenecks and forced login walls.'
  }
};

export default function FunnelDoctorMinimalist() {
  const [selectedPreset] = useState('d2c');
  const currentData = PRESET_DATASETS[selectedPreset] || PRESET_DATASETS.d2c;
  const [targetUrl, setTargetUrl] = useState(currentData.url);
  const [selectedPin, setSelectedPin] = useState('01');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Financial Sliders
  const [visitors, setVisitors] = useState(currentData.visitors);
  const [dropoff, setDropoff] = useState(currentData.dropoff);
  const [aov, setAov] = useState(currentData.aov);

  const leakedLakhs = ((visitors * (dropoff / 100) * aov) / 100000).toFixed(1);
  const recoverableLakhs = (Number(leakedLakhs) * 0.22).toFixed(1);
  const annualizedCr = ((Number(recoverableLakhs) * 12) / 100).toFixed(2);

  const toggleVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(currentData.voiceSummary);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopySql = () => {
    navigator.clipboard?.writeText(currentData.sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#09090B] font-sans selection:bg-emerald-500/20 selection:text-emerald-900 relative">
      
      {/* Topographic Mesh Background (Clean without dot grid noise) */}
      <TopographicMesh />

      {/* 1. CLEAN, UN-CROWDED MINIMALIST NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#FBFBFB]/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              FD
            </div>
            <div className="flex flex-col">
              <span className="font-semibold tracking-tight text-sm uppercase">
                FunnelDoctor<span className="text-neutral-400">.ai</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 tracking-wider">
                GEMINI 2.5 ACTIVE
              </span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-neutral-500">
            <a href="#telemetry" className="hover:text-black transition-colors">Telemetry</a>
            <a href="#xray" className="hover:text-black transition-colors">Vision X-Ray</a>
            <a href="#sql" className="hover:text-black transition-colors">SQL Evidence</a>
            <a href="#calculator" className="hover:text-black transition-colors">ROI Model</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleVoice}
              className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                isSpeaking 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              {isSpeaking ? 'Playing...' : 'Audio Brief'}
            </button>
            <button 
              onClick={() => scrollToSection('telemetry')}
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Launch Workspace →
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-32 space-y-24">
        
        {/* 2. HERO SECTION */}
        <section className="max-w-4xl mx-auto text-center pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-mono font-medium text-emerald-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Autonomous Multimodal RCA & Conversion Agent
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-[#09090B] mb-6">
            Diagnose conversion churn. <br />
            <span className="text-neutral-400 font-normal">Synthesize the fix in 60s.</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Combine quantitative BigQuery funnel telemetry with Gemini Vision spatial screen inspection to output executive PRDs and production React code.
          </p>

          {/* Minimalist Target Bar */}
          <div className="max-w-2xl mx-auto bg-white border border-neutral-300/80 rounded-2xl p-2.5 flex flex-col sm:flex-row items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 px-3 py-2 w-full font-mono text-xs text-neutral-500 border-b sm:border-b-0 sm:border-r border-neutral-200">
              <span className="text-neutral-400">URL:</span>
              <input 
                type="text" 
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-transparent text-black focus:outline-none font-mono text-xs" 
              />
            </div>
            <button 
              onClick={() => scrollToSection('telemetry')}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              Run Audit <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Trust & Live Benchmark Line */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-neutral-500 pt-5">
            <span className="flex items-center gap-1.5 text-neutral-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              QuickStyle D2C Benchmark
            </span>
            <span className="text-neutral-300">·</span>
            <span>₹331.6L monthly leakage isolated</span>
            <span className="text-neutral-300">·</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {currentData.lift}
            </span>
          </div>

          {/* 3-Step Typographic Breadcrumb */}
          <div className="pt-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-t border-neutral-200/70 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                <span className="text-neutral-700 font-medium">Ingest Telemetry</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300" />
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                <span className="text-neutral-700 font-medium">Vision + SQL RCA</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300" />
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                <span className="text-emerald-800 font-semibold">PRD & 1-Tap Fix</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. QUANTITATIVE FUNNEL STREAM */}
        <section id="telemetry">
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-neutral-100 font-mono text-xs text-neutral-500 gap-2">
              <span className="uppercase tracking-wider">Quantitative Funnel Stream</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {currentData.lift} PROJECTED
                </span>
                <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Anomaly at Step 04 (-71.7% Drop)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {currentData.steps.map((s, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    s.critical 
                      ? 'bg-rose-50/30 border-rose-300 ring-1 ring-rose-500/20' 
                      : 'bg-[#FAFAFA] border-neutral-200/80'
                  }`}
                >
                  <div className="flex justify-between font-mono text-[11px] text-neutral-500 mb-2">
                    <span>{s.step}</span>
                    {s.drop && <span className="text-rose-600 font-bold">{s.drop}</span>}
                  </div>
                  <div className="text-xl font-bold font-mono tracking-tight mb-2" suppressHydrationWarning>
                    {s.users} <span className="text-xs font-normal text-neutral-400">users</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.critical ? 'bg-rose-600' : 'bg-neutral-900'}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. MODULE 01: VISION X-RAY */}
        <section id="xray" className="bg-white border border-neutral-200 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Side: Narrative & Findings */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-md font-mono text-xs text-neutral-600">
                <ScanEye className="w-4 h-4 text-emerald-600" />
                <span>MODULE 01 // GEMINI 2.5 SPATIAL X-RAY</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900">
                Visual Occlusion & Hidden Friction
              </h2>

              <p className="text-base text-neutral-600 leading-relaxed font-normal">
                Gemini Vision scans mobile checkout viewports, cross-referencing UI layout flaws with telemetry drop-offs. It isolates blocking modal walls and hidden fee disclosures instantly.
              </p>

              <div className="space-y-3 pt-2">
                {currentData.pins.map((pin) => (
                  <div
                    key={pin.id}
                    onClick={() => setSelectedPin(pin.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      selectedPin === pin.id
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                        : 'bg-[#FAFAFA] text-neutral-900 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 font-mono text-xs">
                      <span className="font-bold flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${selectedPin === pin.id ? 'bg-emerald-500 text-black' : 'bg-neutral-200 text-neutral-800'}`}>
                          {pin.id}
                        </span>
                        {pin.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedPin === pin.id ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {pin.metric}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${selectedPin === pin.id ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {pin.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Elegant Floating Mobile Mockup Frame */}
            <div className="lg:col-span-6 flex justify-center bg-neutral-100/70 p-8 lg:p-12 rounded-2xl border border-neutral-200/60">
              <div className="w-full max-w-[340px] bg-white rounded-3xl border border-neutral-300 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] p-5 relative">
                <div className="w-20 h-3.5 bg-neutral-100 rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 border-b border-neutral-100 pb-2 mb-4">
                  <span>9:41 AM</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">LIVE VIEWPORT</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-rose-50/80 border border-rose-300 rounded-xl relative">
                    <div className="flex justify-between font-mono text-[10px] text-rose-700 font-bold mb-1">
                      <span>[FAULT #01] FORCED OTP MODAL</span>
                      <span>41.2% EXIT</span>
                    </div>
                    <p className="text-xs text-neutral-800">Please enter OTP to continue checkout.</p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-500 font-mono">
                    Delivery Address: Flat 402, Bengaluru
                  </div>

                  <div className="p-3.5 bg-rose-50/80 border border-rose-300 rounded-xl">
                    <div className="flex justify-between font-mono text-[10px] text-rose-700 font-bold mb-1">
                      <span>[FAULT #02] LATE ₹149 SURCHARGE</span>
                      <span>31.4% RAGE</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-800">
                      <span>Standard Shipping</span>
                      <strong className="text-rose-600">+₹149.00</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. MODULE 02: BIGQUERY SQL TELEMETRY EVIDENCE */}
        <section id="sql" className="bg-white border border-neutral-200 rounded-3xl p-8 lg:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-neutral-100 gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-md font-mono text-xs text-neutral-600 mb-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                <span>MODULE 02 // QUANTITATIVE SQL TELEMETRY</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900">
                BigQuery Correlation Proof
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:border-black font-mono text-xs text-neutral-700 hover:text-black flex items-center gap-1.5 transition cursor-pointer bg-white"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? "Copied SQL" : "Copy Query"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
            {/* SQL Terminal Viewer */}
            <div className="lg:col-span-7 bg-[#09090B] text-neutral-200 rounded-2xl p-5 border border-neutral-800 shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-[11px] text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-neutral-400">telemetry_rca_step4.sql</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">STATUS: EXECUTED (184ms)</span>
              </div>
              <pre className="text-neutral-300 font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{currentData.sql}</code>
              </pre>
            </div>

            {/* Results Table */}
            <div className="lg:col-span-5 bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pb-3 mb-3 border-b border-neutral-200">
                  <span className="uppercase">Cohort</span>
                  <span>P95 UPI</span>
                  <span>Churn Rate</span>
                </div>
                <div className="space-y-2.5">
                  {currentData.sqlResults.map((row, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                        row.churn.includes("78")
                          ? "bg-rose-50/70 border-rose-200 text-rose-900"
                          : "bg-white border-neutral-200 text-neutral-800"
                      }`}
                    >
                      <span className="font-medium">{row.os}</span>
                      <span className="text-neutral-600">{row.latency}</span>
                      <span className={row.churn.includes("78") ? "font-bold text-rose-600" : "font-medium"}>
                        {row.churn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-500 leading-normal">
                💡 <strong className="text-neutral-900">RCA Finding:</strong> Android WebView users experience 4,280ms p95 latency on UPI intent invocation, directly multiplying the dropoff of the forced OTP modal.
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINANCIAL SENSITIVITY & ROI MODEL */}
        <section id="calculator" className="bg-white border border-neutral-200 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
          <div className="border-b border-neutral-100 pb-6 mb-8 font-mono text-xs text-neutral-500 uppercase tracking-wider flex items-center justify-between">
            <span>MODULE 03 // Financial Sensitivity & Revenue Recovery</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              SHAPLEY VALUE ATTRIBUTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2 space-y-6 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-2 text-neutral-600">
                  <span>MONTHLY CHECKOUT INITIATIONS:</span>
                  <span className="font-bold text-neutral-900" suppressHydrationWarning>{visitors.toLocaleString()} Users</span>
                </div>
                <input 
                  type="range" min="5000" max="150000" step="2500"
                  value={visitors} onChange={(e) => setVisitors(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2 text-neutral-600">
                  <span>STEP-04 DROP-OFF RATE:</span>
                  <span className="font-bold text-rose-600" suppressHydrationWarning>{dropoff}% Abandonment</span>
                </div>
                <input 
                  type="range" min="30" max="95" step="0.5"
                  value={dropoff} onChange={(e) => setDropoff(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2 text-neutral-600">
                  <span>AVERAGE ORDER VALUE (AOV):</span>
                  <span className="font-bold text-neutral-900" suppressHydrationWarning>₹{aov.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="500" max="10000" step="50"
                  value={aov} onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-neutral-200 md:pl-10 flex flex-col justify-center font-mono">
              <span className="text-[11px] text-neutral-400 block mb-1">MONTHLY REVENUE LEAKED:</span>
              <span className="text-3xl font-bold text-rose-600 mb-4 tracking-tight" suppressHydrationWarning>
                ₹{leakedLakhs} L<span className="text-xs font-normal text-neutral-500"> /mo</span>
              </span>

              <span className="text-[11px] text-neutral-400 block mb-1">RECOVERABLE (+22% LIFT):</span>
              <span className="text-3xl font-bold text-emerald-600 mb-4 tracking-tight" suppressHydrationWarning>
                +₹{recoverableLakhs} L<span className="text-xs font-normal text-neutral-500"> /mo</span>
              </span>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-400">ANNUALIZED VALUE:</span>
                <span className="font-bold text-neutral-900" suppressHydrationWarning>
                  +₹{annualizedCr} Cr /yr
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 7. MINIMALIST FOOTER */}
      <footer className="border-t border-neutral-200/80 bg-white/60 backdrop-blur-sm py-10 px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-[10px]">
              FD
            </div>
            <span className="font-semibold text-neutral-900">FunnelDoctor.ai</span>
            <span className="text-neutral-300">·</span>
            <span>Startup Buildathon India 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Google Cloud & Gemini 2.5</span>
            <span className="text-neutral-300">·</span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
