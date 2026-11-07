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
  Layers,
  Code2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';

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
type PresetKey = 'd2c' | 'fintech' | 'edtech';

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

const PRESET_DATASETS: Record<PresetKey, Dataset> = {
  d2c: {
    id: 'd2c',
    label: '🛍️ D2C Fashion Checkout [-71.7%]',
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
      { step: '04. Address & Payment', users: '7,075', pct: 28.3, drop: '-71.7% CHURN', critical: true },
      { step: '05. Order Confirmed', users: '6,580', pct: 93.0 },
    ],
    pins: [
      { id: '01', title: 'Forced Account OTP Modal', desc: 'Blocks guest checkout; 41.2% exit within 6 seconds of display modal.', metric: '41.2% Exit' },
      { id: '02', title: 'Late ₹149 Fee Surcharge', desc: 'Delivery + convenience fee hidden until final confirmation screen.', metric: '31.4% Rage Clicks' },
      { id: '03', title: 'UPI CTA Below 6.1" Fold', desc: 'Primary GPay/PhonePe button pushed offscreen by bloated coupon banner.', metric: '64% Unseen' },
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
    sqlFinding: 'Android WebView users face a 4,280ms p95 latency on UPI deep-link intent invocation. Paired with the forced email OTP modal, 78.4% abandon before the payment gateway handoff.',
    voiceSummary: 'Diagnostic complete for QuickStyle D2C. Step 4 leaks 331.6 Lakhs per month. 78.4 percent of drops occur on Android WebView due to a forced login modal combined with a 4.2 second UPI intent latency bottleneck. Deploying our synthesized 1-Tap Guest UPI Express component recovers 73 Lakhs monthly.',
    beforeHeadline: 'Baseline: Forced OTP + Late Fee Shock',
    beforeSubhead: '3 Major Conversion Traps Identified by Gemini Vision',
    afterHeadline: 'Synthesized Fix: 1-Tap UPI Express',
    afterSubhead: 'Zero Login Wall · Free Shipping Progress Bar · Deep-Linked Intent',
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
    label: '💳 Fintech Video KYC [-74.8%]',
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
      { step: '04. Aadhaar & Video KYC', users: '4,536', pct: 25.2, drop: '-74.8% CHURN', critical: true },
      { step: '05. Credit Line Activated', users: '4,310', pct: 95.0 },
    ],
    pins: [
      { id: '01', title: 'Zero-Context Camera Permission', desc: 'Browser requests camera & microphone before explaining why live video is needed.', metric: '46.0% Denied' },
      { id: '02', title: 'Opaque Error 402 Toast', desc: 'PAN glare rejection displays raw ERR_402 blob with no guidance on repositioning.', metric: '52.0% Abandon' },
      { id: '03', title: 'Live Agent Queue Wait (>4m)', desc: 'Applicants wait an average of 274 seconds for an agent before abandoning.', metric: '3.8m Avg Wait' },
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
    voiceSummary: 'Diagnostic complete for FinPulse Neo. 74.8 percent of credit-approved applicants abandon at Step 4 Video KYC. SQL telemetry proves users queued for live agents wait 274 seconds before dropping. Switching primary onboarding to 1-Click DigiLocker OAuth with an anti-glare scanner recovers 94.8 Lakhs monthly.',
    beforeHeadline: 'Baseline: Opaque Error 402 & 4.5m Video Queue',
    beforeSubhead: 'Permissions Friction + Agent Congestion Bottlenecks',
    afterHeadline: 'Synthesized Fix: 1-Click DigiLocker OAuth',
    afterSubhead: 'Instant XML Aadhaar Pull · Anti-Glare Scanner · Zero Wait Time',
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
    label: '🎓 EdTech Paywall [-96.5%]',
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
      { step: '04. Pro Paywall Modal', users: '1,400', pct: 3.5, drop: '-96.5% CHURN', critical: true },
      { step: '05. Subscription Active', users: '1,310', pct: 93.5 },
    ],
    pins: [
      { id: '01', title: '₹4,999 Annual Plan Default', desc: 'Student cohort suffers immediate sticker shock when annual plan is selected by default.', metric: '89% Bounce < 4s' },
      { id: '02', title: '100% Blurred Answer Review', desc: 'Blurs every solution instead of offering 2 free AI answer explanations as a value hook.', metric: 'Zero Value Proof' },
      { id: '03', title: 'Missing AutoPay Cancel Trust', desc: 'No visible 1-click UPI Mandate cancellation guarantee near recurring CTA.', metric: 'High Trust Friction' },
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
    beforeHeadline: 'Baseline: ₹4,999 Sticker Shock & 100% Blurred Solutions',
    beforeSubhead: 'Zero Value Proof + Missing Autopay Cancellation Guarantee',
    afterHeadline: 'Synthesized Fix: ₹149 Weekly Sprint Pass',
    afterSubhead: '2 Free Unlocked Explanations · 1-Click Mandate Cancel Guarantee',
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

// 3. MAIN COMPONENT
export default function FunnelDoctorMinimalist() {
  const [selectedPresetKey, setSelectedPresetKey] = useState<PresetKey>('d2c');
  const currentData = PRESET_DATASETS[selectedPresetKey];
  
  const [targetUrl, setTargetUrl] = useState(currentData.url);
  const [selectedPin, setSelectedPin] = useState(currentData.pins[0].id);
  const [activeRemediationTab, setActiveRemediationTab] = useState<'diff' | 'prd' | 'code'>('diff');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrd, setCopiedPrd] = useState(false);

  // Financial Sliders
  const [visitors, setVisitors] = useState(currentData.visitors);
  const [dropoff, setDropoff] = useState(currentData.dropoff);
  const [aov, setAov] = useState(currentData.aov);

  // Switch Preset Handler
  const switchPreset = (key: PresetKey) => {
    setIsAuditing(true);
    setSelectedPresetKey(key);
    const next = PRESET_DATASETS[key];
    setTargetUrl(next.url);
    setSelectedPin(next.pins[0].id);
    setVisitors(next.visitors);
    setDropoff(next.dropoff);
    setAov(next.aov);
    setTimeout(() => setIsAuditing(false), 450);
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#09090B] font-sans selection:bg-emerald-500/20 selection:text-emerald-900 relative">
      
      {/* Topographic Mesh Background */}
      <TopographicMesh />

      {/* 1. CLEAN, UN-CROWDED MINIMALIST NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#FBFBFB]/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
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
          
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-neutral-500">
            <a href="#telemetry" className="hover:text-black transition-colors">01. Telemetry</a>
            <a href="#xray" className="hover:text-black transition-colors">02. Vision X-Ray</a>
            <a href="#sql" className="hover:text-black transition-colors">03. SQL Proof</a>
            <a href="#remediation" className="hover:text-black transition-colors text-emerald-700 font-semibold">04. Synthesized Fix</a>
            <a href="#calculator" className="hover:text-black transition-colors">05. ROI Model</a>
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
              onClick={() => scrollToSection('remediation')}
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              Launch Fix →
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-32 space-y-24">
        
        {/* 2. HERO SECTION WITH PRESET CHIPS & TARGET BAR */}
        <section className="max-w-4xl mx-auto text-center pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-mono font-medium text-emerald-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Autonomous Multimodal Conversion & RCA Agent
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-[#09090B] mb-6">
            Diagnose conversion churn. <br />
            <span className="text-neutral-400 font-normal">Synthesize the fix in 60s.</span>
          </h1>

          <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Combine quantitative BigQuery funnel telemetry with Gemini Vision spatial screen inspection to output executive PRDs and production React code.
          </p>

          {/* Minimalist Target Input Bar */}
          <div className="max-w-2xl mx-auto bg-white border border-neutral-300/80 rounded-2xl p-2.5 flex flex-col sm:flex-row items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 px-3 py-2 w-full font-mono text-xs text-neutral-500 border-b sm:border-b-0 sm:border-r border-neutral-200">
              <span className="text-neutral-400 font-semibold">URL:</span>
              <input 
                type="text" 
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-transparent text-black focus:outline-none font-mono text-xs" 
              />
            </div>
            <button 
              onClick={() => switchPreset(selectedPresetKey)}
              disabled={isAuditing}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              {isAuditing ? 'Auditing...' : 'Run Audit'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Industry Starter Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 font-mono text-xs text-neutral-500">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 mr-1">LIVE PRESETS:</span>
            {(['d2c', 'fintech', 'edtech'] as PresetKey[]).map((key) => {
              const preset = PRESET_DATASETS[key];
              const isSelected = selectedPresetKey === key;
              return (
                <button
                  key={key}
                  onClick={() => switchPreset(key)}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Live Benchmark Line */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-neutral-500 pt-5">
            <span className="flex items-center gap-1.5 text-neutral-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {currentData.tagline}
            </span>
            <span className="text-neutral-300">·</span>
            <span>{currentData.recoveredLakhsEst} monthly recoverable</span>
            <span className="text-neutral-300">·</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {currentData.lift}
            </span>
          </div>

          {/* 3-Step Breadcrumb Flow */}
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
              <span className="uppercase tracking-wider">01 // QUANTITATIVE FUNNEL STREAM</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {currentData.lift} PROJECTED
                </span>
                <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                  Anomaly at Step 04 ({currentData.dropoff}% Churn)
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
            
            {/* Left Side: Findings */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-md font-mono text-xs text-neutral-600">
                <ScanEye className="w-4 h-4 text-emerald-600" />
                <span>MODULE 01 // GEMINI 2.5 SPATIAL X-RAY</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900">
                Visual Occlusion & Friction Findings
              </h2>

              <p className="text-base text-neutral-600 leading-relaxed font-normal">
                Gemini Vision scans mobile checkout viewports, cross-referencing UI layout flaws with telemetry drop-offs. Click any fault below to isolate the anomaly.
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

            {/* Right Side: Floating Mobile Phone Frame */}
            <div className="lg:col-span-6 flex justify-center bg-neutral-100/70 p-8 lg:p-12 rounded-2xl border border-neutral-200/60">
              <div className="w-full max-w-[340px] bg-white rounded-3xl border border-neutral-300 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] p-5 relative">
                <div className="w-20 h-3.5 bg-neutral-100 rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 border-b border-neutral-100 pb-2 mb-4">
                  <span>9:41 AM</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">LIVE VIEWPORT</span>
                </div>

                <div className="space-y-3">
                  {currentData.pins.map((pin) => {
                    const isSelected = selectedPin === pin.id;
                    return (
                      <div 
                        key={pin.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/20' 
                            : 'bg-neutral-50 border-neutral-200'
                        }`}
                      >
                        <div className="flex justify-between font-mono text-[10px] font-bold mb-1">
                          <span className={isSelected ? 'text-rose-700' : 'text-neutral-600'}>
                            [FAULT #{pin.id}] {pin.title.toUpperCase()}
                          </span>
                          <span className={isSelected ? 'text-rose-600 font-bold' : 'text-neutral-500'}>
                            {pin.metric}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-800 leading-normal">{pin.desc}</p>
                      </div>
                    );
                  })}
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
                  <span>Latency / Dwell</span>
                  <span>Churn Rate</span>
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
                💡 <strong className="text-neutral-900">RCA Finding:</strong> {currentData.sqlFinding}
              </div>
            </div>
          </div>
        </section>

        {/* 6. MODULE 03: GEMINI AUTO-REMEDIATION & AUTO-PRD (THE 60s PAYOFF) */}
        <section id="remediation" className="bg-white border border-neutral-200 rounded-3xl p-8 lg:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-6 mb-8 border-b border-neutral-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-md font-mono text-xs text-emerald-800 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>MODULE 03 // GEMINI 2.5 AUTO-REMEDIATION</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900">
                Synthesized Remediation & Engineering Spec
              </h2>
            </div>

            {/* 3-Tab Segmented Controller */}
            <div className="inline-flex border border-neutral-200 p-1 bg-neutral-100 rounded-xl font-mono text-xs">
              <button
                onClick={() => setActiveRemediationTab('diff')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeRemediationTab === 'diff'
                    ? 'bg-white text-black font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                01. Before vs After UI Diff
              </button>
              <button
                onClick={() => setActiveRemediationTab('prd')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeRemediationTab === 'prd'
                    ? 'bg-white text-black font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                02. Executive PRD Spec
              </button>
              <button
                onClick={() => setActiveRemediationTab('code')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeRemediationTab === 'code'
                    ? 'bg-white text-emerald-700 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                03. Production React Code
              </button>
            </div>
          </div>

          {/* TAB 1: BEFORE VS AFTER COMPARATOR */}
          {activeRemediationTab === 'diff' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch font-sans">
              {/* Broken Baseline Window */}
              <div className="border border-rose-200 bg-rose-50/20 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-200/80 font-mono text-xs text-rose-800">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      BASELINE CONVERSION FRICTION
                    </span>
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                      {currentData.dropoff}% CHURN
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
                  <span>MONTHLY CAPITAL LOSS:</span>
                  <span className="font-bold">₹{leakedLakhs} Lakhs / mo</span>
                </div>
              </div>

              {/* Remediated Solution Window */}
              <div className="border border-emerald-300 bg-emerald-50/20 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-200 font-mono text-xs text-emerald-800">
                    <span className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      GEMINI AUTO-REMEDIATED REPAIR
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                      {currentData.lift}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-900 mb-1">{currentData.afterHeadline}</h3>
                  <p className="text-xs text-neutral-600 mb-4">{currentData.afterSubhead}</p>

                  <div className="p-4 bg-white border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs text-emerald-800 pb-2 border-b border-emerald-100">
                      <span>✓ Friction Point Eliminated</span>
                      <span className="font-bold">Status: Fixed</span>
                    </div>
                    <ul className="text-xs text-neutral-800 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Pre-filled credentials bypass mandatory authentication and OTP delays.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Zero price shocks: Upfront delivery and fee disclosures guaranteed.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Immediate action button anchored firmly within the thumb-reach zone.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-200 text-xs font-mono text-emerald-800 flex justify-between">
                  <span>PROJECTED REVENUE RECOVERY:</span>
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
                    Autonomous Product Requirements Document
                  </h4>
                </div>
                <button
                  onClick={handleCopyPrd}
                  className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-lg flex items-center gap-1.5 cursor-pointer text-xs font-medium hover:bg-black transition"
                >
                  {copiedPrd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrd ? "Copied Markdown" : "Export PRD (.MD)"}</span>
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
                    Primary Metric: Step 4 Conversion Rate · Guardrail: Gateway Timeout Error Rate
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
                  <span className="text-neutral-500">SYNTHESIZED COMPONENT:</span>
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

        {/* 7. FINANCIAL SENSITIVITY & ROI MODEL */}
        <section id="calculator" className="bg-white border border-neutral-200 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
          <div className="border-b border-neutral-100 pb-6 mb-8 font-mono text-xs text-neutral-500 uppercase tracking-wider flex items-center justify-between">
            <span>MODULE 04 // Financial Sensitivity & Revenue Recovery</span>
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

      {/* 8. MINIMALIST FOOTER */}
      <footer className="border-t border-neutral-200/80 bg-white/60 backdrop-blur-sm py-10 px-6 sm:px-8 relative z-10">
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
