import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Cpu, Clock, Award, Star, ArrowRight, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect logged-in users away from Landing page directly to their role dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'customer') navigate('/customer-dashboard');
      else if (user.role === 'technician') navigate('/technician-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  const applianceCategories = [
    {
      name: 'Air Conditioner (AC)',
      img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      badge: 'Cooling & Gas Refill',
      desc: 'Split / Window AC repair, foamjet deep cleaning, & R32 gas charging.'
    },
    {
      name: 'Refrigerator (Fridge)',
      img: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
      badge: 'Compressor & Defrost',
      desc: 'Single/Double door cooling troubleshooting, thermostat & gas leak fix.'
    },
    {
      name: 'Washing Machine',
      img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80',
      badge: 'Drum & Spin Motors',
      desc: 'Front & Top load spin vibration, drainage error, & mother-board repair.'
    },
    {
      name: 'Smart Television (TV)',
      img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
      badge: '4K Display & Sound',
      desc: 'OLED/LED screen display vertical lines, motherboard & backlight replacement.'
    },
    {
      name: 'Ceiling Fan & Electricals',
      img: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
      badge: 'Wiring & Motors',
      desc: 'BLDC motor fan repairs, short-circuit rewiring, & switchboard installation.'
    }
  ];

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="space-y-20 pb-20">
        
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-signal-600/20 border border-signal-500/30 text-signal-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Gemini AI Diagnostic Triage • Instant Quote Benchmark</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
                Smart Home Appliance Repairs with <span className="text-gradient">90-Day Warranty</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect with verified local technicians in 15 minutes. AI FixMatch diagnoses your appliance issue, provides transparent price estimates, and locks in a flat ₹99 token deposit.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/booking"
                  className="w-full sm:w-auto px-8 py-4 bg-signal-600 hover:bg-signal-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-signal-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Book AI Appliance Repair Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/apply-technician"
                  className="w-full sm:w-auto px-6 py-4 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 font-semibold text-sm rounded-2xl transition-all text-center"
                >
                  Join as Technician Partner (LF-TECH)
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Background Checked</div>
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-signal-400" /> 15-Min Arrival</div>
                <div className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> 90-Day Guarantee</div>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-signal-600/30 to-purple-600/20 rounded-3xl blur-2xl -z-10"></div>
              <div className="glass-card p-6 sm:p-8 rounded-3xl border-slate-700 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Live AI FixMatch Preview</h3>
                    <p className="text-xs text-slate-400">Powered by Google Gemini 1.5</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase rounded-full">Active</span>
                </div>

                <div className="bg-navy-900 p-4 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>Symptom: Split AC not cooling & making buzzing sound</span>
                    <span className="text-amber-400">94% Confidence</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Probable Cause: Capacitor failure & condenser coil dust block.</div>
                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-800">
                    <span className="text-slate-300">Estimated Cost Range:</span>
                    <span className="text-signal-400">₹450 - ₹1,200</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-navy-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="block text-xl font-black text-white">4.9/5 ★</span>
                    <span className="text-[10px] text-slate-400">Over 14,800+ Verified Repairs</span>
                  </div>
                  <div className="bg-navy-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="block text-xl font-black text-emerald-400">₹99 Only</span>
                    <span className="text-[10px] text-slate-400">Token Deposit Lock-in</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FLIPKART-STYLE APPLIANCE CATEGORIES SECTION */}
        <section id="appliances" className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white">Explore Appliance Repair Categories</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">High-precision repairs by specialized certified technicians with genuine spare parts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applianceCategories.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-card rounded-3xl overflow-hidden border-slate-700/80 glass-card-hover flex flex-col justify-between group"
              >
                <div>
                  {/* High-Resolution Appliance Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-navy-950">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 bg-signal-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/booking"
                    className="w-full py-2.5 bg-navy-800 hover:bg-signal-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Select & Diagnose <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
