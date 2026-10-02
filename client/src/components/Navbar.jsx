import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, User, LogOut, Coins, ShieldCheck, LayoutDashboard, PlusCircle, History, AlertCircle, Wallet } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Extract first name dynamically
  const getFirstName = () => {
    if (!user) return '';
    if (user.firstName) return user.firstName;
    if (user.name) return user.name.split(' ')[0];
    return 'User';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Identity Logo */}
        <Link 
          to={
            !user ? '/' : 
            user.role === 'customer' ? '/customer-dashboard' : 
            user.role === 'technician' ? '/technician-dashboard' : 
            '/admin-dashboard'
          } 
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-signal-600 flex items-center justify-center text-white shadow-lg shadow-signal-600/30">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Local<span className="text-signal-400">Fix</span>
          </span>
        </Link>

        {/* Dynamic Navigation Links based on Login Status */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          {!user ? (
            <>
              <Link to="/" className="hover:text-signal-400 transition-colors">Home</Link>
              <a href="#how-it-works" className="hover:text-signal-400 transition-colors">How it Works</a>
              <a href="#appliances" className="hover:text-signal-400 transition-colors">Appliance Categories</a>
              <a href="#guarantee" className="hover:text-signal-400 transition-colors">90-Day Guarantee</a>
            </>
          ) : user.role === 'customer' ? (
            <>
              <Link to="/customer-dashboard" className="hover:text-signal-400 flex items-center gap-1">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <Link to="/booking" className="hover:text-signal-400 flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" /> Book AI Repair
              </Link>
              <Link to="/repair-history" className="hover:text-signal-400 flex items-center gap-1">
                <History className="w-3.5 h-3.5" /> Repair History & Warranty
              </Link>
              <Link to="/complaint" className="hover:text-signal-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> File Complaint
              </Link>
            </>
          ) : user.role === 'technician' ? (
            <>
              <Link to="/technician-dashboard" className="hover:text-signal-400 flex items-center gap-1">
                <LayoutDashboard className="w-3.5 h-3.5" /> Technician Portal
              </Link>
              <Link to="/earnings" className="hover:text-signal-400 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" /> Wallet & Earnings
              </Link>
            </>
          ) : (
            <>
              <Link to="/admin-dashboard" className="hover:text-signal-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Command Center
              </Link>
            </>
          )}
        </nav>

        {/* User Right Section */}
        <div className="flex items-center gap-4">
          
          {/* Google Translate Container */}
          <div id="google_translate_element" className="scale-90 opacity-90 hidden sm:block"></div>

          {user ? (
            <div className="flex items-center gap-3">
              
              {/* LocalFix Coins Badge for Customers */}
              {user.role === 'customer' && (
                <div className="hidden sm:flex items-center gap-1 bg-amber-950/60 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                  <Coins className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{user.coins || 100} Coins</span>
                </div>
              )}

              {/* User Name Greeting & Profile Pill */}
              <div className="flex items-center gap-2 bg-navy-900 border border-slate-700/80 px-3 py-1.5 rounded-full">
                <div className="w-6 h-6 rounded-full bg-signal-600/30 text-signal-400 flex items-center justify-center font-bold text-xs uppercase">
                  {getFirstName().charAt(0)}
                </div>
                <span className="text-xs font-bold text-white">
                  Hi, {getFirstName()}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-navy-900 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-signal-600 hover:bg-signal-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-signal-600/25 transition-all"
              >
                Register
              </Link>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
