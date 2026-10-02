import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import OtpInput from '../components/OtpInput';
import { User, Mail, Lock, Phone, MapPin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({ lat: 17.3850, lng: 78.4867, address: 'Hyderabad, TS' });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleAutoDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: 'GPS Auto Detected Address'
          };
          setLocation(newLoc);
          setAddress(`GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
          setToast({ type: 'success', message: 'Current GPS location acquired!' });
        },
        () => setToast({ type: 'error', message: 'Could not access GPS location. Entered default.' })
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Trigger Email OTP send
      await API.post('/otp/email/send', { email });
      setShowOtpModal(true);
      setToast({ type: 'info', message: `Verification OTP sent to ${email}` });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpComplete = async (code) => {
    try {
      // Verify Email OTP
      const verifyRes = await API.post('/otp/email/verify', { email, code });
      if (!verifyRes.data.ok) {
        setToast({ type: 'error', message: 'Invalid OTP code' });
        return;
      }

      // Complete Registration
      const user = await register({
        name,
        email,
        phone,
        password,
        address,
        location,
        role: 'customer'
      });

      setToast({ type: 'success', message: 'Account verified & created successfully!' });
      setShowOtpModal(false);
      setTimeout(() => navigate('/customer-dashboard'), 800);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'OTP verification failed' });
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-md w-full mx-auto px-6 py-12">
        <div className="glass-card p-8 rounded-3xl space-y-6 shadow-2xl border-signal-500/20">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">Create Customer Account</h2>
            <p className="text-xs text-slate-400">Join LocalFix for instant appliance repairs & 50 welcome coins</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-signal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-signal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mobile Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-signal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-signal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Service Address</label>
                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  className="text-[10px] font-semibold text-signal-400 hover:text-signal-300 flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> Auto Detect GPS
                </button>
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat 402, Green Valley Apts, Madhapur, Hyderabad"
                className="w-full bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-signal-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-signal-600 hover:bg-signal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-signal-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              {loading ? 'Sending Verification OTP...' : 'Send Email Verification OTP'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-signal-400 font-semibold hover:underline">
              Log In Here
            </Link>
          </p>

        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[10000] bg-navy-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl border-signal-500/30">
            <div className="w-12 h-12 rounded-full bg-signal-600/20 text-signal-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Enter 6-Digit Email OTP</h3>
            <p className="text-xs text-slate-400">We sent a verification code to <span className="text-signal-400 font-mono">{email}</span></p>

            <OtpInput onComplete={handleVerifyOtpComplete} />

            <button
              onClick={() => setShowOtpModal(false)}
              className="text-xs text-slate-500 hover:text-slate-300 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
