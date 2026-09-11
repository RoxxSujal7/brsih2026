const express = require('express');
const documentService = require('../services/documentService');
const { sendSuccess, sendError } = require('../utils/responseFormatter');
const { optionalAuth, protect } = require('../middleware/auth');
const { ForbiddenError } = require('../errors/AppError');

const router = express.Router();

// GET /api/documents/mea-catalog
router.get('/mea-catalog', (req, res) => {
  const data = documentService.getMeaCatalog();
  return sendSuccess(res, data, 'Official MEA BAWS catalog retrieved successfully.');
});

// GET /api/documents — List all documents
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const result = await documentService.getDocuments(req.query);
    return sendSuccess(res, result.documents, 'Documents retrieved successfully', 200, {
      total: result.total,
      page: result.page,
      pages: result.pages,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/featured
router.get('/featured', optionalAuth, async (req, res, next) => {
  try {
    const documents = await documentService.getFeaturedDocuments();
    return sendSuccess(res, { documents }, 'Featured documents retrieved successfully');
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/search — Proxy to unified search service
router.get('/search', optionalAuth, async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query) {
      return sendSuccess(res, { documents: [] }, 'No query provided');
    }
    // Validate query length
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
    return sendSuccess(res, { documents: matched }, `Found ${matched.length} documents`);
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/:id — HIGH-06 FIX: Gate fullText behind researcher/admin role
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id);

    // Determine access level based on auth status
    const isAuthenticated = !!req.user;
    const isResearcher = isAuthenticated && (req.user.role === 'researcher' || req.user.role === 'admin');

    // Strip fullText from public/visitor responses
    let docResponse = { ...doc };
    if (!isResearcher && docResponse.fullText) {
      delete docResponse.fullText;
    }

    const accessLevel = isResearcher ? 'full' : isAuthenticated ? 'summary' : 'public';

    return sendSuccess(res, { document: docResponse, accessLevel }, 'Document retrieved successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
