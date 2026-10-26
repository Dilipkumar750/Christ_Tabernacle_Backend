import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    dob: {
      type: String,
      default: '',
      trim: true,
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Residential address is required'],
      trim: true,
    },
    occupation: {
      type: String,
      default: '',
      trim: true,
    },
    bloodGroup: {
      type: String,
      default: '',
      trim: true,
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Widowed', 'Other'],
      default: 'Single',
    },
    baptized: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'Yes',
    },
    emergencyContact: {
      type: String,
      default: '',
      trim: true,
    },
    membershipDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexing
memberSchema.index({ name: 'text', mobile: 'text', email: 'text', address: 'text' });

const Member = mongoose.model('Member', memberSchema);
export default Member;
