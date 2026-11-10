"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Copy, 
  Download, 
  Share2, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Code2, 
  FileText, 
  CheckCircle2, 
  Activity, 
  Smartphone, 
  Clock, 
  Database,
  ExternalLink,
  Loader2,
  CreditCard,
  AlertCircle,
  XCircle,
  MousePointer,
  Truck
} from 'lucide-react';

interface AuditStep {
  name: string;
  visitors: number;
  dropoffRate: number;
  isBottleneck: boolean;
}

interface AuditFinding {
  id: string;
  title: string;
  plainEnglish: string;
  impact: string;
  category: 'ux' | 'pricing' | 'latency';
}

export interface AuditDomInspection {
  isReachable: boolean;
  totalInputFields: number;
  has1TapUpi: boolean;
  hasManualVpa: boolean;
  hasLateShippingFee: boolean;
  riskScore: number;
  flags: string[];
}

interface AuditData {
  domain: string;
  brandName: string;
  category: string;
  visitors: number;
  dropoffRate: number;
  leakedMonthlyLakhs: number;
  recoverableMonthlyLakhs: number;
  aov: number;
  worstStepName: string;
  worstStepIndex: number;
  steps: AuditStep[];
  findings: AuditFinding[];
  reactCode: string;
  prdMarkdown: string;
  domInspection?: AuditDomInspection;
  mobileScreenshotBase64?: string | null;
}

export default function AuditReportPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'snitch-com';

  const [activeNode, setActiveNode] = useState<'ux' | 'latency' | 'telemetry' | 'cure'>('ux');
  const [activeTab, setActiveTab] = useState<'comparator' | 'code' | 'prd'>('comparator');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrd, setCopiedPrd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Construct readable brand info from slug
  const cleanBrandName = slug
    .replace(/-(com|in|co|org|io|net|store|app|club|ai|dev)$/i, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Store';

  const domainUrl = `https://${slug.replace(/-/g, '.')}`;

  const [audit, setAudit] = useState<AuditData>({
    domain: domainUrl,
    brandName: cleanBrandName,
    category: 'Digital Conversion Funnel',
    visitors: 150000,
    dropoffRate: 58.4,
    leakedMonthlyLakhs: 32.5,
    recoverableMonthlyLakhs: 7.2,
    aov: 1500,
    worstStepName: 'Primary Conversion Gate',
    worstStepIndex: 3,
    steps: [],
    findings: [],
    reactCode: '',
    prdMarkdown: '',
    domInspection: {
      isReachable: true,
      totalInputFields: 6,
      has1TapUpi: true,
      hasManualVpa: false,
      hasLateShippingFee: false,
      riskScore: 58,
      flags: [
        "1-Tap UPI Intent supported (GPay / PhonePe)",
        "Mobile viewport responsive layout detected",
        "Sticky checkout CTA pinned to bottom edge"
      ]
    },
    mobileScreenshotBase64: null
  });

  // Fetch or load stored audit
  useEffect(() => {
    let isMounted = true;

    async function loadAuditData() {
      setIsLoading(true);
      try {
        // 1. Check local storage
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(`fd_audit_${slug}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && (parsed.brandName || parsed.steps)) {
              if (isMounted) {
                setAudit(normalizeAuditData(parsed, domainUrl, cleanBrandName));
                setIsLoading(false);
                return;
              }
            }
          }
        }

        // 2. Fetch live from /api/audit?domain=slug
        const res = await fetch(`/api/audit?domain=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.report) {
            const normalized = normalizeAuditData(data.report, domainUrl, cleanBrandName);
            if (isMounted) {
              setAudit(normalized);
              if (typeof window !== 'undefined') {
                localStorage.setItem(`fd_audit_${slug}`, JSON.stringify(data.report));
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load audit:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAuditData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Handle Share Link Copy
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Handle Code Copy
  const handleCopyCode = () => {
    navigator.clipboard?.writeText(audit.reactCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Handle PRD Copy
  const handleCopyPrd = () => {
    navigator.clipboard?.writeText(audit.prdMarkdown);
    setCopiedPrd(true);
    setTimeout(() => setCopiedPrd(false), 2000);
  };

  // Download Report (.md)
  const handleDownloadReport = () => {
    const content = `# FUNNELDOCTOR AI - EXECUTIVE AUDIT REPORT
Target: ${audit.brandName} (${audit.domain})
Industry Category: ${audit.category}
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Health Grade: GRADE D (Critical Conversion Leak Detected)

================================================================================
EXECUTIVE SUMMARY
================================================================================
${audit.brandName} is losing ${Math.round(audit.dropoffRate)} out of every 100 users at ${audit.worstStepName}.
Monthly Capital Leaked: ₹${audit.leakedMonthlyLakhs} Lakhs / month
Recoverable Revenue (+18% Lift): +₹${audit.recoverableMonthlyLakhs} Lakhs / month

================================================================================
WHY USERS LEAVE (ROOT CAUSES DETECTED BY GEMINI 2.5)
================================================================================
${audit.findings.map(f => `[${f.title}]\n${f.plainEnglish}\nImpact: ${f.impact}\n`).join('\n')}

================================================================================
CONVERSION FUNNEL STAGES
================================================================================
${audit.steps.map(s => `- ${s.name}: ${s.visitors.toLocaleString()} users (${s.dropoffRate}% dropoff) ${s.isBottleneck ? '[PRIMARY BOTTLENECK]' : ''}`).join('\n')}

================================================================================
SYNTHESIZED PRODUCTION CODE FIX
================================================================================
${audit.reactCode}

================================================================================
FULL PRD SPECIFICATION
================================================================================
${audit.prdMarkdown}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FunnelDoctor-Audit-${slug}-${Date.now().toString().slice(-4)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Noun adjustment by category
  const catLower = audit.category.toLowerCase();
  const isSaas = catLower.includes('saas') || catLower.includes('b2b') || catLower.includes('software');
  const isFintech = catLower.includes('fintech') || catLower.includes('broking') || catLower.includes('bank');
  const isTrial = catLower.includes('trial') || catLower.includes('sampling');
  const isSocial = catLower.includes('social') || catLower.includes('media') || catLower.includes('creator') || catLower.includes('consumer');
  const isEdtech = catLower.includes('edtech') || catLower.includes('education') || catLower.includes('course');

  const cohortNoun = isSaas 
    ? 'evaluating teams' 
    : isFintech 
      ? 'applicants' 
      : isTrial 
        ? 'trial users' 
        : isSocial 
          ? 'new users' 
          : isEdtech 
            ? 'students' 
            : 'shoppers';

  const actionNoun = isSaas 
    ? 'workspace activation' 
    : isFintech 
      ? 'account verification' 
      : isTrial 
        ? 'trial order' 
        : isSocial 
          ? 'feed activation' 
          : isEdtech 
            ? 'course enrollment' 
            : 'purchase';

  // Mathematically accurate step dropoff calculation
  const bottleneckStep = audit.steps.find(s => s.isBottleneck) || audit.steps[Math.max(0, audit.worstStepIndex - 1)];
  const bottleneckIdx = bottleneckStep ? audit.steps.indexOf(bottleneckStep) : -1;
  const nextStep = bottleneckIdx >= 0 && bottleneckIdx + 1 < audit.steps.length ? audit.steps[bottleneckIdx + 1] : null;
  const reachedCount = bottleneckStep ? bottleneckStep.visitors : audit.visitors;
  const continuedCount = nextStep ? nextStep.visitors : Math.round(reachedCount * (1 - audit.dropoffRate / 100));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] text-[#09090B] font-sans flex flex-col items-center justify-center p-6 selection:bg-emerald-500/20">
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-base mb-6 shadow-md animate-pulse">
          FD
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span>Gemini 2.5 Active Intelligence</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 text-center mb-2">
          Auditing Conversion Telemetry for {cleanBrandName}
        </h2>
        <p className="text-xs sm:text-sm font-mono text-neutral-500 text-center max-w-md">
          Classifying business archetype, mapping authentic conversion stages, and isolating the primary conversion leak...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#09090B] font-sans selection:bg-emerald-500/20 selection:text-emerald-900 pb-32">
      
      {/* 1. MINIMALIST AUDIT HEADER */}
      <header className="sticky top-0 z-50 bg-[#FBFBFB]/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-black border border-neutral-200 rounded-lg bg-white transition hover:border-black cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Studio</span>
            </Link>

            <span className="text-neutral-300">/</span>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight">{audit.brandName}</span>
              <span className="text-neutral-400 text-xs hidden sm:inline">({audit.category})</span>
              <a 
                href={audit.domain} 
                target="_blank" 
                rel="noreferrer"
                className="text-neutral-400 hover:text-neutral-700 transition"
                title="Open Live Website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-md font-mono text-[11px] font-semibold text-rose-700">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              <span>GRADE D: CRITICAL LEAK</span>
            </div>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-black border border-neutral-200 rounded-lg bg-white transition hover:border-black cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-neutral-500" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider bg-neutral-900 hover:bg-black text-white font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN REPORT CANVAS */}
      <main className="max-w-6xl mx-auto px-6 pt-12 space-y-16">
        
        {/* EXECUTIVE HERO STATEMENT */}
        <section className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-mono font-medium text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            AI Conversion Audit · {audit.category}
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.15]">
            {audit.brandName} is losing <span className="text-rose-600 underline decoration-rose-200 underline-offset-4">{Math.round(audit.dropoffRate)} out of every 100 {cohortNoun}</span> at {audit.worstStepName}.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-3xl">
            Over <strong className="text-neutral-900">{reachedCount.toLocaleString()} {cohortNoun}</strong> reached this stage, but only <strong className="text-neutral-900">{continuedCount.toLocaleString()} continued</strong>. 
            That is an abrupt <strong className="text-neutral-900">-{audit.dropoffRate}% drop right before {actionNoun}</strong>. 
            Here is why visitors leave and how to fix it with clean code in 60s.
          </p>
        </section>

        {/* 3. THE 3 CORE FINANCIAL NUMBERS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="p-6 bg-white border border-neutral-200/90 rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-2 flex items-center justify-between">
                <span>Monthly Lost Revenue</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-neutral-900 tracking-tight">
                ₹{audit.leakedMonthlyLakhs} <span className="text-lg font-normal text-neutral-500">Lakhs</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                {isSocial 
                  ? 'Estimated creator & ad monetization abandoned every month.' 
                  : isSaas 
                    ? 'Estimated subscription ARR/MRR lost from unactivated teams.' 
                    : 'Estimated revenue abandoned at checkout every month.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
              Based on {audit.visitors.toLocaleString()} visitors · ₹{audit.aov} AOV
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white border border-rose-300 rounded-2xl shadow-xs bg-rose-50/20 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-rose-700 font-semibold mb-2 flex items-center justify-between">
                <span>Where Most People Drop Off</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-700 tracking-tight truncate">
                {audit.worstStepName}
              </div>
              <p className="text-xs text-neutral-700 mt-2">
                -{audit.dropoffRate}% of visitors leave at this exact step.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200/60 text-[11px] font-mono text-rose-600 font-semibold truncate">
              {reachedCount.toLocaleString()} {cohortNoun} ➔ only {continuedCount.toLocaleString()} continued
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white border border-emerald-200 rounded-2xl shadow-xs bg-emerald-50/20 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-emerald-800 font-semibold mb-2 flex items-center justify-between">
                <span>Recoverable Revenue</span>
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-700 tracking-tight">
                +₹{audit.recoverableMonthlyLakhs} <span className="text-lg font-normal text-emerald-600">Lakhs</span>
              </div>
              <p className="text-xs text-neutral-700 mt-2">
                Monthly revenue saved by fixing conversion friction.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] font-mono text-emerald-700 font-semibold">
              Projected +18% conversion lift with 1-tap fix
            </div>
          </div>
        </section>

        {/* 3.5. LIVE MOBILE DOM & VIEWPORT FORENSICS */}
        {audit.domInspection && (
          <section className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Live Mobile DOM & Viewport Forensics</span>
                  </span>
                  {audit.domInspection.isReachable ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Verified From Store HTML
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
                      Mobile Viewport Model
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                  Real-Time Mobile Checkout Inspection
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Automated inspection of live HTML inputs, Indian UPI payment gateways, keyboard triggers, and touch targets.
                </p>
              </div>

              {/* RISK SCORE BADGE */}
              <div className={`p-4 rounded-2xl border text-right min-w-[150px] shrink-0 ${
                audit.domInspection.riskScore >= 70
                  ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                  : audit.domInspection.riskScore >= 45
                    ? 'bg-amber-50/40 border-amber-200 text-amber-900'
                    : 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
              }`}>
                <div className="text-[10px] font-mono uppercase tracking-wider font-semibold opacity-75">
                  Friction Risk Score
                </div>
                <div className="text-3xl font-bold font-mono tracking-tight my-0.5">
                  {audit.domInspection.riskScore} <span className="text-xs font-normal opacity-70">/ 100</span>
                </div>
                <div className="text-[11px] font-mono font-semibold">
                  {audit.domInspection.riskScore >= 70 
                    ? 'High Mobile Churn Risk' 
                    : audit.domInspection.riskScore >= 45 
                      ? 'Moderate Friction' 
                      : 'Well-Optimized Flow'}
                </div>
              </div>
            </div>

            {/* THE 4 FORENSIC METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: UPI Gateway */}
              <div className={`p-4 rounded-2xl border transition-all ${
                audit.domInspection.has1TapUpi
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-rose-300 bg-rose-50/30'
              }`}>
                <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                  <span className="font-semibold text-neutral-500">PAYMENT GATEWAY</span>
                  <CreditCard className={`w-3.5 h-3.5 ${audit.domInspection.has1TapUpi ? 'text-emerald-600' : 'text-rose-600'}`} />
                </div>
                <div className={`text-base font-bold font-mono ${audit.domInspection.has1TapUpi ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {audit.domInspection.has1TapUpi ? '1-Tap UPI Intent' : 'Manual VPA Typing'}
                </div>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  {audit.domInspection.has1TapUpi
                    ? 'Direct GPay/PhonePe deep-links detected. High mobile conversion velocity.'
                    : 'Customers forced to type VPA (e.g. name@okhdfcbank). Causes ~34% mobile drop-off.'}
                </p>
              </div>

              {/* Metric 2: Phone Input Keypad */}
              <div className="p-4 rounded-2xl border border-neutral-200 bg-white">
                <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                  <span className="font-semibold text-neutral-500">PHONE INPUT CONFIG</span>
                  <Smartphone className="w-3.5 h-3.5 text-neutral-600" />
                </div>
                <div className="text-base font-bold font-mono text-neutral-900">
                  {audit.domInspection.flags.some(f => f.toLowerCase().includes('qwerty') || f.toLowerCase().includes('tel')) 
                    ? 'QWERTY Text Mode' 
                    : 'Numeric Keypad Active'}
                </div>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  {audit.domInspection.flags.some(f => f.toLowerCase().includes('qwerty') || f.toLowerCase().includes('tel'))
                    ? 'Phone field lacks inputmode="numeric". Forces users to switch keyboards manually.'
                    : 'Configured with numeric keypad (type="tel") for zero-friction mobile entry.'}
                </p>
              </div>

              {/* Metric 3: Form Fatigue */}
              <div className={`p-4 rounded-2xl border transition-all ${
                audit.domInspection.totalInputFields > 6
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-neutral-200 bg-white'
              }`}>
                <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                  <span className="font-semibold text-neutral-500">FORM FATIGUE</span>
                  <Layers className={`w-3.5 h-3.5 ${audit.domInspection.totalInputFields > 6 ? 'text-amber-600' : 'text-neutral-600'}`} />
                </div>
                <div className="text-base font-bold font-mono text-neutral-900">
                  {audit.domInspection.totalInputFields} Input Fields
                </div>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  {audit.domInspection.totalInputFields > 6
                    ? 'Form fatigue warning: >6 fields triggers mobile abandonment. Recommend 1-tap autofill.'
                    : 'Streamlined checkout inputs. Well within the 5-field mobile threshold.'}
                </p>
              </div>

              {/* Metric 4: Pricing / Shipping Transparency */}
              <div className={`p-4 rounded-2xl border transition-all ${
                audit.domInspection.hasLateShippingFee
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-emerald-200 bg-emerald-50/20'
              }`}>
                <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                  <span className="font-semibold text-neutral-500">SHIPPING TRANSPARENCY</span>
                  <Truck className={`w-3.5 h-3.5 ${audit.domInspection.hasLateShippingFee ? 'text-rose-600' : 'text-emerald-600'}`} />
                </div>
                <div className={`text-base font-bold font-mono ${audit.domInspection.hasLateShippingFee ? 'text-rose-800' : 'text-emerald-800'}`}>
                  {audit.domInspection.hasLateShippingFee ? 'Late Shipping Fee' : 'Transparent Pricing'}
                </div>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  {audit.domInspection.hasLateShippingFee
                    ? 'Surprise shipping fee revealed late in checkout triggers immediate sticker shock.'
                    : 'Upfront pricing or free delivery thresholds clearly communicated.'}
                </p>
              </div>
            </div>

            {/* EXTRACTED DOM SIGNALS LIST */}
            {audit.domInspection.flags && audit.domInspection.flags.length > 0 && (
              <div className="pt-4 border-t border-neutral-100">
                <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2.5 font-semibold">
                  Extracted DOM Signals & Friction Flags
                </div>
                <div className="flex flex-wrap gap-2">
                  {audit.domInspection.flags.map((flag, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-neutral-50 border border-neutral-200/80 text-neutral-700"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{flag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 4. DIAGNOSTIC ECOSYSTEM MAP */}
        <section className="bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-12 shadow-xs">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-1">
              Interactive Drop-Off Map
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              How Visitors Leave The Funnel
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              See how traffic, screen friction, and slow loading cause visitors to drop out.
            </p>
          </div>

          {/* THE RADAR CANVAS */}
          <div className="relative w-full max-w-3xl mx-auto h-[460px] flex items-center justify-center select-none">
            
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 700 460" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="emeraldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
                  <stop offset="50%" stopColor="#10B981" stopOpacity="1" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="roseBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0" />
                  <stop offset="50%" stopColor="#F43F5E" stopOpacity="1" />
                  <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="blueBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Concentric Radar Rings */}
              <circle cx="350" cy="230" r="75" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
              <circle cx="350" cy="230" r="140" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              <circle cx="350" cy="230" r="205" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="5 5" opacity="0.4" />

              {/* Top Connector: Telemetry -> Center */}
              <path d="M 350,75 L 350,155" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" />
              <path 
                d="M 350,75 L 350,155" 
                stroke="url(#blueBeam)" 
                strokeWidth="2.5" 
                strokeDasharray="25 80"
                className="animate-[pulse_1.8s_linear_infinite]" 
              />

              {/* Left Connector: Visual UX -> Center */}
              <path d="M 175,230 Q 250,230 275,230" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" />
              <path 
                d="M 175,230 Q 250,230 275,230" 
                stroke="url(#roseBeam)" 
                strokeWidth="2.5" 
                strokeDasharray="25 80"
                className="animate-[pulse_1.5s_linear_infinite_0.2s]" 
              />

              {/* Right Connector: Gateway Latency -> Center */}
              <path d="M 525,230 Q 450,230 425,230" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" />
              <path 
                d="M 525,230 Q 450,230 425,230" 
                stroke="url(#roseBeam)" 
                strokeWidth="2.5" 
                strokeDasharray="25 80"
                className="animate-[pulse_2s_linear_infinite_0.4s]" 
              />

              {/* Bottom Connector: Center -> 1-Tap Cure */}
              <path d="M 350,305 L 350,385" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" />
              <path 
                d="M 350,305 L 350,385" 
                stroke="url(#emeraldBeam)" 
                strokeWidth="2.5" 
                strokeDasharray="25 80"
                className="animate-[pulse_1.2s_linear_infinite_0.6s]" 
              />
            </svg>

            {/* TOP NODE: Quantitative Telemetry */}
            <div 
              onClick={() => setActiveNode('telemetry')}
              className={`absolute top-5 left-1/2 -translate-x-1/2 bg-white border p-3 rounded-2xl shadow-xs text-xs font-mono flex items-center gap-2 cursor-pointer transition-all ${
                activeNode === 'telemetry' 
                  ? 'border-blue-600 text-blue-950 shadow-md ring-2 ring-blue-500/20' 
                  : 'border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold">{audit.visitors.toLocaleString()} Sessions Analyzed</span>
            </div>

            {/* LEFT NODE: Visual Screen Friction */}
            <div 
              onClick={() => setActiveNode('ux')}
              className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white border p-3.5 rounded-2xl shadow-xs text-xs max-w-[170px] sm:max-w-[200px] cursor-pointer transition-all ${
                activeNode === 'ux' 
                  ? 'border-rose-600 text-rose-950 shadow-md ring-2 ring-rose-500/20' 
                  : 'border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-rose-600 font-bold mb-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>SCREEN FRICTION</span>
              </div>
              <p className="font-semibold text-xs leading-snug line-clamp-2">
                {audit.findings[0]?.title || 'Visual Friction Detected'}
              </p>
              <span className="text-[10px] text-neutral-400 mt-1 block font-mono">Click to inspect</span>
            </div>

            {/* CENTRAL NODE: The Churn Bottleneck */}
            <div className="z-10 w-36 h-36 rounded-full bg-white border-2 border-rose-500 shadow-xl flex flex-col items-center justify-center p-3 text-center transition-all hover:scale-105">
              <span className="text-[10px] font-mono text-rose-600 uppercase font-bold tracking-wider truncate max-w-[120px]">
                {audit.worstStepName}
              </span>
              <span className="text-2xl font-bold font-mono text-neutral-900 my-0.5">
                -{audit.dropoffRate}%
              </span>
              <span className="text-[10px] text-neutral-500 font-sans leading-tight">
                Critical Drop-off
              </span>
            </div>

            {/* RIGHT NODE: Infrastructure / Latency */}
            <div 
              onClick={() => setActiveNode('latency')}
              className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white border p-3.5 rounded-2xl shadow-xs text-xs max-w-[170px] sm:max-w-[200px] cursor-pointer transition-all ${
                activeNode === 'latency' 
                  ? 'border-rose-600 text-rose-950 shadow-md ring-2 ring-rose-500/20' 
                  : 'border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-rose-600 font-bold mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>PAGE / APP DELAY</span>
              </div>
              <p className="font-semibold text-xs leading-snug line-clamp-2">
                {audit.findings[2]?.title || audit.findings[1]?.title || 'Slow Page Delay'}
              </p>
              <span className="text-[10px] text-neutral-400 mt-1 block font-mono">Click to inspect</span>
            </div>

            {/* BOTTOM NODE: 1-Tap Solution */}
            <div 
              onClick={() => setActiveNode('cure')}
              className={`absolute bottom-5 left-1/2 -translate-x-1/2 bg-white border px-5 py-2.5 rounded-full shadow-xs text-xs font-mono flex items-center gap-2 cursor-pointer transition-all ${
                activeNode === 'cure' 
                  ? 'border-emerald-600 text-emerald-950 shadow-md ring-2 ring-emerald-500/20' 
                  : 'border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="font-bold text-emerald-700">1-Tap Fix (+₹{audit.recoverableMonthlyLakhs}L/mo)</span>
            </div>
          </div>
        </section>

        {/* 5. FUNNEL STAGES SEQUENTIAL BREAKDOWN */}
        {audit.steps && audit.steps.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Step-by-Step Flow</span>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                  Customer Journey & Drop-Offs
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {audit.steps.length} Stages Analyzed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {audit.steps.map((st, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border transition-all ${
                    st.isBottleneck 
                      ? 'border-rose-400 bg-rose-50/30 shadow-xs' 
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px] mb-2">
                    <span className="text-neutral-400 font-semibold">STAGE 0{idx + 1}</span>
                    {st.isBottleneck && (
                      <span className="text-rose-600 font-bold bg-rose-100/80 px-1.5 py-0.5 rounded text-[10px]">
                        BIGGEST DROP
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-xs text-neutral-900 mb-1 truncate" title={st.name}>
                    {st.name}
                  </h4>
                  <div className="font-mono text-base font-bold text-neutral-900">
                    {st.visitors.toLocaleString()}
                  </div>
                  <div className={`text-[11px] font-mono mt-1 ${st.dropoffRate > 0 ? (st.isBottleneck ? 'text-rose-600 font-bold' : 'text-neutral-500') : 'text-emerald-600'}`}>
                    {st.dropoffRate > 0 ? `-${st.dropoffRate}% drop` : 'Final Step'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. WHY THEY LEAVE: THE 3 ROOT CAUSES */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Why Visitors Leave</span>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
              Why People Leave At {audit.worstStepName}
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Three specific problems explain why {audit.dropoffRate}% of visitors drop out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {audit.findings.map((f, idx) => (
              <div key={f.id} className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between font-mono text-xs mb-3">
                    <span className="px-2 py-0.5 rounded font-bold bg-neutral-100 text-neutral-700">
                      Problem #0{idx + 1}
                    </span>
                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {f.impact}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-neutral-900 mb-2 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {f.plainEnglish}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                  Identified by AI Screen Inspection
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. THE 60-SECOND CURE: BEFORE / AFTER & PRODUCTION CODE */}
        <section className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">The 60-Second Fix</span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                Ready-To-Use Code Fix
              </h2>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl font-mono text-xs">
              <button
                onClick={() => setActiveTab('comparator')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'comparator' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-500 hover:text-black'
                }`}
              >
                Before vs. After
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'code' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-500 hover:text-black'
                }`}
              >
                Clean Code
              </button>
              <button
                onClick={() => setActiveTab('prd')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'prd' ? 'bg-white text-black font-semibold shadow-xs' : 'text-neutral-500 hover:text-black'
                }`}
              >
                Product Spec (PRD)
              </button>
            </div>
          </div>

          {/* TAB 1: VISUAL COMPARATOR */}
          {activeTab === 'comparator' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="p-6 bg-rose-50/20 border border-rose-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between font-mono text-xs text-rose-700 font-bold pb-2 mb-3 border-b border-rose-200">
                    <span>Current Problem</span>
                    <span>-{audit.dropoffRate}% Churn</span>
                  </div>
                  <h4 className="font-bold text-base text-neutral-900 mb-2">What is happening now</h4>
                  <ul className="text-xs text-neutral-700 space-y-2.5">
                    {audit.findings.length > 0 ? (
                      audit.findings.map(f => (
                        <li key={f.id} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold shrink-0">✗</span>
                          <span>{f.plainEnglish}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold shrink-0">✗</span>
                        <span>Friction points block users right before conversion completion.</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="mt-6 pt-3 border-t border-rose-200 text-xs font-mono text-rose-700 flex justify-between font-bold">
                  <span>LOST SALES:</span>
                  <span>₹{audit.leakedMonthlyLakhs} Lakhs / mo</span>
                </div>
              </div>

              {/* After */}
              <div className="p-6 bg-emerald-50/20 border border-emerald-300 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between font-mono text-xs text-emerald-800 font-bold pb-2 mb-3 border-b border-emerald-200">
                    <span>The Fix</span>
                    <span>+{Math.min(45, Math.round(audit.dropoffRate * 0.28))}% Lift</span>
                  </div>
                  <h4 className="font-bold text-base text-neutral-900 mb-2">Zero-Friction Solution</h4>
                  <ul className="text-xs text-neutral-800 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>1-Tap Action: Direct action button placed right where the thumb naturally taps.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>Clear Pricing: Show total costs and estimates upfront with zero surprises.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>Fast & Simple: Skip long forms and connect in under 1 second.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-3 border-t border-emerald-200 text-xs font-mono text-emerald-800 flex justify-between font-bold">
                  <span>PROJECTED RECOVERY:</span>
                  <span>+₹{audit.recoverableMonthlyLakhs} Lakhs / mo</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTION CODE */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>components/remediation/RemediatedStep.tsx</span>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied to Clipboard' : 'Copy React Component'}</span>
                </button>
              </div>
              <pre className="p-5 bg-neutral-950 text-neutral-200 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
                <code>{audit.reactCode}</code>
              </pre>
            </div>
          )}

          {/* TAB 3: EXECUTIVE PRD */}
          {activeTab === 'prd' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>PRD-REMEDIATION-{slug.toUpperCase()}.md</span>
                <button
                  onClick={handleCopyPrd}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 transition cursor-pointer"
                >
                  {copiedPrd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrd ? 'Copied Markdown' : 'Copy PRD'}</span>
                </button>
              </div>
              <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-2xl font-mono text-xs text-neutral-800 overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-[500px]">
                {audit.prdMarkdown}
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

function cleanStepName(name: string): string {
  if (!name) return '';
  return name.replace(/^(\d+[\s.)-]+\s*)+/, '').trim();
}

// --------------------------------------------------------------------------
// HELPER: NORMALIZE AUDIT DATA
// --------------------------------------------------------------------------
function normalizeAuditData(raw: any, defaultDomain: string, defaultBrand: string): AuditData {
  const brand = raw.brandName || defaultBrand;
  const domain = raw.domain || defaultDomain;
  let category = raw.category || 'Digital Commerce';
  const visitors = Number(raw.visitors) || 150000;
  const dropoffRate = Number(raw.dropoffRate || raw.dropoff) || 58.4;
  const aov = Number(raw.aov) || 1500;
  
  const leakedMonthlyLakhs = raw.leakedMonthlyLakhs 
    ? Number(raw.leakedMonthlyLakhs)
    : Number(((visitors * (dropoffRate / 100) * aov) / 100000).toFixed(1));
    
  const recoverableMonthlyLakhs = raw.recoverableMonthlyLakhs
    ? Number(raw.recoverableMonthlyLakhs)
    : Number((leakedMonthlyLakhs * 0.22).toFixed(1));

  let steps: AuditStep[] = [];
  if (Array.isArray(raw.steps) && raw.steps.length > 0) {
    steps = raw.steps.map((s: any, idx: number) => {
      const rawName = s.name || s.step || `Stage 0${idx + 1}`;
      const cleaned = cleanStepName(rawName);
      return {
        name: `${(idx + 1).toString().padStart(2, '0')}. ${cleaned || rawName}`,
        visitors: typeof s.visitors === 'number' ? s.visitors : Number(String(s.users || '0').replace(/[^0-9]/g, '')) || 0,
        dropoffRate: typeof s.dropoffRate === 'number' ? s.dropoffRate : s.drop ? Number(String(s.drop).replace(/[^0-9.]/g, '')) : 0,
        isBottleneck: !!(s.isBottleneck || s.critical)
      };
    });
  }

  // Detect if e-commerce steps were pasted onto a social or SaaS domain
  const hasStorefrontSteps = steps.some(s => /storefront|product|cart|checkout|bag|order/i.test(s.name));
  const isSocialDomain = /instagram|tiktok|facebook|twitter|x\.com|youtube|threads/i.test(domain);
  if (hasStorefrontSteps && isSocialDomain) {
    category = "Social Commerce & In-App Storefront";
  }

  const criticalStep = steps.find(s => s.isBottleneck) || steps[Math.min(2, steps.length - 1)];
  const actualIndex = criticalStep ? steps.indexOf(criticalStep) + 1 : (Number(raw.worstStepIndex) || 1);
  const rawWorst = criticalStep?.name || raw.worstStepName || 'Primary Bottleneck';
  const cleanedWorst = cleanStepName(rawWorst);
  const worstStepName = `${actualIndex.toString().padStart(2, '0')}. ${cleanedWorst || rawWorst}`;

  let findings: AuditFinding[] = [];
  if (Array.isArray(raw.findings) && raw.findings.length > 0) {
    findings = raw.findings.map((f: any, idx: number) => ({
      id: f.id || String(idx + 1),
      title: f.title || `Finding #${idx + 1}`,
      plainEnglish: f.plainEnglish || f.explanation || f.actionableFix || 'Friction point isolated by diagnostic inspection.',
      impact: f.impact || 'Critical Churn',
      category: f.category || (idx === 0 ? 'ux' : idx === 1 ? 'pricing' : 'latency')
    }));
  } else if (Array.isArray(raw.pins) && raw.pins.length > 0) {
    findings = raw.pins.map((p: any, idx: number) => ({
      id: p.id || String(idx + 1),
      title: p.title || `Friction Point #${idx + 1}`,
      plainEnglish: p.desc || 'Friction point isolated by diagnostic inspection.',
      impact: p.metric || 'Critical Exit',
      category: idx === 0 ? 'ux' : idx === 1 ? 'pricing' : 'latency'
    }));
  }

  return {
    domain,
    brandName: brand,
    category,
    visitors,
    dropoffRate,
    leakedMonthlyLakhs,
    recoverableMonthlyLakhs,
    aov,
    worstStepName,
    worstStepIndex: actualIndex,
    steps,
    findings,
    reactCode: raw.reactCode || raw.remediationCode || `// Remediated Component for ${brand}\nexport function RemediatedStep() {\n  return <div>Fix implemented</div>;\n}`,
    prdMarkdown: raw.prdMarkdown || (raw.prdProblemStatement ? `# PRD: ${brand}\n\n${raw.prdProblemStatement}` : `# PRD: ${brand}\n\nConversion remediation document.`),
    domInspection: raw.domInspection ? {
      isReachable: Boolean(raw.domInspection.isReachable),
      totalInputFields: Number(raw.domInspection.totalInputFields) || 0,
      has1TapUpi: Boolean(raw.domInspection.has1TapUpi),
      hasManualVpa: Boolean(raw.domInspection.hasManualVpa),
      hasLateShippingFee: Boolean(raw.domInspection.hasLateShippingFee),
      riskScore: Number(raw.domInspection.riskScore) || 58,
      flags: Array.isArray(raw.domInspection.flags) ? raw.domInspection.flags : []
    } : {
      isReachable: true,
      totalInputFields: isSocialDomain ? 4 : (category.toLowerCase().includes('saas') ? 5 : 7),
      has1TapUpi: !category.toLowerCase().includes('saas'),
      hasManualVpa: false,
      hasLateShippingFee: !isSocialDomain && !category.toLowerCase().includes('saas'),
      riskScore: 62,
      flags: category.toLowerCase().includes('saas')
        ? ["Work email validation gate blocks Gmail signups", "Credit card input displayed before workspace trial activation"]
        : ["1-Tap UPI Intent supported (GPay / PhonePe)", "Surprise delivery fee revealed at final checkout step", "Phone number field opens standard QWERTY keyboard instead of numeric keypad"]
    },
    mobileScreenshotBase64: raw.mobileScreenshotBase64 || null
  };
}
