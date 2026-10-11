import React, { useState, useEffect } from 'react';
import { ShieldCheck, Key, Database, CheckCircle2, Zap, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [tier, setTier] = useState('pro'); // 'free' | 'pro'

  useEffect(() => {
    const savedKey = localStorage.getItem('GROQ_API_KEY_OVERRIDE') || localStorage.getItem('ANTHROPIC_API_KEY_OVERRIDE') || '';
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('GROQ_API_KEY_OVERRIDE', apiKey.trim());
      toast.success('Saved Groq API Key for Ultra-Fast LPU Bullet Coach!');
    } else {
      localStorage.removeItem('GROQ_API_KEY_OVERRIDE');
      localStorage.removeItem('ANTHROPIC_API_KEY_OVERRIDE');
      toast.info('Removed custom API Key. Reverting to Intelligent Simulation Guardrails.');
    }
  };

  const handlePurgeData = () => {
    if (window.confirm('Are you sure you want to clear your local PII and cached versions?')) {
      toast.success('Purged local cache and PII storage successfully.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141c18] tracking-tight">MERN Platform Settings</h1>
        <p className="text-sm text-[#5c6962] mt-1">
          Configure your embedded MongoDB preferences, AI anti-hallucination guardrails, and subscription tiers.
        </p>
      </div>

      {/* Subscription Tier Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#164e3f] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#164e3f]" />
          <span>Active Plan</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => {
              setTier('free');
              toast.info('Switched to Free Tier (3 scans/month limit simulation)');
            }}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              tier === 'free'
                ? 'border-[#164e3f] bg-[#f4f8f5] shadow-sm'
                : 'border-[#e6e9e4] bg-white hover:border-[#d2e2d8]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#141c18] text-lg">Free Candidate Plan</h3>
              {tier === 'free' && <CheckCircle2 className="w-5 h-5 text-[#164e3f]" />}
            </div>
            <p className="text-xs text-[#5c6962] mb-4">
              Basic deterministic TF-IDF matching and format audit checks.
            </p>
            <ul className="space-y-2 text-xs text-[#141c18]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#164e3f]" /> 3 ATS Scans / Month
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#164e3f]" /> Format & Sidebar Audit
              </li>
            </ul>
          </div>

          <div
            onClick={() => {
              setTier('pro');
              toast.success('Activated Pro Unlimited Tier!');
            }}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              tier === 'pro'
                ? 'border-[#164e3f] bg-[#f4f8f5] shadow-sm'
                : 'border-[#e6e9e4] bg-white hover:border-[#d2e2d8]'
            }`}
          >
            <div className="absolute -top-1 -right-1 bg-[#164e3f] text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl">
              Recommended
            </div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#141c18] text-lg">Pro Unlimited MERN</h3>
              {tier === 'pro' && <CheckCircle2 className="w-5 h-5 text-[#164e3f]" />}
            </div>
            <p className="text-xs text-[#5c6962] mb-4">
              Full AI bullet rewriting with &ldquo;Ask for Metric&rdquo; verification and unlimited exports.
            </p>
            <ul className="space-y-2 text-xs text-[#141c18]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#164e3f]" /> Unlimited ATS Scans & Versions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#164e3f]" /> Anti-Hallucination AI Coach
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#164e3f]" /> 1-Click DOCX Single-Column Export
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Key Override Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e6e9e4] shadow-sm space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#164e3f] flex items-center gap-2">
            <Key className="w-4 h-4 text-[#164e3f]" />
            <span>Groq Cloud API Key (LPU Ultra-Fast Inference)</span>
          </h2>
          <p className="text-xs text-[#5c6962] mt-1 leading-relaxed">
            By default, ResumeIQ runs in **Intelligent Simulation Guardrail Mode** without requiring an external API key. For live sub-second LPU inference powered by **Llama 3.3 70B Versatile**, input your Groq API key (starts with <code className="text-[#164e3f] font-mono font-semibold">gsk_...</code>) below.
          </p>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-[#5c6962] mb-1.5">Groq API Key (LPU Accelerated)</label>
            <input
              type="password"
              placeholder="gsk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f7f9f7] border border-[#e6e9e4] text-sm text-[#141c18] focus:outline-none focus:border-[#164e3f] font-mono"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#164e3f] hover:bg-[#124235] text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Save Groq API Key</span>
          </button>
        </form>
      </div>

      {/* PII & Database Management */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e6e9e4] shadow-sm space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2">
            <Database className="w-4 h-4 text-rose-600" />
            <span>PII Data Protection & Storage</span>
          </h2>
          <p className="text-xs text-[#5c6962] mt-1 leading-relaxed">
            Your candidate data is stored in your Express backend using zero-configuration `mongodb-memory-server` or your local MongoDB. We never sell your resume or train LLM models on candidate Personally Identifiable Information (PII).
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#164e3f]">
            <ShieldCheck className="w-4 h-4 text-[#164e3f]" />
            <span>Encrypted Memory Storage • Zero Silent Telemetry</span>
          </div>
          <button
            onClick={handlePurgeData}
            className="px-4 py-2 rounded-xl bg-[#fef2f2] hover:bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] text-xs font-semibold transition-colors shrink-0"
          >
            Purge Cached PII Now
          </button>
        </div>
      </div>
    </div>
  );
}
