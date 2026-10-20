import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
  Check,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function BulletRewriteCard({
  bulletIndex,
  company,
  title,
  originalText,
  jobDescriptionId,
  onApplyRewrite,
}) {
  const [loading, setLoading] = useState(false);
  const [rewrites, setRewrites] = useState([]);
  const [flaggedWarnings, setFlaggedWarnings] = useState([]);
  const [selectedRewriteId, setSelectedRewriteId] = useState(null);
  const [metricInput, setMetricInput] = useState('');

  const hasNumbers = /\d+/.test(originalText);
  const hasWeakVerb = /^(Responsible for|Helped with|Tasked with|Worked on|Assisted in)/i.test(originalText);

  const handleFetchRewrites = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/rewrite-suggestions', {
        bulletText: originalText,
        company,
        title,
        jobDescriptionId,
      });
      const data = response.data;
      if (data.success && Array.isArray(data.rewrites)) {
        setRewrites(data.rewrites);
        setFlaggedWarnings(data.unsupportedRequirementsFlagged || []);
        if (data.rewrites.length > 0) {
          setSelectedRewriteId(data.rewrites[0].id);
        }
      } else {
        toast.error('Failed to load AI suggestions.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect to AI Coach service.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (rewrite) => {
    let textToApply = rewrite.rewrittenText;
    if (rewrite.promptForMetric && metricInput.trim()) {
      textToApply = `${textToApply} achieving ${metricInput.trim()}.`;
    }
    onApplyRewrite(textToApply);
    toast.success(`Updated experience bullet for ${company}!`);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e7e2eb] hover:border-[#5520a5]/40 transition-all space-y-4 shadow-sm">
      {/* Original Bullet Display */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#201a29]">{title}</span>
            <span className="text-xs text-[#716b79]">• {company}</span>
          </div>
          <div className="flex items-center gap-2">
            {!hasNumbers ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Unquantified
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#f0e8fa] text-[#5520a5] border border-[#dfd1f0] text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Quantified
              </span>
            )}

            {hasWeakVerb && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                Weak Verb
              </span>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#f9faf8] border border-[#e8ece7] text-xs sm:text-sm text-[#201a29] italic leading-relaxed">
          &ldquo;{originalText}&rdquo;
        </div>
      </div>

      {/* AI Trigger / Options List */}
      {rewrites.length === 0 ? (
        <button
          onClick={handleFetchRewrites}
          disabled={loading}
          className="w-full py-3 rounded-xl border border-[#dce5df] bg-[#f6f3fa] hover:bg-[#eaf1ec] text-[#5520a5] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing with Groq LPU Guardrails...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate 3 AI ATS-Optimized Rewrites</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4 pt-2 border-t border-[#f0ebf3] animate-accordion-down">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5520a5] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Grounded Rewrite Suggestions</span>
            </h4>
            <button
              onClick={handleFetchRewrites}
              disabled={loading}
              className="text-[11px] font-semibold text-[#716b79] hover:text-[#201a29] flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          {flaggedWarnings.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Truthfulness Guardrail Flag:</span>
              </div>
              {flaggedWarnings.map((w, i) => (
                <p key={i} className="text-[11px] text-amber-800">{w}</p>
              ))}
            </div>
          )}

          {/* Horizontal Suggestion Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {rewrites.map((option, idx) => {
              const isSelected = selectedRewriteId === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedRewriteId(option.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#5520a5] text-white border-[#5520a5] shadow-sm'
                      : 'bg-[#f7f9f7] text-[#716b79] hover:text-[#201a29] border-[#e7e2eb]'
                  }`}
                >
                  <span>Suggestion {idx + 1}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#f0e8fa] text-[#5520a5]'
                    }`}
                  >
                    {option.actionVerbUsed}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Suggestion Card */}
          {(() => {
            const activeOption = rewrites.find((r) => r.id === selectedRewriteId) || rewrites[0];
            if (!activeOption) return null;
            return (
              <div
                key={activeOption.id}
                className="p-4 sm:p-5 rounded-xl border border-[#5520a5]/30 bg-[#f6f3fa]/40 shadow-sm space-y-3.5 transition-all animate-fadeIn"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#f0e8fa] text-[#5520a5] text-[10px] font-bold">
                      Verb: {activeOption.actionVerbUsed}
                    </span>
                    {activeOption.keywordsAdded?.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-[#f2eef6] text-[#201a29] text-[10px] font-bold flex items-center gap-1"
                      >
                        <Zap className="w-2.5 h-2.5 text-[#5520a5]" /> + {kw}
                      </span>
                    ))}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-700" /> Active
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#201a29] leading-relaxed">
                  {activeOption.rewrittenText}
                </p>

                {/* Ask for Metric Prompt */}
                {activeOption.promptForMetric && (
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-amber-900 font-semibold">
                      <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                      <span>Metric Clarification Prompt (Anti-Hallucination):</span>
                    </div>
                    <p className="text-xs text-amber-800 pl-6 leading-relaxed">{activeOption.promptForMetric}</p>
                    <div className="pl-6 flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="e.g. 35% latency drop / $40k saved / 1.5M users"
                        value={metricInput}
                        onChange={(e) => setMetricInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs text-[#201a29] placeholder:text-amber-800/50 focus:outline-none focus:border-[#5520a5]"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-[#e2e8e3]">
                  <span className="text-[11px] text-[#716b79] leading-snug line-clamp-2 max-w-sm">
                    {activeOption.rationale}
                  </span>
                  <button
                    onClick={() => handleApply(activeOption)}
                    className="px-4 py-2 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Apply Rewrite</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
