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
    <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-border transition-all space-y-5">
      {/* Original Bullet Display */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">{title}</span>
            <span className="text-xs text-muted-foreground">• {company}</span>
          </div>
          <div className="flex items-center gap-2">
            {!hasNumbers ? (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Unquantified
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Quantified
              </span>
            )}

            {hasWeakVerb && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-semibold">
                Weak Verb
              </span>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50 text-sm text-foreground italic leading-relaxed">
          &ldquo;{originalText}&rdquo;
        </div>
      </div>

      {/* AI Trigger / Options List */}
      {rewrites.length === 0 ? (
        <button
          onClick={handleFetchRewrites}
          disabled={loading}
          className="w-full py-3 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Keywords & Anti-Fabrication Guardrails...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate 3 AI ATS-Optimized Rewrites</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4 pt-2 border-t border-border/40 animate-accordion-down">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Grounded Rewrite Suggestions</span>
            </h4>
            <button
              onClick={handleFetchRewrites}
              disabled={loading}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          {flaggedWarnings.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Truthfulness Guardrail Flag:</span>
              </div>
              {flaggedWarnings.map((w, i) => (
                <p key={i} className="text-[11px]">{w}</p>
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
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border/60 hover:border-border bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                        Verb: {option.actionVerbUsed}
                      </span>
                      {option.keywordsAdded.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> + {kw}
                        </span>
                      ))}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-foreground leading-relaxed mb-2">
                    {option.rewrittenText}
                  </p>

                  {/* Ask for Metric Prompt */}
                  {option.promptForMetric && (
                    <div className="my-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-start gap-2 text-xs text-amber-300 font-semibold">
                        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <span>Metric Clarification Prompt (Anti-Hallucination):</span>
                      </div>
                      <p className="text-xs text-amber-200/90 pl-6">{option.promptForMetric}</p>
                      <div className="pl-6 flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. 35% latency drop / $40k saved / 1.5M users"
                          value={metricInput}
                          onChange={(e) => setMetricInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-background/80 border border-amber-500/40 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="text-[11px] text-muted-foreground truncate max-w-md">
                      {option.rationale}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(option);
                      }}
                      className="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-xs transition-colors shrink-0"
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
