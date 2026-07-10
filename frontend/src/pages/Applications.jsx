import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle2, XCircle, Clock, Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const COLUMNS = [
  { id: 'applied', label: 'Applied / In Review', icon: Clock, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { id: 'interview', label: 'Interviews Scheduled', icon: CheckCircle2, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { id: 'offer', label: 'Offer Received 🎉', icon: Award, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { id: 'rejected', label: 'Archived / Rejected', icon: XCircle, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
];

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [status, setStatus] = useState('applied');

  useEffect(() => {
    async function loadApps() {
      try {
        const res = await axios.get('/api/applications');
        if (Array.isArray(res.data)) {
          setApplications(res.data);
        }
      } catch (e) {
        console.error(e);
        toast.error('Failed to load application items.');
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) {
      toast.error('Please enter both Company and Job Title.');
      return;
    }
    try {
      const res = await axios.post('/api/applications', {
        companyName: companyName.trim(),
        roleTitle: roleTitle.trim(),
        status,
      });
      setApplications([res.data, ...applications]);
      setCompanyName('');
      setRoleTitle('');
      setShowModal(false);
      toast.success('Added new application to Kanban tracker!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create application.');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await axios.patch(`/api/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        setApplications(applications.map((a) => (a._id === appId || a.id === appId ? res.data.application : a)));
        toast.success(`Moved application to ${newStatus.toUpperCase()}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Loading Kanban Application Tracker...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Application Tracker (Kanban)</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track application progression across pipeline stages and link specific tailored resume versions.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 items-start">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);
          const Icon = col.icon;
          return (
            <div key={col.id} className="p-4 rounded-2xl bg-card border border-border/60 min-h-[480px] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg border ${col.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-foreground text-sm">{col.label}</h3>
                </div>
                <span className="w-6 h-6 rounded-full bg-secondary text-xs font-black flex items-center justify-center text-muted-foreground">
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colApps.length === 0 ? (
                  <div className="h-28 rounded-xl border-2 border-dashed border-border/40 flex items-center justify-center text-xs text-muted-foreground italic">
                    Empty Stage
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div key={app._id || app.id} className="p-4 rounded-xl bg-secondary/40 border border-border/60 hover:border-primary/40 transition-all space-y-3">
                      <div>
                        <h4 className="font-bold text-foreground text-sm leading-tight">{app.roleTitle}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{app.companyName}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                        <span>{new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id || app.id, e.target.value)}
                          className="bg-background border border-border rounded px-1.5 py-0.5 text-[10px] font-bold text-foreground focus:outline-none"
                        >
                          <option value="applied">Applied</option>
                          <option value="interview">Interview</option>
                          <option value="offer">Offer 🎉</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-2xl space-y-5">
            <h3 className="text-lg font-black text-foreground">Add Application Item</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Stripe / Netflix / Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="Senior Full Stack Engineer"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary font-semibold"
                >
                  <option value="applied">Applied / In Review</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="offer">Offer Received 🎉</option>
                  <option value="rejected">Archived / Rejected</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-md"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
