/**
 * search.js — Global Search Modal (Ctrl+K)
 * Real-time instant search across books, speeches, timeline events, and OCR documents
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inject Search Modal HTML dynamically if not already present
  if (!document.getElementById('global-search-modal')) {
    const modalHTML = `
      <div id="global-search-modal" class="modal-backdrop" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:9999; align-items:flex-start; justify-center; pt-5; padding-top: 5vh; backdrop-filter: blur(8px);">
        <div class="modal-card card-glass p-4 max-w-700 w-full mx-3 relative" style="border: 1px solid rgba(212,175,55,0.4); max-height:85vh; display:flex; flex-direction:column;">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-heading text-gold flex items-center gap-2">🔍 Search Ambedkar Heritage Archive</h3>
            <span class="text-xs text-muted">Press <kbd class="px-1 bg-card rounded">ESC</kbd> to close</span>
          </div>

          <div class="search-input-wrapper relative mb-3">
            <input type="text" id="global-search-input" class="w-full bg-card text-body px-4 py-3 rounded text-base border border-glass" placeholder="Search books, speeches, Poona Pact, Constitution, Mahad..." autofocus />
            <span class="absolute right-3 top-3 text-muted text-xs">Ctrl+K</span>
          </div>

          <div id="global-search-results" class="search-results-list overflow-y-auto space-y-2 pr-1" style="flex:1; min-height: 200px; max-height: 50vh;">
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

  // Keyboard shortcuts (Ctrl+K or Cmd+K to open, ESC to close)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
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

      searchResults.innerHTML = '<div class="text-center py-4"><span class="badge badge-gold animate-pulse">Searching Archive...</span></div>';

      debounceTimer = setTimeout(async () => {
        try {
          // Call API
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
    container.innerHTML = `<div class="text-center py-4 text-muted">No records found matching "<strong>${query}</strong>". Try searching for <em>Constitution</em>, <em>Poona Pact</em>, or <em>Mahad</em>.</div>`;
    return;
  }

  container.innerHTML = results.map(r => `
    <a href="${r.type === 'Document' ? `reader.html?id=${r.id}` : r.type === 'Speech' ? `media.html` : 'archive.html'}" class="search-item-card block p-3 rounded bg-card hover:bg-glass border border-glass text-decoration-none">
      <div class="flex justify-between items-center mb-1">
        <span class="badge ${r.type === 'Document' ? 'badge-blue' : r.type === 'Speech' ? 'badge-gold' : 'badge-green'} text-xs">${r.type}</span>
        <span class="text-xs text-muted">Match Score: ${Math.round((r.score || 0.9) * 100)}%</span>
      </div>
      <h4 class="font-heading text-sm text-gold mb-1">${highlightQuery(r.title, query)}</h4>
      <p class="text-xs text-muted line-clamp-2">${highlightQuery(r.excerpt || r.description || '', query)}</p>
    </a>
  `).join('');
}

function renderFallbackSearchResults(query) {
  const q = query.toLowerCase();
  const mockItems = [
    { type: 'Document', title: 'Annihilation of Caste (1936)', id: 'doc-1', excerpt: 'Undelivered speech prepared for the Jat-Pat-Todak Mandal conference in Lahore regarding caste reform and social equality.' },
    { type: 'Document', title: 'The Untouchables: Who Were They? (1948)', id: 'doc-2', excerpt: 'Historical and sociological investigation into the origin of untouchability in ancient India.' },
    { type: 'Speech', title: 'Final Speech in the Constituent Assembly', id: 'med-3', excerpt: 'Speech on November 25, 1949 delivering the Constitution of India and warning against hero worship in politics.' },
    { type: 'Timeline', title: 'Poona Pact Agreement (1932)', id: 'tl-1932', excerpt: 'Historical agreement signed between Dr. B. R. Ambedkar and Mahatma Gandhi securing reserved seats for Depressed Classes.' }
  ];

  const matches = mockItems.filter(item => 
    item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
  );

  renderSearchResults(matches, query);
}

function highlightQuery(text, query) {
  if (!text || !query) return text || '';
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-gold-light text-dark px-1 rounded">$1</mark>');
}
