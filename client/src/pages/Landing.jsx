import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Wrench, 
  MapPin, 
  Globe, 
  Bell, 
  User, 
  Coins, 
  Sparkles, 
  Mic, 
  Search, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  ChevronRight, 
  ArrowRight, 
  Star, 
  Calendar, 
  Home as HomeIcon, 
  Wind, 
  Tv, 
  Droplets, 
  Flame, 
  Grid, 
  Shield, 
  Clock 
} from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  // Auto-redirect logged-in users to dashboard if needed
  useEffect(() => {
    if (user) {
      if (user.role === 'customer') navigate('/customer-dashboard');
      else if (user.role === 'technician') navigate('/technician-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  // Appliance Services with clear visual vector icons (No people images for illiterate accessibility)
  const applianceServices = [
    {
      id: 'ac',
      name: 'AC & Gas Refill',
      icon: (
        <svg className="w-9 h-9 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
          <path d="M6 14v4M18 14v4M10 14v2M14 14v2" />
        </svg>
      ),
      bg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 'fridge',
      name: 'Fridge Cooling',
      icon: (
        <svg className="w-9 h-9 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="5" y1="10" x2="19" y2="10" />
          <line x1="9" y1="5" x2="9" y2="7" />
          <line x1="9" y1="14" x2="9" y2="17" />
        </svg>
      ),
      bg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 'washing',
      name: 'Washing Machine',
      icon: (
        <svg className="w-9 h-9 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <circle cx="12" cy="13" r="5" />
          <circle cx="12" cy="13" r="2" />
          <circle cx="8" cy="5" r="1" fill="currentColor" />
          <circle cx="11" cy="5" r="1" fill="currentColor" />
        </svg>
      ),
      bg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 'tv',
      name: 'TV Display',
      icon: <Tv className="w-9 h-9 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 'microwave',
      name: 'Microwave Oven',
      icon: (
        <svg className="w-9 h-9 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="15" rx="2" />
          <rect x="5" y="7" width="10" height="9" rx="1" />
          <circle cx="18" cy="8" r="1" fill="currentColor" />
          <circle cx="18" cy="12" r="1" fill="currentColor" />
          <line x1="6" y1="21" x2="18" y2="21" />
        </svg>
      ),
      bg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 'water',
      name: 'Water Purifier',
      icon: <Droplets className="w-9 h-9 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 'fan',
      name: 'Ceiling / Fan',
      icon: <Wind className="w-9 h-9 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100'
    },
    {
      id: 'more',
      name: 'More Items',
      icon: <Grid className="w-9 h-9 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FF] text-slate-900 pb-20 font-sans">
      
      {/* 1. TOP HEADER BAR matching Screenshot */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          
          {/* Logo Pill with Location */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-black text-slate-900 text-base leading-tight">
                LocalFix <span className="text-blue-600">•</span>
              </div>
              <div className="flex items-center text-[10px] text-slate-500 font-medium">
                <MapPin className="w-2.5 h-2.5 text-blue-600 mr-0.5" />
                Indiranagar, Beng... <span className="text-[8px] ml-0.5">▼</span>
              </div>
            </div>
          </div>

          {/* Right Action Tools: Language, Bell, Profile */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>EN / हिन्दी</span>
            </div>

            <button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs hover:bg-red-600">
              <Bell className="w-4 h-4" />
            </button>

            <Link to="/login" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">

        {/* 2. USER GREETING BANNER */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
              Hi, Rahul Sharma <span className="text-xl">👋</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Institutional Gold Tier • Indiranagar 100ft Rd
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
            <div className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[9px] font-black">
              🪙
            </div>
            <span>240 Coins</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* 3. EXPRESS DISPATCH BANNER */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              EXPRESS DISPATCH
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white leading-tight">
                  Need 30-min Urgent Repair?
                </h2>
                <p className="text-[11px] text-blue-200 font-medium mt-0.5">
                  Verified priority tech is on standby near Indiranagar
                </p>
              </div>

              <Link
                to="/booking"
                className="bg-white hover:bg-blue-50 text-blue-700 font-black text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-1 transition-transform active:scale-95 whitespace-nowrap"
              >
                Book Now <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. AI FIXMATCH ASSISTANT SEARCH & VOICE BAR */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200/80 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-[9px] text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
              AI FIXMATCH ASSISTANT <span className="text-slate-400">• Instant Triage</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe appliance issue or tap ..."
              className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
            />
          </div>
          <button 
            type="button"
            className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center shrink-0"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* 5. APPLIANCE SERVICES GRID (No people images, clear icons for illiterate users) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Appliance Services</h2>
            <Link to="/booking" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5">
              View All (18) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {applianceServices.map((item) => (
              <Link
                key={item.id}
                to="/booking"
                className="bg-white hover:bg-blue-50/50 border border-slate-200/70 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all shadow-2xs hover:border-blue-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 6. SUBTITLE BOOKING (₹99 TRUST DEPOSIT) CARD */}
        <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">
                Subtitle Booking (₹99 Trust Deposit)
              </h3>
              <p className="text-[11px] text-slate-600 font-medium leading-normal mt-0.5">
                Pay nominal ₹99 to confirm slot. <strong className="text-slate-900">100% refundable</strong> if no issue found, or directly adjusted against final repair labor bill.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-blue-200/60 text-[10px] font-bold text-blue-800">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              <span>No Hidden Surcharges</span>
            </div>
            <div className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3 text-blue-600" />
              <span>Zero-Fee Cancellation</span>
            </div>
          </div>
        </div>

        {/* 7. QUOTECOMPARE BENCHMARKS SECTION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-1">
                QuoteCompare™ Benchmarks
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Live transparent rates in Indiranagar</p>
            </div>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-200">
              ● Fair-Price Index
            </span>
          </div>

          <div className="space-y-2">
            {/* Rate Benchmark 1 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2 shadow-2xs">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-black text-lg">❄</span>
                  <span className="text-xs font-bold text-slate-900">AC Foam Jet Service & Gas Check</span>
                </div>
                <span className="text-xs font-black text-blue-600">₹499 - ₹899</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[65%] rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>Diagnostic Included</span>
                <span>Market Avg: ₹749</span>
              </div>
            </div>

            {/* Rate Benchmark 2 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2 shadow-2xs">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-black text-lg">⚙</span>
                  <span className="text-xs font-bold text-slate-900">Washing Machine PCB Repair</span>
                </div>
                <span className="text-xs font-black text-blue-600">₹1,200 - ₹2,400</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[80%] rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>90-Day LocalFix Warranty</span>
                <span>Market Avg: ₹1,850</span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. VERIFIED TECHS NEAR YOU SECTION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">Verified Techs Near You</h2>
              <p className="text-[10px] text-slate-500 font-medium">Background checked & skill assessed</p>
            </div>
            <Link to="/booking" className="text-xs text-blue-600 font-bold hover:underline">
              View on Map
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {/* Tech Card 1 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 min-w-[240px] space-y-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 border-2 border-blue-200">
                  MR
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900">Manish Rao</h3>
                  <p className="text-[10px] text-slate-500 font-medium">HVAC & Inverter AC Spec.</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>4.9</span>
                    <span className="text-slate-400 font-normal">(340+ jobs)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-700">
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                  ✓ Verified Uniform
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  ⏱ 15 mins away
                </span>
              </div>

              <Link
                to="/booking"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-xs"
              >
                Book Tech <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 9. LOCALFIX 90-DAY ASSURE FOOTER BANNER */}
        <div className="bg-white border border-blue-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">LocalFix 90-Day Assure</h4>
              <p className="text-[10px] text-slate-500 font-medium">Free re-visit if issue recurs within 3 months</p>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
        </div>

      </main>

      {/* 10. BOTTOM NAVIGATION BAR (Matching Demo UI Screenshot) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/80 px-6 py-2 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between text-[10px] font-bold text-slate-500">
          
          <Link to="/" className="flex flex-col items-center gap-0.5 text-blue-600">
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <Link to="/booking" className="flex flex-col items-center gap-0.5 hover:text-blue-600 transition-colors">
            <Sparkles className="w-5 h-5 text-slate-500" />
            <span>AI FixMatch</span>
          </Link>

          <Link to={user ? "/repair-history" : "/login"} className="flex flex-col items-center gap-0.5 hover:text-blue-600 transition-colors">
            <Calendar className="w-5 h-5 text-slate-500" />
            <span>My Bookings</span>
          </Link>

          <Link to="/apply-technician" className="flex flex-col items-center gap-0.5 hover:text-blue-600 transition-colors">
            <Wrench className="w-5 h-5 text-slate-500" />
            <span>Tech Hub</span>
          </Link>

        </div>
      </nav>

    </div>
  );
}
