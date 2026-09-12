const express = require('express');
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');
const ReadingProgress = require('../models/ReadingProgress');
const { protect } = require('../middleware/auth');

const router = express.Router();
const inMemoryProgress = new Map();

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// GET /api/progress — Get all user's reading progress (dashboard)
router.get('/', protect, async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const progress = await ReadingProgress.find({ userId: req.user._id })
        .populate('documentId', 'title category year imageUrl summary')
        .sort('-lastReadAt')
        .limit(20);
      return res.json({ success: true, progress });
    }
    const userProgress = Array.from(inMemoryProgress.values())
      .filter((p) => String(p.userId) === String(req.user._id))
      .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));
    res.json({ success: true, progress: userProgress });
  } catch (err) {
    next(err);
  }
});

// GET /api/progress/:documentId — Get progress for one document
router.get(
  '/:documentId',
  protect,
  [
    param('documentId').trim().isLength({ min: 1, max: 100 }).matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Invalid document identifier format.'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const docId = req.params.documentId.trim();

      if (isDbConnected()) {
        const progress = await ReadingProgress.findOne({
          userId: req.user._id,
          documentId: docId,
        });
        return res.json({ success: true, progress: progress || null });
      }
      const key = `${req.user._id}:${docId}`;
      const progress = inMemoryProgress.get(key) || null;
      res.json({ success: true, progress });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/progress/:documentId — Save/update reading progress
router.post(
  '/:documentId',
  protect,
  [
    param('documentId').trim().isLength({ min: 1, max: 100 }).matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Invalid document identifier format.'),
    body('scrollPosition').optional().isNumeric().withMessage('scrollPosition must be a number.'),
    body('percentComplete').optional().isFloat({ min: 0, max: 100 }).withMessage('percentComplete must be between 0 and 100.'),
    body('timeSpentSeconds').optional().isNumeric({ no_symbols: false }).withMessage('timeSpentSeconds must be a number.'),
    body('currentPage').optional().isInt({ min: 1 }).withMessage('currentPage must be an integer of at least 1.'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const docId = req.params.documentId.trim();
      const { scrollPosition, percentComplete, timeSpentSeconds, currentPage } = req.body;

      const safeScroll = Math.max(0, parseFloat(scrollPosition) || 0);
      const safePercent = Math.min(100, Math.max(0, parseFloat(percentComplete) || 0));
      const safeTime = Math.max(0, parseInt(timeSpentSeconds, 10) || 0);
      const safePage = Math.max(1, parseInt(currentPage, 10) || 1);

      if (isDbConnected()) {
        const progress = await ReadingProgress.findOneAndUpdate(
          { userId: req.user._id, documentId: docId },
          {
            scrollPosition: safeScroll,
            percentComplete: safePercent,
            lastReadAt: Date.now(),
            timeSpentSeconds: safeTime,
            currentPage: safePage,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return res.json({ success: true, progress });
      }

      const key = `${req.user._id}:${docId}`;
      const existing = inMemoryProgress.get(key) || {
        _id: 'prog-' + Math.random().toString(36).substring(2, 9),
        userId: req.user._id,
        documentId: docId,
        timeSpentSeconds: 0,
      };
      const progress = {
        ...existing,
        scrollPosition: safeScroll,
        percentComplete: safePercent,
        lastReadAt: new Date(),
        timeSpentSeconds: (existing.timeSpentSeconds || 0) + safeTime,
        currentPage: safePage,
      };
      inMemoryProgress.set(key, progress);
      res.json({ success: true, progress });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/progress/:documentId — Reset progress
router.delete(
  '/:documentId',
  protect,
  [
    param('documentId').trim().isLength({ min: 1, max: 100 }).matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Invalid document identifier format.'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const docId = req.params.documentId.trim();

      if (isDbConnected()) {
        await ReadingProgress.findOneAndDelete({
          userId: req.user._id,
          documentId: docId,
        });
        return res.json({ success: true, message: 'Progress reset.' });
      }
      const key = `${req.user._id}:${docId}`;
      inMemoryProgress.delete(key);
      res.json({ success: true, message: 'Progress reset.' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
