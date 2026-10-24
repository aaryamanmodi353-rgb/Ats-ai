import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function NewScan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [file, setFile] = useState(null);
  const [rawResumeText, setRawResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [jdUrl, setJdUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      toast.success(`Selected file: ${selected.name}`);
    }
  };

  const handleRunScan = async () => {
    if (activeTab === 'upload' && !file && !rawResumeText) {
      toast.error('Please upload a resume file or switch to Paste Text.');
      return;
    }
    if (!jdText && !jdUrl) {
      toast.error('Please paste the target Job Description or URL to run an exact keyword match.');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload or parse resume
      const resumeFormData = new FormData();
      if (activeTab === 'upload' && file) {
        resumeFormData.append('file', file);
      } else {
        resumeFormData.append('rawText', rawResumeText);
      }

      const resumeRes = await axios.post('/api/resumes', resumeFormData, {
        headers: activeTab === 'upload' && file ? { 'Content-Type': 'multipart/form-data' } : {},
      });

      if (!resumeRes.data.success) {
        throw new Error('Failed to parse resume document.');
      }

      const { resumeId, versionId } = resumeRes.data;

      // 2. Ingest Job Description
      const jdRes = await axios.post('/api/job-descriptions', {
        rawText: jdText,
        sourceUrl: jdUrl,
      });

      if (!jdRes.data.success) {
        throw new Error('Failed to parse Job Description keywords.');
      }

      const { jobDescriptionId } = jdRes.data;

      // 3. Calculate deterministic 4-pillar score
      const scoreRes = await axios.post('/api/score', {
        resumeVersionId: versionId,
        jobDescriptionId,
      });

      if (scoreRes.data.success) {
        toast.success(`ATS compatibility check complete! Score: ${scoreRes.data.compositeScore}/100`);
        navigate(`/resume/${resumeId}/score/${scoreRes.data.reportId}`);
      } else {
        throw new Error('Score calculation failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred during the MERN ATS scan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newscan-page relative isolate flex-1">
      <div className="newscan-shell relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Breadcrumb & Status */}
      <div className="newscan-breadcrumb flex items-center justify-between text-xs text-[#716b79] border-b border-[#e7e2eb] pb-3">
        <div className="flex items-center gap-2">
          <span>Workspace</span>
          <span>/</span>
          <span className="text-[#201a29] font-medium">Overview</span>
        </div>
        <div className="text-xs text-[#716b79] hidden sm:block">
          Personal workspace
        </div>
      </div>

      {/* Hero Heading */}
      <div className="newscan-heading max-w-4xl space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#5520a5]">
          YOUR NEXT CHAPTER STARTS HERE
        </div>
        <h1 className="newscan-title text-3xl sm:text-4xl font-extrabold text-[#201a29] tracking-tight">
          A stronger resume. A better first impression.
        </h1>
        <p className="newscan-subtitle text-sm sm:text-base text-[#716b79] leading-relaxed">
          See your resume the way hiring systems do. Get a clear score and a focused plan to improve it.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="newscan-layout grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 01 / Resume Check & Job Description (7 cols) */}
        <div className="newscan-form-column lg:col-span-7 space-y-6">
          {/* Card 01: Resume Check */}
          <div className="newscan-form-card p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#716b79]">
                01 / RESUME CHECK
              </div>
              <h2 className="text-xl font-bold text-[#201a29]">
                Let&apos;s find your competitive edge.
              </h2>
              <p className="text-xs sm:text-sm text-[#716b79] leading-relaxed">
                Upload your latest resume to uncover what&apos;s working — and what&apos;s holding you back.
              </p>
            </div>

            {/* Upload or Paste Tab Switcher */}
            <div className="newscan-mode-switcher flex items-center justify-between border-b border-[#f0ebf3] pb-3">
              <span className="text-xs font-semibold text-[#716b79]">Resume Input Mode</span>
              <div className="newscan-mode-tabs flex rounded-lg bg-[#f3eff7] p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'upload'
                      ? 'bg-white text-[#5520a5] shadow-sm font-bold'
                      : 'text-[#716b79] hover:text-[#201a29]'
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'paste'
                      ? 'bg-white text-[#5520a5] shadow-sm font-bold'
                      : 'text-[#716b79] hover:text-[#201a29]'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {activeTab === 'upload' ? (
              <div className="space-y-4">
                <label className="newscan-upload-drop border border-dashed border-[#dce2dc] hover:border-[#5520a5] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-[#f9faf8] hover:bg-[#f6f3fa] min-h-[200px]">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-[#f0e8fa] flex items-center justify-center text-[#5520a5] mb-3">
                    <UploadCloud className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#201a29]">
                    Drag your resume here
                  </h3>
                  <p className="text-xs text-[#716b79] mt-1">
                    PDF or DOCX • Up to 5 MB
                  </p>
                  <div className="mt-4 px-4 py-1.5 rounded-lg bg-white border border-[#e3e7e2] text-xs font-semibold text-[#201a29] shadow-sm hover:bg-[#f9faf8]">
                    Browse files
                  </div>
                </label>

                {file && (
                  <div className="p-3.5 rounded-xl bg-white border border-[#e7e2eb] flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#f0e8fa] text-[#5520a5] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#201a29] truncate">
                          {file.name}
                        </div>
                        <div className="text-[11px] text-[#716b79]">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB • Ready to analyze
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#5520a5] shrink-0" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                  <textarea
                  rows={8}
                  placeholder="Paste raw text of your resume here..."
                  value={rawResumeText}
                  onChange={(e) => setRawResumeText(e.target.value)}
                  className="newscan-control w-full p-4 rounded-xl bg-white border border-[#e7e2eb] text-sm text-[#201a29] placeholder:text-[#716b79]/60 focus:outline-none focus:border-[#5520a5] transition-colors resize-none font-mono leading-relaxed"
                />
              </div>
            )}

            {/* Target Job Description Section */}
            <div className="pt-4 border-t border-[#f0ebf3] space-y-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#716b79]">
                  02 / TARGET JOB DESCRIPTION
                </div>
                <h3 className="text-sm font-bold text-[#201a29]">
                  Target Role Requirements (for exact keyword match)
                </h3>
              </div>

              <div>
                <textarea
                  rows={5}
                  placeholder="Paste the full requirements, skills, and qualifications from the target job posting..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="newscan-control w-full p-3.5 rounded-xl bg-white border border-[#e7e2eb] text-xs sm:text-sm text-[#201a29] placeholder:text-[#716b79]/60 focus:outline-none focus:border-[#5520a5] transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="relative flex py-0.5 items-center">
                <div className="flex-grow border-t border-[#f0ebf3]"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold text-[#716b79] uppercase tracking-wider">Or Job URL</span>
                <div className="flex-grow border-t border-[#f0ebf3]"></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 text-[#716b79] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://linkedin.com/jobs/view/... (Optional)"
                    value={jdUrl}
                    onChange={(e) => setJdUrl(e.target.value)}
                    className="newscan-control w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#e7e2eb] text-xs text-[#201a29] placeholder:text-[#716b79]/60 focus:outline-none focus:border-[#5520a5] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleRunScan}
                disabled={loading}
                className="newscan-submit w-full py-3.5 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing your resume with Groq & 6-Pillar Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze my resume</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#716b79]">
                Private by design. Your resume is never shared or used to train AI.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Preview of the Report (5 cols) */}
        <div className="newscan-report-column lg:col-span-5 space-y-6">
          <div className="newscan-report-card p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#201a29]">
              A LOOK INSIDE YOUR REPORT
            </div>

            {/* Preview Score Card */}
            <div className="newscan-score-preview p-6 rounded-2xl bg-[#f6f3fa] border border-[#e2ece5] text-center space-y-3">
              {/* Circular Gauge */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#e5deeb"
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
                    strokeDashoffset={251.2 * (1 - 0.78)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-[#201a29] leading-none">
                    78
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#716b79] mt-1">
                    OUT OF 100
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#201a29]">A good foundation</h4>
                <p className="text-xs text-[#716b79] mt-0.5">Sample report • Top 28%</p>
              </div>
            </div>

            {/* Metric Bars */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#201a29]">ATS readability</span>
                  <span className="text-[#5520a5] font-bold">92 / 100</span>
                </div>
                <div className="newscan-metric-track w-full h-2 rounded-full bg-[#e8ede7] overflow-hidden">
                  <div className="newscan-metric-fill h-full bg-[#5520a5] rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#201a29]">Keyword alignment</span>
                  <span className="text-[#5520a5] font-bold">71 / 100</span>
                </div>
                <div className="newscan-metric-track w-full h-2 rounded-full bg-[#e8ede7] overflow-hidden">
                  <div className="newscan-metric-fill h-full bg-[#5520a5] rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#201a29]">Content quality</span>
                  <span className="text-[#5520a5] font-bold">83 / 100</span>
                </div>
                <div className="newscan-metric-track w-full h-2 rounded-full bg-[#e8ede7] overflow-hidden">
                  <div className="newscan-metric-fill h-full bg-[#5520a5] rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
            </div>

            {/* Opportunity highlight */}
            <div className="pt-4 border-t border-[#f0ebf3] space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#716b79]">
                YOUR BIGGEST OPPORTUNITY
              </div>
              <p className="text-xs text-[#201a29] leading-relaxed">
                Add measurable outcomes to 3 experience bullets to demonstrate your impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Clarity Banner */}
      <div className="newscan-bottom-note rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-[#5520a5] text-[#f0e8fa] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-[#5520a5]">
          <span className="font-bold">Clarity, not just a score.</span> Every report covers parsing, keyword alignment, and the strength of your experience.
        </div>
      </div>
      </div>
    </div>
  );
}
