const Message = require('../models/Message');
const Job = require('../models/Job');
const User = require('../models/User');
const { verifySocketToken } = require('../middleware/auth');

function cleanMessage(message) {
  return {
    id: message._id,
    jobId: message.jobId,
    senderId: message.senderId,
    body: message.body,
    createdAt: message.createdAt
  };
}

function initSocket(io) {
  // Socket auth middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(); // allow guest connections for tracking demo
      const user = verifySocketToken(token);
      socket.user = { id: user.sub, role: user.role };
      next();
    } catch (error) {
      // allow fallback guest socket connection with temporary ID
      socket.user = { id: 'guest_' + socket.id, role: 'customer' };
      next();
    }
  });

  io.on('connection', socket => {
    // Room join/leave
    socket.on('job:join', jobId => {
      if (jobId) socket.join(`job:${jobId}`);
    });

    socket.on('job:leave', jobId => {
      if (jobId) socket.leave(`job:${jobId}`);
    });

    // Real-time location broadcast
    socket.on('location:update', async payload => {
      try {
        const { lat, lng, address, jobId } = payload || {};
        if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;

        const out = {
          userId: socket.user?.id || 'tech',
          role: socket.user?.role || 'technician',
          lat: Number(lat),
          lng: Number(lng),
          address: address || '',
          updatedAt: new Date().toISOString()
        };

        if (jobId) {
          io.to(`job:${jobId}`).emit('location:update', out);
        } else {
          io.emit('location:update', out);
        }
      } catch (err) {
        socket.emit('location:error', { error: 'Could not relay live location' });
      }
    });

    // Real-time chat message broadcast
    socket.on('message:send', async payload => {
      try {
        const jobId = payload?.jobId;
        const body = String(payload?.body || '').trim();
        if (!jobId || !body) return;

        const message = await Message.create({
          jobId,
          senderId: socket.user?.id && !socket.user.id.startsWith('guest_') ? socket.user.id : '65f1234567890abcdef12345',
          body: body.slice(0, 2000)
        });

        io.to(`job:${jobId}`).emit('message:new', cleanMessage(message));
      } catch (error) {
        socket.emit('message:error', { error: 'Could not send chat message' });
      }
    });

    socket.on('disconnect', () => {});
  });
}

module.exports = initSocket;
