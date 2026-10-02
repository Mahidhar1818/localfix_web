const express = require('express');
const crypto = require('crypto');
const Job = require('../models/Job');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { upload, uploadImageToCloud } = require('../services/cloudinary');

const router = express.Router();

function generateBookingOtp() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

// ---------- CREATE BOOKING (CUSTOMER) ----------
router.post('/', requireAuth, roleCheck('customer'), async (req, res, next) => {
  try {
    const { category, problemDescription, technicianId, scheduledAt, timeSlot, customerLocation, visitCost, tokenAmount = 99 } = req.body;
    if (!category || !problemDescription) {
      return res.status(400).json({ error: 'Category and problem description are required' });
    }

    let assignedTechId = technicianId;
    if (assignedTechId) {
      const technician = await User.findOne({ _id: assignedTechId, role: 'technician' });
      if (!technician) return res.status(400).json({ error: 'Selected technician was not found' });
    }

    const bookingOtp = generateBookingOtp();

    const job = await Job.create({
      customerId: req.user._id,
      technicianId: assignedTechId || null,
      category,
      problemDescription,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      timeSlot: timeSlot || 'Today (Morning 10 AM - 1 PM)',
      customerLocation: customerLocation || { lat: 17.3850, lng: 78.4867, address: req.user.address || 'Hyd, TS' },
      visitCost: Number.isFinite(Number(visitCost)) ? Number(visitCost) : 299,
      tokenAmount: Number(tokenAmount) || 99,
      tokenPaid: true,
      bookingOtp
    });

    // Reward customer with LocalFix Coins
    await User.findByIdAndUpdate(req.user._id, { $inc: { coins: 15 } });

    const jobObj = job.toObject();
    delete jobObj.bookingOtp;

    res.status(201).json({ job: jobObj, bookingOtp });
  } catch (error) {
    next(error);
  }
});

// ---------- LIST JOBS FOR CURRENT USER ----------
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter = req.user.role === 'customer' 
      ? { customerId: req.user._id } 
      : req.user.role === 'admin' 
        ? {} 
        : { technicianId: req.user._id };

    if (req.query.status) filter.status = req.query.status;

    const jobs = await Job.find(filter)
      .populate('customerId', 'name email phone location address')
      .populate('technicianId', 'name skills rating location liveLocation technicianId')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
});

// ---------- GET SINGLE JOB DETAILS ----------
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('customerId', 'name phone email location address')
      .populate('technicianId', 'name skills rating location liveLocation technicianId');

    if (!job) return res.status(404).json({ error: 'Job not found' });

    const ownsJob = req.user.role === 'admin' || [job.customerId?._id, job.technicianId?._id]
      .some(id => id && id.toString() === req.user._id.toString());
    if (!ownsJob) return res.status(403).json({ error: 'You do not have access to this job' });

    const jobObj = job.toObject();
    delete jobObj.bookingOtp;
    res.json({ job: jobObj });
  } catch (error) {
    next(error);
  }
});

// ---------- CUSTOMER FETCHES THEIR BOOKING OTP ----------
router.get('/:id/otp', requireAuth, roleCheck('customer'), async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, customerId: req.user._id }).select('+bookingOtp');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ bookingOtp: job.bookingOtp, otpVerified: job.otpVerified });
  } catch (error) {
    next(error);
  }
});

// ---------- TECHNICIAN ACCEPTS / DECLINES JOB ----------
router.patch('/:id/accept', requireAuth, roleCheck('technician'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'Pending') return res.status(400).json({ error: 'Job has already been accepted or updated' });

    job.technicianId = req.user._id;
    job.status = 'Accepted';
    await job.save();

    res.json({ job });
  } catch (error) {
    next(error);
  }
});

// ---------- TECHNICIAN SUBMITS OTP TO COMPLETE JOB ----------
router.post('/:id/verify-otp', requireAuth, roleCheck('technician'), async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ error: 'OTP code is required' });

    const job = await Job.findOne({ _id: req.params.id, technicianId: req.user._id }).select('+bookingOtp');
    if (!job) return res.status(404).json({ error: 'Assigned job not found' });
    if (job.otpVerified) return res.status(409).json({ error: 'OTP already verified for this job' });
    if ((job.otpAttempts || 0) >= 5) return res.status(429).json({ error: 'Too many incorrect attempts. Contact support.' });

    if (String(otp).trim() !== String(job.bookingOtp)) {
      job.otpAttempts = (job.otpAttempts || 0) + 1;
      await job.save();
      return res.status(400).json({ error: 'Incorrect OTP code. Please check with customer.' });
    }

    job.otpVerified = true;
    job.otpVerifiedAt = new Date();
    job.status = 'Completed';
    job.completedAt = new Date();
    await job.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { completedJobs: 1, walletBalance: job.visitCost + job.laborCost } });

    const jobObj = job.toObject();
    delete jobObj.bookingOtp;
    res.json({ ok: true, message: 'OTP verified! Job completed successfully.', job: jobObj });
  } catch (error) {
    next(error);
  }
});

// ---------- UPDATE JOB STATUS & QUOTATION & PHOTOS ----------
router.patch('/:id/status', requireAuth, roleCheck('technician'), async (req, res, next) => {
  try {
    const { status, partCost, laborCost, beforePhoto, afterPhoto, replacedComponentPhoto } = req.body;
    const allowed = ['Accepted', 'In Progress', 'Completed'];
    if (status && !allowed.includes(status)) return res.status(400).json({ error: 'Invalid job status' });

    const job = await Job.findOne({ _id: req.params.id, technicianId: req.user._id });
    if (!job) return res.status(404).json({ error: 'Assigned job not found' });

    if (status === 'Completed' && !job.otpVerified) {
      return res.status(400).json({ error: 'Customer OTP verification is required before marking job as completed.' });
    }

    if (status) job.status = status;
    if (partCost !== undefined) job.partCost = Math.max(0, Number(partCost) || 0);
    if (laborCost !== undefined) job.laborCost = Math.max(0, Number(laborCost) || 0);
    if (beforePhoto) job.beforePhoto = beforePhoto;
    if (afterPhoto) job.afterPhoto = afterPhoto;
    if (replacedComponentPhoto) job.replacedComponentPhoto = replacedComponentPhoto;

    await job.save();
    res.json({ job });
  } catch (error) {
    next(error);
  }
});

// ---------- PHOTO UPLOAD ENDPOINT ----------
router.post('/:id/upload-photo', requireAuth, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });

    const photoUrl = await uploadImageToCloud(req.file.buffer, req.file.originalname);
    res.json({ photoUrl });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
