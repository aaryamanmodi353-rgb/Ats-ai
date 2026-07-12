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
    if (score === null || score === undefined) return 'text-muted-foreground';
    if (score >= 80) return 'text-emerald-400';
    if (score >= 65) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBadgeClass = (score) => {
    if (score === null || score === undefined) return 'bg-secondary text-muted-foreground border-border';
    if (score >= 80) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (score >= 65) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  };

  const getScoreLabel = (score) => {
    if (score === null || score === undefined) return 'Pending ATS Scan against Job Description';
    if (score >= 80) return 'ATS Ready (High Match)';
    if (score >= 65) return 'Moderate Risk';
    return 'High Auto-Rejection Risk';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Resume Intelligence Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your ATS score across tailored versions and monitor MERN application conversion.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-secondary/40 text-foreground font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            <Kanban className="w-4 h-4 text-indigo-400" />
            <span>Application Tracker</span>
          </Link>
          <Link
            to="/resume/new"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New ATS Scan</span>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -z-10" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Latest ATS Score</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${getScoreColor(latestScore)}`}>{latestScore !== null ? latestScore : '-'}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>{latestScore !== null ? 'ATS audit score calculated' : 'Upload resume to scan'}</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -z-10" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Saved Profiles</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground">{totalResumes}</span>
            <span className="text-sm text-muted-foreground">Active Profiles</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground truncate">
            {latestResume ? `Latest: ${latestResume.originalFilename}` : 'No resumes uploaded yet'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -z-10" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Applications Tracked</span>
            <Kanban className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground">{totalApps}</span>
            <span className="text-sm text-muted-foreground">Active Roles</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {totalApps > 0 ? 'Role tracking active' : 'No applications tracked yet'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -z-10" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interview Conversion</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-400">{interviewRate}%</span>
            <span className="text-sm text-muted-foreground">Call Rate</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Higher scores yield 3.2x calls</span>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              <span>Uploaded Resumes & ATS Versions</span>
            </h2>
            <Link to="/resume/new" className="text-xs font-semibold text-primary hover:underline">
              Upload New Version →
            </Link>
          </div>

          {loading ? (
            <div className="p-12 rounded-2xl bg-card border border-border/60 flex items-center justify-center text-muted-foreground gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Loading workspace resumes...</span>
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-12 rounded-2xl bg-card border border-border/60 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">No Resumes Found</h3>
                <p className="text-sm text-muted-foreground mt-1">Upload your first resume PDF or DOCX to run a compatibility check.</p>
              </div>
              <Link
                to="/resume/new"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-md"
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
                    className="p-6 rounded-2xl bg-card border border-border/60 hover:border-border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                        <h3 className="font-bold text-foreground text-base">{r.originalFilename}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium">
                          {r.versions?.length || 1} {r.versions?.length === 1 ? 'version' : 'versions'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Added {new Date(r.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span>•</span>
                        <span>Latest: {latestVer?.versionLabel || 'v1.0'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-muted-foreground">ATS Score:</span>
                          <span className={`px-2.5 py-1 rounded-lg border text-sm font-black ${getScoreBadgeClass(score)}`}>
                            {score !== null ? `${score}/100` : '- / 100'}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{getScoreLabel(score)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/resume/${r._id || r.id}/editor`}
                          className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs transition-colors"
                        >
                          Live Editor
                        </Link>
                        <Link
                          to={`/resume/${r._id || r.id}/score/latest`}
                          className="px-3.5 py-2 rounded-xl bg-primary text-white font-semibold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
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
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Kanban className="w-5 h-5 text-indigo-400" />
              <span>Recent Applications</span>
            </h2>
            <Link to="/applications" className="text-xs font-semibold text-primary hover:underline">
              View All →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-4">
            {applications.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No tracked applications yet.</p>
            ) : (
              applications.slice(0, 4).map((app) => {
                const statusColors = {
                  applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  interview: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                  offer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                };
                return (
                  <div key={app._id || app.id} className="p-4 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground text-sm truncate">{app.roleTitle}</h4>
                      <p className="text-xs text-muted-foreground truncate">{app.companyName}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-wider shrink-0 ${statusColors[app.status] || statusColors.applied}`}>
                      {app.status}
                    </span>
                  </div>
                );
              })
            )}

            <Link
              to="/applications"
              className="w-full py-2.5 rounded-xl border border-border/80 bg-secondary/40 hover:bg-secondary text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors mt-2"
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
