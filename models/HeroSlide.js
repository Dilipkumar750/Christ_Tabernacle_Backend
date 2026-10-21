import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      default: '',
      trim: true,
    },
    verse: {
      type: String,
      default: '',
      trim: true,
    },
    actionText: {
      type: String,
      default: 'Plan a Visit',
      trim: true,
    },
    actionLink: {
      type: String,
      default: '/contact',
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: 'Christ Tabernacle Sanctuary',
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

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);
export default HeroSlide;
