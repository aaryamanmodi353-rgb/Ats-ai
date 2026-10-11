import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle2, XCircle, Clock, Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const COLUMNS = [
  { id: 'applied', label: 'Applied / In Review', icon: Clock, color: 'text-[#164e3f] border-[#d2e2d8] bg-[#e6f0ea]' },
  { id: 'interview', label: 'Interviews Scheduled', icon: CheckCircle2, color: 'text-amber-800 border-[#fde68a] bg-[#fffbeb]' },
  { id: 'offer', label: 'Offer Received 🎉', icon: Award, color: 'text-[#164e3f] border-[#c8ded1] bg-[#e6f0ea]' },
  { id: 'rejected', label: 'Archived / Rejected', icon: XCircle, color: 'text-rose-700 border-[#fecaca] bg-[#fef2f2]' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col items-center justify-center gap-4 text-[#5c6962]">
        <Loader2 className="w-8 h-8 animate-spin text-[#164e3f]" />
        <span className="font-semibold text-sm">Loading Kanban Application Tracker...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141c18] tracking-tight">Application Tracker (Kanban)</h1>
          <p className="text-sm text-[#5c6962] mt-1">
            Track application progression across pipeline stages and link specific tailored resume versions.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#164e3f] hover:bg-[#124235] text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all active:scale-[0.99]"
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
            <div key={col.id} className="p-4 rounded-2xl bg-white border border-[#e6e9e4] shadow-sm min-h-[480px] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#eef1ed] mb-4">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg border ${col.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-[#141c18] text-sm">{col.label}</h3>
                </div>
                <span className="w-6 h-6 rounded-full bg-[#f4f7f4] text-xs font-semibold flex items-center justify-center text-[#5c6962]">
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colApps.length === 0 ? (
                  <div className="h-28 rounded-xl border border-dashed border-[#dbe0d9] flex items-center justify-center text-xs text-[#5c6962] italic bg-[#fafbfa]">
                    Empty Stage
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div key={app._id || app.id} className="p-4 rounded-xl bg-[#fbfcfb] border border-[#e6e9e4] hover:border-[#164e3f] transition-all space-y-3 shadow-xs">
                      <div>
                        <h4 className="font-bold text-[#141c18] text-sm leading-tight">{app.roleTitle}</h4>
                        <p className="text-xs text-[#5c6962] mt-0.5">{app.companyName}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#eef1ed] text-[11px] text-[#5c6962]">
                        <span>{new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id || app.id, e.target.value)}
                          className="bg-white border border-[#e6e9e4] rounded px-2 py-0.5 text-[10px] font-semibold text-[#141c18] focus:outline-none focus:border-[#164e3f]"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-[#e6e9e4] shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-[#141c18]">Add Application Item</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5c6962] mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Stripe / Netflix / Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f7f9f7] border border-[#e6e9e4] text-sm text-[#141c18] focus:outline-none focus:border-[#164e3f]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5c6962] mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="Senior Full Stack Engineer"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f7f9f7] border border-[#e6e9e4] text-sm text-[#141c18] focus:outline-none focus:border-[#164e3f]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5c6962] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f7f9f7] border border-[#e6e9e4] text-sm text-[#141c18] focus:outline-none focus:border-[#164e3f] font-semibold"
                >
                  <option value="applied">Applied / In Review</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="offer">Offer Received 🎉</option>
                  <option value="rejected">Archived / Rejected</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eef1ed]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e6e9e4] text-xs font-semibold text-[#5c6962] hover:bg-[#f4f7f4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#164e3f] hover:bg-[#124235] text-white font-semibold text-xs shadow-sm transition-colors"
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
