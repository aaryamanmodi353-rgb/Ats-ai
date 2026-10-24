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
import BulletCoachCarousel from '../components/BulletCoachCarousel.jsx';

const escapeLatexText = (value) => [...String(value)].map((character) => ({
  '\\': '\\textbackslash{}',
  '#': '\\#',
  '$': '\\$',
  '%': '\\%',
  '&': '\\&',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
}[character] || character)).join('');

const addSkillsToOriginalLatex = (source, skills) => {
  if (typeof source !== 'string' || !source.trim()) return source;

  const uniqueSkills = [...new Map(
    skills
      .filter((skill) => typeof skill === 'string' && skill.trim())
      .map((skill) => [skill.trim().toLocaleLowerCase(), skill.trim()]),
  ).values()];
  if (uniqueSkills.length === 0) return source;

  const sectionPattern = /\\([A-Za-z@]*section)\*?\s*(?:\[[^\]]*\]\s*)?\{([^{}]*)\}/gi;
  const sections = [];
  let match;
  while ((match = sectionPattern.exec(source)) !== null) {
    const lineStart = source.lastIndexOf('\n', match.index - 1) + 1;
    const commentStart = source.indexOf('%', lineStart);
    if (commentStart >= 0 && commentStart < match.index) {
      let slashCount = 0;
      for (let i = commentStart - 1; i >= lineStart && source[i] === '\\'; i -= 1) slashCount += 1;
      if (slashCount % 2 === 0) continue;
    }
    sections.push({
      start: match.index,
      end: sectionPattern.lastIndex,
      command: match[1],
      title: match[2].replace(/\\&/g, '&'),
      starred: match[0].slice(match[1].length + 1).startsWith('*'),
    });
  }

  const skillsSectionIndex = sections.findIndex(({ title }) => /skills?|tools?|competenc|proficienc|technolog/i.test(title));
  const escapedSkills = uniqueSkills.map(escapeLatexText).join(', ');

  if (skillsSectionIndex >= 0) {
    const section = sections[skillsSectionIndex];
    const nextSection = sections[skillsSectionIndex + 1];
    const documentEnd = source.search(/\\end\s*\{\s*document\s*\}/i);
    const sectionEnd = Math.min(
      nextSection?.start ?? source.length,
      documentEnd >= section.end ? documentEnd : source.length,
    );
    const bodyStart = section.end;
    const body = source.slice(bodyStart, sectionEnd);
    const normalizedBody = body
      .replace(/%.*$/gm, '')
      .replace(/\\([#$%&_{}])/g, '$1')
      .toLocaleLowerCase();
    const additions = uniqueSkills.filter((skill) => {
      const normalizedSkill = skill.replace(/\\([#$%&_{}])/g, '$1').toLocaleLowerCase();
      return !normalizedBody.includes(normalizedSkill);
    });
    if (additions.length === 0) return source;

    const trailingWhitespace = body.match(/\s*$/)?.[0].length || 0;
    const insertAt = sectionEnd - trailingWhitespace;
    const addition = `\n\\par\\smallskip\n\\noindent\\textbf{Additional Skills:} ${additions.map(escapeLatexText).join(', ')}\\par\n`;
    return `${source.slice(0, insertAt)}${addition}${source.slice(insertAt)}`;
  }

  const insertionPoint = sections.find(({ title }) => /experience|employment|work history/i.test(title))?.start
    ?? source.search(/\\end\s*\{\s*document\s*\}/i);
  const target = insertionPoint >= 0 ? insertionPoint : source.length;
  const heading = sections[0]
    ? `\\${sections[0].command}${sections[0].starred ? '*' : ''}`
    : '\\section';
  const addition = `\n${heading}{Technical Skills}\n\\noindent ${escapedSkills}\n\n`;
  return `${source.slice(0, target)}${addition}${source.slice(target)}`;
};

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
      const updatedResumeData = {
        ...currentResumeData,
        skills: updatedSkills,
        ...(typeof currentResumeData.rawLatex === 'string'
          ? { rawLatex: addSkillsToOriginalLatex(currentResumeData.rawLatex, allMissing) }
          : {}),
      };

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
      const updatedResumeData = {
        ...currentResumeData,
        skills: updatedSkills,
        ...(typeof currentResumeData.rawLatex === 'string'
          ? { rawLatex: addSkillsToOriginalLatex(currentResumeData.rawLatex, allMissing) }
          : {}),
      };

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
    if (s >= 80) return 'text-[#5520a5]';
    if (s >= 65) return 'text-amber-700';
    return 'text-rose-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-[#716b79] border-b border-[#e7e2eb] pb-3">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="hover:text-[#5520a5] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Workspace / Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#201a29] font-medium">ATS Audit Report</span>
        </div>
        <div className="text-xs text-[#716b79] hidden sm:block">
          6-Pillar Audit Engine
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5520a5] mb-1">
            REPORT & METRICS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a29] tracking-tight flex items-center gap-3">
            <span>ATS Audit: {resume.originalFilename}</span>
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#f0e8fa] text-[#5520a5] border border-[#dfd1f0]">
              6-Pillar Enterprise Engine
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/resume/${resume._id || resume.id}/editor`}
            className="px-5 py-2.5 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all active:scale-[0.99]"
          >
            <Edit3 className="w-4 h-4" />
            <span>Open in Live Editor</span>
          </Link>
        </div>
      </div>

      {/* Top Banner: Composite Score & Summary */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#f6f3fa] border border-[#e2ece5]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#716b79] mb-3">Enterprise ATS Score</span>
            
            {/* Circular Gauge */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center mb-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#dbe5dd"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#5520a5"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - compositeScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#201a29] leading-none">
                  {compositeScore}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#716b79] mt-0.5">
                  / 100
                </span>
              </div>
            </div>

            <span className="mt-1 text-xs font-semibold px-3 py-0.5 rounded-full bg-white text-[#5520a5] border border-[#dfd1f0] shadow-sm">
              {compositeScore >= 80 ? 'PRO Elite Match & Ready' : compositeScore >= 65 ? 'Moderate Risk — Needs Polish' : 'High Auto-Rejection Risk'}
            </span>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-[#201a29] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#5520a5]" />
              <span>Diagnostic Explanation</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#716b79] leading-relaxed">
              {breakdown?.summaryExplanation || `Your resume scored ${compositeScore}/100 based on our 6-Pillar Pro formula (Keywords 30%, Format 15%, Metrics 15%, Action Verbs 15%, Seniority Alignment 15%, Readability 10%).`}
            </p>

            {/* 6 Pillar Mini Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#f0ebf3]">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#716b79]">Keywords (30%)</span>
                  <span className={getScoreColor(keywordScore)}>{keywordScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e8ede7] overflow-hidden">
                  <div className="h-full bg-[#5520a5] rounded-full" style={{ width: `${keywordScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#716b79]">Format Audit (15%)</span>
                  <span className={getScoreColor(formatScore)}>{formatScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e8ede7] overflow-hidden">
                  <div className="h-full bg-[#5520a5] rounded-full" style={{ width: `${formatScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#716b79]">Metrics (15%)</span>
                  <span className={getScoreColor(quantificationScore)}>{quantificationScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e8ede7] overflow-hidden">
                  <div className="h-full bg-[#5520a5] rounded-full" style={{ width: `${quantificationScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#716b79]">Action Verbs (15%)</span>
                  <span className={getScoreColor(actionVerbScore)}>{actionVerbScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e8ede7] overflow-hidden">
                  <div className="h-full bg-[#5520a5] rounded-full" style={{ width: `${actionVerbScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#716b79]">Seniority (15%)</span>
                  <span className={getScoreColor(seniorityScore)}>{seniorityScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e8ede7] overflow-hidden">
                  <div className="h-full bg-[#5520a5] rounded-full" style={{ width: `${seniorityScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#716b79]">Readability (10%)</span>
                  <span className={getScoreColor(readabilityScore)}>{readabilityScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e8ede7] overflow-hidden">
                  <div className="h-full bg-[#5520a5] rounded-full" style={{ width: `${readabilityScore}%` }} />
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
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-6">
            <div className="flex flex-col gap-4 border-b border-[#f0ebf3] pb-5">
              <div>
                <h3 className="text-lg font-bold text-[#201a29] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#5520a5]" />
                  <span>Exact N-Gram Keyword Gap Analysis</span>
                </h3>
                <p className="text-xs text-[#716b79] mt-0.5">
                  Extracted directly from the target Job Description against your parsed resume text. Click any action below to auto-inject or optimize.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 w-full pt-1">
                <button
                  onClick={handleAutoInjectKeywords}
                  disabled={injecting || (breakdown?.keywordMatch?.missingRequired?.length === 0 && breakdown?.keywordMatch?.missingPreferred?.length === 0)}
                  className="px-4 py-2.5 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {injecting ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Zap className="w-3.5 h-3.5 shrink-0" />}
                  <span>⚡ Auto-Inject Missing Skills</span>
                </button>
                <button
                  onClick={handleOptimizeVerbsAndWords}
                  disabled={optimizingWords}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#f6f3fa] text-[#5520a5] border border-[#dfd1f0] font-semibold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {optimizingWords ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Sparkles className="w-3.5 h-3.5 shrink-0" />}
                  <span>✨ Auto-Optimize Verbs & Repeated Words</span>
                </button>
                <button
                  onClick={handleInjectAndDownloadLatex}
                  disabled={downloadingLatex}
                  className="px-4 py-2.5 rounded-xl bg-[#f0e8fa] hover:bg-[#e7d9f5] text-[#5520a5] border border-[#d9c5ef] font-semibold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {downloadingLatex ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Download className="w-3.5 h-3.5 shrink-0" />}
                  <span>📥 Auto-Inject & Download LaTeX (.tex)</span>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Missing Required Hard Skills (Double Penalty)</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {breakdown?.keywordMatch?.missingRequired && breakdown.keywordMatch.missingRequired.length > 0 ? (
                    breakdown.keywordMatch.missingRequired.map((kw, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] text-xs font-semibold flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-rose-600" /> + {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#5520a5] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5520a5]" /> All required hard skills matched exactly!
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Missing Preferred & Tools Credentials</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[...(breakdown?.keywordMatch?.missingPreferred || []), ...(breakdown?.keywordMatch?.missingTools || [])].length > 0 ? (
                    [...(breakdown?.keywordMatch?.missingPreferred || []), ...(breakdown?.keywordMatch?.missingTools || [])].map((kw, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-[#fffbeb] border border-[#fde68a] text-[#92400e] text-xs font-medium">
                        + {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#5520a5] font-semibold">All preferred tools and software matched!</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5520a5] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5520a5]" />
                  <span>Successfully Matched Keywords</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {breakdown?.keywordMatch?.matchedKeywords && breakdown.keywordMatch.matchedKeywords.length > 0 ? (
                    breakdown.keywordMatch.matchedKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-[#f0e8fa] border border-[#d9c5ef] text-[#5520a5] text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#5520a5]" /> {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#716b79]">No exact keywords matched.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Deep Diagnostic Audit Card */}
          {breakdown?.deepDiagnosticAudit && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-6">
              <div className="border-b border-[#f0ebf3] pb-4">
                <h3 className="text-lg font-bold text-[#201a29] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#5520a5]" />
                  <span>Deep Diagnostic & Why Your Score is Low</span>
                </h3>
                <p className="text-xs text-[#716b79] mt-0.5">
                  Comprehensive 5-Point Audit covering action verbs, repetition, missing structural sections, domain alignment, and URL links.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f7f9f7] border border-[#e6ede8] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#5520a5]">
                    <Sparkles className="w-4 h-4 text-[#5520a5]" /> Action Verbs & Vocabulary
                  </div>
                  <p className="text-xs text-[#716b79] leading-relaxed">
                    {breakdown.deepDiagnosticAudit.actionVerbAdvice}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9f7] border border-[#e6ede8] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#5520a5]">
                    <Activity className="w-4 h-4 text-[#5520a5]" /> Word Repetition & Redundancy
                  </div>
                  <p className="text-xs text-[#716b79] leading-relaxed">
                    {breakdown.deepDiagnosticAudit.wordRepetitionAdvice}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9f7] border border-[#e6ede8] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-700" /> Structural Section Completeness
                  </div>
                  <p className="text-xs text-[#716b79] leading-relaxed">
                    {breakdown.deepDiagnosticAudit.componentAdvice}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9f7] border border-[#e6ede8] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#5520a5]">
                    <CheckCircle2 className="w-4 h-4 text-[#5520a5]" /> Project & JD Domain Alignment
                  </div>
                  <p className="text-xs text-[#716b79] leading-relaxed">
                    {breakdown.deepDiagnosticAudit.domainMatch}
                  </p>
                </div>

                <div className="md:col-span-2 p-4 rounded-xl bg-[#f7f9f7] border border-[#e6ede8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#5520a5]">
                      <ExternalLink className="w-4 h-4 text-[#5520a5]" /> URL & Link Health Verification
                    </div>
                    <p className="text-xs text-[#716b79] leading-relaxed">
                      {breakdown.deepDiagnosticAudit.linkAdvice}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg border text-xs font-semibold shrink-0 ${breakdown.deepDiagnosticAudit.urlsVerifiedCount > 0 ? 'bg-[#f0e8fa] text-[#5520a5] border-[#d9c5ef]' : 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'}`}>
                    {breakdown.deepDiagnosticAudit.urlsVerifiedCount > 0 ? `${breakdown.deepDiagnosticAudit.urlsVerifiedCount} Link(s) Active` : 'No URLs Found'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Formatting & Layout Audit */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0ebf3] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#201a29] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#5520a5]" />
                  <span>Formatting & Parseability Audit</span>
                </h3>
                <p className="text-xs text-[#716b79] mt-0.5">
                  Detects multi-column sidebars, table grids, and header/footer contact leaks.
                </p>
              </div>
              <span className="text-xs font-bold text-[#5520a5] px-3 py-1 rounded-lg bg-[#f0e8fa] border border-[#d9c5ef]">
                15% Weight
              </span>
            </div>

            <div className="space-y-4">
              {breakdown?.formattingAudit?.risksFound && breakdown.formattingAudit.risksFound.length > 0 ? (
                breakdown.formattingAudit.risksFound.map((risk, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-start gap-3.5">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#991b1b] uppercase tracking-wider">{risk.type.replace(/_/g, ' ')} Risk</h4>
                      <p className="text-sm text-[#7f1d1d] mt-1">{risk.description}</p>
                      <p className="text-xs text-[#991b1b] mt-2 font-semibold flex items-center gap-1">
                        <span>Fix Suggestion:</span> {risk.suggestion}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#f0e8fa] border border-[#d9c5ef] flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#5520a5] shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#5520a5]">Clean Single-Column Structure</h4>
                    <p className="text-xs text-[#335946] mt-0.5">Your layout passed all structural parseability checks without multi-column errors.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pillar 5: Seniority Alignment & Pillar 6: Readability Audit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0ebf3] pb-3">
                <h3 className="text-sm font-bold text-[#201a29] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#5520a5]" />
                  <span>Seniority Alignment</span>
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f0e8fa] text-[#5520a5] border border-[#dfd1f0]">
                  {breakdown?.seniorityAlignment?.targetLevelDetected || 'Mid-Level Target'}
                </span>
              </div>
              <p className="text-xs text-[#716b79] leading-relaxed">
                {breakdown?.seniorityAlignment?.insights?.[0]?.message || 'Your vocabulary aligns well with target role expectations.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0ebf3] pb-3">
                <h3 className="text-sm font-bold text-[#201a29] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#5520a5]" />
                  <span>Readability & Skim Audit</span>
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f0e8fa] text-[#5520a5] border border-[#dfd1f0]">
                  {breakdown?.readabilityAudit?.idealBulletsCount || 0}/{breakdown?.readabilityAudit?.totalBullets || 0} Ideal Bullets
                </span>
              </div>
              <p className="text-xs text-[#716b79] leading-relaxed">
                {breakdown?.readabilityAudit?.issues?.length > 0 ? (
                  <span>Flagged {breakdown.readabilityAudit.issues.length} bullets that exceed or fall short of optimal 12–28 word density.</span>
                ) : (
                  <span>All bullet points hit the optimal 12–28 word skim-ability window!</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: AI Bullet Rewrite Coach (Slide Rotate Carousel) */}
        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <BulletCoachCarousel
            workExperience={resumeData?.workExperience || []}
            jobDescriptionId={report.jobDescriptionId}
            onApplyRewrite={async (workIdx, bulletIdx, newText) => {
              if (!latestVer || !resumeData) return;
              const updatedWork = [...(resumeData.workExperience || [])];
              if (updatedWork[workIdx]?.bullets) {
                updatedWork[workIdx].bullets[bulletIdx] = newText;
                const updatedResumeData = { ...resumeData, workExperience: updatedWork };

                try {
                  await axios.put(`/api/resume-versions/${latestVer._id || latestVer.id}`, {
                    contentJson: JSON.stringify(updatedResumeData),
                  });
                  setResume((prev) => ({
                    ...prev,
                    versions: prev.versions.map((v, i) =>
                      i === 0 ? { ...v, contentJson: JSON.stringify(updatedResumeData) } : v
                    ),
                  }));
                  toast.success('Saved and synced updated bullet to resume version!');
                } catch (err) {
                  console.error('Error saving updated bullet:', err);
                  toast.error('Failed to sync updated bullet to database.');
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
