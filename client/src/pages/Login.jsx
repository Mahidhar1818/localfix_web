import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { Lock, Mail, Wrench, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'technician'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = activeTab === 'technician' 
        ? { technicianId, password }
        : { email, password };

      const user = await login(payload);
      setToast({ type: 'success', message: `Welcome back, ${user.name}!` });

      setTimeout(() => {
        if (user.role === 'technician') navigate('/technician-dashboard');
        else if (user.role === 'admin') navigate('/admin-dashboard');
        else navigate('/customer-dashboard');
      }, 800);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Login failed. Check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    try {
      const user = await loginWithGoogle({
        email: 'customer.demo@localfix.com',
        name: 'Demo Customer',
        googleId: '123456789'
      });
      setToast({ type: 'success', message: 'Logged in with Google!' });
      navigate('/customer-dashboard');
    } catch (err) {
      setToast({ type: 'error', message: 'Google authentication failed' });
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-md w-full mx-auto px-6 py-12">
        <div className="glass-card p-8 rounded-3xl space-y-6 shadow-2xl border-signal-500/20">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-signal-600/20 text-signal-400 flex items-center justify-center mx-auto border border-signal-500/30">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">Log in to LocalFix</h2>
            <p className="text-xs text-slate-400">Select your account type to proceed</p>
          </div>

          {/* Account Type Tabs */}
          <div className="flex bg-navy-900 p-1 rounded-2xl border border-slate-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('customer')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'customer'
                  ? 'bg-signal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Customer Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('technician')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                activeTab === 'technician'
                  ? 'bg-signal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Technician ID Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'customer' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-signal-500 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Technician ID (e.g. LF-TECH-1024)</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value.toUpperCase())}
                    placeholder="LF-TECH-XXXX"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-signal-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-signal-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-signal-600 hover:bg-signal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-signal-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              {loading ? 'Logging in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {activeTab === 'customer' && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase text-slate-500 bg-navy-800 px-2 font-semibold">Or continue with</div>
              </div>

              <button
                onClick={handleGoogleMock}
                type="button"
                className="w-full py-2.5 bg-navy-900 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.31 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
                Sign in with Google
              </button>
            </>
          )}

          <p className="text-center text-xs text-slate-400 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-signal-400 font-semibold hover:underline">
              Create Customer Account
            </Link>
          </p>

        </div>
      </div>

      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
