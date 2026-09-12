const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const cryptoUtil = require('../utils/cryptoUtil');
const userService = require('../services/userService');
const OtpVerification = require('../models/OtpVerification');
const { signToken } = require('../config/jwt');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Initialize Google OAuth2 Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

/**
 * Cryptographically verify a Google GIS ID Token using Google's public keys
 * @param {string} idToken
 * @returns {Promise<object>} verified token payload
 */
async function verifyGoogleToken(idToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId && process.env.NODE_ENV === 'production') {
    throw new Error('Google Sign-In is not configured on this server (missing GOOGLE_CLIENT_ID).');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: clientId || undefined,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email || !payload.sub) {
    throw new Error('Malformed or incomplete Google token payload.');
  }

  const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
  if (payload.iss && !validIssuers.includes(payload.iss)) {
    throw new Error('Invalid Google token issuer.');
  }

  return payload;
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
    body('phone').optional().trim().matches(/^[0-9+ ]{0,20}$/).withMessage('Invalid phone number format'),
    body('language').optional().isIn(['en', 'hi', 'mr']).withMessage('Language must be en, hi, or mr'),
    body('institution').optional().trim().isLength({ max: 200 }).withMessage('Institution max 200 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, password, phone, language, institution } = req.body;

      const existing = await userService.findByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = await userService.createUser({
        name,
        email,
        phone: phone || '',
        password,
        language: language || 'en',
        institution: institution || '',
        role: 'visitor', // strictly enforce visitor; prevent privilege escalation
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
          phone: user.phone || '',
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
    body('email').trim().notEmpty().withMessage('Email or phone number is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;
      const identifier = (email || '').trim();

      // Check by email or phone number
      let user = null;
      if (identifier.includes('@')) {
        user = await userService.findByEmail(identifier, true);
      } else {
        user = await userService.findByPhone(identifier, true);
      }
      if (!user) {
        user = (await userService.findByEmail(identifier, true)) || (await userService.findByPhone(identifier, true));
      }

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email/phone or password.' });
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
          phone: user.phone || '',
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
    const { credential, email: bodyEmail, name: bodyName, googleId: bodyGoogleId, picture: bodyPicture } = req.body;

    let email, name, picture, googleId;

    if (credential && typeof credential === 'string') {
      try {
        const payload = await verifyGoogleToken(credential);
        email = payload.email.trim().toLowerCase();
        name = (payload.name || email.split('@')[0]).trim();
        picture = payload.picture || '';
        googleId = payload.sub;
      } catch (authErr) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired Google ID token verification failed.',
        });
      }
    } else if (bodyEmail && typeof bodyEmail === 'string' && bodyEmail.includes('@')) {
      // SECURITY GUARD: Unverified raw email login is strictly prohibited in production
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
          success: false,
          message: 'Unverified Google sign-in is disabled in production. A valid Google ID token credential is required.',
        });
      }

      // In non-production, only permit pre-configured safe demo accounts
      const safeDemoEmails = ['researcher@ambedkar-archive.in', 'admin@ambedkar-archive.in', 'visitor@ambedkar-archive.in'];
      const normalizedEmail = bodyEmail.trim().toLowerCase();
      if (!safeDemoEmails.includes(normalizedEmail)) {
        return res.status(403).json({
          success: false,
          message: 'Development demo login is restricted to pre-configured demo test accounts.',
        });
      }

      email = normalizedEmail;
      name = (bodyName || email.split('@')[0]).trim();
      picture = bodyPicture || '';
      googleId = bodyGoogleId || 'g_' + crypto.randomBytes(8).toString('hex');
    } else {
      return res.status(400).json({
        success: false,
        message: 'A valid Google ID token credential is required.',
      });
    }

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

// ── Persistent & In-Memory OTP Store ──────────────────
const otpMemoryStore = new Map();

function generateOTP() {
  return Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
}

function maskTarget(target, type) {
  if (type === 'phone') {
    return target.length > 4 ? `${target.slice(0, 3)}******${target.slice(-3)}` : '******';
  }
  const parts = target.split('@');
  if (parts.length === 2 && parts[0].length > 2) {
    return `${parts[0][0]}***${parts[0].slice(-1)}@${parts[1]}`;
  }
  return '***@***';
}

async function saveOtpRecord(target, otpHash, expiresAt, type) {
  if (isDbConnected()) {
    try {
      await OtpVerification.deleteMany({ target });
      return await OtpVerification.create({
        target,
        otpHash,
        type,
        expiresAt: new Date(expiresAt),
        attempts: 0,
      });
    } catch (e) {
      // Fallback to memory store if DB write fails
    }
  }
  otpMemoryStore.set(target, { otpHash, expiresAt, attempts: 0, type });
}

async function getOtpRecord(target) {
  if (isDbConnected()) {
    try {
      const doc = await OtpVerification.findOne({ target, expiresAt: { $gt: new Date() } });
      if (doc) return doc;
    } catch (e) {
      // Fallback
    }
  }
  const mem = otpMemoryStore.get(target);
  if (mem && mem.expiresAt > Date.now()) {
    return mem;
  }
  return null;
}

async function incrementOtpAttempts(target, record) {
  if (isDbConnected() && record && typeof record.save === 'function') {
    try {
      record.attempts = (record.attempts || 0) + 1;
      return await record.save();
    } catch (e) {}
  }
  if (record) {
    record.attempts = (record.attempts || 0) + 1;
  }
}

async function deleteOtpRecord(target) {
  if (isDbConnected()) {
    try {
      await OtpVerification.deleteMany({ target });
    } catch (e) {}
  }
  otpMemoryStore.delete(target);
}

// POST /api/auth/send-otp
router.post(
  '/send-otp',
  authLimiter,
  [
    body('target').trim().notEmpty().withMessage('Phone number or Email is required.'),
    body('type').isIn(['phone', 'email']).withMessage('Type must be phone or email.'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { target, type } = req.body;

      const cleanTarget = type === 'phone'
        ? target.replace(/[^0-9+]/g, '').trim()
        : target.toLowerCase().trim();

      if (type === 'phone' && cleanTarget.length < 10) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
      }
      if (type === 'email' && !cleanTarget.includes('@')) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
      }

      // Rate-limit re-sending within 60s
      const existing = await getOtpRecord(cleanTarget);
      if (existing) {
        const remainingMs = (existing.expiresAt instanceof Date ? existing.expiresAt.getTime() : existing.expiresAt) - Date.now();
        if (remainingMs > 4 * 60 * 1000) {
          return res.status(429).json({ success: false, message: 'Please wait 60 seconds before requesting another OTP.' });
        }
      }

      const otp = generateOTP();
      const otpHash = cryptoUtil.hashOtp(otp);
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

      await saveOtpRecord(cleanTarget, otpHash, expiresAt, type);

      // Only log OTP to server console in development — never in production logs
      if (process.env.NODE_ENV !== 'production') {
        console.log(`\n======================================================`);
        console.log(`🔐 [AMBEDKAR ARCHIVE SECURE OTP DISPATCH — DEV ONLY]`);
        console.log(`📱 Destination: ${cleanTarget} (${type})`);
        console.log(`🔑 Verification OTP: >>> ${otp} <<<`);
        console.log(`🔒 SHA-256 Digest: ${otpHash.slice(0, 16)}...`);
        console.log(`⏳ Valid for: 5 Minutes`);
        console.log(`======================================================\n`);
      }

      res.json({
        success: true,
        message: `OTP dispatched to ${maskTarget(cleanTarget, type)}. Check your ${type === 'email' ? 'email inbox' : 'mobile device'}.`,
        target: maskTarget(cleanTarget, type),
        expiresIn: 300,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/verify-otp
router.post(
  '/verify-otp',
  authLimiter,
  [
    body('target').trim().notEmpty().withMessage('Target identifier is required.'),
    body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit number.'),
    body('type').isIn(['phone', 'email']).withMessage('Type must be phone or email.'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { target, otp, type, name } = req.body;

      const cleanTarget = type === 'phone'
        ? target.replace(/[^0-9+]/g, '').trim()
        : target.toLowerCase().trim();

      const record = await getOtpRecord(cleanTarget);
      if (!record) {
        return res.status(400).json({ success: false, message: 'No active OTP found. Please request a new code.' });
      }

      const expiryTime = record.expiresAt instanceof Date ? record.expiresAt.getTime() : record.expiresAt;
      if (Date.now() > expiryTime) {
        await deleteOtpRecord(cleanTarget);
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
      }

      await incrementOtpAttempts(cleanTarget, record);

      if ((record.attempts || 0) > 3) {
        await deleteOtpRecord(cleanTarget);
        return res.status(429).json({ success: false, message: 'Too many incorrect attempts. Please request a new OTP.' });
      }

      // Constant-time SHA-256 verification
      const isValidOtp = cryptoUtil.verifyOtp(record.otpHash, otp);

      if (!isValidOtp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP code. Please try again.' });
      }

      // OTP is valid — consume immediately to prevent replay
      await deleteOtpRecord(cleanTarget);

      let user;
      if (type === 'phone') {
        user = await userService.findByPhone(cleanTarget);
        if (!user) {
          const autoPassword = crypto.randomBytes(24).toString('hex');
          const formattedName = name ? name.trim().slice(0, 100) : `Member ${cleanTarget.slice(-4)}`;
          user = await userService.createUser({
            name: formattedName,
            email: `${cleanTarget.replace('+', '')}@phone.ambedkar-archive.in`,
            phone: cleanTarget,
            password: autoPassword,
            role: 'visitor',
            authProvider: 'phone',
          });
        }
      } else {
        user = await userService.findByEmail(cleanTarget);
        if (!user) {
          const autoPassword = crypto.randomBytes(24).toString('hex');
          const formattedName = name ? name.trim().slice(0, 100) : cleanTarget.split('@')[0];
          user = await userService.createUser({
            name: formattedName,
            email: cleanTarget,
            password: autoPassword,
            role: 'visitor',
            authProvider: 'email_otp',
          });
        }
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
        message: 'Verified successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          language: user.language || 'en',
          institution: user.institution || '',
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      role: req.user.role,
      language: req.user.language,
      institution: req.user.institution,
      createdAt: req.user.createdAt,
      lastActiveAt: req.user.lastActiveAt,
    },
  });
});

// PATCH /api/auth/profile
router.patch(
  '/profile',
  protect,
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
    body('language').optional().isIn(['en', 'hi', 'mr']).withMessage('Language must be en, hi, or mr'),
    body('institution').optional().trim().isLength({ max: 200 }).withMessage('Institution max 200 characters'),
    body('phone').optional().trim().matches(/^[0-9+ ]{0,20}$/).withMessage('Invalid phone number format'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, language, institution, phone } = req.body;
      const updates = {};
      if (name) updates.name = name.trim();
      if (language) updates.language = language;
      if (institution !== undefined) updates.institution = institution.trim();
      if (phone) updates.phone = phone.replace(/[^0-9+]/g, '');

      const user = await userService.updateUser(req.user._id, updates);
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
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

module.exports = router;
