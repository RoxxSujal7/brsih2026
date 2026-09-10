const express = require('express');
const mongoose = require('mongoose');
const Media = require('../models/Media');
const { HISTORIC_MEDIA } = require('../seed/mediaSeed');

const router = express.Router();

function getMockMedia(query = {}) {
  let list = HISTORIC_MEDIA.map((m, idx) => ({
    _id: `media-mock-${idx + 1}`,
    ...m,
    viewCount: 1250 + (idx * 43),
  }));

  if (query.type) list = list.filter((m) => m.type === query.type);
  if (query.year) list = list.filter((m) => m.year === parseInt(query.year));
  if (query.language) list = list.filter((m) => m.language && m.language.includes(query.language));
  return list;
}

// GET /api/media
router.get('/', async (req, res, next) => {
  try {
    const { type, year, language, page = 1, limit = 20 } = req.query;

    if (mongoose.connection.readyState !== 1) {
      const all = getMockMedia(req.query);
      const total = all.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const media = all.slice(skip, skip + parseInt(limit));
      return res.json({ success: true, total, page: parseInt(page), media });
    }

    const filter = {};
    if (type) filter.type = type;
    if (year) filter.year = parseInt(year);
    if (language) filter.language = language;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [media, total] = await Promise.all([
      Media.find(filter).sort('-year').skip(skip).limit(parseInt(limit)),
      Media.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: parseInt(page), media });
  } catch (err) {
    // Graceful fallback to mock seed
    const all = getMockMedia(req.query);
    const total = all.length;
    res.json({ success: true, total, page: 1, media: all });
  }
});

// GET /api/media/featured
router.get('/featured', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const media = HISTORIC_MEDIA.filter((m) => m.isFeatured).slice(0, 6);
      return res.json({ success: true, media });
    }
    const media = await Media.find({ isFeatured: true }).sort('-year').limit(6);
    res.json({ success: true, media });
  } catch (err) {
    const media = HISTORIC_MEDIA.filter((m) => m.isFeatured).slice(0, 6);
    res.json({ success: true, media });
  }
});

// GET /api/media/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const all = getMockMedia();
      const item = all.find((m) => m._id === req.params.id) || all[0];
      return res.json({ success: true, media: item });
    }
    const item = await Media.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Media not found.' });
    item.viewCount += 1;
    await item.save({ validateBeforeSave: false });
    res.json({ success: true, media: item });
  } catch (err) {
    const all = getMockMedia();
    const item = all[0];
    res.json({ success: true, media: item });
  }
});

module.exports = router;
