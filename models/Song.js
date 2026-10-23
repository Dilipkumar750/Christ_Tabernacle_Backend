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
      default: 'Tamil',
      trim: true,
    },
    theme: {
      type: String,
      default: 'Adoration & Grace',
      trim: true,
    },
    key: {
      type: String,
      default: '',
      trim: true,
    },
    tempo: {
      type: String,
      default: '',
      trim: true,
    },
    author: {
      type: String,
      default: "Christ's Tabernacle Worship",
      trim: true,
    },
    youtubeUrl: {
      type: String,
      default: '',
      trim: true,
    },
    pptUrl: {
      type: String,
      default: '',
      trim: true,
    },
    audioUrl: {
      type: String,
      default: '',
      trim: true,
    },
    lyrics: {
      type: String,
      required: true,
    },
    englishLyrics: {
      type: String,
      default: '',
    },
    chords: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: String,
      default: '0 views',
    },
    duration: {
      type: String,
      default: '',
    },
    uploadDate: {
      type: String,
      default: '',
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

// Add index for searching
songSchema.index({ title: 'text', lyrics: 'text', author: 'text', theme: 'text' });

const Song = mongoose.model('Song', songSchema);
export default Song;
