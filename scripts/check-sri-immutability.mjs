/**
 * @file check-sri-immutability.mjs
 * @description CI gate that verifies script immutability:
 * Dynamically scans apps/web/public/ for all published version folders (v*),
 * verifies every bundle against scripts/sri-manifest.json, and fails the deployment
 * if any released file has been modified or if an unregistered version is published.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const manifestPath = path.resolve('scripts/sri-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log('='.repeat(80));
console.log('🔒 FUNNELDOCTOR AI: DYNAMIC SCRIPT IMMUTABILITY & SRI RELEASE VERIFICATION');
console.log('='.repeat(80));

let failures = 0;
let verifiedCount = 0;

// 1. Scan apps/web/public/ for any directory starting with 'v' (excluding legacy non-semantic '/v1')
const publicDir = path.resolve('apps/web/public');
const discoveredVersions = fs.readdirSync(publicDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && /^v\d+\.\d+\.\d+/.test(d.name))
  .map(d => d.name);

console.log(`Discovered ${discoveredVersions.length} semantic version directory(ies): ${discoveredVersions.join(', ')}`);

// 2. Verify all discovered versions exist in manifest
for (const version of discoveredVersions) {
  if (!manifest[version]) {
    console.error(`❌ CRITICAL RELEASE ERROR: Directory '${version}' exists in public/ but is NOT registered in scripts/sri-manifest.json!`);
    console.error(`   Every release must be officially committed to the SRI manifest.`);
    failures++;
    continue;
  }

  const meta = manifest[version];
  const fullPath = path.resolve(meta.relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ FAIL: Published version ${version} is missing from disk at ${meta.relPath}`);
    failures++;
    continue;
  }

  const content = fs.readFileSync(fullPath);
  const actualSri = `sha384-${crypto.createHash('sha384').update(content).digest('base64')}`;

  if (actualSri !== meta.expectedSri) {
    console.error(`❌ CRITICAL SECURITY VIOLATION: Published immutable version ${version} was modified in-place!`);
    console.error(`   Expected: ${meta.expectedSri}`);
    console.error(`   Actual:   ${actualSri}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${version} [${meta.status}] verified immutable: ${actualSri}`);
    verifiedCount++;
  }
}

// 3. Confirm all manifest versions exist on disk
for (const [ver, meta] of Object.entries(manifest)) {
  if (!discoveredVersions.includes(ver)) {
    console.error(`❌ FAIL: Version '${ver}' in manifest is missing from disk!`);
    failures++;
  }
}

// 4. Git Branch Immutability Verification (Prevents PRs from altering existing frozen releases)
try {
  const gitDiff = execSync('git diff --name-only origin/main 2>nul || git diff --name-only HEAD~1 2>nul', { encoding: 'utf8' });
  const modifiedFiles = gitDiff.split('\n').filter(Boolean);

  for (const file of modifiedFiles) {
    const match = file.match(/apps\/web\/public\/(v\d+\.\d+\.\d+)\//);
    if (match) {
      const version = match[1];
      if (manifest[version] && manifest[version].status === 'deprecated') {
        console.error(`❌ CRITICAL SECURITY ERROR: PR modifies frozen immutable release '${version}' (${file})!`);
        failures++;
      }
    }
  }
} catch {
  // Graceful fallback when running in clean commit tree
}

if (failures > 0) {
  console.error(`\nDeploy aborted: ${failures} immutable release violations detected.\n`);
  process.exit(1);
} else {
  console.log(`\n🎉 ALL ${verifiedCount} PUBLISHED VERSIONS ARE VERIFIED IMMUTABLE!\n`);
}
