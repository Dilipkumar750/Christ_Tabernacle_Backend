import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'Sanctuary',
    },
    image: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
    year: {
      type: String,
      default: () => String(new Date().getFullYear()),
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model('Photo', photoSchema);
export default Photo;
