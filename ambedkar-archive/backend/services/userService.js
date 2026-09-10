const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');

const inMemoryUsers = new Map();

// Seed initial in-memory accounts for offline / development resilience
(async () => {
  try {
    const hashResearcher = await bcrypt.hash('Research@1234', 10);
    const hashAdmin = await bcrypt.hash('Admin@1234', 10);

    inMemoryUsers.set('researcher@ambedkar-archive.in', {
      _id: 'mock-user-researcher-001',
      name: 'Archival Researcher',
      email: 'researcher@ambedkar-archive.in',
      password: hashResearcher,
      role: 'researcher',
      language: 'en',
      institution: 'Ambedkar Heritage Foundation',
      avatar: '',
      isActive: true,
      lastActiveAt: new Date(),
      createdAt: new Date(),
    });

    inMemoryUsers.set('admin@ambedkar-archive.in', {
      _id: 'mock-user-admin-002',
      name: 'Archive Administrator',
      email: 'admin@ambedkar-archive.in',
      password: hashAdmin,
      role: 'admin',
      language: 'en',
      institution: 'National Archives',
      avatar: '',
      isActive: true,
      lastActiveAt: new Date(),
      createdAt: new Date(),
    });
  } catch (e) {
    console.error('Error initializing demo in-memory users:', e);
  }
})();

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

async function findByEmail(email, includePassword = false) {
  const normalized = (email || '').toLowerCase().trim();
  if (isDbConnected()) {
    try {
      const q = User.findOne({ email: normalized });
      if (includePassword) q.select('+password');
      const doc = await q.exec();
      if (doc) return doc;
    } catch (e) {
      // fallback to memory
    }
  }

  const memUser = inMemoryUsers.get(normalized);
  if (!memUser) return null;

  return {
    ...memUser,
    comparePassword: async function (candidate) {
      return await bcrypt.compare(candidate, memUser.password);
    },
    updateActivity: async function () {
      memUser.lastActiveAt = new Date();
      return true;
    },
  };
}

async function findById(id) {
  if (isDbConnected()) {
    try {
      const doc = await User.findById(id).select('-password');
      if (doc) return doc;
    } catch (e) {
      // fallback to memory
    }
  }

  for (const u of inMemoryUsers.values()) {
    if (u._id === id || String(u._id) === String(id)) {
      return u;
    }
  }
  return null;
}

async function createUser({ name, email, password, role = 'visitor', language = 'en', institution = '', avatar = '', authProvider = 'local', googleId = '' }) {
  const normalized = (email || '').toLowerCase().trim();

  if (isDbConnected()) {
    try {
      return await User.create({
        name,
        email: normalized,
        password,
        role,
        language,
        institution,
        avatar,
        authProvider,
        googleId,
      });
    } catch (e) {
      // fallback to memory
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = 'user-' + crypto.randomBytes(8).toString('hex');
  const user = {
    _id: id,
    name,
    email: normalized,
    password: hashedPassword,
    role,
    language,
    institution,
    avatar,
    authProvider,
    googleId,
    isActive: true,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    comparePassword: async function (candidate) {
      return await bcrypt.compare(candidate, hashedPassword);
    },
    updateActivity: async function () {
      user.lastActiveAt = new Date();
      return true;
    },
  };

  inMemoryUsers.set(normalized, user);
  return user;
}

async function updateUser(id, updates) {
  if (isDbConnected()) {
    try {
      return await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    } catch (e) {
      // fallback
    }
  }

  for (const u of inMemoryUsers.values()) {
    if (u._id === id || String(u._id) === String(id)) {
      Object.assign(u, updates);
      return u;
    }
  }
  return null;
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateUser,
  isDbConnected,
};
