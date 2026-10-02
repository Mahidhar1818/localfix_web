import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { Wrench, Sparkles, ShieldCheck, MapPin, Calendar, Clock, DollarSign, ArrowRight, Star, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Booking() {
  const [category, setCategory] = useState('AC');
  const [problemDescription, setProblemDescription] = useState('');
  const [aiDiagnosis, setAiDiagnosis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [quoteStats, setQuoteStats] = useState(null);

  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState('Flat 402, Green Valley Apartments, Madhapur, Hyderabad');

  const [toast, setToast] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();

  const categories = ['AC', 'Fridge', 'Washing Machine', 'TV', 'Fan & Electrical', 'Plumbing'];

  // Fetch Technicians for selected category
  useEffect(() => {
    API.get(`/technicians?skill=${encodeURIComponent(category)}`)
      .then(res => setTechnicians(res.data.technicians || []))
      .catch(err => console.error('Fetch tech error:', err));

    API.get(`/repairs/stats?category=${encodeURIComponent(category)}`)
      .then(res => setQuoteStats(res.data))
      .catch(err => console.error('Fetch stats error:', err));
  }, [category]);

  // AI FixMatch Triage Trigger
  const handleAiDiagnose = async () => {
    if (problemDescription.length < 5) {
      setToast({ type: 'error', message: 'Please enter at least 5 characters describing the symptom' });
      return;
    }
    setAiLoading(true);
    try {
      const res = await API.post('/ai/diagnose', { problemDescription: `${category} Issue: ${problemDescription}` });
      setAiDiagnosis(res.data.diagnosis);
      setToast({ type: 'success', message: 'Gemini AI FixMatch analysis complete!' });
    } catch (err) {
      setToast({ type: 'error', message: 'AI diagnosis failed. Proceeding with standard booking.' });
    } finally {
      setAiLoading(false);
    }
  };

  // Submit Booking & Token Deposit
  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    try {
      const bookingData = {
        category,
        problemDescription: problemDescription || `${category} Repair Request`,
        technicianId: selectedTech?._id || (technicians[0]?._id),
        address,
        scheduledDate,
        scheduledTime,
        aiDiagnosis: aiDiagnosis ? JSON.stringify(aiDiagnosis) : null
      };

      const res = await API.post('/jobs/book', bookingData);
      const job = res.data.job;

      // Create Razorpay Order for ₹99 Token Deposit
      const orderRes = await API.post('/payments/create-order', { amount: 99, jobId: job._id, type: 'Token Deposit' });

      // Simulated Payment Verification for seamless demo
      await API.post('/payments/verify-payment', {
        razorpay_order_id: orderRes.data.orderId,
        razorpay_payment_id: 'pay_demo_' + Date.now(),
        razorpay_signature: 'sig_demo',
        jobId: job._id,
        type: 'Token Deposit'
      });

      setToast({ type: 'success', message: '₹99 Token Deposit Paid! Booking Confirmed.' });
      setTimeout(() => navigate(`/job-tracking/${job._id}`), 1000);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Booking failed' });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black">Book Home Appliance Repair</h1>
          <p className="text-xs sm:text-sm text-slate-400">AI FixMatch Symptom Triage & Verified Local Technicians</p>
        </div>

        {/* Step 1: Select Category */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border-signal-500/20">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-signal-600 text-white flex items-center justify-center text-xs">1</span>
            Select Appliance Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-2xl text-xs font-bold text-center transition-all ${
                  category === cat
                    ? 'bg-signal-600 text-white shadow-lg shadow-signal-500/30 ring-2 ring-signal-400'
                    : 'bg-navy-900/80 border border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: AI FixMatch Triage */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border-amber-500/30">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold">2</span>
              AI FixMatch Symptom Triage (Powered by Gemini)
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Smart Diagnosis
            </span>
          </div>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="e.g., Washing machine makes a loud grinding noise during the spin cycle and water isn't draining completely..."
              className="w-full bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-2xl p-4 text-xs focus:border-amber-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={handleAiDiagnose}
              disabled={aiLoading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {aiLoading ? 'Gemini Analyzing Symptoms...' : 'Analyze Symptoms with AI'}
            </button>
          </div>

          {/* AI Diagnosis Result Card */}
          {aiDiagnosis && (
            <div className="mt-4 bg-navy-900/90 border border-amber-500/40 p-5 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-amber-400 flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Diagnostic Summary
              </h4>
              <p className="text-slate-300"><strong className="text-white">Possible Issue:</strong> {aiDiagnosis.possibleIssue}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400">
                <div className="bg-navy-800 p-3 rounded-xl border border-slate-700">
                  <span className="block font-semibold text-slate-200">Recommended Parts:</span>
                  {aiDiagnosis.recommendedParts?.join(', ') || 'Standard Inspection Required'}
                </div>
                <div className="bg-navy-800 p-3 rounded-xl border border-slate-700">
                  <span className="block font-semibold text-amber-400">Estimated Repair Cost Range:</span>
                  ₹{aiDiagnosis.estimatedCostRange?.min || 350} - ₹{aiDiagnosis.estimatedCostRange?.max || 1200}
                </div>
              </div>

              {aiDiagnosis.troubleshootingTips && (
                <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-amber-200 text-[11px]">
                  <strong>💡 DIY Tip:</strong> {aiDiagnosis.troubleshootingTips[0]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* QuoteCompare Historical Price Stats Banner */}
        {quoteStats && (
          <div className="glass-card p-5 rounded-2xl border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" /> QuoteCompare Price Transparency Benchmark
              </h4>
              <p className="text-slate-400">Average local repair cost for {category}: ₹{quoteStats.averageTotalCost}</p>
            </div>
            <div className="flex gap-4 text-center">
              <div className="bg-navy-900 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-500 block">Avg Parts</span>
                <span className="font-bold text-slate-200">₹{quoteStats.averagePartCost}</span>
              </div>
              <div className="bg-navy-900 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-500 block">Avg Labor</span>
                <span className="font-bold text-slate-200">₹{quoteStats.averageLaborCost}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Select Verified Technician */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border-emerald-500/30">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center text-xs font-bold">3</span>
            Select Aadhaar-Verified Technician
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {technicians.map(tech => {
              const isSelected = selectedTech?._id === tech._id;
              return (
                <div
                  key={tech._id}
                  onClick={() => setSelectedTech(tech)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all space-y-2 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500 shadow-xl'
                      : 'bg-navy-900 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        {tech.name} <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </h4>
                      <p className="text-[10px] text-signal-400 font-mono mt-0.5">{tech.technicianId}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {tech.rating || 4.9}
                      </span>
                      <span className="text-[10px] text-slate-400">{tech.completedJobs || 32} jobs</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>{tech.experienceYears || 4} Yrs Exp</span>
                    <span className="text-emerald-400 font-semibold">Verified Aadhaar</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Schedule & Token Deposit (₹99) */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5 border-signal-500/30">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-signal-600 text-white flex items-center justify-center text-xs font-bold">4</span>
            Schedule & ₹99 Token Deposit
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preferred Service Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:border-signal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Arrival Time Slot</label>
              <select
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:border-signal-500 focus:outline-none"
              >
                <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Service Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:border-signal-500 focus:outline-none"
            />
          </div>

          <div className="bg-navy-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="block font-bold text-white">Token Booking Deposit</span>
              <span className="text-[10px] text-slate-400">Guarantees technician slot. Adjusted in final bill.</span>
            </div>
            <span className="text-xl font-black text-signal-400">₹99</span>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={bookingLoading}
            className="w-full py-4 bg-signal-600 hover:bg-signal-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-xl shadow-signal-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            {bookingLoading ? 'Processing Token Payment...' : 'Pay ₹99 Token Deposit & Confirm Booking'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      <Footer />
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
