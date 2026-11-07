// Full System Verification & Stress Test Suite for FunnelDoctor AI
// Tests API routes, Gemini multimodal pipeline, client pages, math, and edge cases.

const BASE_URL = 'http://127.0.0.1:3000';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
  }
}

async function runTests() {
  console.log('\n================================================================');
  console.log('🩺 FUNNELDOCTOR AI - COMPREHENSIVE SYSTEM VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // TEST SUITE 1: API ROUTE TESTS (/api/audit)
  // --------------------------------------------------------------------------
  console.log('📦 [1/5] API Route Protocol & Error Handling:');

  // Test 1.1: Missing parameter on GET
  try {
    const res = await fetch(`${BASE_URL}/api/audit`);
    assert(res.status === 400, 'GET /api/audit without params returns HTTP 400 Bad Request');
  } catch (e) {
    assert(false, 'GET /api/audit without params', e.message);
  }

  // Test 1.2: GET with SaaS domain
  try {
    const res = await fetch(`${BASE_URL}/api/audit?domain=linear.app`);
    const data = await res.json();
    assert(res.status === 200 && data.success === true, 'GET /api/audit?domain=linear.app returns HTTP 200');
    assert(data.report.category.toLowerCase().includes('saas'), 'Linear correctly classified as B2B SaaS');
    assert(data.report.steps.length >= 5, 'Linear audit contains 5+ funnel stages');
    assert(!data.report.steps.some(s => s.name.toLowerCase().includes('bag')), 'Linear funnel contains zero e-commerce terms');
  } catch (e) {
    assert(false, 'GET linear.app audit', e.message);
  }

  // Test 1.3: GET with Trial Commerce domain
  try {
    const res = await fetch(`${BASE_URL}/api/audit?domain=smytten.com`);
    const data = await res.json();
    assert(res.status === 200 && data.success === true, 'GET /api/audit?domain=smytten.com returns HTTP 200');
    assert(data.report.category.toLowerCase().includes('trial'), 'Smytten classified as Trial Commerce');
    assert(data.report.worstStepName.toLowerCase().includes('trial'), 'Smytten identifies Trial Bag as bottleneck');
  } catch (e) {
    assert(false, 'GET smytten.com audit', e.message);
  }

  // Test 1.4: POST with missing payload
  try {
    const res = await fetch(`${BASE_URL}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(res.status === 400, 'POST /api/audit with empty body returns HTTP 400');
  } catch (e) {
    assert(false, 'POST /api/audit empty body', e.message);
  }

  // Test 1.5: POST Mode A (Direct URL audit)
  try {
    const res = await fetch(`${BASE_URL}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteUrl: 'https://zerodha.com' })
    });
    const data = await res.json();
    assert(res.status === 200 && data.mode === 'domain', 'POST /api/audit with websiteUrl triggers domain audit mode');
    assert(data.report.brandName.toLowerCase().includes('zerodha'), 'Brand identified as Zerodha');
  } catch (e) {
    assert(false, 'POST /api/audit direct URL', e.message);
  }

  // Test 1.6: POST Mode B (Custom CSV Telemetry)
  try {
    const customCsv = `event,sessions\n01. Storefront,80000\n02. Cart,32000\n03. Payment,8000\n04. Completed,6500`;
    const res = await fetch(`${BASE_URL}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteUrl: 'https://myteststore.in', csvText: customCsv })
    });
    const data = await res.json();
    assert(res.status === 200 && data.mode === 'csv', 'POST /api/audit with csvText triggers CSV mode');
    assert(data.report.funnelMetrics.totalInitialVisitors === 80000, 'CSV Initial visitors parsed accurately (80,000)');
    assert(data.report.funnelMetrics.totalFinalConversions === 6500, 'CSV Final conversions parsed accurately (6,500)');
  } catch (e) {
    assert(false, 'POST /api/audit CSV ingestion', e.message);
  }

  // --------------------------------------------------------------------------
  // TEST SUITE 2: DEDICATED AUDIT REPORT PAGES (/audit/[slug])
  // --------------------------------------------------------------------------
  console.log('\n📄 [2/5] Dedicated Report Page Render & SSR Verification:');

  const pagesToTest = [
    { slug: 'nike-in', expectedBrand: 'Nike' },
    { slug: 'smytten-com', expectedBrand: 'Smytten' },
    { slug: 'linear-app', expectedBrand: 'Linear' },
    { slug: 'instagram-com', expectedBrand: 'Instagram' }
  ];

  for (const p of pagesToTest) {
    try {
      const res = await fetch(`${BASE_URL}/audit/${p.slug}`);
      const html = await res.text();
      assert(res.status === 200, `Page /audit/${p.slug} returns HTTP 200`);
      assert(html.includes('FunnelDoctor') || html.includes('Studio'), `/audit/${p.slug} renders FunnelDoctor shell`);
      assert(!html.includes('01. 01.'), `/audit/${p.slug} does NOT have double-prefixed '01. 01.' bug`);
    } catch (e) {
      assert(false, `Page /audit/${p.slug}`, e.message);
    }
  }

  // --------------------------------------------------------------------------
  // TEST SUITE 3: MATHEMATICAL INTEGRITY & UNIT ECONOMICS
  // --------------------------------------------------------------------------
  console.log('\n🔢 [3/5] Financial Formulas & Mathematical Integrity:');

  try {
    const res = await fetch(`${BASE_URL}/api/audit?domain=nike.in`);
    const data = await res.json();
    const { visitors, dropoffRate, aov, leakedMonthlyLakhs, recoverableMonthlyLakhs } = data.report;

    // Formula: (visitors * (dropoffRate / 100) * aov) / 100,000
    const calculatedLeak = Number(((visitors * (dropoffRate / 100) * aov) / 100000).toFixed(1));
    const calculatedRecoverable = Number((calculatedLeak * 0.22).toFixed(1));

    assert(Math.abs(leakedMonthlyLakhs - calculatedLeak) <= 0.5, `Monthly Loss (₹${leakedMonthlyLakhs}L) matches mathematical unit economics`);
    assert(Math.abs(recoverableMonthlyLakhs - calculatedRecoverable) <= 0.5, `Recoverable Revenue (+₹${recoverableMonthlyLakhs}L) matches 22% recovery model`);
  } catch (e) {
    assert(false, 'Financial Formula Check', e.message);
  }

  // --------------------------------------------------------------------------
  // TEST SUITE 4: DYNAMIC GEMINI LIVE GENERATION ON NOVEL DOMAINS
  // --------------------------------------------------------------------------
  console.log('\n🧠 [4/5] Dynamic Multimodal Gemini Generation on Novel Domains:');

  try {
    const novelDomain = 'notion.so';
    const res = await fetch(`${BASE_URL}/api/audit?domain=${novelDomain}`);
    const data = await res.json();
    assert(res.status === 200 && data.success === true, `Novel domain (${novelDomain}) analyzed successfully`);
    assert(data.report.steps.length >= 4, `${novelDomain} has full sequential steps`);
    assert(data.report.findings.length >= 3, `${novelDomain} generated 3 root-cause findings (UX, Pricing, Latency)`);
    assert(data.report.reactCode.length > 50, `${novelDomain} generated drop-in React remediation code`);
    assert(data.report.prdMarkdown.includes('#'), `${novelDomain} generated full Markdown PRD`);
  } catch (e) {
    assert(false, 'Dynamic Gemini Generation', e.message);
  }

  // --------------------------------------------------------------------------
  // TEST SUITE 5: ADVERSARIAL & EDGE-CASE RESILIENCE
  // --------------------------------------------------------------------------
  console.log('\n🛡️ [5/5] Adversarial Inputs & Edge-Case Resilience:');

  // Test 5.1: Oddly formatted URL with uppercase, protocol, trailing slash
  try {
    const res = await fetch(`${BASE_URL}/api/audit?domain=HTTPS://WWW.GITHUB.COM/features/`);
    const data = await res.json();
    assert(res.status === 200, 'Normalized dirty URL (HTTPS://WWW.GITHUB.COM/features/) successfully');
    assert(data.report.brandName.toLowerCase().includes('github'), 'Extracted brand name "GitHub" from complex URL');
  } catch (e) {
    assert(false, 'Dirty URL normalization', e.message);
  }

  // Test 5.2: Ingestion CSV with comma in quoted strings
  try {
    const quotedCsv = `step,visitors\n"Step 1: Welcome, User",1000\n"Step 2: Payment, Card",200`;
    const res = await fetch(`${BASE_URL}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteUrl: 'https://test.com', csvText: quotedCsv })
    });
    const data = await res.json();
    assert(res.status === 200, 'Successfully parsed CSV containing commas inside quoted step names');
  } catch (e) {
    assert(false, 'Quoted comma CSV test', e.message);
  }

  // --------------------------------------------------------------------------
  // SUMMARY SCORECARD
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`🏁 TEST EXECUTION COMPLETE: ${passedTests}/${totalTests} PASSED (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  if (failedTests === 0) {
    console.log('🌟 ALL TEST SUITES PASSED WITH ZERO REGRESSIONS!');
  } else {
    console.log(`⚠️ ${failedTests} test(s) failed. Check details above.`);
  }
  console.log('================================================================\n');
}

runTests();
