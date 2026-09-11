const express = require('express');
const documentService = require('../services/documentService');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/documents/mea-catalog
router.get('/mea-catalog', (req, res) => {
  const data = documentService.getMeaCatalog();
  return res.json({
    success: true,
    code: 'OK',
    message: 'Official MEA BAWS catalog retrieved successfully.',
    data,
    meta: { timestamp: new Date().toISOString() },
  });
});

// GET /api/documents — List all documents
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const result = await documentService.getDocuments(req.query);
    return res.json({
      success: true,
      code: 'OK',
      message: 'Documents retrieved successfully',
      data: result.documents,
      meta: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/featured
router.get('/featured', optionalAuth, async (req, res, next) => {
  try {
    const documents = await documentService.getFeaturedDocuments();
    return res.json({
      success: true,
      code: 'OK',
      message: 'Featured documents retrieved successfully',
      data: { documents },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/search — Proxy to unified search service
router.get('/search', optionalAuth, async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query) {
      return res.json({
        success: true,
        code: 'OK',
        message: 'No query provided',
        data: { documents: [] },
        meta: { timestamp: new Date().toISOString() },
      });
    }

    if (query.length > 200) {
      return res.status(400).json({ success: false, message: 'Search query must be 200 characters or fewer.' });
    }

    const { limit = 10 } = req.query;
    const result = await documentService.getDocuments({ limit: Math.min(parseInt(limit) || 10, 50) });
    const qLower = query.toLowerCase();
    const matched = (result.documents || []).filter(d => {
      return (
        (d.title && d.title.toLowerCase().includes(qLower)) ||
        (d.titleHi && d.titleHi.toLowerCase().includes(qLower)) ||
        (d.summary && d.summary.toLowerCase().includes(qLower)) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(qLower)))
      );
    }).slice(0, parseInt(limit) || 10);

    return res.json({
      success: true,
      code: 'OK',
      message: `Found ${matched.length} documents`,
      data: { documents: matched },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/:id — Gate fullText behind researcher/admin role
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id);

    const isAuthenticated = !!req.user;
    const isResearcher = isAuthenticated && (req.user.role === 'researcher' || req.user.role === 'admin');

    let docResponse = { ...doc };
    if (!isResearcher && docResponse.fullText) {
      delete docResponse.fullText;
    }

    const accessLevel = isResearcher ? 'full' : isAuthenticated ? 'summary' : 'public';

    return res.json({
      success: true,
      code: 'OK',
      message: 'Document retrieved successfully',
      data: { document: docResponse, accessLevel },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
