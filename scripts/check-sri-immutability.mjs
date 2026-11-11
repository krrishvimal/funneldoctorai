/**
 * @file check-sri-immutability.mjs
 * @description CI gate that verifies script immutability:
 * Fails the deployment if any file at an existing published version path (e.g. /v1.0.3/funneldoctor.js)
 * has been modified or tampered with after initial release.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Registry of officially published immutable versions and their golden SHA-384 hashes
const PUBLISHED_VERSIONS = {
  'v1.0.3': {
    relPath: 'apps/web/public/v1.0.3/funneldoctor.js',
    expectedSri: 'sha384-xcpt/f62Rzx7mkV4eEPyWsmt6dQ0fkcdTplK2spcWno7/90v0WnlSU3ZwCQ6Happ',
  },
};

console.log('='.repeat(80));
console.log('🔒 FUNNELDOCTOR AI: SCRIPT IMMUTABILITY & SRI RELEASE VERIFICATION');
console.log('='.repeat(80));

let failures = 0;

for (const [version, meta] of Object.entries(PUBLISHED_VERSIONS)) {
  const fullPath = path.resolve(meta.relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ FAIL: Published version ${version} is missing from ${meta.relPath}`);
    failures++;
    continue;
  }

  const content = fs.readFileSync(fullPath);
  const actualSri = `sha384-${crypto.createHash('sha384').update(content).digest('base64')}`;

  if (actualSri !== meta.expectedSri) {
    console.error(`❌ CRITICAL SECURITY VIOLATION: Published immutable version ${version} was modified!`);
    console.error(`   Expected: ${meta.expectedSri}`);
    console.error(`   Actual:   ${actualSri}`);
    console.error(`   Merchant websites using this SRI hash will be broken by browser security policies!`);
    failures++;
  } else {
    console.log(`✅ PASS: ${version} is verified immutable: ${actualSri}`);
  }
}

if (failures > 0) {
  console.error(`\nDeploy aborted: ${failures} immutable release violations detected.\n`);
  process.exit(1);
} else {
  console.log('\n🎉 ALL PUBLISHED VERSIONS ARE VERIFIED IMMUTABLE!\n');
}
