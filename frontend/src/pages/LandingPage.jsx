import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sliders,
  TrendingUp,
  Layers,
  GraduationCap,
  Repeat,
  Zap,
  Lock,
  Loader2,
  FileText,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'sonner';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleLaunchDemo = async () => {
    if (!user) {
      toast.info('Sign in or create a mandatory account first. You can use the instant one-click demo login button!');
      navigate('/login');
      return;
    }
    setDemoLoading(true);
    try {
      // Fetch resumes from Express backend to check if seeded profile exists
      const res = await axios.get('/api/resumes');
      const resumes = res.data;
      if (Array.isArray(resumes) && resumes.length > 0) {
        const demoResume = resumes[0];
        const latestVersion = demoResume.versions?.[0];
        if (latestVersion) {
          const jdsRes = await axios.get('/api/job-descriptions');
          const jds = jdsRes.data;
          const targetJd = Array.isArray(jds) && jds.length > 0 ? jds[0] : null;

          if (targetJd) {
            const scoreRes = await axios.post('/api/score', {
              resumeVersionId: latestVersion.id || latestVersion._id,
              jobDescriptionId: targetJd.id || targetJd._id,
            });
            const scoreData = scoreRes.data;
            if (scoreData.success && scoreData.reportId) {
              navigate(`/resume/${demoResume._id || demoResume.id}/score/${scoreData.reportId}`);
              return;
            }
          }
          navigate(`/resume/${demoResume._id || demoResume.id}/editor`);
          return;
        }
      }
      navigate('/resume/new');
    } catch (e) {
      console.error(e);
      navigate('/resume/new');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="dashboard-outer relative z-10 mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="dashboard-reference-frame">
        <div className="landing-page flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="landing-hero relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#e7e2eb]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0e8fa] border border-[#dfd1f0] text-[#5520a5] text-xs sm:text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4 text-[#5520a5]" />
              <span>Pure JavaScript MERN Stack • Deterministic ATS Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold tracking-tight max-w-2xl mx-auto lg:mx-0 leading-[1.08] mb-6 text-[#201a29]">
              Stop Getting Auto-Rejected by <span className="gradient-text">ATS Algorithms.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#716b79] max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed">
              Entry-level candidates and career switchers submit dozens of applications with zero callbacks. Not because you’re unqualified, but because Applicant Tracking Systems filter out multi-column layouts, missing exact n-gram keywords, and unquantified bullets.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 max-w-2xl mx-auto lg:mx-0">
            <Link
              to={user ? '/resume/new' : '/signup'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-semibold text-base shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            >
              <span>{user ? 'Scan Your Resume Now' : 'Create Account to Scan'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/templates"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#f0e8fa] hover:bg-[#e7d9f5] border border-[#d9c5ef] text-[#5520a5] font-semibold text-base flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-5 h-5 text-[#5520a5]" />
              <span>Explore Famous Templates & Roles</span>
            </Link>

            <button
              onClick={handleLaunchDemo}
              disabled={demoLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#e7e2eb] bg-white hover:bg-[#f6f3fa] text-[#201a29] font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {demoLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#5520a5]" />
                  <span>Loading MERN Demo...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 text-[#5520a5]" />
                  <span>Test Sample Profile Demo</span>
                </>
              )}
            </button>
            </div>
          </div>

          <div aria-hidden="true" className="audit-preview rounded-[1.6rem] p-5 sm:p-8 text-left">
            <div className="relative z-10 rounded-2xl border border-white/15 bg-[#12091f]/55 p-5 sm:p-7 shadow-[0_15px_55px_rgba(0,0,0,.28)] backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200/20 bg-violet-300/10 text-violet-100">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-violet-200/65">ResumeIQ report</p>
                    <p className="mt-1 text-sm font-medium text-white">Six dimensions, one report</p>
                  </div>
                </div>
                <span className="hidden sm:block rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] text-emerald-200">ATS audit</span>
              </div>
              <div className="mt-6 grid gap-3">
                {['Keywords', 'Format & parseability', 'Quantified impact', 'Action verbs', 'Seniority alignment', 'Readability'].map((label, index) => (
                  <div key={label} className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3.5 py-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-300/10 text-[10px] font-semibold text-violet-100">0{index + 1}</span>
                    <span className="min-w-0 flex-1 text-xs text-violet-50/85">{label}</span>
                    <span className="h-1.5 w-12 rounded-full bg-gradient-to-r from-violet-300/90 to-fuchsia-300/60" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Trust Highlights */}
        </div>
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-6 border-t border-[#e7e2eb] px-4 pt-8 text-left sm:px-6 md:grid-cols-4 lg:px-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#5520a5] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#201a29]">0–100 Weighted Score</p>
                <p className="text-xs text-[#716b79]">Deterministic TF-IDF & keyword matching</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#201a29]">Format Audit</p>
                <p className="text-xs text-[#716b79]">Flags multi-column tables and header traps</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sliders className="w-5 h-5 text-[#5520a5] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#201a29]">Truthful Rewrites</p>
                <p className="text-xs text-[#716b79]">Never fabricates employers, dates, or metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#5520a5] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#201a29]">100% MERN Secure</p>
                <p className="text-xs text-[#716b79]">Embedded MongoDB & no silent LLM training</p>
              </div>
            </div>
          </div>
      </section>

      {/* Why ATS Rejects Resumes (Problem Section) */}
      <section className="py-20 sm:py-24 bg-[#fcfbfd] border-b border-[#e7e2eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-20 items-end mb-14">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#5520a5] mb-3">The Invisible Gatekeeper</h2>
              <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#201a29]">
                Why 75% of Qualified Applications Never Reach a Human Recruiter
              </h3>
            </div>
            <p className="text-[#716b79] text-sm sm:text-base leading-relaxed max-w-2xl">
              Legacy and modern ATS parsers (Taleo, Workday, Greenhouse) read documents linearly and assign match scores before a human eyes your application. Here is how standard resumes break down:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-[0_8px_28px_rgba(39,20,58,.035)]">
              <div className="w-12 h-12 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-rose-700 mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#201a29] mb-3">Multi-Column & Table Traps</h4>
              <p className="text-sm text-[#716b79] leading-relaxed">
                When resumes use 2-column sidebars or tables for skills, ATS text extractors interlace words across columns. *"React | AWS"* on line 1 merged with *"Python | Docker"* on line 2 becomes *"React Python AWS Docker"*, breaking exact phrase recognition.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-[0_8px_28px_rgba(39,20,58,.035)]">
              <div className="w-12 h-12 rounded-xl bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center text-amber-700 mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#201a29] mb-3">Missing Required N-Grams</h4>
              <p className="text-sm text-[#716b79] leading-relaxed">
                If the Job Description asks for *"GraphQL APIs"* and your resume only says *"Query languages"*, keyword algorithms dock up to 40% of your compatibility score. ResumeIQ pinpoints exact missing hard skills vs preferred credentials.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-[0_8px_28px_rgba(39,20,58,.035)]">
              <div className="w-12 h-12 rounded-xl bg-[#f0e8fa] border border-[#dfd1f0] flex items-center justify-center text-[#5520a5] mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#201a29] mb-3">Unquantified Passive Bullets</h4>
              <p className="text-sm text-[#716b79] leading-relaxed">
                Bullets starting with *"Responsible for..."* or *"Helped with..."* without measurable numbers (`%`, `$`, time saved) get flagged by semantic rankers as low-impact. Our AI prompts you for metrics without inventing numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Personas Showcase */}
      <section className="py-20 sm:py-24 bg-white border-b border-[#e7e2eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#5520a5] mb-3">Tailored For Your Career Stage</h2>
          <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#201a29]">
            Built for Job Seekers Who Need Visibility Into the Black Box
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="p-7 sm:p-8 rounded-2xl bg-[#f7f6f9] border border-[#e7e2eb] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#f0e8fa] text-[#5520a5] border border-[#dfd1f0]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#201a29]">Fresh Graduate</h4>
                  <span className="text-xs text-[#716b79]">First-time applicants</span>
                </div>
              </div>
              <p className="text-sm text-[#716b79] leading-relaxed mb-6">
                Doesn’t know what *"ATS keywords"* or *"semantic parsing"* even means in practice. Needs guided, educational feedback that explains exact formatting pitfalls and how to turn academic projects into high-impact bullets.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f0ebf3] text-xs font-semibold text-[#5520a5] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Plain-English explanations & formatting warnings</span>
            </div>
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-[#f7f6f9] border border-[#e7e2eb] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#f0e8fa] text-[#5520a5] border border-[#dfd1f0]">
                  <Repeat className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#201a29]">Career Switcher</h4>
                  <span className="text-xs text-[#716b79]">Transitioning industries</span>
                </div>
              </div>
              <p className="text-sm text-[#716b79] leading-relaxed mb-6">
                Has deep transferable skills and years of real experience, but phrasing doesn’t match the target industry’s vocabulary. Needs smart gap analysis to translate existing expertise into the exact terminology required by the new role.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f0ebf3] text-xs font-semibold text-[#5520a5] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Keyword gap translation & vocabulary alignment</span>
            </div>
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-[#f7f6f9] border border-[#e7e2eb] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#f0e8fa] text-[#5520a5] border border-[#dfd1f0]">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#201a29]">High-Volume Applicant</h4>
                  <span className="text-xs text-[#716b79]">Applying to 20+ roles/week</span>
                </div>
              </div>
              <p className="text-sm text-[#716b79] leading-relaxed mb-6">
                Needs to rapidly tailor a base resume to dozens of distinct job descriptions without starting from scratch every single time. Requires live score recalculations, version control, and 1-click ATS-safe DOCX/PDF exports.
              </p>
            </div>
            <div className="pt-4 border-t border-[#f0ebf3] text-xs font-semibold text-[#5520a5] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Live WYSIWYG score panel & per-JD exports</span>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="landing-cta py-20 bg-[#201a29] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#201a29] mb-6">
            Ready to See Why Your Resume Is Being Filtered?
          </h2>
          <p className="text-base sm:text-lg text-[#716b79] max-w-2xl mx-auto mb-10">
            Upload your PDF or DOCX file and paste any job description to get your instant 0–100 compatibility score and AI rewrite suggestions.
          </p>
          <Link
            to={user ? '/resume/new' : '/signup'}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-semibold text-base shadow-sm transition-all"
          >
            <span>{user ? 'Start Your Free ATS Audit' : 'Create Account to Start'}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}
