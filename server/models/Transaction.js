const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  type: { 
    type: String, 
    enum: ['Token Deposit', 'Token Refund', 'Job Payment', 'Wallet Instant Cashout', 'Bonus Incentive'], 
    required: true 
  },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Success' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  notes: { type: String }
}, { timestamps: true });

transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
