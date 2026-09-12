/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLOBAL NAVIGATION & MOVABLE DOCKBAR SYSTEM (MASTER COMPONENT)
 * Dr. B. R. Ambedkar Digital Heritage Archive
 * Single Source of Truth for Navbar, Movable Floating Dock, and Drawer
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function(window, document) {
  'use strict';

  const STORAGE_KEY = 'ambedkar_dock_snap';
  const DEFAULT_SNAP = 'snap-bottom-center';

  // 1. Master Configuration
  const NAV_CONFIG = {
    brand: {
      title: 'AMBEDKAR ARCHIVE',
      sub: 'Digital Heritage Platform',
      icon: '⚜️',
      href: 'index.html'
    },
    topLinks: [
      { href: 'index.html', label: 'Home', id: 'home' },
      { href: 'archive.html', label: 'Complete Works (60 Vol)', id: 'archive' },
      { href: 'letters.html', label: 'Letters (361)', id: 'letters' },
      { href: 'vows.html', label: '22 Vows', id: 'vows' },
      { href: 'timeline.html', label: 'Timeline', id: 'timeline' },
      { href: 'assistant.html', label: 'AI Assistant', id: 'assistant' }
    ],
    dockItems: [
      { href: 'memorials.html', label: 'Memorials', icon: '🏛️', page: 'memorials', title: 'National Memorials & Heritage' },
      { href: 'debates.html', label: 'Debates', icon: '⚖️', page: 'debates', title: 'Political Thought & Historical Debates' },
      { href: 'kiosk.html', label: 'Kiosk', icon: '🖥️', page: 'kiosk', title: 'Institutional Kiosk Mode' },
      { href: 'exhibition.html', label: 'Display', icon: '📺', page: 'exhibition', title: 'Smart Display Ambient Mode' },
      { href: 'slides.html', label: 'Deck 16:9', icon: '📽️', page: 'slides', title: 'Visual Exhibition Deck (16:9)', badge: '16:9' },
      { href: 'constitution.html', label: 'Constitution', icon: '📜', page: 'constitution', title: 'Constitution of India' },
      { href: 'ideas.html', label: 'Ideas', icon: '💡', page: 'ideas', title: 'Thematic Ideas & Philosophy' },
      { href: 'media.html', label: 'Speeches', icon: '🎬', page: 'media', title: 'Speeches & Audio-Visual Archive' },
      { href: 'ocr.html', label: 'OCR', icon: '📜', page: 'ocr', title: 'Manuscript OCR Visualizer' }
    ],
    bottomTabs: [
      { href: 'index.html', label: 'Home', icon: '🏠', id: 'home' },
      { href: 'archive.html', label: 'Volumes', icon: '📚', id: 'archive' },
      { href: 'media.html', label: 'Speeches', icon: '🎬', id: 'media' },
      { href: 'timeline.html', label: 'Timeline', icon: '📅', id: 'timeline' },
      { href: 'assistant.html', label: 'AI', icon: '🤖', id: 'assistant' }
    ],
    drawerLinks: [
      { href: 'index.html', label: 'Home', icon: '🏠', id: 'home' },
      { href: 'archive.html', label: 'Complete Works (60 Volumes)', icon: '📚', id: 'archive' },
      { href: 'memorials.html', label: 'Memorials & Heritage', icon: '🏛️', id: 'memorials' },
      { href: 'debates.html', label: 'Historical Debates', icon: '⚖️', id: 'debates' },
      { href: 'letters.html', label: 'Letters & Correspondence (361)', icon: '📜', id: 'letters' },
      { href: 'vows.html', label: 'The 22 Vows (२२ प्रतिज्ञा)', icon: '☸️', id: 'vows' },
      { href: 'constitution.html', label: 'Constitution', icon: '📜', id: 'constitution' },
      { href: 'ideas.html', label: 'Thematic Ideas', icon: '💡', id: 'ideas' },
      { href: 'learning.html', label: 'Learning Center', icon: '🎓', id: 'learning' },
      { href: 'quotes.html', label: 'Verified Quotes', icon: '💬', id: 'quotes' },
      { href: 'media.html', label: 'Speeches & Audio-Visual', icon: '🎬', id: 'media' },
      { href: 'timeline.html', label: 'Chronological Timeline', icon: '📅', id: 'timeline' },
      { href: 'kiosk.html', label: 'Kiosk Mode', icon: '🖥️', id: 'kiosk' },
      { href: 'exhibition.html', label: 'Smart Display', icon: '📺', id: 'exhibition' },
      { href: 'slides.html', label: 'Visual Exhibition Deck', icon: '📽️', id: 'slides', badge: '16:9' },
      { href: 'assistant.html', label: 'AI Research Assistant', icon: '🤖', id: 'assistant' },
      { href: 'ocr.html', label: 'Manuscript OCR', icon: '📜', id: 'ocr' },
      { href: 'dashboard.html', label: 'My Research Dashboard', icon: '👤', id: 'dashboard' },
      { href: 'transparency.html', label: 'Archive Transparency', icon: '🛡️', id: 'transparency' }
    ]
  };

  const SNAP_CLASSES = [
    'snap-bottom-center',
    'snap-bottom-left',
    'snap-bottom-right',
    'snap-middle-left',
    'snap-middle-right'
  ];

  function getCurrentPath() {
    let p = window.location.pathname.toLowerCase().split('/').pop() || 'index.html';
    if (!p || p === '') p = 'index.html';
    return p;
  }

  // ── 2. Master Navbar Component ──────────────────────────
  function renderOrSyncNavbar() {
    const currentPath = getCurrentPath();
    let nav = document.querySelector('.nav');

    const navHtml = `
      <div class="nav-inner">
        <a href="${NAV_CONFIG.brand.href}" class="nav-logo" aria-label="Ambedkar Archive Home">
          <div class="nav-logo-icon" aria-hidden="true">${NAV_CONFIG.brand.icon}</div>
          <div class="nav-logo-text">
            <span>${NAV_CONFIG.brand.title}</span>
            <span class="nav-logo-sub">${NAV_CONFIG.brand.sub}</span>
          </div>
        </a>

        <div class="nav-links" role="list">
          ${NAV_CONFIG.topLinks.map(link => {
            const isAct = currentPath === link.href || 
              (link.id === 'archive' && ['archive.html', 'reader.html', 'learning.html', 'quotes.html'].includes(currentPath)) ||
              (link.id === 'assistant' && currentPath === 'assistant.html');
            return `<a href="${link.href}" class="nav-link ${isAct ? 'active' : ''}" role="listitem">${link.label}</a>`;
          }).join('')}
        </div>

        <div class="nav-actions">
          <!-- Reading Atmosphere Switcher -->
          <div class="nav-theme" role="group" aria-label="Atmosphere selection">
            <button class="theme-toggle-btn active" data-theme="dark" title="Dark Slate Atmosphere" aria-label="Dark Slate Atmosphere">🌙</button>
            <button class="theme-toggle-btn" data-theme="paper" title="Ivory Paper Sanctuary" aria-label="Ivory Paper Sanctuary">📜</button>
            <button class="theme-toggle-btn" data-theme="sepia" title="Historical Sepia Sanctuary" aria-label="Historical Sepia Sanctuary">🏺</button>
          </div>

          <!-- Language Selection -->
          <div class="nav-lang" role="group" aria-label="Language selection">
            <button class="lang-btn active" data-lang="en" aria-pressed="true">EN</button>
            <button class="lang-btn" data-lang="hi" aria-pressed="false">हिन्दी</button>
            <button class="lang-btn" data-lang="mr" aria-pressed="false">मराठी</button>
          </div>

          <!-- Quick Search Trigger -->
          <a href="archive.html#search" class="btn btn-outline btn-sm" title="Search Library (Press /)">
            <span>🔍 Search</span>
            <span class="btn-icon-bubble">/</span>
          </a>

          <!-- Auth State Actions -->
          <a id="nav-login-btn" href="login.html" class="btn btn-primary btn-sm">Sign In</a>

          <div id="nav-user-menu" style="display:none;" class="flex gap-2 items-center">
            <a href="dashboard.html" class="btn btn-secondary btn-sm">
              <span>👤</span> <span id="nav-user-name">User</span>
            </a>
            <button data-action="logout" class="btn btn-ghost btn-sm">Logout</button>
          </div>

          <!-- Mobile Hamburger Toggle -->
          <button id="hamburger" class="hamburger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    `;

    // Remove obsolete custom site-header if present
    const legacyHeader = document.querySelector('header.site-header');
    if (legacyHeader) legacyHeader.remove();

    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'nav';
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
      nav.innerHTML = navHtml;
      document.body.insertBefore(nav, document.body.firstChild);
    } else {
      nav.innerHTML = navHtml;
    }
  }

  // ── 3. Master Mobile Menu Component ─────────────────────
  function renderOrSyncMobileMenu() {
    const currentPath = getCurrentPath();
    let menu = document.getElementById('mobile-menu');

    const menuHtml = `
      <div class="mobile-theme-row flex-between items-center" style="padding:var(--space-2) var(--space-3);margin-bottom:var(--space-2);border-bottom:1px solid var(--border);">
        <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Atmosphere</span>
        <div class="nav-theme" role="group" aria-label="Atmosphere selection">
          <button class="theme-toggle-btn active" data-theme="dark" title="Dark Slate">🌙</button>
          <button class="theme-toggle-btn" data-theme="paper" title="Ivory Paper">📜</button>
          <button class="theme-toggle-btn" data-theme="sepia" title="Historical Sepia">🏺</button>
        </div>
      </div>

      <div class="mobile-theme-row flex-between items-center" style="padding:var(--space-2) var(--space-3);margin-bottom:var(--space-2);border-bottom:1px solid var(--border);">
        <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Language</span>
        <div class="nav-lang" role="group" aria-label="Language selection">
          <button class="lang-btn active" data-lang="en">EN</button>
          <button class="lang-btn" data-lang="hi">हिन्दी</button>
          <button class="lang-btn" data-lang="mr">मराठी</button>
        </div>
      </div>

      ${NAV_CONFIG.drawerLinks.map(link => {
        const isAct = currentPath === link.href || 
          (link.id === 'archive' && ['archive.html', 'reader.html', 'learning.html', 'quotes.html'].includes(currentPath)) ||
          (link.id === 'assistant' && currentPath === 'assistant.html');
        return `<a href="${link.href}" class="nav-link ${isAct ? 'active' : ''}">
          <span style="margin-right:6px;">${link.icon}</span> ${link.label}
          ${link.badge ? `<span class="badge-16-9" style="margin-left:6px;">${link.badge}</span>` : ''}
        </a>`;
      }).join('')}

      <div style="height:1px;background:rgba(255,255,255,0.08);margin:var(--space-4) 0;"></div>
      <button id="drawer-reset-dock-btn" class="btn btn-secondary btn-full btn-sm" style="margin-bottom:var(--space-3);display:flex;align-items:center;justify-content:center;gap:6px;">
        <span>↺</span> <span>Reset Dock Position</span>
      </button>
      <a href="login.html" class="btn btn-primary btn-full">Sign In</a>
    `;

    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'mobile-menu';
      menu.className = 'mobile-menu';
      menu.setAttribute('role', 'dialog');
      menu.setAttribute('aria-label', 'Mobile navigation');
      menu.innerHTML = menuHtml;
      document.body.appendChild(menu);
    } else {
      menu.innerHTML = menuHtml;
    }

    const drawerResetBtn = menu.querySelector('#drawer-reset-dock-btn');
    if (drawerResetBtn) {
      drawerResetBtn.addEventListener('click', () => {
        NavigationSystem.resetDockPosition();
        if (window.showToast) window.showToast('Dockbar repositioned to default Bottom-Center');
      });
    }
  }

  // ── 4. Master Mobile Bottom Bar Component ────────────────
  function renderOrSyncBottomBar() {
    const currentPath = getCurrentPath();
    let bar = document.querySelector('.bottom-bar');

    const barHtml = NAV_CONFIG.bottomTabs.map(tab => {
      const isAct = currentPath === tab.href || 
        (tab.id === 'archive' && ['archive.html', 'reader.html', 'learning.html', 'quotes.html'].includes(currentPath)) ||
        (tab.id === 'assistant' && currentPath === 'assistant.html');
      return `
        <a href="${tab.href}" class="tab-item ${isAct ? 'active' : ''}" aria-label="${tab.label}">
          <span class="tab-icon" aria-hidden="true">${tab.icon}</span>
          <span>${tab.label}</span>
        </a>
      `;
    }).join('');

    if (!bar) {
      bar = document.createElement('nav');
      bar.className = 'bottom-bar';
      bar.setAttribute('role', 'navigation');
      bar.setAttribute('aria-label', 'Mobile navigation');
      bar.innerHTML = barHtml;
      document.body.appendChild(bar);
    } else {
      bar.innerHTML = barHtml;
    }
  }

  // ── 5. Master Movable / Floating Dockbar System ──────────
  function renderOrSyncFloatingDock() {
    const currentPath = getCurrentPath();
    let dock = document.getElementById('global-floating-dock');

    // Remove obsolete legacy static side-docks if present
    document.querySelectorAll('.side-dock, #side-dock, #deckSideDock').forEach(el => el.remove());

    const savedSnap = localStorage.getItem(STORAGE_KEY) || DEFAULT_SNAP;
    const initialClass = SNAP_CLASSES.includes(savedSnap) ? savedSnap : DEFAULT_SNAP;

    const dockHtml = `
      <div class="dock-shell" id="dock-shell">
        <div class="dock-header" id="dock-header">
          <div class="dock-handle-bar" id="dock-drag-handle" role="button" aria-grabbed="false" tabindex="0" title="Drag to reposition dock (Snaps to Bottom-Center, Bottom-Left, Bottom-Right, Left, Right). Press Arrow keys or 'R' to cycle/reset.">
            <span class="dock-handle-grip" aria-hidden="true">⠿</span>
            <span class="dock-handle-title">Curated Hubs</span>
          </div>
          <button class="dock-reset-btn" id="dock-reset-btn" title="Reset dock to default bottom-center position" aria-label="Reset dock position">↺</button>
        </div>

        <div class="dock-items" role="list">
          ${NAV_CONFIG.dockItems.map(item => {
            const isAct = currentPath === item.href;
            return `
              <a href="${item.href}" class="dock-item ${isAct ? 'active' : ''}" data-page="${item.page}" title="${item.title}" role="listitem">
                <span class="dock-icon">${item.icon}</span>
                <span class="dock-label">
                  ${item.label}
                  ${item.badge ? `<span class="badge-16-9">${item.badge}</span>` : ''}
                </span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (!dock) {
      dock = document.createElement('aside');
      dock.id = 'global-floating-dock';
      dock.className = `floating-dock ${initialClass}`;
      dock.setAttribute('role', 'navigation');
      dock.setAttribute('aria-label', 'Curated exploration hubs');
      dock.innerHTML = dockHtml;
      document.body.appendChild(dock);
    } else {
      dock.className = `floating-dock ${initialClass}`;
      dock.innerHTML = dockHtml;
    }

    initDockDragAndSnap(dock);
  }

  // ── 6. Intelligent Drag & Snap Engine ────────────────────
  function initDockDragAndSnap(dock) {
    const handle = dock.querySelector('#dock-drag-handle');
    const resetBtn = dock.querySelector('#dock-reset-btn');
    if (!handle) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let dragThresholdPassed = false;

    // Reset button logic
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        snapDockTo('snap-bottom-center');
      });
    }

    // Keyboard cycle/reset support on handle
    handle.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        snapDockTo('snap-bottom-center');
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        cycleNextSnap();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        cyclePrevSnap();
      }
    });

    function cycleNextSnap() {
      const current = getActiveSnapClass();
      const idx = SNAP_CLASSES.indexOf(current);
      const next = SNAP_CLASSES[(idx + 1) % SNAP_CLASSES.length];
      snapDockTo(next);
    }

    function cyclePrevSnap() {
      const current = getActiveSnapClass();
      const idx = SNAP_CLASSES.indexOf(current);
      const prev = SNAP_CLASSES[(idx - 1 + SNAP_CLASSES.length) % SNAP_CLASSES.length];
      snapDockTo(prev);
    }

    function getActiveSnapClass() {
      for (const cls of SNAP_CLASSES) {
        if (dock.classList.contains(cls)) return cls;
      }
      return DEFAULT_SNAP;
    }

    // Pointer events (Desktop mouse & Touch screens)
    function onPointerDown(e) {
      // Don't drag if clicking buttons inside header
      if (e.target.closest('#dock-reset-btn')) return;

      isDragging = true;
      dragThresholdPassed = false;
      startX = e.clientX;
      startY = e.clientY;

      const rect = dock.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      handle.setAttribute('aria-grabbed', 'true');

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (!dragThresholdPassed && Math.hypot(deltaX, deltaY) > 5) {
        dragThresholdPassed = true;
        dock.classList.add('is-dragging');
        // Clear all snap classes and CSS transforms so free coordinates take over
        SNAP_CLASSES.forEach(cls => dock.classList.remove(cls));
        dock.style.transform = 'none';
        dock.style.transition = 'none';
      }

      if (dragThresholdPassed) {
        e.preventDefault();

        const dockWidth = dock.offsetWidth;
        const dockHeight = dock.offsetHeight;
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        // Viewport boundaries containment (keep safely on screen)
        const margin = 10;
        newLeft = Math.max(margin, Math.min(newLeft, viewW - dockWidth - margin));
        newTop = Math.max(margin, Math.min(newTop, viewH - dockHeight - margin));

        dock.style.left = `${newLeft}px`;
        dock.style.top = `${newTop}px`;
        dock.style.right = 'auto';
        dock.style.bottom = 'auto';
      }
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      handle.setAttribute('aria-grabbed', 'false');
      dock.classList.remove('is-dragging');

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (!dragThresholdPassed) {
        return;
      }

      // Calculate nearest smart snap position
      const rect = dock.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const viewW = window.innerWidth;
      const viewH = window.innerHeight;

      let targetSnap = 'snap-bottom-center';

      if (centerY > viewH * 0.65) {
        // Bottom territory
        if (centerX < viewW * 0.33) {
          targetSnap = 'snap-bottom-left';
        } else if (centerX > viewW * 0.67) {
          targetSnap = 'snap-bottom-right';
        } else {
          targetSnap = 'snap-bottom-center';
        }
      } else {
        // Upper or middle territory -> snap to side rail
        if (centerX < viewW * 0.5) {
          targetSnap = 'snap-middle-left';
        } else {
          targetSnap = 'snap-middle-right';
        }
      }

      snapDockTo(targetSnap);
    }

    function snapDockTo(snapClass) {
      // Clear inline coordinate styles
      dock.style.left = '';
      dock.style.top = '';
      dock.style.right = '';
      dock.style.bottom = '';
      dock.style.transform = '';
      dock.style.transition = '';

      SNAP_CLASSES.forEach(cls => dock.classList.remove(cls));
      dock.classList.add(snapClass);

      // Save preference in localStorage
      localStorage.setItem(STORAGE_KEY, snapClass);

      // Subtle pulse feedback
      dock.classList.add('dock-snap-pulse');
      setTimeout(() => dock.classList.remove('dock-snap-pulse'), 400);
    }

    handle.addEventListener('pointerdown', onPointerDown);

    // Reading Mode Priority: Subtle compacting during rapid downward scroll
    let lastScrollY = window.scrollY;
    let scrollTimeout = null;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 150 && currentScrollY > lastScrollY) {
        dock.classList.add('dock-compact');
      } else {
        dock.classList.remove('dock-compact');
      }
      lastScrollY = currentScrollY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        dock.classList.remove('dock-compact');
      }, 900);
    }, { passive: true });
  }

  // ── 7. Core Interactivity Wiring (Self-contained) ────────
  function wireCoreNavActions() {
    // 1. Mobile Hamburger Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu && !hamburger.__navWired) {
      hamburger.__navWired = true;
      hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;
        hamburger.setAttribute('aria-expanded', String(nextState));
        mobileMenu.classList.toggle('open', nextState);
        document.body.style.overflow = nextState ? 'hidden' : '';
      });

      // Close on navigation link click
      mobileMenu.querySelectorAll('a').forEach((el) => {
        el.addEventListener('click', () => {
          hamburger.setAttribute('aria-expanded', 'false');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
          hamburger.setAttribute('aria-expanded', 'false');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }

    // 2. Reading Atmosphere Buttons
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      if (!btn.__navWired) {
        btn.__navWired = true;
        btn.addEventListener('click', () => {
          const theme = btn.dataset.theme;
          if (window.AppState && typeof window.AppState.setSiteTheme === 'function') {
            window.AppState.setSiteTheme(theme, true);
          } else {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('site_theme', theme);
            document.querySelectorAll('.theme-toggle-btn').forEach(b => {
              b.classList.toggle('active', b.dataset.theme === theme);
            });
          }
        });
      }
    });

    // 3. Language Selector Buttons
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      if (!btn.__navWired) {
        btn.__navWired = true;
        btn.addEventListener('click', () => {
          const lang = btn.dataset.lang;
          if (window.AppState && typeof window.AppState.setLanguage === 'function') {
            window.AppState.setLanguage(lang);
          } else {
            document.querySelectorAll('.lang-btn').forEach(b => {
              const match = b.dataset.lang === lang;
              b.classList.toggle('active', match);
              b.setAttribute('aria-pressed', String(match));
            });
          }
        });
      }
    });
  }

  // ── 8. Public API & Auto-Initialization ───────────────────
  const NavigationSystem = {
    init: function() {
      // Don't render general navigation on specialized kiosk/ambient exhibition modes
      const path = getCurrentPath();
      if (path === 'kiosk.html' || path === 'exhibition.html') {
        return;
      }

      renderOrSyncNavbar();
      renderOrSyncMobileMenu();
      renderOrSyncBottomBar();
      renderOrSyncFloatingDock();
      wireCoreNavActions();
    },
    resetDockPosition: function() {
      localStorage.setItem(STORAGE_KEY, DEFAULT_SNAP);
      const dock = document.getElementById('global-floating-dock');
      if (dock) {
        SNAP_CLASSES.forEach(cls => dock.classList.remove(cls));
        dock.classList.add(DEFAULT_SNAP);
      }
    },
    setDockPosition: function(snapClass) {
      if (!SNAP_CLASSES.includes(snapClass)) return;
      localStorage.setItem(STORAGE_KEY, snapClass);
      const dock = document.getElementById('global-floating-dock');
      if (dock) {
        SNAP_CLASSES.forEach(cls => dock.classList.remove(cls));
        dock.classList.add(snapClass);
      }
    }
  };

  // Expose globally
  window.NavigationSystem = NavigationSystem;

  // Run automatically when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', NavigationSystem.init);
  } else {
    NavigationSystem.init();
  }

})(window, document);
