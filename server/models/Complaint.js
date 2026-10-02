const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technicianId: { type: String, required: true }, // LF-TECH-XXXX or User ID
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  subject: { type: String, required: true, trim: true, maxlength: 200 },
  details: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['Open', 'Under Review', 'Resolved', 'Dismissed'], default: 'Open' },
  resolutionNotes: { type: String, default: '' },
  resolvedAt: Date
}, { timestamps: true });

complaintSchema.index({ customerId: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
