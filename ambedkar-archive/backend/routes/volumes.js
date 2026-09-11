const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const volumesLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const volumesPath = path.join(__dirname, '../data/volumes.json');
const writingsPath = path.join(__dirname, '../data/writings.json');
const booksDir = path.join(__dirname, '../../frontend/pdfs');

// Load once at boot instead of per-request
let volumesCache = [];
let writingsCache = [];
try {
  if (fs.existsSync(volumesPath)) volumesCache = JSON.parse(fs.readFileSync(volumesPath, 'utf8'));
  if (fs.existsSync(writingsPath)) writingsCache = JSON.parse(fs.readFileSync(writingsPath, 'utf8'));
} catch (e) {
  console.error('Error loading volumes or writings data cache:', e);
}

// GET /api/volumes — Complete BAWS 20 Volumes manifest
router.get('/', volumesLimiter, (req, res) => {
  const volumesWithStatus = volumesCache.map((v) => {
    const localFile = path.join(booksDir, v.file);
    const isDownloadedLocally = fs.existsSync(localFile) && fs.statSync(localFile).size > 500000;
    const localSizeMb = isDownloadedLocally ? (fs.statSync(localFile).size / 1024 / 1024).toFixed(2) : null;
    const volWritings = writingsCache.filter((w) => String(w.Volume) === String(v.volume) || w.Volume === v.code);

    return {
      ...v,
      isDownloadedLocally,
      localSizeMb,
      localDownloadUrl: `/api/volumes/${v.code}/download`,
      writingsCount: volWritings.length,
    };
  });

  res.json({
    success: true,
    totalVolumes: volumesWithStatus.length,
    volumes: volumesWithStatus,
  });
});

// GET /api/volumes/writings — 116 curated treatises and writings
router.get('/writings', volumesLimiter, (req, res) => {
  const { q = '', volume = '' } = req.query;

  if (q.length > 200) {
    return res.status(400).json({ success: false, message: 'Search query too long. Maximum 200 characters.' });
  }

  let filtered = writingsCache;
  if (q.trim()) {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter((w) => (w.Label || '').toLowerCase().includes(term));
  }
  if (volume.trim()) {
    filtered = filtered.filter((w) => String(w.Volume) === volume.trim() || w.Volume === `Volume_${volume.trim()}`);
  }

  res.json({
    success: true,
    total: filtered.length,
    writings: filtered,
  });
});

// GET /api/volumes/:code/download — Download or stream PDF
router.get('/:code/download', (req, res) => {
  const { code } = req.params;
  const vol = volumesCache.find((v) => v.code === code || v.file.replace('.pdf', '') === code);

  if (!vol) {
    return res.status(404).json({ success: false, message: 'Volume not found.' });
  }

  const localFile = path.join(booksDir, vol.file);
  if (fs.existsSync(localFile) && fs.statSync(localFile).size > 500000) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${vol.file}"`);
    return res.sendFile(localFile);
  }

  res.redirect(vol.remoteUrl);
});

module.exports = router;
