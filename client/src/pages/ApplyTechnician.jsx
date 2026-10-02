import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { ShieldCheck, User, Mail, Phone, Award, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export default function ApplyTechnician() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadhaarNumber: '',
    gender: 'Male',
    age: 28,
    dob: '1998-06-15',
    experienceYears: 4,
    address: '',
    skills: ['AC Repair', 'Fridge Repair']
  });

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableSkills = ['AC Repair', 'Fridge Repair', 'Washing Machine', 'TV Repair', 'Fan & Electrical', 'Plumbing'];

  const handleSkillToggle = (skill) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      const updated = exists ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill];
      return { ...prev, skills: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/technicians/apply', formData);
      setSubmitted(true);
      setToast({ type: 'success', message: res.data.message });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Application submission failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-2xl w-full mx-auto px-6 py-12">
        <div className="glass-card p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl border-emerald-500/30">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white">Join LocalFix as Partner Technician</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Earn high daily income, get priority job matching, weekly bonuses, and instant wallet cash-out.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-6 rounded-2xl text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                Our Admin Team is reviewing your Aadhaar and background details. Once approved, your unique <strong className="text-signal-400 font-mono">Technician ID (LF-TECH-XXXX)</strong> and temporary password will be sent to your email (<span className="text-emerald-300 font-mono">{formData.email}</span>).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Suresh Kumar"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address (For Credentials)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="suresh@example.com"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">12-Digit Aadhaar Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={formData.aadhaarNumber}
                    onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                    placeholder="1234 5678 9012"
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 font-mono rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    min={18}
                    max={75}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Appliance Repair Specializations (Select Skills)</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => {
                    const selected = formData.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selected
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-navy-900 border border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {skill} {selected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, Postal Code"
                  className="w-full bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
              >
                {loading ? 'Submitting Application...' : 'Submit Technician Application'}
              </button>
            </form>
          )}

        </div>
      </div>

      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
