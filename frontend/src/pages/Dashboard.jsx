import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  TrendingUp,
  Kanban,
  CheckCircle2,
  Plus,
  Sparkles,
  BarChart3,
  Calendar,
  Loader2,
  FileText,
  ArrowRight,
} from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resumesRes, appsRes] = await Promise.all([
          axios.get('/api/resumes'),
          axios.get('/api/applications'),
        ]);
        if (Array.isArray(resumesRes.data)) setResumes(resumesRes.data);
        if (Array.isArray(appsRes.data)) setApplications(appsRes.data);
      } catch (error) {
        console.error('Failed to load MERN dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalResumes = resumes.length;
  const latestResume = resumes[0];
  const latestScore = latestResume?.versions?.[0]?.atsScore ?? null;

  const totalApps = applications.length;
  const interviews = applications.filter((a) => a.status === 'interview' || a.status === 'offer').length;
  const interviewRate = totalApps > 0 ? Math.round((interviews / totalApps) * 100) : 0;

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-[#716b79]';
    if (score >= 80) return 'text-[#5520a5]';
    if (score >= 65) return 'text-amber-700';
    return 'text-rose-700';
  };

  const getScoreBadgeClass = (score) => {
    if (score === null || score === undefined) return 'bg-[#f3eff7] text-[#716b79] border-[#e2e6e1]';
    if (score >= 80) return 'bg-[#f0e8fa] text-[#5520a5] border-[#dfd1f0]';
    if (score >= 65) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-rose-50 text-rose-800 border-rose-200';
  };

  const getScoreLabel = (score) => {
    if (score === null || score === undefined) return 'Pending ATS Scan against Job Description';
    if (score >= 80) return 'ATS Ready (High Match)';
    if (score >= 65) return 'Moderate Risk';
    return 'High Auto-Rejection Risk';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-8">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between text-xs text-[#716b79] border-b border-[#e7e2eb] pb-3">
        <div className="flex items-center gap-2">
          <span>Workspace</span>
          <span>/</span>
          <span className="text-[#201a29] font-medium">Dashboard</span>
        </div>
        <div className="text-xs text-[#716b79] hidden sm:block">
          Personal workspace
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5520a5] mb-1">
            OVERVIEW & ANALYTICS
          </div>
          <h1 className="text-3xl font-extrabold text-[#201a29] tracking-tight">
            Resume Intelligence Dashboard
          </h1>
          <p className="text-sm text-[#716b79] mt-1">
            Track your ATS score across tailored versions and monitor application conversion.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="px-4 py-2.5 rounded-xl border border-[#e3e7e2] bg-white hover:bg-[#f3eff7] text-[#201a29] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <Kanban className="w-4 h-4 text-[#5520a5]" />
            <span>Application Tracker</span>
          </Link>
          <Link
            to="/resume/new"
            className="px-5 py-2.5 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>New ATS Scan</span>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#716b79]">Latest ATS Score</span>
            <div className="w-8 h-8 rounded-lg bg-[#f0e8fa] text-[#5520a5] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${getScoreColor(latestScore)}`}>
              {latestScore !== null ? latestScore : '-'}
            </span>
            <span className="text-sm text-[#716b79]">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#716b79] font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>{latestScore !== null ? 'ATS audit score calculated' : 'Upload resume to scan'}</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#716b79]">Saved Profiles</span>
            <div className="w-8 h-8 rounded-lg bg-[#f3eff7] text-[#201a29] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#5520a5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#201a29]">{totalResumes}</span>
            <span className="text-sm text-[#716b79]">Active Profiles</span>
          </div>
          <p className="mt-3 text-xs text-[#716b79] truncate">
            {latestResume ? `Latest: ${latestResume.originalFilename}` : 'No resumes uploaded yet'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#716b79]">Applications Tracked</span>
            <div className="w-8 h-8 rounded-lg bg-[#f3eff7] text-[#201a29] flex items-center justify-center">
              <Kanban className="w-4 h-4 text-[#5520a5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#201a29]">{totalApps}</span>
            <span className="text-sm text-[#716b79]">Active Roles</span>
          </div>
          <p className="mt-3 text-xs text-[#716b79]">
            {totalApps > 0 ? 'Role tracking active' : 'No applications tracked yet'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#716b79]">Interview Conversion</span>
            <div className="w-8 h-8 rounded-lg bg-[#f0e8fa] text-[#5520a5] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#5520a5]">{interviewRate}%</span>
            <span className="text-sm text-[#716b79]">Call Rate</span>
          </div>
          <p className="mt-3 text-xs text-[#716b79] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>Higher scores yield 3.2x calls</span>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#201a29] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#5520a5]" />
              <span>Uploaded Resumes & ATS Versions</span>
            </h2>
            <Link to="/resume/new" className="text-xs font-bold text-[#5520a5] hover:underline">
              Upload New Version →
            </Link>
          </div>

          {loading ? (
            <div className="p-12 rounded-2xl bg-white border border-[#e7e2eb] flex items-center justify-center text-[#716b79] gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#5520a5]" />
              <span>Loading workspace resumes...</span>
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white border border-[#e7e2eb] text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#f0e8fa] flex items-center justify-center mx-auto text-[#5520a5]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#201a29]">No Resumes Found</h3>
                <p className="text-sm text-[#716b79] mt-1">Upload your first resume PDF or DOCX to run a compatibility check.</p>
              </div>
              <Link
                to="/resume/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5520a5] text-white font-semibold text-xs shadow-sm hover:bg-[#3f167b]"
              >
                <span>Upload First Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((r) => {
                const latestVer = r.versions?.[0];
                const score = latestVer?.atsScore ?? null;
                return (
                  <div
                    key={r._id || r.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e7e2eb] hover:border-[#5520a5]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-[#5520a5] shrink-0" />
                        <h3 className="font-bold text-[#201a29] text-base">{r.originalFilename}</h3>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#f3eff7] text-[#716b79] font-semibold border border-[#e6e0eb]">
                          {r.versions?.length || 1} {r.versions?.length === 1 ? 'version' : 'versions'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#716b79]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Added {new Date(r.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span>•</span>
                        <span>Latest: {latestVer?.versionLabel || 'v1.0'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#716b79]">ATS Score:</span>
                          <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-black ${getScoreBadgeClass(score)}`}>
                            {score !== null ? `${score}/100` : '- / 100'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#716b79] block mt-0.5">{getScoreLabel(score)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/resume/${r._id || r.id}/editor`}
                          className="px-3.5 py-2 rounded-xl bg-[#f3eff7] hover:bg-[#e8ece7] text-[#201a29] border border-[#e3e7e2] font-semibold text-xs transition-colors"
                        >
                          Live Editor
                        </Link>
                        <Link
                          to={`/resume/${r._id || r.id}/score/latest`}
                          className="px-3.5 py-2 rounded-xl bg-[#5520a5] text-white font-semibold text-xs shadow-sm hover:bg-[#3f167b] transition-all"
                        >
                          Audit Report
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#201a29] flex items-center gap-2">
              <Kanban className="w-5 h-5 text-[#5520a5]" />
              <span>Recent Applications</span>
            </h2>
            <Link to="/applications" className="text-xs font-bold text-[#5520a5] hover:underline">
              View All →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#e7e2eb] space-y-4 shadow-sm">
            {applications.length === 0 ? (
              <p className="text-xs text-[#716b79] py-6 text-center">No tracked applications yet.</p>
            ) : (
              applications.slice(0, 4).map((app) => {
                const statusColors = {
                  applied: 'bg-blue-50 text-blue-700 border-blue-200',
                  interview: 'bg-amber-50 text-amber-800 border-amber-200',
                  rejected: 'bg-rose-50 text-rose-800 border-rose-200',
                  offer: 'bg-[#f0e8fa] text-[#5520a5] border-[#dfd1f0]',
                };
                return (
                  <div key={app._id || app.id} className="p-3.5 rounded-xl bg-[#f9faf8] border border-[#e8ece7] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#201a29] text-sm truncate">{app.roleTitle}</h4>
                      <p className="text-xs text-[#716b79] truncate">{app.companyName}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusColors[app.status] || statusColors.applied}`}>
                      {app.status}
                    </span>
                  </div>
                );
              })
            )}

            <Link
              to="/applications"
              className="w-full py-2.5 rounded-xl border border-[#e3e7e2] bg-[#f3eff7] hover:bg-[#e8ece7] text-xs font-semibold text-[#201a29] flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <span>Go to Application Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
