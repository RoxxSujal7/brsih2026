/**
 * icons.js — Unified Archival SVG Icon System
 * Replaces functional emoji controls across pages with single-stroke SVG icons (Phosphor/Lucide style)
 * Tinted to archive gold (#d4af37) with 1.75px stroke. Zero external dependencies / 100% CSP compliant.
 */

(function () {
  const ICONS = {
    // Navigation & Content
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    archive: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'dhamma-wheel': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="5.64" y1="5.64" x2="18.36" y2="18.36"/><line x1="18.36" y1="5.64" x2="5.64" y2="18.36"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    'graduation-cap': '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    video: '<polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    presentation: '<rect width="18" height="14" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M10 21v-4"/><path d="M14 21v-4"/><path d="M8 21h8"/>',
    bot: '<rect width="18" height="12" x="3" y="6" rx="2"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><path d="M12 2v4"/><path d="m2 12h1M21 12h1"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    museum: '<path d="m2 9 10-6 10 6v2H2zm3 4v6m4-6v6m6-6v6m4-6v6M2 21h20"/>',
    ocr: '<path d="M4 7V4h3m10 0h3v3M4 17v3h3m10 0h3v-3M9 12h6M12 9v6"/>',
    dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',

    // Themes
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    scroll: '<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/>',
    amphora: '<path d="M10 2h4M9 2v4c0 3-4 4-4 8a7 7 0 0 0 14 0c0-4-4-5-4-8V2M5 10a3 3 0 0 0 3 3M19 10a3 3 0 0 1-3 3"/>',

    // Actions & Media
    play: '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>',
    pause: '<rect width="4" height="16" x="6" y="4" rx="1"/><rect width="4" height="16" x="14" y="4" rx="1"/>',
    'volume-2': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    'volume-x': '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
    maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
    minimize: '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>',
    bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    'arrow-right': '<path d="m12 5 7 7-7 7"/><path d="M5 12h14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>'
  };

  function getIconSvg(name, extraClasses = '') {
    const inner = ICONS[name] || ICONS.book;
    return `<svg class="svg-icon svg-icon-${name} ${extraClasses}" viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
  }

  // Emoji to icon map for automated modernization of functional UI
  const EMOJI_MAP = {
    '🏠': 'home',
    '📚': 'book',
    '📜': 'scroll',
    '☸️': 'dhamma-wheel',
    '⚖️': 'scale',
    '💡': 'lightbulb',
    '🎓': 'graduation-cap',
    '💬': 'message-square',
    '🎬': 'video',
    '📽️': 'presentation',
    '📅': 'calendar',
    '🤖': 'bot',
    '🔍': 'search',
    '👤': 'user',
    '🌙': 'moon',
    '☀️': 'sun',
    '🏺': 'amphora',
    '🏛️': 'museum',
    '🗺️': 'compass',
    '🎙️': 'volume-2',
    '🎧': 'volume-2',
    '🔊': 'volume-2',
    '📋': 'copy',
    '🔖': 'bookmark',
    '✨': 'sparkles'
  };

  function replaceEmojiIcons(root = document) {
    // 1. Explicit data-icon elements
    root.querySelectorAll('[data-icon]').forEach(el => {
      const iconName = el.getAttribute('data-icon');
      if (ICONS[iconName]) {
        el.innerHTML = getIconSvg(iconName, el.className.includes('gold') ? 'svg-icon-gold' : '');
      }
    });

    // 2. Navigation items, tab bar, and side-dock icons
    root.querySelectorAll('.nav-link, .tab-item, .side-dock-link, .theme-btn, .btn, .btn-icon-bubble, .filter-btn').forEach(el => {
      // Find direct text nodes or span icons containing functional emoji
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      const nodesToReplace = [];
      let node;
      while ((node = walker.nextNode())) {
        const text = node.nodeValue.trim();
        if (EMOJI_MAP[text]) {
          nodesToReplace.push({ node, icon: EMOJI_MAP[text] });
        }
      }

      nodesToReplace.forEach(({ node, icon }) => {
        const span = document.createElement('span');
        span.className = 'icon-replaced-wrapper';
        span.innerHTML = getIconSvg(icon);
        node.parentNode.replaceChild(span, node);
      });
    });
  }

  // Expose globally
  window.ArchiveIcons = {
    get: getIconSvg,
    replace: replaceEmojiIcons,
    map: ICONS
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => replaceEmojiIcons());
  } else {
    replaceEmojiIcons();
  }
})();
