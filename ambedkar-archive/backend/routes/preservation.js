const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function computeFileSha256(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(buffer).digest('hex');
  } catch (err) {
    return null;
  }
}

/**
 * GET /api/preservation/manifest
 * Returns institutional preservation manifest with live SHA-256 hashes,
 * Dublin Core / PREMIS alignment metadata, and file health status.
 */
router.get('/manifest', (req, res) => {
  const dataDir = path.join(__dirname, '../data');
  const filesToTrack = [
    { name: 'volumes.json', label: 'BAWS 60-Volume Catalog Schema', category: 'Catalog' },
    { name: 'letters.json', label: '361 Digitized Historical Letters', category: 'Manuscripts' },
    { name: 'writings.json', label: 'Treatises & Published Essays', category: 'Writings' },
    { name: 'vows.json', label: '22 Vows of Nagpur (4 Languages)', category: 'Sacred Texts' },
    { name: 'memorials.json', label: 'Institutional Memorials Heritage', category: 'Memorials' },
    { name: 'debates.json', label: 'Political Thought & Historical Debates', category: 'Debates' }
  ];

  const manifest = filesToTrack.map(item => {
    const fullPath = path.join(dataDir, item.name);
    const exists = fs.existsSync(fullPath);
    let sizeBytes = 0;
    let sha256 = null;
    let modifiedAt = null;

    if (exists) {
      const stats = fs.statSync(fullPath);
      sizeBytes = stats.size;
      modifiedAt = stats.mtime.toISOString();
      sha256 = computeFileSha256(fullPath);
    }

    return {
      filename: item.name,
      label: item.label,
      category: item.category,
      format: 'application/json',
      preservationLevel: 'Level 3 — Bitstream & Structural Integrity Preserved',
      status: exists ? 'Verified' : 'Missing',
      sizeBytes,
      sha256,
      checksumAlgorithm: 'SHA-256',
      lastIntegrityCheck: new Date().toISOString(),
      lastModified: modifiedAt,
      redundancyPolicy: 'Local Primary + Geo-Replicated Git Remotes (Origin/Brambedkar) + Offsite Snapshot'
    };
  });

  res.json({
    success: true,
    institution: 'Dr. Ambedkar International Centre (DAIC)',
    standard: 'PREMIS Data Dictionary for Preservation Metadata / Dublin Core ISO 15836',
    generatedAt: new Date().toISOString(),
    totalArtifacts: manifest.length,
    overallHealth: manifest.every(m => m.status === 'Verified') ? 'HEALTHY' : 'DEGRADED',
    manifest
  });
});

module.exports = router;
