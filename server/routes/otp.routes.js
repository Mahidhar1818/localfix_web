const express = require('express');
const { sendSmsOtp, sendEmailOtp, verifyOtp } = require('../services/twilio');
const { otpRateLimiter } = require('../middleware/rateLimiter');
const User = require('../models/User');

const router = express.Router();

router.post('/mobile/send', otpRateLimiter, async (req, res, next) => {
  try {
    const { phone, purpose = 'verify' } = req.body;
    if (!phone) return res.status(400).json({ error: 'Mobile phone number is required' });
    const result = await sendSmsOtp(phone, purpose);
    res.json({ ok: true, channel: 'sms', identifier: result.identifier, dev: Boolean(result.dev), code: result.code });
  } catch (error) {
    next(error);
  }
});

router.post('/mobile/verify', async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and OTP code are required' });
    const result = await verifyOtp({ identifier: phone, channel: 'sms', code });
    if (!result.ok) return res.status(400).json({ error: result.reason });

    await User.updateOne({ phone: phone.trim() }, { phoneVerified: true });
    res.json({ ok: true, phone: result.identifier });
  } catch (error) {
    next(error);
  }
});

router.post('/email/send', otpRateLimiter, async (req, res, next) => {
  try {
    const { email, purpose = 'verify' } = req.body;
    if (!email) return res.status(400).json({ error: 'Email address is required' });
    const result = await sendEmailOtp(email, purpose);
    res.json({ ok: true, channel: 'email', identifier: result.identifier, dev: Boolean(result.dev), code: result.code });
  } catch (error) {
    next(error);
  }
});

router.post('/email/verify', async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and OTP code are required' });
    const result = await verifyOtp({ identifier: email, channel: 'email', code });
    if (!result.ok) return res.status(400).json({ error: result.reason });

    await User.updateOne({ email: email.trim().toLowerCase() }, { emailVerified: true });
    res.json({ ok: true, email: result.identifier });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
