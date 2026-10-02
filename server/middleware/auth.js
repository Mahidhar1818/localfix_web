const jwt = require('jsonwebtoken');
const User = require('../models/User');

function getToken(req) {
  const header = req.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7);
}

async function requireAuth(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  if (!process.env.JWT_SECRET) return res.status(503).json({ error: 'JWT_SECRET is not configured' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('+password');
    if (!user) return res.status(401).json({ error: 'User account no longer exists' });
    if (user.isSuspended) return res.status(403).json({ error: 'Account has been suspended by Admin' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired JWT token' });
  }
}

function verifySocketToken(token) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { requireAuth, getToken, verifySocketToken };
