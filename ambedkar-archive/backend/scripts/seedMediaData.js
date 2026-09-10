/**
 * seedMediaData.js — Ingests YouTube speeches and historic audio recordings into MongoDB
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Media = require('../models/Media');
const { HISTORIC_MEDIA } = require('../seed/mediaSeed');

const seedMedia = async () => {
  console.log('🎙️ Starting YouTube & Archival Media Ingestion...');
  console.log(`📦 Loaded ${HISTORIC_MEDIA.length} media tracks (Constituent Assembly speeches, BBC interview, Hindi BAWS playlist).`);

  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ambedkar_archive';
  let isDbConnected = false;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    isDbConnected = true;
    console.log('✅ Connected to MongoDB for Media Ingestion.');
  } catch (err) {
    console.log('ℹ️ MongoDB not currently running. Dataset is available in memory for frontend / seed.');
  }

  if (isDbConnected) {
    let upserted = 0;
    for (const item of HISTORIC_MEDIA) {
      // Serialize transcript if object array for string field
      const transcriptStr = Array.isArray(item.transcript) 
        ? JSON.stringify(item.transcript) 
        : item.transcript;

      const mediaDoc = {
        title: item.title,
        titleHi: item.titleHi || '',
        titleMr: item.titleMr || '',
        type: item.type,
        url: item.url,
        embedUrl: item.embedUrl,
        thumbnail: item.thumbnail,
        duration: item.duration || 0,
        year: item.year || 1950,
        language: item.language || ['en'],
        description: item.description,
        transcript: transcriptStr,
        tags: item.tags || [],
        source: item.source || 'YouTube Archival',
        isFeatured: item.isFeatured || false,
      };

      await Media.findOneAndUpdate(
        { url: item.url },
        mediaDoc,
        { upsert: true, new: true }
      );
      upserted++;
    }
    console.log(`🎉 Ingested/Updated ${upserted} historic media records in MongoDB!`);
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  seedMedia();
}

module.exports = { seedMedia };
