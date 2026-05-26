const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Experience (years) is required'],
      min: [0, 'Experience cannot be negative'],
    },
    fees: {
      type: Number,
      required: [true, 'Consultation fees are required'],
      min: [0, 'Fees cannot be negative'],
    },
    image: {
      type: String,
      default: 'https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff&size=200',
    },
    about: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    education: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
