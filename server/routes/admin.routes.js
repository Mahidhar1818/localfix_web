const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Complaint = require('../models/Complaint');
const { requireAuth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { sendTechnicianApprovalEmail } = require('../services/twilio');

const router = express.Router();

// ---------- PLATFORM OVERVIEW & ANALYTICS ----------
router.get('/overview', requireAuth, roleCheck('admin'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalTechnicians = await User.countDocuments({ role: 'technician', applicationStatus: 'approved' });
    const pendingApplications = await User.countDocuments({ role: 'technician', applicationStatus: 'pending' });
    const activeJobs = await Job.countDocuments({ status: { $in: ['Pending', 'Accepted', 'In Progress'] } });
    const completedJobsCount = await Job.countDocuments({ status: 'Completed' });
    const openComplaints = await Complaint.countDocuments({ status: 'Open' });

    const jobs = await Job.find({ status: 'Completed' });
    const totalRevenue = jobs.reduce((sum, job) => sum + (job.visitCost + job.partCost + job.laborCost), 0);

    // Jobs per category analytics
    const categoryStats = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalTechnicians,
      pendingApplications,
      activeJobs,
      completedJobsCount,
      totalRevenue,
      openComplaints,
      categoryStats
    });
  } catch (error) {
    next(error);
  }
});

// ---------- TECHNICIAN APPLICATIONS LIST ----------
router.get('/technician-applications', requireAuth, roleCheck('admin'), async (req, res, next) => {
  try {
    const applications = await User.find({ role: 'technician' })
      .select('name email phone aadhaarNumber gender age experienceYears address applicationStatus technicianId createdAt skills')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    next(error);
  }
});

// ---------- APPROVE / REJECT TECHNICIAN APPLICATION ----------
router.post('/technician-applications/:id/action', requireAuth, roleCheck('admin'), async (req, res, next) => {
  try {
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Action must be approve or reject' });
    }

    const technician = await User.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ error: 'Technician application not found' });
    }

    if (action === 'approve') {
      // Auto-generate Technician ID (Format: LF-TECH-XXXX)
      const randomDigits = String(Math.floor(1000 + Math.random() * 9000));
      const technicianId = `LF-TECH-${randomDigits}`;
      const tempPassword = 'Pass' + Math.floor(1000 + Math.random() * 9000);

      technician.technicianId = technicianId;
      technician.password = await bcrypt.hash(tempPassword, 12);
      technician.applicationStatus = 'approved';
      technician.isVerified = true;
      technician.mustChangePassword = true;
      technician.role = 'technician';
      await technician.save();

      // Send Email with credentials using Nodemailer
      await sendTechnicianApprovalEmail(technician.email, technician.name, technicianId, tempPassword);

      res.json({
        ok: true,
        message: `Technician approved! Credentials emailed to ${technician.email}`,
        technicianId,
        tempPassword
      });
    } else {
      technician.applicationStatus = 'rejected';
      await technician.save();

      res.json({ ok: true, message: `Technician application rejected. Reason: ${rejectionReason || 'Not specified'}` });
    }
  } catch (error) {
    next(error);
  }
});

// ---------- COMPLAINTS MANAGEMENT ----------
router.get('/complaints', requireAuth, roleCheck('admin'), async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate('customerId', 'name email phone')
      .populate('jobId', 'category status')
      .sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (error) {
    next(error);
  }
});

router.patch('/complaints/:id/resolve', requireAuth, roleCheck('admin'), async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    complaint.status = status || 'Resolved';
    complaint.resolutionNotes = resolutionNotes || 'Resolved by admin';
    complaint.resolvedAt = new Date();
    await complaint.save();

    res.json({ complaint });
  } catch (error) {
    next(error);
  }
});

// ---------- USER MANAGEMENT & SUSPENSION ----------
router.patch('/users/:id/suspend', requireAuth, roleCheck('admin'), async (req, res, next) => {
  try {
    const { isSuspended } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: Boolean(isSuspended) }, { new: true });
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
