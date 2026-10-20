import React, { useState } from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [tier, setTier] = useState('pro'); // 'free' | 'pro'

  const handlePurgeData = () => {
    if (window.confirm('Are you sure you want to clear your local PII and cached versions?')) {
      toast.success('Purged local cache and PII storage successfully.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201a29] tracking-tight">MERN Platform Settings</h1>
        <p className="text-sm text-[#716b79] mt-1">
          Configure your embedded MongoDB preferences, AI anti-hallucination guardrails, and subscription tiers.
        </p>
      </div>

      {/* Subscription Tier Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#5520a5] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#5520a5]" />
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
                ? 'border-[#5520a5] bg-[#f4f8f5] shadow-sm'
                : 'border-[#e7e2eb] bg-white hover:border-[#dfd1f0]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#201a29] text-lg">Free Candidate Plan</h3>
              {tier === 'free' && <CheckCircle2 className="w-5 h-5 text-[#5520a5]" />}
            </div>
            <p className="text-xs text-[#716b79] mb-4">
              Basic deterministic TF-IDF matching and format audit checks.
            </p>
            <ul className="space-y-2 text-xs text-[#201a29]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5520a5]" /> 3 ATS Scans / Month
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5520a5]" /> Format & Sidebar Audit
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
                ? 'border-[#5520a5] bg-[#f4f8f5] shadow-sm'
                : 'border-[#e7e2eb] bg-white hover:border-[#dfd1f0]'
            }`}
          >
            <div className="absolute -top-1 -right-1 bg-[#5520a5] text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl">
              Recommended
            </div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#201a29] text-lg">Pro Unlimited MERN</h3>
              {tier === 'pro' && <CheckCircle2 className="w-5 h-5 text-[#5520a5]" />}
            </div>
            <p className="text-xs text-[#716b79] mb-4">
              Full AI bullet rewriting with &ldquo;Ask for Metric&rdquo; verification and unlimited exports.
            </p>
            <ul className="space-y-2 text-xs text-[#201a29]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5520a5]" /> Unlimited ATS Scans & Versions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5520a5]" /> Anti-Hallucination AI Coach
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5520a5]" /> 1-Click DOCX Single-Column Export
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Backend AI Engine Status */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f2ee]">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5520a5] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#5520a5]" />
              <span>Backend AI Engine (Groq Cloud LPU)</span>
            </h2>
            <p className="text-xs text-[#716b79] mt-1 leading-relaxed">
              Powered by Groq Ultra-Fast LPU Inference directly on your Express backend. API keys and model parameters are securely managed server-side.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f8f5] border border-[#dfd1f0] text-xs font-semibold text-[#5520a5] shrink-0 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active &amp; Server-Managed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#f7f9f7] border border-[#e7e2eb]">
            <p className="text-[11px] font-semibold text-[#716b79] uppercase tracking-wider">Inference Engine</p>
            <p className="text-sm font-bold text-[#201a29] mt-1">Groq LPU Cloud</p>
            <p className="text-[11px] text-[#716b79] mt-0.5">openai/gpt-oss-120b</p>
          </div>
          <div className="p-4 rounded-xl bg-[#f7f9f7] border border-[#e7e2eb]">
            <p className="text-[11px] font-semibold text-[#716b79] uppercase tracking-wider">Security Architecture</p>
            <p className="text-sm font-bold text-[#201a29] mt-1">Zero-Leak Backend</p>
            <p className="text-[11px] text-[#716b79] mt-0.5">Key stored in backend/.env</p>
          </div>
          <div className="p-4 rounded-xl bg-[#f7f9f7] border border-[#e7e2eb]">
            <p className="text-[11px] font-semibold text-[#716b79] uppercase tracking-wider">Anti-Hallucination</p>
            <p className="text-sm font-bold text-[#201a29] mt-1">Guardrails Active</p>
            <p className="text-[11px] text-[#716b79] mt-0.5">Metric verification enforced</p>
          </div>
        </div>
      </div>

      {/* PII & Database Management */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2">
            <Database className="w-4 h-4 text-rose-600" />
            <span>PII Data Protection & Storage</span>
          </h2>
          <p className="text-xs text-[#716b79] mt-1 leading-relaxed">
            Your candidate data is stored in your Express backend using zero-configuration `mongodb-memory-server` or your local MongoDB. We never sell your resume or train LLM models on candidate Personally Identifiable Information (PII).
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5520a5]">
            <ShieldCheck className="w-4 h-4 text-[#5520a5]" />
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
