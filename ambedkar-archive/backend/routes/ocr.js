const express = require('express');
const router = express.Router();

/**
 * POST /api/ocr/scan
 * Process manuscript image for AI OCR digitizing
 */
router.post('/scan', (req, res) => {
  // Mock AI OCR response for manuscript files
  const confidence = (96.5 + Math.random() * 3).toFixed(1) + '%';
  res.json({
    success: true,
    message: 'Manuscript digitized successfully via AI OCR Engine.',
    data: {
      confidence,
      ocrText: `[AI Digitized Extracted Text]
"State shall not deny equality before law or equal protection of laws."
Transcribed from archival scan using Tesseract-Ambedkar OCR Engine.`,
      rawText: `Draft Article 14 Handwritten Scan
Transcribed with high confidence.`,
      entities: [
        { name: 'Article 14', type: 'Constitutional Provision' },
        { name: 'Dr. B. R. Ambedkar', type: 'Author' }
      ]
    }
  });
});

module.exports = router;
