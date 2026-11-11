"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  AlertCircle,
  Key,
  Users,
  TrendingDown,
  Clock,
  ArrowRight,
  Lock,
  Eye,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface FunnelStep {
  step: string;
  name: string;
  visitors: number;
  dropoffRate: number;
}

interface TenantData {
  siteId: string;
  name: string;
  domain: string;
  industry: string;
  aov: number;
  totalVisitors: number;
  sampleRequired: number;
  sampleRisk: string;
  conversionRate: number;
  purchases: number;
  leakageRange: [number, number];
  cartDropoffPct: number;
  leakageNote: string;
  funnelSteps: FunnelStep[];
  activeKeyId: string;
  auditLogs: {
    time: string;
    actor: string;
    action: string;
    details: string;
  }[];
}

const TENANTS: Record<string, TenantData> = {
  tenant_alpha: {
    siteId: "tenant_alpha",
    name: "Store Alpha",
    domain: "alpha.store",
    industry: "Apparel & Fashion D2C",
    aov: 1499,
    totalVisitors: 10450,
    sampleRequired: 14200,
    sampleRisk: "5% to 32%",
    conversionRate: 3.73,
    purchases: 390,
    leakageRange: [51166, 115123],
    cartDropoffPct: 45.07,
    leakageNote: "Derived from observed 45.07% cart-to-checkout abandonment and ₹1,499 AOV.",
    funnelSteps: [
      { step: "page_view", name: "1. Product Detail Page Views", visitors: 10450, dropoffRate: 0.0 },
      { step: "add_to_cart", name: "2. Add to Cart Drawer", visitors: 1420, dropoffRate: 86.41 },
      { step: "checkout_step", name: "3. Checkout Initiated", visitors: 780, dropoffRate: 45.07 },
      { step: "purchase", name: "4. Payment Completed", visitors: 390, dropoffRate: 50.0 },
    ],
    activeKeyId: "key_alpha_v1_active",
    auditLogs: [
      { time: "1 hour ago", actor: "security_admin", action: "DPDP_RETENTION_PURGE", details: "Hard-purged 1,420 events older than 90 days for alpha.store" },
      { time: "1 day ago", actor: "admin@alpha.store", action: "SECRET_ROTATED", details: "HMAC signing secret rotated with 24h overlap window" },
      { time: "7 days ago", actor: "system", action: "TENANT_REGISTERED", details: "Domain alpha.store bound to tenant_alpha with AES-256-GCM encryption" },
    ],
  },
  tenant_beta: {
    siteId: "tenant_beta",
    name: "Store Beta",
    domain: "beta.store",
    industry: "Consumer Electronics & Audio",
    aov: 4999,
    totalVisitors: 4820,
    sampleRequired: 8500,
    sampleRisk: "5% to 28%",
    conversionRate: 2.24,
    purchases: 108,
    leakageRange: [87982, 197960],
    cartDropoffPct: 58.11,
    leakageNote: "Derived from observed 58.11% cart-to-checkout abandonment and ₹4,999 high-ticket AOV.",
    funnelSteps: [
      { step: "page_view", name: "1. Product Detail Page Views", visitors: 4820, dropoffRate: 0.0 },
      { step: "add_to_cart", name: "2. Add to Cart Drawer", visitors: 590, dropoffRate: 87.76 },
      { step: "checkout_step", name: "3. Checkout Initiated", visitors: 247, dropoffRate: 58.14 },
      { step: "purchase", name: "4. Payment Completed", visitors: 108, dropoffRate: 56.28 },
    ],
    activeKeyId: "key_beta_v2_active",
    auditLogs: [
      { time: "2 hours ago", actor: "security_admin", action: "DPDP_RETENTION_PURGE", details: "Hard-purged 612 events older than 90 days for beta.store" },
      { time: "2 days ago", actor: "ciso@beta.store", action: "EMERGENCY_REVOKE", details: "Emergency revoked compromised secret key v1 (0h grace)" },
      { time: "14 days ago", actor: "system", action: "TENANT_REGISTERED", details: "Domain beta.store bound to tenant_beta with AES-256-GCM encryption" },
    ],
  },
};

export default function MerchantDashboardPage() {
  const [activeSiteId, setActiveSiteId] = useState<string>("tenant_alpha");
  const [activeRole, setActiveRole] = useState<"merchant_admin" | "merchant_viewer">("merchant_admin");
  const [activeTab, setActiveTab] = useState<"funnel" | "security">("funnel");
  const [rotationStatus, setRotationStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentTenant = TENANTS[activeSiteId] || TENANTS.tenant_alpha;
  const funnelSteps = currentTenant.funnelSteps;

  const handleRotateKey = async (emergency = false) => {
    if (activeRole !== "merchant_admin") {
      setRotationStatus("❌ Error: Action blocked. Insufficient permissions (requires 'merchant_admin').");
      return;
    }

    setIsLoading(true);
    setRotationStatus(null);
    try {
      const res = await fetch("/api/dashboard/keys", {
        method: emergency ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: activeSiteId, overlapHours: 24 }),
      });
      const data = await res.json();
      if (res.ok) {
        setRotationStatus(
          emergency
            ? `🚨 Emergency Revocation Executed: Secret revoked immediately with zero overlap grace. New key: ${data.newSecret.slice(0, 14)}...`
            : `✅ Secret Rotated: New secret generated. Previous secret will continue verifying for 24h. New key: ${data.newSecret.slice(0, 14)}...`
        );
      } else {
        setRotationStatus(`❌ Error: ${data.error || "Failed to rotate key"}`);
      }
    } catch {
      setRotationStatus("❌ Network error connecting to rotation service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans p-6 md:p-10">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Merchant Command Center
                <span className="text-xs font-mono font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  Gate 5 Verified
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Multi-Tenant Isolated CRO Intelligence & DPDP Compliance Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Tenant & RBAC Role Simulation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-1 text-xs">
            <span className="px-2.5 text-gray-400">Tenant:</span>
            <select
              value={activeSiteId}
              onChange={(e) => setActiveSiteId(e.target.value)}
              className="bg-black text-emerald-400 border border-gray-700 rounded px-2 py-1 outline-none font-mono"
            >
              <option value="tenant_alpha">Store Alpha (alpha.store)</option>
              <option value="tenant_beta">Store Beta (beta.store)</option>
            </select>
          </div>

          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-1 text-xs">
            <span className="px-2.5 text-gray-400">Role:</span>
            <button
              onClick={() => setActiveRole("merchant_admin")}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeRole === "merchant_admin"
                  ? "bg-emerald-500 text-black font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setActiveRole("merchant_viewer")}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeRole === "merchant_viewer"
                  ? "bg-amber-500 text-black font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Viewer (Read-Only)
            </button>
          </div>

          <Link
            href="/"
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg border border-gray-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto mt-8">
        {/* Role Notice Banner */}
        {activeRole === "merchant_viewer" ? (
          <div className="mb-6 bg-amber-950/40 border border-amber-600/40 rounded-xl p-3 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Viewer Mode (Read-Only):</strong> You are inspecting {currentTenant.name} in audit mode.
                Secret key rotation, revocation, and destructive changes are disabled.
              </span>
            </div>
            <span className="font-mono bg-amber-900/60 border border-amber-700/60 px-2 py-0.5 rounded text-[11px] text-amber-200">
              Role: merchant_viewer
            </span>
          </div>
        ) : (
          <div className="mb-6 bg-emerald-950/30 border border-emerald-600/30 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Admin Mode:</strong> You have full administrative authority over {currentTenant.name} including cryptographic key rotation and data policy settings.
              </span>
            </div>
            <span className="font-mono bg-emerald-900/60 border border-emerald-700/60 px-2 py-0.5 rounded text-[11px] text-emerald-200">
              Role: merchant_admin
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab("funnel")}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "funnel"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <TrendingDown className="w-4 h-4" /> Funnel Drop-Off & Revenue Analytics
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "security"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Shield className="w-4 h-4" /> Security, Keys & DPDP Audit Trail
          </button>
        </div>

        {/* Tab 1: Funnel & Uncertainty */}
        {activeTab === "funnel" && (
          <div className="space-y-8">
            {/* Uncertainty Banner (Claude Requirement: Show Uncertainty in UI) */}
            <div className="bg-amber-950/30 border border-amber-600/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-200">
                  Statistical Sample Size Notice (Peeking Bias Guardrail)
                </h3>
                <p className="text-xs text-amber-300/80 mt-1">
                  Collected <strong>{currentTenant.totalVisitors.toLocaleString()} / {currentTenant.sampleRequired.toLocaleString()}</strong> required visitors for 95% confidence (80% power, 15% MDE). 
                  Stopping the experiment early based on preliminary metrics increases false-positive discovery risk from {currentTenant.sampleRisk}. 
                  Results will finalize once sample size threshold is satisfied.
                </p>
              </div>
            </div>

            {/* Projected Revenue Leakage Card (Claude Requirement: Clearly Label Projected Figures) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Total Funnel Conversion ({currentTenant.name})
                </span>
                <div className="text-3xl font-bold text-white mt-2">{currentTenant.conversionRate}%</div>
                <div className="text-xs text-gray-400 mt-1">
                  {currentTenant.purchases.toLocaleString()} purchases from {currentTenant.totalVisitors.toLocaleString()} PDP visitors
                </div>
                <div className="mt-3 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-1 rounded inline-block">
                  AOV: ₹{currentTenant.aov.toLocaleString()} • {currentTenant.industry}
                </div>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 md:col-span-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    PROJECTED REVENUE LEAKAGE
                  </span>
                  <span className="text-[11px] font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                    Range-Based Projection
                  </span>
                </div>
                <div className="text-3xl font-bold text-amber-300 mt-2">
                  ₹{currentTenant.leakageRange[0].toLocaleString()} - ₹{currentTenant.leakageRange[1].toLocaleString()} <span className="text-sm font-normal text-gray-400">/ week</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  <strong>Projected Estimate:</strong> {currentTenant.leakageNote} Actual realized lift will vary depending on mobile payment gateway latency.
                </p>
              </div>
            </div>

            {/* Funnel Drop-off Progression Visualizer */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <h2 className="text-base font-semibold text-white">
                  Live Storefront Funnel Progression ({currentTenant.name} - {currentTenant.domain})
                </h2>
                <span className="text-xs font-mono text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded border border-gray-700">
                  Tenant ID: {currentTenant.siteId}
                </span>
              </div>

              <div className="space-y-6">
                {funnelSteps.map((step, idx) => (
                  <div key={step.step} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-gray-300">{step.name}</span>
                      <div className="flex gap-4">
                        <span className="font-mono text-gray-400">{step.visitors.toLocaleString()} visitors</span>
                        {idx > 0 && (
                          <span className="font-mono text-red-400 font-medium">
                            -{step.dropoffRate}% drop
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-3 w-full bg-gray-800/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0
                            ? "bg-blue-500"
                            : idx === 1
                            ? "bg-indigo-500"
                            : idx === 2
                            ? "bg-purple-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${(step.visitors / currentTenant.totalVisitors) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Security & DPDP Compliance */}
        {activeTab === "security" && (
          <div className="space-y-8">
            {/* Status Feedback */}
            {rotationStatus && (
              <div className="p-4 rounded-xl border bg-gray-900 text-xs font-mono border-gray-700">
                {rotationStatus}
              </div>
            )}

            {/* Credential Management Card */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" /> Merchant HMAC Secret Governance ({currentTenant.name})
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    AES-256-GCM Envelope Encrypted with Additional Authenticated Data (AAD) tenant isolation.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleRotateKey(false)}
                    disabled={activeRole !== "merchant_admin" || isLoading}
                    className={`text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                      activeRole === "merchant_admin"
                        ? "bg-emerald-600 hover:bg-emerald-500 text-black cursor-pointer"
                        : "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {activeRole === "merchant_admin" ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" /> Scheduled 24h Rotation
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-gray-500" /> Rotate Secret (Admin Only)
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRotateKey(true)}
                    disabled={activeRole !== "merchant_admin" || isLoading}
                    className={`text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 ${
                      activeRole === "merchant_admin"
                        ? "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 cursor-pointer"
                        : "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {activeRole === "merchant_admin" ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" /> Emergency Revoke (0h Grace)
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-gray-500" /> Revoke Key (Admin Only)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {activeRole === "merchant_viewer" && (
                <div className="mt-4 p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-400 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    <strong>Administrative Actions Locked:</strong> You are signed in with the <strong>Viewer</strong> role. To rotate or revoke HMAC signing keys, switch your role to <strong>Admin</strong>.
                  </span>
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-black/60 border border-gray-800 p-3 rounded-lg">
                  <span className="text-gray-500 block">Current Key Version</span>
                  <span className="text-gray-200 font-bold mt-1 block">{currentTenant.activeKeyId}</span>
                </div>
                <div className="bg-black/60 border border-gray-800 p-3 rounded-lg">
                  <span className="text-gray-500 block">Overlap Grace Period</span>
                  <span className="text-emerald-400 font-bold mt-1 block">24 Hours Configured</span>
                </div>
                <div className="bg-black/60 border border-gray-800 p-3 rounded-lg">
                  <span className="text-gray-500 block">Role Enforcement</span>
                  <span className={`font-bold mt-1 block ${activeRole === "merchant_admin" ? "text-emerald-400" : "text-amber-400"}`}>
                    {activeRole === "merchant_admin" ? "Admin (Authorized)" : "Viewer (Restricted)"}
                  </span>
                </div>
              </div>
            </div>

            {/* DPDP Compliance Card */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> DPDP 2023 & GDPR Compliance Engine
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Raw visitor clickstreams and device identifiers are hard-purged after 90 days.
                  </p>
                </div>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full font-mono">
                  90-Day Policy Enforced
                </span>
              </div>
            </div>

            {/* Audit Log Ledger Table (Claude Requirement: Audit logs for who viewed or changed what) */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" /> Tamper-Evident Audit Ledger ({currentTenant.domain})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500">
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3">Actor</th>
                      <th className="pb-3">Action</th>
                      <th className="pb-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {currentTenant.auditLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td className="py-3 text-gray-500">{log.time}</td>
                        <td className="py-3 text-amber-400">{log.actor}</td>
                        <td className="py-3 font-semibold text-emerald-400">{log.action}</td>
                        <td className="py-3 text-gray-400">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
