const express = require('express');
const ReadingProgress = require('../models/ReadingProgress');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/progress — Get all user's reading progress (dashboard)
router.get('/', protect, async (req, res, next) => {
  try {
    const progress = await ReadingProgress.find({ userId: req.user._id })
      .populate('documentId', 'title category year imageUrl summary')
      .sort('-lastReadAt')
      .limit(20);
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
});

// GET /api/progress/:documentId — Get progress for one document
router.get('/:documentId', protect, async (req, res, next) => {
  try {
    const progress = await ReadingProgress.findOne({
      userId: req.user._id,
      documentId: req.params.documentId,
    });
    res.json({ success: true, progress: progress || null });
  } catch (err) {
    next(err);
  }
});

// POST /api/progress/:documentId — Save/update reading progress
router.post('/:documentId', protect, async (req, res, next) => {
  try {
    const { scrollPosition, percentComplete, timeSpentSeconds, currentPage } = req.body;

    const progress = await ReadingProgress.findOneAndUpdate(
      { userId: req.user._id, documentId: req.params.documentId },
      {
        scrollPosition: scrollPosition || 0,
        percentComplete: Math.min(100, Math.max(0, percentComplete || 0)),
        lastReadAt: Date.now(),
        timeSpentSeconds: timeSpentSeconds || 0,
        currentPage: currentPage || 1,
        completed: (percentComplete || 0) >= 95,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/progress/:documentId — Reset progress
router.delete('/:documentId', protect, async (req, res, next) => {
  try {
    await ReadingProgress.findOneAndDelete({
      userId: req.user._id,
      documentId: req.params.documentId,
    });
    res.json({ success: true, message: 'Progress reset.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
