/**
 * search.js — Global Search Modal (Ctrl+K / /)
 * Real-time instant search across books, speeches, timeline events, and OCR documents
 * HIGH-07 FIX: All server data HTML-escaped before innerHTML injection to prevent XSS
 */

// HIGH-07 FIX: Safe HTML escaping utility
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  // Inject Search Modal HTML dynamically if not already present
  if (!document.getElementById('global-search-modal')) {
    const modalHTML = `
      <div id="global-search-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-label="Search Archive" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:9999; align-items:flex-start; justify-content:center; padding-top: 5vh; backdrop-filter: blur(8px);">
        <div class="modal-card card-glass p-4 max-w-700 w-full mx-3 relative" style="border: 1px solid rgba(212,175,55,0.4); max-height:85vh; display:flex; flex-direction:column;">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-heading text-gold flex items-center gap-2">🔍 Search Ambedkar Heritage Archive</h3>
            <span class="text-xs text-muted">Press <kbd class="px-1 bg-card rounded">ESC</kbd> to close</span>
          </div>

          <div class="search-input-wrapper relative mb-3">
            <input type="text" id="global-search-input" class="w-full bg-card text-body px-4 py-3 rounded text-base border border-glass" placeholder="Search books, speeches, Poona Pact, Constitution, Mahad..." autofocus autocomplete="off" maxlength="200" />
            <span class="absolute right-3 top-3 text-muted text-xs">Ctrl+K</span>
          </div>

          <div id="global-search-results" class="search-results-list overflow-y-auto space-y-2 pr-1" style="flex:1; min-height: 200px; max-height: 50vh;" aria-live="polite">
            <p class="text-muted text-center py-4 text-sm">Type a search query above to explore documents, speeches, and timeline events...</p>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modal = document.getElementById('global-search-modal');
  const searchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('global-search-results');
  const searchBtn = document.getElementById('global-search-btn');

  const openSearch = () => {
    if (modal) modal.style.display = 'flex';
    if (searchInput) {
      searchInput.focus();
      searchInput.value = '';
    }
    if (searchResults) {
      searchResults.innerHTML = '<p class="text-muted text-center py-4 text-sm">Type a search query above...</p>';
    }
  };

  const closeSearch = () => {
    if (modal) modal.style.display = 'none';
  };

  if (searchBtn) searchBtn.addEventListener('click', openSearch);

  // Keyboard shortcuts (Ctrl+K or / to open, ESC to close)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeSearch();
    }
  });

  // Click backdrop to close
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSearch();
    });
  }

  // Debounced search query execution
  let debounceTimer = null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim();
      if (!query) {
        searchResults.innerHTML = '<p class="text-muted text-center py-4 text-sm">Type a search query above...</p>';
        return;
      }
      if (query.length > 200) return; // Client-side length guard

      searchResults.innerHTML = '<div class="text-center py-4"><span class="badge badge-gold animate-pulse">Searching Archive...</span></div>';

      debounceTimer = setTimeout(async () => {
        try {
          // HIGH-03 FIX: window.apiFetch is now exported from api.js
          const res = await window.apiFetch(`/search?q=${encodeURIComponent(query)}`);
          if (res && res.success) {
            renderSearchResults(res.data.results, query);
          } else {
            renderFallbackSearchResults(query);
          }
        } catch (err) {
          renderFallbackSearchResults(query);
        }
      }, 250);
    });
  }
});

function renderSearchResults(results, query) {
  const container = document.getElementById('global-search-results');
  if (!container) return;

  if (!results || results.length === 0) {
    const safeQuery = escapeHtml(query);
    container.innerHTML = `<div class="text-center py-4 text-muted">No records found matching "<strong>${safeQuery}</strong>". Try searching for <em>Constitution</em>, <em>Poona Pact</em>, or <em>Mahad</em>.</div>`;
    return;
  }

  // HIGH-07 FIX: Use escapeHtml on ALL server-returned data before injecting into innerHTML
  container.innerHTML = results.map(r => {
    const safeTitle = escapeHtml(r.title || '');
    const safeExcerpt = escapeHtml(r.excerpt || r.description || '');
    const safeType = escapeHtml(r.type || 'Document');
    const safeId = escapeHtml(r.id || '');
    const score = Math.round((r.score || 0.9) * 100);

    let href = 'archive.html';
    if (r.type === 'Document') href = `reader.html?id=${safeId}`;
    else if (r.type === 'Speech') href = 'media.html';

    const badgeClass = r.type === 'Document' ? 'badge-blue' : r.type === 'Speech' ? 'badge-gold' : 'badge-green';

    return `
    <a href="${href}" class="search-item-card block p-3 rounded bg-card border border-glass" style="text-decoration:none;display:block;">
      <div class="flex justify-between items-center mb-1">
        <span class="badge ${escapeHtml(badgeClass)} text-xs">${safeType}</span>
        <span class="text-xs text-muted">Match Score: ${score}%</span>
      </div>
      <h4 class="font-heading text-sm text-gold mb-1">${highlightQuery(safeTitle, query)}</h4>
      <p class="text-xs text-muted line-clamp-2">${highlightQuery(safeExcerpt, query)}</p>
    </a>
  `;
  }).join('');
}

function renderFallbackSearchResults(query) {
  const q = query.toLowerCase();
  const mockItems = [
    { type: 'Document', title: 'Annihilation of Caste (1936)', id: 'doc-en-1', excerpt: 'Undelivered speech prepared for the Jat-Pat-Todak Mandal conference in Lahore regarding caste reform and social equality.' },
    { type: 'Document', title: 'The Untouchables: Who Were They? (1948)', id: 'doc-en-7', excerpt: 'Historical and sociological investigation into the origin of untouchability in ancient India.' },
    { type: 'Speech', title: 'Final Speech in the Constituent Assembly', id: 'med-3', excerpt: 'Speech on November 25, 1949 delivering the Constitution of India and warning against hero worship in politics.' },
    { type: 'Document', title: 'The Problem of the Rupee (1923)', id: 'doc-en-6', excerpt: 'Doctoral dissertation on Indian monetary policy, currency standard, and the founding blueprint for the Reserve Bank of India.' },
    { type: 'Document', title: 'The Buddha and His Dhamma', id: 'doc-en-11', excerpt: 'Dr. Ambedkar\'s magnum opus on Navayana Buddhism, the Dhamma, and the 22 Vows taken at Nagpur in 1956.' },
  ];

  const matches = mockItems.filter(item =>
    item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
  );

  renderSearchResults(matches.length > 0 ? matches : mockItems.slice(0, 3), query);
}

// HIGH-07 FIX: highlightQuery only called on already-escaped text
function highlightQuery(escapedText, query) {
  if (!escapedText || !query) return escapedText || '';
  // Query itself needs to be escaped for use in regex (special chars)
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  // Since escapedText is already HTML-safe, only the highlight wrapper is added
  return escapedText.replace(regex, '<mark style="background:rgba(212,175,55,0.3);color:inherit;border-radius:2px;padding:0 2px;">$1</mark>');
}
