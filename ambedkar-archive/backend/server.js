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
const letterRoutes = require('./routes/letters');
const vowRoutes = require('./routes/vows');
const volumeRoutes = require('./routes/volumes');
const chatRoutes = require('./routes/chat');
const threeRoutes = require('./routes/three');


const app = express();

// Connect to MongoDB
connectDB();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://accounts.google.com/gsi/client"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com/gsi/style"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://accounts.google.com", "https://accounts.google.com/gsi/", "https://generativelanguage.googleapis.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  frameguard: { action: 'sameorigin' },
}));

// CORS with strict origin validation
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://ambedkar-digital-archive.onrender.com',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Strict whitelist check
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Development local origins only permitted in non-production
    if (process.env.NODE_ENV !== 'production') {
      try {
        const parsed = new URL(origin);
        if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
          return callback(null, true);
        }
      } catch (e) {}
    }

    return callback(null, false);
  },
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
app.use('/api/letters', letterRoutes);
app.use('/api/vows', vowRoutes);
app.use('/api/volumes', volumeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/three', threeRoutes);


// Serve volume PDFs directly from canonical frontend/pdfs
app.use(['/books', '/pdfs'], express.static(path.join(__dirname, '../frontend/pdfs'), {
  maxAge: '7d',
  setHeaders: (res) => { res.setHeader('Cache-Control', 'public, max-age=604800'); }
}));


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

// Serve frontend static files with optimized Cache-Control headers (Phase 6.1)
app.use(express.static(path.join(__dirname, '../frontend'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      // HTML documents should always re-validate to ensure fresh deployments
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else if (filePath.match(/\.(css|js)$/i)) {
      // Stylesheets and scripts revalidate immediately during development
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else if (filePath.match(/\.(woff2?|ttf|eot|png|jpg|jpeg|gif|svg|ico|webp)$/i)) {
      // Media and fonts cached
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// Fallback for non-API routes to index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const { AppError, NotFoundError } = require('./errors/AppError');

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError('Route', req.originalUrl));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name} (${err.code || 500}): ${err.message}`);

  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 422 : err.code === 11000 ? 409 : err.name === 'CastError' ? 400 : 500);
  const code = err.code || (err.name === 'ValidationError' ? 'VALIDATION_ERROR' : err.name === 'CastError' ? 'INVALID_ID' : 'INTERNAL_ERROR');

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message || 'Internal server error',
      details: err.details || null,
      timestamp: err.timestamp || new Date().toISOString(),
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Ambedkar Digital Heritage Archive — API ready`);
  console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
