const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');

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
router.post(
  '/',
  protect,
  [
    body('documentId').trim().notEmpty().isLength({ max: 100 }).withMessage('documentId must be a non-empty string under 100 characters.'),
    body('note').optional().isString().isLength({ max: 1000 }).withMessage('Note must be 1000 characters or fewer.'),
    body('highlightText').optional().isString().isLength({ max: 2000 }).withMessage('Highlight text must be 2000 characters or fewer.'),
    body('scrollPosition').optional().isNumeric().withMessage('scrollPosition must be a number.'),
    body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid 6-character hex code (e.g. #d4af37).'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { documentId, note, highlightText, scrollPosition, color } = req.body;

      // Sanitize text inputs
      const safeNote = (note || '').slice(0, 1000);
      const safeHighlight = (highlightText || '').slice(0, 2000);
      const safeScroll = Math.max(0, parseInt(scrollPosition, 10) || 0);
      const safeColor = color || '#d4af37';

      if (isDbConnected()) {
        const bookmark = await Bookmark.findOneAndUpdate(
          { userId: req.user._id, documentId: documentId.trim() },
          { note: safeNote, highlightText: safeHighlight, scrollPosition: safeScroll, color: safeColor },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return res.status(201).json({ success: true, bookmark });
      }

      const key = `${req.user._id}:${documentId.trim()}`;
      const bookmark = {
        _id: 'bm-' + crypto.randomBytes(8).toString('hex'),
        userId: req.user._id,
        documentId: documentId.trim(),
        note: safeNote,
        highlightText: safeHighlight,
        scrollPosition: safeScroll,
        color: safeColor,
        createdAt: new Date(),
      };
      inMemoryBookmarks.set(key, bookmark);
      res.status(201).json({ success: true, bookmark });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/bookmarks/:id
router.delete(
  '/:id',
  protect,
  [
    param('id').trim().isLength({ min: 1, max: 64 }).matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid bookmark identifier format.'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const targetId = req.params.id.trim();

      if (isDbConnected()) {
        // Prevent Mongoose CastError if format is not an ObjectId
        const isObjectId = mongoose.Types.ObjectId.isValid(targetId);
        const query = isObjectId
          ? { _id: targetId, userId: req.user._id }
          : { documentId: targetId, userId: req.user._id };

        const bookmark = await Bookmark.findOne(query);
        if (!bookmark) {
          return res.status(404).json({ success: false, message: 'Bookmark not found or does not belong to your account.' });
        }
        await bookmark.deleteOne();
        return res.json({ success: true, message: 'Bookmark removed.' });
      }

      let foundKey = null;
      for (const [k, b] of inMemoryBookmarks.entries()) {
        if ((b._id === targetId || b.documentId === targetId) && String(b.userId) === String(req.user._id)) {
          foundKey = k;
          break;
        }
      }
      if (foundKey) {
        inMemoryBookmarks.delete(foundKey);
        return res.json({ success: true, message: 'Bookmark removed.' });
      }
      res.status(404).json({ success: false, message: 'Bookmark not found.' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
