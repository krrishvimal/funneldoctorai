/**
 * @file crypto-vault.ts
 * @description AES-256-GCM Envelope Encryption for sensitive credentials and tenant HMAC secrets at rest.
 * 
 * Ensures merchant HMAC secrets are never stored as plaintext in persistent databases.
 * Uses authenticated AES-256-GCM encryption with randomized IVs and authentication tags.
 */

import crypto from "node:crypto";

export interface EncryptedSecretPayload {
  ciphertext: string;
  iv: string;
  tag: string;
}

// Master encryption key derived from environment or secure test fallback
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for GCM

function getMasterKey(): Buffer {
  const envKey = process.env.ENCRYPTION_MASTER_KEY;
  if (envKey) {
    return crypto.createHash("sha256").update(envKey).digest();
  }
  // Deterministic fallback for dev/test environments
  return crypto.createHash("sha256").update("funneldoctor-master-key-dev-fallback").digest();
}

/**
 * Encrypts a plaintext secret with AES-256-GCM.
 */
export function encryptSecret(plaintext: string): EncryptedSecretPayload {
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);

  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");

  const tag = cipher.getAuthTag().toString("hex");

  return {
    ciphertext,
    iv: iv.toString("hex"),
    tag,
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload back to plaintext.
 * Throws if the ciphertext or tag has been tampered with.
 */
export function decryptSecret(payload: EncryptedSecretPayload): string {
  const masterKey = getMasterKey();
  const iv = Buffer.from(payload.iv, "hex");
  const tag = Buffer.from(payload.tag, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);

  decipher.setAuthTag(tag);

  let plaintext = decipher.update(payload.ciphertext, "hex", "utf8");
  plaintext += decipher.final("utf8");

  return plaintext;
}
