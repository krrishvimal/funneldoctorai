/**
 * @file rbac.ts
 * @description Role-Based Access Control (RBAC) and Cryptographic Session Token Verification.
 * 
 * Enforces:
 * 1. Strict Tenant Isolation: User A can NEVER query or mutate Tenant B's data.
 * 2. Role Permissions:
 *    - `merchant_admin`: Full access (view analytics, rotate HMAC secrets, change status, export audit logs).
 *    - `merchant_viewer`: Read-only access (view funnel metrics and charts).
 * 3. Tamper-Proof Cryptographic Tokens: Signed using HMAC-SHA256 with timing-safe comparison.
 */

import crypto from "node:crypto";

export type UserRole = "merchant_admin" | "merchant_viewer";

export interface MerchantSession {
  userId: string;
  siteId: string; // The merchant tenant bound to this session
  role: UserRole;
  email: string;
  expiresAt: number;
}

function getSessionSigningSecret(): string {
  return (
    process.env.SESSION_SIGNING_SECRET ||
    process.env.ENCRYPTION_MASTER_KEY ||
    "funneldoctor-session-signing-secret-default-dev"
  );
}

/**
 * Creates a signed, tamper-evident session token.
 * Format: base64(payload) + "." + hmac_sha256(base64(payload))
 */
export function createSessionToken(
  session: Omit<MerchantSession, "expiresAt">,
  durationHours = 24
): string {
  const expiresAt = Date.now() + durationHours * 60 * 60 * 1000;
  const fullSession: MerchantSession = { ...session, expiresAt };

  const payloadBase64 = Buffer.from(JSON.stringify(fullSession), "utf8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSigningSecret())
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies and decodes a session token.
 * Returns null if token is tampered, signature does not match, or token has expired.
 */
export function verifySessionToken(token: string): MerchantSession | null {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [payloadBase64, providedSig] = token.split(".");
  if (!payloadBase64 || !providedSig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSessionSigningSecret())
    .update(payloadBase64)
    .digest("base64url");

  // Constant-time comparison to prevent timing attacks
  const bufExpected = Buffer.from(expectedSig, "utf8");
  const bufProvided = Buffer.from(providedSig, "utf8");

  if (bufExpected.length !== bufProvided.length) return null;
  if (!crypto.timingSafeEqual(bufExpected, bufProvided)) return null;

  try {
    const jsonStr = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const session: MerchantSession = JSON.parse(jsonStr);

    if (Date.now() > session.expiresAt) {
      return null; // Expired
    }

    return session;
  } catch {
    return null;
  }
}

export interface AccessCheckResult {
  authorized: boolean;
  status: 200 | 401 | 403;
  error?: string;
  session?: MerchantSession;
}

/**
 * Core security enforcement gate:
 * - Rejects unauthenticated requests (401).
 * - Strictly rejects cross-tenant access attempts (403).
 * - Enforces required role permissions (403).
 */
export function enforceTenantAccess(
  session: MerchantSession | null,
  targetSiteId: string,
  requiredRole: UserRole = "merchant_viewer"
): AccessCheckResult {
  if (!session) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required. Please sign in to access the merchant dashboard.",
    };
  }

  // Cross-tenant access check (IDOR Protection)
  if (session.siteId !== targetSiteId) {
    return {
      authorized: false,
      status: 403,
      error: `Access Denied: You are not authorized to view or manage data for site '${targetSiteId}'.`,
    };
  }

  // Role permissions check
  if (requiredRole === "merchant_admin" && session.role !== "merchant_admin") {
    return {
      authorized: false,
      status: 403,
      error: "Insufficient permissions: This action requires the 'merchant_admin' role.",
    };
  }

  return {
    authorized: true,
    status: 200,
    session,
  };
}
