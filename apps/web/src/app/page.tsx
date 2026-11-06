"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Code2,
  Copy,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Info,
  Layers,
  Mic,
  MicOff,
  Monitor,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Target,
  TrendingDown,
  Volume2,
  Zap,
} from "lucide-react";

interface Step {
  id: string;
  name: string;
  visitors: number;
  dropoffs: number;
  dropoffRate: number;
  revenueLossEst: string;
  pins: VisualPin[];
}

interface VisualPin {
  id: string;
  xPercent: number; // Position on screen X%
  yPercent: number; // Position on screen Y%
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  title: string;
  heuristic: string;
  detail: string;
  fix: string;
}

interface Finding {
  id: string;
  stepName: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  category: string;
  headline: string;
  explanation: string;
  actionableFix: string;
  recommendedCodeDiff?: string;
}

const SAMPLE_CSV = `step,visitors
Homepage & Landing,24500
Product Showcase,11200
Add to Cart,4800
Checkout Information,1380
Payment Completed,410`;

export default function FunnelDoctorDashboard() {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [url, setUrl] = useState("https://aura-direct-wear.com/checkout");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "findings" | "prd" | "code">("visual");
  const [viewportMode, setViewportMode] = useState<"mobile" | "desktop">("mobile");
  const [selectedStepIdx, setSelectedStepIdx] = useState(2); // Default to 'Add to Cart' (bottleneck)
  const [activePin, setActivePin] = useState<VisualPin | null>(null);

  // Voice consult state
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Funnel steps with simulated multimodal visual pins
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "step-1",
      name: "Homepage & Landing",
      visitors: 24500,
      dropoffs: 13300,
      dropoffRate: 0.542,
      revenueLossEst: "$18,500/mo",
      pins: [
        {
          id: "pin-h1",
          xPercent: 50,
          yPercent: 42,
          severity: "MEDIUM",
          title: "Weak Above-the-Fold Hero Value Proposition",
          heuristic: "Clarity & Cognitive Load",
          detail: "Headline is artistic but fails to state what the store sells within 3 seconds.",
          fix: "Replace headline with concrete value proposition: 'Handcrafted Waterproof Activewear Delivered in 48 Hours'.",
        },
      ],
    },
    {
      id: "step-2",
      name: "Product Showcase",
      visitors: 11200,
      dropoffs: 6400,
      dropoffRate: 0.571,
      revenueLossEst: "$22,000/mo",
      pins: [
        {
          id: "pin-p1",
          xPercent: 78,
          yPercent: 68,
          severity: "MEDIUM",
          title: "Size Selector Friction",
          heuristic: "Form Friction & Accessibility",
          detail: "Out-of-stock sizes aren't visually disabled, resulting in dead-click rage taps on mobile.",
          fix: "Cross out sold-out sizes and show an inline 'Notify Me' email pill.",
        },
      ],
    },
    {
      id: "step-3",
      name: "Add to Cart",
      visitors: 4800,
      dropoffs: 3420,
      dropoffRate: 0.712,
      revenueLossEst: "$38,400/mo",
      pins: [
        {
          id: "pin-c1",
          xPercent: 50,
          yPercent: 78,
          severity: "CRITICAL",
          title: "Primary Checkout CTA Occluded Below Screen Fold",
          heuristic: "Fitts's Law & Mobile Ergonomics",
          detail: "Dynamic upsell carousels push the primary 'Proceed to Checkout' button 340px below the screen boundary on standard 390px mobile viewports.",
          fix: "Implement a persistent sticky bottom action bar with Apple Pay / 1-Click Buy button and dynamic cart total indicator.",
        },
        {
          id: "pin-c2",
          xPercent: 82,
          yPercent: 24,
          severity: "HIGH",
          title: "Aggressive Modal Clutter Triggers Exit",
          heuristic: "Cognitive Friction",
          detail: "A 10% discount popup triggers at the same second the cart drawer opens, creating modal stacking on iOS Safari.",
          fix: "Suppress promo modals once a user has initiated the cart action.",
        },
      ],
    },
    {
      id: "step-4",
      name: "Checkout Information",
      visitors: 1380,
      dropoffs: 970,
      dropoffRate: 0.703,
      revenueLossEst: "$14,800/mo",
      pins: [
        {
          id: "pin-co1",
          xPercent: 50,
          yPercent: 55,
          severity: "HIGH",
          title: "Hidden Shipping Fee Shock at Final Step",
          heuristic: "Pricing Transparency & Trust Anxiety",
          detail: "A surprise $12.50 shipping fee is appended at the final payment step with zero prior disclosure.",
          fix: "Introduce a 'Free Shipping Progress Meter' on the cart drawer and calculate taxes early.",
        },
      ],
    },
    {
      id: "step-5",
      name: "Payment Completed",
      visitors: 410,
      dropoffs: 0,
      dropoffRate: 0,
      revenueLossEst: "$0/mo",
      pins: [],
    },
  ]);

  const [findings, setFindings] = useState<Finding[]>([
    {
      id: "f-1",
      stepName: "Add to Cart",
      severity: "CRITICAL",
      category: "Fitts's Law & Mobile Ergonomics",
      headline: "Primary Checkout CTA is Pushed Below Mobile Viewport Fold",
      explanation:
        "71.2% of mobile shoppers drop off immediately upon adding to cart. Multimodal visual inspection indicates that dynamic upsell banners push the 'Proceed to Checkout' button 340px below the initial screen fold on standard 390px mobile displays.",
      actionableFix:
        "Implement a persistent sticky bottom action bar with Apple Pay / 1-Click Buy button and dynamic cart total indicator.",
      recommendedCodeDiff: `// Sticky High-Converting Mobile Bottom Bar
<div className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 z-50 flex items-center justify-between shadow-2xl">
  <div>
    <span className="text-xs text-slate-400">Cart Total</span>
    <p className="text-lg font-bold text-emerald-400">$68.00</p>
  </div>
  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2">
    <span>Instant Checkout</span>
    <span className="text-xs bg-slate-950/20 px-2 py-0.5 rounded font-mono">⚡ 1-Tap</span>
  </button>
</div>`,
    },
    {
      id: "f-2",
      stepName: "Checkout Information",
      severity: "HIGH",
      category: "Trust & Hidden Cost Anxiety",
      headline: "Shipping Fee Shock at Final Step Causes 70.3% Abandonment",
      explanation:
        "Users are hit with a surprise $12.50 shipping surcharge on step 4 that was never messaged on the product or cart screen. In CRO psychology, undisclosed checkout costs represent the #1 driver of cart desertion.",
      actionableFix:
        "Introduce a 'Free Shipping Progress Meter' on the cart drawer and display calculated landed taxes upfront.",
    },
  ]);

  const currentStep = steps[selectedStepIdx] || steps[0];

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText, websiteUrl: url }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        const r = data.report;
        if (r.findings && r.findings.length > 0) {
          setFindings(r.findings);
        }
      }
    } catch (e) {
      console.warn("Using baseline audit data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceConsult = (query: string) => {
    setVoiceQuery(query);
    setVoiceActive(true);
    setVoiceResponse(null);

    setTimeout(() => {
      if (query.toLowerCase().includes("mobile") || query.toLowerCase().includes("71")) {
        setVoiceResponse(
          "I cross-referenced your 4,800 cart sessions with the mobile viewport capture. On mobile devices, your upsell carousel forces the checkout button 340px off-screen. Adding a persistent bottom bar will recover an estimated $38,400 monthly."
        );
      } else if (query.toLowerCase().includes("fastest") || query.toLowerCase().includes("fix")) {
        setVoiceResponse(
          "The fastest high-impact fix is shipping disclosure. Disclosing the $12.50 shipping fee on the product drawer eliminates the 70% shock drop-off at Step 4 within 24 hours."
        );
      } else {
        setVoiceResponse(
          "Your funnel shows strong organic traffic, but loses 88% of prospective revenue in the final two checkout stages. Review the visual hotspots on screen for the exact element targets."
        );
      }
      setVoiceActive(false);
    }, 1400);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportMarkdownReport = () => {
    const markdownContent = `# FunnelDoctor AI - Conversion & RCA Executive Report
Generated: ${new Date().toLocaleDateString()}
Target: ${url}

## Executive Summary
Overall Conversion: ${((steps[steps.length - 1].visitors / steps[0].visitors) * 100).toFixed(2)}%
Critical Bottleneck: ${steps[2].name} (${(steps[2].dropoffRate * 100).toFixed(1)}% drop-off)
Estimated Monthly Revenue Recovery: $53,200

## Critical Heuristic Findings
${findings
  .map(
    (f, i) => `### ${i + 1}. [${f.severity}] ${f.headline}
- **Category:** ${f.category}
- **Stage:** ${f.stepName}
- **Diagnostic:** ${f.explanation}
- **Actionable Fix:** ${f.actionableFix}
`
  )
  .join("\n")}
`;
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `funneldoctor-audit-${Date.now()}.md`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight">FunnelDoctor AI</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini Omni & Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Multimodal Conversion & Root-Cause-Analysis Agent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={exportMarkdownReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Report (.MD)</span>
          </button>
          <button
            onClick={() => {
              setCsvText(SAMPLE_CSV);
              setUrl("https://aura-direct-wear.com/checkout");
              setSelectedStepIdx(2);
            }}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition flex items-center gap-1.5 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load D2C Demo Funnel</span>
          </button>
        </div>
      </header>

      {/* Clickable Step Flow Ribbon */}
      <section className="bg-slate-900/40 border-b border-slate-800/80 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0 font-medium mr-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Funnel Stages:</span>
          </div>

          <div className="flex items-center gap-2 flex-1">
            {steps.map((s, idx) => {
              const isSelected = selectedStepIdx === idx;
              const isCritical = s.dropoffRate >= 0.7;

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedStepIdx(idx);
                    setActivePin(null);
                  }}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                    isSelected
                      ? "bg-slate-800 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                      isSelected
                        ? "bg-indigo-600 text-white font-bold"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="text-left">
                    <p className="font-semibold leading-tight">{s.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {s.visitors.toLocaleString()} users{" "}
                      {idx < steps.length - 1 && (
                        <span className={isCritical ? "text-rose-400 font-bold" : "text-amber-400"}>
                          (-{(s.dropoffRate * 100).toFixed(0)}%)
                        </span>
                      )}
                    </p>
                  </div>
                  {isCritical && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Data Input & Voice Assistant (4 cols) */}
        <section className="lg:col-span-4 flex flex-col gap-5">
          {/* URL & Controls */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Funnel URL</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://mystore.com/checkout"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition pr-8 font-mono"
              />
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
            </div>
          </div>

          {/* Funnel Event Telemetry */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Funnel Telemetry (CSV)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Mixpanel / PostHog</span>
            </div>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500 transition resize-none"
            />
            <button
              onClick={handleRunAudit}
              disabled={loading}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditing Telemetry + Pixels...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Multimodal RCA</span>
                </>
              )}
            </button>
          </div>

          {/* Gemini Live Real-Time Voice Consultant */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">Gemini Live Voice Consult</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Multimodal Audio</span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Ask your autonomous AI Product Manager about conversion drops or element fixes in real time.
            </p>

            <div className="flex flex-col gap-1.5 mb-3">
              <button
                onClick={() => handleVoiceConsult("Why did mobile drop 71% on Add to Cart?")}
                className="text-[11px] bg-slate-800/80 hover:bg-slate-800 border border-slate-750 p-2 rounded-lg text-slate-300 transition text-left flex items-center justify-between"
              >
                <span>💬 "Why did mobile drop 71% on Add to Cart?"</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </button>
              <button
                onClick={() => handleVoiceConsult("What is the fastest 10-minute fix for checkout?")}
                className="text-[11px] bg-slate-800/80 hover:bg-slate-800 border border-slate-750 p-2 rounded-lg text-slate-300 transition text-left flex items-center justify-between"
              >
                <span>💬 "What is the fastest 10-minute fix for checkout?"</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </button>
            </div>

            {voiceResponse && (
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 text-xs text-indigo-200 mb-3 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-400 mb-1">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Gemini Voice Briefing:</span>
                </div>
                <p className="leading-relaxed">{voiceResponse}</p>
              </div>
            )}

            <button
              onClick={() => handleVoiceConsult("What is the estimated monthly revenue recovery?")}
              className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition ${
                voiceActive
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse"
                  : "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200"
              }`}
            >
              {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{voiceActive ? "Gemini is speaking..." : "Speak to AI: 'Estimate Revenue Recovery'"}</span>
            </button>
          </div>
        </section>

        {/* Right Column: Visual Device Viewport & Actionable Tabs (8 cols) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Control Bar: Tabs & Viewport Switcher */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-xl">
            {/* View Modes */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab("visual")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === "visual"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visual Screen Audit</span>
              </button>
              <button
                onClick={() => setActiveTab("findings")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === "findings"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>RCA Diagnostics ({findings.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("prd")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === "prd"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generated PRD</span>
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeTab === "code"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code Fix</span>
              </button>
            </div>

            {/* Viewport Toggle (Mobile vs Desktop) */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewportMode("mobile")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  viewportMode === "mobile"
                    ? "bg-slate-800 text-indigo-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Inspect iPhone 390px Viewport"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setViewportMode("desktop")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  viewportMode === "desktop"
                    ? "bg-slate-800 text-indigo-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Inspect Desktop 1440px Viewport"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>
          </div>

          {/* TAB 1: VISUAL SCREEN AUDITOR (Interactive Device Frame with Pulsing Pins) */}
          {activeTab === "visual" && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center">
              {/* Header stats for selected step */}
              <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs text-indigo-400 font-mono uppercase font-semibold">
                    Inspecting Stage {selectedStepIdx + 1} of {steps.length}
                  </span>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>{currentStep.name}</span>
                    {currentStep.dropoffRate >= 0.7 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        🚨 PRIMARY REVENUE LEAK
                      </span>
                    )}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Monthly Revenue at Risk</span>
                  <p className="text-base font-bold text-rose-400">{currentStep.revenueLossEst}</p>
                </div>
              </div>

              {/* The Interactive Device Frame */}
              <div
                className={`relative transition-all duration-500 ${
                  viewportMode === "mobile"
                    ? "w-[340px] h-[580px] bg-slate-900 border-[8px] border-slate-800 rounded-[44px] shadow-2xl p-3 flex flex-col ring-1 ring-slate-700/50"
                    : "w-full max-w-[680px] h-[440px] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
                }`}
              >
                {/* Mobile Dynamic Island / Speaker */}
                {viewportMode === "mobile" && (
                  <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-950" />
                  </div>
                )}

                {/* Desktop Browser Bar */}
                {viewportMode === "desktop" && (
                  <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center gap-3 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-lg px-3 py-1 text-[11px] font-mono text-slate-400 truncate">
                      {url}
                    </div>
                  </div>
                )}

                {/* Simulated Web UI Canvas with Visual Friction Elements */}
                <div className="relative flex-1 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 p-4 flex flex-col justify-between text-xs select-none">
                  {/* Mock Site Navbar */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="font-bold tracking-wider text-slate-200">AURA WEAR</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                      Cart (2)
                    </span>
                  </div>

                  {/* Step-specific simulated UI */}
                  {selectedStepIdx === 2 ? (
                    // Add to Cart Screen Mockup
                    <div className="flex flex-col gap-2 my-auto">
                      <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                        <p className="font-semibold text-slate-200 text-xs">Aura Performance Hoodie</p>
                        <p className="text-[10px] text-slate-400">Size: M • Color: Obsidian Black</p>
                        <p className="text-emerald-400 font-bold mt-1">$68.00</p>
                      </div>

                      {/* Problematic Promotional Modal/Upsell that pushes CTA down */}
                      <div className="p-2.5 bg-rose-950/20 border border-rose-500/40 rounded-lg text-[10px] text-rose-300 animate-pulse">
                        <p className="font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>Friction Element: 3 Stacked Upsell Banners</span>
                        </p>
                        <p className="text-slate-400 mt-0.5">
                          Pushing Primary Checkout Button 340px below the screen boundary!
                        </p>
                      </div>

                      <div className="h-10 bg-slate-900/40 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-500">
                        [Occluded Screen Boundary Fold]
                      </div>
                    </div>
                  ) : selectedStepIdx === 3 ? (
                    // Checkout Step Mockup
                    <div className="flex flex-col gap-2 my-auto">
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px]">
                        <p className="font-semibold text-slate-200">Shipping & Payment</p>
                        <div className="flex justify-between text-slate-400 mt-2">
                          <span>Subtotal</span>
                          <span>$68.00</span>
                        </div>
                        <div className="flex justify-between text-rose-400 font-bold mt-1">
                          <span>Hidden Shipping Surcharge</span>
                          <span>+$12.50</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Generic stage
                    <div className="my-auto text-center p-4">
                      <p className="text-slate-300 font-semibold">{currentStep.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {currentStep.visitors.toLocaleString()} active visitors recorded
                      </p>
                    </div>
                  )}

                  {/* Pulsing Heuristic Visual Pins */}
                  {currentStep.pins.map((pin) => (
                    <button
                      key={pin.id}
                      onClick={() => setActivePin(pin)}
                      style={{ top: `${pin.yPercent}%`, left: `${pin.xPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                    >
                      <span className="relative flex h-7 w-7 items-center justify-center">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            pin.severity === "CRITICAL" ? "bg-rose-500" : "bg-amber-500"
                          }`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-5 w-5 items-center justify-center text-[10px] font-bold text-white shadow-lg ${
                            pin.severity === "CRITICAL"
                              ? "bg-rose-600 border border-rose-400"
                              : "bg-amber-600 border border-amber-400"
                          }`}
                        >
                          !
                        </span>
                      </span>
                    </button>
                  ))}

                  {/* Mock Sticky Bottom Bar or Footer */}
                  <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>SSL Secured 256-bit</span>
                    <span className="text-indigo-400 font-semibold">Step {selectedStepIdx + 1}</span>
                  </div>
                </div>
              </div>

              {/* Active Pin Diagnostic Callout Card */}
              {activePin ? (
                <div className="mt-5 w-full bg-slate-950 p-4 rounded-xl border border-indigo-500/40 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activePin.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {activePin.severity} HEURISTIC HOTSPOT
                    </span>
                    <span className="text-xs text-indigo-400 font-mono">{activePin.heuristic}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{activePin.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{activePin.detail}</p>
                  <div className="mt-2.5 p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>1-Click Fix:</strong> {activePin.fix}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Click the glowing red/amber pins on the device screen to inspect the root cause.</span>
                </p>
              )}
            </div>
          )}

          {/* TAB 2: FINDINGS LIST */}
          {activeTab === "findings" && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-200">
                Root Cause Findings Correlated with Funnel Drop-off Telemetry
              </h3>
              {findings.map((f) => (
                <div
                  key={f.id}
                  className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-750 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          f.severity === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {f.severity}
                      </span>
                      <span className="text-xs text-indigo-400 font-mono">Stage: {f.stepName}</span>
                    </div>
                    <span className="text-xs text-slate-500">{f.category}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 mb-1">{f.headline}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{f.explanation}</p>

                  <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-emerald-400">Actionable Prescription:</span>
                      <p className="text-xs text-slate-300 mt-0.5">{f.actionableFix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: GENERATED PRD */}
          {activeTab === "prd" && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Product Requirements Document (PRD)
                </span>
                <button
                  onClick={exportMarkdownReport}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download (.MD)
                </button>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed overflow-y-auto max-h-[460px] whitespace-pre-wrap">
{`# Product Requirements Document (PRD): Checkout Conversion Acceleration
Document Status: Ready for Engineering Review
Target Objective: Recover $53,200/mo in dropped checkout revenue

## 1. Executive Summary & Root Cause
Quantitative telemetry shows a severe 71.2% drop-off (3,420 lost customers) at Stage 3: "Add to Cart".
Multimodal visual heuristic inspection pinpoints:
1. Mobile viewport CTA occlusion: Dynamic upsell modals force checkout button 340px below the screen fold.
2. Undisclosed shipping surcharge ($12.50) added at Stage 4.

## 2. Target Metrics & KPIs
- Primary KPI: Increase mobile checkout completion from 2.9% to 5.4% within 14 days.
- Estimated Revenue Recovery: ~$53,200 / month based on current traffic.

## 3. High-Priority User Stories
- [US-1] As a mobile buyer, I want a persistent sticky bottom checkout bar with 1-click Apple Pay so I never have to scroll to purchase.
- [US-2] As a first-time buyer, I want free shipping progress meters visible upfront before entering my card info.

## 4. Acceptance Criteria
- [x] Sticky bottom bar activates on screen width < 768px.
- [x] CTA button adheres to Fitts's Law (minimum 52px height).
- [x] Zero cumulative layout shifts (CLS < 0.05).`}
              </div>
            </div>
          )}

          {/* TAB 4: REDESIGNED CODE FIX */}
          {activeTab === "code" && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Redesigned React / Tailwind Component
                </span>
                <button
                  onClick={() => copyToClipboard(findings[0]?.recommendedCodeDiff || "")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs flex items-center gap-1.5 transition"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Diff!" : "Copy Code"}</span>
                </button>
              </div>
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[460px]">
                <pre>{findings[0]?.recommendedCodeDiff}</pre>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500 bg-slate-950">
        FunnelDoctor AI &copy; 2026 &bull; Autonomous Multimodal Conversion Rate Optimization Engine &bull; Built with Google Gemini & Next.js
      </footer>
    </div>
  );
}
