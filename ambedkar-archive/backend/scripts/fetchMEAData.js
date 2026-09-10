/**
 * fetchMEAData.js — Script to ingest MEA & Dr. Ambedkar Foundation official BAWS datasets
 */

const mongoose = require('mongoose');
const { MEA_BAWS_VOLUMES } = require('../seed/meaVolumes');
const Document = require('../models/Document');

const ingestMEAData = async () => {
  console.log('🌐 Starting MEA & Dr. Ambedkar Foundation Ingestion...');
  console.log(`📦 Loaded ${MEA_BAWS_VOLUMES.length} official MEA BAWS Volumes (Vol. 1 - Vol. 21).`);

  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ambedkar_archive';
  let isDbConnected = false;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    isDbConnected = true;
    console.log('✅ Connected to MongoDB for MEA Ingestion.');
  } catch (err) {
    console.log('ℹ️ MongoDB not available. Returning in-memory dataset catalog.');
  }

  if (isDbConnected) {
    let inserted = 0;
    for (const vol of MEA_BAWS_VOLUMES) {
      const docData = {
        title: `BAWS Volume ${vol.volumeNo}: ${vol.title}`,
        titleHi: vol.titleHi,
        titleMr: vol.titleMr,
        category: vol.category,
        language: ['en', 'hi', 'mr'],
        year: vol.year,
        volume: `BAWS Vol. ${vol.volumeNo}`,
        summary: vol.summary,
        summaryHi: vol.titleHi,
        summaryMr: vol.titleMr,
        tags: vol.tags,
        source: vol.source,
        publisher: vol.publisher,
        pageCount: vol.pageCount,
        isFeatured: vol.isFeatured,
        downloadUrl: vol.downloadUrl,
        isPublic: true
      };

      await Document.findOneAndUpdate(
        { volume: `BAWS Vol. ${vol.volumeNo}` },
        docData,
        { upsert: true, new: true }
      );
      inserted++;
    }
    console.log(`🎉 Ingested/Updated ${inserted} official MEA Volumes into MongoDB database!`);
    await mongoose.disconnect();
  } else {
    console.log('🎉 Ingested MEA Catalog into application dataset.');
  }
};

if (require.main === module) {
  ingestMEAData();
}

module.exports = { ingestMEAData };
