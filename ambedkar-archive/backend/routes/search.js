const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

/**
 * GET /api/search?q=query
 * Unified search endpoint across documents and media (offline safe)
 */
router.get('/', async (req, res, next) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) {
      return res.json({ success: true, count: 0, data: { results: [] } });
    }

    let documents = [];
    try {
      documents = await Document.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(10);
    } catch (e) {
      try {
        const regex = new RegExp(query, 'i');
        documents = await Document.find({
          $or: [{ title: regex }, { description: regex }, { category: regex }, { tags: regex }]
        }).limit(10);
      } catch (err) {
        // MongoDB offline fallback
        documents = [];
      }
    }

    const mockArchive = [
      { id: 'doc-1', title: 'Annihilation of Caste (1936)', category: 'book', excerpt: 'Devastating critique of the caste system and call for social equality.', score: 0.98 },
      { id: 'doc-2', title: 'The Untouchables: Who Were They? (1948)', category: 'manuscript', excerpt: 'Historical & sociological study into the origins of untouchability.', score: 0.92 },
      { id: 'med-3', title: 'Final Constituent Assembly Address (1949)', category: 'speech', excerpt: 'Historic warning against hero worship and bhakti in Indian politics.', score: 0.95 },
      { id: 'tl-1932', title: 'Poona Pact Agreement (1932)', category: 'timeline', excerpt: 'Historic pact between Dr. Ambedkar and Gandhi on reserved seats.', score: 0.99 }
    ];

    let formatted = documents.map(d => ({
      id: d._id,
      type: 'Document',
      title: d.title,
      category: d.category,
      excerpt: d.description || d.summary,
      score: d._doc.score || 0.95
    }));

    if (formatted.length === 0) {
      const qLower = query.toLowerCase();
      const targetVol = req.query.volume ? parseInt(req.query.volume, 10) : null;
      const targetEdition = req.query.edition || req.query.language || null;

      const documentService = require('../services/documentService');
      const docsResult = await documentService.getDocuments({ limit: 120 });
      let matched = (docsResult.documents || []).filter(d => {
        const textMatch = 
          (d.title && d.title.toLowerCase().includes(qLower)) ||
          (d.titleHi && d.titleHi.toLowerCase().includes(qLower)) ||
          (d.summary && d.summary.toLowerCase().includes(qLower)) ||
          (d.tags && d.tags.some(t => t.toLowerCase().includes(qLower))) ||
          `vol ${d.volumeNo}`.includes(qLower);

        const volMatch = !targetVol || d.volumeNo === targetVol;
        const edMatch = !targetEdition || (targetEdition === 'english' ? d.edition === 'English BAWS' : targetEdition === 'hindi' ? d.edition === 'Hindi BAWS' : true);

        return textMatch && volMatch && edMatch;
      }).slice(0, 20);

      formatted = matched.map(d => ({
        id: d._id,
        type: d.edition || 'Document',
        volumeNo: d.volumeNo,
        title: d.title,
        titleHi: d.titleHi,
        category: d.category,
        year: d.year,
        excerpt: d.summary,
        tags: d.tags || [],
        localPdf: d.localPdf,
        score: 0.95
      }));
    }

    res.json({
      success: true,
      count: formatted.length,
      data: { results: formatted }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
