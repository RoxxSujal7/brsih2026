const mongoose = require('mongoose');

const spatialAnnotationSchema = new mongoose.Schema(
  {
    exhibitId: {
      type: String,
      required: true,
      index: true,
      enum: ['constitution', 'bust', 'mahad', 'quill', 'global'],
      default: 'constitution'
    },
    position: {
      x: { type: Number, required: true, default: 0 },
      y: { type: Number, required: true, default: 0 },
      z: { type: Number, required: true, default: 0 }
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: 'Anonymous Scholar'
    },
    title: {
      type: String,
      trim: true,
      maxlength: 140,
      default: 'Historical Reflection'
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500
    },
    category: {
      type: String,
      enum: ['historical_fact', 'constitutional_quote', 'scholarly_note', 'visitor_reflection'],
      default: 'visitor_reflection'
    },
    likes: {
      type: Number,
      default: 0
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

spatialAnnotationSchema.index({ exhibitId: 1, createdAt: -1 });

module.exports = mongoose.model('SpatialAnnotation', spatialAnnotationSchema);
