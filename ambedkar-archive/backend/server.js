require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const progressRoutes = require('./routes/progress');
const bookmarkRoutes = require('./routes/bookmarks');
const mediaRoutes = require('./routes/media');
const searchRoutes = require('./routes/search');
const ocrRoutes = require('./routes/ocr');

const app = express();

// Connect to MongoDB
connectDB();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
  frameguard: { action: 'sameorigin' }
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Global rate limiter (generous — tighter limits per sensitive route)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ocr', ocrRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    message: 'Ambedkar Digital Heritage Archive API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback for non-API routes to index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const { sendError } = require('./utils/responseFormatter');
const { AppError, NotFoundError } = require('./errors/AppError');

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError('Route', req.originalUrl));
});

// Global ECC error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name} (${err.code || 500}): ${err.message}`);
  
  if (err instanceof AppError) {
    return sendError(res, err);
  }

  // Handle Mongoose specific errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, new AppError('Validation error', 'VALIDATION_ERROR', 422, messages));
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    return sendError(res, new AppError(`${field} already exists.`, 'DUPLICATE_KEY', 409));
  }
  if (err.name === 'CastError') {
    return sendError(res, new AppError('Invalid ID format.', 'INVALID_ID', 400));
  }

  return sendError(res, new AppError(err.message || 'Internal server error', 'INTERNAL_ERROR', err.statusCode || 500));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Ambedkar Digital Heritage Archive — API ready`);
  console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
