const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/vows.json');

let vowsCache = [];
function loadVows() {
  if (vowsCache.length === 0 && fs.existsSync(dataPath)) {
    try {
      vowsCache = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
      console.error('Failed to load vows.json:', e);
    }
  }
  return vowsCache;
}

// GET /api/vows — List all languages available
router.get('/', (req, res) => {
  const allVows = loadVows();
  const languages = allVows.map((v) => ({
    id: v.id,
    name: v.name,
    title: v.title,
    description: v.description,
    vowCount: (v.vows || []).length,
  }));

  res.json({
    success: true,
    languages,
    totalLanguages: languages.length,
    defaultLanguage: 'mr', // Marathi is the original historic language of Deeksha Bhoomi
  });
});

// GET /api/vows/:lang — Retrieve the 22 vows in a specific language
router.get('/:lang', (req, res) => {
  const allVows = loadVows();
  const targetLang = req.params.lang.toLowerCase().trim();

  let entry = allVows.find(
    (v) => (v.id || '').toLowerCase() === targetLang || (v.name || '').toLowerCase() === targetLang
  );

  // Fallback to English if language not matched
  if (!entry) {
    entry = allVows.find((v) => v.id === 'en') || allVows[0];
  }

  res.json({
    success: true,
    data: entry,
  });
});

module.exports = router;
