const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Load debates data
let debatesData = [];
try {
  const filePath = path.join(__dirname, '../data/debates.json');
  debatesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (err) {
  console.error('[DEBATES ROUTE] Error loading debates.json:', err.message);
  debatesData = [];
}

/**
 * GET /api/debates
 * Return all debate modules or filter by category or search term
 */
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let results = [...debatesData];

  if (category) {
    results = results.filter(d => d.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.topicsCovered.some(t => t.toLowerCase().includes(q)) ||
      d.historicalContext.toLowerCase().includes(q) ||
      (d.ambedkarPosition && d.ambedkarPosition.thesis.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

/**
 * GET /api/debates/:id
 * Return a specific historical debate module by ID
 */
router.get('/:id', (req, res) => {
  const debate = debatesData.find(d => d.id === req.params.id);
  if (!debate) {
    return res.status(404).json({
      success: false,
      message: `Debate module with ID '${req.params.id}' not found.`
    });
  }

  res.json({
    success: true,
    data: debate
  });
});

module.exports = router;
