/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MULTI-THEME FONT COLOR & CONTRAST VERIFICATION SUITE
 * Tests for theme-specific font colors on Knowledge Graph (ideas.html)
 * and Verified Historical Record Callout (debates.html).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

console.log('═════════════════════════════════════════════════════════════════════');
console.log('  TESTING MULTI-THEME FONT COLOR & CONTRAST ENHANCEMENTS');
console.log('═════════════════════════════════════════════════════════════════════\n');

let passCount = 0;
let failCount = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${testName}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${testName}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

const ideasHtml = fs.readFileSync(path.join(__dirname, '../frontend/ideas.html'), 'utf8');
const debatesHtml = fs.readFileSync(path.join(__dirname, '../frontend/debates.html'), 'utf8');
const appleCss = fs.readFileSync(path.join(__dirname, '../frontend/css/apple-design.css'), 'utf8');

// ── TEST 1: Knowledge Graph Canvas Multi-Theme Font Colors
runTest('TEST 1: ideas.html canvas tick() dynamically adapts label font colors per theme', () => {
  if (!ideasHtml.includes("currentTheme === 'paper'")) {
    throw new Error('ideas.html missing paper theme check in canvas simulation');
  }
  if (!ideasHtml.includes("currentTheme === 'sepia'")) {
    throw new Error('ideas.html missing sepia theme check in canvas simulation');
  }

  // Paper mode colors
  if (!ideasHtml.includes('#2b2620') || !ideasHtml.includes('#0f0d0b')) {
    throw new Error('ideas.html missing high-contrast dark charcoal ink for paper theme');
  }

  // Sepia mode colors
  if (!ideasHtml.includes('#3d2b1c') || !ideasHtml.includes('#1a0e06')) {
    throw new Error('ideas.html missing high-contrast rich sepia ink for sepia theme');
  }

  // Dark mode colors
  if (!ideasHtml.includes('#cbd5e1') || !ideasHtml.includes('#ffffff')) {
    throw new Error('ideas.html missing crisp slate white for dark theme');
  }
});

// ── TEST 2: Knowledge Graph Instructions Badge Theme Adaptability
runTest('TEST 2: ideas.html .graph-instructions has distinct styling for paper and sepia themes', () => {
  if (!ideasHtml.includes('[data-theme="paper"] .graph-instructions')) {
    throw new Error('ideas.html missing [data-theme="paper"] .graph-instructions styling');
  }
  if (!ideasHtml.includes('[data-theme="sepia"] .graph-instructions')) {
    throw new Error('ideas.html missing [data-theme="sepia"] .graph-instructions styling');
  }
});

// ── TEST 3: 3rd Round Table Conference Callout in debates.html
runTest('TEST 3: debates.html 3rd RTC box uses rtc-verified-callout class with theme colors', () => {
  if (!debatesHtml.includes('class="rtc-verified-callout"')) {
    throw new Error('debates.html missing class="rtc-verified-callout" on 3rd RTC record');
  }
  if (!debatesHtml.includes('class="rtc-verified-eyebrow"')) {
    throw new Error('debates.html missing class="rtc-verified-eyebrow"');
  }

  // Check that inline cyan color has been removed from the callout container
  const rtcNodeSnippet = debatesHtml.slice(debatesHtml.indexOf('Third Round Table Conference'), debatesHtml.indexOf('Third Round Table Conference') + 600);
  if (rtcNodeSnippet.includes('color:#bae6fd;')) {
    throw new Error('debates.html still has hardcoded inline color:#bae6fd on 3rd RTC container');
  }
});

// ── TEST 4: Multi-Theme Typography Rules in debates.html
runTest('TEST 4: debates.html defines high-contrast font colors for Paper (#0c4a6e) and Sepia (#451a03)', () => {
  // Paper Theme rules
  if (!debatesHtml.includes('[data-theme="paper"] .rtc-verified-callout')) {
    throw new Error('debates.html missing [data-theme="paper"] .rtc-verified-callout rule');
  }
  if (!debatesHtml.includes('#0c4a6e') || !debatesHtml.includes('#0369a1')) {
    throw new Error('debates.html missing paper theme deep navy font colors (#0c4a6e / #0369a1)');
  }

  // Sepia Theme rules
  if (!debatesHtml.includes('[data-theme="sepia"] .rtc-verified-callout')) {
    throw new Error('debates.html missing [data-theme="sepia"] .rtc-verified-callout rule');
  }
  if (!debatesHtml.includes('#451a03') || !debatesHtml.includes('#92400e')) {
    throw new Error('debates.html missing sepia theme deep espresso font colors (#451a03 / #92400e)');
  }
});

// ── TEST 5: Global Design System in apple-design.css
runTest('TEST 5: apple-design.css contains global multi-theme rtc-verified-callout rules', () => {
  if (!appleCss.includes('.rtc-verified-callout')) {
    throw new Error('apple-design.css missing .rtc-verified-callout');
  }
  if (!appleCss.includes('[data-theme="paper"] .rtc-verified-callout') || !appleCss.includes('[data-theme="sepia"] .rtc-verified-callout')) {
    throw new Error('apple-design.css missing data-theme selectors for rtc-verified-callout');
  }
});

// ── TEST 6: WCAG Contrast Verification
runTest('TEST 6: WCAG Contrast ratios exceed 7:1 (AAA) across all themes', () => {
  // Relative luminance calculation
  function getLuminance(hex) {
    const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255).map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }
  function getContrast(hex1, hex2) {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  // 1. Paper theme: ivory bg #f7f5ef vs paper text #2b2620
  const paperGraphContrast = getContrast('#f7f5ef', '#2b2620');
  if (paperGraphContrast < 7.0) {
    throw new Error(`Paper graph contrast too low: ${paperGraphContrast.toFixed(2)}`);
  }

  // 2. Paper theme: ivory bg #f7f5ef vs 3rd RTC callout text #0c4a6e
  const paperRtcContrast = getContrast('#f7f5ef', '#0c4a6e');
  if (paperRtcContrast < 7.0) {
    throw new Error(`Paper 3rd RTC contrast too low: ${paperRtcContrast.toFixed(2)}`);
  }

  // 3. Sepia theme: parchment bg #f2ebd9 vs sepia text #3d2b1c
  const sepiaGraphContrast = getContrast('#f2ebd9', '#3d2b1c');
  if (sepiaGraphContrast < 7.0) {
    throw new Error(`Sepia graph contrast too low: ${sepiaGraphContrast.toFixed(2)}`);
  }

  // 4. Sepia theme: parchment bg #f2ebd9 vs 3rd RTC callout text #451a03
  const sepiaRtcContrast = getContrast('#f2ebd9', '#451a03');
  if (sepiaRtcContrast < 7.0) {
    throw new Error(`Sepia 3rd RTC contrast too low: ${sepiaRtcContrast.toFixed(2)}`);
  }

  // 5. Dark theme: dark surface #141b2b vs text #cbd5e1
  const darkContrast = getContrast('#141b2b', '#cbd5e1');
  if (darkContrast < 7.0) {
    throw new Error(`Dark mode contrast too low: ${darkContrast.toFixed(2)}`);
  }
});

console.log('\n═════════════════════════════════════════════════════════════════════');
console.log(`  RESULT: ${passCount} PASSED, ${failCount} FAILED`);
console.log('═════════════════════════════════════════════════════════════════════\n');

if (failCount > 0) {
  process.exit(1);
}
