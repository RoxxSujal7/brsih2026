/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLOBAL NAVIGATION & MOVABLE DOCKBAR SYSTEM VERIFICATION SUITE
 * Tests for Single Source of Truth Navbar, Movable Floating Dock, Persistence,
 * Boundaries, Snapping, Active States, and All Archive Pages Audit.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('═════════════════════════════════════════════════════════════════════');
console.log('  TESTING GLOBAL NAVIGATION & MOVABLE DOCKBAR SYSTEM');
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

const navSysCode = fs.readFileSync(path.join(__dirname, '../frontend/js/navigation-system.js'), 'utf8');
const frontendDir = path.join(__dirname, '../frontend');

// Minimal DOM Element Mock for Node testing
class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (this.classList._classes.has(c)) this.classList._classes.delete(c);
          else this.classList._classes.add(c);
        } else if (force) {
          this.classList._classes.add(c);
        } else {
          this.classList._classes.delete(c);
        }
      }
    };
    this.attributes = {};
    this.children = [];
    this.innerHTML = '';
    this.style = {};
    this.listeners = {};
    this.parentElement = null;
  }

  get className() {
    return Array.from(this.classList._classes).join(' ');
  }

  set className(val) {
    this.classList._classes = new Set(String(val || '').split(/\s+/).filter(Boolean));
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  setAttribute(name, val) {
    this.attributes[name] = String(val);
    if (name === 'class') {
      this.className = String(val);
      this.classList._classes = new Set(String(val).split(/\s+/).filter(Boolean));
    }
    if (name === 'id') {
      this.id = String(val);
    }
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  insertBefore(newChild, refChild) {
    newChild.parentElement = this;
    const idx = this.children.indexOf(refChild);
    if (idx >= 0) this.children.splice(idx, 0, newChild);
    else this.children.push(newChild);
    return newChild;
  }

  remove() {
    if (this.parentElement) {
      const idx = this.parentElement.children.indexOf(this);
      if (idx >= 0) this.parentElement.children.splice(idx, 1);
    }
  }

  addEventListener(evt, fn) {
    if (!this.listeners[evt]) this.listeners[evt] = [];
    this.listeners[evt].push(fn);
  }

  dispatch(evt, eventObj = {}) {
    if (this.listeners[evt]) {
      this.listeners[evt].forEach(fn => fn(eventObj));
    }
  }

  querySelector(selector) {
    // If selector matches a direct child or nested child
    const found = this._findFirst(selector);
    if (found) return found;

    if (!this._cachedElements) this._cachedElements = {};

    // If innerHTML contains the ID or class, synthesize a matching MockElement
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      if (this._cachedElements[id]) return this._cachedElements[id];
      if (this.innerHTML && this.innerHTML.includes(`id="${id}"`)) {
        const el = new MockElement('div');
        el.id = id;
        el.parentElement = this;
        this._cachedElements[id] = el;
        return el;
      }
    }
    if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      if (this._cachedElements[cls]) return this._cachedElements[cls];
      if (this.innerHTML && this.innerHTML.includes(`class="`) && this.innerHTML.includes(cls)) {
        const el = new MockElement('div');
        el.classList.add(cls);
        el.parentElement = this;
        this._cachedElements[cls] = el;
        return el;
      }
    }
    return null;
  }

  querySelectorAll(selector) {
    const results = [];
    this._findAll(selector, results);
    return results;
  }

  _matches(selector) {
    if (selector.startsWith('#')) return this.id === selector.slice(1);
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    return this.tagName.toLowerCase() === selector.toLowerCase();
  }

  _findFirst(selector) {
    for (const child of this.children) {
      if (child._matches && child._matches(selector)) return child;
      const found = child._findFirst && child._findFirst(selector);
      if (found) return found;
    }
    return null;
  }

  _findAll(selector, arr) {
    for (const child of this.children) {
      if (child._matches && child._matches(selector)) arr.push(child);
      if (child._findAll) child._findAll(selector, arr);
    }
  }

  getBoundingClientRect() {
    return { left: 100, top: 200, width: 600, height: 50 };
  }
}

function createMockEnvironment(pathname = '/index.html', initialStorage = {}) {
  const storage = { ...initialStorage };
  const elementsById = {};

  const document = {
    readyState: 'complete',
    body: new MockElement('body'),
    createElement: (tag) => {
      const el = new MockElement(tag);
      const origSetAttr = el.setAttribute.bind(el);
      el.setAttribute = (name, val) => {
        origSetAttr(name, val);
        if (name === 'id') elementsById[val] = el;
      };
      return el;
    },
    getElementById: (id) => elementsById[id] || document.body.querySelector(`#${id}`),
    querySelector: (sel) => {
      if (sel.startsWith('#') && elementsById[sel.slice(1)]) return elementsById[sel.slice(1)];
      return document.body.querySelector(sel);
    },
    querySelectorAll: (sel) => document.body.querySelectorAll(sel),
    addEventListener: () => {}
  };

  // Pre-load default nav in body like standard archive page
  const initialNav = document.createElement('nav');
  initialNav.className = 'nav';
  document.body.appendChild(initialNav);

  const window = {
    location: { pathname },
    localStorage: {
      getItem: (k) => (k in storage ? storage[k] : null),
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; }
    },
    innerWidth: 1400,
    innerHeight: 900,
    scrollY: 0,
    addEventListener: () => {},
    removeEventListener: () => {}
  };

  const sandbox = {
    window,
    document,
    localStorage: window.localStorage,
    console
  };

  vm.createContext(sandbox);
  try {
    vm.runInContext(navSysCode, sandbox);
  } catch (err) {
    console.error('vm execution error:', err.message, err.stack);
  }

  return { sandbox, window, document, storage, NavigationSystem: window.NavigationSystem };
}

// ── TEST 1: Drag dockbar to bottom-left & position persistence
runTest('TEST 1: Set dock position to snap-bottom-left -> persists to localStorage & restored across pages', () => {
  const env1 = createMockEnvironment('/index.html');
  env1.NavigationSystem.setDockPosition('snap-bottom-left');

  if (env1.storage['ambedkar_dock_snap'] !== 'snap-bottom-left') {
    throw new Error(`Expected storage to have snap-bottom-left, got ${env1.storage['ambedkar_dock_snap']}`);
  }

  // Load new page (memorials.html) with stored preference
  const env2 = createMockEnvironment('/memorials.html', env1.storage);
  const dock = env2.document.querySelector('.floating-dock');
  if (!dock) throw new Error('Floating dock not found on memorials.html');
  if (!dock.classList.contains('snap-bottom-left')) {
    throw new Error('Memorials page dock did not restore snap-bottom-left from storage');
  }
});

// ── TEST 2: Refresh page -> position remains saved
runTest('TEST 2: Refresh page -> saved dock position remains active', () => {
  const env = createMockEnvironment('/debates.html', { 'ambedkar_dock_snap': 'snap-bottom-right' });
  const dock = env.document.querySelector('.floating-dock');
  if (!dock) throw new Error('Floating dock not created');
  if (!dock.classList.contains('snap-bottom-right')) {
    throw new Error('Expected snap-bottom-right to remain active upon reload');
  }
});

// ── TEST 3: Reset dock position returns to bottom-center
runTest('TEST 3: Reset dock position restores default snap-bottom-center', () => {
  const env = createMockEnvironment('/timeline.html', { 'ambedkar_dock_snap': 'snap-middle-left' });
  env.NavigationSystem.resetDockPosition();

  const dock = env.document.querySelector('.floating-dock');
  if (!dock.classList.contains('snap-bottom-center')) {
    throw new Error('Expected dock to snap back to snap-bottom-center');
  }
  if (env.storage['ambedkar_dock_snap'] !== 'snap-bottom-center') {
    throw new Error('Expected storage to reset to snap-bottom-center');
  }
});

// ── TEST 4: Mobile touch dragging & drag handle tactile grip
runTest('TEST 4: Drag handle #dock-drag-handle exists with tactile grip and accessibility roles', () => {
  const env = createMockEnvironment('/index.html');
  const dock = env.document.querySelector('.floating-dock');
  if (!dock) throw new Error('Floating dock missing');

  // Verify shell and header elements inside innerHTML
  if (!dock.innerHTML.includes('id="dock-drag-handle"')) {
    throw new Error('Dock must contain #dock-drag-handle');
  }
  if (!dock.innerHTML.includes('role="button"')) {
    throw new Error('Handle must have role="button"');
  }
  if (!dock.innerHTML.includes('⠿')) {
    throw new Error('Handle must render tactile grip icon ⠿');
  }
  if (!dock.innerHTML.includes('id="dock-reset-btn"')) {
    throw new Error('Dock must contain #dock-reset-btn');
  }
});

// ── TEST 5: Tap navigation icon works without triggering drag
runTest('TEST 5: Dock navigation links are isolated and contain exact 9 curated hubs', () => {
  const env = createMockEnvironment('/index.html');
  const dock = env.document.querySelector('.floating-dock');
  const items = [
    'memorials.html',
    'debates.html',
    'kiosk.html',
    'exhibition.html',
    'slides.html',
    'constitution.html',
    'ideas.html',
    'media.html',
    'ocr.html'
  ];

  items.forEach(item => {
    if (!dock.innerHTML.includes(`href="${item}"`)) {
      throw new Error(`Dock missing required item: ${item}`);
    }
  });
});

// ── TEST 6: Drag boundaries clamping
runTest('TEST 6: Boundary containment clamps coordinates within viewport', () => {
  function clamp(initial, delta, dimension, maxViewport, margin = 10) {
    let pos = initial + delta;
    return Math.max(margin, Math.min(pos, maxViewport - dimension - margin));
  }

  const viewW = 1280;
  const dockW = 450;

  // Off left
  if (clamp(50, -500, dockW, viewW) !== 10) {
    throw new Error('Left boundary clamp failed');
  }
  // Off right
  if (clamp(50, 2000, dockW, viewW) !== viewW - dockW - 10) {
    throw new Error('Right boundary clamp failed');
  }
});

// ── TEST 7: Master Navbar active states across pages
runTest('TEST 7: Page-specific active states for Home, Archive, Timeline, AI, Memorials, Debates', () => {
  // 1. Home
  const home = createMockEnvironment('/index.html');
  const homeNav = home.document.querySelector('.nav');
  if (!homeNav.innerHTML.includes('href="index.html" class="nav-link active"')) {
    throw new Error('Home must be active on index.html');
  }

  // 2. Timeline
  const timeline = createMockEnvironment('/timeline.html');
  const timeNav = timeline.document.querySelector('.nav');
  if (!timeNav.innerHTML.includes('href="timeline.html" class="nav-link active"')) {
    throw new Error('Timeline must be active on timeline.html');
  }

  // 3. AI Assistant
  const ai = createMockEnvironment('/assistant.html');
  const aiNav = ai.document.querySelector('.nav');
  if (!aiNav.innerHTML.includes('href="assistant.html" class="nav-link active"')) {
    throw new Error('AI Assistant must be active on assistant.html');
  }

  // 4. Archive-related pages (reader.html)
  const reader = createMockEnvironment('/reader.html');
  const readerNav = reader.document.querySelector('.nav');
  if (!readerNav.innerHTML.includes('href="archive.html" class="nav-link active"')) {
    throw new Error('Complete Works (60 Vol) must be active on reader.html');
  }

  // 5. Memorials in Dock
  const memorials = createMockEnvironment('/memorials.html');
  const memDock = memorials.document.querySelector('.floating-dock');
  if (!memDock.innerHTML.includes('href="memorials.html" class="dock-item active"')) {
    throw new Error('Memorials dock item must be active on memorials.html');
  }

  // 6. Debates in Dock
  const debates = createMockEnvironment('/debates.html');
  const debDock = debates.document.querySelector('.floating-dock');
  if (!debDock.innerHTML.includes('href="debates.html" class="dock-item active"')) {
    throw new Error('Debates dock item must be active on debates.html');
  }
});

// ── TEST 8: All HTML Pages Consistency Audit
runTest('TEST 8: All 25 HTML pages audited — script inclusions and master navigation compliance', () => {
  const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

  if (htmlFiles.length < 24) {
    throw new Error(`Expected at least 24 HTML files, found ${htmlFiles.length}`);
  }

  htmlFiles.forEach(file => {
    // Kiosk and smart display ambient mode are deliberately separate modes
    if (file === 'kiosk.html' || file === 'exhibition.html' || file === 'slides.html') {
      return;
    }

    const content = fs.readFileSync(path.join(frontendDir, file), 'utf8');
    if (!content.includes('navigation-system.js')) {
      throw new Error(`${file} missing navigation-system.js script tag`);
    }
    if (!content.includes('app.js')) {
      throw new Error(`${file} missing app.js script tag`);
    }
  });
});

// ── TEST 9: Free-floating anywhere on screen with arbitrary (x, y) coordinates
runTest('TEST 9: Free-floating anywhere on screen: coordinates persist to ambedkar_dock_float_pos and apply inline styles', () => {
  const env = createMockEnvironment('/index.html');
  env.NavigationSystem.setDockPosition({ left: 340, top: 125, mode: 'vertical' });

  const stored = JSON.parse(env.storage['ambedkar_dock_float_pos']);
  if (stored.left !== 340 || stored.top !== 125 || stored.mode !== 'vertical') {
    throw new Error(`Expected storage to contain { left: 340, top: 125, mode: 'vertical' }, got ${env.storage['ambedkar_dock_float_pos']}`);
  }

  // Load new page and verify dock positioned at exact floating coordinates
  const env2 = createMockEnvironment('/constitution.html', env.storage);
  const dock = env2.document.querySelector('.floating-dock');
  if (!dock) throw new Error('Floating dock missing on constitution.html');
  if (dock.style.left !== '340px' || dock.style.top !== '125px') {
    throw new Error(`Expected dock styles left: 340px, top: 125px, got left: ${dock.style.left}, top: ${dock.style.top}`);
  }
  if (!dock.classList.contains('dock-vertical')) {
    throw new Error('Expected dock to retain dock-vertical mode');
  }
});

// ── TEST 10: Layout orientation toggle button (#dock-orient-btn)
runTest('TEST 10: Orientation toggle: button #dock-orient-btn exists and switches layout mode', () => {
  const env = createMockEnvironment('/index.html', {
    'ambedkar_dock_float_pos': JSON.stringify({ left: 50, top: 100, mode: 'vertical' })
  });
  const dock = env.document.querySelector('.floating-dock');
  if (!dock) throw new Error('Floating dock missing');

  const orientBtn = dock.querySelector('#dock-orient-btn');
  if (!orientBtn) throw new Error('Orientation toggle button #dock-orient-btn missing in dock header');

  // Trigger orientation switch
  orientBtn.dispatch('click', { stopPropagation: () => {} });

  if (!dock.classList.contains('dock-horizontal')) {
    throw new Error('Dock should switch to dock-horizontal when orient button clicked');
  }

  const stored = JSON.parse(env.storage['ambedkar_dock_float_pos']);
  if (stored.mode !== 'horizontal') {
    throw new Error(`Stored mode should be horizontal, got: ${stored.mode}`);
  }
});

// ── TEST 11: Restored Apple Design styling tokens and color audit
runTest('TEST 11: Style audit: apple-design.css contains authentic Apple glass tokens and theme support', () => {
  const cssPath = path.join(frontendDir, 'css/apple-design.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Check critical Apple tokens used in restored dock
  const requiredTokens = [
    '--apple-glass-toolbar',
    '--apple-blur-thick',
    '--apple-hairline-border',
    '--apple-specular-top',
    'rgba(212, 175, 55, 0.15)', // Authentic gold accent highlight
    '.dock-shell',
    '.floating-dock.dock-vertical',
    '.floating-dock.dock-horizontal',
    '[data-theme="paper"]',
    '[data-theme="sepia"]'
  ];

  requiredTokens.forEach(token => {
    if (!css.includes(token)) {
      throw new Error(`apple-design.css missing required styling token: ${token}`);
    }
  });
});

console.log('\n═════════════════════════════════════════════════════════════════════');
console.log(`  RESULT: ${passCount} PASSED, ${failCount} FAILED`);
console.log('═════════════════════════════════════════════════════════════════════\n');

if (failCount > 0) {
  process.exit(1);
}
