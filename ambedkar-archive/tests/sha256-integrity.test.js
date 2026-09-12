const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');

const PORT = 5000;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch (_) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

function computeSha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function runTests() {
  console.log('═════════════════════════════════════════════════════════════════════');
  console.log('  AUTOMATED SHA-256 INTEGRITY & BITSTREAM PRESERVATION SUITE');
  console.log('═════════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. Valid file integrity check
  await asyncTest('Valid file integrity: memorials.json live SHA-256 matches manifest', async () => {
    const memorialsPath = path.join(__dirname, '../backend/data/memorials.json');
    const computed = computeSha256(memorialsPath);

    const res = await request({
      hostname: 'localhost', port: PORT, path: '/api/preservation/verify', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { filename: 'memorials.json', expectedSha256: computed });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.verified, true);
    assert.strictEqual(res.body.status, 'VERIFIED');
    assert.strictEqual(res.body.sha256, computed);
  });

  // 2. Modified file detection (tampering)
  await asyncTest('Modified file detection: detects single byte modification', async () => {
    const tempDir = path.join(__dirname, '../backend/uploads/archive');
    fs.mkdirSync(tempDir, { recursive: true });
    const tempFile = path.join(tempDir, 'temp-integrity-test.txt');

    const originalText = 'Preservation Test Document 1956';
    fs.writeFileSync(tempFile, originalText, 'utf8');
    const originalHash = computeSha256(tempFile);

    // Tamper
    fs.writeFileSync(tempFile, originalText + ' [TAMPERED]', 'utf8');

    const res = await request({
      hostname: 'localhost', port: PORT, path: '/api/preservation/verify', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { filename: 'temp-integrity-test.txt', expectedSha256: originalHash });

    fs.unlinkSync(tempFile);

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.verified, false);
    assert.strictEqual(res.body.status, 'HASH_MISMATCH');
    assert.strictEqual(res.body.message, 'INTEGRITY CHECK FAILED / HASH MISMATCH');
    assert.strictEqual(res.body.tampered, true);
  });

  // 3. Hash mismatch detection (spoofed hash string)
  await asyncTest('Hash mismatch detection: rejects mismatched or spoofed hash', async () => {
    const res = await request({
      hostname: 'localhost', port: PORT, path: '/api/preservation/verify', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { filename: 'debates.json', expectedSha256: '0000000000000000000000000000000000000000000000000000000000000000' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.verified, false);
    assert.strictEqual(res.body.status, 'HASH_MISMATCH');
  });

  // 4. Missing file detection
  await asyncTest('Missing file detection: returns 404 for deleted or nonexistent file', async () => {
    const res = await request({
      hostname: 'localhost', port: PORT, path: '/api/preservation/verify', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { filename: 'deleted_historical_manuscript.pdf', expectedSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.verified, false);
    assert.strictEqual(res.body.status, 'MISSING_FILE');
  });

  // 5. Corrupted manifest handling: missing expected hash parameter
  await asyncTest('Corrupted manifest parameter handling: rejects request with missing hash', async () => {
    const res = await request({
      hostname: 'localhost', port: PORT, path: '/api/preservation/verify', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { filename: 'letters.json' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.verified, false);
    assert.strictEqual(res.body.status, 'MISSING_HASH');
  });

  // 6. Cryptographic standard assertion: SHA-256 is 64 hex characters
  test('Cryptographic standard: SHA-256 output is 64-char lowercase hexadecimal string', () => {
    const sample = crypto.createHash('sha256').update('Dr. B. R. Ambedkar').digest('hex');
    assert.strictEqual(sample.length, 64);
    assert.match(sample, /^[a-f0-9]{64}$/);
  });

  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log(`TOTAL SHA-256 INTEGRITY TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('═════════════════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
