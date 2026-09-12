/**
 * rbac-authorization.test.js
 * Comprehensive Proof-Based Backend RBAC Authorization Test Suite
 * Tests 8 specific access control scenarios across all institutional roles.
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000';

async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok || !data.token) {
    throw new Error(`Login failed for ${email}: ${data.message || res.statusText}`);
  }
  return data.token;
}

async function runRbacTests() {
  console.log('\n======================================================');
  console.log('🛡️ INSTITUTIONAL RBAC AUTHORIZATION VERIFICATION SUITE');
  console.log(`Target: ${BASE_URL}`);
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Acquire tokens for distinct roles
    console.log('🔐 Authenticating test accounts for role matrix...');
    const visitorToken = await loginUser('visitor@ambedkar-archive.in', 'Visitor@1234');
    const researcherToken = await loginUser('researcher@ambedkar-archive.in', 'Research@1234');
    const editorToken = await loginUser('editor@ambedkar-archive.in', 'Editor@1234');
    const archivistToken = await loginUser('archivist@ambedkar-archive.in', 'Archivist@1234');
    const superAdminToken = await loginUser('superadmin@ambedkar-archive.in', 'SuperAdmin@1234');
    console.log('✅ All 5 test account tokens acquired.\n');

    // TEST 1: Unauthenticated visitor tries to access protected admin API -> 401 DENIED
    const res1 = await fetch(`${BASE_URL}/api/admin/dashboard`);
    assert(
      res1.status === 401,
      'TEST 1: Unauthenticated visitor to /api/admin/dashboard is strictly DENIED with 401 Unauthorized'
    );

    // TEST 2: Normal visitor tries to access protected admin functionality -> 403 DENIED
    const res2 = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${visitorToken}` }
    });
    assert(
      res2.status === 403,
      'TEST 2: Authenticated visitor accessing /api/admin/dashboard is strictly DENIED with 403 Forbidden'
    );

    // TEST 3: Researcher attempts administrative modification -> 403 DENIED
    const res3 = await fetch(`${BASE_URL}/api/admin/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${researcherToken}`
      },
      body: JSON.stringify({ title: 'Unauthorized Test Doc', category: 'speeches' })
    });
    assert(
      res3.status === 403,
      'TEST 3: Researcher attempting document ingestion on /api/admin/documents is strictly DENIED with 403 Forbidden'
    );

    // TEST 4: Content Editor attempts user management -> 403 DENIED
    const res4 = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${editorToken}` }
    });
    assert(
      res4.status === 403,
      'TEST 4: Content Editor attempting user directory access on /api/admin/users is strictly DENIED with 403 Forbidden'
    );

    // TEST 5: Archivist performs allowed archive operations -> 200/201 ALLOWED
    const res5a = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${archivistToken}` }
    });
    const res5b = await fetch(`${BASE_URL}/api/admin/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${archivistToken}`
      },
      body: JSON.stringify({
        title: 'Draft Resolution on Social Rights (1928)',
        category: 'historical-documents',
        volumeNo: 2,
        summary: 'Archivist ingestion test record.'
      })
    });
    const res5c = await fetch(`${BASE_URL}/api/admin/ocr/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${archivistToken}`
      },
      body: JSON.stringify({
        manuscriptId: 'AIC-TEST-001',
        correctedText: 'Verified text transcription by authorized archivist.'
      })
    });
    assert(
      res5a.status === 200 && res5b.status === 201 && res5c.status === 200,
      'TEST 5: Archivist performing allowed archive operations (dashboard, ingest, verify OCR) is ALLOWED with 200/201'
    );

    // TEST 6: Super Admin performs full administrative operations -> 200 ALLOWED
    const res6a = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${superAdminToken}` }
    });
    const res6b = await fetch(`${BASE_URL}/api/admin/documents/ARCH-DOC-TEST-DEL`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${superAdminToken}` }
    });
    const res6c = await fetch(`${BASE_URL}/api/admin/system/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${superAdminToken}`
      },
      body: JSON.stringify({ institutionalName: 'Dr. Ambedkar International Centre', preservationPolicyLevel: 3 })
    });
    assert(
      res6a.status === 200 && res6b.status === 200 && res6c.status === 200,
      'TEST 6: Super Admin performing full operations (user management, record expunge, system settings) is ALLOWED with 200'
    );

    // TEST 7: User manually modifies frontend role information / forged role header -> Backend still DENIES
    // Even if client passes a forged role header or body, backend verifies ONLY cryptographically signed token claims
    const res7 = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${visitorToken}`,
        'X-User-Role': 'super_admin',
        'Role': 'admin'
      }
    });
    assert(
      res7.status === 403,
      'TEST 7: User forging frontend role headers or localStorage claims is strictly DENIED by backend token validation'
    );

    // TEST 8: Direct API requests bypass frontend entirely -> Backend authorization STILL APPLIES
    const directRes = await fetch(`${BASE_URL}/api/admin/documents/ARCH-DOC-001`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${archivistToken}` // Archivist has no delete_records permission
      }
    });
    assert(
      directRes.status === 403,
      'TEST 8: Direct curl/fetch API request bypassing frontend UI is strictly DENIED (Archivist cannot delete records)'
    );

    // Public Transparency verification: GET /api/preservation/manifest remains publicly accessible
    const publicRes = await fetch(`${BASE_URL}/api/preservation/manifest`);
    assert(
      publicRes.status === 200,
      'PUBLIC ACCESS: /api/preservation/manifest remains completely open and public without requiring credentials'
    );

  } catch (err) {
    console.error('Fatal test runner error:', err);
    failed++;
  }

  console.log('\n------------------------------------------------------');
  console.log(`TOTAL RBAC TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) process.exit(1);
}

runRbacTests();
