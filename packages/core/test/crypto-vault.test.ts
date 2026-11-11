import { describe, it, expect } from "vitest";
import { encryptSecret, decryptSecret } from "../src/crypto-vault.js";

describe("CryptoVault (AES-256-GCM Envelope Encryption)", () => {
  it("encrypts and decrypts secrets with authenticated integrity and keyId versioning", () => {
    const rawSecret = "fd_sec_top_secret_merchant_key_999";
    const encrypted = encryptSecret(rawSecret, "tenant-101");

    expect(encrypted.keyId).toBe("v1");
    expect(encrypted.ciphertext).not.toBe(rawSecret);
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.tag).toBeDefined();

    const decrypted = decryptSecret(encrypted, "tenant-101");
    expect(decrypted).toBe(rawSecret);
  });

  it("prevents cross-tenant ciphertext swapping using Additional Authenticated Data (AAD)", () => {
    // Encrypt secret bound to Tenant A
    const tenantASecret = "fd_sec_secret_belonging_to_tenant_a";
    const encryptedForTenantA = encryptSecret(tenantASecret, "tenant-a.com");

    // Decrypting with Tenant A succeeds
    expect(decryptSecret(encryptedForTenantA, "tenant-a.com")).toBe(tenantASecret);

    // Ciphertext Swapping Attack: Attacker copies Tenant A's ciphertext into Tenant B's record
    // Decrypting with Tenant B's ID MUST FAIL cryptographically!
    expect(() => decryptSecret(encryptedForTenantA, "tenant-b.com")).toThrow();
  });

  it("fails decryption when ciphertext or auth tag is tampered with", () => {
    const encrypted = encryptSecret("sensitive_token_123");

    // Tamper with ciphertext
    const tamperedCiphertext = {
      ...encrypted,
      ciphertext: encrypted.ciphertext.slice(0, -2) + "ff",
    };
    expect(() => decryptSecret(tamperedCiphertext)).toThrow();

    // Tamper with tag
    const tamperedTag = {
      ...encrypted,
      tag: "0".repeat(32),
    };
    expect(() => decryptSecret(tamperedTag)).toThrow();
  });
});
