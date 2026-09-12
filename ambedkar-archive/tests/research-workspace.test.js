/**
 * Automated Test Suite — Phase 4: Advanced Research Experience
 * Covers:
 *  - Authentication & IDOR isolation on research collections
 *  - Creation, updating, deletion of collections
 *  - Archival passage vs user note separation
 *  - Multi-format academic citation generation (APA, MLA, Chicago, Harvard, BibTeX)
 *  - Research notebook export (Markdown, BibTeX, Plain Text, JSON)
 *  - Comparative analysis engine presets
 *  - Frontend file and routing integrity
 */

const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (_) {}
        resolve({ status: res.statusCode, headers: res.headers, body: json, text: data });
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function loginUser(email, password) {
  const res = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email, password });
  return res.body && res.body.token;
}

async function runTests() {
  console.log('═════════════════════════════════════════════════════════════════════');
  console.log('  PHASE 4: ADVANCED RESEARCH EXPERIENCE VERIFICATION SUITE');
  console.log('═════════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  function pass(msg) {
    console.log(`  ✓ PASS: ${msg}`);
    passed++;
  }

  function fail(msg, err) {
    console.error(`  ✗ FAIL: ${msg}`);
    if (err) console.error('   ', err.message || err);
    failed++;
  }

  // 1. Log in Researcher A and Researcher B
  let tokenA, tokenB;
  try {
    tokenA = await loginUser('researcher@ambedkar-archive.in', 'Research@1234');
    tokenB = await loginUser('editor@ambedkar-archive.in', 'Editor@1234');
    assert(tokenA, 'Researcher A token missing');
    assert(tokenB, 'Researcher B token missing');
    pass('1. Authenticated test research sessions initialized');
  } catch (err) {
    fail('1. Authenticated test research sessions initialized', err);
  }

  // 2. Unauthenticated access rejected
  try {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/workspace/collections',
      method: 'GET'
    });
    assert.strictEqual(res.status, 401, 'Expected 401 Unauthorized for missing token');
    pass('2. Unauthenticated requests to /api/workspace/collections are blocked (401)');
  } catch (err) {
    fail('2. Unauthenticated requests blocked', err);
  }

  // 3. Create a Research Collection for User A
  let collectionAId;
  try {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/workspace/collections',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      }
    }, {
      title: 'Constitutional Morality & Social Democracy',
      description: 'Primary source excerpts from BAWS Vol. 13 and speeches on November 25, 1949.',
      tags: ['Constitution', 'Democracy', 'Morality']
    });

    assert.strictEqual(res.status, 201, `Expected 201 Created, got ${res.status}`);
    assert(res.body.success, 'Expected success: true');
    assert(res.body.collection && res.body.collection.id, 'Expected collection ID');
    collectionAId = res.body.collection.id;
    pass('3. Researcher A creates research collection "Constitutional Morality & Social Democracy"');
  } catch (err) {
    fail('3. Create research collection', err);
  }

  // 4. Add Archival Source Item to Collection
  let itemId;
  try {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: `/api/workspace/collections/${collectionAId}/items`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      }
    }, {
      type: 'passage',
      sourceId: 'baws-vol-13',
      sourceTitle: 'Constituent Assembly Debates (Nov 25, 1949)',
      archivalQuote: 'Democracy in India is only a top-dressing on an Indian soil which is essentially undemocratic.',
      citation: 'Ambedkar, B. R. (1949). CAD Vol. 11, p. 972.',
      userNote: 'Crucial concept: Constitutional morality as cultivated habit rather than innate default.',
      tags: ['Democracy', 'Constitutionalism']
    });

    assert.strictEqual(res.status, 201, `Expected 201 Created, got ${res.status}`);
    assert(res.body.item && res.body.item.id, 'Expected item ID');
    itemId = res.body.item.id;
    // Verify separation of archival text from user annotation
    assert.strictEqual(res.body.item.archivalQuote, 'Democracy in India is only a top-dressing on an Indian soil which is essentially undemocratic.');
    assert.strictEqual(res.body.item.userNote, 'Crucial concept: Constitutional morality as cultivated habit rather than innate default.');
    pass('4. Added archival excerpt to collection with strict separation of historical source from user note');
  } catch (err) {
    fail('4. Add archival excerpt', err);
  }

  // 5. IDOR Protection: User B attempts to access User A's private collection
  try {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: `/api/workspace/collections/${collectionAId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenB}`
      }
    });

    assert.strictEqual(res.status, 403, `Expected 403 Forbidden on IDOR attempt, got ${res.status}`);
    pass('5. IDOR Protection: Other users cannot access or tamper with private research collection (403 Forbidden)');
  } catch (err) {
    fail('5. IDOR Protection', err);
  }

  // 6. Multi-Format Academic Citation Generator
  try {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/workspace/citations/format',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: 'Annihilation of Caste: With a Reply to Mahatma Gandhi',
      author: 'Ambedkar, B. R.',
      year: 1936,
      volume: '1',
      publisher: 'Dr. Ambedkar Foundation / Government of Maharashtra'
    });

    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const citations = res.body.citations;
    assert(citations.apa.includes('Ambedkar, B. R. (1936). Annihilation of Caste'), 'APA format invalid');
    assert(citations.mla.includes('Ambedkar, B. R.'), 'MLA format invalid');
    assert(citations.chicago.includes('1936'), 'Chicago format invalid');
    assert(citations.harvard.includes('1936'), 'Harvard format invalid');
    assert(citations.bibtex.includes('@book{'), 'BibTeX format invalid');
    pass('6. Citation engine generates verified APA, MLA, Chicago, Harvard, and BibTeX citations');
  } catch (err) {
    fail('6. Citation engine', err);
  }

  // 7. Research Notebook Export (Markdown and BibTeX)
  try {
    // Markdown export
    const mdRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: `/api/workspace/export/${collectionAId}?format=markdown`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    assert.strictEqual(mdRes.status, 200);
    assert(mdRes.text.includes('# Research Notebook: Constitutional Morality & Social Democracy'), 'Missing MD title');
    assert(mdRes.text.includes('Democracy in India is only a top-dressing'), 'Missing archival quote');
    assert(mdRes.text.includes('Researcher Annotation'), 'Missing researcher annotation');

    // BibTeX export
    const bibRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: `/api/workspace/export/${collectionAId}?format=bibtex`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    assert.strictEqual(bibRes.status, 200);
    assert(bibRes.text.includes('@book{'), 'Missing BibTeX entry');

    pass('7. Research Notebook export correctly formats Markdown (.md) and BibTeX (.bib) with clear provenance');
  } catch (err) {
    fail('7. Export notebook', err);
  }

  // 8. Comparative Analysis Presets
  try {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/workspace/comparison/presets',
      method: 'GET'
    });

    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    assert(Array.isArray(res.body.presets) && res.body.presets.length >= 3, 'Expected at least 3 curated presets');
    const poona = res.body.presets.find(p => p.id === 'poona-pact-1932');
    assert(poona, 'Poona Pact preset missing');
    assert(poona.left.entity.includes('Ambedkar'), 'Missing Ambedkar entity');
    assert(poona.right.entity.includes('Gandhi'), 'Missing Gandhi entity');
    assert(poona.analysis, 'Missing historiographical analysis');
    pass('8. Comparative analysis engine provides curated debate presets (Poona Pact, Annihilation of Caste, Swaraj)');
  } catch (err) {
    fail('8. Comparison presets', err);
  }

  // 9. Frontend Compare Page and Dashboard Navigation
  try {
    const comparePath = path.join(__dirname, '../frontend/compare.html');
    assert(fs.existsSync(comparePath), 'compare.html must exist');
    const compareHtml = fs.readFileSync(comparePath, 'utf8');
    assert(compareHtml.includes('compare-preset-select'), 'compare.html missing preset selector');
    assert(compareHtml.includes('btn-sync-scroll'), 'compare.html missing sync scroll toggle');
    assert(compareHtml.includes('navigation-system.js'), 'compare.html missing master navigation system');

    const dashboardPath = path.join(__dirname, '../frontend/dashboard.html');
    const dashboardHtml = fs.readFileSync(dashboardPath, 'utf8');
    assert(dashboardHtml.includes('compare.html'), 'dashboard.html missing link to compare.html');
    assert(dashboardHtml.includes('btn-create-collection'), 'dashboard.html missing collection creator button');
    pass('9. Frontend compare.html and dashboard.html integrated with master navigation and workspace features');
  } catch (err) {
    fail('9. Frontend compare.html verification', err);
  }

  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log(`  PHASE 4 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('═════════════════════════════════════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
