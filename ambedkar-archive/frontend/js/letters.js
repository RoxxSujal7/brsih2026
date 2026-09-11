/**
 * letters.js — Client logic for 361 Historical Letters Explorer
 * Upgraded with offline resilience, in-modal Prev/Next navigation,
 * Text-to-Speech narration, font scaling, search highlighting, and keyboard accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const limit = 24;
  let activeQuery = '';
  let activeTo = '';
  let activeYear = '';

  let currentLettersList = [];
  let currentLetterData = null;
  let currentLetterIndex = -1;
  let currentActiveLang = 'English';
  let currentFontSizeRem = 1.0;

  // Speech synthesis state
  let isSpeaking = false;
  const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

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
  const modalParties = document.getElementById('modal-letter-parties');
  const modalDate = document.getElementById('modal-letter-date');
  const modalBody = document.getElementById('modal-letter-body');
  const modalLangToggle = document.getElementById('modal-lang-toggle');
  const copyCitationBtn = document.getElementById('copy-citation-btn');
  const modalPrevBtn = document.getElementById('modal-prev-letter');
  const modalNextBtn = document.getElementById('modal-next-letter');
  const modalPosition = document.getElementById('modal-letter-position');

  // Toolbar action buttons
  const speakLetterBtn = document.getElementById('speak-letter-btn');
  const printLetterBtn = document.getElementById('print-letter-btn');
  const btnFontDecrease = document.getElementById('btn-font-decrease');
  const btnFontReset = document.getElementById('btn-font-reset');
  const btnFontIncrease = document.getElementById('btn-font-increase');

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

  // Modal close events
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      navigateModalLetter(-1);
    } else if (e.key === 'ArrowRight') {
      navigateModalLetter(1);
    }
  });

  // Prev / Next button listeners
  modalPrevBtn?.addEventListener('click', () => navigateModalLetter(-1));
  modalNextBtn?.addEventListener('click', () => navigateModalLetter(1));

  // Copy citation with robust fallback
  copyCitationBtn?.addEventListener('click', () => {
    if (!currentLetterData) return;
    const citation = `Ambedkar, B. R. (Correspondence ${currentLetterData.date || 'Historical'}). To: ${currentLetterData.to || 'Unknown'}. Ambedkar Digital Heritage Archive (baws.in).`;
    copyTextToClipboard(citation, 'Citation copied to clipboard! 📋');
  });

  // Print letter
  printLetterBtn?.addEventListener('click', () => {
    window.print();
  });

  // Font size adjustments
  btnFontDecrease?.addEventListener('click', () => {
    currentFontSizeRem = Math.max(0.8, currentFontSizeRem - 0.1);
    applyFontSize();
  });
  btnFontReset?.addEventListener('click', () => {
    currentFontSizeRem = 1.0;
    applyFontSize();
  });
  btnFontIncrease?.addEventListener('click', () => {
    currentFontSizeRem = Math.min(1.4, currentFontSizeRem + 0.15);
    applyFontSize();
  });

  function applyFontSize() {
    if (modalBody) {
      modalBody.style.fontSize = `${currentFontSizeRem.toFixed(2)}rem`;
    }
  }

  // Text to Speech
  speakLetterBtn?.addEventListener('click', () => {
    if (!synth) {
      if (window.AppState && AppState.showToast) {
        AppState.showToast('Text-to-speech is not supported in this browser.', 'warning');
      } else {
        alert('Text-to-speech is not supported in this browser.');
      }
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    startSpeaking();
  });

  function startSpeaking() {
    if (!synth || !currentLetterData || !currentLetterData.text) return;

    stopSpeaking();

    const rawText = currentLetterData.text[currentActiveLang] || currentLetterData.text.English || '';
    if (!rawText.trim()) return;

    // Clean up text formatting for clearer speech
    const speechText = `Letter to ${currentLetterData.to || 'Unknown'}. Date: ${currentLetterData.date || 'historical record'}. \n\n ${rawText.replace(/\\n/g, ' ')}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95; // Slightly slower, respectful archival cadence
    utterance.pitch = 1.0;

    // Detect language if Marathi or Tamil
    if (currentActiveLang === 'Marathi') {
      utterance.lang = 'mr-IN';
    } else if (currentActiveLang === 'Tamil') {
      utterance.lang = 'ta-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onstart = () => {
      isSpeaking = true;
      if (speakLetterBtn) {
        speakLetterBtn.innerHTML = '⏹️ Stop';
        speakLetterBtn.classList.add('speaking-active');
      }
    };

    utterance.onend = () => {
      stopSpeaking();
    };

    utterance.onerror = () => {
      stopSpeaking();
    };

    synth.speak(utterance);
  }

  function stopSpeaking() {
    if (synth) {
      synth.cancel();
    }
    isSpeaking = false;
    if (speakLetterBtn) {
      speakLetterBtn.innerHTML = '🔊 Listen';
      speakLetterBtn.classList.remove('speaking-active');
    }
  }

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
      currentLettersList = res.letters || [];

      renderLetters(currentLettersList);
      renderPagination(res.page, res.totalPages, res.total);

      if (countText) {
        countText.textContent = `Showing ${currentLettersList.length} of ${res.total || currentLettersList.length} letters`;
      }
      if (pageIndicator) {
        pageIndicator.textContent = `Page ${res.page || currentPage} / ${res.totalPages || 1}`;
      }
    } catch (err) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-faint);">Failed to load letters: ${err.message}</div>`;
    }
  }

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function highlightMatch(text, query) {
    if (!query || !query.trim()) return escapeHtml(text);
    const safeText = escapeHtml(text);
    const safeQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    return safeText.replace(regex, '<mark class="letter-highlight">$1</mark>');
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
      .map((l, index) => {
        const dateStr = l.date && l.date !== 'Unknown' ? l.date : 'Historical Record';
        const recipient = l.to || 'General Correspondent';
        const sender = l.from || 'Dr. B.R. Ambedkar';

        // Extract excerpt
        const fullText = (l.text && (l.text.English || l.text.Marathi || Object.values(l.text)[0])) || '';
        const rawExcerpt = fullText ? fullText.replace(/\\n/g, ' ').slice(0, 180) + '…' : 'Archival letter transcript available.';
        const highlightedExcerpt = highlightMatch(rawExcerpt, activeQuery);
        const highlightedRecipient = highlightMatch(recipient, activeQuery);

        const langBadge = Object.keys(l.text || {})
          .map((lang) => `<span class="badge badge-gold" style="font-size: 0.65rem; padding: 2px 6px;">${lang}</span>`)
          .join(' ');

        return `
          <div class="letter-card" 
               role="button" 
               tabindex="0" 
               aria-label="Read letter to ${escapeHtml(recipient)}"
               onclick="window.openLetterModal('${l.letter_id}')"
               onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); window.openLetterModal('${l.letter_id}'); }">
            <div>
              <div class="letter-meta-row">
                <span class="letter-date-badge">📅 ${dateStr}</span>
                <div>${langBadge}</div>
              </div>
              <div class="letter-parties">
                <div style="font-size: 0.775rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">To:</div>
                <strong style="font-size: 1.05rem;">${highlightedRecipient}</strong>
                <div style="font-size: 0.775rem; color: var(--text-faint); margin-top: 2px;">From: ${escapeHtml(sender)}</div>
              </div>
              <p class="letter-snippet">${highlightedExcerpt}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 10px; margin-top: 8px;">
              <span style="font-size: 0.75rem; color: var(--text-faint);">#${index + 1}</span>
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
    stopSpeaking();

    try {
      // Look up in currentLettersList first for instant response
      const localIdx = currentLettersList.findIndex((l) => l.letter_id === id || String(l.id) === String(id));
      if (localIdx !== -1) {
        currentLetterIndex = localIdx;
        currentLetterData = currentLettersList[localIdx];
        renderModalContent(currentLetterData);
        modal.classList.add('active');
        return;
      }

      // If not in current visible page, fetch from API / local helper
      const res = await api.letters.get(id);
      currentLetterData = res.letter;
      currentLetterIndex = currentLettersList.findIndex((l) => l.letter_id === currentLetterData.letter_id);
      renderModalContent(currentLetterData);
      modal.classList.add('active');
    } catch (e) {
      if (window.AppState && AppState.showToast) {
        AppState.showToast('Could not load letter details.', 'error');
      } else {
        alert('Could not load letter details.');
      }
    }
  };

  function renderModalContent(letter) {
    if (!letter) return;

    if (modalDate) {
      modalDate.textContent = letter.date && letter.date !== 'Unknown' ? `📅 ${letter.date}` : '📅 Historical Record';
    }
    if (modalTitle) {
      modalTitle.textContent = `To: ${letter.to || 'Unknown'}`;
    }
    if (modalParties) {
      modalParties.textContent = `From: ${letter.from || 'Dr. B. R. Ambedkar'}`;
    }

    // Prev / Next button state
    if (modalPrevBtn) {
      modalPrevBtn.disabled = currentLetterIndex <= 0;
      modalPrevBtn.style.opacity = currentLetterIndex <= 0 ? '0.4' : '1';
    }
    if (modalNextBtn) {
      modalNextBtn.disabled = currentLetterIndex === -1 || currentLetterIndex >= currentLettersList.length - 1;
      modalNextBtn.style.opacity = (currentLetterIndex === -1 || currentLetterIndex >= currentLettersList.length - 1) ? '0.4' : '1';
    }
    if (modalPosition && currentLettersList.length > 0 && currentLetterIndex !== -1) {
      modalPosition.textContent = `${currentLetterIndex + 1} / ${currentLettersList.length}`;
    } else if (modalPosition) {
      modalPosition.textContent = '';
    }

    // Build language toggle
    const availableLangs = Object.keys(letter.text || {});
    currentActiveLang = availableLangs.includes('English') ? 'English' : availableLangs[0] || 'English';

    if (modalLangToggle) {
      modalLangToggle.innerHTML = availableLangs
        .map(
          (lang) =>
            `<button class="btn ${lang === currentActiveLang ? 'btn-primary' : 'btn-secondary'} btn-xs" onclick="window.switchLetterLang('${lang}')">${lang}</button>`
        )
        .join('');
    }

    window.switchLetterLang(currentActiveLang);
    applyFontSize();
  }

  window.switchLetterLang = (lang) => {
    if (!currentLetterData || !currentLetterData.text) return;
    currentActiveLang = lang;

    const rawText = currentLetterData.text[lang] || 'Text not available in this language.';
    
    // Highlight matched query words in modal text if search is active
    if (activeQuery) {
      modalBody.innerHTML = highlightMatch(rawText, activeQuery);
    } else {
      modalBody.textContent = rawText;
    }

    modalLangToggle?.querySelectorAll('button').forEach((b) => {
      b.className = b.textContent === lang ? 'btn btn-primary btn-xs' : 'btn btn-secondary btn-xs';
    });

    if (isSpeaking) {
      startSpeaking();
    }
  };

  function navigateModalLetter(offset) {
    if (currentLettersList.length === 0) return;
    const nextIdx = currentLetterIndex + offset;
    if (nextIdx >= 0 && nextIdx < currentLettersList.length) {
      currentLetterIndex = nextIdx;
      currentLetterData = currentLettersList[nextIdx];
      renderModalContent(currentLetterData);
      modalBody?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showSuccess(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showSuccess(successMsg);
    } catch (e) {
      alert('Copied to clipboard!');
    }
    document.body.removeChild(textArea);
  }

  function showSuccess(msg) {
    if (window.AppState && AppState.showToast) {
      AppState.showToast(msg, 'success');
    } else {
      alert(msg);
    }
  }

  function closeModal() {
    stopSpeaking();
    modal.classList.remove('active');
    currentLetterData = null;
    currentLetterIndex = -1;
  }
});
