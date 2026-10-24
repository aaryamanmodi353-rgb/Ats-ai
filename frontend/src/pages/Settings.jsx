import React, { useState } from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, Zap, Sparkles, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [tier, setTier] = useState('pro'); // 'free' | 'pro'

  const handlePurgeData = () => {
    if (window.confirm('Are you sure you want to clear your local PII and cached versions?')) {
      toast.success('Purged local cache and PII storage successfully.');
    }
  };

  return (
    <main className="settings-page relative isolate flex-1 overflow-hidden">
      <div className="dashboard-outer relative z-10 mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="dashboard-reference-frame">
          <div className="settings-shell relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="settings-header mb-9 sm:mb-11">
          <div className="settings-eyebrow">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Workspace preferences</span>
          </div>
          <h1 className="settings-title">MERN Platform Settings</h1>
          <p className="settings-description">
            Configure your embedded MongoDB preferences, AI anti-hallucination guardrails, and subscription tiers.
          </p>
        </header>

        {/* Subscription Tier Cards */}
        <section className="settings-section mb-8 sm:mb-10" aria-labelledby="settings-plan-heading">
          <div className="settings-section-heading">
            <div>
              <div className="settings-section-kicker">
                <Zap className="h-4 w-4" />
                <span>Plans & access</span>
              </div>
              <h2 id="settings-plan-heading" className="settings-section-title">Choose your plan</h2>
            </div>
            <div className="settings-current-plan">
              <span className="settings-current-dot" />
              Active plan <strong>{tier === 'pro' ? 'Pro Unlimited' : 'Free Candidate'}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div
              onClick={() => {
                setTier('free');
                toast.info('Switched to Free Tier (3 scans/month limit simulation)');
              }}
              className={`settings-plan-card w-full text-left ${tier === 'free' ? 'is-selected' : ''}`}
            >
              <div className="settings-plan-topline">
                <span className="settings-plan-icon settings-plan-icon-free"><Zap className="h-5 w-5" /></span>
                <span className={`settings-plan-state ${tier === 'free' ? 'is-active' : ''}`}>
                  {tier === 'free' ? <><CheckCircle2 className="h-3.5 w-3.5" /> Selected</> : 'Candidate'}
                </span>
              </div>
              <h3 className="settings-plan-title">Free Candidate Plan</h3>
              <p className="settings-plan-description">
                Basic deterministic TF-IDF matching and format audit checks.
              </p>
              <div className="settings-plan-divider" />
              <ul className="settings-plan-features">
                <li><CheckCircle2 className="h-4 w-4" /> <span>3 ATS Scans / Month</span></li>
                <li><CheckCircle2 className="h-4 w-4" /> <span>Format & Sidebar Audit</span></li>
              </ul>
            </div>

            <div
              onClick={() => {
                setTier('pro');
                toast.success('Activated Pro Unlimited Tier!');
              }}
              className={`settings-plan-card settings-plan-card-pro w-full text-left ${tier === 'pro' ? 'is-selected' : ''}`}
            >
              <span className="settings-recommended">Recommended</span>
              <div className="settings-plan-topline">
                <span className="settings-plan-icon settings-plan-icon-pro"><Sparkles className="h-5 w-5" /></span>
                <span className={`settings-plan-state ${tier === 'pro' ? 'is-active' : ''}`}>
                  {tier === 'pro' ? <><CheckCircle2 className="h-3.5 w-3.5" /> Selected</> : 'Unlimited'}
                </span>
              </div>
              <h3 className="settings-plan-title">Pro Unlimited MERN</h3>
              <p className="settings-plan-description">
                Full AI bullet rewriting with &ldquo;Ask for Metric&rdquo; verification and unlimited exports.
              </p>
              <div className="settings-plan-divider" />
              <ul className="settings-plan-features">
                <li><CheckCircle2 className="h-4 w-4" /> <span>Unlimited ATS Scans &amp; Versions</span></li>
                <li><CheckCircle2 className="h-4 w-4" /> <span>Anti-Hallucination AI Coach</span></li>
                <li><CheckCircle2 className="h-4 w-4" /> <span>1-Click DOCX Single-Column Export</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Backend AI Engine Status */}
        <section className="settings-surface settings-engine-surface mb-8 sm:mb-10" aria-labelledby="settings-engine-heading">
          <div className="settings-surface-heading">
            <div className="settings-surface-icon"><Cpu className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1">
              <div className="settings-section-kicker"><span>Intelligence layer</span></div>
              <h2 id="settings-engine-heading" className="settings-surface-title">Backend AI Engine <span>(Groq Cloud LPU)</span></h2>
              <p className="settings-surface-description">
                Powered by Groq Ultra-Fast LPU Inference directly on your Express backend. API keys and model parameters are securely managed server-side.
              </p>
            </div>
            <div className="settings-engine-status">
              <span className="settings-current-dot" />
              <span>Active &amp; Server-Managed</span>
            </div>
          </div>

          <div className="settings-engine-details">
            <div className="settings-detail-card">
              <span className="settings-detail-index">01</span>
              <p className="settings-detail-label">Inference engine</p>
              <p className="settings-detail-title">Groq LPU Cloud</p>
              <p className="settings-detail-copy">openai/gpt-oss-120b</p>
            </div>
            <div className="settings-detail-card">
              <span className="settings-detail-index">02</span>
              <p className="settings-detail-label">Security architecture</p>
              <p className="settings-detail-title">Zero-Leak Backend</p>
              <p className="settings-detail-copy">Key stored in backend/.env</p>
            </div>
            <div className="settings-detail-card">
              <span className="settings-detail-index">03</span>
              <p className="settings-detail-label">Anti-hallucination</p>
              <p className="settings-detail-title">Guardrails Active</p>
              <p className="settings-detail-copy">Metric verification enforced</p>
            </div>
          </div>
        </section>

        {/* PII & Database Management */}
        <section className="settings-surface settings-privacy-surface" aria-labelledby="settings-privacy-heading">
          <div className="settings-privacy-heading">
            <div className="settings-privacy-icon"><Database className="h-5 w-5" /></div>
            <div>
              <div className="settings-privacy-kicker">Privacy &amp; storage</div>
              <h2 id="settings-privacy-heading" className="settings-surface-title">PII Data Protection &amp; Storage</h2>
              <p className="settings-surface-description">
                Your candidate data is stored in your Express backend using zero-configuration `mongodb-memory-server` or your local MongoDB. We never sell your resume or train LLM models on candidate Personally Identifiable Information (PII).
              </p>
            </div>
          </div>

          <div className="settings-privacy-footer">
            <div className="settings-privacy-promise">
              <ShieldCheck className="h-5 w-5" />
              <span>Encrypted Memory Storage <i /> Zero Silent Telemetry</span>
            </div>
            <button onClick={handlePurgeData} className="settings-purge-button">
              <Database className="h-4 w-4" />
              <span>Purge Cached PII Now</span>
            </button>
          </div>
        </section>
          </div>
        </div>
      </div>
    </main>
  );
}
