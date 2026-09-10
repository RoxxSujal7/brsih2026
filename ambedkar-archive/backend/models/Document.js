const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      index: true,
    },
    titleHi: { type: String, default: '' }, // Hindi title
    titleMr: { type: String, default: '' }, // Marathi title
    category: {
      type: String,
      enum: ['book', 'speech', 'debate', 'manuscript', 'report', 'article', 'letter'],
      required: true,
      index: true,
    },
    language: {
      type: [String],
      enum: ['en', 'hi', 'mr'],
      default: ['en'],
    },
    year: { type: Number, index: true },
    volume: { type: String, default: '' },     // e.g. "Volume 1"
    part: { type: String, default: '' },        // e.g. "Part II"
    summary: {
      type: String,
      required: [true, 'Summary is required'],
    },
    summaryHi: { type: String, default: '' },
    summaryMr: { type: String, default: '' },
    fullText: { type: String, default: '' },    // Full text — restricted to researchers
    tags: { type: [String], index: true },
    source: { type: String, default: 'BAWS (Dr. Ambedkar Foundation)' },
    publisher: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    downloadUrl: { type: String, default: '' },
    pageCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },  // summary public; fullText gated
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    // Full-text search index metadata
    searchKeywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Text index for full-text search
documentSchema.index({ title: 'text', summary: 'text', tags: 'text', searchKeywords: 'text' });

// Increment view count
documentSchema.methods.incrementViews = function () {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Document', documentSchema);
