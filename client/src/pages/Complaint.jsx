import React, { useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { ShieldAlert, Send, FileText, CheckCircle2 } from 'lucide-react';

export default function Complaint() {
  const [technicianId, setTechnicianId] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/complaint', { technicianId, subject, details });
      setSubmitted(true);
      setToast({ type: 'success', message: 'Complaint registered successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Could not submit complaint' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 py-12 w-full">
        <div className="glass-card p-8 rounded-3xl space-y-6 border-rose-500/30 shadow-2xl">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">File Formal Complaint</h2>
            <p className="text-xs text-slate-400">Our Admin Escalation Desk reviews all reports within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="bg-rose-950/40 border border-rose-500/40 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Complaint Registered</h3>
              <p className="text-xs text-slate-300">
                Ticket #CMP-{Date.now().toString().slice(-5)} has been logged. Admin will review technician <strong className="text-rose-400 font-mono">{technicianId}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Technician ID (e.g. LF-TECH-1024)</label>
                <input
                  type="text"
                  required
                  value={technicianId}
                  onChange={(e) => setTechnicianId(e.target.value.toUpperCase())}
                  placeholder="LF-TECH-XXXX"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 font-mono uppercase rounded-xl px-3.5 py-2.5 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject / Category</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Overcharging / Rude behavior / Unfinished repair"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Incident Report</label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide full description of what transpired..."
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl p-3 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> {loading ? 'Filing Complaint...' : 'Submit Complaint to Admin'}
              </button>
            </form>
          )}

        </div>
      </main>

      <Footer />
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
