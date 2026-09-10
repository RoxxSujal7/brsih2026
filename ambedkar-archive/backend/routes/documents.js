const express = require('express');
const documentService = require('../services/documentService');
const { sendSuccess, sendError } = require('../utils/responseFormatter');
const { optionalAuth } = require('../middleware/auth');

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

// GET /api/documents/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id);
    return sendSuccess(res, { document: doc, accessLevel: 'full' }, 'Document retrieved successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
