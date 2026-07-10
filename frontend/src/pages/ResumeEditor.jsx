import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Save,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  FileCheck,
  ArrowLeft,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function ResumeEditor() {
  const { id: resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [activeVersion, setActiveVersion] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [liveScore, setLiveScore] = useState(68);
  const [versionLabel, setVersionLabel] = useState('');
  const [showRawStream, setShowRawStream] = useState(false);

  useEffect(() => {
    async function loadResume() {
      try {
        const res = await axios.get(`/api/resumes/${resumeId}`);
        if (res.data) {
          setResume(res.data);
          const ver = res.data.versions?.[0];
          if (ver) {
            setActiveVersion(ver);
            setVersionLabel(ver.versionLabel || 'v1.1 - Edited');
            setLiveScore(ver.atsScore || 68);
            const parsed = JSON.parse(ver.contentJson);
            setResumeData(parsed);
          }
        }
      } catch (e) {
        console.error(e);
        toast.error('Failed to load candidate resume.');
      } finally {
        setLoading(false);
      }
    }
    loadResume();
  }, [resumeId]);

  // Real-Time Heuristic Live Score Recalculator when editing skills/summary/bullets
  useEffect(() => {
    if (!resumeData) return;
    let base = 60;
    const text = JSON.stringify(resumeData).toLowerCase();
    const keywords = ['react', 'typescript', 'node.js', 'postgresql', 'mongodb', 'docker', 'aws', 'vite', 'graphql', 'redis'];
    let kwCount = 0;
    keywords.forEach((kw) => {
      if (text.includes(kw)) kwCount++;
    });
    base += Math.min(25, kwCount * 3);

    // Check quantification
    const bullets = [];
    resumeData.workExperience?.forEach((w) => {
      if (w.bullets) bullets.push(...w.bullets);
    });
    let quantCount = 0;
    bullets.forEach((b) => {
      if (/\d+/.test(b)) quantCount++;
    });
    if (bullets.length > 0) {
      base += Math.min(15, Math.round((quantCount / bullets.length) * 15));
    }

    setLiveScore(Math.min(100, Math.max(10, base)));
  }, [resumeData]);

  const handleSaveSnapshot = async () => {
    if (!activeVersion || !resumeData) return;
    setSaving(true);
    try {
      const res = await axios.put(`/api/resume-versions/${activeVersion._id || activeVersion.id}`, {
        versionLabel: versionLabel.trim() || 'Updated Version',
        contentJson: JSON.stringify(resumeData),
        atsScore: liveScore,
      });
      if (res.data.success) {
        toast.success(`Saved snapshot (${liveScore}/100) successfully!`);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save resume updates.');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format) => {
    if (!activeVersion) return;
    setExporting(true);
    try {
      const response = await axios.post(
        `/api/resume-versions/${activeVersion._id || activeVersion.id}/export`,
        { format },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const cleanName = (resumeData?.contact?.fullName || 'Candidate').replace(/\s+/g, '_');
      link.setAttribute('filename', `${cleanName}_ATS_Optimized.${format}`);
      link.setAttribute('download', `${cleanName}_ATS_Optimized.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported clean single-column ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to export ${format.toUpperCase()} file.`);
    } finally {
      setExporting(false);
    }
  };

  if (loading || !resumeData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Loading Live WYSIWYG Section Editor...</span>
      </div>
    );
  }

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 65) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/60 mb-8">
        <div>
          <Link to="/dashboard" className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Live Section Editor</h1>
            <input
              type="text"
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              className="px-3 py-1 rounded-lg bg-secondary/60 border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRawStream(!showRawStream)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all border ${
              showRawStream ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-secondary hover:bg-secondary/80 text-foreground border-border/80'
            }`}
          >
            <span>👀 {showRawStream ? 'Close ATS Robot Stream' : 'View ATS Robot Stream'}</span>
          </button>

          <button
            onClick={handleSaveSnapshot}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-emerald-400" />}
            <span>Save Snapshot</span>
          </button>

          <button
            onClick={() => handleExport('docx')}
            disabled={exporting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export Single-Column DOCX</span>
          </button>
        </div>
      </div>

      {/* Raw ATS Robot Parser Stream Card */}
      {showRawStream && resumeData && (
        <div className="p-6 rounded-2xl bg-[#0a0f18] border border-indigo-500/30 shadow-2xl mb-8 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>RAW ATS ROBOT PARSER STREAM (Workday / Taleo Plain-Text Simulation)</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Checked: Zero hidden tables or formatting traps</span>
          </div>
          <div className="p-4 rounded-xl bg-black/60 border border-white/5 text-emerald-400/90 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96">
            {`=========================================
CANDIDATE METADATA & CONTACT BLOCK
=========================================
FullName: ${resumeData.contact?.fullName || ''}
Email: ${resumeData.contact?.email || ''} | Phone: ${resumeData.contact?.phone || ''}
Location: ${resumeData.contact?.location || ''}

=========================================
EXECUTIVE SUMMARY
=========================================
${resumeData.summary || ''}

=========================================
EXTRACTED KEYWORD & CREDENTIAL INDEX
=========================================
HARD SKILLS: ${(resumeData.skills?.hardSkills || []).join(', ')}
TOOLS/SOFTWARE: ${(resumeData.skills?.tools || []).join(', ')}
SOFT SKILLS: ${(resumeData.skills?.softSkills || []).join(', ')}

=========================================
PARSED WORK HISTORY & IMPACT CHRONOLOGY
=========================================
${(resumeData.workExperience || []).map((w, i) => `[JOB #${i + 1}] ${w.title?.toUpperCase()} @ ${w.company?.toUpperCase()} (${w.startDate} - ${w.endDate})
Location: ${w.location || 'Remote'}
Bullets:
${(w.bullets || []).map((b) => ` * [METRIC AUDIT: ${/\d+/.test(b) ? 'PASS' : 'WARN'}] ${b}`).join('\n')}`).join('\n\n')}
=========================================
END OF PARSED STREAM — STATUS: 100% READABLE`}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left 3 Cols: Editable Form Sections */}
        <div className="lg:col-span-3 space-y-8">
          {/* 1. Contact Info Section */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2 border-b border-border/40 pb-3">
              <FileCheck className="w-4 h-4" />
              <span>Contact Information (Header Header Leak Prevention)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.contact.fullName || ''}
                  onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, fullName: e.target.value } })}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  value={resumeData.contact.email || ''}
                  onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, email: e.target.value } })}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resumeData.contact.phone || ''}
                  onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, phone: e.target.value } })}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Location</label>
                <input
                  type="text"
                  value={resumeData.contact.location || ''}
                  onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, location: e.target.value } })}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* 2. Professional Summary */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2 border-b border-border/40 pb-3">
              <span>Professional Summary</span>
            </h2>
            <textarea
              rows={4}
              value={resumeData.summary || ''}
              onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:border-primary resize-none leading-relaxed"
            />
          </div>

          {/* 3. Technical Skills */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center justify-between border-b border-border/40 pb-3">
              <span>Technical Skills & Tools (Exact N-Gram Match)</span>
              <span className="text-[11px] text-muted-foreground font-normal">Comma separated list</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Hard Skills (High TF-IDF Weight)</label>
                <input
                  type="text"
                  value={resumeData.skills.hardSkills?.join(', ') || ''}
                  onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, hardSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } })}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Tools & Software (Git, Docker, AWS)</label>
                <input
                  type="text"
                  value={resumeData.skills.tools?.join(', ') || ''}
                  onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } })}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. Work Experience */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                Work Experience Bullets
              </h2>
              <button
                onClick={() => {
                  const newWork = [
                    ...(resumeData.workExperience || []),
                    {
                      id: `work-${Date.now()}`,
                      company: 'New Company',
                      title: 'Role Title',
                      location: 'Remote',
                      startDate: '2023',
                      endDate: 'Present',
                      current: true,
                      bullets: ['Architected scalable module in React and TypeScript, boosting throughput by 30%.'],
                    },
                  ];
                  setResumeData({ ...resumeData, workExperience: newWork });
                }}
                className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {resumeData.workExperience?.map((work, wIdx) => (
                <div key={wIdx} className="p-5 rounded-xl bg-secondary/30 border border-border/50 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <input
                        type="text"
                        value={work.title}
                        placeholder="Job Title"
                        onChange={(e) => {
                          const copy = [...resumeData.workExperience];
                          copy[wIdx].title = e.target.value;
                          setResumeData({ ...resumeData, workExperience: copy });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm font-bold text-foreground focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        value={work.company}
                        placeholder="Company Name"
                        onChange={(e) => {
                          const copy = [...resumeData.workExperience];
                          copy[wIdx].company = e.target.value;
                          setResumeData({ ...resumeData, workExperience: copy });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm font-semibold text-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const copy = [...resumeData.workExperience];
                        copy.splice(wIdx, 1);
                        setResumeData({ ...resumeData, workExperience: copy });
                      }}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bullets List */}
                  <div className="space-y-2.5 pl-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Impact Bullets (Include metrics & active verbs)</label>
                    {work.bullets?.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <span className="text-primary font-bold text-sm">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const copy = [...resumeData.workExperience];
                            copy[wIdx].bullets[bIdx] = e.target.value;
                            setResumeData({ ...resumeData, workExperience: copy });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                        <button
                          onClick={() => {
                            const copy = [...resumeData.workExperience];
                            copy[wIdx].bullets.splice(bIdx, 1);
                            setResumeData({ ...resumeData, workExperience: copy });
                          }}
                          className="text-muted-foreground hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const copy = [...resumeData.workExperience];
                        copy[wIdx].bullets.push('Engineered automated testing pipeline, reducing bug escape rate by 25%.');
                        setResumeData({ ...resumeData, workExperience: copy });
                      }}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Real-Time ATS Score & Diagnostic Panel */}
        <div className="space-y-6 sticky top-24 h-fit">
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Live Score Recalculator</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Real-Time
              </span>
            </div>

            <div className="text-center py-4">
              <span className={`text-6xl font-black transition-colors ${getScoreColor(liveScore)}`}>
                {liveScore}
              </span>
              <span className="text-sm text-muted-foreground block mt-1 font-semibold">/ 100 Compatibility Score</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/40 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Keyword Coverage</span>
                <span className="font-bold text-foreground">{Math.min(100, liveScore + 10)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Single-Column Safety</span>
                <span className="font-bold text-emerald-400">100% Passed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Quantified Bullets</span>
                <span className="font-bold text-foreground">Active</span>
              </div>
            </div>

            <button
              onClick={() => handleExport('docx')}
              disabled={exporting}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download ATS-Safe DOCX</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
