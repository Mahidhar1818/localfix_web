const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch(e) {}

require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { Server: SocketServer } = require('socket.io');

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const technicianRoutes = require('./routes/technician.routes');
const adminRoutes = require('./routes/admin.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');
const chatRoutes = require('./routes/chat.routes');
const otpRoutes = require('./routes/otp.routes');
const { diagnoseWithGemini } = require('./services/gemini');
const initSocket = require('./socket/socketHandler');

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, {
  cors: { origin: '*', credentials: true }
});

initSocket(io);

const PORT = Number(process.env.PORT || 3000);

// ---------- MIDDLEWARES ----------
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// ---------- HEALTH CHECK ----------
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'LocalFix Appliance Repair Platform API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'not-connected',
    gemini: Boolean(process.env.GEMINI_API_KEY),
    twilio: Boolean(process.env.TWILIO_ACCOUNT_SID),
    smtp: Boolean(process.env.SMTP_HOST),
    timestamp: new Date().toISOString()
  });
});

// ---------- AI DIAGNOSE ROUTE ----------
app.post('/api/ai/diagnose', async (req, res, next) => {
  try {
    const problemDescription = String(req.body.problemDescription || '').trim();
    if (problemDescription.length < 3) {
      return res.status(400).json({ error: 'problemDescription must be at least 3 characters long' });
    }

    const diagnosis = await diagnoseWithGemini(problemDescription);
    res.json({ diagnosis });
  } catch (error) {
    next(error);
  }
});

// ---------- API ROUTES ----------
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', reviewRoutes);
app.use('/api', chatRoutes);
app.use('/api/otp', otpRoutes);

// ---------- SERVE CLIENT STATIC FILES & FALLBACK ----------
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
  const fs = require('fs');
  const indexHtml = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>LocalFix API Server</title></head>
      <body style="background:#060e1a;color:#f1f5f9;font-family:sans-serif;text-align:center;padding:60px;">
        <h1 style="color:#3b82f6;">🚀 LocalFix API Server is Running on Port 3000</h1>
        <p style="color:#cbd5e1;">Express backend API & Socket.IO server are active.</p>
        <div style="margin-top:30px;background:#0c1b33;display:inline-block;padding:20px 40px;border-radius:16px;border:1px solid #3b82f640;">
          <p style="font-size:16px;margin:0;">👉 Open <strong><a href="http://localhost:5173" style="color:#60a5fa;text-decoration:none;font-weight:bold;">http://localhost:5173</a></strong> for the React Frontend Application</p>
        </div>
      </body>
    </html>
  `);
});

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error('🔥 Server Error:', err);
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// ---------- SERVER START ----------
async function start() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️  MONGODB_URI is missing. Database routes will return 503.');
  } else {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        dbName: 'localfix'
      });
      console.log('✅ Connected to MongoDB Atlas successfully');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
    }
  }

  httpServer.listen(PORT, () => {
    console.log(`🚀 LocalFix Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO server active.`);
  });
}

start();
