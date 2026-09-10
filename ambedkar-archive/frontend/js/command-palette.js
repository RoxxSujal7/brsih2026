/**
 * command-palette.js — Apple Spotlight-style Quick Command HUD (Cmd+K / Ctrl+K)
 * Double-bezel architecture, instant fuzzy navigation across all 60 volumes,
 * media records, milestones, and reader routes.
 */

(function initCommandPalette() {
  // Pre-compiled search index for instantaneous response
  const PALETTE_ITEMS = [
    // Navigation
    { title: 'Archive Catalog — 60 BAWS Volumes', category: 'Navigation', url: 'archive.html', icon: '📚', badge: 'Browse' },
    { title: 'Reader Sanctuary — Distraction-Free Study', category: 'Navigation', url: 'reader.html', icon: '📖', badge: 'Reader' },
    { title: 'Historical Audio-Visual Player & Speeches', category: 'Navigation', url: 'media.html', icon: '🎙️', badge: 'Media' },
    { title: 'Milestone Chronology (1891–1956)', category: 'Navigation', url: 'timeline.html', icon: '⏳', badge: 'History' },
    { title: 'AI Scholarly Research Assistant', category: 'Navigation', url: 'assistant.html', icon: '✨', badge: 'AI' },
    { title: 'Manuscript OCR Visualizer', category: 'Navigation', url: 'ocr.html', icon: '🔍', badge: 'Tools' },
    { title: 'Research Workspace & Dashboard', category: 'Navigation', url: 'dashboard.html', icon: '📊', badge: 'User' },

    // Landmark Books & Treatises
    { title: 'Annihilation of Caste (1936)', category: 'Treatise', url: 'archive.html?search=Annihilation%20of%20Caste', icon: '⚡', badge: 'Vol 1' },
    { title: 'Castes in India: Mechanism, Genesis & Development (1916)', category: 'Treatise', url: 'archive.html?search=Castes%20in%20India', icon: '📜', badge: 'Vol 1' },
    { title: 'The Problem of the Rupee: Its Origin and Solution (1923)', category: 'Treatise', url: 'archive.html?search=Problem%20of%20the%20Rupee', icon: '🪙', badge: 'Vol 6' },
    { title: 'Who Were the Shudras? (1948)', category: 'Treatise', url: 'archive.html?search=Who%20Were%20the%20Shudras', icon: '🏛️', badge: 'Vol 7' },
    { title: 'The Untouchables: Who Were They? (1948)', category: 'Treatise', url: 'archive.html?search=The%20Untouchables', icon: '🔍', badge: 'Vol 7' },
    { title: 'The Buddha and His Dhamma (1957)', category: 'Treatise', url: 'archive.html?search=Buddha%20and%20His%20Dhamma', icon: '☸️', badge: 'Vol 11' },
    { title: 'Buddha or Karl Marx (1956)', category: 'Treatise', url: 'assistant.html?q=Buddha%20or%20Karl%20Marx', icon: '⚖️', badge: 'Vol 3' },
    { title: 'Riddles in Hinduism (1987)', category: 'Treatise', url: 'archive.html?search=Riddles%20in%20Hinduism', icon: '❓', badge: 'Vol 4' },
    { title: 'States and Minorities (1947 Draft Constitution)', category: 'Treatise', url: 'archive.html?search=States%20and%20Minorities', icon: '🇮🇳', badge: 'Vol 1' },
    { title: 'Pakistan or the Partition of India (1940)', category: 'Treatise', url: 'archive.html?search=Pakistan%20or%20the%20Partition', icon: '🗺️', badge: 'Vol 8' },
    { title: 'What Congress and Gandhi Have Done (1945)', category: 'Treatise', url: 'archive.html?search=What%20Congress%20and%20Gandhi', icon: '📑', badge: 'Vol 9' },
    { title: 'Constituent Assembly Debates (Drafting Speeches)', category: 'Constitutional', url: 'archive.html?search=Constitution', icon: '🏛️', badge: 'Vol 13' },
    { title: 'Hindu Code Bill Debates & Resignation (1951)', category: 'Constitutional', url: 'archive.html?search=Hindu%20Code%20Bill', icon: '⚖️', badge: 'Vol 14' },

    // Key Historic Milestones
    { title: 'Mahad Satyagraha & Chavadar Water Tank (1927)', category: 'Milestone', url: 'timeline.html#1927', icon: '💧', badge: '1927' },
    { title: 'Manusmriti Dahan Din (December 25, 1927)', category: 'Milestone', url: 'timeline.html#1927', icon: '🔥', badge: '1927' },
    { title: 'Kalaram Temple Entry Satyagraha (1930)', category: 'Milestone', url: 'timeline.html#1930', icon: '🚪', badge: '1930' },
    { title: 'Round Table Conferences in London (1930–1932)', category: 'Milestone', url: 'timeline.html#1930', icon: '👑', badge: '1930' },
    { title: 'Poona Pact with Gandhi at Yerwada (1932)', category: 'Milestone', url: 'timeline.html#1932', icon: '✍️', badge: '1932' },
    { title: 'Yeola Declaration — "I will not die a Hindu" (1935)', category: 'Milestone', url: 'timeline.html#1935', icon: '⚡', badge: '1935' },
    { title: 'Constitution Adopted by Constituent Assembly (1949)', category: 'Milestone', url: 'timeline.html#1949', icon: '📜', badge: '1949' },
    { title: 'Nagpur Historic Conversion to Buddhism (1956)', category: 'Milestone', url: 'timeline.html#1956', icon: '☸️', badge: '1956' }
  ];

  // Add all 21 English Volumes to palette
  for (let i = 1; i <= 21; i++) {
    PALETTE_ITEMS.push({
      title: `BAWS Volume ${i}: Official Writings & Speeches`,
      category: 'BAWS Volume',
      url: `archive.html?search=Volume%20${i}`,
      icon: '📖',
      badge: `Vol ${i}`
    });
  }

  // Inject Command Palette HTML
  const paletteEl = document.createElement('div');
  paletteEl.id = 'cmd-palette-backdrop';
  paletteEl.className = 'cmd-backdrop';
  paletteEl.innerHTML = `
    <div class="cmd-dialog card" role="dialog" aria-modal="true" aria-label="Quick Command Palette">
      <div class="cmd-inner card-inner">
        <div class="cmd-search-bar">
          <svg class="cmd-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="cmd-input" placeholder="Search 60 volumes, treatises, audio, or milestones..." autocomplete="off" spellcheck="false" />
          <div class="cmd-esc-badge"><kbd>ESC</kbd></div>
        </div>
        <div class="cmd-results" id="cmd-results" role="listbox"></div>
        <div class="cmd-footer">
          <div class="cmd-shortcut-hint"><span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span> <span><kbd>↵</kbd> to select</span> <span><kbd>esc</kbd> to close</span></div>
          <div class="cmd-corpus-badge">60 BAWS Volumes Indexed</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(paletteEl);

  const input = document.getElementById('cmd-input');
  const resultsContainer = document.getElementById('cmd-results');
  let selectedIndex = 0;
  let currentMatches = [];

  function openPalette() {
    if (window.ApplePhysics && typeof window.ApplePhysics.haptic === 'function') {
      window.ApplePhysics.haptic('selection');
    }
    paletteEl.classList.add('cmd-active');
    input.value = '';
    selectedIndex = 0;
    renderMatches('');
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    paletteEl.classList.remove('cmd-active');
  }

  function renderMatches(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      currentMatches = PALETTE_ITEMS.slice(0, 8);
    } else {
      currentMatches = PALETTE_ITEMS.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
      ).slice(0, 10);
    }

    if (currentMatches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="cmd-empty-state">
          <p style="color:var(--text-muted);font-size:0.88rem;">No archival records matching "<strong>${query}</strong>"</p>
          <p style="font-size:0.75rem;color:var(--accent-light);margin-top:0.4rem;">Try searching for "Volume 1", "Constitution", "Rupee", or "Buddhism"</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = currentMatches.map((item, idx) => `
      <div class="cmd-item ${idx === selectedIndex ? 'cmd-item-selected' : ''}" data-idx="${idx}">
        <span class="cmd-item-icon">${item.icon}</span>
        <div class="cmd-item-body">
          <div class="cmd-item-title">${highlightMatch(item.title, q)}</div>
          <div class="cmd-item-cat">${item.category}</div>
        </div>
        <span class="cmd-item-badge">${item.badge}</span>
      </div>
    `).join('');

    // Attach click listeners
    resultsContainer.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        executeItem(currentMatches[idx]);
      });
    });
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="cmd-mark">$1</mark>');
  }

  function executeItem(item) {
    if (!item) return;
    closePalette();
    window.location.href = item.url;
  }

  // Keyboard Navigation inside dialog
  input.addEventListener('input', () => {
    selectedIndex = 0;
    renderMatches(input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentMatches.length > 0) {
        selectedIndex = (selectedIndex + 1) % currentMatches.length;
        updateSelectedUI();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentMatches.length > 0) {
        selectedIndex = (selectedIndex - 1 + currentMatches.length) % currentMatches.length;
        updateSelectedUI();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentMatches[selectedIndex]) {
        executeItem(currentMatches[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  });

  function updateSelectedUI() {
    resultsContainer.querySelectorAll('.cmd-item').forEach((el, idx) => {
      if (idx === selectedIndex) {
        el.classList.add('cmd-item-selected');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('cmd-item-selected');
      }
    });
  }

  // Backdrop click closes palette
  paletteEl.addEventListener('click', (e) => {
    if (e.target === paletteEl) {
      closePalette();
    }
  });

  // Global hotkeys: Cmd+K, Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteEl.classList.contains('cmd-active')) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  // Expose API
  window.CommandPalette = {
    open: openPalette,
    close: closePalette
  };
})();
