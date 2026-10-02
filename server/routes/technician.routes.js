const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Transaction = require('../models/Transaction');
const { requireAuth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// ---------- APPLY AS TECHNICIAN ----------
router.post('/apply', async (req, res, next) => {
  try {
    const { name, email, phone, aadhaarNumber, gender, age, dob, experienceYears, address, skills = [] } = req.body;
    if (!name || !email || !phone || !aadhaarNumber) {
      return res.status(400).json({ error: 'Name, Email, Phone, and Aadhaar number are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing && existing.applicationStatus === 'approved') {
      return res.status(409).json({ error: 'An approved technician account already exists for this email.' });
    }

    const tempPassword = 'Pass' + Math.floor(1000 + Math.random() * 9000);

    let user = existing;
    if (user) {
      user.name = name.trim();
      user.phone = phone.trim();
      user.aadhaarNumber = aadhaarNumber.trim();
      user.gender = gender;
      user.age = Number(age) || 25;
      user.dob = dob;
      user.experienceYears = Number(experienceYears) || 1;
      user.address = address;
      user.skills = Array.isArray(skills) && skills.length ? skills : ['AC Repair', 'Appliance Repair'];
      user.applicationStatus = 'pending';
      user.role = 'technician';
      await user.save();
    } else {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password: await bcrypt.hash(tempPassword, 12),
        role: 'technician',
        aadhaarNumber: aadhaarNumber.trim(),
        gender: gender || 'Male',
        age: Number(age) || 25,
        dob: dob || '1998-05-15',
        experienceYears: Number(experienceYears) || 2,
        address: address || '',
        skills: Array.isArray(skills) && skills.length ? skills : ['AC Repair', 'Appliance Repair'],
        applicationStatus: 'pending'
      });
    }

    res.status(201).json({
      ok: true,
      message: 'Technician application submitted successfully! Admin will review your application shortly.'
    });
  } catch (error) {
    next(error);
  }
});

// ---------- TECHNICIAN JOB FEED (Incoming Jobs) ----------
router.get('/jobs/feed', requireAuth, roleCheck('technician'), async (req, res, next) => {
  try {
    const jobs = await Job.find({
      $or: [
        { technicianId: req.user._id },
        { technicianId: null, status: 'Pending' }
      ]
    })
    .populate('customerId', 'name phone email location')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
});

// ---------- TOGGLE ONLINE/OFFLINE AVAILABILITY ----------
router.post('/toggle-online', requireAuth, roleCheck('technician'), async (req, res, next) => {
  try {
    req.user.isOnline = !req.user.isOnline;
    await req.user.save();
    res.json({ isOnline: req.user.isOnline });
  } catch (error) {
    next(error);
  }
});

// ---------- TECHNICIAN EARNINGS DASHBOARD ----------
router.get('/earnings', requireAuth, roleCheck('technician'), async (req, res, next) => {
  try {
    const completedJobs = await Job.find({ technicianId: req.user._id, status: 'Completed' });
    const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.visitCost + job.partCost + job.laborCost), 0);
    const pendingClearance = completedJobs.filter(j => !j.finalPaymentPaid).reduce((sum, j) => sum + j.visitCost, 0);
    const availableBalance = req.user.walletBalance || Math.max(0, totalEarnings - pendingClearance);

    res.json({
      totalEarnings,
      completedJobsCount: completedJobs.length,
      availableBalance,
      pendingClearance,
      rating: req.user.rating || 4.8,
      bonusIncentives: Math.round(completedJobs.length * 50)
    });
  } catch (error) {
    next(error);
  }
});

// ---------- INSTANT CASHOUT WALLET ----------
router.post('/wallet/cashout', requireAuth, roleCheck('technician'), async (req, res, next) => {
  try {
    const amount = Number(req.body.amount) || req.user.walletBalance;
    if (amount <= 0 || amount > (req.user.walletBalance || 5000)) {
      return res.status(400).json({ error: 'Invalid cashout amount' });
    }

    req.user.walletBalance = Math.max(0, (req.user.walletBalance || 5000) - amount);
    await req.user.save();

    await Transaction.create({
      userId: req.user._id,
      type: 'Wallet Instant Cashout',
      amount,
      status: 'Success',
      notes: 'Instant transfer to linked bank account / UPI'
    });

    res.json({ ok: true, remainingBalance: req.user.walletBalance, cashedOutAmount: amount });
  } catch (error) {
    next(error);
  }
});

// ---------- LIST TECHNICIANS BY CATEGORY (FOR CUSTOMERS) ----------
router.get('/list', requireAuth, async (req, res, next) => {
  try {
    const category = String(req.query.category || '').trim();
    const filter = { role: 'technician', applicationStatus: 'approved' };
    
    if (category) {
      filter.skills = { $regex: new RegExp(category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') };
    }

    const technicians = await User.find(filter)
      .select('name skills rating completedJobs isVerified location liveLocation experienceYears technicianId uniformVerified')
      .sort({ rating: -1, completedJobs: -1 })
      .limit(30);

    res.json({ technicians });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
