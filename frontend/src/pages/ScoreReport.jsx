import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Zap,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Edit3,
  Loader2,
  FileText,
  Activity,
  ExternalLink,
  Download,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import BulletRewriteCard from '../components/BulletRewriteCard.jsx';

export default function ScoreReport() {
  const { id: resumeId, reportId } = useParams();
  const [report, setReport] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [injecting, setInjecting] = useState(false);
  const [downloadingLatex, setDownloadingLatex] = useState(false);
  const [optimizingWords, setOptimizingWords] = useState(false);

  useEffect(() => {
    async function loadReport() {
      try {
        const resumeRes = await axios.get(`/api/resumes/${resumeId}`);
        if (resumeRes.data) {
          setResume(resumeRes.data);
          const latestVer = resumeRes.data.versions?.[0];
          let rep = null;

          if (reportId && reportId !== 'latest') {
            const rRes = await axios.get(`/api/score/${reportId}`);
            rep = rRes.data;
          } else if (latestVer?.scoreReports?.[0]) {
            rep = latestVer.scoreReports[0];
            if (typeof rep.breakdownJson === 'string') {
              rep.breakdown = JSON.parse(rep.breakdownJson);
            }
          }

          if (!rep && latestVer) {
            const jdRes = await axios.get('/api/job-descriptions');
            const targetJd = Array.isArray(jdRes.data) && jdRes.data.length > 0 ? jdRes.data[0] : null;
            if (targetJd) {
              const calcRes = await axios.post('/api/score', {
                resumeVersionId: latestVer._id || latestVer.id,
                jobDescriptionId: targetJd._id || targetJd.id,
              });
              if (calcRes.data.success) {
                const fetchedRep = await axios.get(`/api/score/${calcRes.data.reportId}`);
                rep = fetchedRep.data;
              }
            }
          }
          setReport(rep);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [resumeId, reportId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Loading ATS 4-Pillar breakdown...</span>
      </div>
    );
  }

  if (!report || !resume) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Score Report Not Found</h2>
        <p className="text-sm text-muted-foreground">We couldn&apos;t locate the score report snapshot for this resume version.</p>
        <Link to="/dashboard" className="inline-block px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const {
    compositeScore,
    keywordScore = 70,
    formatScore = 100,
    quantificationScore = 65,
    actionVerbScore = 80,
    seniorityScore = report?.seniorityScore || report?.breakdown?.seniorityAlignment?.score || 88,
    readabilityScore = report?.readabilityScore || report?.breakdown?.readabilityAudit?.score || 80,
    breakdown,
  } = report;
  const latestVer = resume.versions?.[0];
  const resumeData = latestVer ? JSON.parse(latestVer.contentJson) : null;

  const handleAutoInjectKeywords = async () => {
    if (!latestVer || !resumeData) return;
    const missingReq = breakdown?.keywordMatch?.missingRequired || [];
    const missingPref = breakdown?.keywordMatch?.missingPreferred || [];
    const missingTools = breakdown?.keywordMatch?.missingTools || [];
    const allMissing = [...missingReq, ...missingPref, ...missingTools];

    setInjecting(true);
    try {
      // 1. First run word/verb optimization API
      let currentResumeData = resumeData;
      const optRes = await axios.post('/api/optimize-bullets', {
        resumeVersionId: latestVer._id || latestVer.id,
        jobDescriptionId: report.jobDescriptionId || null,
      });
      if (optRes.data.success && optRes.data.updatedResumeData) {
        currentResumeData = optRes.data.updatedResumeData;
      }

      // 2. Add missing skills into hardSkills & tools
      const updatedSkills = {
        ...currentResumeData.skills,
        hardSkills: Array.from(new Set([...(currentResumeData.skills?.hardSkills || []), ...missingReq, ...missingPref])),
        tools: Array.from(new Set([...(currentResumeData.skills?.tools || []), ...missingTools])),
      };
      const updatedResumeData = { ...currentResumeData, skills: updatedSkills };

      await axios.put(`/api/resume-versions/${latestVer._id || latestVer.id}`, {
        versionLabel: `${latestVer.versionLabel || 'v1.0'} + Pro Optimized & Keywords`,
        contentJson: JSON.stringify(updatedResumeData),
        atsScore: Math.min(100, compositeScore + missingReq.length * 8 + missingPref.length * 3 + (optRes.data.changesCount > 0 ? 10 : 0)),
      });

      if (report.jobDescriptionId) {
        const recalc = await axios.post('/api/score', {
          resumeVersionId: latestVer._id || latestVer.id,
          jobDescriptionId: report.jobDescriptionId,
        });
        if (recalc.data.success) {
          const freshRep = await axios.get(`/api/score/${recalc.data.reportId}`);
          setReport(freshRep.data);
          toast.success(`⚡ Auto-injected skills & optimized ${optRes.data?.changesCount || 0} verbs/repeated words!`);
          return;
        }
      }
      toast.success('Injected missing keywords & optimized vocabulary successfully!');
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error('Failed to auto-inject keywords and optimize verbs.');
    } finally {
      setInjecting(false);
    }
  };

  const handleOptimizeVerbsAndWords = async () => {
    if (!latestVer || !resumeData) return;
    setOptimizingWords(true);
    try {
      const res = await axios.post('/api/optimize-bullets', {
        resumeVersionId: latestVer._id || latestVer.id,
        jobDescriptionId: report.jobDescriptionId || null,
      });

      if (res.data.success && res.data.changesCount > 0) {
        if (report.jobDescriptionId) {
          const recalc = await axios.post('/api/score', {
            resumeVersionId: latestVer._id || latestVer.id,
            jobDescriptionId: report.jobDescriptionId,
          });
          if (recalc.data.success) {
            const freshRep = await axios.get(`/api/score/${recalc.data.reportId}`);
            setReport(freshRep.data);
          }
        }
        toast.success(`✨ Auto-Optimized! Relocated verbs & removed ${res.data.changesCount} repeated/weak words!`);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.info('Your resume bullets already have elite action verbs and zero word repetition!');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to optimize vocabulary & verbs.');
    } finally {
      setOptimizingWords(false);
    }
  };

  const handleInjectAndDownloadLatex = async () => {
    if (!latestVer || !resumeData) return;
    const missingReq = breakdown?.keywordMatch?.missingRequired || [];
    const missingPref = breakdown?.keywordMatch?.missingPreferred || [];
    const missingTools = breakdown?.keywordMatch?.missingTools || [];
    const allMissing = [...missingReq, ...missingPref, ...missingTools];

    setDownloadingLatex(true);
    try {
      // 1. Optimize verbs & repeated words first
      let currentResumeData = resumeData;
      const optRes = await axios.post('/api/optimize-bullets', {
        resumeVersionId: latestVer._id || latestVer.id,
        jobDescriptionId: report.jobDescriptionId || null,
      });
      if (optRes.data.success && optRes.data.updatedResumeData) {
        currentResumeData = optRes.data.updatedResumeData;
      }

      const updatedSkills = {
        ...currentResumeData.skills,
        hardSkills: Array.from(new Set([...(currentResumeData.skills?.hardSkills || []), ...missingReq, ...missingPref])),
        tools: Array.from(new Set([...(currentResumeData.skills?.tools || []), ...missingTools])),
      };
      const updatedResumeData = { ...currentResumeData, skills: updatedSkills };

      await axios.put(`/api/resume-versions/${latestVer._id || latestVer.id}`, {
        versionLabel: `${latestVer.versionLabel || 'v1.0'} + LaTeX & Pro Words`,
        contentJson: JSON.stringify(updatedResumeData),
        atsScore: Math.min(100, compositeScore + missingReq.length * 8 + missingPref.length * 3 + 10),
      });

      const res = await axios.post(`/api/resume-versions/${latestVer._id || latestVer.id}/export`, {
        format: 'latex',
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/x-tex' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.contact?.fullName?.replace(/\s+/g, '_') || 'Candidate'}_Optimized_ATS_Resume.tex`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('⚡ Auto-optimized verbs/words, injected skills & downloaded LaTeX (.tex) resume!');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate optimized LaTeX resume.');
    } finally {
      setDownloadingLatex(false);
    }
  };

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 65) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBg = (s) => {
    if (s >= 80) return 'from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/30';
    if (s >= 65) return 'from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/30';
    return 'from-rose-500/20 via-rose-500/5 to-transparent border-rose-500/30';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link to="/dashboard" className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <span>PRO ATS Audit: {resume.originalFilename}</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              6-Pillar Enterprise Engine
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/resume/${resume._id || resume.id}/editor`}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Edit3 className="w-4 h-4" />
            <span>Open in Live Editor</span>
          </Link>
        </div>
      </div>

      {/* Top Banner: Composite Score & Summary */}
      <div className={`p-8 rounded-3xl bg-gradient-to-br border shadow-2xl mb-10 ${getScoreBg(compositeScore)}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-card/80 backdrop-blur-md border border-border/60">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Enterprise ATS Score</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-6xl font-black ${getScoreColor(compositeScore)}`}>{compositeScore}</span>
              <span className="text-xl font-bold text-muted-foreground">/100</span>
            </div>
            <span className="mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-foreground">
              {compositeScore >= 80 ? 'PRO Elite Match & Ready' : compositeScore >= 65 ? 'Moderate Risk — Needs Polish' : 'High Auto-Rejection Risk'}
            </span>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Diagnostic Explanation</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {breakdown?.summaryExplanation || `Your resume scored ${compositeScore}/100 based on our 6-Pillar Pro formula (Keywords 30%, Format 15%, Metrics 15%, Action Verbs 15%, Seniority Alignment 15%, Readability 10%).`}
            </p>

            {/* 6 Pillar Mini Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/40">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Keywords (30%)</span>
                  <span className={getScoreColor(keywordScore)}>{keywordScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${keywordScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Format Audit (15%)</span>
                  <span className={getScoreColor(formatScore)}>{formatScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${formatScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Metrics (15%)</span>
                  <span className={getScoreColor(quantificationScore)}>{quantificationScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${quantificationScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Action Verbs (15%)</span>
                  <span className={getScoreColor(actionVerbScore)}>{actionVerbScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${actionVerbScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Seniority (15%)</span>
                  <span className={getScoreColor(seniorityScore)}>{seniorityScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${seniorityScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-muted-foreground">Readability (10%)</span>
                  <span className={getScoreColor(readabilityScore)}>{readabilityScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${readabilityScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Keyword Gap Analysis & Format Warnings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Keyword Gap Analysis */}
          <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/60 shadow-lg space-y-6">
            <div className="flex flex-col gap-4 border-b border-border/40 pb-5">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span>Exact N-Gram Keyword Gap Analysis</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Extracted directly from the target Job Description against your parsed resume text. Click any action below to auto-inject or optimize.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 w-full pt-1">
                <button
                  onClick={handleAutoInjectKeywords}
                  disabled={injecting || (breakdown?.keywordMatch?.missingRequired?.length === 0 && breakdown?.keywordMatch?.missingPreferred?.length === 0)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {injecting ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Zap className="w-3.5 h-3.5 shrink-0" />}
                  <span>⚡ Auto-Inject Missing Skills</span>
                </button>
                <button
                  onClick={handleOptimizeVerbsAndWords}
                  disabled={optimizingWords}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {optimizingWords ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Sparkles className="w-3.5 h-3.5 shrink-0" />}
                  <span>✨ Auto-Optimize Verbs & Repeated Words</span>
                </button>
                <button
                  onClick={handleInjectAndDownloadLatex}
                  disabled={downloadingLatex}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {downloadingLatex ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Download className="w-3.5 h-3.5 shrink-0" />}
                  <span>📥 Auto-Inject & Download LaTeX (.tex)</span>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Missing Required Hard Skills (Double Penalty)</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {breakdown?.keywordMatch?.missingRequired && breakdown.keywordMatch.missingRequired.length > 0 ? (
                    breakdown.keywordMatch.missingRequired.map((kw, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5">
                        <Zap className="w-3 h-3" /> + {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All required hard skills matched exactly!
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Missing Preferred & Tools Credentials</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[...(breakdown?.keywordMatch?.missingPreferred || []), ...(breakdown?.keywordMatch?.missingTools || [])].length > 0 ? (
                    [...(breakdown?.keywordMatch?.missingPreferred || []), ...(breakdown?.keywordMatch?.missingTools || [])].map((kw, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                        + {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold">All preferred tools and software matched!</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Successfully Matched Keywords</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {breakdown?.keywordMatch?.matchedKeywords && breakdown.keywordMatch.matchedKeywords.length > 0 ? (
                    breakdown.keywordMatch.matchedKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No exact keywords matched.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Deep Diagnostic Audit Card */}
          {breakdown?.deepDiagnosticAudit && (
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/60 shadow-lg space-y-6">
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>Deep Diagnostic & Why Your Score is Low</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Comprehensive 5-Point Audit covering action verbs, repetition, missing structural sections, domain alignment, and URL links.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-purple-400">
                    <Sparkles className="w-4 h-4" /> Action Verbs & Vocabulary
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {breakdown.deepDiagnosticAudit.actionVerbAdvice}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-blue-400">
                    <Activity className="w-4 h-4" /> Word Repetition & Redundancy
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {breakdown.deepDiagnosticAudit.wordRepetitionAdvice}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-400">
                    <AlertTriangle className="w-4 h-4" /> Structural Section Completeness
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {breakdown.deepDiagnosticAudit.componentAdvice}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Project & JD Domain Alignment
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {breakdown.deepDiagnosticAudit.domainMatch}
                  </p>
                </div>

                <div className="md:col-span-2 p-4 rounded-xl bg-secondary/50 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-400">
                      <ExternalLink className="w-4 h-4" /> URL & Link Health Verification
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {breakdown.deepDiagnosticAudit.linkAdvice}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg border text-xs font-bold shrink-0 ${breakdown.deepDiagnosticAudit.urlsVerifiedCount > 0 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
                    {breakdown.deepDiagnosticAudit.urlsVerifiedCount > 0 ? `${breakdown.deepDiagnosticAudit.urlsVerifiedCount} Link(s) Active` : 'No URLs Found'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Formatting & Layout Audit */}
          <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/60 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>Formatting & Parseability Audit</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Detects multi-column sidebars, table grids, and header/footer contact leaks.
                </p>
              </div>
              <span className="text-xs font-black text-indigo-400 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                15% Weight
              </span>
            </div>

            <div className="space-y-4">
              {breakdown?.formattingAudit?.risksFound && breakdown.formattingAudit.risksFound.length > 0 ? (
                breakdown.formattingAudit.risksFound.map((risk, i) => (
                  <div key={i} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3.5">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">{risk.type.replace(/_/g, ' ')} Risk</h4>
                      <p className="text-sm text-rose-200/90 mt-1">{risk.description}</p>
                      <p className="text-xs text-rose-300/80 mt-2 font-semibold flex items-center gap-1">
                        <span>Fix Suggestion:</span> {risk.suggestion}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300">Clean Single-Column Structure</h4>
                    <p className="text-xs text-emerald-200/90 mt-0.5">Your layout passed all structural parseability checks without multi-column errors.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pillar 5: Seniority Alignment & Pillar 6: Readability Audit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Seniority Alignment</span>
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {breakdown?.seniorityAlignment?.targetLevelDetected || 'Mid-Level Target'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {breakdown?.seniorityAlignment?.insights?.[0]?.message || 'Your vocabulary aligns well with target role expectations.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Readability & Skim Audit</span>
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  {breakdown?.readabilityAudit?.idealBulletsCount || 0}/{breakdown?.readabilityAudit?.totalBullets || 0} Ideal Bullets
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {breakdown?.readabilityAudit?.issues?.length > 0 ? (
                  <span>Flagged {breakdown.readabilityAudit.issues.length} bullets that exceed or fall short of optimal 12–28 word density.</span>
                ) : (
                  <span>All bullet points hit the optimal 12–28 word skim-ability window!</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: AI Bullet Rewrite Coach */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>AI Bullet Coach</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                We review every experience bullet for quantifiable metrics (`%`, `$`) and action verbs. Click &ldquo;Generate Rewrites&rdquo; to test anti-fabrication guardrails.
              </p>
            </div>

            <div className="space-y-4">
              {resumeData?.workExperience?.length > 0 ? (
                resumeData.workExperience.map((work, wIdx) => (
                  <div key={wIdx} className="space-y-4">
                    {work.bullets?.map((bullet, bIdx) => (
                      <BulletRewriteCard
                        key={`${wIdx}-${bIdx}`}
                        bulletIndex={bIdx}
                        company={work.company}
                        title={work.title}
                        originalText={bullet}
                        jobDescriptionId={report.jobDescriptionId}
                        onApplyRewrite={(newText) => {
                          work.bullets[bIdx] = newText;
                        }}
                      />
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">No experience bullets found to rewrite.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
