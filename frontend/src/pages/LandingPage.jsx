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

export default function LandingPage() {
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleLaunchDemo = async () => {
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-36 border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-background to-background -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[130px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs sm:text-sm font-semibold mb-8 animate-pulse-subtle">
            <Sparkles className="w-4 h-4" />
            <span>Pure JavaScript MERN Stack • Deterministic ATS Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6 text-foreground">
            Stop Getting Auto-Rejected by <span className="gradient-text">ATS Algorithms.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Entry-level candidates and career switchers submit dozens of applications with zero callbacks. Not because you’re unqualified, but because Applicant Tracking Systems filter out multi-column layouts, missing exact n-gram keywords, and unquantified bullets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/resume/new"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Scan Your Resume Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={handleLaunchDemo}
              disabled={demoLoading}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-border/80 bg-card/60 hover:bg-card text-foreground font-semibold text-base flex items-center justify-center gap-2 transition-all hover:border-primary/50 disabled:opacity-50"
            >
              {demoLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span>Loading MERN Demo...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>Test Sample Profile Demo</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Trust Highlights */}
          <div className="mt-14 pt-10 border-t border-border/40 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">0–100 Weighted Score</p>
                <p className="text-xs text-muted-foreground">Deterministic TF-IDF & keyword matching</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">Format Audit</p>
                <p className="text-xs text-muted-foreground">Flags multi-column tables and header traps</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sliders className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">Truthful Rewrites</p>
                <p className="text-xs text-muted-foreground">Never fabricates employers, dates, or metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">100% MERN Secure</p>
                <p className="text-xs text-muted-foreground">Embedded MongoDB & no silent LLM training</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ATS Rejects Resumes (Problem Section) */}
      <section className="py-24 bg-card/30 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">The Invisible Gatekeeper</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-foreground">
              Why 75% of Qualified Applications Never Reach a Human Recruiter
            </h3>
            <p className="mt-4 text-muted-foreground text-base">
              Legacy and modern ATS parsers (Taleo, Workday, Greenhouse) read documents linearly and assign match scores before a human eyes your application. Here is how standard resumes break down:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border-l-4 border-l-rose-500">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Multi-Column & Table Traps</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When resumes use 2-column sidebars or tables for skills, ATS text extractors interlace words across columns. *"React | AWS"* on line 1 merged with *"Python | Docker"* on line 2 becomes *"React Python AWS Docker"*, breaking exact phrase recognition.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border-l-4 border-l-amber-500">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Missing Required N-Grams</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If the Job Description asks for *"GraphQL APIs"* and your resume only says *"Query languages"*, keyword algorithms dock up to 40% of your compatibility score. ResumeIQ pinpoints exact missing hard skills vs preferred credentials.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl border-l-4 border-l-blue-500">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Unquantified Passive Bullets</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bullets starting with *"Responsible for..."* or *"Helped with..."* without measurable numbers (`%`, `$`, time saved) get flagged by semantic rankers as low-impact. Our AI prompts you for metrics without inventing numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Personas Showcase */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-border/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Tailored For Your Career Stage</h2>
          <h3 className="text-3xl sm:text-4xl font-black text-foreground">
            Built for Job Seekers Who Need Visibility Into the Black Box
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">Fresh Graduate</h4>
                  <span className="text-xs text-muted-foreground">First-time applicants</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Doesn’t know what *"ATS keywords"* or *"semantic parsing"* even means in practice. Needs guided, educational feedback that explains exact formatting pitfalls and how to turn academic projects into high-impact bullets.
              </p>
            </div>
            <div className="pt-4 border-t border-border/50 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Plain-English explanations & formatting warnings</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Repeat className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">Career Switcher</h4>
                  <span className="text-xs text-muted-foreground">Transitioning industries</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Has deep transferable skills and years of real experience, but phrasing doesn’t match the target industry’s vocabulary. Needs smart gap analysis to translate existing expertise into the exact terminology required by the new role.
              </p>
            </div>
            <div className="pt-4 border-t border-border/50 text-xs font-semibold text-purple-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Keyword gap translation & vocabulary alignment</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">High-Volume Applicant</h4>
                  <span className="text-xs text-muted-foreground">Applying to 20+ roles/week</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Needs to rapidly tailor a base resume to dozens of distinct job descriptions without starting from scratch every single time. Requires live score recalculations, version control, and 1-click ATS-safe DOCX/PDF exports.
              </p>
            </div>
            <div className="pt-4 border-t border-border/50 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Live WYSIWYG score panel & per-JD exports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-background border-t border-border/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-black text-foreground mb-6">
            Ready to See Why Your Resume Is Being Filtered?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload your PDF or DOCX file and paste any job description to get your instant 0–100 compatibility score and AI rewrite suggestions.
          </p>
          <Link
            to="/resume/new"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:scale-105"
          >
            <span>Start Your Free ATS Audit</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
