import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const htmlFilePath = path.join(docsDir, "FUNNELDOCTOR_MASTER_ROADMAP.html");
const pdfFilePath = path.join(docsDir, "FUNNELDOCTOR_MASTER_ROADMAP.pdf");

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FunnelDoctor AI - Master Engineering Roadmap & Prioritized Backlog</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4;
      margin: 14mm 16mm 14mm 16mm;
      @bottom-right {
        content: counter(page);
        font-family: 'JetBrains Mono', monospace;
        font-size: 8pt;
        color: #71717A;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #18181B;
      background: #FFFFFF;
      line-height: 1.5;
      font-size: 9.5pt;
      -webkit-font-smoothing: antialiased;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    /* Header Section */
    .header {
      border-bottom: 2px solid #18181B;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .header-left h1 {
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #09090B;
      line-height: 1.1;
    }

    .header-left .subtitle {
      font-size: 9.5pt;
      color: #52525B;
      margin-top: 4px;
      font-weight: 500;
    }

    .header-right {
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      color: #71717A;
    }

    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-p0 { background: #FEE2E2; color: #991B1B; border: 1px solid #F87171; }
    .badge-p1 { background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; }
    .badge-p2 { background: #DBEAFE; color: #1E40AF; border: 1px solid #93C5FD; }
    .badge-p3 { background: #EDE9FE; color: #5B21B6; border: 1px solid #C4B5FD; }
    .badge-done { background: #D1FAE5; color: #065F46; border: 1px solid #6EE7B7; }

    /* Summary KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }

    .kpi-card {
      background: #F4F4F5;
      border: 1px solid #E4E4E7;
      border-radius: 6px;
      padding: 10px 12px;
    }

    .kpi-label {
      font-size: 7.5pt;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      color: #71717A;
      font-weight: 600;
    }

    .kpi-value {
      font-size: 14pt;
      font-weight: 700;
      color: #09090B;
      margin-top: 2px;
    }

    .kpi-sub {
      font-size: 7pt;
      color: #52525B;
      margin-top: 2px;
    }

    /* Section Headers */
    .section-title {
      font-size: 13pt;
      font-weight: 800;
      color: #09090B;
      border-left: 4px solid #10B981;
      padding-left: 8px;
      margin-top: 18px;
      margin-bottom: 12px;
      letter-spacing: -0.3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Work Item Cards */
    .task-card {
      background: #FFFFFF;
      border: 1px solid #E4E4E7;
      border-radius: 6px;
      padding: 11px 14px;
      margin-bottom: 11px;
      page-break-inside: avoid;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
    }

    .task-title {
      font-size: 10.5pt;
      font-weight: 700;
      color: #18181B;
    }

    .task-meta {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .task-meta-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      color: #52525B;
      background: #F4F4F5;
      padding: 2px 6px;
      border-radius: 3px;
      border: 1px solid #E4E4E7;
    }

    .task-desc {
      font-size: 8.8pt;
      color: #3F3F46;
      margin-bottom: 8px;
      line-height: 1.45;
    }

    .task-spec-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      background: #FAFAFA;
      border: 1px solid #F4F4F5;
      border-radius: 4px;
      padding: 8px 10px;
      font-size: 8pt;
    }

    .task-spec-item strong {
      color: #18181B;
      font-weight: 600;
    }

    .task-spec-item span {
      color: #52525B;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      background: #F4F4F5;
      padding: 1px 4px;
      border-radius: 3px;
      color: #09090B;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 8pt;
      page-break-inside: avoid;
    }

    th {
      background: #F4F4F5;
      border: 1px solid #E4E4E7;
      padding: 6px 8px;
      text-align: left;
      font-weight: 600;
      color: #27272A;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
    }

    td {
      border: 1px solid #E4E4E7;
      padding: 6px 8px;
      color: #3F3F46;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background: #FAFAFA;
    }

    /* Comparison Matrix */
    .callout-box {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-radius: 6px;
      padding: 10px 14px;
      margin: 14px 0;
      font-size: 8.5pt;
      color: #166534;
      line-height: 1.45;
    }

    .callout-box strong {
      color: #14532D;
    }

    .footer-note {
      margin-top: 24px;
      border-top: 1px solid #E4E4E7;
      padding-top: 10px;
      font-size: 7.5pt;
      color: #71717A;
      display: flex;
      justify-content: space-between;
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>

  <!-- ===================================================================== -->
  <!-- PAGE 1: COVER & P0 IMMEDIATE FOUNDATIONS                               -->
  <!-- ===================================================================== -->
  <div class="header">
    <div class="header-left">
      <h1>FunnelDoctor AI</h1>
      <div class="subtitle">Master Engineering Roadmap & Prioritized Backlog</div>
    </div>
    <div class="header-right">
      <div>DOCUMENT: FD-ROADMAP-V2</div>
      <div>VERSION: 2.1.0 • CONFIDENTIAL</div>
      <div>DATE: NOVEMBER 2026</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Current Status</div>
      <div class="kpi-value" style="color: #059669;">223 / 223</div>
      <div class="kpi-sub">Tests Passing (100% Green)</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Completed Gates</div>
      <div class="kpi-value">Gates 1 - 5</div>
      <div class="kpi-sub">Milestones 1 & 2 Complete</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Total Backlog Items</div>
      <div class="kpi-value">8 Tasks</div>
      <div class="kpi-sub">Prioritized P0 to P3</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Est. Completion Cost</div>
      <div class="kpi-value" style="color: #059669;">$0.00</div>
      <div class="kpi-sub">Uses Free Tiers & Open APIs</div>
    </div>
  </div>

  <div class="callout-box">
    <strong>Executive Strategic Context:</strong> FunnelDoctor AI has completed all core scientific, cryptographic, and diagnostic foundations (Milestones 1 & 2). 
    This roadmap establishes the chronological and prioritized backlog required to transition from local/in-memory proof to an automated, self-serve, multi-tenant enterprise CRO platform.
  </div>

  <!-- PHASE 1: P0 -->
  <div class="section-title">
    <span>Priority 0 (P0) — Immediate Cloud Persistence & Field Verification</span>
    <span class="badge badge-p0">Timeline: Days 1 – 2</span>
  </div>

  <!-- TASK 1.1 -->
  <div class="task-card">
    <div class="task-header">
      <div class="task-title">1.1 Implement PostgreSQL / Supabase Driver (PostgresDatabaseAdapter)</div>
      <div class="task-meta">
        <span class="badge badge-p0">P0 BLOCKER</span>
        <span class="task-meta-tag">Est: 3 Hours</span>
        <span class="task-meta-tag">Cost: $0.00</span>
      </div>
    </div>
    <div class="task-desc">
      Build concrete <code>PostgresDatabaseAdapter</code> implementing the universal <code>DatabaseAdapter</code> interface using the high-performance <code>postgres</code> (or <code>pg</code>) driver. 
      Enables seamless automatic switching from local SQLite to cloud-persistent Supabase PostgreSQL in Vercel serverless environments via <code>DATABASE_URL</code>.
    </div>
    <div class="task-spec-grid">
      <div class="task-spec-item">
        <strong>Files:</strong> <code>packages/core/src/database/postgres-adapter.ts</code>, <code>packages/core/src/database/index.ts</code>
      </div>
      <div class="task-spec-item">
        <strong>Technical Specs:</strong> SSL mode required (<code>sslmode=require</code>), parameterized queries ($1, $2), atomic connection pooling.
      </div>
      <div class="task-spec-item">
        <strong>Dependencies:</strong> <code>pnpm --filter @funneldoctor/core add postgres</code>
      </div>
      <div class="task-spec-item">
        <strong>Deliverable:</strong> Cloud database retains merchant sessions, events, and audit logs permanently across serverless reboots.
      </div>
    </div>
  </div>

  <!-- TASK 1.2 -->
  <div class="task-card">
    <div class="task-header">
      <div class="task-title">1.2 Wire Managed Upstash Redis Cluster in Production</div>
      <div class="task-meta">
        <span class="badge badge-p0">P0 CRITICAL</span>
        <span class="task-meta-tag">Est: 1 Hour</span>
        <span class="task-meta-tag">Cost: $0.00</span>
      </div>
    </div>
    <div class="task-desc">
      Connect production <code>REDIS_URL</code> to <code>RedisStateStore</code>. Enforces multi-region distributed rate-limiting (120 req/min/IP), 
      atomic webhook idempotency locks (<code>setNX</code>), and sliding-window Lua script evaluation to protect the ingestion API.
    </div>
    <div class="task-spec-grid">
      <div class="task-spec-item">
        <strong>Files:</strong> <code>apps/web/.env.production</code>, <code>packages/core/src/state-store.ts</code>
      </div>
      <div class="task-spec-item">
        <strong>Technical Specs:</strong> REST/HTTP fallback for Upstash Serverless Redis, TLS encryption in transit.
      </div>
      <div class="task-spec-item">
        <strong>Dependencies:</strong> Free Upstash Redis instance (10,000 commands/day free).
      </div>
      <div class="task-spec-item">
        <strong>Deliverable:</strong> Production Vercel environment guarded against DDoS, telemetry flooding, and duplicate webhooks.
      </div>
    </div>
  </div>

  <!-- TASK 1.3 -->
  <div class="task-card">
    <div class="task-header">
      <div class="task-title">1.3 Live Storefront Field Verification Protocol</div>
      <div class="task-meta">
        <span class="badge badge-p0">P0 QUALITY</span>
        <span class="task-meta-tag">Est: 2 Hours</span>
        <span class="task-meta-tag">Cost: $0.00</span>
      </div>
    </div>
    <div class="task-desc">
      Execute the formal 10-point field verification workbook on a live Shopify development store. 
      Verify zero console errors, zero layout shift (CLS = 0.00), Safari ITP cookie independence, and fail-safe beacon transmission on checkout close.
    </div>
    <div class="task-spec-grid">
      <div class="task-spec-item">
        <strong>Files:</strong> <code>docs/FIELD_VERIFICATION_CHECKLIST.md</code>
      </div>
      <div class="task-spec-item">
        <strong>Devices Tested:</strong> iOS 17 Safari, Android 14 Chrome, Instagram In-App WebView.
      </div>
      <div class="task-spec-item">
        <strong>Dependencies:</strong> Free Shopify Partner development store.
      </div>
      <div class="task-spec-item">
        <strong>Deliverable:</strong> Signed verification log proving storefront safety before merchant onboarding.
      </div>
    </div>
  </div>

  <div class="footer-note">
    <span>FUNNELDOCTOR AI • MASTER ENGINEERING ROADMAP</span>
    <span>PAGE 1 OF 3</span>
  </div>

  <div class="page-break"></div>

  <!-- ===================================================================== -->
  <!-- PAGE 2: P1 1-CLICK INTEGRATION & ZERO-CODE INGESTION                   -->
  <!-- ===================================================================== -->
  <div class="header">
    <div class="header-left">
      <h1>FunnelDoctor AI</h1>
      <div class="subtitle">Section 2: High-Value Integrations & Automation Backlog</div>
    </div>
    <div class="header-right">
      <div>DOCUMENT: FD-ROADMAP-V2</div>
      <div>PAGE 2 OF 3</div>
    </div>
  </div>

  <!-- PHASE 2: P1 -->
  <div class="section-title">
    <span>Priority 1 (P1) — 1-Click Store Integrations & Zero-Code Ingestion</span>
    <span class="badge badge-p1">Timeline: Week 1</span>
  </div>

  <!-- TASK 2.1 -->
  <div class="task-card">
    <div class="task-header">
      <div class="task-title">2.1 Shopify OAuth 2.0 Handshake Flow (/api/auth/shopify)</div>
      <div class="task-meta">
        <span class="badge badge-p1">P1 EXPERIENCE</span>
        <span class="task-meta-tag">Est: 6 Hours</span>
        <span class="task-meta-tag">Cost: $0.00</span>
      </div>
    </div>
    <div class="task-desc">
      Implement automated Shopify App Bridge OAuth exchange. Merchants enter their store handle (e.g. <code>store.myshopify.com</code>) 
      and click "Connect". Shopify presents the permissions grant dialog (<code>read_orders</code>, <code>read_checkouts</code>, <code>read_products</code>), 
      and FunnelDoctor securely exchanges the code for a permanent offline access token.
    </div>
    <div class="task-spec-grid">
      <div class="task-spec-item">
        <strong>Files:</strong> <code>apps/web/src/app/api/auth/shopify/route.ts</code>, <code>apps/web/src/app/api/auth/shopify/callback/route.ts</code>
      </div>
      <div class="task-spec-item">
        <strong>Security:</strong> Nonce verification against CSRF; AES-256-GCM envelope encryption with AAD tenant binding.
      </div>
      <div class="task-spec-item">
        <strong>Dependencies:</strong> Free Shopify Partner App credentials (Client ID / Secret).
      </div>
      <div class="task-spec-item">
        <strong>Deliverable:</strong> 1-Click store connection without merchants touching code or API keys.
      </div>
    </div>
  </div>

  <!-- TASK 2.2 -->
  <div class="task-card">
    <div class="task-header">
      <div class="task-title">2.2 Shopify GraphQL Historical Data Sync Engine</div>
      <div class="task-meta">
        <span class="badge badge-p1">P1 INSTANT VALUE</span>
        <span class="task-meta-tag">Est: 5 Hours</span>
        <span class="task-meta-tag">Cost: $0.00</span>
      </div>
    </div>
    <div class="task-desc">
      Immediately upon OAuth completion, a background sync worker queries Shopify GraphQL Admin API for the last 90 days of completed orders, 
      revenue, AOV, and abandoned checkouts. Populates <code>aggregated_funnel_metrics</code> within 15 seconds so the dashboard displays 100% exact historical data.
    </div>
    <div class="task-spec-grid">
      <div class="task-spec-item">
        <strong>Files:</strong> <code>packages/core/src/shopify-sync.ts</code>, <code>apps/web/src/app/api/sync/shopify/route.ts</code>
      </div>
      <div class="task-spec-item">
        <strong>API Query:</strong> <code>orders(first: 250, query: "created_at:>90d")</code>, <code>abandonedCheckouts(first: 250)</code>
      </div>
      <div class="task-spec-item">
        <strong>Rate Limits:</strong> Shopify GraphQL Cost calculation (leaky bucket algorithm, 50 points/sec max).
      </div>
      <div class="task-spec-item">
        <strong>Deliverable:</strong> Merchants see 90 days of exact revenue leakage and historical drop-offs in 15 seconds.
      </div>
    </div>
  </div>

  <!-- TASK 2.3 -->
  <div class="task-card">
    <div class="task-header">
      <div class="task-title">2.3 Automated ScriptTag / Web Pixel API Auto-Injection</div>
      <div class="task-meta">
        <span class="badge badge-p1">P1 ZERO-CODE</span>
        <span class="task-meta-tag">Est: 3 Hours</span>
        <span class="task-meta-tag">Cost: $0.00</span>
      </div>
    </div>
    <div class="task-desc">
      Programmatically inject the 2.8KB FunnelDoctor tracker via Shopify's official <code>ScriptTag API</code> or <code>Web Pixels API</code>. 
      Eliminates manual Liquid editing; the merchant is fully instrumented the moment they authorize the app.
    </div>
    <div class="task-spec-grid">
      <div class="task-spec-item">
        <strong>Endpoint:</strong> <code>POST /admin/api/script_tags.json</code>
      </div>
      <div class="task-spec-item">
        <strong>Configuration:</strong> <code>event: "onload"</code>, <code>src: "https://funneldoctorai.vercel.app/tracker.js"</code>
      </div>
      <div class="task-spec-item">
        <strong>Safety:</strong> Asynchronous defer load, SRI hash integrity verification.
      </div>
      <div class="task-spec-item">
        <strong>Deliverable:</strong> Zero-friction installation; merchant never opens theme code.
      </div>
    </div>
  </div>

  <!-- TASK 2.4 -->
  <div class="task-card">
    <div class="task-header">
      <div class="task-title">2.4 Outbound Slack & WhatsApp Anomaly Alert Dispatcher</div>
      <div class="task-meta">
        <span class="badge badge-p1">P1 RETENTION</span>
        <span class="task-meta-tag">Est: 4 Hours</span>
        <span class="task-meta-tag">Cost: $0.00</span>
      </div>
    </div>
    <div class="task-desc">
      Implement webhook alert engine that notifies merchants via Slack or WhatsApp Business API when checkout drop-off spikes abnormally 
      (e.g. payment failure rate exceeds 20% within 1 hour due to UPI gateway outage).
    </div>
    <div class="task-spec-grid">
      <div class="task-spec-item">
        <strong>Files:</strong> <code>apps/web/src/app/api/alerts/route.ts</code>, <code>packages/core/src/alert-dispatcher.ts</code>
      </div>
      <div class="task-spec-item">
        <strong>Channels:</strong> Slack Incoming Webhooks, Resend Email API, Gupshup/Twilio WhatsApp REST API.
      </div>
      <div class="task-spec-item">
        <strong>Deduplication:</strong> 4-hour alert cooling window to prevent notification spam.
      </div>
      <div class="task-spec-item">
        <strong>Deliverable:</strong> Instant revenue protection; alerts merchants before customers file support tickets.
      </div>
    </div>
  </div>

  <div class="footer-note">
    <span>FUNNELDOCTOR AI • MASTER ENGINEERING ROADMAP</span>
    <span>PAGE 2 OF 3</span>
  </div>

  <div class="page-break"></div>

  <!-- ===================================================================== -->
  <!-- PAGE 3: P2 & P3 MONETIZATION, ECOSYSTEM & COMPETITIVE MOAT             -->
  <!-- ===================================================================== -->
  <div class="header">
    <div class="header-left">
      <h1>FunnelDoctor AI</h1>
      <div class="subtitle">Section 3: Monetization, Ecosystem & Strategic Architecture</div>
    </div>
    <div class="header-right">
      <div>DOCUMENT: FD-ROADMAP-V2</div>
      <div>PAGE 3 OF 3</div>
    </div>
  </div>

  <!-- PHASE 3: P2 -->
  <div class="section-title">
    <span>Priority 2 (P2) — Self-Serve Monetization & Billing</span>
    <span class="badge badge-p2">Timeline: Week 2 – 3</span>
  </div>

  <div class="task-card">
    <div class="task-header">
      <div class="task-title">3.1 Automated Stripe & Razorpay Subscription Billing Portal</div>
      <div class="task-meta">
        <span class="badge badge-p2">P2 REVENUE</span>
        <span class="task-meta-tag">Est: 8 Hours</span>
        <span class="task-meta-tag">Cost: Standard 2% Fee</span>
      </div>
    </div>
    <div class="task-desc">
      Build self-serve billing portal with dual-currency support (USD on Stripe, INR on Razorpay Subscriptions). 
      Features Growth Tier ($199/mo | ₹14,999/mo) and Scale Tier ($499/mo | ₹39,999/mo). Webhook listener handles automated tenant provisioning, 
      grace periods, and cancellations.
    </div>
    <div class="task-spec-grid">
      <div class="task-spec-item">
        <strong>Files:</strong> <code>apps/web/src/app/api/billing/webhook/route.ts</code>, <code>apps/web/src/app/pricing/page.tsx</code>
      </div>
      <div class="task-spec-item">
        <strong>Capabilities:</strong> Automatic GST tax invoices, Razorpay Recurring UPI / Auto-debit (Mandate compliant).
      </div>
    </div>
  </div>

  <!-- PHASE 4: P3 -->
  <div class="section-title">
    <span>Priority 3 (P3) — Ecosystem Distribution & Scaled Partnerships</span>
    <span class="badge badge-p3">Timeline: Month 2</span>
  </div>

  <div class="task-card">
    <div class="task-header">
      <div class="task-title">4.1 Official Shopify App Store Submission & Listing Package</div>
      <div class="task-meta">
        <span class="badge badge-p3">P3 DISTRIBUTION</span>
        <span class="task-meta-tag">Est: 12 Hours</span>
        <span class="task-meta-tag">Cost: $0.00</span>
      </div>
    </div>
    <div class="task-desc">
      Package FunnelDoctor as an embedded Shopify App using Shopify App Bridge and Polaris design system. 
      Implement mandatory GDPR/DPDP privacy webhooks (<code>customers/data_request</code>, <code>customers/redact</code>, <code>shop/redact</code>) and submit for official Shopify Partner review.
    </div>
    <div class="task-spec-grid">
      <div class="task-spec-item">
        <strong>Review Requirements:</strong> App Bridge v3, OAuth session tokens, Shopify App Billing API integration.
      </div>
      <div class="task-spec-item">
        <strong>Distribution Impact:</strong> Access to over 2,000,000 active Shopify merchants worldwide.
      </div>
    </div>
  </div>

  <!-- STRATEGIC DIFFERENTIATION MATRIX -->
  <div class="section-title" style="border-left-color: #3B82F6;">
    <span>Strategic Positioning: FunnelDoctor vs. Industry Landscape</span>
  </div>

  <table>
    <thead>
      <tr>
        <th>Platform</th>
        <th>Core Job-to-be-Done</th>
        <th>What It Does NOT Do</th>
        <th>FunnelDoctor Advantage</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Triple Whale</strong><br/>($129–$999/mo)</td>
        <td>Ad attribution & blended ROAS tracking (Meta/Google ad spend cockpit).</td>
        <td>Does NOT track checkout DOM friction, rage clicks, or write code fixes.</td>
        <td>FunnelDoctor diagnoses <em>why</em> checkouts fail and writes the code to fix the leak.</td>
      </tr>
      <tr>
        <td><strong>Lifetimely</strong><br/>($49–$399/mo)</td>
        <td>LTV calculation, cohort repurchase rates, and net profit accounting.</td>
        <td>Does NOT diagnose storefront friction or optimize real-time conversion.</td>
        <td>FunnelDoctor recovers lost first-purchase revenue before LTV even begins.</td>
      </tr>
      <tr>
        <td><strong>Elevar</strong><br/>($250–$1,200/mo)</td>
        <td>Server-side data plumbing (Meta CAPI & GA4 server tags).</td>
        <td>Zero diagnostic UI, zero revenue advice, zero code remediation.</td>
        <td>FunnelDoctor provides actionable diagnostic intelligence with ready-to-deploy code.</td>
      </tr>
      <tr>
        <td><strong>Mixpanel / Amplitude</strong><br/>(Usage-based)</td>
        <td>General software product analytics for apps, SaaS, and games.</td>
        <td>Zero out-of-the-box Shopify integration; requires custom engineers.</td>
        <td>FunnelDoctor is purpose-built for e-commerce with built-in UPI, COD, and AOV math.</td>
      </tr>
    </tbody>
  </table>

  <!-- MASTER IMPLEMENTATION SCHEDULE -->
  <div class="section-title" style="border-left-color: #8B5CF6;">
    <span>Master Priority Execution Schedule</span>
  </div>

  <table>
    <thead>
      <tr>
        <th>Phase</th>
        <th>Priority</th>
        <th>Sprint Target</th>
        <th>Key Deliverable</th>
        <th>Resource Cost</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Phase 1</strong></td>
        <td><span class="badge badge-p0">P0</span></td>
        <td>Days 1 – 2</td>
        <td>Postgres (Supabase) Adapter + Redis + Live Dev Store Field Verification</td>
        <td>$0.00 (Free Tiers)</td>
      </tr>
      <tr>
        <td><strong>Phase 2</strong></td>
        <td><span class="badge badge-p1">P1</span></td>
        <td>Week 1</td>
        <td>1-Click Shopify OAuth + 15s Historical GraphQL Sync + Auto-Pixel Injection</td>
        <td>$0.00 (Partner API)</td>
      </tr>
      <tr>
        <td><strong>Phase 3</strong></td>
        <td><span class="badge badge-p2">P2</span></td>
        <td>Week 2 – 3</td>
        <td>Self-Serve Stripe/Razorpay Billing + Outbound Slack/WhatsApp Alerts</td>
        <td>Standard 2% Fee</td>
      </tr>
      <tr>
        <td><strong>Phase 4</strong></td>
        <td><span class="badge badge-p3">P3</span></td>
        <td>Month 2</td>
        <td>Official Shopify App Store Submission + WooCommerce Plugin Distribution</td>
        <td>$0.00 (Partner Acct)</td>
      </tr>
    </tbody>
  </table>

  <div class="footer-note">
    <span>FUNNELDOCTOR AI • MASTER ENGINEERING ROADMAP</span>
    <span>PAGE 3 OF 3</span>
  </div>

</body>
</html>
`;

fs.writeFileSync(htmlFilePath, htmlContent, "utf8");
console.log(`✅ Generated HTML specification at: ${htmlFilePath}`);

console.log("🚀 Spawning Google Chrome to compile high-resolution PDF...");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const fileUrl = `file:///${htmlFilePath.replace(/\\/g, "/")}`;

try {
  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --disable-setuid-sandbox --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "${fileUrl}"`;
  execSync(cmd, { stdio: "inherit" });
  if (fs.existsSync(pdfFilePath)) {
    const stats = fs.statSync(pdfFilePath);
    console.log(`🎉 SUCCESS: Master Roadmap PDF generated (${(stats.size / 1024).toFixed(1)} KB)`);
    console.log(`📍 Location: ${pdfFilePath}`);
  } else {
    console.error("❌ Error: PDF file was not created.");
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Failed to compile PDF:", err);
  process.exit(1);
}
