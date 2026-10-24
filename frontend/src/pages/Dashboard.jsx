import React, { useEffect, useRef, useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const RESUMES_PER_PAGE = 5;

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingResumeId, setDeletingResumeId] = useState(null);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const deleteDialogRef = useRef(null);

  useEffect(() => {
    if (resumeToDelete && deleteDialogRef.current && !deleteDialogRef.current.open) {
      deleteDialogRef.current.showModal();
    }
  }, [resumeToDelete]);

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
  const totalResumePages = Math.ceil(totalResumes / RESUMES_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalResumePages, 1));
  const resumeStartIndex = (safeCurrentPage - 1) * RESUMES_PER_PAGE;
  const visibleResumes = resumes.slice(resumeStartIndex, resumeStartIndex + RESUMES_PER_PAGE);
  const pageNumbers = totalResumePages <= 5
    ? Array.from({ length: totalResumePages }, (_, index) => index + 1)
    : [...new Set([1, safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, totalResumePages])]
      .filter((page) => page >= 1 && page <= totalResumePages)
      .sort((left, right) => left - right);
  const latestResume = resumes[0];
  const latestScore = latestResume?.versions?.[0]?.atsScore ?? null;

  const totalApps = applications.length;
  const interviews = applications.filter((a) => a.status === 'interview' || a.status === 'offer').length;
  const interviewRate = totalApps > 0 ? Math.round((interviews / totalApps) * 100) : 0;

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-white/60';
    if (score >= 80) return 'text-violet-200';
    if (score >= 65) return 'text-amber-300';
    return 'text-rose-300';
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

  const handleDeleteResume = async () => {
    const resume = resumeToDelete;
    if (!resume) return;

    const resumeId = resume._id || resume.id;

    setDeletingResumeId(String(resumeId));
    try {
      await axios.delete(`/api/resumes/${resumeId}`);
      setResumes((currentResumes) => currentResumes.filter((item) => String(item._id || item.id) !== String(resumeId)));

      const versionIds = new Set((resume.versions || []).map((version) => String(version._id || version.id)));
      setApplications((currentApplications) => currentApplications.map((application) => {
        const linkedVersionId = application.resumeVersionId?._id || application.resumeVersionId;
        return versionIds.has(String(linkedVersionId))
          ? { ...application, resumeVersionId: null }
          : application;
      }));

      setResumeToDelete(null);
      toast.success('Resume and saved versions deleted.');
    } catch (error) {
      console.error('Failed to delete resume:', error);
      toast.error(error.response?.data?.error || 'Failed to delete resume.');
    } finally {
      setDeletingResumeId(null);
    }
  };

  return (
    <div className="dashboard-page relative isolate flex-1">
      <div className="dashboard-outer relative z-10 mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="dashboard-reference-frame">
          <section className="dashboard-hero">
            <div className="dashboard-hero-kicker">
              <span className="dashboard-kicker-mark"><Sparkles className="w-3.5 h-3.5" /></span>
              <span>Resume intelligence for your next move</span>
            </div>
            <h1 className="dashboard-hero-title">
              Build a stronger resume.<br className="hidden sm:block" /> Find your <span>next opportunity.</span>
            </h1>
            <p className="dashboard-hero-copy">
              Track your ATS score across tailored versions and keep every application moving forward.
            </p>
            <div className="dashboard-hero-actions">
              <Link
                to="/resume/new"
                className="dashboard-hero-primary"
              >
                <Plus className="w-4 h-4" />
                <span>New ATS Scan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/applications"
                className="dashboard-hero-secondary"
              >
                <Kanban className="w-4 h-4" />
                <span>Application Tracker</span>
              </Link>
            </div>

            <div className="dashboard-floating-metrics" aria-hidden="true">
              <div className="dashboard-float-card dashboard-float-card-left">
                <div className="dashboard-float-label"><Sparkles className="w-3.5 h-3.5" /> Latest ATS score</div>
                <div className="dashboard-float-value">{latestScore ?? '—'} <span>/ 100</span></div>
                <div className="dashboard-float-foot"><TrendingUp className="w-3 h-3" /> Resume health</div>
              </div>
              <div className="dashboard-float-card dashboard-float-card-right">
                <div className="dashboard-float-label"><Kanban className="w-3.5 h-3.5" /> Applications tracked</div>
                <div className="dashboard-float-value">{totalApps} <span>active roles</span></div>
                <div className="dashboard-float-foot"><CheckCircle2 className="w-3 h-3" /> Your progress at a glance</div>
              </div>
            </div>
          </section>

          <section className="dashboard-workspace">
            <div className="dashboard-workspace-top">
              <div className="flex items-center gap-2 text-xs text-[#716b79]">
                <span>Workspace</span>
                <span>/</span>
                <span className="font-semibold text-[#201a29]">Dashboard</span>
              </div>
              <span className="dashboard-workspace-status"><span /> Personal workspace</span>
            </div>

      {/* Overview Cards */}
      <div className="dashboard-overview-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-5">
        <div className="dashboard-score-feature p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-100/70">Latest ATS Score</span>
            <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/10 text-violet-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-semibold tracking-tight ${getScoreColor(latestScore)}`}>
              {latestScore !== null ? latestScore : '-'}
            </span>
            <span className="text-sm text-violet-100/65">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-violet-100/75 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-violet-200" />
            <span>{latestScore !== null ? 'ATS audit score calculated' : 'Upload resume to scan'}</span>
          </div>
        </div>

        <div className="dashboard-stat p-6 rounded-2xl border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#716b79]">Saved Profiles</span>
            <div className="w-8 h-8 rounded-lg bg-[#f3eff7] text-[#201a29] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#5520a5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight text-[#201a29]">{totalResumes}</span>
            <span className="text-sm text-[#716b79]">Active Profiles</span>
          </div>
          <p className="mt-3 text-xs text-[#716b79] truncate">
            {latestResume ? `Latest: ${latestResume.originalFilename}` : 'No resumes uploaded yet'}
          </p>
        </div>

        <div className="dashboard-stat p-6 rounded-2xl border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#716b79]">Applications Tracked</span>
            <div className="w-8 h-8 rounded-lg bg-[#f3eff7] text-[#201a29] flex items-center justify-center">
              <Kanban className="w-4 h-4 text-[#5520a5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight text-[#201a29]">{totalApps}</span>
            <span className="text-sm text-[#716b79]">Active Roles</span>
          </div>
          <p className="mt-3 text-xs text-[#716b79]">
            {totalApps > 0 ? 'Role tracking active' : 'No applications tracked yet'}
          </p>
        </div>

        <div className="dashboard-stat p-6 rounded-2xl border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#716b79]">Interview Conversion</span>
            <div className="w-8 h-8 rounded-lg bg-[#f0e8fa] text-[#5520a5] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight text-[#5520a5]">{interviewRate}%</span>
            <span className="text-sm text-[#716b79]">Call Rate</span>
          </div>
          <p className="mt-3 text-xs text-[#716b79] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>Higher scores yield 3.2x calls</span>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="dashboard-resume-column lg:col-span-2 space-y-6">
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
            <div className="dashboard-panel p-12 rounded-2xl flex items-center justify-center text-[#716b79] gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#5520a5]" />
              <span>Loading workspace resumes...</span>
            </div>
          ) : resumes.length === 0 ? (
            <div className="dashboard-panel p-12 rounded-2xl text-center space-y-4">
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
              {visibleResumes.map((r) => {
                const latestVer = r.versions?.[0];
                const score = latestVer?.atsScore ?? null;
                return (
                  <div
                    key={r._id || r.id}
                    className="dashboard-resume-row flex flex-col gap-4 rounded-2xl border border-[#e7e2eb] bg-white p-5 shadow-sm transition-all hover:border-[#5520a5]/40 sm:p-6"
                  >
                    <div className="min-w-0 space-y-2">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
                        <FileText className="w-5 h-5 text-[#5520a5] shrink-0" />
                        <h3 className="min-w-0 flex-1 break-words text-base font-bold text-[#201a29]">{r.originalFilename}</h3>
                        <span className="shrink-0 whitespace-nowrap rounded-full border border-[#e6e0eb] bg-[#f3eff7] px-2.5 py-0.5 text-[11px] font-semibold text-[#716b79]">
                          {r.versions?.length || 1} {r.versions?.length === 1 ? 'version' : 'versions'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#716b79]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Added {new Date(r.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span>•</span>
                        <span>Latest: {latestVer?.versionLabel || 'v1.0'}</span>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
                      <div className="min-w-0 text-left sm:min-w-[150px] sm:text-right">
                        <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                          <span className="whitespace-nowrap text-xs font-semibold text-[#716b79]">ATS Score:</span>
                          <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-black ${getScoreBadgeClass(score)}`}>
                            {score !== null ? `${score}/100` : '- / 100'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#716b79] block mt-0.5">{getScoreLabel(score)}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
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
                        <button
                          type="button"
                          onClick={() => setResumeToDelete(r)}
                          disabled={!r.canDelete || deletingResumeId === String(r._id || r.id)}
                          aria-label={`Delete ${r.originalFilename}`}
                          title={r.canDelete ? 'Delete resume' : 'This older resume is not linked to your account, so it cannot be deleted safely.'}
                          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${r.canDelete ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100' : 'border-[#e7e2eb] bg-[#f7f6f9] text-[#8a8291]'}`}
                        >
                          {deletingResumeId === String(r._id || r.id) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>{deletingResumeId === String(r._id || r.id) ? 'Deleting…' : 'Delete'}</span>
                        </button>
                        {!r.canDelete && (
                          <span className="basis-full text-right text-[10px] leading-4 text-[#8a8291]">
                            Ownership not verified for this older resume
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="dashboard-pagination-bar">
                <span className="dashboard-pagination-caption">
                  Showing {resumeStartIndex + 1}–{Math.min(resumeStartIndex + RESUMES_PER_PAGE, totalResumes)} of {totalResumes} resumes
                </span>
                {totalResumePages > 1 && (
                  <nav className="dashboard-pagination" aria-label="Resume pages">
                    <button
                      type="button"
                      className="dashboard-page-step"
                      onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                      disabled={safeCurrentPage === 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    <div className="dashboard-page-numbers">
                      {pageNumbers.map((page, index) => (
                        <React.Fragment key={page}>
                          {index > 0 && page - pageNumbers[index - 1] > 1 && (
                            <span className="dashboard-page-ellipsis" aria-hidden="true">…</span>
                          )}
                          <button
                            type="button"
                            className={`dashboard-page-button ${page === safeCurrentPage ? 'is-active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                            aria-current={page === safeCurrentPage ? 'page' : undefined}
                            aria-label={`Go to page ${page}`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="dashboard-page-step"
                      onClick={() => setCurrentPage(Math.min(totalResumePages, safeCurrentPage + 1))}
                      disabled={safeCurrentPage === totalResumePages}
                      aria-label="Next page"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-applications-column space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#201a29] flex items-center gap-2">
              <Kanban className="w-5 h-5 text-[#5520a5]" />
              <span>Recent Applications</span>
            </h2>
            <Link to="/applications" className="text-xs font-bold text-[#5520a5] hover:underline">
              View All →
            </Link>
          </div>

          <div className="dashboard-panel p-6 rounded-2xl space-y-4">
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
                  <div key={app._id || app.id} className="dashboard-application-row p-3.5 rounded-xl bg-[#f9faf8] border border-[#e8ece7] flex items-center justify-between gap-3">
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
          </section>
        </div>
      </div>
      {resumeToDelete && (
        <dialog
          ref={deleteDialogRef}
          aria-labelledby="delete-resume-title"
          aria-describedby="delete-resume-description"
          aria-busy={deletingResumeId === String(resumeToDelete._id || resumeToDelete.id)}
          onCancel={(event) => {
            event.preventDefault();
            if (!deletingResumeId) setResumeToDelete(null);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget && !deletingResumeId) setResumeToDelete(null);
          }}
          className="m-auto w-[min(92vw,480px)] max-w-none overflow-hidden rounded-[1.75rem] border border-[#eee7f3] bg-white p-0 text-[#201a29] shadow-[0_32px_90px_rgba(28,12,45,0.28)] backdrop:bg-[#1b1025]/55 backdrop:backdrop-blur-sm"
        >
          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div className="pt-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">Permanent action</p>
                  <h2 id="delete-resume-title" className="mt-1 text-xl font-bold tracking-tight text-[#201a29]">Delete this resume?</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResumeToDelete(null)}
                disabled={Boolean(deletingResumeId)}
                aria-label="Close delete confirmation"
                className="rounded-lg p-2 text-[#8a8291] transition-colors hover:bg-[#f5f1f8] hover:text-[#201a29] disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-[#eee8f2] bg-[#faf8fc] p-4">
              <p className="break-words text-sm font-semibold leading-5 text-[#352b40]">{resumeToDelete.originalFilename}</p>
              <p id="delete-resume-description" className="mt-2 text-xs leading-5 text-[#716b79]">
                This removes the resume, its saved versions, and ATS reports. Tracked applications will stay, but links to this resume will be cleared.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setResumeToDelete(null)}
                disabled={Boolean(deletingResumeId)}
                className="rounded-xl border border-[#e7e2eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#51485b] transition-colors hover:bg-[#f8f6fa] disabled:opacity-60"
              >
                Keep resume
              </button>
              <button
                type="button"
                onClick={handleDeleteResume}
                disabled={Boolean(deletingResumeId)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:cursor-wait disabled:opacity-70"
              >
                {deletingResumeId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deletingResumeId ? 'Deleting resume…' : 'Delete resume'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
