import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: 'Chennai, India',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Healing', 'Deliverance', 'Family', 'Breakthrough', 'Prayer', 'Salvation', 'General'],
      default: 'Healing',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    story: {
      type: String,
      required: true,
    },
    verse: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['Written', 'Audio'],
      default: 'Written',
    },
    audioUrl: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '3:30',
    },
    language: {
      type: String,
      default: 'Tamil & English',
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
