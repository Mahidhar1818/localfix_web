import React from 'react';
import { Wrench, ShieldCheck, Clock, Award, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-slate-800 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-signal-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">LocalFix</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier technician marketplace for home appliance repair. Instant AI FixMatch diagnosis, verified technicians, and live tracking.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Our Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-signal-400 transition-colors">AC Repair & Servicing</a></li>
              <li><a href="#" className="hover:text-signal-400 transition-colors">Refrigerator Maintenance</a></li>
              <li><a href="#" className="hover:text-signal-400 transition-colors">Washing Machine Repair</a></li>
              <li><a href="#" className="hover:text-signal-400 transition-colors">Smart TV & Display Fix</a></li>
              <li><a href="#" className="hover:text-signal-400 transition-colors">Fan & Electrical Wiring</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Trust Signals</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Aadhaar Verified Technicians</li>
              <li className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> 90-Day Repair Warranty</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-signal-400" /> 60-Minute Rapid Arrival</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Customer Support</h4>
            <p className="text-xs leading-relaxed mb-3">Have a question or urgent issue? Contact our 24/7 hotline.</p>
            <div className="flex items-center gap-2 text-signal-400 font-bold text-sm">
              <PhoneCall className="w-4 h-4" /> 1800-LOCAL-FIX (Toll Free)
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LocalFix Technologies Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Technician Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
