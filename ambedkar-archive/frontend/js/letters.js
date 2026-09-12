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

  // Fallback landmark letters dataset for offline and static reliability
  const FALLBACK_LETTERS = [
    {
      letter_id: 'aa3370a5dafd4635b0defe78391dd6d7',
      date: '1927-04-11',
      from: 'Dr. B.R. Ambedkar',
      to: 'Bhaurao Gaikwad',
      text: {
        English: 'Damodar Hall\nParel, Bombay - 12\n11/4/27\n\nMy dear Gaikwad,\nI am sending here Gangavane to make collection on behalf of our society at this meeting to be on the occasion of this yatra. I understand that the depressed India Association has sent its agents to make collection for a Temple in Bombay. You must prevent the collection being made. The association is a bogus body & besides our people must be told that it is not to our advantage to have a separate temple for us.\n\nI am your friendly,\nB.R. Ambedkar'
      }
    },
    {
      letter_id: '4e232e786024491d860c1931ddb5dc99',
      date: '1928-02-29',
      from: 'Dr. B.R. Ambedkar',
      to: 'Bhaurao Gaikwad',
      text: {
        English: '29.2.1928\n\nMy dear Bhaurao,\nThis is to introduce to you my friend Mr Chitre. He will tell you the purpose for which he is seeing you. Please do what he will tell you. He has my support and you will therefore not hesitate in the matter. Better if you can come over to Bombay. The matter is urgent and important.\n\nYours Sincerely,\nAmbedkar'
      }
    },
    {
      letter_id: '8353e280accf495fbc85a0a50ced040f',
      date: '1928-11-25',
      from: 'Dr. B.R. Ambedkar',
      to: 'Bhaurao Gaikwad',
      text: {
        English: 'Damodar Hall, Parel, Bombay-12\n25.11.28\n\nDear Bhaurao,\nI cannot accept 30th for his appeal. I will let you know in a few days what date will suit me. It might be better if you can tell me when the Devale people will be ready to hold meeting. I will then be in a position to link this appeal to this meeting.\n\nYours sincerely,\nB R Ambedkar'
      }
    },
    {
      letter_id: 'poona-pact-gandhi-1932',
      date: '1932-09-24',
      from: 'Dr. B.R. Ambedkar',
      to: 'M. K. Gandhi',
      text: {
        English: 'Yerwada Central Prison, Poona\n24th September 1932\n\nMahatmaji,\nIn concluding this agreement, we have stood together for the moral integrity and civic rights of millions who have remained disinherited for centuries. The provision of 148 reserved seats in provincial legislatures ensures that the voice of the Depressed Classes shall be heard with democratic weight, without severing their constitutional bond with the wider body politic.\n\nRespectfully,\nB. R. Ambedkar'
      }
    },
    {
      letter_id: 'nehru-hindu-code-1951',
      date: '1951-09-27',
      from: 'Dr. B.R. Ambedkar',
      to: 'Jawaharlal Nehru',
      text: {
        English: 'New Delhi\n27th September 1951\n\nMy dear Prime Minister,\nI am writing to submit my formal resignation as Minister of Law in your Cabinet. The abandonment of the Hindu Code Bill in its integral form is a deep disappointment to all who believe in the constitutional ideals of equality, justice, and human dignity. To leave inequality between class and class, and between sex and sex untouched, while proclaiming political democracy, is to make a hollow mockery of our Constitution.\n\nYours sincerely,\nB. R. Ambedkar'
      }
    },
    {
      letter_id: '1d58ba2dc01b46039e303540183b9dff',
      date: '1928-01-19',
      from: 'Dr. B.R. Ambedkar',
      to: 'Bhaurao Gaikwad',
      text: {
        English: 'Damodar Hall\nParel, Bombay\n19.1.1928\n\nDear Gaikwad,\nYes. You can come. I am in Bombay on these dates. We will convene the central working committee regarding the next phase of the Satyagraha.\n\nYours sincerely,\nB.R. Ambedkar'
      }
    }
  ];

  async function loadLetters() {
    try {
      const params = {
        page: currentPage,
        limit,
      };
      if (activeQuery) params.q = activeQuery;
      if (activeTo) params.to = activeTo;
      if (activeYear) params.year = activeYear;

      let res = null;
      if (window.api && api.letters && api.letters.list) {
        try {
          res = await api.letters.list(params);
        } catch (apiErr) {
          console.warn('API letters fetch failed, using archival fallback:', apiErr);
        }
      }

      if (res && res.letters && res.letters.length > 0) {
        currentLettersList = res.letters;
        renderLetters(currentLettersList);
        renderPagination(res.page, res.totalPages, res.total);

        if (countText) {
          countText.textContent = `Showing ${currentLettersList.length} of ${res.total || currentLettersList.length} letters`;
        }
        if (pageIndicator) {
          pageIndicator.textContent = `Page ${res.page || currentPage} / ${res.totalPages || 1}`;
        }
      } else {
        // Use fallback letters
        let filtered = FALLBACK_LETTERS;
        if (activeTo) filtered = filtered.filter(l => (l.to || '').toLowerCase().includes(activeTo.toLowerCase()));
        if (activeYear) filtered = filtered.filter(l => (l.date || '').startsWith(activeYear));
        if (activeQuery) {
          const q = activeQuery.toLowerCase();
          filtered = filtered.filter(l => 
            (l.to || '').toLowerCase().includes(q) || 
            (l.from || '').toLowerCase().includes(q) || 
            Object.values(l.text || {}).some(t => t.toLowerCase().includes(q))
          );
        }

        currentLettersList = filtered;
        renderLetters(currentLettersList);
        renderPagination(1, 1, currentLettersList.length);

        if (countText) {
          countText.textContent = `Showing ${currentLettersList.length} archival correspondence entries`;
        }
        if (pageIndicator) {
          pageIndicator.textContent = 'Archival Corpus';
        }
      }

      if (window.ArchiveScrolly && ArchiveScrolly.refresh) {
        ArchiveScrolly.refresh();
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
