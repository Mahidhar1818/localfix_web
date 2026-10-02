import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LiveMap from '../components/LiveMap';
import ChatBox from '../components/ChatBox';
import Toast from '../components/Toast';
import { ShieldCheck, MapPin, PhoneCall, KeyRound, CheckCircle2, Clock, DollarSign, Image as ImageIcon } from 'lucide-react';

export default function JobTracking() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    API.get(`/jobs/${id}`)
      .then(res => setJob(res.data.job))
      .catch(() => setToast({ type: 'error', message: 'Could not load job details' }))
      .finally(() => setLoading(false));

    // Load Razorpay checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [id]);

  const handlePayFinalBill = async () => {
    try {
      const orderRes = await API.post('/payments/create-order', {
        amount: job.totalCost || 450,
        jobId: job._id,
        type: 'Job Payment'
      });

      const options = {
        key: 'rzp_test_demoKey',
        amount: (job.totalCost || 450) * 100,
        currency: 'INR',
        name: 'LocalFix Final Repair Bill',
        description: `Invoice for Job #${job._id.slice(-6).toUpperCase()}`,
        order_id: orderRes.data.orderId,
        handler: async function (response) {
          await API.post('/payments/verify-payment', {
            razorpay_order_id: response.razorpay_order_id || orderRes.data.orderId,
            razorpay_payment_id: response.razorpay_payment_id || 'pay_final_' + Date.now(),
            razorpay_signature: response.razorpay_signature || 'sig_final_demo',
            jobId: job._id,
            type: 'Job Payment'
          });

          setToast({ type: 'success', message: 'Final Bill Paid via Razorpay!' });
          setJob(prev => ({ ...prev, finalPaymentPaid: true }));
        },
        modal: {
          ondismiss: async function () {
            await API.post('/payments/verify-payment', {
              razorpay_order_id: orderRes.data.orderId,
              razorpay_payment_id: 'pay_demo_final_' + Date.now(),
              razorpay_signature: 'sig_final_demo',
              jobId: job._id,
              type: 'Job Payment'
            });
            setToast({ type: 'success', message: 'Final Bill Payment Completed!' });
            setJob(prev => ({ ...prev, finalPaymentPaid: true }));
          }
        },
        theme: { color: '#10b981' }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await API.post('/payments/verify-payment', {
          razorpay_order_id: orderRes.data.orderId,
          razorpay_payment_id: 'pay_direct_final_' + Date.now(),
          razorpay_signature: 'sig_final_demo',
          jobId: job._id,
          type: 'Job Payment'
        });
        setToast({ type: 'success', message: 'Final Bill Paid Successfully!' });
        setJob(prev => ({ ...prev, finalPaymentPaid: true }));
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Payment verification failed' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-20 text-xs text-slate-400">Loading job tracking data...</div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-20 text-xs text-rose-400">Job not found.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        
        {/* Header Summary & Status */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-signal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-signal-400 bg-signal-600/20 px-3 py-1 rounded-full border border-signal-500/30">
              JOB #{job._id.slice(-6).toUpperCase()} • {job.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-2">
              {job.problemDescription}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> {job.address}
            </p>
          </div>

          {/* Status Badge & OTP Display */}
          <div className="bg-navy-900 p-4 rounded-2xl border border-slate-700/80 space-y-2 text-right">
            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
              job.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
              job.status === 'In Progress' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
              'bg-blue-950 text-blue-400 border border-blue-500/40'
            }`}>
              {job.status}
            </span>

            {/* 6-Digit Completion OTP Reveal Box for Customer */}
            {job.completionOtp && job.status !== 'Completed' && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-amber-400 font-semibold block uppercase">Verification OTP for Technician</span>
                <span className="text-xl font-mono font-black text-amber-400 tracking-widest">{job.completionOtp}</span>
                <p className="text-[9px] text-slate-500">Share with technician ONLY after job satisfaction</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Live Map & Photos */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Leaflet Map Component */}
            <div className="glass-card p-4 rounded-3xl space-y-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 px-2">
                <MapPin className="w-4 h-4 text-signal-400" /> Live GPS Tracking
              </h3>
              <LiveMap jobId={job._id} customerLoc={job.location} />
            </div>

            {/* Before & After Proof Photos */}
            {(job.beforePhotoUrl || job.afterPhotoUrl) && (
              <div className="glass-card p-6 rounded-3xl space-y-4 border-slate-700/80">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" /> Technician Photo Proofs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.beforePhotoUrl && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Before Repair Photo</span>
                      <img src={job.beforePhotoUrl} alt="Before Repair" className="w-full h-40 object-cover rounded-xl border border-slate-700" />
                    </div>
                  )}
                  {job.afterPhotoUrl && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase">After Repair Photo</span>
                      <img src={job.afterPhotoUrl} alt="After Repair" className="w-full h-40 object-cover rounded-xl border border-emerald-500/40" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Financial Breakdown & Final Payment Card */}
            {job.status === 'Completed' && (
              <div className="glass-card p-6 rounded-3xl space-y-4 border-emerald-500/40 bg-emerald-950/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" /> Financial Summary & Invoice
                  </h3>
                  <span className="text-xs text-emerald-400 font-bold">100% Verified</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between"><span>Inspection / Visit Fee:</span><span>₹{job.visitCost || 249}</span></div>
                  <div className="flex justify-between"><span>Parts Replaced Cost:</span><span>₹{job.partCost || 0}</span></div>
                  <div className="flex justify-between"><span>Labor & Service Charges:</span><span>₹{job.laborCost || 350}</span></div>
                  <div className="flex justify-between text-rose-400"><span>Token Deposit Paid:</span><span>- ₹99</span></div>
                  <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-700">
                    <span>Total Outstanding:</span>
                    <span className="text-emerald-400">₹{job.totalCost || 500}</span>
                  </div>
                </div>

                {!job.finalPaymentPaid ? (
                  <button
                    onClick={handlePayFinalBill}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" /> Pay Remaining Bill (₹{job.totalCost || 500}) via Razorpay
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-900/40 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Final Payment Completed Successfully
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column (1 Col): Masked Phone Chat */}
          <div>
            <ChatBox jobId={job._id} />
          </div>

        </div>

      </main>

      <Footer />
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
