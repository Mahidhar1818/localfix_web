const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, sparse: true, trim: true, maxlength: 30 },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['customer', 'technician', 'admin'], required: true },
  
  // Technician Application & Credentials
  technicianId: { type: String, unique: true, sparse: true, trim: true }, // LF-TECH-XXXX
  aadhaarNumber: { type: String, trim: true, maxlength: 20 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  age: { type: Number, min: 18, max: 80 },
  dob: { type: String },
  experienceYears: { type: Number, default: 0 },
  address: { type: String, maxlength: 500 },
  applicationStatus: { 
    type: String, 
    enum: ['none', 'pending', 'approved', 'rejected'], 
    default: 'none' 
  },
  mustChangePassword: { type: Boolean, default: false },

  // Technician Work & Wallet Info
  skills: [{ type: String, trim: true }],
  rating: { type: Number, min: 0, max: 5, default: 4.8 },
  completedJobs: { type: Number, min: 0, default: 0 },
  isOnline: { type: Boolean, default: true },
  walletBalance: { type: Number, default: 0 },
  coins: { type: Number, default: 50 }, // LocalFix Coins
  uniformVerified: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },

  // Verification
  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },

  // Location
  location: {
    lat: { type: Number, min: -90, max: 90, default: 17.3850 },
    lng: { type: Number, min: -180, max: 180, default: 78.4867 },
    address: { type: String, maxlength: 300 }
  },
  liveLocation: {
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
    address: { type: String, maxlength: 300 },
    updatedAt: Date
  }
}, { timestamps: true });

userSchema.index({ role: 1, skills: 1, rating: -1 });
userSchema.index({ technicianId: 1 });
userSchema.index({ 'liveLocation.updatedAt': -1 });

module.exports = mongoose.model('User', userSchema);
