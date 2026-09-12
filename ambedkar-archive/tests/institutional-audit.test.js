/**
 * institutional-audit.test.js
 * Verification suite for Dr. Ambedkar Digital Heritage Archive Institutional Upgrade:
 * - Memorials API & Data Integrity
 * - Political Thought & Debates API
 * - Digital Preservation & Cryptographic SHA-256 Manifest
 * - Cross-Archive Unified Search (Volumes, Memorials, Debates, Letters, Vows)
 * - Grounded AI Assistant Historical Q&A
 * - Frontend Pages Availability (24 pages total)
 */

const assert = require('assert');

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';

async function runTests() {
  console.log('======================================================');
  console.log('🏛️ AMBEDKAR DIGITAL HERITAGE ARCHIVE INSTITUTIONAL VERIFICATION');
  console.log(`Target: ${BASE_URL}`);
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   Error: ${err.message}\n`);
      failed++;
    }
  }

  // 1. Memorials API
  await test('GET /api/memorials returns 8 verified national memorials', async () => {
    const res = await fetch(`${BASE_URL}/api/memorials`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.count, 8);
    const daic = json.data.find(m => m.id === 'daic-delhi');
    assert.ok(daic, 'DAIC New Delhi must exist in memorials');
    assert.strictEqual(daic.city, 'New Delhi');
    assert.ok(Array.isArray(daic.architecturalFeatures), 'Architectural features must be an array');
    assert.ok(daic.audioNarration, 'Audio narration script must exist');
  });

  await test('GET /api/memorials/:id returns specific memorial details', async () => {
    const res = await fetch(`${BASE_URL}/api/memorials/chaitya-bhoomi-mumbai`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.city, 'Mumbai');
    assert.ok(json.data.historicalContext.includes('December 7, 1956'));
  });

  // 2. Debates API
  await test('GET /api/debates returns 6 structured historical debate modules', async () => {
    const res = await fetch(`${BASE_URL}/api/debates`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.count, 6);
    
    // Verify Ambedkar vs Gandhi module
    const ag = json.data.find(d => d.id === 'ambedkar-gandhi-debates');
    assert.ok(ag, 'Ambedkar vs Gandhi debates module must exist');
    assert.ok(ag.ambedkarPosition.bawsReference.includes('BAWS Vol. 9'));
    assert.ok(ag.scholarlyInterpretationVsFact.documentedFacts.length >= 3);
  });

  await test('GET /api/debates/:id returns specific historical debate details', async () => {
    const res = await fetch(`${BASE_URL}/api/debates/round-table-conferences-1932-debates`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.topicsCovered.some(t => t.includes('Round Table Conferences')));
    // Verify 3rd RTC historical fact precision
    const facts = json.data.scholarlyInterpretationVsFact.documentedFacts;
    assert.ok(facts.some(f => f.includes('Third Round Table Conference')));
  });

  // 3. Digital Preservation Manifest API
  await test('GET /api/preservation/manifest returns SHA-256 hashes and Dublin Core standard', async () => {
    const res = await fetch(`${BASE_URL}/api/preservation/manifest`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.overallHealth, 'HEALTHY');
    assert.strictEqual(json.institution, 'Dr. Ambedkar International Centre (DAIC)');
    assert.ok(Array.isArray(json.manifest));
    assert.strictEqual(json.manifest.length, 6);

    const memItem = json.manifest.find(m => m.filename === 'memorials.json');
    assert.ok(memItem, 'memorials.json must be in preservation manifest');
    assert.strictEqual(memItem.status, 'Verified');
    assert.strictEqual(memItem.checksumAlgorithm, 'SHA-256');
    assert.strictEqual(typeof memItem.sha256, 'string');
    assert.strictEqual(memItem.sha256.length, 64);
  });

  // 4. Cross-Archive Unified Search API
  await test('GET /api/search returns cross-corpus results across volumes, memorials, and debates', async () => {
    const res = await fetch(`${BASE_URL}/api/search?q=gandhi`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.results.length > 0, 'Results for "gandhi" must be returned');
    assert.ok(json.data.facets.debates >= 1, 'Debates facet must include matches');
  });

  await test('GET /api/search filters accurately by type=memorials', async () => {
    const res = await fetch(`${BASE_URL}/api/search?q=delhi&type=memorials`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.results.every(r => r.type === 'Memorial'));
  });

  // 5. AI Research Assistant Grounding
  await test('POST /api/chat answers Ambedkar vs Gandhi with BAWS Vol. 9 citations', async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What were the main differences between Ambedkar and Gandhi on caste?' })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const text = json.response.text || json.response.answer || '';
    assert.ok(text.includes('BAWS Vol. 9') || text.includes('Annihilation of Caste'));
  });

  await test('POST /api/chat answers Muslim League and Pakistan question accurately', async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What did Ambedkar write in Pakistan or Partition of India?' })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const text = json.response.text || json.response.answer || '';
    assert.ok(text.includes('BAWS Vol. 8') || text.includes('Pakistan or the Partition of India'));
  });

  // 6. Frontend Pages Availability (24 pages total)
  const pages = [
    'index.html',
    'archive.html',
    'reader.html',
    'memorials.html',
    'debates.html',
    'kiosk.html',
    'exhibition.html',
    'admin.html',
    'timeline.html',
    'assistant.html',
    'ideas.html',
    'letters.html',
    'vows.html',
    'constitution.html',
    'media.html',
    'learning.html',
    'quotes.html',
    'dashboard.html',
    'ocr.html',
    'login.html',
    'register.html',
    'privacy.html',
    'terms.html',
    'slides.html'
  ];

  for (const page of pages) {
    await test(`Page /${page} loads with 200 OK`, async () => {
      const res = await fetch(`${BASE_URL}/${page}`);
      assert.strictEqual(res.status, 200, `/${page} must return 200`);
    });
  }

  console.log('\n------------------------------------------------------');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
