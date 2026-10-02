import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { ShieldCheck, CheckCircle2, XCircle, Users, Wrench, ShieldAlert, DollarSign, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Approval Modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [approvalAction, setApprovalAction] = useState('approve');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsRes = await API.get('/admin/overview');
      setStats(statsRes.data);

      const appsRes = await API.get('/admin/technician-applications');
      setApplications(appsRes.data.applications || []);

      const compsRes = await API.get('/admin/complaints');
      setComplaints(compsRes.data.complaints || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessApplication = async () => {
    if (!selectedApp) return;
    setProcessing(true);
    try {
      if (approvalAction === 'approve') {
        const res = await API.post(`/admin/technician-applications/${selectedApp._id}/approve`);
        setToast({ type: 'success', message: `Approved! Generated Tech ID: ${res.data.technicianId}` });
      } else {
        await API.post(`/admin/technician-applications/${selectedApp._id}/reject`, { reason: 'Background check incomplete' });
        setToast({ type: 'info', message: 'Application rejected' });
      }
      setSelectedApp(null);
      fetchAdminData();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.error || 'Action failed' });
    } finally {
      setProcessing(false);
    }
  };

  const categoryData = [
    { name: 'AC', jobs: 42, color: '#3b82f6' },
    { name: 'Fridge', jobs: 28, color: '#10b981' },
    { name: 'Washing Machine', jobs: 35, color: '#f59e0b' },
    { name: 'TV', jobs: 19, color: '#6366f1' },
    { name: 'Electrical', jobs: 24, color: '#ec4899' }
  ];

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        
        {/* Admin Header */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-signal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div>
            <span className="text-xs font-mono font-bold text-signal-400 bg-signal-600/20 px-3 py-1 rounded-full border border-signal-500/30">
              ROLE: SYSTEM ADMINISTRATOR
            </span>
            <h1 className="text-2xl font-black text-white mt-1">Admin Command Center</h1>
            <p className="text-xs text-slate-400">Manage partner technician onboarding, job analytics, and customer dispute resolution.</p>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border-slate-700 text-center space-y-1">
            <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
            <p className="text-2xl font-black text-white">{stats?.totalCustomers || 128}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-slate-700 text-center space-y-1">
            <span className="text-xs text-slate-400 font-medium">Verified Technicians</span>
            <p className="text-2xl font-black text-emerald-400">{stats?.totalTechnicians || 24}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-slate-700 text-center space-y-1">
            <span className="text-xs text-slate-400 font-medium">Total Jobs Processed</span>
            <p className="text-2xl font-black text-signal-400">{stats?.totalJobs || 148}</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-slate-700 text-center space-y-1">
            <span className="text-xs text-slate-400 font-medium">Pending Tech Approvals</span>
            <p className="text-2xl font-black text-amber-400">{applications.filter(a => a.status === 'pending').length}</p>
          </div>
        </div>

        {/* Recharts Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4 border-slate-700">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-signal-400" /> Category Repair Demand Volume
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#3b82f6', borderRadius: '12px' }} />
                  <Bar dataKey="jobs" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4 border-slate-700">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Platform Revenue Share
            </h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="jobs" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Pending Technician Applications Table */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border-amber-500/30">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" /> Pending Partner Technician Applications
            </h3>
            <span className="text-xs text-amber-400 font-bold">{applications.filter(a => a.status === 'pending').length} Action Required</span>
          </div>

          {applications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No pending technician applications.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-navy-900 border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Aadhaar No.</th>
                    <th className="p-3">Skills</th>
                    <th className="p-3">Experience</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {applications.map(app => (
                    <tr key={app._id} className="hover:bg-navy-800/50">
                      <td className="p-3 font-bold text-white">{app.name}<br/><span className="text-[10px] text-slate-400 font-normal">{app.email}</span></td>
                      <td className="p-3 font-mono text-slate-300">{app.aadhaarNumber}</td>
                      <td className="p-3"><span className="bg-signal-600/20 text-signal-300 px-2 py-0.5 rounded text-[10px]">{app.skills?.join(', ')}</span></td>
                      <td className="p-3">{app.experienceYears} Years</td>
                      <td className="p-3"><span className="bg-amber-950 text-amber-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{app.status}</span></td>
                      <td className="p-3 text-right">
                        {app.status === 'pending' && (
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg shadow-md"
                          >
                            Review & Generate Tech ID
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Complaints Escalation Section */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border-rose-500/30">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" /> Customer Dispute & Complaint Logs
          </h3>

          {complaints.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No active complaints logged.</div>
          ) : (
            <div className="space-y-3">
              {complaints.map(comp => (
                <div key={comp._id} className="bg-navy-900 p-4 rounded-2xl border border-rose-500/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-rose-400">Target Tech ID: {comp.technicianId}</span>
                    <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-bold uppercase">{comp.status}</span>
                  </div>
                  <h4 className="font-bold text-white">{comp.subject}</h4>
                  <p className="text-slate-300">{comp.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approval Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-[10000] bg-navy-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl border-emerald-500/30">
              <h3 className="text-lg font-bold text-white text-center">Approve Application: {selectedApp.name}</h3>
              <p className="text-xs text-slate-400 text-center">
                Approving will automatically auto-generate a unique Technician ID (<span className="text-emerald-400 font-mono">LF-TECH-XXXX</span>) and email login credentials to <span className="text-white font-mono">{selectedApp.email}</span>.
              </p>

              <div className="flex bg-navy-900 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setApprovalAction('approve')}
                  className={`flex-1 py-2 rounded-lg ${approvalAction === 'approve' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                >
                  Approve & Issue ID
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalAction('reject')}
                  className={`flex-1 py-2 rounded-lg ${approvalAction === 'reject' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
                >
                  Reject Application
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 py-2.5 bg-navy-900 border border-slate-700 text-slate-300 rounded-xl font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessApplication}
                  disabled={processing}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30"
                >
                  {processing ? 'Processing...' : 'Confirm Action'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
      <Toast type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
    </div>
  );
}
