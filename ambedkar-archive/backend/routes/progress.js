const express = require('express');
const mongoose = require('mongoose');
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
router.get('/:documentId', protect, async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const progress = await ReadingProgress.findOne({
        userId: req.user._id,
        documentId: req.params.documentId,
      });
      return res.json({ success: true, progress: progress || null });
    }
    const key = `${req.user._id}:${req.params.documentId}`;
    const progress = inMemoryProgress.get(key) || null;
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
});

// POST /api/progress/:documentId — Save/update reading progress
router.post('/:documentId', protect, async (req, res, next) => {
  try {
    const { scrollPosition, percentComplete, timeSpentSeconds, currentPage } = req.body;

    if (isDbConnected()) {
      const progress = await ReadingProgress.findOneAndUpdate(
        { userId: req.user._id, documentId: req.params.documentId },
        {
          scrollPosition: scrollPosition || 0,
          percentComplete: Math.min(100, Math.max(0, percentComplete || 0)),
          lastReadAt: Date.now(),
          timeSpentSeconds: timeSpentSeconds || 0,
          currentPage: currentPage || 1,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, progress });
    }

    const key = `${req.user._id}:${req.params.documentId}`;
    const existing = inMemoryProgress.get(key) || {
      _id: 'prog-' + Math.random().toString(36).substring(2, 9),
      userId: req.user._id,
      documentId: req.params.documentId,
      timeSpentSeconds: 0,
    };
    const progress = {
      ...existing,
      scrollPosition: scrollPosition || 0,
      percentComplete: Math.min(100, Math.max(0, percentComplete || 0)),
      lastReadAt: new Date(),
      timeSpentSeconds: (existing.timeSpentSeconds || 0) + (timeSpentSeconds || 0),
      currentPage: currentPage || 1,
    };
    inMemoryProgress.set(key, progress);
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/progress/:documentId — Reset progress
router.delete('/:documentId', protect, async (req, res, next) => {
  try {
    if (isDbConnected()) {
      await ReadingProgress.findOneAndDelete({
        userId: req.user._id,
        documentId: req.params.documentId,
      });
      return res.json({ success: true, message: 'Progress reset.' });
    }
    const key = `${req.user._id}:${req.params.documentId}`;
    inMemoryProgress.delete(key);
    res.json({ success: true, message: 'Progress reset.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
