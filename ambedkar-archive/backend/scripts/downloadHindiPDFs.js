/**
 * downloadHindiPDFs.js — Automated downloader for Official MEA Hindi BAWS Volumes
 * Source: https://www.mea.gov.in/books-writings-of-ambedkar.htm
 * Target: frontend/pdfs/VolumeH1.pdf through VolumeH40.pdf
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '../../frontend/pdfs');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// All 40 Hindi volumes available on MEA portal
const TOTAL_VOLUMES = 40;
const volumes = Array.from({ length: TOTAL_VOLUMES }, (_, i) => ({
  volumeNo: i + 1,
  filename: `VolumeH${i + 1}.pdf`,
  url: `https://www.mea.gov.in/images/CPV/VolumeH${i + 1}.pdf`
}));

console.log('═══════════════════════════════════════════════════════════════');
console.log('📚 MEA Official Hindi BAWS Volumes Downloader (Method 3)');
console.log(`📁 Destination: ${targetDir}`);
console.log(`📦 Target: 40 Volumes (VolumeH1.pdf to VolumeH40.pdf)`);
console.log('═══════════════════════════════════════════════════════════════\n');

const downloadVolume = (item) => {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, item.filename);

    // If file exists and is larger than 1MB, skip
    if (fs.existsSync(dest)) {
      const stats = fs.statSync(dest);
      if (stats.size > 1024 * 1024) {
        console.log(`⏩ [${item.volumeNo}/${TOTAL_VOLUMES}] ${item.filename} already exists (${(stats.size / 1024 / 1024).toFixed(2)} MB). Skipping.`);
        return resolve({ success: true, skipped: true, filename: item.filename });
      }
    }

    const tempDest = dest + '.tmp';
    const file = fs.createWriteStream(tempDest);

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/pdf,*/*',
        'Referer': 'https://www.mea.gov.in/books-writings-of-ambedkar.htm'
      }
    };

    console.log(`⏬ [${item.volumeNo}/${TOTAL_VOLUMES}] Starting download: ${item.filename}...`);

    const request = https.get(item.url, options, (res) => {
      // Handle redirects if any
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(tempDest, () => {});
        console.log(`⚠️ [${item.volumeNo}/${TOTAL_VOLUMES}] Redirected to ${res.headers.location}`);
        return resolve({ success: false, filename: item.filename, error: 'Redirected' });
      }

      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(tempDest, () => {});
        console.log(`❌ [${item.volumeNo}/${TOTAL_VOLUMES}] HTTP ${res.statusCode} for ${item.filename}`);
        return resolve({ success: false, filename: item.filename, status: res.statusCode });
      }

      const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
      let downloadedBytes = 0;

      res.on('data', (chunk) => {
        downloadedBytes += chunk.length;
      });

      res.pipe(file);

      file.on('finish', () => {
        file.close(() => {
          fs.renameSync(tempDest, dest);
          const sizeMB = (downloadedBytes / 1024 / 1024).toFixed(2);
          console.log(`✅ [${item.volumeNo}/${TOTAL_VOLUMES}] Finished ${item.filename} (${sizeMB} MB)`);
          resolve({ success: true, filename: item.filename, size: downloadedBytes });
        });
      });
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(tempDest, () => {});
      console.log(`❌ [${item.volumeNo}/${TOTAL_VOLUMES}] Error downloading ${item.filename}: ${err.message}`);
      resolve({ success: false, filename: item.filename, error: err.message });
    });

    request.setTimeout(60000, () => {
      request.destroy();
      file.close();
      fs.unlink(tempDest, () => {});
      console.log(`⏱️ [${item.volumeNo}/${TOTAL_VOLUMES}] Timeout downloading ${item.filename}`);
      resolve({ success: false, filename: item.filename, error: 'Timeout' });
    });
  });
};

// Sequential queue with small delay to avoid server-side rate limits
const run = async () => {
  const start = Date.now();
  let downloadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  // Download 2 in parallel for speed and server friendliness
  const CONCURRENCY = 2;
  const queue = [...volumes];

  const worker = async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      const res = await downloadVolume(item);
      if (res.skipped) skippedCount++;
      else if (res.success) downloadedCount++;
      else failedCount++;
    }
  };

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const durationMin = ((Date.now() - start) / 1000 / 60).toFixed(1);
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`🎉 Download Complete in ${durationMin} minutes!`);
  console.log(`   - Successfully Downloaded: ${downloadedCount}`);
  console.log(`   - Already Existed (Skipped): ${skippedCount}`);
  console.log(`   - Failed: ${failedCount}`);
  console.log(`📁 Files saved to: ${targetDir}`);
  console.log('═══════════════════════════════════════════════════════════════');
};

if (require.main === module) {
  run();
}

module.exports = { run };
