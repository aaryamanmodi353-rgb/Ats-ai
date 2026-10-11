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
    <div className="flex flex-col min-h-screen bg-[#f7f8f6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#e6e9e4] bg-[#f4f7f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e6f0ea] border border-[#d2e2d8] text-[#164e3f] text-xs sm:text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4 text-[#164e3f]" />
            <span>Pure JavaScript MERN Stack • Deterministic ATS Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6 text-[#141c18]">
            Stop Getting Auto-Rejected by <span className="text-[#164e3f]">ATS Algorithms.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5c6962] max-w-2xl mx-auto mb-10 leading-relaxed">
            Entry-level candidates and career switchers submit dozens of applications with zero callbacks. Not because you’re unqualified, but because Applicant Tracking Systems filter out multi-column layouts, missing exact n-gram keywords, and unquantified bullets.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto">
            <Link
              to={user ? '/resume/new' : '/signup'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#164e3f] hover:bg-[#124235] text-white font-semibold text-base shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            >
              <span>{user ? 'Scan Your Resume Now' : 'Create Account to Scan'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/templates"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#e6f0ea] hover:bg-[#d8e7de] border border-[#c8ded1] text-[#164e3f] font-semibold text-base flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-5 h-5 text-[#164e3f]" />
              <span>Explore Famous Templates & Roles</span>
            </Link>

            <button
              onClick={handleLaunchDemo}
              disabled={demoLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#e6e9e4] bg-white hover:bg-[#f4f7f4] text-[#141c18] font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {demoLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#164e3f]" />
                  <span>Loading MERN Demo...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 text-[#164e3f]" />
                  <span>Test Sample Profile Demo</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Trust Highlights */}
          <div className="mt-14 pt-10 border-t border-[#e6e9e4] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#164e3f] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#141c18]">0–100 Weighted Score</p>
                <p className="text-xs text-[#5c6962]">Deterministic TF-IDF & keyword matching</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#141c18]">Format Audit</p>
                <p className="text-xs text-[#5c6962]">Flags multi-column tables and header traps</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sliders className="w-5 h-5 text-[#164e3f] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#141c18]">Truthful Rewrites</p>
                <p className="text-xs text-[#5c6962]">Never fabricates employers, dates, or metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#164e3f] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#141c18]">100% MERN Secure</p>
                <p className="text-xs text-[#5c6962]">Embedded MongoDB & no silent LLM training</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ATS Rejects Resumes (Problem Section) */}
      <section className="py-20 bg-white border-b border-[#e6e9e4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#164e3f] mb-3">The Invisible Gatekeeper</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#141c18]">
              Why 75% of Qualified Applications Never Reach a Human Recruiter
            </h3>
            <p className="mt-4 text-[#5c6962] text-sm sm:text-base leading-relaxed">
              Legacy and modern ATS parsers (Taleo, Workday, Greenhouse) read documents linearly and assign match scores before a human eyes your application. Here is how standard resumes break down:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#fbfcfb] border border-[#e6e9e4] shadow-xs border-l-4 border-l-rose-600">
              <div className="w-12 h-12 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-rose-700 mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#141c18] mb-3">Multi-Column & Table Traps</h4>
              <p className="text-sm text-[#5c6962] leading-relaxed">
                When resumes use 2-column sidebars or tables for skills, ATS text extractors interlace words across columns. *"React | AWS"* on line 1 merged with *"Python | Docker"* on line 2 becomes *"React Python AWS Docker"*, breaking exact phrase recognition.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#fbfcfb] border border-[#e6e9e4] shadow-xs border-l-4 border-l-amber-600">
              <div className="w-12 h-12 rounded-xl bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center text-amber-700 mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#141c18] mb-3">Missing Required N-Grams</h4>
              <p className="text-sm text-[#5c6962] leading-relaxed">
                If the Job Description asks for *"GraphQL APIs"* and your resume only says *"Query languages"*, keyword algorithms dock up to 40% of your compatibility score. ResumeIQ pinpoints exact missing hard skills vs preferred credentials.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#fbfcfb] border border-[#e6e9e4] shadow-xs border-l-4 border-l-[#164e3f]">
              <div className="w-12 h-12 rounded-xl bg-[#e6f0ea] border border-[#d2e2d8] flex items-center justify-center text-[#164e3f] mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#141c18] mb-3">Unquantified Passive Bullets</h4>
              <p className="text-sm text-[#5c6962] leading-relaxed">
                Bullets starting with *"Responsible for..."* or *"Helped with..."* without measurable numbers (`%`, `$`, time saved) get flagged by semantic rankers as low-impact. Our AI prompts you for metrics without inventing numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Personas Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#e6e9e4]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#164e3f] mb-3">Tailored For Your Career Stage</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#141c18]">
            Built for Job Seekers Who Need Visibility Into the Black Box
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-[#e6e9e4] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#e6f0ea] text-[#164e3f] border border-[#d2e2d8]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#141c18]">Fresh Graduate</h4>
                  <span className="text-xs text-[#5c6962]">First-time applicants</span>
                </div>
              </div>
              <p className="text-sm text-[#5c6962] leading-relaxed mb-6">
                Doesn’t know what *"ATS keywords"* or *"semantic parsing"* even means in practice. Needs guided, educational feedback that explains exact formatting pitfalls and how to turn academic projects into high-impact bullets.
              </p>
            </div>
            <div className="pt-4 border-t border-[#eef1ed] text-xs font-semibold text-[#164e3f] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Plain-English explanations & formatting warnings</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#e6e9e4] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#e6f0ea] text-[#164e3f] border border-[#d2e2d8]">
                  <Repeat className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#141c18]">Career Switcher</h4>
                  <span className="text-xs text-[#5c6962]">Transitioning industries</span>
                </div>
              </div>
              <p className="text-sm text-[#5c6962] leading-relaxed mb-6">
                Has deep transferable skills and years of real experience, but phrasing doesn’t match the target industry’s vocabulary. Needs smart gap analysis to translate existing expertise into the exact terminology required by the new role.
              </p>
            </div>
            <div className="pt-4 border-t border-[#eef1ed] text-xs font-semibold text-[#164e3f] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Keyword gap translation & vocabulary alignment</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#e6e9e4] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#e6f0ea] text-[#164e3f] border border-[#d2e2d8]">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#141c18]">High-Volume Applicant</h4>
                  <span className="text-xs text-[#5c6962]">Applying to 20+ roles/week</span>
                </div>
              </div>
              <p className="text-sm text-[#5c6962] leading-relaxed mb-6">
                Needs to rapidly tailor a base resume to dozens of distinct job descriptions without starting from scratch every single time. Requires live score recalculations, version control, and 1-click ATS-safe DOCX/PDF exports.
              </p>
            </div>
            <div className="pt-4 border-t border-[#eef1ed] text-xs font-semibold text-[#164e3f] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Live WYSIWYG score panel & per-JD exports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-[#f4f7f4] border-t border-[#e6e9e4] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#141c18] mb-6">
            Ready to See Why Your Resume Is Being Filtered?
          </h2>
          <p className="text-base sm:text-lg text-[#5c6962] max-w-2xl mx-auto mb-10">
            Upload your PDF or DOCX file and paste any job description to get your instant 0–100 compatibility score and AI rewrite suggestions.
          </p>
          <Link
            to={user ? '/resume/new' : '/signup'}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-[#164e3f] hover:bg-[#124235] text-white font-semibold text-base shadow-sm transition-all"
          >
            <span>{user ? 'Start Your Free ATS Audit' : 'Create Account to Start'}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
