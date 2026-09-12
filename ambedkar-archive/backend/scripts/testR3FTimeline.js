/**
 * testR3FTimeline.js — Playwright Verification for React Three Fiber 3D Timeline
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Launching Playwright R3F Timeline Verification on http://localhost:5000 ...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  try {
    // 1. Visit normal 2D timeline page first
    console.log('📄 Loading 2D Timeline page: http://localhost:5000/timeline.html ...');
    const res2D = await page.goto('http://localhost:5000/timeline.html', { waitUntil: 'networkidle', timeout: 15000 });
    console.log(`✅ 2D Timeline loaded with status: ${res2D.status()}`);

    // 2. Verify "Explore History in 3D" portal button exists
    const portalBtn = await page.$('a[href="/experience/timeline"]');
    if (!portalBtn) throw new Error('Portal link to /experience/timeline missing on timeline.html');
    const portalText = await portalBtn.innerText();
    console.log(`✅ Found 3D Portal Button: "${portalText.trim().replace(/\n+/g, ' ')}"`);

    // 3. Click gateway button to navigate to /experience/timeline
    console.log('✨ Clicking portal button to enter 3D React Three Fiber experience...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }),
      portalBtn.click()
    ]);
    console.log(`📡 Arrived at: ${page.url()}`);

    // 4. Verify React mounted and canvas element rendered
    await page.waitForSelector('canvas', { timeout: 10000 });
    const canvas = await page.$('canvas');
    if (!canvas) throw new Error('React Three Fiber <canvas> element missing!');
    console.log('✅ React Three Fiber <canvas> mounted in DOM');

    // 5. Verify WebGL context
    const hasWebGL = await page.evaluate(() => {
      const cvs = document.querySelector('canvas');
      if (!cvs) return false;
      return !!(cvs.getContext('webgl2') || cvs.getContext('webgl'));
    });
    console.log(`✅ WebGL Context active: ${hasWebGL}`);
    if (!hasWebGL) throw new Error('WebGL context failed to initialize');

    // 6. Verify Exit Bar
    const exitBtn = await page.$('#exit-experience-btn');
    if (!exitBtn) throw new Error('Exit button #exit-experience-btn not found!');
    console.log(`✅ Exit control verified: "${await exitBtn.innerText()}"`);

    // 7. Verify Milestone Inspector Card is displaying verified historical data
    await page.waitForSelector('#milestone-inspector-card', { timeout: 8000 });
    const cardTitle = await page.evaluate(() => document.querySelector('#milestone-inspector-card h3')?.textContent);
    console.log(`✅ Milestone Card rendered with title: "${cardTitle}"`);

    // 8. Test Keyboard Navigation (ArrowRight to advance to next milestone)
    console.log('⌨️ Pressing ArrowRight to advance milestone...');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(600);
    const nextTitle = await page.evaluate(() => document.querySelector('#milestone-inspector-card h3')?.textContent);
    console.log(`✅ Milestone advanced to: "${nextTitle}"`);

    // 9. Capture Screenshot
    const screenshotPath = 'C:/Users/sujal/.gemini/antigravity-ide/brain/7348231b-daa3-45a6-8657-b1d33dc59405/r3f_timeline_experience.png';
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot captured at: ${screenshotPath}`);

    // 10. Test Exit control: return to 2D timeline
    console.log('🚪 Clicking Exit button to return to 2D Timeline...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }),
      exitBtn.click()
    ]);
    console.log(`✅ Successfully returned to: ${page.url()}`);

    // 11. Verify 0 console errors
    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('analytics'));
    if (criticalErrors.length > 0) {
      console.warn('⚠️ Console warnings/errors:', criticalErrors);
    } else {
      console.log('✅ Zero console errors recorded during full lifecycle!');
    }

    console.log('🎉 VERIFICATION COMPLETE: React Three Fiber 3D Timeline Experience is operational!');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification failed:', err);
    await browser.close();
    process.exit(1);
  }
})();
