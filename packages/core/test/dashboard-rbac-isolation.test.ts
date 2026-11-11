import { describe, it, expect } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
  enforceTenantAccess,
  MerchantSession,
} from "../src/auth/rbac.js";
import { calculateRequiredSampleSize, applyBenjaminiHochberg } from "../src/stats-engine.js";

describe("Gate 5: Dashboard RBAC & Adversarial Tenant Isolation Suite", () => {
  const alphaAdminToken = createSessionToken({
    userId: "usr_alpha_1",
    siteId: "tenant_alpha",
    role: "merchant_admin",
    email: "admin@alpha.store",
  });

  const alphaViewerToken = createSessionToken({
    userId: "usr_alpha_2",
    siteId: "tenant_alpha",
    role: "merchant_viewer",
    email: "analyst@alpha.store",
  });

  const betaAdminToken = createSessionToken({
    userId: "usr_beta_1",
    siteId: "tenant_beta",
    role: "merchant_admin",
    email: "admin@beta.store",
  });

  describe("Cryptographic Session Token Tamper-Resistance", () => {
    it("verifies authentic tokens and extracts bound tenant siteId", () => {
      const session = verifySessionToken(alphaAdminToken);
      expect(session).not.toBeNull();
      expect(session?.siteId).toBe("tenant_alpha");
      expect(session?.role).toBe("merchant_admin");
    });

    it("rejects tokens tampered with modified payload", () => {
      const [payload, sig] = alphaAdminToken.split(".");
      // Attacker changes payload to elevate to tenant_beta
      const tamperedJson = JSON.stringify({
        userId: "usr_alpha_1",
        siteId: "tenant_beta",
        role: "merchant_admin",
        email: "admin@alpha.store",
        expiresAt: Date.now() + 86400000,
      });
      const tamperedPayload = Buffer.from(tamperedJson).toString("base64url");
      const tamperedToken = `${tamperedPayload}.${sig}`;

      expect(verifySessionToken(tamperedToken)).toBeNull();
    });

    it("rejects tokens with invalid signature", () => {
      const [payload] = alphaAdminToken.split(".");
      const badToken = `${payload}.invalid_signature_hex`;
      expect(verifySessionToken(badToken)).toBeNull();
    });

    it("rejects expired tokens", () => {
      const expiredToken = createSessionToken(
        {
          userId: "usr_expired",
          siteId: "tenant_alpha",
          role: "merchant_viewer",
          email: "old@alpha.store",
        },
        -1 // Expired 1 hour ago
      );
      expect(verifySessionToken(expiredToken)).toBeNull();
    });
  });

  describe("Adversarial Cross-Tenant Access Protection (IDOR)", () => {
    it("allows Tenant Alpha Admin to access Tenant Alpha data", () => {
      const session = verifySessionToken(alphaAdminToken);
      const check = enforceTenantAccess(session, "tenant_alpha", "merchant_viewer");
      expect(check.authorized).toBe(true);
      expect(check.status).toBe(200);
    });

    it("STRICTLY BLOCKS Tenant Alpha Admin from accessing Tenant Beta data (IDOR attack)", () => {
      const session = verifySessionToken(alphaAdminToken);
      // Malicious attempt: Alpha Admin passes targetSiteId = 'tenant_beta' in URL/API
      const check = enforceTenantAccess(session, "tenant_beta", "merchant_viewer");
      expect(check.authorized).toBe(false);
      expect(check.status).toBe(403);
      expect(check.error).toMatch(/Access Denied.*not authorized.*tenant_beta/i);
    });

    it("blocks unauthenticated users (missing token)", () => {
      const check = enforceTenantAccess(null, "tenant_alpha");
      expect(check.authorized).toBe(false);
      expect(check.status).toBe(401);
      expect(check.error).toMatch(/Authentication required/i);
    });
  });

  describe("Role-Based Access Control (RBAC Permissions)", () => {
    it("allows Admin role to perform sensitive actions (e.g. key rotation)", () => {
      const session = verifySessionToken(alphaAdminToken);
      const check = enforceTenantAccess(session, "tenant_alpha", "merchant_admin");
      expect(check.authorized).toBe(true);
    });

    it("BLOCKS Viewer role from performing admin actions (e.g. key rotation)", () => {
      const session = verifySessionToken(alphaViewerToken);
      const check = enforceTenantAccess(session, "tenant_alpha", "merchant_admin");
      expect(check.authorized).toBe(false);
      expect(check.status).toBe(403);
      expect(check.error).toMatch(/requires the 'merchant_admin' role/i);
    });
  });

  describe("Dashboard Uncertainty & Projected Metric Guardrails", () => {
    it("calculates required sample size and flags under-powered premature tests", () => {
      // Baseline 4% conversion rate, targeting 15% relative lift with 80% power
      const sampleCalc = calculateRequiredSampleSize(0.04, 0.15, 0.05, 0.8, 3000);
      expect(sampleCalc.totalRequiredVisitors).toBeGreaterThan(5000);
      expect(sampleCalc.isRequirementMet).toBe(false);
      expect(sampleCalc.statusMessage).toContain("Need");
    });

    it("computes projected revenue leakage as ranges, never misleading point estimates", () => {
      const result = applyBenjaminiHochberg(
        [
          {
            cohortId: "issue_cart_fatigue",
            cohortName: "Cart Drawer Drop",
            rawPValue: 0.01,
            baselineCr: 0.05,
            observedCr: 0.03,
            visitors: 2000,
            conversions: 60,
          },
        ],
        { aov: 1200, weeklyVisitors: 10000, falseDiscoveryRate: 0.1 }
      );

      expect(result.length).toBe(1);
      const leak = result[0];
      // Must have lower and upper uncertainty bounds
      expect(leak.weeklyRevenueLeakRange).toBeDefined();
      expect(Array.isArray(leak.weeklyRevenueLeakRange)).toBe(true);
      expect(leak.weeklyRevenueLeakRange[1]).toBeGreaterThanOrEqual(leak.weeklyRevenueLeakRange[0]);
    });
  });
});
