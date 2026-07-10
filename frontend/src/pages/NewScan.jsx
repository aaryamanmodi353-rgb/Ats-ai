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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          New ATS Audit & Score Scan
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
          Upload your resume and provide the exact job posting. Our deterministic MERN engine will run TF-IDF keyword extraction, formatting audit, and quantification breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Resume Input */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/60 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs">1</span>
                <span>Candidate Resume</span>
              </h2>

              <div className="flex rounded-lg bg-secondary/60 p-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded-md transition-all ${activeTab === 'upload' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  File Upload
                </button>
                <button
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1 rounded-md transition-all ${activeTab === 'paste' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {activeTab === 'upload' ? (
              <div className="space-y-4">
                <label className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group bg-secondary/10 hover:bg-secondary/20 min-h-[240px]">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {file ? file.name : 'Drop your Resume PDF or DOCX here'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                    Supported formats: <span className="font-semibold text-foreground">PDF, DOCX, TXT</span> up to 10MB.
                  </p>
                  {file && (
                    <span className="mt-4 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready for ingestion</span>
                    </span>
                  )}
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  rows={10}
                  placeholder="Paste raw text of your resume here..."
                  value={rawResumeText}
                  onChange={(e) => setRawResumeText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-background/80 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none font-mono leading-relaxed"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>We automatically detect and alert you if your layout contains multi-column or table traps.</span>
          </div>
        </div>

        {/* Right Column: Target Job Description */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/60 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-border/40 pb-4 mb-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-xs">2</span>
                <span>Target Job Description</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Paste Job Description Text (Recommended)</span>
                </label>
                <textarea
                  rows={7}
                  placeholder="Paste the full requirements, skills, and qualifications from the target role..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-background/80 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-border/40"></div>
                <span className="flex-shrink mx-4 text-xs font-semibold text-muted-foreground uppercase">Or</span>
                <div className="flex-grow border-t border-border/40"></div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Job Posting URL (Optional Simulation)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/jobs/view/..."
                  value={jdUrl}
                  onChange={(e) => setJdUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleRunScan}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Deterministic TF-IDF & Format Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Run Instant 4-Pillar ATS Audit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
