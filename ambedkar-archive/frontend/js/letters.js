/**
 * letters.js — Client logic for 361 Historical Letters Explorer
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const limit = 24;
  let activeQuery = '';
  let activeTo = '';
  let activeYear = '';
  let currentLetterData = null;

  const grid = document.getElementById('letters-grid');
  const searchInput = document.getElementById('letter-search-input');
  const yearSelect = document.getElementById('letter-year-select');
  const resetBtn = document.getElementById('reset-filters-btn');
  const countText = document.getElementById('letters-count-text');
  const pageIndicator = document.getElementById('letters-page-indicator');
  const pagination = document.getElementById('letters-pagination');
  const pillsContainer = document.getElementById('correspondent-pills');

  // Modal elements
  const modal = document.getElementById('letter-modal');
  const modalClose = document.getElementById('close-letter-modal');
  const modalTitle = document.getElementById('modal-letter-title');
  const modalDate = document.getElementById('modal-letter-date');
  const modalBody = document.getElementById('modal-letter-body');
  const modalLangToggle = document.getElementById('modal-lang-toggle');
  const copyCitationBtn = document.getElementById('copy-citation-btn');

  // Initial load
  loadLetters();

  // Search debounce
  let searchTimeout = null;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      activeQuery = e.target.value.trim();
      currentPage = 1;
      loadLetters();
    }, 300);
  });

  // Year select
  yearSelect?.addEventListener('change', (e) => {
    activeYear = e.target.value;
    currentPage = 1;
    loadLetters();
  });

  // Reset filters
  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (yearSelect) yearSelect.value = '';
    activeQuery = '';
    activeTo = '';
    activeYear = '';
    currentPage = 1;

    pillsContainer?.querySelectorAll('.correspondent-pill').forEach((p) => {
      p.classList.remove('active');
    });
    pillsContainer?.querySelector('[data-to=""]')?.classList.add('active');

    loadLetters();
  });

  // Correspondent pills
  pillsContainer?.addEventListener('click', (e) => {
    const pill = e.target.closest('.correspondent-pill');
    if (!pill) return;

    pillsContainer.querySelectorAll('.correspondent-pill').forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');

    activeTo = pill.getAttribute('data-to') || '';
    currentPage = 1;
    loadLetters();
  });

  // Modal events
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Copy citation
  copyCitationBtn?.addEventListener('click', () => {
    if (!currentLetterData) return;
    const citation = `Ambedkar, B. R. (Correspondence ${currentLetterData.date || 'Historical'}). To: ${currentLetterData.to || 'Unknown'}. Ambedkar Digital Heritage Archive (baws.in).`;
    navigator.clipboard.writeText(citation).then(() => {
      if (window.AppState && AppState.showToast) {
        AppState.showToast('Citation copied to clipboard! 📋', 'success');
      } else {
        alert('Citation copied!');
      }
    });
  });

  async function loadLetters() {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);"><span class="spinner spinner-sm"></span> Loading archival correspondence…</div>';

    try {
      const params = {
        page: currentPage,
        limit,
      };
      if (activeQuery) params.q = activeQuery;
      if (activeTo) params.to = activeTo;
      if (activeYear) params.year = activeYear;

      const res = await api.letters.list(params);

      renderLetters(res.letters);
      renderPagination(res.page, res.totalPages, res.total);

      if (countText) {
        countText.textContent = `Showing ${res.letters.length} of ${res.total} letters`;
      }
      if (pageIndicator) {
        pageIndicator.textContent = `Page ${res.page} / ${res.totalPages || 1}`;
      }
    } catch (err) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-faint);">Failed to load letters: ${err.message}</div>`;
    }
  }

  function renderLetters(letters) {
    if (!letters || letters.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--surface); border: 1px dashed var(--border); border-radius: var(--radius-2xl);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">📭</div>
          <h3 style="font-family: var(--font-display); font-size: 1.25rem; margin-bottom: 6px;">No correspondence found</h3>
          <p style="color: var(--text-muted); font-size: 0.875rem;">Try adjusting your search query or selecting a different correspondent.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = letters
      .map((l) => {
        const dateStr = l.date ? new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Undated';
        const recipient = l.to || 'General Correspondent';
        const sender = l.from || 'Dr. B.R. Ambedkar';

        // Extract excerpt
        const fullText = (l.text && (l.text.English || l.text.Marathi)) || '';
        const excerpt = fullText ? fullText.replace(/\\n/g, ' ').slice(0, 180) + '…' : 'Archival letter transcript available.';

        const langBadge = Object.keys(l.text || {})
          .map((lang) => `<span class="badge badge-gold" style="font-size: 0.65rem; padding: 2px 6px;">${lang}</span>`)
          .join(' ');

        return `
          <div class="letter-card" onclick="window.openLetterModal('${l.letter_id}')">
            <div>
              <div class="letter-meta-row">
                <span class="letter-date-badge">📅 ${dateStr}</span>
                <div>${langBadge}</div>
              </div>
              <div class="letter-parties">
                <div style="font-size: 0.8rem; color: var(--text-muted);">TO:</div>
                <strong style="font-size: 1.05rem;">${recipient}</strong>
                <div style="font-size: 0.775rem; color: var(--text-faint); margin-top: 2px;">From: ${sender}</div>
              </div>
              <p class="letter-snippet">${excerpt}</p>
            </div>
            <div style="display: flex; justify-content: flex-end; align-items: center; border-top: 1px solid var(--border); padding-top: 10px; margin-top: 8px;">
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--gold-light);">Read Letter →</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function renderPagination(page, totalPages, total) {
    if (!pagination) return;
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let html = '';
    if (page > 1) {
      html += `<button class="btn btn-secondary btn-sm" onclick="window.changeLettersPage(${page - 1})">← Previous</button>`;
    }

    // Page window
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let p = start; p <= end; p++) {
      const activeClass = p === page ? 'btn-primary' : 'btn-secondary';
      html += `<button class="btn ${activeClass} btn-sm" style="min-width: 38px;" onclick="window.changeLettersPage(${p})">${p}</button>`;
    }

    if (page < totalPages) {
      html += `<button class="btn btn-secondary btn-sm" onclick="window.changeLettersPage(${page + 1})">Next →</button>`;
    }

    pagination.innerHTML = html;
  }

  window.changeLettersPage = (p) => {
    currentPage = p;
    loadLetters();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  window.openLetterModal = async (id) => {
    try {
      const res = await api.letters.get(id);
      currentLetterData = res.letter;

      modalDate.textContent = currentLetterData.date ? `📅 ${currentLetterData.date}` : 'Historical Record';
      modalTitle.textContent = `To: ${currentLetterData.to || 'Unknown'}`;

      // Build language toggle
      const availableLangs = Object.keys(currentLetterData.text || {});
      const activeLang = availableLangs.includes('English') ? 'English' : availableLangs[0];

      modalLangToggle.innerHTML = availableLangs
        .map(
          (lang) =>
            `<button class="btn ${lang === activeLang ? 'btn-primary' : 'btn-secondary'} btn-xs" onclick="window.switchLetterLang('${lang}')">${lang}</button>`
        )
        .join('');

      window.switchLetterLang(activeLang);
      modal.classList.add('active');
    } catch (e) {
      if (window.AppState && AppState.showToast) {
        AppState.showToast('Could not load letter details.', 'error');
      }
    }
  };

  window.switchLetterLang = (lang) => {
    if (!currentLetterData || !currentLetterData.text) return;
    modalBody.textContent = currentLetterData.text[lang] || 'Text not available in this language.';

    modalLangToggle.querySelectorAll('button').forEach((b) => {
      b.className = b.textContent === lang ? 'btn btn-primary btn-xs' : 'btn btn-secondary btn-xs';
    });
  };

  function closeModal() {
    modal.classList.remove('active');
    currentLetterData = null;
  }
});
