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
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e6e9e4] hover:border-[#164e3f]/40 transition-all space-y-4 shadow-sm">
      {/* Original Bullet Display */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#141c18]">{title}</span>
            <span className="text-xs text-[#5c6962]">• {company}</span>
          </div>
          <div className="flex items-center gap-2">
            {!hasNumbers ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Unquantified
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#e6f0ea] text-[#164e3f] border border-[#d2e2d8] text-[11px] font-semibold flex items-center gap-1">
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

        <div className="p-3.5 rounded-xl bg-[#f9faf8] border border-[#e8ece7] text-xs sm:text-sm text-[#141c18] italic leading-relaxed">
          &ldquo;{originalText}&rdquo;
        </div>
      </div>

      {/* AI Trigger / Options List */}
      {rewrites.length === 0 ? (
        <button
          onClick={handleFetchRewrites}
          disabled={loading}
          className="w-full py-3 rounded-xl border border-[#dce5df] bg-[#f4f7f4] hover:bg-[#eaf1ec] text-[#164e3f] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
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
        <div className="space-y-4 pt-2 border-t border-[#eef1ed] animate-accordion-down">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#164e3f] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Grounded Rewrite Suggestions</span>
            </h4>
            <button
              onClick={handleFetchRewrites}
              disabled={loading}
              className="text-[11px] font-semibold text-[#5c6962] hover:text-[#141c18] flex items-center gap-1"
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

          <div className="space-y-3">
            {rewrites.map((option) => {
              const isSelected = selectedRewriteId === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedRewriteId(option.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#164e3f] bg-[#f4f7f4] shadow-sm'
                      : 'border-[#e6e9e4] hover:border-[#dce2dc] bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#e6f0ea] text-[#164e3f] text-[10px] font-bold">
                        Verb: {option.actionVerbUsed}
                      </span>
                      {option.keywordsAdded.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-[#eef2ed] text-[#141c18] text-[10px] font-bold flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-[#164e3f]" /> + {kw}
                        </span>
                      ))}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#164e3f] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-[#141c18] leading-relaxed mb-2">
                    {option.rewrittenText}
                  </p>

                  {/* Ask for Metric Prompt */}
                  {option.promptForMetric && (
                    <div className="my-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-start gap-2 text-xs text-amber-900 font-semibold">
                        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                        <span>Metric Clarification Prompt (Anti-Hallucination):</span>
                      </div>
                      <p className="text-xs text-amber-800 pl-6">{option.promptForMetric}</p>
                      <div className="pl-6 flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. 35% latency drop / $40k saved / 1.5M users"
                          value={metricInput}
                          onChange={(e) => setMetricInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs text-[#141c18] placeholder:text-amber-800/50 focus:outline-none focus:border-[#164e3f]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#eef1ed]">
                    <span className="text-[11px] text-[#5c6962] truncate max-w-md">
                      {option.rationale}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(option);
                      }}
                      className="px-3.5 py-1 rounded-lg bg-[#164e3f] hover:bg-[#124235] text-white font-semibold text-xs transition-colors shrink-0"
                    >
                      Apply Rewrite
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
