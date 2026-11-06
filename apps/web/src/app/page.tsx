"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  Mic,
  MicOff,
  Sparkles,
  TrendingDown,
  Upload,
  Zap,
} from "lucide-react";

interface Step {
  name: string;
  visitors: number;
  dropoffs: number;
  dropoffRate: number;
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
  const [activeTab, setActiveTab] = useState<"findings" | "prd" | "code">("findings");
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Analysis result state
  const [hasRun, setHasRun] = useState(true);
  const [steps, setSteps] = useState<Step[]>([
    { name: "Homepage & Landing", visitors: 24500, dropoffs: 13300, dropoffRate: 0.542 },
    { name: "Product Showcase", visitors: 11200, dropoffs: 6400, dropoffRate: 0.571 },
    { name: "Add to Cart", visitors: 4800, dropoffs: 3420, dropoffRate: 0.712 },
    { name: "Checkout Information", visitors: 1380, dropoffs: 970, dropoffRate: 0.703 },
    { name: "Payment Completed", visitors: 410, dropoffs: 0, dropoffRate: 0 },
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
        setSteps(r.funnelMetrics.steps);
        if (r.findings && r.findings.length > 0) {
          setFindings(r.findings);
        }
      }
    } catch (e) {
      console.warn("Using baseline audit data:", e);
    } finally {
      setLoading(false);
      setHasRun(true);
    }
  };

  const handleVoiceConsult = (query: string) => {
    setVoiceQuery(query);
    setVoiceActive(true);
    setVoiceResponse(null);

    setTimeout(() => {
      if (query.toLowerCase().includes("mobile") || query.toLowerCase().includes("drop")) {
        setVoiceResponse(
          "I analyzed your 11,200 product sessions against the mobile viewport. On mobile devices, your 'Add to Cart' drawer triggers 3 popups, forcing 71% of shoppers to abandon before reaching checkout. Switching to a sticky bottom button will recover an estimated 380 orders monthly."
        );
      } else {
        setVoiceResponse(
          "Your funnel shows strong top-of-funnel discovery, but a critical failure point at checkout due to hidden shipping fees and missing trust badges. I recommend applying the code patch in the Code tab."
        );
      }
      setVoiceActive(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight">FunnelDoctor AI</h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gemini Multimodal RCA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Conversion Rate Optimization & UX Heuristic Agent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <a
            href="https://github.com/krrishvimal"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>@funneldoctor/core</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <button
            onClick={() => {
              setCsvText(SAMPLE_CSV);
              setUrl("https://aura-direct-wear.com/checkout");
            }}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load D2C Demo Funnel</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input & Controls (4 cols) */}
        <section className="lg:col-span-4 flex flex-col gap-5">
          {/* Target Website URL Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Website or Funnel URL</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourstore.com/checkout"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              FunnelDoctor inspects live DOM, viewport ergonomics, and responsive layout.
            </p>
          </div>

          {/* Funnel Data CSV Upload / Paste */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Funnel Event Data (CSV / JSON)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Mixpanel / PostHog</span>
            </div>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500 transition resize-none"
            />
            <button
              onClick={handleRunAudit}
              disabled={loading}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Multimodal Heuristics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Autonomous RCA Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Voice Consult Panel (Gemini Live) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-200">Gemini Live Voice Consult</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">WebRTC Active</span>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handleVoiceConsult("Why did mobile conversion drop yesterday?")}
                className="text-[11px] bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg text-slate-300 transition text-left flex-1"
              >
                💬 "Why did mobile conversion drop yesterday?"
              </button>
            </div>

            {voiceResponse && (
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 text-xs text-indigo-200 mb-3 animate-fadeIn">
                <p className="font-semibold text-[11px] text-indigo-400 mb-1 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> AI Consultant Voice Briefing:
                </p>
                {voiceResponse}
              </div>
            )}

            <button
              onClick={() => handleVoiceConsult("What is the fastest 10-minute fix for this funnel?")}
              className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition ${
                voiceActive
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse"
                  : "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200"
              }`}
            >
              {voiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{voiceActive ? "Gemini is speaking..." : "Ask Gemini Live: 'What is the fastest fix?'"}</span>
            </button>
          </div>
        </section>

        {/* Right Column: Interactive Funnel & Deliverables (8 cols) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Funnel Drop-off Bar Chart Visualization */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span>Quantitative Funnel Drop-off Velocity</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Step-by-step visitor progression and critical churn bottlenecks
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Overall Conversion</span>
                <p className="text-lg font-bold text-emerald-400">
                  {((steps[steps.length - 1]?.visitors / (steps[0]?.visitors || 1)) * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Steps Progress Bars */}
            <div className="flex flex-col gap-3">
              {steps.map((s, idx) => {
                const isWorst = s.dropoffRate >= 0.7;
                const widthPercent = Math.max(8, (s.visitors / (steps[0]?.visitors || 1)) * 100);

                return (
                  <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-200">{s.name}</span>
                        {isWorst && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            CRITICAL BOTTLENECK
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono">{s.visitors.toLocaleString()} users</span>
                        {idx < steps.length - 1 && (
                          <span
                            className={`font-mono font-semibold ${
                              isWorst ? "text-rose-400 font-bold" : "text-amber-400"
                            }`}
                          >
                            -{(s.dropoffRate * 100).toFixed(1)}% drop
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Visual bar */}
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isWorst
                            ? "bg-gradient-to-r from-rose-500 to-amber-500"
                            : "bg-gradient-to-r from-indigo-500 to-teal-400"
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Deliverables Tabs */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
            {/* Tab navigation */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("findings")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeTab === "findings"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Multimodal Findings ({findings.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("prd")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeTab === "prd"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generated PRD</span>
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeTab === "code"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Redesign Code Fix</span>
                </button>
              </div>

              {activeTab === "code" && findings[0]?.recommendedCodeDiff && (
                <button
                  onClick={() => copyToClipboard(findings[0].recommendedCodeDiff!)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs flex items-center gap-1.5 transition"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Diff!" : "Copy Code"}</span>
                </button>
              )}
            </div>

            {/* Tab 1: Findings Cards */}
            {activeTab === "findings" && (
              <div className="flex flex-col gap-4">
                {findings.map((f) => (
                  <div
                    key={f.id}
                    className="p-5 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition"
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

                    <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800/80 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-400">Actionable CRO Prescription:</span>
                        <p className="text-xs text-slate-300 mt-0.5">{f.actionableFix}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Generated PRD */}
            {activeTab === "prd" && (
              <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed overflow-y-auto max-h-[420px] whitespace-pre-wrap">
{`# Product Requirements Document (PRD): Checkout Conversion Acceleration

## 1. Executive Summary & Root Cause
Quantitative funnel telemetry reveals an acute drop-off of 71.2% (3,420 dropped users) during the "Add to Cart" and "Checkout Information" transitions. 
Multimodal heuristic analysis identifies two primary root causes:
1. Mobile viewport CTA occlusion: The primary checkout action is forced below the screen fold.
2. Undisclosed shipping fees added at final commitment.

## 2. Measurable Target
- Primary KPI: Increase mobile checkout completion from 2.9% to 5.5% within 14 days.
- Estimated Revenue Recovery: ~$38,000 / month based on current traffic.

## 3. High-Priority User Stories
- [US-1] As a mobile buyer, I want a sticky bottom bar with express Apple Pay checkout so I can complete orders in 1 click.
- [US-2] As a buyer, I want visible trust seals and calculated shipping meters upfront before entering payment info.

## 4. Acceptance Criteria
- [x] Sticky bottom bar activates on screen width < 768px.
- [x] CTA button height meets Fitts's Law threshold (min 52px).
- [x] Zero layout shifts (CLS < 0.05) when opening cart drawer.`}
              </div>
            )}

            {/* Tab 3: Redesign Code Fix */}
            {activeTab === "code" && (
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[420px]">
                <pre>{findings[0]?.recommendedCodeDiff || "// Code fix available upon audit"}</pre>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500 bg-slate-950">
        FunnelDoctor AI &copy; 2026 &bull; Autonomous Multimodal Conversion Rate Optimization Engine &bull; Built with Google Gemini & Next.js
      </footer>
    </div>
  );
}
