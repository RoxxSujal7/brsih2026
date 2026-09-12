const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Load memorials data
let memorialsData = [];
try {
  const filePath = path.join(__dirname, '../data/memorials.json');
  memorialsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (err) {
  console.error('[MEMORIALS ROUTE] Error loading memorials.json:', err.message);
  memorialsData = [];
}

/**
 * GET /api/memorials
 * Return all memorials or filter by city/state/search query
 */
router.get('/', (req, res) => {
  const { city, state, search } = req.query;
  let results = [...memorialsData];

  if (city) {
    results = results.filter(m => m.city.toLowerCase() === city.toLowerCase());
  }

  if (state) {
    results = results.filter(m => m.state.toLowerCase() === state.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (m.hindiName && m.hindiName.includes(q)) ||
      (m.marathiName && m.marathiName.includes(q)) ||
      m.city.toLowerCase().includes(q) ||
      m.significance.toLowerCase().includes(q) ||
      m.historicalContext.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

/**
 * GET /api/memorials/:id
 * Return a specific memorial by its ID
 */
router.get('/:id', (req, res) => {
  const memorial = memorialsData.find(m => m.id === req.params.id);
  if (!memorial) {
    return res.status(404).json({
      success: false,
      message: `Memorial with ID '${req.params.id}' not found.`
    });
  }

  res.json({
    success: true,
    data: memorial
  });
});

module.exports = router;
