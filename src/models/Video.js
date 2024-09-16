// src/models/Video.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  originalName: String,
  fileName: String,
  format: String,
  filePath: String,
  converted: Boolean,
  uploadDate: { type: Date, default: Date.now },
});

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

export default Video;