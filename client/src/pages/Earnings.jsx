import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { DollarSign, Award, Flame, Wallet, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Earnings() {
  const [wallet, setWallet] = useState(0);
  const [toast, setToast] = useState(null);
  const [cashoutLoading, setCashoutLoading] = useState(false);

  useEffect(() => {
    API.get('/technicians/earnings')
      .then(res => setWallet(res.data.walletBalance || 4250))
      .catch(err => console.error('Earnings fetch error:', err));
  }, []);

  const handleCashout = () => {
    if (wallet <= 0) {
      setToast({ type: 'error', message: 'Insufficient wallet balance for payout' });
      return;
    }
    setCashoutLoading(true);
    setTimeout(() => {
      setWallet(0);
      setToast({ type: 'success', message: '₹' + wallet + ' transferred to your UPI bank account!' });
      setCashoutLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10 w-full space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">Technician Earnings & Instant Wallet</h1>
          <p className="text-xs text-slate-400">Track daily jobs, high-demand heatmaps, and payout instantly</p>
        </div>

        {/* Wallet Cashout Card */}
        <div className="glass-card p-8 rounded-3xl border-emerald-500/40 bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 justify-center sm:justify-start">
              <Wallet className="w-4 h-4" /> Available Wallet Balance
            </span>
            <p className="text-4xl font-black text-white">₹{wallet}</p>
            <p className="text-[10px] text-slate-400">Instant UPI payout available 24/7 with zero transfer fees</p>
          </div>

          <button
            onClick={handleCashout}
            disabled={cashoutLoading || wallet <= 0}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 transform active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" /> {cashoutLoading ? 'Processing UPI Transfer...' : 'Instant Payout to UPI'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border-slate-700 text-center space-y-2">
            <span className="text-xs text-slate-400 font-medium">This Week Earnings</span>
            <p className="text-2xl font-black text-signal-400">₹8,450</p>
            <p className="text-[10px] text-emerald-400">+14% vs last week</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border-slate-700 text-center space-y-2">
            <span className="text-xs text-slate-400 font-medium">Weekly Bonus Target</span>
            <p className="text-2xl font-black text-amber-400">12 / 15 Jobs</p>
            <p className="text-[10px] text-slate-400">Complete 3 more for ₹1,000 bonus</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border-slate-700 text-center space-y-2">
            <span className="text-xs text-slate-400 font-medium">Customer Rating</span>
            <p className="text-2xl font-black text-emerald-400">4.92 ★</p>
            <p className="text-[10px] text-slate-400">Based on 48 reviews</p>
          </div>
        </div>

        {/* Uber-Style High Demand Heatmap Mockup */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border-rose-500/30">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 animate-bounce" /> High Demand Surge Zones (1.5x Earnings)
            </h3>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-3 py-1 rounded-full border border-rose-500/40">LIVE</span>
          </div>

          <p className="text-xs text-slate-400">Position yourself near high-surge neighborhoods to get priority AC & Refrigerator repair dispatches.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-navy-900 p-4 rounded-2xl border border-rose-500/40 space-y-1">
              <h4 className="font-bold text-white text-xs">Madhapur & Gachibowli</h4>
              <span className="text-[10px] text-rose-400 font-semibold block">🔥 High Surge (1.8x Rate)</span>
              <p className="text-[10px] text-slate-400">18 pending AC repair requests</p>
            </div>

            <div className="bg-navy-900 p-4 rounded-2xl border border-amber-500/40 space-y-1">
              <h4 className="font-bold text-white text-xs">Jubilee Hills & Banjara Hills</h4>
              <span className="text-[10px] text-amber-400 font-semibold block">⚡ Moderate Surge (1.3x Rate)</span>
              <p className="text-[10px] text-slate-400">9 pending Washing Machine requests</p>
            </div>

            <div className="bg-navy-900 p-4 rounded-2xl border border-slate-700 space-y-1">
              <h4 className="font-bold text-white text-xs">Kukatpally & Miyapur</h4>
              <span className="text-[10px] text-emerald-400 font-semibold block">✓ Normal Demand (1.0x Rate)</span>
              <p className="text-[10px] text-slate-400">5 pending TV & Fan requests</p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
