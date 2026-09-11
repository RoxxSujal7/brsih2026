const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');

const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/auth');

const router = express.Router();
const inMemoryBookmarks = new Map();

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// GET /api/bookmarks — All user bookmarks
router.get('/', protect, async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const bookmarks = await Bookmark.find({ userId: req.user._id })
        .populate('documentId', 'title category year imageUrl')
        .sort('-createdAt');
      return res.json({ success: true, bookmarks });
    }
    const userBookmarks = Array.from(inMemoryBookmarks.values())
      .filter((b) => String(b.userId) === String(req.user._id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, bookmarks: userBookmarks });
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

    if (isDbConnected()) {
      const bookmark = await Bookmark.findOneAndUpdate(
        { userId: req.user._id, documentId },
        { note, highlightText, scrollPosition, color },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(201).json({ success: true, bookmark });
    }

    const key = `${req.user._id}:${documentId}`;
    const bookmark = {
      _id: 'bm-' + crypto.randomBytes(8).toString('hex'),
      userId: req.user._id,
      documentId,
      note: note || '',
      highlightText: highlightText || '',
      scrollPosition: scrollPosition || 0,
      color: color || '#d4af37',
      createdAt: new Date(),
    };
    inMemoryBookmarks.set(key, bookmark);
    res.status(201).json({ success: true, bookmark });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookmarks/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const bookmark = await Bookmark.findOne({ _id: req.params.id, userId: req.user._id });
      if (!bookmark) {
        return res.status(404).json({ success: false, message: 'Bookmark not found.' });
      }
      await bookmark.deleteOne();
      return res.json({ success: true, message: 'Bookmark removed.' });
    }

    let foundKey = null;
    for (const [k, b] of inMemoryBookmarks.entries()) {
      if ((b._id === req.params.id || b.documentId === req.params.id) && String(b.userId) === String(req.user._id)) {
        foundKey = k;
        break;
      }
    }
    if (foundKey) {
      inMemoryBookmarks.delete(foundKey);
      return res.json({ success: true, message: 'Bookmark removed.' });
    }
    res.json({ success: true, message: 'Bookmark removed.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
