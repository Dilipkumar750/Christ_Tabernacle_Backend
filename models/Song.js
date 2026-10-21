import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      default: 'Tamil',
      trim: true,
    },
    theme: {
      type: String,
      default: 'Praise & Worship',
      trim: true,
    },
    key: {
      type: String,
      default: 'C Major',
      trim: true,
    },
    tempo: {
      type: String,
      default: 'Medium',
      trim: true,
    },
    lyrics: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      default: '',
      trim: true,
    },
    youtubeUrl: {
      type: String,
      default: '',
      trim: true,
    },
    author: {
      type: String,
      default: "Christ's Tabernacle Worship",
      trim: true,
    },
    uploadDate: {
      type: String,
      default: '',
      trim: true,
    },
    views: {
      type: String,
      default: '',
      trim: true,
    },
    duration: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model('Song', songSchema);
export default Song;
