import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ToggleLeft, ToggleRight, MapPin, Wrench, Clock, CheckCircle2, KeyRound, Upload, DollarSign } from 'lucide-react';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [jobFeed, setJobFeed] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Job execution state
  const [activeJob, setActiveJob] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [partCost, setPartCost] = useState(0);
  const [laborCost, setLaborCost] = useState(350);
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const feedRes = await API.get('/technicians/feed');
      setJobFeed(feedRes.data.availableJobs || []);

      const jobsRes = await API.get('/jobs');
      setMyJobs(jobsRes.data.jobs || []);
    } catch (err) {
      console.error('Tech fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await API.patch('/technicians/availability', { isAvailable: !isAvailable });
      setIsAvailable(res.data.isAvailable);
      setToast({ type: 'info', message: `Status updated to ${res.data.isAvailable ? 'ONLINE' : 'OFFLINE'}` });
    } catch (err) {
      setToast({ type: 'error', message: 'Could not toggle availability' });
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      await API.post(`/technicians/jobs/${jobId}/accept`);
      setToast({ type: 'success', message: 'Job Accepted! Live GPS tracking activated.' });
      fetchData();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Could not accept job' });
    }
  };

  const handleCompleteJob = async (e) => {
    e.preventDefault();
    if (!activeJob) return;
    setActionLoading(true);
    try {
      // 1. Upload photos if provided
      let beforeUrl = activeJob.beforePhotoUrl;
      let afterUrl = activeJob.afterPhotoUrl;

      if (beforePhoto) {
        const formData = new FormData();
        formData.append('photo', beforePhoto);
        formData.append('type', 'before');
        const upRes = await API.post(`/jobs/${activeJob._id}/photos`, formData);
        beforeUrl = upRes.data.job.beforePhotoUrl;
      }

      if (afterPhoto) {
        const formData = new FormData();
        formData.append('photo', afterPhoto);
        formData.append('type', 'after');
        const upRes = await API.post(`/jobs/${activeJob._id}/photos`, formData);
        afterUrl = upRes.data.job.afterPhotoUrl;
      }

      // 2. Complete Job with 6-digit OTP verification
      await API.post(`/jobs/${activeJob._id}/complete`, {
        otp: otpCode,
        partCost: Number(partCost),
        laborCost: Number(laborCost)
      });

      setToast({ type: 'success', message: 'Job Marked Completed! ₹' + (Number(partCost) + Number(laborCost) + activeJob.visitCost) + ' credited to your wallet.' });
      setActiveJob(null);
      fetchData();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'OTP Verification failed' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        
        {/* Header Banner & Availability Toggle */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
              ID: {user?.technicianId || 'LF-TECH-1024'}
            </span>
            <h1 className="text-2xl font-black text-white mt-1">Technician Partner Portal</h1>
            <p className="text-xs text-slate-400">Accept nearby jobs, update repair costs, and verify customer 6-digit OTPs.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300">Duty Status:</span>
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                isAvailable
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-rose-950 text-rose-300 border border-rose-500/40'
              }`}
            >
              {isAvailable ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {isAvailable ? 'ONLINE (Receiving Jobs)' : 'OFFLINE'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Available Job Feed */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-signal-400" /> Nearby Job Feed
            </h3>

            {jobFeed.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center text-xs text-slate-400">
                No unassigned jobs in your vicinity right now. Keep your app ONLINE.
              </div>
            ) : (
              jobFeed.map(job => (
                <div key={job._id} className="glass-card p-5 rounded-2xl border-slate-700 space-y-3 glass-card-hover">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-signal-400 bg-signal-600/20 px-3 py-1 rounded-full border border-signal-500/30">
                      {job.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Visit Fee: ₹{job.visitCost}</span>
                  </div>

                  <p className="text-xs text-slate-200">{job.problemDescription}</p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> {job.address}
                  </div>

                  <button
                    onClick={() => handleAcceptJob(job._id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
                  >
                    Accept Job & Activate Live GPS
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Column 2: Assigned Jobs & OTP Completion Form */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> My Assigned Jobs
            </h3>

            {myJobs.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center text-xs text-slate-400">
                You currently have no active assigned jobs.
              </div>
            ) : (
              myJobs.map(job => (
                <div key={job._id} className="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">JOB #{job._id.slice(-6).toUpperCase()}</span>
                    <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                      {job.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{job.problemDescription}</p>
                  <p className="text-[10px] text-slate-400">Customer Address: {job.address}</p>

                  {job.status !== 'Completed' && (
                    <button
                      onClick={() => setActiveJob(job)}
                      className="w-full py-2 bg-signal-600 hover:bg-signal-500 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      Open Repair & OTP Verification Window
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

        {/* Modal: Job Execution & OTP Verification */}
        {activeJob && (
          <div className="fixed inset-0 z-[10000] bg-navy-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-5 shadow-2xl border-emerald-500/30">
              <h3 className="text-lg font-bold text-white text-center">Complete Job #{activeJob._id.slice(-6).toUpperCase()}</h3>

              <form onSubmit={handleCompleteJob} className="space-y-4 text-xs">
                
                {/* 6-Digit OTP Entry */}
                <div>
                  <label className="block text-amber-400 font-bold mb-1 flex items-center gap-1">
                    <KeyRound className="w-4 h-4" /> Ask Customer for 6-Digit Verification OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP code..."
                    className="w-full bg-navy-900 border-2 border-amber-500/60 font-mono text-center text-lg tracking-widest text-amber-400 rounded-xl py-2 focus:outline-none"
                  />
                </div>

                {/* Part & Labor Costs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Spare Parts Cost (₹)</label>
                    <input
                      type="number"
                      value={partCost}
                      onChange={(e) => setPartCost(e.target.value)}
                      className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Labor Charge (₹)</label>
                    <input
                      type="number"
                      value={laborCost}
                      onChange={(e) => setLaborCost(e.target.value)}
                      className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                {/* Photo Proof Upload Simulation */}
                <div className="space-y-2">
                  <label className="block text-slate-300 font-semibold">Upload Repair Photo Proofs</label>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 border border-dashed border-slate-700 rounded-xl text-center">
                      <span>Before Photo</span>
                    </div>
                    <div className="p-2 border border-dashed border-emerald-500/40 rounded-xl text-center text-emerald-300">
                      <span>After Repair Photo</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveJob(null)}
                    className="flex-1 py-2.5 bg-navy-900 border border-slate-700 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30"
                  >
                    {actionLoading ? 'Verifying OTP...' : 'Verify OTP & Finish Job'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
