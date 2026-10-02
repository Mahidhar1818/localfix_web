import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Coins, LogOut, User as UserIcon, ShieldCheck, PhoneCall, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-navy-800/90 backdrop-blur-md border-b border-signal-500/20 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-signal-600 to-blue-400 flex items-center justify-center shadow-lg shadow-signal-500/30 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-signal-500 bg-clip-text text-transparent">
              Local<span className="text-signal-500">Fix</span>
            </span>
            <span className="block text-[10px] font-medium text-slate-400 tracking-wider uppercase">On-Demand Repair</span>
          </div>
        </Link>

        {/* Center / Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-signal-500 transition-colors">Home</Link>
          
          {user?.role === 'customer' && (
            <>
              <Link to="/customer-dashboard" className="hover:text-signal-500 transition-colors">Dashboard</Link>
              <Link to="/booking" className="hover:text-signal-500 transition-colors">Book Repair</Link>
              <Link to="/repair-history" className="hover:text-signal-500 transition-colors">History & Proof</Link>
              <Link to="/complaint" className="hover:text-signal-500 transition-colors">File Complaint</Link>
            </>
          )}

          {user?.role === 'technician' && (
            <>
              <Link to="/technician-dashboard" className="hover:text-signal-500 transition-colors">Job Feed</Link>
              <Link to="/earnings" className="hover:text-signal-500 transition-colors">Earnings & Wallet</Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/admin-dashboard" className="hover:text-signal-500 transition-colors">Admin Command Center</Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/apply-technician" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Become a Partner Tech
              </Link>
            </>
          )}
        </div>

        {/* Right Action Section */}
        <div className="flex items-center gap-3">
          
          {/* Google Translate Widget Container */}
          <div id="google_translate_element" className="scale-90"></div>

          {user ? (
            <div className="flex items-center gap-3">
              {/* LocalFix Coins Badge (For Customers) */}
              {user.role === 'customer' && (
                <div className="hidden sm:flex items-center gap-1.5 bg-navy-900/80 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-amber-400 shadow-inner">
                  <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>{user.coins || 50} Coins</span>
                </div>
              )}

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2 bg-navy-700/60 border border-slate-700/60 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-signal-600/30 text-signal-400 flex items-center justify-center font-bold text-xs uppercase border border-signal-500/30">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-slate-200 leading-none">{user.name}</p>
                  <p className="text-[10px] text-signal-400 font-medium capitalize mt-0.5">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="ml-2 text-slate-400 hover:text-rose-400 transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-signal-600 hover:bg-signal-500 rounded-xl shadow-lg shadow-signal-500/25 transition-all transform active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
