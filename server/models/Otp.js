const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true, lowercase: true, trim: true, index: true },
  channel: { type: String, enum: ['sms', 'email'], required: true },
  codeHash: { type: String, required: true },
  purpose: { type: String, default: 'verify' },
  attempts: { type: Number, default: 0 },
  consumed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
