const express = require('express');
const Message = require('../models/Message');
const Job = require('../models/Job');
const Complaint = require('../models/Complaint');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function cleanMessage(msg) {
  return {
    id: msg._id,
    jobId: msg.jobId,
    senderId: msg.senderId,
    body: msg.body,
    createdAt: msg.createdAt
  };
}

// ---------- GET MESSAGES FOR A JOB ----------
router.get('/jobs/:id/messages', requireAuth, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const ownsJob = req.user.role === 'admin' || [job.customerId, job.technicianId]
      .some(id => id && id.toString() === req.user._id.toString());
    if (!ownsJob) return res.status(403).json({ error: 'Access denied' });

    const messages = await Message.find({ jobId: job._id }).sort({ createdAt: 1 }).limit(500);
    res.json({ messages: messages.map(cleanMessage) });
  } catch (error) {
    next(error);
  }
});

// ---------- POST A MESSAGE ----------
router.post('/jobs/:id/messages', requireAuth, async (req, res, next) => {
  try {
    const body = String(req.body.body || '').trim();
    if (!body) return res.status(400).json({ error: 'Message body cannot be empty' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const ownsJob = [job.customerId, job.technicianId]
      .some(id => id && id.toString() === req.user._id.toString());
    if (!ownsJob) return res.status(403).json({ error: 'Access denied' });

    const message = await Message.create({
      jobId: job._id,
      senderId: req.user._id,
      body: body.slice(0, 2000)
    });

    res.status(201).json({ message: cleanMessage(message) });
  } catch (error) {
    next(error);
  }
});

// ---------- FILE A COMPLAINT ----------
router.post('/complaint', requireAuth, async (req, res, next) => {
  try {
    const { technicianId, subject, details, jobId } = req.body;
    if (!technicianId || !subject || !details) {
      return res.status(400).json({ error: 'Technician ID, Subject, and Details are required' });
    }

    const complaint = await Complaint.create({
      customerId: req.user._id,
      technicianId: String(technicianId).trim(),
      jobId: jobId || null,
      subject: String(subject).trim(),
      details: String(details).trim()
    });

    res.status(201).json({ ok: true, message: 'Complaint registered successfully. Admin will review within 24 hours.', complaint });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
