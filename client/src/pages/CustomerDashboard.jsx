import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Wrench, Sparkles, Coins, Clock, ArrowRight, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/jobs')
      .then(res => setActiveJobs(res.data.jobs || []))
      .catch(err => console.error('Jobs fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        
        {/* Welcome Greeting Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-signal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 z-10">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Hi, <span className="bg-gradient-to-r from-signal-400 to-blue-300 bg-clip-text text-transparent">{user?.name || 'Customer'}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Need home appliance repair today? AI FixMatch diagnosis & background-checked technicians ready.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <Link
              to="/booking"
              className="px-6 py-3.5 bg-signal-600 hover:bg-signal-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-signal-500/30 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Wrench className="w-4 h-4" /> Book a Technician Now
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 w-64 h-64 bg-signal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border-amber-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">LocalFix Coins Balance</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{user?.coins || 50} Coins</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Earn 15 coins on every completed repair</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Coins className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border-signal-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Bookings</p>
              <p className="text-2xl font-black text-signal-400 mt-1">{activeJobs.filter(j => j.status !== 'Completed').length}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Tracking live GPS status</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-signal-500/20 text-signal-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border-emerald-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Service Warranty Protection</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">90 Days</p>
              <p className="text-[10px] text-slate-500 mt-0.5">100% Free re-servicing guarantee</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Active & Recent Bookings List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-signal-500" /> Recent Appliance Bookings
            </h3>
            <Link to="/booking" className="text-xs font-semibold text-signal-400 hover:underline flex items-center gap-1">
              New Booking <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="glass-card p-8 rounded-2xl text-center text-xs text-slate-400">Loading your bookings...</div>
          ) : activeJobs.length === 0 ? (
            <div className="glass-card p-10 rounded-3xl text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-200">No Appliance Bookings Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Book your first AC, Fridge, or Washing Machine repair to try AI FixMatch diagnosis.</p>
              <Link to="/booking" className="inline-flex px-5 py-2.5 bg-signal-600 hover:bg-signal-500 text-white font-semibold text-xs rounded-xl transition-all">
                Book Repair Service
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJobs.map(job => (
                <div key={job._id} className="glass-card p-5 rounded-2xl space-y-3 border-slate-700/80 glass-card-hover">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-signal-400 bg-signal-600/20 px-3 py-1 rounded-full border border-signal-500/30">
                      {job.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                      job.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
                      job.status === 'In Progress' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                      'bg-blue-950 text-blue-400 border border-blue-500/40'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium line-clamp-2">{job.problemDescription}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Tech: {job.technicianId?.name || 'Assigning Tech...'}</span>
                    <span className="font-semibold text-white">Visit: ₹{job.visitCost}</span>
                  </div>

                  <Link
                    to={`/job-tracking/${job._id}`}
                    className="block w-full text-center py-2 bg-navy-900 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
                  >
                    Track Job & View Live Map
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
