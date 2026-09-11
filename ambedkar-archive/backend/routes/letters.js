const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/letters.json');

// HIGH-08 FIX: Load letters.json at module initialization time (not per-request)
// Prevents blocking the Node.js event loop on the first API call
let lettersCache = [];
try {
  if (fs.existsSync(dataPath)) {
    lettersCache = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`📬 Loaded ${lettersCache.length} historical letters from letters.json`);
  }
} catch (e) {
  console.error('Failed to pre-load letters.json:', e.message);
}

// HIGH-05 FIX: Add rate limiting to prevent bandwidth exhaustion
const lettersLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function getLetters() {
  return lettersCache;
}

// GET /api/letters — Search & List historical letters
router.get('/', lettersLimiter, (req, res) => {
  const letters = getLetters();
  let { q = '', to = '', from = '', year = '', page = 1, limit = 20 } = req.query;

  // HIGH-04 FIX: Validate query length to prevent DoS via giant strings
  if (q.length > 200 || to.length > 100 || from.length > 100) {
    return res.status(400).json({ success: false, message: 'Search query too long. Maximum 200 characters.' });
  }

  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit) || 20));

  let filtered = letters;

  // Search keyword in text, from, to
  if (q.trim()) {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter((l) => {
      const fromStr = (l.from || '').toLowerCase();
      const toStr = (l.to || '').toLowerCase();
      const textEn = (l.text && l.text.English ? l.text.English : '').toLowerCase();
      const textMr = (l.text && l.text.Marathi ? l.text.Marathi : '').toLowerCase();
      return fromStr.includes(term) || toStr.includes(term) || textEn.includes(term) || textMr.includes(term);
    });
  }

  // Filter by recipient (to)
  if (to.trim()) {
    const toTerm = to.trim().toLowerCase();
    filtered = filtered.filter((l) => (l.to || '').toLowerCase().includes(toTerm));
  }

  // Filter by sender (from)
  if (from.trim()) {
    const fromTerm = from.trim().toLowerCase();
    filtered = filtered.filter((l) => (l.from || '').toLowerCase().includes(fromTerm));
  }

  // Filter by year
  if (year.trim()) {
    filtered = filtered.filter((l) => (l.date || '').startsWith(year.trim()));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  // Collect prominent correspondents for quick filtering
  const correspondentCounts = {};
  letters.forEach((l) => {
    const recipient = (l.to || 'Unknown').trim();
    correspondentCounts[recipient] = (correspondentCounts[recipient] || 0) + 1;
  });

  const topCorrespondents = Object.entries(correspondentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, count]) => ({ name, count }));

  res.json({
    success: true,
    total,
    page,
    totalPages,
    limit,
    letters: paginated,
    topCorrespondents,
  });
});

// GET /api/letters/recipients — List top correspondents
router.get('/recipients', (req, res) => {
  const letters = getLetters();
  const counts = {};
  letters.forEach((l) => {
    const recipient = (l.to || 'Unknown').trim();
    counts[recipient] = (counts[recipient] || 0) + 1;
  });
  const recipients = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
  res.json({ success: true, count: recipients.length, recipients });
});

// GET /api/letters/:id — Single letter details
router.get('/:id', (req, res) => {
  const letters = getLetters();
  const letter = letters.find(
    (l) => l.letter_id === req.params.id || String(l.id) === String(req.params.id)
  );

  if (!letter) {
    return res.status(404).json({ success: false, message: 'Letter not found.' });
  }

  res.json({ success: true, letter });
});

module.exports = router;
