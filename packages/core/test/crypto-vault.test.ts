import { describe, it, expect } from "vitest";
import { encryptSecret, decryptSecret } from "../src/crypto-vault.js";

describe("CryptoVault (AES-256-GCM Envelope Encryption)", () => {
  it("encrypts and decrypts secrets with authenticated integrity", () => {
    const rawSecret = "fd_sec_top_secret_merchant_key_999";
    const encrypted = encryptSecret(rawSecret);

    expect(encrypted.ciphertext).not.toBe(rawSecret);
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.tag).toBeDefined();

    const decrypted = decryptSecret(encrypted);
    expect(decrypted).toBe(rawSecret);
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
