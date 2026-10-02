import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { Award, Clock, Star, ShieldCheck, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function RepairHistory() {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Review Form state
  const [selectedJob, setSelectedJob] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    API.get('/jobs')
      .then(res => {
        const jobs = (res.data.jobs || []).filter(j => j.status === 'Completed');
        setCompletedJobs(jobs);
      })
      .catch(err => setToast({ type: 'error', message: 'Could not fetch repair history' }))
      .finally(() => setLoading(false));
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmittingReview(true);
    try {
      await API.post(`/jobs/${selectedJob._id}/review`, {
        rating,
        comment,
        isAnonymous
      });
      setToast({ type: 'success', message: 'Review submitted successfully! Thank you for rating your technician.' });
      setSelectedJob(null);
      // Refresh list
      const res = await API.get('/jobs');
      setCompletedJobs((res.data.jobs || []).filter(j => j.status === 'Completed'));
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Review submission failed' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const calculateRemainingWarranty = (completedAt) => {
    if (!completedAt) return 90;
    const end = new Date(completedAt);
    end.setDate(end.getDate() + 90);
    const now = new Date();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">Completed Repairs & Warranty Vault</h1>
          <p className="text-xs text-slate-400">90-Day Free Service Warranty Countdown & Verification Proofs</p>
        </div>

        {loading ? (
          <div className="glass-card p-8 rounded-2xl text-center text-xs text-slate-400">Loading repair history...</div>
        ) : completedJobs.length === 0 ? (
          <div className="glass-card p-10 rounded-3xl text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-200">No Completed Repairs Recorded</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Once a technician completes an appliance repair, your warranty vault and photo proofs will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {completedJobs.map(job => {
              const daysLeft = calculateRemainingWarranty(job.completedAt);
              return (
                <div key={job._id} className="glass-card p-6 rounded-3xl border-slate-700/80 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-signal-400 bg-signal-600/20 px-3 py-0.5 rounded-full border border-signal-500/30">
                          {job.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">#{job._id.slice(-6).toUpperCase()}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{job.problemDescription}</h3>
                    </div>

                    {/* Warranty Countdown Badge */}
                    <div className="bg-emerald-950/60 border border-emerald-500/40 px-4 py-2 rounded-2xl text-right">
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1 justify-end">
                        <Award className="w-3.5 h-3.5" /> 90-Day Service Warranty
                      </span>
                      <span className="text-lg font-black text-emerald-300">{daysLeft} Days Active</span>
                    </div>
                  </div>

                  {/* Photos & Financials */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Technician</span>
                      <p className="font-bold text-slate-200 flex items-center gap-1">
                        {job.technicianId?.name || 'LocalFix Partner'} <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </p>
                      <p className="text-[10px] text-slate-400">Total Bill Paid: <strong className="text-white">₹{job.totalCost || job.visitCost}</strong></p>
                    </div>

                    {/* Before/After Photo Thumbnails */}
                    <div className="md:col-span-2 flex items-center gap-3">
                      {job.beforePhotoUrl && (
                        <div className="relative group">
                          <img src={job.beforePhotoUrl} alt="Before" className="w-20 h-20 object-cover rounded-xl border border-slate-700" />
                          <span className="absolute bottom-1 left-1 bg-navy-900/80 text-[8px] font-bold px-1.5 py-0.5 rounded text-slate-300">BEFORE</span>
                        </div>
                      )}
                      {job.afterPhotoUrl && (
                        <div className="relative group">
                          <img src={job.afterPhotoUrl} alt="After" className="w-20 h-20 object-cover rounded-xl border border-emerald-500/40" />
                          <span className="absolute bottom-1 left-1 bg-emerald-950/80 text-[8px] font-bold px-1.5 py-0.5 rounded text-emerald-300">AFTER</span>
                        </div>
                      )}

                      {/* Review Status or Rate Button */}
                      <div className="ml-auto">
                        {job.reviewId ? (
                          <span className="text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" /> Reviewed
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
                          >
                            Rate Technician ★
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-[10000] bg-navy-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl border-amber-500/30">
              <h3 className="text-lg font-bold text-white text-center">Rate Technician Performance</h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-2 text-center">Star Rating (1 - 5 Stars)</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-2 transition-transform hover:scale-125"
                      >
                        <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Honest Feedback</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Technician arrived on time, was polite, and fixed the cooling issue fast..."
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl p-3 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anon"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="anon" className="text-slate-400 text-[11px]">Post as Verified Anonymous Customer</label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="flex-1 py-2.5 bg-navy-900 border border-slate-700 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
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
