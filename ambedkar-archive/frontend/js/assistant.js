/**
 * assistant.js — AI Research Assistant Engine
 * Fine-tuned across the 21-Volume BAWS corpus with rich citation rendering,
 * interactive suggestion pills, and direct archive volume links.
 */

const messagesEl = document.getElementById('chat-messages');
const inputEl = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chipsContainer = document.getElementById('suggestion-chips');

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function parseMarkdown(text) {
  return text
    .replace(/^### (.+)$/gm, '<h4 style="font-family:var(--font-heading);color:var(--text);margin:0.75rem 0 0.4rem;font-size:1rem;letter-spacing:-0.01em;">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="font-family:var(--font-heading);color:var(--accent-light);margin:0.85rem 0 0.4rem;font-size:1.1rem;">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text);font-weight:600;">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:var(--text-secondary);">$1</em>')
    .replace(/^• (.+)$/gm, '<li style="margin-left:1.2rem;list-style:disc;margin-bottom:0.3rem;">$1</li>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:1.2rem;list-style:disc;margin-bottom:0.3rem;">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

function addMessage(text, type = 'ai', citation = null, volumeNo = null, related = []) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble bubble-${type}`;

  const formatted = parseMarkdown(text);
  bubble.innerHTML = formatted;

  // Add volume reader action button if associated with a BAWS volume
  if (volumeNo && type === 'ai') {
    const volAction = document.createElement('div');
    volAction.style.marginTop = '0.75rem';
    volAction.style.display = 'flex';
    volAction.style.gap = '0.5rem';
    volAction.style.flexWrap = 'wrap';

    const volLink = document.createElement('a');
    volLink.href = `archive.html?search=Volume%20${volumeNo}`;
    volLink.className = 'btn btn-secondary';
    volLink.style.padding = '0.35rem 0.75rem';
    volLink.style.fontSize = '0.75rem';
    volLink.style.borderRadius = '9999px';
    volLink.innerHTML = `<span>📖 Read BAWS Volume ${volumeNo}</span>`;
    volAction.appendChild(volLink);
    bubble.appendChild(volAction);
  }

  // Citation note
  if (citation) {
    const cite = document.createElement('div');
    cite.className = 'citation';
    cite.style.marginTop = '0.65rem';
    cite.style.fontSize = '0.72rem';
    cite.style.color = 'var(--accent-light)';
    cite.style.fontFamily = 'var(--font-mono)';
    cite.innerHTML = `📌 <em>${citation}</em>`;
    bubble.appendChild(cite);
  }

  messagesEl.appendChild(bubble);
  scrollToBottom();

  // If AI response provides related prompts, generate follow-up pills
  if (type === 'ai' && related && related.length > 0) {
    renderDynamicPills(related);
  }

  return bubble;
}

function renderDynamicPills(prompts) {
  const pillDeck = document.createElement('div');
  pillDeck.className = 'dynamic-followups';
  pillDeck.style.display = 'flex';
  pillDeck.style.flexWrap = 'wrap';
  pillDeck.style.gap = '0.4rem';
  pillDeck.style.margin = '0.5rem 0 1rem';
  pillDeck.style.paddingLeft = '0.5rem';

  const label = document.createElement('span');
  label.style.fontSize = '0.68rem';
  label.style.color = 'var(--text-muted)';
  label.style.fontFamily = 'var(--font-mono)';
  label.style.alignSelf = 'center';
  label.textContent = 'Explore related:';
  pillDeck.appendChild(label);

  prompts.forEach(p => {
    const pill = document.createElement('button');
    pill.className = 'chip';
    pill.style.fontSize = '0.72rem';
    pill.style.padding = '0.25rem 0.65rem';
    pill.textContent = p;
    pill.addEventListener('click', () => {
      inputEl.value = p;
      sendMessage();
    });
    pillDeck.appendChild(pill);
  });

  messagesEl.appendChild(pillDeck);
  scrollToBottom();
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'chat-bubble bubble-ai typing-indicator';
  el.id = 'typing-indicator';
  el.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
  el.setAttribute('aria-label', 'AI is consulting BAWS scholarly records');
  messagesEl.appendChild(el);
  scrollToBottom();
}

function hideTyping() {
  document.getElementById('typing-indicator')?.remove();
}

async function sendMessage() {
  const query = inputEl.value.trim();
  if (!query) return;

  // Add user message bubble
  addMessage(query, 'user');
  inputEl.value = '';
  inputEl.style.height = 'auto';
  sendBtn.disabled = true;

  showTyping();

  // Realistic scholarly thinking latency (500-900ms)
  await new Promise(r => setTimeout(r, 500 + Math.random() * 400));

  hideTyping();

  // Query scholarly engine
  const lang = (window.AppState && window.AppState.getCurrentLang) ? window.AppState.getCurrentLang() : 'en';
  const result = window.ChatbotData.findAnswer(query);

  let answerText = result?.answer || 'I could not find a relevant passage in the BAWS corpus.';

  if (lang === 'hi') {
    answerText = `[English scholarly extract — Hindi translation in synthesis]\n\n${answerText}`;
  } else if (lang === 'mr') {
    answerText = `[English scholarly extract — Marathi translation in synthesis]\n\n${answerText}`;
  }

  addMessage(answerText, 'ai', result?.citation, result?.volume, result?.related);
  sendBtn.disabled = false;

  // Search API for relevant documents in parallel if backend is available
  try {
    if (window.api && window.api.documents) {
      const searchRes = await window.api.documents.search(query, { limit: 2 });
      if (searchRes?.documents?.length) {
        const docLinks = searchRes.documents
          .map(d => `<a href="reader.html?id=${d._id}" style="color:var(--accent-light);text-decoration:underline;">📖 ${d.title}</a>`)
          .join('<br/>');
        const relBubble = document.createElement('div');
        relBubble.className = 'chat-bubble bubble-ai';
        relBubble.style.fontSize = '.78rem';
        relBubble.style.opacity = '0.9';
        relBubble.innerHTML = `<strong style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">Archival Catalog Match:</strong><br/>${docLinks}`;
        messagesEl.appendChild(relBubble);
        scrollToBottom();
      }
    }
  } catch (_) {
    // Graceful offline fallback
  }
}

// ── Event Listeners ────────────────────────────────────────────────────────
sendBtn?.addEventListener('click', sendMessage);

inputEl?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Dynamic auto-expanding textarea
inputEl?.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + 'px';
});

// Initial suggestion chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    inputEl.value = chip.textContent.trim();
    sendMessage();
    if (chipsContainer) {
      chipsContainer.style.display = 'none';
    }
  });
});

// Auto-trigger query from URL param ?q= or ?search=
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q') || urlParams.get('search');
  if (q && inputEl) {
    inputEl.value = q;
    sendMessage();
    if (chipsContainer) {
      chipsContainer.style.display = 'none';
    }
  }
});
