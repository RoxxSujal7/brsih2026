const crypto = require('crypto');
const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const userService = require('../services/userService');
const { signToken } = require('../config/jwt');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper to decode Google GIS ID Token payload safely
function parseGoogleIdToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

// Rate limit: max 30 auth requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, password, language, institution, role } = req.body;

      const existing = await userService.findByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = await userService.createUser({
        name,
        email,
        password,
        language: language || 'en',
        institution: institution || '',
        role: role || 'visitor',
      });

      const token = signToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          language: user.language,
          institution: user.institution,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await userService.findByEmail(email, true);
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account deactivated. Contact support.' });
      }

      if (typeof user.updateActivity === 'function') {
        await user.updateActivity();
      }
      const token = signToken(user._id);

      res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          language: user.language,
          institution: user.institution,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/google
router.post('/google', authLimiter, async (req, res, next) => {
  try {
    let { credential, email, name, picture, googleId } = req.body;

    if (credential) {
      const parsed = parseGoogleIdToken(credential);
      if (parsed) {
        email = email || parsed.email;
        name = name || parsed.name;
        picture = picture || parsed.picture;
        googleId = googleId || parsed.sub;
      }
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid Google email is required.' });
    }

    email = email.trim().toLowerCase();
    name = (name || email.split('@')[0]).trim();

    let user = await userService.findByEmail(email);

    if (user) {
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account deactivated. Contact support.' });
      }
      if (picture && !user.avatar) {
        await userService.updateUser(user._id, { avatar: picture });
        user.avatar = picture;
      }
      if (typeof user.updateActivity === 'function') {
        await user.updateActivity();
      }
    } else {
      // Auto-register new Google user with secure random password
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await userService.createUser({
        name,
        email,
        password: randomPassword,
        avatar: picture || '',
        language: 'en',
        role: 'visitor',
        institution: 'Google Account Sign-In',
        authProvider: 'google',
        googleId: googleId || '',
      });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      message: 'Signed in with Google successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
        avatar: user.avatar,
        institution: user.institution,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      language: req.user.language,
      institution: req.user.institution,
      createdAt: req.user.createdAt,
      lastActiveAt: req.user.lastActiveAt,
    },
  });
});

// PATCH /api/auth/profile
router.patch('/profile', protect, async (req, res, next) => {
  try {
    const { name, language, institution } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (language) updates.language = language;
    if (institution !== undefined) updates.institution = institution;

    const user = await userService.updateUser(req.user._id, updates);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
