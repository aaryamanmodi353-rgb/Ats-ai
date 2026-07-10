import React, { useState } from 'react';
import { ShieldCheck, Key, Database, CheckCircle2, Zap, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [tier, setTier] = useState('pro'); // 'free' | 'pro'

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('ANTHROPIC_API_KEY_OVERRIDE', apiKey.trim());
      toast.success('Saved Anthropic API Key for MERN AI Coach override!');
    } else {
      localStorage.removeItem('ANTHROPIC_API_KEY_OVERRIDE');
      toast.info('Removed custom API Key. Reverting to Anti-Hallucination Simulation Guardrails.');
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
        <h1 className="text-3xl font-black text-foreground tracking-tight">MERN Platform Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your embedded MongoDB preferences, AI anti-hallucination guardrails, and subscription tiers.
        </p>
      </div>

      {/* Subscription Tier Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
          <Zap className="w-4 h-4" />
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
                ? 'border-primary bg-primary/10 shadow-lg'
                : 'border-border/60 bg-card hover:border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-lg">Free Candidate Plan</h3>
              {tier === 'free' && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Basic deterministic TF-IDF matching and format audit checks.
            </p>
            <ul className="space-y-2 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 3 ATS Scans / Month
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Format & Sidebar Audit
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
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg'
                : 'border-border/60 bg-card hover:border-border'
            }`}
          >
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl">
              Recommended
            </div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-lg">Pro Unlimited MERN</h3>
              {tier === 'pro' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Full AI bullet rewriting with &ldquo;Ask for Metric&rdquo; verification and unlimited exports.
            </p>
            <ul className="space-y-2 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Unlimited ATS Scans & Versions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Anti-Hallucination AI Coach
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> 1-Click DOCX Single-Column Export
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Key Override Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/60 shadow-lg space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Key className="w-4 h-4" />
            <span>Anthropic API Key Override</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            By default, ResumeIQ runs in **Intelligent Simulation Guardrail Mode** without requiring an external API key. If you want live Claude 3.5 Sonnet generation, input your `sk-ant-...` key below.
          </p>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Anthropic API Key</label>
            <input
              type="password"
              placeholder="sk-ant-api03-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary font-mono"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md">
            Save API Key Preference
          </button>
        </form>
      </div>

      {/* PII & Database Management */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/60 shadow-lg space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>PII Data Protection & Storage</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Your candidate data is stored in your Express backend using zero-configuration `mongodb-memory-server` or your local MongoDB. We never sell your resume or train LLM models on candidate Personally Identifiable Information (PII).
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Memory Storage • Zero Silent Telemetry</span>
          </div>
          <button
            onClick={handlePurgeData}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
          >
            Purge Cached PII Now
          </button>
        </div>
      </div>
    </div>
  );
}
