const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, required: true, trim: true },
  problemDescription: { type: String, required: true, trim: true, maxlength: 3000 },
  
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },

  // Financial Breakdown
  visitCost: { type: Number, min: 0, default: 299 },
  partCost: { type: Number, min: 0, default: 0 },
  laborCost: { type: Number, min: 0, default: 0 },
  tokenAmount: { type: Number, default: 99 },
  tokenPaid: { type: Boolean, default: false },
  finalPaymentPaid: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ['Razorpay (Card/UPI)', 'Cash on Service', 'LocalFix Wallet'], default: 'Razorpay (Card/UPI)' },

  // Verification & Proofs
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  beforePhoto: { type: String, maxlength: 1000 },
  afterPhoto: { type: String, maxlength: 1000 },
  replacedComponentPhoto: { type: String, maxlength: 1000 },

  // Location & Scheduling
  customerLocation: {
    lat: { type: Number, min: -90, max: 90, default: 17.3850 },
    lng: { type: Number, min: -180, max: 180, default: 78.4867 },
    address: { type: String, maxlength: 300, default: 'Hyd, TS, India' }
  },
  timeSlot: { type: String, default: 'Today (Morning 10 AM - 1 PM)' },
  scheduledAt: Date,
  completedAt: Date,

  // OTP Verification
  bookingOtp: { type: String, select: false },
  otpVerified: { type: Boolean, default: false },
  otpVerifiedAt: Date,
  otpAttempts: { type: Number, default: 0 },

  // Warranty
  warrantyDaysRemaining: { type: Number, default: 90 }
}, { timestamps: true });

jobSchema.virtual('totalCost').get(function totalCost() {
  return this.visitCost + this.partCost + this.laborCost;
});

jobSchema.set('toJSON', { virtuals: true });
jobSchema.index({ customerId: 1, createdAt: -1 });
jobSchema.index({ technicianId: 1, status: 1, createdAt: -1 });
jobSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
