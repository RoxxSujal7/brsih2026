const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    titleHi: { type: String, default: '' },
    titleMr: { type: String, default: '' },
    type: {
      type: String,
      enum: ['speech', 'documentary', 'interview', 'debate', 'lecture', 'newsreel'],
      required: true,
      index: true,
    },
    url: { type: String, default: '' },      // video/audio URL
    embedUrl: { type: String, default: '' }, // YouTube embed URL
    thumbnail: { type: String, default: '' },
    duration: { type: Number, default: 0 },  // seconds
    year: { type: Number, index: true },
    language: {
      type: [String],
      enum: ['en', 'hi', 'mr'],
      default: ['en'],
    },
    description: { type: String, default: '' },
    transcript: { type: String, default: '' },
    tags: { type: [String] },
    source: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
