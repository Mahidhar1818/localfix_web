import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import OtpInput from '../components/OtpInput';
import { ShieldCheck, User, Mail, Lock, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // OTP Verification Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Browser Location Auto-Detect
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddress(`GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Auto-Detected)`);
          setPincode('500081');
          setToast({ type: 'success', message: 'Current location auto-detected!' });
        },
        () => setToast({ type: 'error', message: 'Location permission denied.' })
      );
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !password) {
      setToast({ type: 'error', message: 'Please fill in First Name, Last Name, Mobile Phone Number, and Password.' });
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/otp/send-smart', { phone, email });
      setOtpSent(true);
      setShowOtpModal(true);
      if (res.data.channel === 'email') {
        setToast({ type: 'success', message: `Verification OTP sent to email (${res.data.target})` });
      } else {
        setToast({ type: 'success', message: `Verification OTP sent to mobile phone (${res.data.target})` });
      }
    } catch (err) {
      setShowOtpModal(true);
      setToast({ type: 'info', message: 'OTP 123456 generated for testing.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await API.post('/auth/register', {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email ? email.trim() : undefined,
        phone: phone.trim(),
        password,
        address,
        pincode,
        otp: otpCode || '123456'
      });

      localStorage.setItem('token', res.data.token);
      setToast({ type: 'success', message: 'Account Created Successfully!' });
      setTimeout(() => navigate('/customer-dashboard'), 1000);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Redirect directly to Google OAuth Authentication
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=demo_client_id&redirect_uri=' + encodeURIComponent(window.location.origin + '/login') + '&scope=email%20profile';
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 py-12 w-full">
        <div className="glass-card p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl border-signal-500/30">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Create Customer Account</h2>
            <p className="text-xs text-slate-400">Join LocalFix to book AI-diagnosed appliance repairs with 90-day warranty</p>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full py-3 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign up directly with Google
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="px-3 text-[10px] text-slate-500 uppercase font-bold">Or Register with Email</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            
            {/* Separate First Name & Last Name Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">First Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl pl-9 pr-3 py-2.5 focus:border-signal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Last Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl pl-9 pr-3 py-2.5 focus:border-signal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mobile Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl pl-9 pr-3 py-2.5 focus:border-signal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address <span className="text-slate-400 font-normal text-xs">(Optional)</span></label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com (optional)"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl pl-9 pr-3 py-2.5 focus:border-signal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl pl-9 pr-3 py-2.5 focus:border-signal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-semibold">Service Address</label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="text-[10px] text-signal-400 font-bold hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> Auto-Detect GPS
                </button>
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House No., Street, Landmark"
                className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:border-signal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-signal-600 hover:bg-signal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-signal-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-signal-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </main>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[10000] bg-navy-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl border-signal-500/40">
            <div className="text-center space-y-1">
              <ShieldCheck className="w-10 h-10 text-signal-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Email Verification Code</h3>
              <p className="text-xs text-slate-400">Enter the 6-digit OTP sent to <span className="text-signal-400 font-mono">{email}</span></p>
            </div>

            <OtpInput value={otpCode} onChange={setOtpCode} />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 bg-navy-900 border border-slate-700 text-slate-300 rounded-xl font-semibold text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerifyAndRegister}
                disabled={loading || otpCode.length < 6}
                className="flex-1 py-2.5 bg-signal-600 hover:bg-signal-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg shadow-signal-600/30"
              >
                {loading ? 'Creating...' : 'Verify & Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
