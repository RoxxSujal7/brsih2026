/**
 * download_all_volumes.js
 * Downloads all 20 English Volumes of Dr. Babasaheb Ambedkar's Writings & Speeches
 * into backend/public/books/ for complete offline access.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const volumesFile = path.join(__dirname, '../data/volumes.json');
const destDir = path.join(__dirname, '../public/books');

fs.mkdirSync(destDir, { recursive: true });

if (!fs.existsSync(volumesFile)) {
  console.error('volumes.json not found at:', volumesFile);
  process.exit(1);
}

const volumes = JSON.parse(fs.readFileSync(volumesFile, 'utf8'));

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      // If already downloaded and > 500KB, skip
      if (stats.size > 500000) {
        console.log(`⚡ Already exists: ${path.basename(destPath)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        return resolve({ skipped: true, size: stats.size });
      }
    }

    const file = fs.createWriteStream(destPath);
    console.log(`⬇️ Downloading: ${path.basename(destPath)} from ${url}...`);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }

      res.pipe(file);

      file.on('finish', () => {
        file.close(() => {
          const stats = fs.statSync(destPath);
          console.log(`✅ Downloaded: ${path.basename(destPath)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
          resolve({ skipped: false, size: stats.size });
        });
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function run() {
  console.log(`\n📚 Starting download of ${volumes.length} BAWS Volumes into ${destDir}...`);
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const vol of volumes) {
    const dest = path.join(destDir, vol.file);
    try {
      const res = await downloadFile(vol.remoteUrl, dest);
      if (res.skipped) skipped++;
      else downloaded++;
    } catch (err) {
      console.error(`❌ Failed ${vol.file}:`, err.message);
      failed++;
    }
  }

  console.log(`\n🎉 Volume Download Complete: ${downloaded} downloaded, ${skipped} already existed, ${failed} failed.\n`);
}

run();
