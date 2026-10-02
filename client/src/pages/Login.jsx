import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, ShieldCheck, UserCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'technician'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-redirect logged-in users away from Login page directly to their role dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'customer') navigate('/customer-dashboard');
      else if (user.role === 'technician') navigate('/technician-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { role: activeTab, password };
      if (activeTab === 'customer') {
        payload.email = email;
      } else {
        payload.technicianId = technicianId.toUpperCase();
      }

      const res = await API.post('/auth/login', payload);
      login(res.data.token, res.data.user);

      setToast({ type: 'success', message: `Welcome back, ${res.data.user.name || 'Partner'}!` });
      setTimeout(() => {
        if (res.data.user.role === 'admin') navigate('/admin-dashboard');
        else if (res.data.user.role === 'technician') navigate('/technician-dashboard');
        else navigate('/customer-dashboard');
      }, 800);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Direct Google OAuth redirect URL
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=demo_client_id&redirect_uri=' + encodeURIComponent(window.location.origin + '/login') + '&scope=email%20profile';
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-md mx-auto px-6 py-16 w-full">
        <div className="glass-card p-8 rounded-3xl space-y-6 shadow-2xl border-signal-500/30">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-signal-600/20 text-signal-400 flex items-center justify-center mx-auto border border-signal-500/30">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">Sign In to LocalFix</h2>
            <p className="text-xs text-slate-400">Access your repair bookings, warranty vault, and earnings</p>
          </div>

          {/* Role Toggle Tabs */}
          <div className="flex bg-navy-900 p-1 rounded-xl text-xs font-semibold border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('customer')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'customer'
                  ? 'bg-signal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('technician')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'technician'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Technician Partner
            </button>
          </div>

          {/* Google Sign In Button for Customers */}
          {activeTab === 'customer' && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-slate-800"></div>
                <span className="px-3 text-[10px] text-slate-500 uppercase font-bold">Or Email Login</span>
                <div className="flex-1 border-t border-slate-800"></div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {activeTab === 'customer' ? (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl pl-9 pr-3 py-2.5 focus:border-signal-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Technician Partner ID</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                    placeholder="LF-TECH-1024"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 font-mono uppercase rounded-xl pl-9 pr-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl pl-9 pr-3 py-2.5 focus:border-signal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-bold text-xs rounded-xl shadow-lg transition-all ${
                activeTab === 'customer'
                  ? 'bg-signal-600 hover:bg-signal-500 text-white shadow-signal-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {loading ? 'Authenticating...' : `Sign In as ${activeTab === 'customer' ? 'Customer' : 'Technician'}`}
            </button>
          </form>

          {activeTab === 'customer' && (
            <p className="text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-signal-400 font-bold hover:underline">
                Register Free
              </Link>
            </p>
          )}

        </div>
      </main>

      <Footer />
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
