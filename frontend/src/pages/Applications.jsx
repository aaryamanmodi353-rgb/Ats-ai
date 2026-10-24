import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle2, XCircle, Clock, Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import CompanyLogo from '../components/CompanyLogo';

const COLUMNS = [
  { id: 'applied', label: 'Applied / In Review', icon: Clock, color: 'text-[#5520a5] border-[#dfd1f0] bg-[#f0e8fa]' },
  { id: 'interview', label: 'Interviews Scheduled', icon: CheckCircle2, color: 'text-amber-800 border-[#fde68a] bg-[#fffbeb]' },
  { id: 'offer', label: 'Offer Received 🎉', icon: Award, color: 'text-[#5520a5] border-[#d9c5ef] bg-[#f0e8fa]' },
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
      <div className="tracker-page relative isolate flex-1">
        <div className="dashboard-outer relative z-10 mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
          <div className="dashboard-reference-frame">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col items-center justify-center gap-4 text-[#716b79]">
              <Loader2 className="w-8 h-8 animate-spin text-[#5520a5]" />
              <span className="font-semibold text-sm">Loading Kanban Application Tracker...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tracker-page relative isolate flex-1">
      <div className="dashboard-outer relative z-10 mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="dashboard-reference-frame">
          <div className="tracker-shell relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col">
      <div className="tracker-heading-row flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="tracker-eyebrow">APPLICATIONS / PIPELINE</div>
          <h1 className="tracker-title text-2xl sm:text-3xl font-extrabold tracking-tight">Application Tracker</h1>
          <p className="tracker-subtitle text-sm mt-1">
            Track application progression across pipeline stages and link specific tailored resume versions.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="tracker-add-button px-5 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="tracker-board grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 items-start">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);
          const Icon = col.icon;
          return (
            <div key={col.id} className={`tracker-column tracker-column-${col.id} p-4 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm min-h-[480px] flex flex-col`}>
              <div className="tracker-column-heading flex items-center justify-between pb-3 border-b border-[#f0ebf3] mb-4">
                <div className="flex items-center gap-2">
                  <span className={`tracker-stage-icon tracker-stage-${col.id} p-1.5 rounded-lg border ${col.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <h3 className="tracker-column-title font-bold text-sm">{col.label}</h3>
                </div>
                <span className="tracker-column-count w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center">
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colApps.length === 0 ? (
                  <div className="tracker-empty h-28 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 text-xs">
                    <Clock className="w-4 h-4" />
                    <span>No applications yet</span>
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div key={app._id || app.id} className="tracker-application-card p-4 rounded-xl border transition-all space-y-3 shadow-xs">
                      <div className="tracker-company-row flex items-start gap-3">
                        <CompanyLogo companyName={app.companyName || ''} />
                        <div className="min-w-0">
                          <h4 className="tracker-role-title font-bold text-sm leading-tight">{app.roleTitle}</h4>
                          <p className="tracker-company-name text-xs mt-0.5">{app.companyName}</p>
                        </div>
                      </div>

                      <div className="tracker-card-meta flex items-center justify-between pt-2 border-t text-[11px]">
                        <span className="tracker-date">{new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id || app.id, e.target.value)}
                          className="tracker-status-select bg-white border rounded px-2 py-0.5 text-[10px] font-semibold focus:outline-none"
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
        <div className="tracker-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="tracker-modal w-full max-w-md p-6 rounded-2xl bg-white border border-[#e7e2eb] shadow-xl space-y-5">
            <h3 className="tracker-modal-title text-lg font-bold">Add Application Item</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#716b79] mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Stripe / Netflix / Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="tracker-modal-input w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#716b79] mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="Senior Full Stack Engineer"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="tracker-modal-input w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#716b79] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="tracker-modal-input w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none font-semibold"
                >
                  <option value="applied">Applied / In Review</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="offer">Offer Received 🎉</option>
                  <option value="rejected">Archived / Rejected</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ebf3]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="tracker-modal-cancel px-4 py-2 rounded-xl border text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tracker-modal-save px-5 py-2 rounded-xl text-white font-semibold text-xs transition-colors"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
