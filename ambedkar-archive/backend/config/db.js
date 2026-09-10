const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ambedkar_archive';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    mongoose.set('bufferCommands', false);
    console.warn(`⚠️ MongoDB not connected (${err.message}). API running in Instant Offline / Mock Mode.`);
  }
};

module.exports = connectDB;
