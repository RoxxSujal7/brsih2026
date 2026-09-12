const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('═════════════════════════════════════════════════════════════════════');
console.log('  TESTING ABOUT THE CREATOR & PROJECT VISION PAGE');
console.log('═════════════════════════════════════════════════════════════════════\n');

const aboutPath = path.join(__dirname, '../frontend/about.html');
const aboutHtml = fs.readFileSync(aboutPath, 'utf8');

let pass = 0;
function test(desc, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${desc}`);
    pass++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    ${err.message}`);
    process.exit(1);
  }
}

// 1. Hero Presentation
test('Hero contains "CREATED BY SUJAL" and authentic subtitle', () => {
  assert.ok(aboutHtml.includes('CREATED BY <span class="creator-title-highlight">SUJAL</span>'));
  assert.ok(aboutHtml.includes('BTech Student') && aboutHtml.includes('Developer') && aboutHtml.includes('Technology Enthusiast'));
});

// 2. Strict Authenticity Rule
test('No exaggerated, fabricated credentials, titles, or fake awards', () => {
  const forbidden = [
    'Industry Professional',
    'Senior Engineer',
    'Chief Architect',
    'Director at',
    'Award-Winning Expert',
    'Institutional Employee',
    'Professional Engineer'
  ];
  forbidden.forEach(term => {
    assert.strictEqual(aboutHtml.includes(term), false, `Page must not claim: ${term}`);
  });
  // Verify authentic exploration language
  const authenticKeywords = ['Exploring', 'Building', 'Learning', 'Continuous Learning'];
  authenticKeywords.forEach(kw => {
    assert.ok(aboutHtml.includes(kw), `Page must feature authentic phrasing: ${kw}`);
  });
});

// 3. Required Sections
test('All required sections exist with proper semantic landmarks and IDs', () => {
  const required = [
    'id="about-creator"',
    'id="why-built"',
    'id="explore"',
    'id="journey"',
    'id="connect"',
    'BUILDING, LEARNING &amp; EXPLORING'
  ];
  required.forEach(sec => {
    assert.ok(aboutHtml.includes(sec), `Missing section: ${sec}`);
  });
});

// 4. What I Build & Explore — 6 Cards
test('What I Build & Explore features all 6 required interactive domains', () => {
  const categories = [
    'Web Development',
    'Artificial Intelligence',
    'Digital Heritage',
    'UI/UX &amp; Interactive Design',
    'Security &amp; Privacy',
    'Continuous Learning'
  ];
  categories.forEach(cat => {
    assert.ok(aboutHtml.includes(cat), `Missing domain card: ${cat}`);
  });
});

// 5. Connect With Me — Verified URLs & Handles
test('Social links contain exact required handles and verified URLs', () => {
  // GitHub
  assert.ok(aboutHtml.includes('href="https://github.com/RoxxSujal7"'));
  assert.ok(aboutHtml.includes('@RoxxSujal7'));

  // Instagram
  assert.ok(aboutHtml.includes('href="https://www.instagram.com/roxxsujal7/"'));
  assert.ok(aboutHtml.includes('@roxxsujal7'));

  // LinkedIn
  assert.ok(aboutHtml.includes('href="https://www.linkedin.com/in/sujalroxx7/"'));
  assert.ok(aboutHtml.includes('Connect Professionally'));
});

// 6. Security & Accessibility of External Links
test('All external social links enforce target="_blank", rel="noopener noreferrer", and aria-labels', () => {
  const linkRegex = /<a[^>]+href="(https:\/\/[^"]+)"[^>]*>/g;
  let match;
  let count = 0;
  while ((match = linkRegex.exec(aboutHtml)) !== null) {
    const fullTag = match[0];
    assert.ok(fullTag.includes('target="_blank"'), `Link missing target="_blank": ${fullTag}`);
    assert.ok(fullTag.includes('rel="noopener noreferrer"'), `Link missing rel="noopener noreferrer": ${fullTag}`);
    assert.ok(fullTag.includes('aria-label='), `Link missing aria-label: ${fullTag}`);
    count++;
  }
  assert.ok(count >= 3, `Expected at least 3 secured external links, found ${count}`);
});

// 7. Academic Non-Affiliation Disclaimer
test('Institutional disclaimer explicitly states independent educational initiative', () => {
  assert.ok(aboutHtml.includes('Academic &amp; Student Initiative Note'));
  assert.ok(aboutHtml.includes('independent, non-commercial educational project'));
  assert.ok(aboutHtml.includes('not officially affiliated with or endorsed by any governmental institution'));
});

// 8. Design System & Script Inclusions
test('Integrates design system, responsive viewport, theme bootstrap, and core scripts', () => {
  assert.ok(aboutHtml.includes('meta name="viewport"'));
  assert.ok(aboutHtml.includes('css/style.css'));
  assert.ok(aboutHtml.includes('js/navigation-system.js'));
  assert.ok(aboutHtml.includes('js/app.js'));
  assert.ok(aboutHtml.includes('localStorage.getItem(\'site_theme\')'));
});

console.log(`\n═════════════════════════════════════════════════════════════════════`);
console.log(`  RESULT: ${pass} PASSED, 0 FAILED`);
console.log(`═════════════════════════════════════════════════════════════════════\n`);
