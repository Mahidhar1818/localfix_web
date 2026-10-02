const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

function issueToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function authPayload(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    technicianId: user.technicianId || null,
    skills: user.skills || [],
    rating: user.rating || 4.8,
    coins: user.coins || 50,
    walletBalance: user.walletBalance || 0,
    isOnline: user.isOnline ?? true,
    mustChangePassword: user.mustChangePassword || false,
    uniformVerified: user.uniformVerified ?? true,
    address: user.address || ''
  };
}

// ---------- CUSTOMER REGISTER ----------
router.post('/register', authRateLimiter, async (req, res, next) => {
  try {
    const { name, email, password, phone, role = 'customer', skills = [], address, location } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ error: 'An account with this email address already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim(),
      password: await bcrypt.hash(password, 12),
      role: role === 'technician' ? 'technician' : 'customer',
      skills: Array.isArray(skills) ? skills.slice(0, 20) : [],
      address: address?.trim() || '',
      coins: 50,
      location: location || { lat: 17.3850, lng: 78.4867, address: 'Hyderabad, TS' }
    });

    const token = issueToken(user);
    res.status(201).json({ token, user: authPayload(user) });
  } catch (error) {
    next(error);
  }
});

// ---------- LOGIN (CUSTOMER / ADMIN / TECHNICIAN ID) ----------
router.post('/login', authRateLimiter, async (req, res, next) => {
  try {
    const { email, password, technicianId } = req.body;
    if (!password || (!email && !technicianId)) {
      return res.status(400).json({ error: 'Please provide Email / Technician ID and Password' });
    }

    let query = {};
    if (technicianId && technicianId.trim()) {
      query = { technicianId: technicianId.trim().toUpperCase() };
    } else {
      query = { email: email.trim().toLowerCase() };
    }

    const user = await User.findOne(query).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please check your details.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: 'Your account has been suspended by Admin. Contact support.' });
    }

    res.json({ token: issueToken(user), user: authPayload(user) });
  } catch (error) {
    next(error);
  }
});

// ---------- GOOGLE OAUTH MOCK / CALLBACK ----------
router.post('/google', async (req, res, next) => {
  try {
    const { credential, email, name, googleId } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Google authentication payload missing required fields' });
    }

    let user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      user = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12),
        role: 'customer',
        emailVerified: true,
        coins: 50
      });
    }

    res.json({ token: issueToken(user), user: authPayload(user) });
  } catch (error) {
    next(error);
  }
});

// ---------- CHANGE PASSWORD ----------
router.post('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    req.user.password = await bcrypt.hash(newPassword, 12);
    req.user.mustChangePassword = false;
    await req.user.save();

    res.json({ ok: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

// ---------- GET CURRENT USER ----------
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: authPayload(req.user) });
});

module.exports = router;
