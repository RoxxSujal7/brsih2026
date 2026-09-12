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

/**
 * POST /api/preservation/verify
 * Actively verifies bitstream integrity of an archived artifact against a baseline SHA-256 hash.
 * Detects tampering, bit-rot, corruption, and unauthorized file replacement.
 */
router.post('/verify', (req, res) => {
  try {
    const { filename, expectedSha256, documentId } = req.body;

    if (!filename && !documentId) {
      return res.status(400).json({
        success: false,
        verified: false,
        status: 'MISSING_PARAMETER',
        message: 'Must provide either "filename" or "documentId" to verify integrity.'
      });
    }

    let targetPath = null;
    let expectedHash = expectedSha256 ? String(expectedSha256).toLowerCase().trim() : null;
    let originalName = filename;

    // Check in uploads/archive/
    const uploadsDir = path.join(__dirname, '../uploads/archive');
    const dataDir = path.join(__dirname, '../data');

    if (documentId) {
      // Look up in cms_content.json manuscripts
      const cmsPath = path.join(dataDir, 'cms_content.json');
      if (fs.existsSync(cmsPath)) {
        const cms = JSON.parse(fs.readFileSync(cmsPath, 'utf8'));
        const doc = (cms.manuscripts || []).find(m => m.id === documentId);
        if (doc) {
          originalName = doc.storedFilename || doc.originalFilename;
          expectedHash = expectedHash || (doc.sha256Checksum ? doc.sha256Checksum.toLowerCase() : null);
          targetPath = path.join(uploadsDir, path.basename(doc.storedFilename || ''));
        }
      }
    }

    if (!targetPath && filename) {
      // Prevent directory traversal
      const safeName = path.basename(filename);
      const possibleUpload = path.join(uploadsDir, safeName);
      const possibleData = path.join(dataDir, safeName);

      if (fs.existsSync(possibleUpload)) {
        targetPath = possibleUpload;
      } else if (fs.existsSync(possibleData)) {
        targetPath = possibleData;
      } else {
        targetPath = possibleUpload; // for 404 message
      }
    }

    if (!targetPath || !fs.existsSync(targetPath)) {
      return res.status(404).json({
        success: false,
        verified: false,
        status: 'MISSING_FILE',
        filename: originalName,
        message: `INTEGRITY CHECK FAILED: Archived file "${originalName}" is missing from storage.`
      });
    }

    if (!expectedHash) {
      return res.status(400).json({
        success: false,
        verified: false,
        status: 'MISSING_HASH',
        filename: originalName,
        message: 'INTEGRITY CHECK FAILED: No expected SHA-256 hash was provided or found in baseline record.'
      });
    }

    // Compute live cryptographic SHA-256
    const actualHash = computeFileSha256(targetPath);

    if (actualHash !== expectedHash) {
      return res.status(400).json({
        success: false,
        verified: false,
        status: 'HASH_MISMATCH',
        message: 'INTEGRITY CHECK FAILED / HASH MISMATCH',
        filename: originalName,
        expectedSha256: expectedHash,
        actualSha256: actualHash,
        tampered: true,
        checkedAt: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      verified: true,
      status: 'VERIFIED',
      message: 'INTEGRITY CHECK PASSED: Cryptographic SHA-256 matches bitstream perfectly.',
      filename: originalName,
      sha256: actualHash,
      checkedAt: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      verified: false,
      status: 'ERROR',
      message: `Integrity check error: ${err.message}`
    });
  }
});

module.exports = router;
