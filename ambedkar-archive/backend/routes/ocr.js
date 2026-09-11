const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limit: max 20 OCR requests per 5 minutes per IP
const ocrLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'OCR rate limit exceeded. Please wait a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/ocr/scan
 * Process manuscript image for OCR digitizing.
 *
 * CURRENT STATUS: UI DEMONSTRATION MODE
 * This endpoint currently returns a structured demo response to showcase
 * the OCR interface. To enable real OCR, integrate one of:
 *   - Tesseract.js (free, open-source): https://github.com/naptha/tesseract.js
 *   - Google Cloud Vision API: https://cloud.google.com/vision
 *   - AWS Textract: https://aws.amazon.com/textract/
 *
 * Real OCR integration steps:
 *   1. npm install tesseract.js
 *   2. Accept file upload via multer middleware
 *   3. Pass image buffer to Tesseract.recognize()
 *   4. Return actual extracted text with real confidence scores
 */
router.post('/scan', ocrLimiter, (req, res) => {
  // DEMO MODE — returns structured placeholder to showcase UI workflow
  // NOT real OCR output. Do not use for historical transcription.
  res.json({
    success: true,
    demo: true,
    message: 'OCR interface demonstration — real OCR integration pending.',
    notice: 'This is a UI demonstration. Actual manuscript text extraction requires OCR service integration (Tesseract.js / Google Vision API). The text shown below is sample output only.',
    data: {
      confidence: 'N/A (Demo Mode)',
      ocrText: '[DEMO — Not Real OCR Output]\n\nThis area will display the actual extracted text from your manuscript scan once OCR is integrated.\n\nTo enable real OCR:\n1. Install Tesseract.js: npm install tesseract.js\n2. Or configure Google Cloud Vision API key\n3. Contact the development team to complete this integration.',
      rawText: '[DEMO MODE — Awaiting Real OCR Integration]',
      entities: [
        { name: 'OCR Integration Required', type: 'System Notice' }
      ],
      disclaimer: 'Historical manuscript transcription requires verified OCR output. This demo does not produce actual text extraction from uploaded images.'
    }
  });
});

module.exports = router;
