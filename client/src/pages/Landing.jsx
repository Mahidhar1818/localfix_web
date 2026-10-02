import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Sparkles, ShieldCheck, MapPin, Award, CheckCircle2, ArrowRight, PhoneCall, Zap, Clock, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-signal-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-signal-500/30 text-xs font-semibold text-signal-400">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Powered by Gemini AI FixMatch Diagnosis</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Home Appliance Repair,<br />
            <span className="bg-gradient-to-r from-signal-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              Simplified & Verified.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
            Get instant AI problem diagnosis, matched with top-rated background-checked technicians in your neighborhood. Track live GPS arrival and pay token deposit with 90-day warranty guarantee.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/booking"
              className="w-full sm:w-auto px-8 py-4 bg-signal-600 hover:bg-signal-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-signal-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <Wrench className="w-5 h-5" /> Book Repair Now
            </Link>

            <Link
              to="/apply-technician"
              className="w-full sm:w-auto px-8 py-4 glass-card hover:bg-navy-800 text-slate-200 font-bold text-sm rounded-2xl border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Apply as Technician
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-2xl text-center">
              <p className="text-2xl font-black text-signal-400">15,000+</p>
              <p className="text-xs text-slate-400 mt-1">Repairs Completed</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <p className="text-2xl font-black text-emerald-400">4.9 ★</p>
              <p className="text-xs text-slate-400 mt-1">Customer Rating</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <p className="text-2xl font-black text-amber-400">30 Min</p>
              <p className="text-xs text-slate-400 mt-1">Avg Tech Arrival</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center">
              <p className="text-2xl font-black text-indigo-400">90 Days</p>
              <p className="text-xs text-slate-400 mt-1">Free Service Warranty</p>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works (5-Step Flow) */}
      <section className="py-16 px-6 bg-navy-800/40 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How LocalFix Works</h2>
            <p className="text-xs text-slate-400 mt-2">5 simple steps from problem diagnosis to completed repair proof</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'AI FixMatch', desc: 'Type or voice describe your appliance issue for instant AI diagnosis & cost range.' },
              { step: '02', title: 'Tech Match', desc: 'Pick nearby Aadhaar-verified technicians sorted by ratings and distance.' },
              { step: '03', title: 'Token Deposit', desc: 'Pay ₹99 deposit to lock your preferred time slot. Adjusted in final bill.' },
              { step: '04', title: 'Live Tracking', desc: 'Track technician live movement on OpenStreetMap with masked phone chat.' },
              { step: '05', title: 'OTP Completion', desc: 'Inspect before/after proof photos, read 6-digit OTP code, and complete job.' }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl relative space-y-3 glass-card-hover">
                <span className="text-3xl font-black text-signal-500/40">{item.step}</span>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Customers Trust LocalFix</h2>
          <p className="text-xs text-slate-400 mt-2">Built with transparency, safety, and modern engineering</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-signal-600/20 text-signal-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">AI FixMatch Triage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Powered by Google Gemini to analyze symptoms, predict faulty components, and suggest troubleshooting steps before technician arrival.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">QuoteCompare Price Stats</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Never get overcharged. View historical part costs, labor benchmarks, and average repair charges in your neighborhood before booking.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Masked Phone Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Protect your privacy. Real-time in-app chat and virtual calling ensures your personal mobile number is never exposed.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
