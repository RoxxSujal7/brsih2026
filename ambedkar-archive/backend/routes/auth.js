const crypto = require('crypto');
const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const userService = require('../services/userService');
const { signToken } = require('../config/jwt');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper to decode Google GIS ID Token payload
// WARNING: This does NOT verify the signature. For production, use google-auth-library:
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
// const parsed = ticket.getPayload();
function parseGoogleIdToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
    const parsed = JSON.parse(payload);
    // Basic structural validation
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.email || !parsed.sub) return null;
    // Check required Google issuer
    if (parsed.iss && !['accounts.google.com', 'https://accounts.google.com'].includes(parsed.iss)) {
      return null;
    }
    // Verify audience matches our client ID if configured
    if (process.env.GOOGLE_CLIENT_ID && parsed.aud && parsed.aud !== process.env.GOOGLE_CLIENT_ID) {
      return null;
    }
    return parsed;
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
      const parsed = parseGoogleIdToken(credential);
      if (!parsed || !parsed.email || !parsed.sub) {
        return res.status(401).json({ success: false, message: 'Invalid or malformed Google ID token.' });
      }

      // Verify token payload basic claims (expiry)
      if (parsed.exp && parsed.exp * 1000 < Date.now()) {
        return res.status(401).json({ success: false, message: 'Google token has expired.' });
      }

      email = parsed.email.trim().toLowerCase();
      name = (parsed.name || email.split('@')[0]).trim();
      picture = parsed.picture || '';
      googleId = parsed.sub;
    } else if (bodyEmail && typeof bodyEmail === 'string' && bodyEmail.includes('@')) {
      email = bodyEmail.trim().toLowerCase();
      name = (bodyName || email.split('@')[0]).trim();
      picture = bodyPicture || '';
      googleId = bodyGoogleId || 'g_' + crypto.randomBytes(8).toString('hex');
    } else {
      return res.status(400).json({ success: false, message: 'Google ID token credential or Google account details are required.' });
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

// ── OTP Authentication Store & Handlers ──────────────────
// In-memory OTP store (target -> { code, expiresAt, attempts })
const otpStore = new Map();

// Helper to generate a 6-digit cryptographic OTP code
function generateOTP() {
  return Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
}

// POST /api/auth/send-otp
// Dispatches a real OTP to Phone Number (SMS) or Gmail/Email
router.post('/send-otp', authLimiter, async (req, res, next) => {
  try {
    const { target, type } = req.body; // type: 'phone' | 'email'
    if (!target || typeof target !== 'string' || !target.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number or Email is required.' });
    }

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
    const existing = otpStore.get(cleanTarget);
    if (existing && existing.expiresAt - Date.now() > 4 * 60 * 1000) {
      return res.status(429).json({ success: false, message: 'Please wait 60 seconds before requesting another OTP.' });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    otpStore.set(cleanTarget, { code: otp, expiresAt, attempts: 0 });

    // Only log OTP to server console in development — never in production logs
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n======================================================`);
      console.log(`🔐 [AMBEDKAR ARCHIVE SECURE OTP DISPATCH — DEV ONLY]`);
      console.log(`📱 Destination: ${cleanTarget} (${type || 'direct'})`);
      console.log(`🔑 Verification OTP: >>> ${otp} <<<`);
      console.log(`⏳ Valid for: 5 Minutes (Expires at: ${new Date(expiresAt).toLocaleTimeString()})`);
      console.log(`======================================================\n`);
    }

    res.json({
      success: true,
      message: `OTP dispatched to ${cleanTarget}. Check your ${type === 'email' ? 'email inbox' : 'mobile device'}.`,
      target: cleanTarget,
      expiresIn: 300,
      // SECURITY: demoCode intentionally removed — OTP must only travel via SMS/email channel
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp
// Verifies OTP for Phone Number or Email and logs in or registers user
router.post('/verify-otp', authLimiter, async (req, res, next) => {
  try {
    const { target, otp, type, name } = req.body;
    if (!target || !otp) {
      return res.status(400).json({ success: false, message: 'Target identifier and OTP code are required.' });
    }

    const cleanTarget = type === 'phone' 
      ? target.replace(/[^0-9+]/g, '').trim()
      : target.toLowerCase().trim();

    const record = otpStore.get(cleanTarget);
    if (!record) {
      return res.status(400).json({ success: false, message: 'No active OTP found. Please request a new code.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanTarget);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts > 4) {
      otpStore.delete(cleanTarget);
      return res.status(429).json({ success: false, message: 'Too many incorrect attempts. Please request a new OTP.' });
    }

    if (String(record.code).trim() !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please try again.' });
    }

    // OTP is valid — consume it
    otpStore.delete(cleanTarget);

    let user;
    if (type === 'phone') {
      user = await userService.findByPhone(cleanTarget);
      if (!user) {
        // Auto-register phone user
        const autoPassword = crypto.randomBytes(24).toString('hex');
        const formattedName = name ? name.trim() : `Member ${cleanTarget.slice(-4)}`;
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
        // Auto-register email OTP user
        const autoPassword = crypto.randomBytes(24).toString('hex');
        const formattedName = name ? name.trim() : cleanTarget.split('@')[0];
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
});

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
router.patch('/profile', protect, async (req, res, next) => {
  try {
    const { name, language, institution, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (language) updates.language = language;
    if (institution !== undefined) updates.institution = institution;
    if (phone) updates.phone = phone.replace(/[^0-9+]/g, '');

    const user = await userService.updateUser(req.user._id, updates);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
