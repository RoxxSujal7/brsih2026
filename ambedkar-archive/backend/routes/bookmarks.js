const express = require('express');
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookmarks — All user bookmarks
router.get('/', protect, async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate('documentId', 'title category year imageUrl')
      .sort('-createdAt');
    res.json({ success: true, bookmarks });
  } catch (err) {
    next(err);
  }
});

// POST /api/bookmarks — Add or update a bookmark
router.post('/', protect, async (req, res, next) => {
  try {
    const { documentId, note, highlightText, scrollPosition, color } = req.body;
    if (!documentId) {
      return res.status(400).json({ success: false, message: 'documentId is required.' });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId: req.user._id, documentId },
      { note, highlightText, scrollPosition, color },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, bookmark });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookmarks/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found.' });
    }
    await bookmark.deleteOne();
    res.json({ success: true, message: 'Bookmark removed.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
