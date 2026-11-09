"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  ScanEye, 
  Terminal, 
  Copy, 
  Check, 
  Sparkles,
  Database,
  Layers,
  Code2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Upload,
  Download,
  X,
  FileSpreadsheet,
  Image as ImageIcon,
  Globe
} from 'lucide-react';
import RealisticPhoneMockup from '@/components/RealisticPhoneMockup';

// 1. ULTRA-SMOOTH BEZIER TOPOGRAPHIC MESH BACKGROUND
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

// 2. DATA MODEL & MULTI-INDUSTRY PRESETS
type PresetKey = 'd2c' | 'fintech' | 'edtech' | 'custom';

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
  id: PresetKey;
  label: string;
  tagline: string;
  url: string;
  visitors: number;
  dropoff: number;
  aov: number;
  lift: string;
  recoveredLakhsEst: string;
  steps: FunnelStep[];
  pins: PinItem[];
  sql: string;
  sqlResults: SqlRow[];
  sqlFinding: string;
  voiceSummary: string;
  beforeHeadline: string;
  beforeSubhead: string;
  afterHeadline: string;
  afterSubhead: string;
  remediationFileName: string;
  remediationCode: string;
  prdDocumentId: string;
  prdProblemStatement: string;
  prdHypothesis: string;
  prdUserStories: string[];
  prdAcceptanceCriteria: string[];
  prdRolloutPlan: string;
}

const PRESET_DATASETS: Record<Exclude<PresetKey, 'custom'>, Dataset> = {
  d2c: {
    id: 'd2c',
    label: '🛍️ Online Store Checkout [-71.7%]',
    tagline: 'QuickStyle D2C Mobile Funnel',
    url: 'https://quickstyle-d2c.in/checkout/step-4',
    visitors: 25000,
    dropoff: 71.7,
    aov: 1850,
    lift: '+38% CR LIFT',
    recoveredLakhsEst: '₹73.0L',
    steps: [
      { step: '01. Product Viewed', users: '1,00,000', pct: 100 },
      { step: '02. Added to Bag', users: '38,400', pct: 38.4 },
      { step: '03. Checkout Initiated', users: '25,000', pct: 65.1 },
      { step: '04. Address & Payment', users: '7,075', pct: 28.3, drop: '-71.7% DROP-OFF', critical: true },
      { step: '05. Order Confirmed', users: '6,580', pct: 93.0 },
    ],
    pins: [
      { id: '01', title: 'Forced Sign-In Pop-up', desc: 'Demanding an account and OTP before payment causes 41.2% of shoppers to leave immediately.', metric: '41.2% Drop-off' },
      { id: '02', title: 'Hidden Extra Fees', desc: 'Adding ₹149 delivery and handling fees at the final confirmation step shocks buyers.', metric: '31.4% Rage Clicks' },
      { id: '03', title: 'Manual UPI ID Required', desc: 'Forcing shoppers to manually type their UPI VPA (like name@oksbi) causes 48.2% to abandon due to typos and forgotten IDs.', metric: '48.2% Drop-off' },
    ],
    sql: `SELECT device_os, app_version,
  ROUND(AVG(upi_latency_ms), 0) AS p95_ms,
  ROUND(SUM(dropped_step_4)*100.0/COUNT(*), 1) AS churn_pct
FROM \`telemetry.checkout_funnel_v4\`
WHERE step_index = 4 
GROUP BY 1, 2 
ORDER BY churn_pct DESC;`,
    sqlResults: [
      { os: 'Android WebView (v4.2)', latency: '4,280 ms', churn: '78.4%' },
      { os: 'iOS Safari (v17.2)', latency: '610 ms', churn: '54.1%' },
      { os: 'Desktop Chrome (v122)', latency: '380 ms', churn: '42.0%' },
    ],
    sqlFinding: 'Android WebView users face a 4,280ms latency on UPI payments. Paired with the forced email login modal, 78.4% abandon before completing payment.',
    voiceSummary: 'Diagnostic complete for QuickStyle D2C. Step 4 leaks 331.6 Lakhs per month. 78.4 percent of drops occur on Android WebView due to a forced login modal combined with slow UPI payment redirection. Deploying our 1-Tap Guest UPI Express component recovers 73 Lakhs monthly.',
    beforeHeadline: 'Current Flow: Forced Sign-In + Surprise Fees',
    beforeSubhead: '3 Major Conversion Obstacles Found on the Mobile Checkout Screen',
    afterHeadline: 'Optimized Flow: 1-Tap Guest UPI Express',
    afterSubhead: 'No Login Required · Upfront Free Delivery · Instant UPI Deep-Link',
    remediationFileName: 'components/checkout/ExpressUpiCheckout.tsx',
    remediationCode: `// Auto-Synthesized by FunnelDoctor Gemini 2.5 Code Agent
// Resolves: Fault #01 (Forced OTP), Fault #02 (Late Fee), Fault #03 (Fold Push)

import React, { useState } from 'react';

interface ExpressCheckoutProps {
  cartTotal?: number;
  freeShippingThreshold?: number;
  onPaymentSuccess?: (txnId: string) => void;
}

export function ExpressUpiCheckout({
  cartTotal = 1850,
  freeShippingThreshold = 999,
  onPaymentSuccess
}: ExpressCheckoutProps) {
  const [selectedApp, setSelectedApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const qualifiesForFreeShipping = cartTotal >= freeShippingThreshold;

  const handleInstantPay = () => {
    setIsProcessing(true);
    // Deep-link native UPI Intent URI bypassing slow Android WebView redirection
    const upiUri = \`upi://pay?pa=quickstyle@icici&pn=QuickStyle&am=\${cartTotal}&cu=INR\`;
    window.location.href = upiUri;
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess?.('UPI_TXN_' + Date.now());
    }, 1200);
  };

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs font-sans">
      {/* 1. UPFRONT TRANSPARENCY: FREE DELIVERY UNLOCKED */}
      <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-xs font-mono">
        <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          {qualifiesForFreeShipping ? '✓ ZERO HIDDEN FEES: FREE SHIPPING UNLOCKED' : \`Add ₹\${freeShippingThreshold - cartTotal} for Free Express Delivery\`}
        </span>
        <span className="text-emerald-700 font-bold">₹0.00</span>
      </div>

      {/* 2. GUEST 1-TAP ADDRESS (AUTOFILLED VIA WHATSAPP/SMS TOKEN) */}
      <div className="flex items-center justify-between py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs mb-4">
        <div>
          <span className="text-neutral-400 font-mono text-[10px] block">DELIVERY ADDRESS (PRE-FILLED)</span>
          <span className="font-medium text-neutral-800">Flat 402, Indiranagar, Bengaluru</span>
        </div>
        <button className="text-neutral-500 hover:text-black font-mono text-[11px] underline">Change</button>
      </div>

      {/* 3. 1-TAP INSTANT UPI APP SELECTOR */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { id: 'gpay', label: 'Google Pay' },
          { id: 'phonepe', label: 'PhonePe' },
          { id: 'paytm', label: 'Paytm UPI' }
        ].map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedApp(app.id as any)}
            className={\`py-2 px-3 rounded-lg border text-xs font-mono font-medium transition \${
              selectedApp === app.id
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
            }\`}
          >
            {app.label}
          </button>
        ))}
      </div>

      {/* 4. PRIMARY HIGH-CONVERSION CTA ANCHORED ABOVE FOLD */}
      <button
        onClick={handleInstantPay}
        disabled={isProcessing}
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition active:scale-[0.99] flex items-center justify-center gap-2"
      >
        {isProcessing ? 'Connecting to UPI App...' : \`1-Tap Pay ₹\${cartTotal.toLocaleString()} · No Login Required\`}
      </button>
    </div>
  );
}`,
    prdDocumentId: 'PRD-2026-D2C-STEP04',
    prdProblemStatement: 'QuickStyle D2C Step 4 suffers a 71.7% drop-off across 25,000 monthly sessions, bleeding ₹331.6L/mo. Analysis isolates 41.2% modal abandonments on mandatory email sign-in and a 4,280ms Android WebView UPI latency spike.',
    prdHypothesis: 'Replacing the forced modal with frictionless 1-Tap Guest UPI and disclosing shipping upfront will lift funnel conversion rate by +38%, recovering an estimated ₹73.0L monthly.',
    prdUserStories: [
      'As a guest shopper, I want to complete my purchase via PhonePe/GPay without creating a password or verifying an email OTP.',
      'As a mobile buyer on 4G, I want the native UPI intent app to launch instantly without a 4-second blank WebView redirect.',
      'As a price-conscious user, I want total order transparency upfront with zero surprise surcharges at the final button.'
    ],
    prdAcceptanceCriteria: [
      'P95 latency from clicking "Pay via UPI" to native app launch must remain under 650ms on Android WebView v4.2+.',
      'Zero blocking account creation modals allowed for carts under ₹10,000.',
      'Free shipping eligibility must render dynamically as a visual progress bar on the first line of the payment card.'
    ],
    prdRolloutPlan: 'Canary launch: 10% traffic allocation on Android WebView cohorts. Automated rollback threshold: UPI callback failure rate > 1.2%.'
  },
  fintech: {
    id: 'fintech',
    label: '💳 Banking & KYC Onboarding [-74.8%]',
    tagline: 'FinPulse Neo Credit Onboarding',
    url: 'https://finpulse-neo.in/onboarding/video-kyc',
    visitors: 18000,
    dropoff: 74.8,
    aov: 3200,
    lift: '+44% KYC COMPLETION',
    recoveredLakhsEst: '₹94.8L',
    steps: [
      { step: '01. Landing Page', users: '80,000', pct: 100 },
      { step: '02. Mobile OTP Verified', users: '52,000', pct: 65.0 },
      { step: '03. PAN & Income Verified', users: '18,000', pct: 34.6 },
      { step: '04. Aadhaar & Video KYC', users: '4,536', pct: 25.2, drop: '-74.8% DROP-OFF', critical: true },
      { step: '05. Credit Line Activated', users: '4,310', pct: 95.0 },
    ],
    pins: [
      { id: '01', title: 'Camera Permission Without Context', desc: 'Browser requests camera and microphone access before explaining why a video call is needed.', metric: '46% Denied' },
      { id: '02', title: 'Confusing Error Code', desc: 'Showing raw "Error 402" when photo has glare confuses users instead of telling them how to retake it.', metric: '52% Abandon' },
      { id: '03', title: 'Long Wait for Live Agent', desc: 'Applicants wait over 4 minutes in queue for a video officer before giving up.', metric: '4m+ Wait Time' },
    ],
    sql: `SELECT kyc_method, error_code,
  ROUND(AVG(wait_time_sec), 1) AS avg_wait_s,
  ROUND(SUM(abandoned)*100.0/COUNT(*), 1) AS churn_pct
FROM \`finpulse_prod.kyc_telemetry\`
WHERE funnel_stage = 'STEP_04_VKYC'
GROUP BY 1, 2 
ORDER BY churn_pct DESC;`,
    sqlResults: [
      { os: 'Live Video Queue (ERR_402)', latency: '274.0 s wait', churn: '84.2%' },
      { os: 'Manual PAN Upload', latency: '48.5 s wait', churn: '68.0%' },
      { os: 'DigiLocker OAuth (Async)', latency: '11.2 s wait', churn: '31.4%' },
    ],
    sqlFinding: 'Applicants waiting in the synchronous live video queue wait 274 seconds on average, with 84.2% abandoning when hit with glare error 402. DigiLocker OAuth routing reduces dropoff to 31.4%.',
    voiceSummary: 'Diagnostic complete for FinPulse Neo. 74.8 percent of credit-approved applicants abandon at Step 4 Video KYC. Telemetry proves users queued for live agents wait 274 seconds before dropping. Switching primary onboarding to 1-Click DigiLocker OAuth with an anti-glare scanner recovers 94.8 Lakhs monthly.',
    beforeHeadline: 'Current Flow: Camera Confusion & 4.5m Video Queue',
    beforeSubhead: 'Premature Permissions + Long Agent Waiting Queue',
    afterHeadline: 'Optimized Flow: 1-Click DigiLocker Verification',
    afterSubhead: 'Instant Aadhaar Pull in 10s · Anti-Glare Scanner · Zero Wait Time',
    remediationFileName: 'components/kyc/DigiLockerKycExpress.tsx',
    remediationCode: `// Auto-Synthesized by FunnelDoctor Gemini 2.5 Code Agent
// Resolves: Fault #01 (Premature Permission), Fault #02 (Glare Error), Fault #03 (Queue Delay)

import React, { useState } from 'react';

export function DigiLockerKycExpress({ onSuccess }: { onSuccess?: () => void }) {
  const [method, setMethod] = useState<'digilocker' | 'video'>('digilocker');
  const [isVerifying, setIsVerifying] = useState(false);

  const triggerDigiLockerAuth = () => {
    setIsVerifying(true);
    // Instant asynchronous verification avoiding live video queue
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess?.();
    }, 1500);
  };

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs font-sans">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
          ID
        </div>
        <div>
          <h4 className="font-bold text-sm text-neutral-900">Government KYC Verification</h4>
          <span className="text-[11px] font-mono text-emerald-700">✓ RBI & UIDAI COMPLIANT DIRECT API</span>
        </div>
      </div>

      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl mb-4">
        <span className="text-xs font-semibold text-emerald-900 block mb-1">
          Instant Paperless Verification (Recommended)
        </span>
        <p className="text-xs text-emerald-800 leading-relaxed font-normal">
          Pulls your verified Aadhaar & PAN directly via DigiLocker. Zero video calls, no agent queue wait.
        </p>
      </div>

      <button
        onClick={triggerDigiLockerAuth}
        disabled={isVerifying}
        className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition"
      >
        {isVerifying ? 'Authenticating via DigiLocker...' : 'Verify in 10s with DigiLocker →'}
      </button>
    </div>
  );
}`,
    prdDocumentId: 'PRD-2026-FINTECH-VKYC',
    prdProblemStatement: 'FinPulse Neo loses 74.8% of credit-approved users at Step 4 Video KYC, resulting in ₹430.9L/mo lost credit disbursement GMV due to agent queue times (274s avg) and premature camera permission drops.',
    prdHypothesis: 'Defaulting to 1-Click DigiLocker XML Aadhaar authentication will decrease verification dropoff by 44% while maintaining 100% RBI regulatory compliance.',
    prdUserStories: [
      'As a loan applicant, I want to verify my identity instantly via DigiLocker without waiting for a live agent to get free.',
      'As an Android user, I want clear context before my browser asks for camera permission.',
      'As a user in poor lighting, I want smart on-screen guidance on glare reduction instead of an opaque ERR_402 alert.'
    ],
    prdAcceptanceCriteria: [
      'DigiLocker OAuth redirect loop must complete in <12 seconds end-to-end.',
      'Live agent queue must only be triggered as a fallback if DigiLocker OTP fails twice.',
      'Camera permission modal must include an explanatory bottom-sheet explaining RBI mandatory face-match requirements.'
    ],
    prdRolloutPlan: 'Canary launch: 25% allocation on salaried tier-1 cohort. Monitor KYC pass rate & compliance audit logs.'
  },
  edtech: {
    id: 'edtech',
    label: '🎓 Course & Subscription Paywall [-96.5%]',
    tagline: 'PrepMate AI Test-Prep Paywall',
    url: 'https://prepmate-ai.com/upgrade/pro-pass',
    visitors: 40000,
    dropoff: 96.5,
    aov: 999,
    lift: '+62% TRIAL-TO-PAID',
    recoveredLakhsEst: '₹84.6L',
    steps: [
      { step: '01. Free Sign Up', users: '95,000', pct: 100 },
      { step: '02. Diagnostic Mock Taken', users: '64,000', pct: 67.3 },
      { step: '03. AI Score Report Viewed', users: '40,000', pct: 62.5 },
      { step: '04. Pro Paywall Modal', users: '1,400', pct: 3.5, drop: '-96.5% DROP-OFF', critical: true },
      { step: '05. Subscription Active', users: '1,310', pct: 93.5 },
    ],
    pins: [
      { id: '01', title: 'Expensive Annual Plan by Default', desc: 'Showing ₹4,999/year upfront scares students away within 4 seconds.', metric: '89% Quick Exit' },
      { id: '02', title: 'All Answers Completely Locked', desc: 'Locking 100% of solutions gives zero free preview of how helpful the explanations are.', metric: 'Zero Value Sample' },
      { id: '03', title: 'No Easy-Cancel Notice', desc: 'Buyers hesitate to start recurring payments when they don\'t see an explicit cancel-anytime guarantee.', metric: 'High Hesitation' },
    ],
    sql: `SELECT pricing_variant, user_segment,
  COUNT(DISTINCT student_id) AS views,
  ROUND(AVG(time_on_paywall_sec), 1) AS dwell_sec,
  ROUND(SUM(converted)*100.0/COUNT(*), 2) AS conv_pct
FROM \`prepmate.paywall_experiments\`
GROUP BY 1, 2 
ORDER BY conv_pct ASC;`,
    sqlResults: [
      { os: 'Annual ₹4,999 Upfront', latency: '3.2 s dwell', churn: '98.1%' },
      { os: 'Quarterly ₹1,799', latency: '9.4 s dwell', churn: '93.4%' },
      { os: 'Weekly Sachet ₹149', latency: '24.8 s dwell', churn: '84.2%' },
    ],
    sqlFinding: 'Students dwell for only 3.2 seconds on the ₹4,999 annual plan with 98.1% bounce. The ₹149 weekly sachet pass increases dwell to 24.8 seconds and triples trial conversion.',
    voiceSummary: 'Diagnostic complete for PrepMate EdTech. 96.5 percent of students exit at the paywall in under 4 seconds due to the 4,999 rupee annual default plan. Introducing a 149 rupee 7-day Exam Sprint sachet pass with 2 unlocked AI answer explanations lifts paid conversion by 62 percent.',
    beforeHeadline: 'Current Flow: ₹4,999 Price Shock & Locked Answers',
    beforeSubhead: 'Expensive Default Plan + Missing Cancel Guarantee',
    afterHeadline: 'Optimized Flow: ₹149 Weekly Sprint Pass',
    afterSubhead: '2 Free Unlocked Explanations · 1-Click Cancel Guarantee',
    remediationFileName: 'components/paywall/SachetSprintPass.tsx',
    remediationCode: `// Auto-Synthesized by FunnelDoctor Gemini 2.5 Code Agent
// Resolves: Fault #01 (Sticker Shock), Fault #02 (Zero Value Hook), Fault #03 (Autopay Fear)

import React, { useState } from 'react';

export function SachetSprintPass({ onSubscribe }: { onSubscribe?: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState<'sachet' | 'annual'>('sachet');

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs font-sans">
      <div className="mb-4">
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
          VALUE HOOK ACTIVE: 2 AI EXPLANATIONS UNLOCKED
        </span>
        <h4 className="font-bold text-base text-neutral-900 mt-1">Unlock Full NEET Diagnostic Mock Review</h4>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setSelectedPlan('sachet')}
          className={\`p-3.5 rounded-xl border text-left transition \${
            selectedPlan === 'sachet'
              ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500'
              : 'bg-white border-neutral-200'
          }\`}
        >
          <span className="text-xs font-bold block text-neutral-900">7-Day Exam Sprint</span>
          <span className="text-lg font-bold font-mono text-emerald-700">₹149</span>
          <span className="text-[10px] text-neutral-500 block">Cancel anytime in 1 click</span>
        </button>

        <button
          onClick={() => setSelectedPlan('annual')}
          className={\`p-3.5 rounded-xl border text-left transition \${
            selectedPlan === 'annual'
              ? 'bg-neutral-900 text-white border-neutral-900'
              : 'bg-white border-neutral-200'
          }\`}
        >
          <span className="text-xs font-bold block">1-Year Full Access</span>
          <span className="text-lg font-bold font-mono">₹4,999</span>
          <span className="text-[10px] text-neutral-400 block">Save ₹2,789 / year</span>
        </button>
      </div>

      <button
        onClick={onSubscribe}
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition"
      >
        {selectedPlan === 'sachet' ? 'Start 7-Day Sprint for ₹149 · 1-Click UPI' : 'Get Annual Pass for ₹4,999'}
      </button>

      <span className="text-[10px] text-center block text-neutral-400 mt-2 font-mono">
        🛡️ Instant UPI Autopay Cancel Guarantee via WhatsApp
      </span>
    </div>
  );
}`,
    prdDocumentId: 'PRD-2026-EDTECH-PAYWALL',
    prdProblemStatement: 'PrepMate AI exhibits an extreme 96.5% paywall churn across 40,000 mock takers. Dwell time is 3.2s due to a ₹4,999 default annual barrier with zero preview value.',
    prdHypothesis: 'Unlocking 2 AI answer solutions for free and offering a ₹149 7-day sachet sprint will lift trial-to-paid conversion by +62%, generating an additional ₹84.6L monthly.',
    prdUserStories: [
      'As a student preparing for exams this Sunday, I want a micro ₹149 weekly pass instead of being forced into an annual commitment.',
      'As a test taker, I want to read 2 detailed AI explanations first so I know the quality before paying.',
      'As a student using parent UPI, I want an explicit guarantee that recurring payments can be stopped in 1 click.'
    ],
    prdAcceptanceCriteria: [
      'Top 2 missed questions must render full solution without paywall blur.',
      '₹149 Sachet Sprint must be the default pre-selected option on mobile viewports.',
      'Clear 1-Click Mandate cancellation badge must be rendered directly underneath the primary CTA.'
    ],
    prdRolloutPlan: 'Canary launch: 30% traffic allocation on upcoming exam weekend mock test cohorts.'
  }
};

// SAMPLE CSV DATA FOR 1-CLICK PRE-FILL IN CUSTOM AUDIT
const SAMPLE_CSV_PREFILL = `step,visitors
01. Landing Page,65000
02. Product Catalog,32400
03. Added to Bag,18200
04. Address & Payment,4950
05. Order Confirmed,4620`;

// 3. MAIN COMPONENT
export default function FunnelDoctorMinimalist() {
  const router = useRouter();
  const [selectedPresetKey, setSelectedPresetKey] = useState<PresetKey>('d2c');
  const [customDataset, setCustomDataset] = useState<Dataset | null>(null);

  const currentData: Dataset = selectedPresetKey === 'custom' && customDataset 
    ? customDataset 
    : PRESET_DATASETS[selectedPresetKey as Exclude<PresetKey, 'custom'>];
  
  const [targetUrl, setTargetUrl] = useState('');
  const [selectedPin, setSelectedPin] = useState(currentData.pins[0].id);
  const [screenViewMode, setScreenViewMode] = useState<'flawed' | 'fixed'>('flawed');
  const heroInputRef = useRef<HTMLInputElement>(null);
  const [activeRemediationTab, setActiveRemediationTab] = useState<'diff' | 'prd' | 'code'>('diff');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrd, setCopiedPrd] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  // Focus and scroll to hero input smoothly
  const focusAuditInput = () => {
    if (heroInputRef.current) {
      heroInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      heroInputRef.current.focus();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Custom Ingestion State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customCsvInput, setCustomCsvInput] = useState('');
  const [customCsvFileName, setCustomCsvFileName] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customScreenshotBase64, setCustomScreenshotBase64] = useState<string | null>(null);
  const [customScreenshotName, setCustomScreenshotName] = useState<string | null>(null);
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  // Pricing Modal State
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Financial Sliders
  const [visitors, setVisitors] = useState(currentData.visitors);
  const [dropoff, setDropoff] = useState(currentData.dropoff);
  const [aov, setAov] = useState(currentData.aov);

  // Switch Preset Handler with URL Deep-Linking
  const switchPreset = (key: PresetKey, updateUrl: boolean = true) => {
    setIsAuditing(true);
    setSelectedPresetKey(key);
    const next = key === 'custom' && customDataset ? customDataset : PRESET_DATASETS[key as Exclude<PresetKey, 'custom'>];
    setTargetUrl(next.url);
    setSelectedPin(next.pins[0].id);
    setScreenViewMode('flawed');
    setVisitors(next.visitors);
    setDropoff(next.dropoff);
    setAov(next.aov);

    if (updateUrl && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (key === 'custom') {
        url.searchParams.delete('preset');
      } else {
        url.searchParams.set('preset', key);
      }
      window.history.replaceState({}, '', url.toString());
    }

    setTimeout(() => setIsAuditing(false), 450);
  };

  // URL Deep-Linking Initialization
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get('preset');
    if (p && (p === 'd2c' || p === 'fintech' || p === 'edtech')) {
      switchPreset(p as PresetKey, false);
    }
  }, []);

  // Target URL Input & Audit Submission Handler
  const handleRunAudit = () => {
    const trimmedInput = targetUrl.trim();
    if (!trimmedInput) {
      document.getElementById('telemetry')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const domainMatch = trimmedInput.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    const auditSlug = domainMatch.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'audit-report';
    setIsAuditing(true);
    router.push(`/audit/${auditSlug}`);
  };

  // Financial Math
  const leakedLakhs = ((visitors * (dropoff / 100) * aov) / 100000).toFixed(1);
  const recoverableLakhs = (Number(leakedLakhs) * 0.22).toFixed(1);
  const annualizedCr = ((Number(recoverableLakhs) * 12) / 100).toFixed(2);

  // Voice Briefing
  const toggleVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
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

  // Copy Handlers
  const handleCopySql = () => {
    navigator.clipboard?.writeText(currentData.sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentData.remediationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCli = () => {
    navigator.clipboard?.writeText(`npx @funneldoctor/core audit --file ./funnel.csv --url ${currentData.url}`);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyPrd = () => {
    const prdText = `# ${currentData.prdDocumentId} — EXECUTIVE PRD
## Problem Statement
${currentData.prdProblemStatement}

## Hypothesis & Metric
${currentData.prdHypothesis}

## User Stories
${currentData.prdUserStories.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Acceptance Criteria
${currentData.prdAcceptanceCriteria.map((c, i) => `- [ ] ${c}`).join('\n')}

## Rollout Strategy
${currentData.prdRolloutPlan}
`;
    navigator.clipboard?.writeText(prdText);
    setCopiedPrd(true);
    setTimeout(() => setCopiedPrd(false), 2000);
  };

  // Download Complete RCA Package (.md)
  const handleDownloadFullRcaPackage = () => {
    const pkg = `# FUNNELDOCTOR AI — COMPLETE EXECUTIVE CONVERSION RCA & SPECIFICATION PACKAGE
**Generated At**: ${new Date().toISOString()}
**Project URL**: ${currentData.url}
**Industry & Segment**: ${currentData.tagline}
**Diagnostic Engine**: Multimodal Conversion Diagnostic & Remediation Pipeline
**Specification ID**: ${currentData.prdDocumentId}

================================================================================
01. EXECUTIVE BRIEFING & HIGH-LEVEL TELEMETRY
================================================================================
${currentData.voiceSummary}

- Ingested Monthly Visitors: ${visitors.toLocaleString()} sessions
- Critical Drop-Off Stage: Step 04 (${dropoff}% Churn Rate)
- Current Monthly Revenue Leaked: ₹${leakedLakhs} Lakhs / mo
- Projected Recoverable Capital (+22% Lift): +₹${recoverableLakhs} Lakhs / mo
- Annualized ARR Enterprise Impact: +₹${annualizedCr} Crores / yr

================================================================================
02. QUANTITATIVE FUNNEL PROGRESSION WATERFALL
================================================================================
| Step # | Stage Name | Monthly Visitors | Churn Status |
|--------|------------|------------------|--------------|
${currentData.steps.map((s, idx) => `| ${idx + 1} | ${s.step} | ${s.users} users | ${s.drop || 'Normal'} |`).join('\n')}

================================================================================
03. GEMINI 2.5 SPATIAL VISION X-RAY FINDINGS
================================================================================
${currentData.pins.map(p => `### [FAULT #${p.id}] ${p.title}
- Impact Metric: ${p.metric}
- Root Cause Detail: ${p.desc}
`).join('\n')}

================================================================================
04. BIGQUERY QUANTITATIVE SQL TELEMETRY PROOF
================================================================================
\`\`\`sql
${currentData.sql}
\`\`\`

Executed Cohort Telemetry:
${currentData.sqlResults.map(r => `- ${r.os}: ${r.latency} latency | ${r.churn} drop-off rate`).join('\n')}

Core RCA Telemetry Finding:
${currentData.sqlFinding}

================================================================================
05. EXECUTIVE PRODUCT REQUIREMENTS DOCUMENT (PRD)
================================================================================
## Problem Statement
${currentData.prdProblemStatement}

## Hypothesis & Target Metrics
${currentData.prdHypothesis}

## User Stories & Edge Cases
${currentData.prdUserStories.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Engineering Acceptance Criteria
${currentData.prdAcceptanceCriteria.map(c => `- [ ] ${c}`).join('\n')}

## Canary Rollout & Validation Strategy
${currentData.prdRolloutPlan}

================================================================================
06. AUTO-SYNTHESIZED PRODUCTION REACT COMPONENT
================================================================================
File: ${currentData.remediationFileName}

\`\`\`tsx
${currentData.remediationCode}
\`\`\`

================================================================================
END OF AUDIT PACKAGE · FUNNELDOCTOR AI · OPEN SOURCE ENGINE
================================================================================
`;
    const blob = new Blob([pkg], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FunnelDoctor-RCA-Package-${selectedPresetKey}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Custom CSV File Upload Handler
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomCsvFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setCustomCsvInput(text);
          setCustomError(null);
        }
      };
      reader.readAsText(file);
    }
  };

  // Custom Screenshot Upload Handler
  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomScreenshotBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Custom Audit to /api/audit
  const handleRunCustomAudit = async () => {
    const urlTarget = customUrlInput.trim() || targetUrl.trim();
    if (!urlTarget) {
      setCustomError('Please enter a target website or store URL.');
      return;
    }

    const domainMatch = urlTarget.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    const auditSlug = domainMatch.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'audit-report';

    const isUntouchedSample = customCsvInput.trim() === SAMPLE_CSV_PREFILL.trim();
    const hasNoCsv = !customCsvInput.trim();

    // INTELLIGENT ROUTING: If no CSV was provided, or if the user typed a real domain (like nike.in)
    // but left the dummy demo CSV untouched, DO NOT poison their store with generic sample data.
    // Seamlessly run the authentic domain audit for their website!
    if (hasNoCsv || (isUntouchedSample && urlTarget && !urlTarget.includes('mybrand.in'))) {
      setIsCustomModalOpen(false);
      router.push(`/audit/${auditSlug}`);
      return;
    }

    setCustomError(null);
    setIsSubmittingCustom(true);

    try {
      const screenshots = customScreenshotBase64
        ? [{
            stepName: 'Custom Checkout Viewport',
            viewport: 'mobile' as const,
            base64Data: customScreenshotBase64.split(',')[1] || customScreenshotBase64,
            mimeType: 'image/png'
          }]
        : [];

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvText: customCsvInput,
          websiteUrl: customUrlInput,
          screenshots
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Audit analysis failed.');
      }

      const report = data.report;
      const metrics = report.funnelMetrics;
      const dropRatePct = Number((metrics.biggestDropStep.dropoffRate * 100).toFixed(1));

      const newCustomDataset: Dataset = {
        id: 'custom',
        label: `✨ Custom Ingested [-${dropRatePct}%]`,
        tagline: `Custom Ingested Funnel (${customUrlInput})`,
        url: customUrlInput,
        visitors: metrics.totalInitialVisitors,
        dropoff: dropRatePct,
        aov: 1500,
        lift: `+${Math.min(50, Math.round(dropRatePct * 0.45))}% CR LIFT`,
        recoveredLakhsEst: `₹${((metrics.totalInitialVisitors * (dropRatePct / 100) * 1500 * 0.22) / 100000).toFixed(1)}L`,
        steps: metrics.steps.map((s: any, idx: number) => {
          const cleanName = s.name.replace(/^(\d+[\s.)-]+\s*)+/, '').trim();
          return {
            step: `${(idx + 1).toString().padStart(2, '0')}. ${cleanName || s.name}`,
            users: s.visitors.toLocaleString(),
            pct: metrics.totalInitialVisitors > 0 ? Number(((s.visitors / metrics.totalInitialVisitors) * 100).toFixed(1)) : 0,
            drop: s.dropoffRate > 0 ? `-${(s.dropoffRate * 100).toFixed(1)}% CHURN` : undefined,
            critical: s.index === metrics.biggestDropStep.index
          };
        }),
        pins: report.findings.slice(0, 3).map((f: any, idx: number) => ({
          id: (idx + 1).toString().padStart(2, '0'),
          title: f.headline || `Fault #${idx + 1}`,
          desc: f.explanation || f.actionableFix,
          metric: `${f.dropoffContributionEstPercent || 35}% Impact`
        })),
        sql: `SELECT device_cohort, browser_version,
  COUNT(DISTINCT session_id) AS sessions,
  ROUND(AVG(interaction_latency_ms), 0) AS p95_latency_ms,
  ROUND(SUM(dropped_stage)*100.0/COUNT(*), 1) AS drop_pct
FROM \`custom_telemetry.funnel_events_v1\`
WHERE stage_name = '${metrics.biggestDropStep.name}'
GROUP BY 1, 2 ORDER BY drop_pct DESC;`,
        sqlResults: [
          { os: 'Mobile WebView Cohort', latency: '3,840 ms', churn: `${Math.min(95, dropRatePct + 4)}%` },
          { os: 'Mobile Chrome / Safari', latency: '720 ms', churn: `${Math.max(25, dropRatePct - 14)}%` },
          { os: 'Desktop Browser', latency: '410 ms', churn: `${Math.max(15, dropRatePct - 24)}%` }
        ],
        sqlFinding: report.executiveSummary,
        voiceSummary: report.executiveSummary,
        beforeHeadline: `Baseline: Critical Drop at ${metrics.biggestDropStep.name}`,
        beforeSubhead: `${report.findings.length} Multimodal Anomalies Detected by Gemini 2.5`,
        afterHeadline: `Synthesized Fix: ${report.findings[0]?.actionableFix?.slice(0, 42) || 'Optimized Funnel Step'}`,
        afterSubhead: 'Automated PRD & Production Component Code Generated in 60s',
        remediationFileName: 'components/custom/RemediatedStep.tsx',
        remediationCode: report.redesignCodeSuggestion || `// Auto-Synthesized by FunnelDoctor Gemini 2.5 Code Agent\n// Remediation for ${metrics.biggestDropStep.name}\n\nimport React from 'react';\n\nexport function RemediatedStep() {\n  return (\n    <div className="p-6 bg-white border border-neutral-200 rounded-2xl font-sans">\n      <h3 className="font-bold text-base text-neutral-900 mb-2">Optimized Conversion Step</h3>\n      <p className="text-xs text-neutral-600 mb-4">Eliminates identified visual friction and delays.</p>\n      <button className="w-full py-3 bg-emerald-600 text-white font-mono text-xs uppercase font-semibold rounded-xl">\n        Continue Seamlessly →\n      </button>\n    </div>\n  );\n}`,
        prdDocumentId: `PRD-CUSTOM-${Date.now().toString().slice(-4)}`,
        prdProblemStatement: report.executiveSummary,
        prdHypothesis: `Addressing visual friction and latency at ${metrics.biggestDropStep.name} will recover significant dropped conversions.`,
        prdUserStories: report.findings.map((f: any) => `As a user at ${f.stepName}, I want ${f.actionableFix}.`),
        prdAcceptanceCriteria: report.findings.map((f: any) => `${f.headline} must be resolved without regressions.`),
        prdRolloutPlan: '10% Canary rollout monitoring step conversion and gateway error rates.'
      };

      const domainMatch = customUrlInput.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      const auditSlug = domainMatch.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'audit-report';

      if (typeof window !== 'undefined') {
        localStorage.setItem(`fd_audit_${auditSlug}`, JSON.stringify(newCustomDataset));
        localStorage.setItem('fd_last_custom_audit', JSON.stringify(newCustomDataset));
      }

      setCustomDataset(newCustomDataset);
      setSelectedPresetKey('custom');
      setTargetUrl(customUrlInput);
      setVisitors(newCustomDataset.visitors);
      setDropoff(newCustomDataset.dropoff);
      setAov(newCustomDataset.aov);
      setSelectedPin(newCustomDataset.pins[0]?.id || '01');
      setIsCustomModalOpen(false);

      // Seamlessly navigate to dedicated, distraction-free report page
      router.push(`/audit/${auditSlug}`);
    } catch (err: any) {
      setCustomError(err.message || 'Failed to analyze custom funnel.');
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#09090B] font-sans selection:bg-emerald-500/20 selection:text-emerald-900 relative">
      
      {/* Topographic Mesh Background */}
      <TopographicMesh />

      {/* Atmospheric Ambient Glow (Apple / Linear Aesthetic) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-gradient-to-b from-emerald-500/[0.04] via-teal-500/[0.015] to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-blue-500/[0.015] rounded-full blur-3xl" />
        <div className="absolute top-[65%] -right-[10%] w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-3xl" />
      </div>

      {/* 1. MINIMALIST, PREMIUM SWISS NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#FBFBFB]/75 backdrop-blur-xl border-b border-neutral-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
              FD
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-sm text-neutral-900">
                FunnelDoctor
              </span>
              <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                v2.5
              </span>
            </div>
          </Link>
          
          {/* Plain English Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-500">
            <a href="#telemetry" className="hover:text-neutral-950 transition-colors">Funnel Flow</a>
            <a href="#xray" className="hover:text-neutral-950 transition-colors">Screen X-Ray</a>
            <a href="#remediation" className="hover:text-neutral-950 transition-colors text-emerald-700 font-semibold">The Fix</a>
            <a href="#calculator" className="hover:text-neutral-950 transition-colors">Revenue Impact</a>
            <button 
              onClick={() => setIsPricingModalOpen(true)}
              className="hover:text-neutral-950 transition-colors flex items-center gap-1 cursor-pointer text-neutral-600"
            >
              <span>Pricing</span>
              <span className="text-[9px] bg-neutral-200/80 text-neutral-700 px-1 py-0.5 rounded font-mono font-bold">B2B</span>
            </button>
          </nav>

          {/* Action Group */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={focusAuditInput}
              className="px-4 py-1.5 text-xs font-mono uppercase tracking-wider bg-neutral-950 hover:bg-black text-white font-medium rounded-lg transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
            >
              Audit Store →
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-32 space-y-24">
        
        {/* 2. HERO SECTION: VALUE PROP & DUAL-ACTION AUDIT GATEWAY */}
        <section className="max-w-5xl mx-auto text-center pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-mono font-medium text-emerald-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            AI-Powered Conversion Optimization
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-bold tracking-tight leading-[1.12] text-[#09090B] mb-6">
            <span className="block">See where your users drop&nbsp;off.</span>
            <span className="block text-neutral-400 font-normal mt-1 sm:mt-2">Fix it with clean code in 60s.</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10">
            FunnelDoctor analyzes your checkout and signup flows, pinpoints why visitors drop off, and gives you ready-to-use code fixes and product specifications.
          </p>

          {/* UNIFIED HERO AUDIT COMMAND BOX */}
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl border border-neutral-200/90 rounded-2xl p-2.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.07),0_0_0_1px_rgba(255,255,255,0.9)_inset] transition-all hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,1)_inset]">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 w-full font-mono text-xs text-neutral-500">
                <Globe className="w-4 h-4 text-neutral-400 shrink-0" />
                <input 
                  ref={heroInputRef}
                  type="text" 
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleRunAudit();
                    }
                  }}
                  placeholder="Enter store or SaaS URL (e.g. nike.in, linear.app, yourbrand.com)"
                  className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-mono text-xs" 
                />
              </div>
              <button 
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="w-full sm:w-auto px-6 py-3 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-xs font-medium"
              >
                {isAuditing ? 'Auditing...' : 'Run Free Audit'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ingestion & Telemetry Quick Bar */}
            <div className="mt-2.5 pt-2.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-neutral-500">
                <span className="text-neutral-400">Try live audit:</span>
                <button onClick={() => router.push('/audit/nike-in')} className="text-neutral-700 hover:text-black underline cursor-pointer">Nike</button>
                <span className="text-neutral-300">·</span>
                <button onClick={() => router.push('/audit/amazon')} className="text-neutral-700 hover:text-black underline cursor-pointer">Amazon</button>
                <span className="text-neutral-300">·</span>
                <button onClick={() => router.push('/audit/linear-app')} className="text-neutral-700 hover:text-black underline cursor-pointer">Linear</button>
                <span className="text-neutral-300">·</span>
                <button onClick={() => router.push('/audit/zerodha-com')} className="text-neutral-700 hover:text-black underline cursor-pointer">Zerodha</button>
              </div>

              <button
                onClick={() => setIsCustomModalOpen(true)}
                className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer transition"
              >
                <Upload className="w-3 h-3 text-emerald-600" />
                <span>Have analytics CSV? Upload Funnel →</span>
              </button>
            </div>
          </div>

          {/* 3-STEP EXPLANATION: HOW FUNNELDOCTOR WORKS */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="p-5 bg-white border border-neutral-200/80 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-lg bg-neutral-100 text-neutral-900 font-mono text-xs font-bold flex items-center justify-center">
                  01
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                  INGEST
                </span>
              </div>
              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                Map Conversion Steps
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Paste any store link or upload your CSV. FunnelDoctor maps every step from landing page to checkout.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 bg-white border border-neutral-200/80 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-700 font-mono text-xs font-bold flex items-center justify-center border border-rose-200">
                  02
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-rose-600 font-semibold">
                  DIAGNOSE
                </span>
              </div>
              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                Spot Design Flaws
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Find the exact pop-ups, hidden fees, or broken layouts causing buyers to abandon your store.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 bg-white border border-neutral-200/80 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center border border-emerald-200">
                  03
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
                  REMEDIATE
                </span>
              </div>
              <h3 className="font-bold text-sm text-neutral-900 mb-1">
                Get Instant Code & Specs
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Export production-ready React code to replace the broken screen, plus an executive PRD for your team.
              </p>
            </div>
          </div>
        </section>

        {/* 3. CONVERSION FUNNEL: STEP-BY-STEP PROGRESSION */}
        <section id="telemetry">
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-neutral-100 font-mono text-xs text-neutral-500 gap-3">
              <div>
                <span className="uppercase tracking-wider block text-[11px] text-neutral-400 font-semibold">Conversion Funnel</span>
                <span className="text-neutral-900 font-bold text-sm">{currentData.tagline}</span>
              </div>
              
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>STEP-BY-STEP DROP-OFF TELEMETRY</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {currentData.steps.map((s, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    s.critical 
                      ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-500/20' 
                      : 'bg-[#FAFAFA] border-neutral-200/80'
                  }`}
                >
                  <div className="flex justify-between font-mono text-[11px] text-neutral-500 mb-2">
                    <span className="font-medium">{s.step}</span>
                    {s.drop && <span className="text-rose-600 font-bold">{s.drop}</span>}
                  </div>
                  <div className="text-xl font-bold font-mono tracking-tight mb-2" suppressHydrationWarning>
                    {s.users} <span className="text-xs font-normal text-neutral-400">visitors</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.critical ? 'bg-rose-600' : 'bg-neutral-900'}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. SCREEN X-RAY: INTERACTIVE MOBILE INSPECTION */}
        <section id="xray" className="bg-white/95 backdrop-blur-sm border border-neutral-200/80 rounded-3xl p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03),0_0_0_1px_rgba(255,255,255,0.7)_inset]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Interactive Friction Findings */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category Preset Switcher */}
              <div className="mb-2">
                <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-white/70 backdrop-blur-xl rounded-xl border border-neutral-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.025),0_0_0_1px_rgba(255,255,255,0.8)_inset]">
                  {[
                    { key: 'd2c', label: '🛍️ Online Store' },
                    { key: 'fintech', label: '💳 Banking & KYC' },
                    { key: 'edtech', label: '🎓 Course Paywall' }
                  ].map(({ key, label }) => {
                    const isSelected = selectedPresetKey === key;
                    return (
                      <button
                        key={key}
                        onClick={() => switchPreset(key as PresetKey)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-neutral-900 text-white font-bold shadow-xs' 
                            : 'text-neutral-600 hover:text-black hover:bg-white/60'
                        }`}
                      >
                        <span>{label}</span>
                      </button>
                    );
                  })}
                  {customDataset && (
                    <button
                      onClick={() => switchPreset('custom')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                        selectedPresetKey === 'custom'
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
                      }`}
                    >
                      <span>🔍 Custom Ingested</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-md font-mono text-xs text-neutral-700">
                <ScanEye className="w-4 h-4 text-emerald-600" />
                <span>SCREEN X-RAY // MOBILE AUDIT</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900">
                What's Driving Customers Away
              </h2>

              <p className="text-base text-neutral-600 leading-relaxed font-normal">
                We inspect your mobile checkout screens to locate the design flaws causing customers to leave without paying. Click any issue below to inspect it on the live phone.
              </p>

              <div className="space-y-3 pt-2">
                {currentData.pins.map((pin) => (
                  <div
                    key={pin.id}
                    onClick={() => {
                      setSelectedPin(pin.id);
                      setScreenViewMode('flawed');
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      selectedPin === pin.id
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-1 ring-neutral-900'
                        : 'bg-[#FAFAFA] text-neutral-900 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 font-mono text-xs">
                      <span className="font-bold flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedPin === pin.id ? 'bg-emerald-400 text-neutral-950' : 'bg-neutral-200 text-neutral-800'}`}>
                          {pin.id}
                        </span>
                        <span>{pin.title}</span>
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

            {/* Right Column: Realistic Interactive Mobile Screen Viewport */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-neutral-100/70 p-6 lg:p-10 rounded-2xl border border-neutral-200/60">
              
              {/* Photorealistic Titanium CSS Device Frame */}
              <RealisticPhoneMockup
                selectedIssue={selectedPin}
                viewMode={screenViewMode}
                onToggleViewMode={setScreenViewMode}
                storeName={selectedPresetKey === 'd2c' ? 'QuickStyle Store' : selectedPresetKey === 'fintech' ? 'FinPulse Identity' : selectedPresetKey === 'edtech' ? 'PrepMate Test Prep' : 'Store Checkout'}
              >

                  {/* App Bar & Interactive Mode Switcher */}
                  <div className="px-3.5 py-2 bg-white/90 backdrop-blur-xs border-b border-neutral-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-neutral-900" />
                      <span className="font-semibold text-xs text-neutral-800 tracking-tight">
                        {selectedPresetKey === 'd2c' ? 'QuickStyle Store' : selectedPresetKey === 'fintech' ? 'FinPulse Identity' : selectedPresetKey === 'edtech' ? 'PrepMate Test Prep' : 'Store Checkout'}
                      </span>
                    </div>

                    {/* Mode Switcher Toggle Pill */}
                    <div className="inline-flex p-0.5 bg-neutral-100 rounded-lg text-[10px] font-mono font-medium">
                      <button
                        onClick={() => setScreenViewMode('flawed')}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                          screenViewMode === 'flawed'
                            ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-2xs'
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                        <span>Problem</span>
                      </button>
                      <button
                        onClick={() => setScreenViewMode('fixed')}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                          screenViewMode === 'fixed'
                            ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                        <span>The Fix</span>
                      </button>
                    </div>
                  </div>

                  {/* SCREEN CONTENT BODY */}
                  <div className="flex-1 p-3.5 flex flex-col justify-between relative overflow-hidden">
                    {screenViewMode === 'flawed' ? (
                      /* ==================== FLAWED SCREEN VIEW ==================== */
                      <div className="space-y-3 h-full flex flex-col justify-between">
                        {selectedPresetKey === 'd2c' && (
                          <>
                            {selectedPin === '01' && (
                              /* FLAW 1: Forced Account OTP Modal */
                              <div className="relative h-full flex flex-col justify-between py-2 space-y-3">
                                {/* Background Cart Items (Faded behind modal) */}
                                <div className="opacity-25 blur-[0.6px] space-y-2 pointer-events-none">
                                  <div className="p-2.5 bg-white rounded-xl border border-neutral-200 text-xs">
                                    <div className="flex justify-between font-medium">
                                      <span>Oversized Cotton Tee</span>
                                      <span>₹1,850</span>
                                    </div>
                                    <span className="text-[10px] text-neutral-400">Size: L · Qty: 1</span>
                                  </div>
                                  <div className="p-2.5 bg-white rounded-xl border border-neutral-200 text-xs flex justify-between">
                                    <span className="text-neutral-500">Shipping</span>
                                    <span className="text-emerald-600 font-medium">FREE</span>
                                  </div>
                                </div>

                                {/* Centered Blocking Modal */}
                                <div className="my-auto bg-white rounded-2xl p-4 border border-rose-300 shadow-xl relative z-10 ring-2 ring-rose-500/20">
                                  <div className="flex items-center gap-2 mb-2 text-rose-700">
                                    <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">
                                      🔒
                                    </div>
                                    <span className="font-bold text-xs">Sign In to Continue</span>
                                  </div>
                                  <p className="text-[11px] text-neutral-600 mb-3">
                                    Enter the 6-digit OTP sent to your phone before completing checkout.
                                  </p>
                                  <div className="flex justify-between gap-1 mb-3">
                                    {['4', '9', '·', '·', '·', '·'].map((c, i) => (
                                      <div key={i} className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-300 flex items-center justify-center font-mono text-xs font-bold text-neutral-800">
                                        {c}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="w-full py-2 bg-neutral-900 text-white rounded-xl text-center text-[11px] font-mono font-medium">
                                    Verify & Proceed
                                  </div>
                                </div>

                                {/* Visual Hotspot Annotation */}
                                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-mono text-rose-900 flex items-start gap-2">
                                  <span className="text-rose-600 font-bold shrink-0">⚠️ ISSUE #01:</span>
                                  <span>Forced login popup blocks guest buyers. 41.2% exit within 6 seconds.</span>
                                </div>
                              </div>
                            )}

                            {selectedPin === '02' && (
                              /* FLAW 2: Surprise ₹149 Fee at Confirmation */
                              <div className="relative h-full flex flex-col justify-between py-2 space-y-3">
                                <div className="space-y-2">
                                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                                    Order Summary · Final Confirmation
                                  </div>
                                  <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs space-y-2">
                                    <div className="flex justify-between text-neutral-700">
                                      <span>Items Subtotal</span>
                                      <span>₹1,850</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-700">
                                      <span>Delivery Fee</span>
                                      <span className="text-emerald-700 font-medium">Free</span>
                                    </div>
                                    
                                    {/* Red Highlighted Surprise Surcharge */}
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 font-mono text-[11px]">
                                      <span className="flex items-center gap-1 font-bold">
                                        <span>⚠️</span> Extra Handling Surcharge:
                                      </span>
                                      <span className="font-bold text-rose-700">+₹149</span>
                                    </div>

                                    <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-sm text-neutral-900">
                                      <span>Total Payable</span>
                                      <span className="text-rose-700">₹1,999</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Visual Hotspot Annotation */}
                                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-mono text-rose-900 flex items-start gap-2">
                                  <span className="text-rose-600 font-bold shrink-0">⚠️ ISSUE #02:</span>
                                  <span>Surprise ₹149 added at the last moment causes 31.4% rage clicks & exits.</span>
                                </div>
                              </div>
                            )}

                            {selectedPin === '03' && (
                              /* FLAW 3: Manual UPI ID / VPA Typing Requirement */
                              <div className="relative h-full flex flex-col justify-between py-1 space-y-3">
                                <div className="space-y-3">
                                  {/* Cart Item Preview */}
                                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex justify-between items-center">
                                    <div>
                                      <div className="font-semibold text-neutral-800">Oversized Cotton Tee</div>
                                      <div className="text-[10px] text-neutral-400">Total: ₹1,999 (All-Inclusive)</div>
                                    </div>
                                    <span className="text-[10px] font-mono bg-neutral-200/70 text-neutral-700 px-2 py-0.5 rounded">UPI Mode</span>
                                  </div>

                                  {/* Manual UPI Typing Card (The Friction Point) */}
                                  <div className="p-4 bg-white rounded-2xl border-2 border-rose-500/80 shadow-[0_8px_20px_-6px_rgba(225,29,72,0.15)] space-y-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">📱</span>
                                      <span className="font-semibold text-xs text-neutral-900">Enter UPI ID / VPA</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                                      Type your complete Virtual Payment Address to request payment on your banking app.
                                    </p>
                                    
                                    <div className="space-y-1.5">
                                      <div className="p-2.5 bg-neutral-50 border border-rose-300 rounded-xl flex items-center justify-between text-xs font-mono">
                                        <span className="text-neutral-900">rahul.kumar92@okhdfc</span>
                                        <span className="text-rose-600 text-[10px] font-bold">Typo?</span>
                                      </div>
                                      <div className="text-[10px] text-rose-600 font-mono flex items-center gap-1">
                                        <span>⚠️</span> Invalid UPI handle. Verification failed.
                                      </div>
                                    </div>

                                    <button className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-medium text-xs shadow-xs">
                                      Verify ID & Request Payment
                                    </button>
                                  </div>
                                </div>

                                {/* Visual Hotspot Annotation */}
                                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-mono text-rose-900 flex items-start gap-2">
                                  <span className="text-rose-600 font-bold shrink-0">⚠️ ISSUE #03:</span>
                                  <span>Forcing shoppers to remember & manually type their UPI VPA causes 48.2% drop-off due to typos and forgotten IDs.</span>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {selectedPresetKey === 'fintech' && (
                          /* FINTECH FLAW VIEW */
                          <div className="relative h-full flex flex-col justify-between py-2 space-y-3">
                            {selectedPin === '01' ? (
                              <div className="p-3 bg-white border border-rose-300 rounded-2xl shadow-md space-y-2">
                                <div className="font-bold text-xs text-neutral-900">finpulse-neo.in wants to:</div>
                                <div className="text-xs text-neutral-600 flex items-center gap-1.5">
                                  <span>📹</span> Use your camera & microphone
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                  <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-lg text-[10px] font-bold">Block</span>
                                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-[10px]">Allow</span>
                                </div>
                              </div>
                            ) : selectedPin === '02' ? (
                              <div className="p-3 bg-neutral-900 text-white rounded-2xl space-y-2">
                                <div className="h-24 bg-neutral-800 rounded-xl flex items-center justify-center text-xs text-neutral-400">
                                  [ ID Photo Preview with Glare ]
                                </div>
                                <div className="p-2 bg-rose-900/60 border border-rose-500 rounded-lg text-[11px] font-mono text-rose-200">
                                  ERR_402_GLARE_DETECTED (Scan rejected)
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-white border border-neutral-200 rounded-2xl text-center space-y-2">
                                <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mx-auto" />
                                <span className="font-bold text-xs block text-neutral-800">Waiting for live agent...</span>
                                <p className="text-[10px] text-neutral-500 font-mono">Queue Position #14 · Est. wait: 4m 34s</p>
                              </div>
                            )}

                            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-mono text-rose-900">
                              ⚠️ Issue #{selectedPin}: Causes 74.8% of credit-approved users to drop off.
                            </div>
                          </div>
                        )}

                        {selectedPresetKey === 'edtech' && (
                          /* EDTECH FLAW VIEW */
                          <div className="relative h-full flex flex-col justify-between py-2 space-y-3">
                            {selectedPin === '01' ? (
                              <div className="p-4 bg-white border-2 border-rose-300 rounded-2xl space-y-2 text-center">
                                <span className="text-[10px] font-mono text-rose-600 font-bold uppercase">Default Plan Selected</span>
                                <div className="text-xl font-bold font-mono text-neutral-900">₹4,999 <span className="text-xs font-normal text-neutral-500">/ year</span></div>
                                <p className="text-[10px] text-neutral-500">Billed upfront for 12 months. Non-refundable.</p>
                              </div>
                            ) : selectedPin === '02' ? (
                              <div className="p-3 bg-white border border-neutral-200 rounded-2xl space-y-2">
                                <span className="font-bold text-xs text-neutral-800 block">Mock Test Review</span>
                                <div className="p-2 bg-neutral-100 rounded-lg text-neutral-400 blur-xs text-xs">
                                  Question 14: Answer hidden behind locked paywall
                                </div>
                                <span className="text-[10px] font-mono text-rose-600 font-bold block text-center">🔒 100% Solutions Locked</span>
                              </div>
                            ) : (
                              <div className="p-3 bg-white border border-neutral-200 rounded-2xl space-y-2">
                                <button className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-mono font-medium">
                                  Start Recurring AutoPay
                                </button>
                                <span className="text-[10px] text-neutral-400 text-center block">No cancellation details shown</span>
                              </div>
                            )}

                            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-mono text-rose-900">
                              ⚠️ Issue #{selectedPin}: 96.5% of students leave the paywall within 4 seconds.
                            </div>
                          </div>
                        )}

                        {selectedPresetKey === 'custom' && (
                          <div className="p-4 bg-white border border-rose-200 rounded-2xl text-center space-y-3">
                            <span className="font-bold text-xs text-rose-700 block">Custom Checkout Issue</span>
                            <p className="text-xs text-neutral-600">{currentData.pins.find(p => p.id === selectedPin)?.desc}</p>
                            <div className="p-2 bg-rose-50 text-rose-800 font-mono text-[10px] rounded-lg">
                              Drop-off Impact: {currentData.pins.find(p => p.id === selectedPin)?.metric}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* ==================== FIXED SCREEN VIEW ==================== */
                      <div className="space-y-3 h-full flex flex-col justify-between py-1">
                        {selectedPresetKey === 'd2c' && (
                          <div className="space-y-2.5">
                            {selectedPin === '01' && (
                              /* FIX 1: 1-Tap Guest Checkout (Bypasses Forced Sign-in & OTP) */
                              <div className="space-y-2.5">
                                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                                  <span className="text-emerald-800 font-semibold flex items-center gap-1.5 text-[11px]">
                                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                    Guest Checkout Active
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">NO OTP REQUIRED</span>
                                </div>

                                <div className="p-2.5 bg-white border border-neutral-200 rounded-xl text-xs">
                                  <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Deliver To (Guest)</span>
                                    <span className="text-[10px] text-emerald-700 font-medium">Auto-filled from device ✓</span>
                                  </div>
                                  <div className="font-medium text-neutral-800 text-[11px]">Flat 402, Indiranagar, Bengaluru</div>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Instant 1-Tap Payment</span>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {['Google Pay', 'PhonePe', 'Paytm'].map((app, i) => (
                                      <div key={i} className={`p-1.5 rounded-lg border text-center text-[10px] font-mono font-medium ${i === 0 ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'}`}>
                                        {app}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono uppercase font-bold tracking-wider shadow-sm transition active:scale-[0.98]">
                                  ⚡ 1-Tap Pay ₹1,850 · No Sign-in
                                </button>

                                <div className="p-2 bg-emerald-50/90 border border-emerald-200 rounded-xl text-[10px] font-mono text-emerald-900 flex items-start gap-1.5">
                                  <span className="text-emerald-700 font-bold shrink-0">✓ FIX #01:</span>
                                  <span>Mandatory login replaced with 1-tap guest checkout. Eliminates 41.2% drop-off.</span>
                                </div>
                              </div>
                            )}

                            {selectedPin === '02' && (
                              /* FIX 2: All-Inclusive Upfront Pricing (₹1,999 shown directly, zero surprise jumps) */
                              <div className="space-y-2.5">
                                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                                  <span className="text-emerald-800 font-semibold flex items-center gap-1.5 text-[11px]">
                                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                    100% Upfront Pricing Guarantee
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">NO LAST-MINUTE FEES</span>
                                </div>

                                <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs space-y-1.5">
                                  <div className="flex justify-between text-neutral-700 text-[11px]">
                                    <span>Oversized Cotton Tee (All-Inclusive)</span>
                                    <span className="font-mono font-medium">₹1,999</span>
                                  </div>
                                  <div className="flex justify-between text-neutral-700 text-[11px]">
                                    <span>Express Delivery & Handling</span>
                                    <span className="text-emerald-700 font-mono font-semibold">Included (₹0.00)</span>
                                  </div>
                                  <div className="flex justify-between text-neutral-700 text-[11px]">
                                    <span>Unexpected Last-Minute Fees</span>
                                    <span className="text-emerald-700 font-mono font-semibold">₹0.00</span>
                                  </div>
                                  <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-xs text-neutral-900">
                                    <span>Final Confirmed Total</span>
                                    <span className="text-emerald-700 font-mono text-sm">₹1,999</span>
                                  </div>
                                </div>

                                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono uppercase font-bold tracking-wider shadow-sm transition active:scale-[0.98]">
                                  ⚡ Confirm & Pay Locked Total ₹1,999
                                </button>

                                <div className="p-2 bg-emerald-50/90 border border-emerald-200 rounded-xl text-[10px] font-mono text-emerald-900 flex items-start gap-1.5">
                                  <span className="text-emerald-700 font-bold shrink-0">✓ FIX #02:</span>
                                  <span>All-inclusive ₹1,999 shown upfront. Zero last-minute price jumps stops 31.4% rage clicks.</span>
                                </div>
                              </div>
                            )}

                            {selectedPin === '03' && (
                              /* FIX 3: 1-Tap Instant UPI App Selector (Zero Manual VPA Typing) */
                              <div className="space-y-2.5">
                                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                                  <span className="text-emerald-800 font-semibold flex items-center gap-1.5 text-[11px]">
                                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                    1-Tap Instant UPI Active
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">ZERO TYPING</span>
                                </div>

                                {/* 1-Tap App Selector */}
                                <div className="p-3 bg-white border border-neutral-200 rounded-xl space-y-2">
                                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Launch Installed App:</span>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {['Google Pay', 'PhonePe', 'Paytm'].map((app, i) => (
                                      <div key={i} className={`p-2 rounded-lg border text-center text-[10px] font-mono font-bold ${i === 0 ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs' : 'bg-white text-neutral-700 border-neutral-200'}`}>
                                        {app}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-between items-center px-1 text-xs font-mono">
                                  <span className="text-neutral-500">Order Total:</span>
                                  <span className="font-bold text-neutral-900 text-sm">₹1,999</span>
                                </div>

                                {/* High-Conversion Primary CTA */}
                                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono uppercase font-bold tracking-wider shadow-sm transition active:scale-[0.98]">
                                  ⚡ 1-Tap Pay ₹1,999 with Google Pay
                                </button>

                                <div className="p-2 bg-emerald-50/90 border border-emerald-200 rounded-xl text-[10px] font-mono text-emerald-900 flex items-start gap-1.5">
                                  <span className="text-emerald-700 font-bold shrink-0">✓ FIX #03:</span>
                                  <span>Direct 1-tap app intent replaces manual UPI typing. Eliminates 48.2% drop-off.</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {selectedPresetKey === 'fintech' && (
                          <div className="space-y-3">
                            {selectedPin === '01' ? (
                              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                                <span className="font-bold text-xs text-emerald-900 block">DigiLocker Paperless Verification</span>
                                <p className="text-[11px] text-emerald-800">Verified Aadhaar & PAN pulled via DigiLocker. Zero camera or mic permissions needed.</p>
                              </div>
                            ) : selectedPin === '02' ? (
                              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                                <span className="font-bold text-xs text-emerald-900 block">UIDAI XML Direct Verification</span>
                                <p className="text-[11px] text-emerald-800">Algorithmic cryptographic ID verification. 0% camera glare or angle rejections.</p>
                              </div>
                            ) : (
                              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                                <span className="font-bold text-xs text-emerald-900 block">Instant AI Verification Engine</span>
                                <p className="text-[11px] text-emerald-800">Identity approved in 8.4 seconds. Eliminates 4m live agent queue wait.</p>
                              </div>
                            )}

                            <button className="w-full py-3 bg-neutral-900 text-white rounded-xl text-xs font-mono uppercase font-bold">
                              ⚡ Verify in 10s via DigiLocker →
                            </button>

                            <div className="p-2 bg-emerald-50/90 border border-emerald-200 rounded-xl text-[10px] font-mono text-emerald-900 flex items-start gap-1.5">
                              <span className="text-emerald-700 font-bold shrink-0">✓ FIX #{selectedPin}:</span>
                              <span>
                                {selectedPin === '01' ? 'Zero camera permission block. Eliminates 48.2% drop-off.' : selectedPin === '02' ? 'Digital ID pull replaces camera photo. 0% glare failures.' : 'Instant automated approval eliminates 4m queue wait.'}
                              </span>
                            </div>
                          </div>
                        )}

                        {selectedPresetKey === 'edtech' && (
                          <div className="space-y-3">
                            {selectedPin === '01' ? (
                              <div className="p-3 bg-white border-2 border-emerald-500 rounded-xl space-y-1">
                                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">7-Day Sprint Pass</span>
                                <div className="text-xl font-bold font-mono text-neutral-900">₹149 <span className="text-xs font-normal text-neutral-500">/ week</span></div>
                                <p className="text-[11px] text-neutral-600">Low-barrier trial with full mock test access. 1-click cancel anytime.</p>
                              </div>
                            ) : selectedPin === '02' ? (
                              <div className="p-3 bg-white border-2 border-emerald-500 rounded-xl space-y-1">
                                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Freemium Preview Unlocked</span>
                                <div className="text-xs font-bold text-neutral-900">2 Complete Solutions Unlocked</div>
                                <p className="text-[11px] text-neutral-600">Students see step-by-step logic and answer explanations before buying.</p>
                              </div>
                            ) : (
                              <div className="p-3 bg-white border-2 border-emerald-500 rounded-xl space-y-1">
                                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Transparent AutoPay</span>
                                <div className="text-xs font-bold text-neutral-900">1-Click Cancel Anytime</div>
                                <p className="text-[11px] text-neutral-600">WhatsApp reminder sent 24 hours before renewal. Zero lock-in.</p>
                              </div>
                            )}

                            <button className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-mono uppercase font-bold">
                              ⚡ {selectedPin === '01' ? 'Start ₹149 Sprint Pass →' : selectedPin === '02' ? 'Unlock Unlimited Tests →' : 'Subscribe with 1-Click Cancel →'}
                            </button>

                            <div className="p-2 bg-emerald-50/90 border border-emerald-200 rounded-xl text-[10px] font-mono text-emerald-900 flex items-start gap-1.5">
                              <span className="text-emerald-700 font-bold shrink-0">✓ FIX #{selectedPin}:</span>
                              <span>
                                {selectedPin === '01' ? 'Low-friction ₹149 pass lifts conversions by +44%.' : selectedPin === '02' ? 'Freemium preview stops immediate paywall exits.' : 'Transparent cancellation policy builds buyer trust.'}
                              </span>
                            </div>
                          </div>
                        )}

                        {selectedPresetKey === 'custom' && (
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                            <span className="font-bold text-xs text-emerald-800 block">Auto-Remediated Screen</span>
                            <p className="text-xs text-neutral-600">Friction points eliminated. High-converting 1-tap checkout active.</p>
                            <div className="text-[10px] font-mono text-emerald-700 font-bold">Expected CR Lift: {currentData.lift}</div>
                          </div>
                        )}

                        {/* Success Lift Banner */}
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-mono text-emerald-900 flex items-center justify-between">
                          <span className="font-bold">✓ FRICTION ELIMINATED:</span>
                          <span className="font-bold text-emerald-700">{currentData.lift}</span>
                        </div>
                      </div>
                    )}
                  </div>

              </RealisticPhoneMockup>

              {/* Viewport Subtext & Interactive Toggles */}
              <div className="mt-4 text-[11px] font-mono text-neutral-500 text-center flex items-center justify-center gap-2">
                <span>Interactive Viewport Simulation:</span>
                <button 
                  onClick={() => setScreenViewMode('flawed')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer font-semibold ${
                    screenViewMode === 'flawed' 
                      ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs' 
                      : 'text-neutral-400 hover:text-neutral-900 underline'
                  }`}
                >
                  View Problem
                </button>
                <span className="text-neutral-300">·</span>
                <button 
                  onClick={() => setScreenViewMode('fixed')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer font-semibold ${
                    screenViewMode === 'fixed' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs' 
                      : 'text-neutral-400 hover:text-neutral-900 underline'
                  }`}
                >
                  View The Fix
                </button>
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
                <span>DATA EVIDENCE // DROP-OFF PROOF</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900">
                The Data Behind the Drop-Off
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:border-black font-mono text-xs text-neutral-700 hover:text-black flex items-center gap-1.5 transition cursor-pointer bg-white"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? "Copied SQL" : "Copy SQL"}</span>
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
                  <span className="ml-2 font-mono text-neutral-400">telemetry_dropoff_analysis.sql</span>
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
                  <span className="uppercase">Device / Cohort</span>
                  <span>Wait / Latency</span>
                  <span>Exit Rate</span>
                </div>
                <div className="space-y-2.5">
                  {currentData.sqlResults.map((row, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                        row.churn.includes("78") || row.churn.includes("84") || row.churn.includes("98")
                          ? "bg-rose-50/70 border-rose-200 text-rose-900"
                          : "bg-white border-neutral-200 text-neutral-800"
                      }`}
                    >
                      <span className="font-medium">{row.os}</span>
                      <span className="text-neutral-600">{row.latency}</span>
                      <span className={row.churn.includes("78") || row.churn.includes("84") || row.churn.includes("98") ? "font-bold text-rose-600" : "font-medium"}>
                        {row.churn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-500 leading-normal">
                💡 <strong className="text-neutral-900">Key Finding:</strong> {currentData.sqlFinding}
              </div>
            </div>
          </div>
        </section>

        {/* 6. THE FIX: CODE & PRD SPECIFICATION */}
        <section id="remediation" className="bg-white border border-neutral-200 rounded-3xl p-8 lg:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-6 mb-8 border-b border-neutral-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-md font-mono text-xs text-emerald-800 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI-GENERATED SOLUTION</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900">
                The Solution: Ready-to-Ship Code & Specs
              </h2>
            </div>

            {/* 3-Tab Segmented Controller + Export */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex border border-neutral-200 p-1 bg-neutral-100 rounded-xl font-mono text-xs">
                <button
                  onClick={() => setActiveRemediationTab('diff')}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    activeRemediationTab === 'diff'
                      ? 'bg-white text-black font-semibold shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  01. Before vs After
                </button>
                <button
                  onClick={() => setActiveRemediationTab('prd')}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    activeRemediationTab === 'prd'
                      ? 'bg-white text-black font-semibold shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  02. Product Spec (PRD)
                </button>
                <button
                  onClick={() => setActiveRemediationTab('code')}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    activeRemediationTab === 'code'
                      ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  03. Production Code
                </button>
              </div>

              <button
                onClick={handleDownloadFullRcaPackage}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Download Complete Fix Package"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Package (.md)</span>
              </button>
            </div>
          </div>

          {/* TAB 1: BEFORE VS AFTER COMPARATOR */}
          {activeRemediationTab === 'diff' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch font-sans">
              {/* Broken Current Flow */}
              <div className="border border-rose-200 bg-rose-50/20 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-200/80 font-mono text-xs text-rose-800">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      CURRENT BROKEN FLOW
                    </span>
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                      {currentData.dropoff}% DROP-OFF
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-900 mb-1">{currentData.beforeHeadline}</h3>
                  <p className="text-xs text-neutral-600 mb-4">{currentData.beforeSubhead}</p>

                  <div className="space-y-3">
                    {currentData.pins.map((pin) => (
                      <div key={pin.id} className="p-3 bg-white border border-rose-200 rounded-xl">
                        <div className="flex justify-between font-mono text-[10px] text-rose-700 font-bold mb-1">
                          <span>FAULT #{pin.id}: {pin.title}</span>
                          <span>{pin.metric}</span>
                        </div>
                        <p className="text-xs text-neutral-700">{pin.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-rose-200 text-xs font-mono text-rose-700 flex justify-between">
                  <span>MONEY LOST EVERY MONTH:</span>
                  <span className="font-bold">₹{leakedLakhs} Lakhs / mo</span>
                </div>
              </div>

              {/* Remediated Solution Window */}
              <div className="border border-emerald-300 bg-emerald-50/20 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-200 font-mono text-xs text-emerald-800">
                    <span className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      OPTIMIZED NEW FLOW
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                      {currentData.lift}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-900 mb-1">{currentData.afterHeadline}</h3>
                  <p className="text-xs text-neutral-600 mb-4">{currentData.afterSubhead}</p>

                  <div className="p-4 bg-white border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs text-emerald-800 pb-2 border-b border-emerald-100">
                      <span>✓ Conversion Friction Removed</span>
                      <span className="font-bold">Status: Fixed</span>
                    </div>
                    <ul className="text-xs text-neutral-800 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Pre-filled credentials bypass mandatory login and OTP verification.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Zero price shocks: Upfront delivery and fee disclosures guaranteed.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Instant 1-tap UPI app launch replaces manual VPA typing errors.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-200 text-xs font-mono text-emerald-800 flex justify-between">
                  <span>RECOVERABLE REVENUE:</span>
                  <span className="font-bold">+{currentData.recoveredLakhsEst} / mo</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXECUTIVE PRD STUDIO */}
          {activeRemediationTab === 'prd' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
                <div>
                  <span className="text-[10px] text-neutral-400 block">SPECIFICATION ID: {currentData.prdDocumentId}</span>
                  <h4 className="font-sans text-lg font-bold text-neutral-900">
                    Product Requirements Document (PRD)
                  </h4>
                </div>
                <button
                  onClick={handleCopyPrd}
                  className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-lg flex items-center gap-1.5 cursor-pointer text-xs font-medium hover:bg-black transition"
                >
                  {copiedPrd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrd ? "Copied Markdown" : "Copy PRD (.md)"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAFAFA] border border-neutral-200 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-bold block mb-1">01. PROBLEM STATEMENT</span>
                  <p className="font-sans text-xs text-neutral-800 leading-relaxed">
                    {currentData.prdProblemStatement}
                  </p>
                </div>
                <div className="p-4 bg-[#FAFAFA] border border-neutral-200 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-bold block mb-1">02. HYPOTHESIS & PRIMARY METRIC</span>
                  <p className="font-sans text-xs text-neutral-800 leading-relaxed">
                    {currentData.prdHypothesis}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FAFAFA] border border-neutral-200 rounded-xl">
                <span className="text-[10px] text-neutral-500 font-bold block mb-2">03. USER STORIES & EDGE CASES</span>
                <ul className="space-y-2 font-sans text-xs text-neutral-800">
                  {currentData.prdUserStories.map((story, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold font-mono">{idx + 1}.</span>
                      <span>{story}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAFAFA] border border-neutral-200 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-bold block mb-2">04. ENGINEERING ACCEPTANCE CRITERIA</span>
                  <ul className="space-y-1.5 font-sans text-xs text-neutral-800">
                    {currentData.prdAcceptanceCriteria.map((crit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold font-mono">✓</span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-[#FAFAFA] border border-neutral-200 rounded-xl">
                  <span className="text-[10px] text-neutral-500 font-bold block mb-2">05. CANARY ROLLOUT & METRICS PLAN</span>
                  <p className="font-sans text-xs text-neutral-800 leading-relaxed mb-3">
                    {currentData.prdRolloutPlan}
                  </p>
                  <div className="text-[10px] font-mono text-neutral-500 bg-neutral-100 p-2 rounded">
                    Primary Metric: Step 4 Conversion Rate · Guardrail: Payment Error Rate
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTION REACT CODE */}
          {activeRemediationTab === 'code' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-neutral-100 gap-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-neutral-500">READY-TO-USE COMPONENT:</span>
                  <span className="font-bold text-neutral-900">{currentData.remediationFileName}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg flex items-center gap-1.5 cursor-pointer text-xs transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied Component" : "Copy Production Code"}</span>
                </button>
              </div>

              <div className="bg-[#09090B] text-neutral-200 rounded-2xl p-5 border border-neutral-800 shadow-inner font-mono text-xs overflow-x-auto leading-relaxed">
                <pre>
                  <code>{currentData.remediationCode}</code>
                </pre>
              </div>
            </div>
          )}
        </section>

        {/* 7. FINANCIAL SENSITIVITY & REVENUE RECOVERY */}
        <section id="calculator" className="bg-white border border-neutral-200 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
          <div className="border-b border-neutral-100 pb-6 mb-8 font-mono text-xs text-neutral-500 uppercase tracking-wider flex items-center justify-between">
            <span>REVENUE IMPACT // RECOVERY ESTIMATOR</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ESTIMATED CONVERSION LIFT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2 space-y-6 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-2 text-neutral-600">
                  <span>MONTHLY VISITORS REACHING CHECKOUT:</span>
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
                  <span>CHECKOUT DROP-OFF RATE:</span>
                  <span className="font-bold text-rose-600" suppressHydrationWarning>{dropoff}% Drop-off</span>
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
              <span className="text-[11px] text-neutral-400 block mb-1">MONTHLY REVENUE LOST:</span>
              <span className="text-3xl font-bold text-rose-600 mb-4 tracking-tight" suppressHydrationWarning>
                ₹{leakedLakhs} L<span className="text-xs font-normal text-neutral-500"> /mo</span>
              </span>

              <span className="text-[11px] text-neutral-400 block mb-1">RECOVERABLE (+22% LIFT):</span>
              <span className="text-3xl font-bold text-emerald-600 mb-4 tracking-tight" suppressHydrationWarning>
                +₹{recoverableLakhs} L<span className="text-xs font-normal text-neutral-500"> /mo</span>
              </span>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-400">ADDED REVENUE PER YEAR:</span>
                <span className="font-bold text-neutral-900" suppressHydrationWarning>
                  +₹{annualizedCr} Cr /yr
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 8. DEVELOPER CLI & CI/CD AUTOMATION */}
        <section className="bg-white border border-neutral-200 rounded-3xl p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-mono text-xs">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-100 rounded-md text-neutral-600 text-[11px] mb-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                <span>DEVELOPER TOOL // CI/CD AUDIT</span>
              </div>
              <h3 className="font-sans text-xl font-bold text-neutral-900 tracking-tight">
                Automate Funnel Audits in CI/CD via CLI
              </h3>
              <p className="font-sans text-xs text-neutral-600 mt-1">
                Run FunnelDoctor as a GitHub Action or local terminal check on every deploy to detect conversion drops.
              </p>
            </div>

            <div className="bg-[#09090B] text-neutral-200 px-4 py-3 rounded-xl border border-neutral-800 flex items-center justify-between gap-4 w-full lg:w-auto shadow-inner">
              <code className="text-emerald-400 font-mono text-xs overflow-x-auto whitespace-nowrap">
                npx @funneldoctor/core audit --file ./funnel.csv --url {currentData.url}
              </code>
              <button
                onClick={handleCopyCli}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCli ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 9. MINIMALIST FOOTER */}
      <footer className="border-t border-neutral-200/80 bg-white/60 backdrop-blur-sm py-10 px-6 sm:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-[10px]">
              FD
            </div>
            <span className="font-semibold text-neutral-900">FunnelDoctor.ai</span>
            <span className="text-neutral-300">·</span>
            <span>Open Source Community Edition</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Autonomous CRO & Code Remediation</span>
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

      {/* 10. CUSTOM CSV & SCREENSHOT INGESTION MODAL */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-2xl bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900">
                    Upload Your Funnel Data
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Upload your GA4, Mixpanel, or custom analytics CSV to diagnose drop-offs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="my-5 space-y-4">
              {/* CSV Data Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Funnel Event CSV (Optional · Headers: step, visitors)</span>
                  </label>
                  {customCsvInput ? (
                    <button
                      onClick={() => {
                        setCustomCsvInput('');
                        setCustomCsvFileName(null);
                      }}
                      className="font-mono text-[11px] text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                    >
                      Clear CSV (Run Autonomous Mode)
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setCustomCsvInput(SAMPLE_CSV_PREFILL);
                        setCustomCsvFileName('sample-template.csv');
                      }}
                      className="font-mono text-[11px] text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                    >
                      + Load Demo Sample Template
                    </button>
                  )}
                </div>

                {/* Direct CSV File Upload or Paste Box */}
                <div className="mb-2 flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-mono cursor-pointer transition border border-neutral-300">
                    <Upload className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Upload .csv / .txt file</span>
                    <input
                      type="file"
                      accept=".csv,text/csv,text/plain"
                      onChange={handleCsvFileChange}
                      className="hidden"
                    />
                  </label>
                  {customCsvFileName ? (
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold truncate">
                      ✓ Ingested: {customCsvFileName}
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-neutral-400">
                      or paste raw CSV rows (or leave empty for AI auto-audit):
                    </span>
                  )}
                </div>

                <textarea
                  value={customCsvInput}
                  onChange={(e) => setCustomCsvInput(e.target.value)}
                  rows={4}
                  className="w-full bg-[#FAFAFA] border border-neutral-300 rounded-xl p-3 font-mono text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 focus:bg-white"
                  placeholder="Optional: Paste CSV rows here (step,visitors). If left empty, Gemini will autonomously inspect your URL!"
                />
                {!customCsvInput.trim() && (
                  <p className="text-[11px] font-mono text-emerald-700 mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Autonomous Mode: Gemini 2.5 will automatically deduce conversion stages from your URL!</span>
                  </p>
                )}
              </div>

              {/* URL & Screenshot Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div>
                  <label className="text-neutral-700 font-semibold block mb-1.5">Target Website / Checkout URL</label>
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-neutral-300 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 focus:bg-white"
                    placeholder="https://yourbrand.in/checkout"
                  />
                </div>

                <div>
                  <label className="text-neutral-700 font-semibold block mb-1.5 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Optional Screen (.png, .jpg)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotFileChange}
                    className="w-full text-xs text-neutral-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer"
                  />
                  {customScreenshotName && (
                    <span className="text-[10px] text-emerald-600 block mt-1 truncate">
                      ✓ Attached: {customScreenshotName}
                    </span>
                  )}
                </div>
              </div>

              {customError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-mono">
                  {customError}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-neutral-400">
                Processed via @funneldoctor/core & Gemini 2.5
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRunCustomAudit}
                  disabled={isSubmittingCustom}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  {isSubmittingCustom ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Funnel...</span>
                    </>
                  ) : (
                    <>
                      <span>Run AI Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING VOICE BRIEFING HUD */}
      {isSpeaking && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#09090B] text-white border border-neutral-800 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-lg border-l-4 border-l-emerald-500 font-sans">
          <div className="flex items-end gap-1 h-5 shrink-0">
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3" style={{ animationDuration: '0.4s' }} />
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-5" style={{ animationDuration: '0.6s' }} />
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2" style={{ animationDuration: '0.5s' }} />
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4" style={{ animationDuration: '0.7s' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Gemini 2.5 Voice RCA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs text-neutral-300 truncate mt-0.5">
              {currentData.voiceSummary}
            </p>
          </div>
          <button 
            onClick={toggleVoice}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg font-mono transition-colors cursor-pointer shrink-0"
          >
            Stop
          </button>
        </div>
      )}

      {/* 11. VALUE-ANCHORED PRICING & ROI GUARANTEE MODAL */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-4xl bg-[#FBFBFB] border border-neutral-300 rounded-3xl p-6 sm:p-10 shadow-2xl text-neutral-900 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-neutral-200">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-mono font-medium text-emerald-800 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  INSTITUTIONAL B2B PRICING & GUARANTEE
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                  Monetization Architecture & Plans
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                  FunnelDoctor replaces a ₹15L/year CRO agency retainer with autonomous 60-second multimodal AI diagnoses.
                </p>
              </div>
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="p-2 rounded-xl hover:bg-neutral-200/80 text-neutral-400 hover:text-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ROI Guarantee Banner */}
            <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-bold uppercase tracking-wider">3x ROI Performance Guarantee:</span>
                  <span className="text-emerald-800 ml-1.5 font-sans font-normal">
                    If FunnelDoctor does not identify and help remediate at least 3x its subscription cost in leaked checkout revenue within 30 days, we issue an immediate 100% refund.
                  </span>
                </div>
              </div>
              <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest shrink-0 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                Zero Risk
              </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
              {/* Plan 1: Growth */}
              <div className="p-6 bg-white border border-neutral-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-2">Growth Tier</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold font-mono tracking-tight">$199</span>
                    <span className="text-xs text-neutral-500 font-mono">/ mo (~₹16.5k)</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-5">
                    For high-growth D2C stores doing ₹25L–₹1Cr GMV/month.
                  </p>
                  <ul className="space-y-2.5 text-xs text-neutral-700 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>15 Autonomous Funnel Audits / mo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Gemini Omni Spatial Screen Vision</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>React / Tailwind Component Code</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>CSV & PostHog Ingestion</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => setIsPricingModalOpen(false)}
                  className="w-full py-2.5 border border-neutral-300 rounded-xl text-xs font-mono uppercase tracking-wider hover:border-black transition font-semibold cursor-pointer"
                >
                  Start 14-Day Pilot
                </button>
              </div>

              {/* Plan 2: Scale (Featured) */}
              <div className="p-6 bg-white border-2 border-emerald-600 rounded-2xl flex flex-col justify-between relative shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                  Most Popular · Highest ROI
                </div>
                <div>
                  <div className="font-mono text-xs text-emerald-700 uppercase tracking-wider mb-2 font-bold">Scale Tier</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold font-mono tracking-tight text-neutral-900">$599</span>
                    <span className="text-xs text-neutral-500 font-mono">/ mo (~₹49.5k)</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-5">
                    For scaleups & fintechs doing ₹1Cr–₹10Cr GMV/month.
                  </p>
                  <ul className="space-y-2.5 text-xs text-neutral-800 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Unlimited</strong> Real-Time Funnel Audits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Live BigQuery & Mixpanel Streaming Connector</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Gemini Live Voice RCA Consultations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Automated GitHub PR Pull-Request Generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Slack & Teams Anomaly Alerts</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => setIsPricingModalOpen(false)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider transition font-semibold cursor-pointer shadow-sm"
                >
                  Deploy Scale License
                </button>
              </div>

              {/* Plan 3: Enterprise */}
              <div className="p-6 bg-white border border-neutral-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-2">Enterprise Partner</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold font-mono tracking-tight">$2,499</span>
                    <span className="text-xs text-neutral-500 font-mono">/ mo</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-5">
                    For unicorn brands, banking KYC, and high-volume fintechs.
                  </p>
                  <ul className="space-y-2.5 text-xs text-neutral-700 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Dedicated GCP Vertex AI VPC Deployment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Custom Design System & Multi-Framework Synthesis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Dedicated Senior CRO Solutions Architect</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>99.9% Uptime SLA & SOC2 Compliance</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => setIsPricingModalOpen(false)}
                  className="w-full py-2.5 border border-neutral-900 bg-neutral-900 text-white hover:bg-black rounded-xl text-xs font-mono uppercase tracking-wider transition font-semibold cursor-pointer"
                >
                  Contact Enterprise Desk
                </button>
              </div>
            </div>

            {/* Unit Economics Footer */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-neutral-500">
              <span>Average Customer Payback Period: <strong>&lt; 7 Days</strong> via recovered checkouts</span>
              <div className="flex items-center gap-4">
                <span>Invoicing in INR & USD</span>
                <span>•</span>
                <span>Annual Commit: 20% Off</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
