import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Pause,
  AlertTriangle,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import BulletRewriteCard from './BulletRewriteCard.jsx';

export default function BulletCoachCarousel({
  workExperience = [],
  jobDescriptionId,
  onApplyRewrite,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'unquantified' | 'weak'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'list'

  const ROTATE_INTERVAL_MS = 3500;

  // Flatten all bullets from workExperience
  const allBullets = useMemo(() => {
    const list = [];
    if (!Array.isArray(workExperience)) return list;
    workExperience.forEach((work, wIdx) => {
      work.bullets?.forEach((bullet, bIdx) => {
        const hasNumbers = /\d+/.test(bullet);
        const hasWeakVerb = /^(Responsible for|Helped with|Tasked with|Worked on|Assisted in)/i.test(bullet);
        list.push({
          id: `${wIdx}-${bIdx}`,
          workIndex: wIdx,
          bulletIndex: bIdx,
          company: work.company || 'Company',
          title: work.title || 'Role',
          bulletText: bullet,
          hasNumbers,
          hasWeakVerb,
        });
      });
    });
    return list;
  }, [workExperience]);

  const unquantifiedCount = useMemo(
    () => allBullets.filter((b) => !b.hasNumbers).length,
    [allBullets]
  );
  const weakVerbCount = useMemo(
    () => allBullets.filter((b) => b.hasWeakVerb).length,
    [allBullets]
  );

  const filteredBullets = useMemo(() => {
    if (filter === 'unquantified') {
      return allBullets.filter((b) => !b.hasNumbers);
    }
    if (filter === 'weak') {
      return allBullets.filter((b) => b.hasWeakVerb);
    }
    return allBullets;
  }, [allBullets, filter]);

  // Keep currentIndex in bounds when filtered bullets change
  useEffect(() => {
    if (currentIndex >= filteredBullets.length) {
      setCurrentIndex(Math.max(0, filteredBullets.length - 1));
      setProgress(0);
    }
  }, [filteredBullets.length, currentIndex]);

  // Robust Auto-rotate timer with visual progress tracking
  useEffect(() => {
    if (!isAutoRotating || filteredBullets.length <= 1) {
      setProgress(0);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / ROTATE_INTERVAL_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr + 1) % filteredBullets.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [isAutoRotating, filteredBullets.length]);

  const handleToggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => {
      const nextState = !prev;
      setProgress(0);
      if (nextState) {
        toast.success('Auto-Rotate enabled: rotating bullets every 3.5s');
      } else {
        toast.info('Auto-Rotate paused');
      }
      return nextState;
    });
  }, []);

  const handlePrev = useCallback(() => {
    if (filteredBullets.length === 0) return;
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + filteredBullets.length) % filteredBullets.length);
  }, [filteredBullets.length]);

  const handleNext = useCallback(() => {
    if (filteredBullets.length === 0) return;
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % filteredBullets.length);
  }, [filteredBullets.length]);

  const handleSelectBullet = useCallback((idx) => {
    setProgress(0);
    setCurrentIndex(idx);
  }, []);

  if (allBullets.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm text-center py-10 space-y-2">
        <Sparkles className="w-8 h-8 text-[#716b79] mx-auto opacity-50" />
        <h4 className="text-sm font-bold text-[#201a29]">No Experience Bullets Found</h4>
        <p className="text-xs text-[#716b79]">Upload a resume with parsed work experience to run AI bullet coaching.</p>
      </div>
    );
  }

  const currentBullet = filteredBullets[currentIndex];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm space-y-5 transition-all">
      {/* Header with Title & Slide Rotate Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f2ee] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5520a5]" />
            <h3 className="text-base font-bold text-[#201a29]">AI Bullet Coach</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#f0e8fa] text-[#5520a5] text-[10px] font-bold border border-[#dfd1f0]">
              {filteredBullets.length} Bullets
            </span>
          </div>
          <p className="text-[11px] text-[#716b79] mt-0.5">
            Slide and rotate through bullets to verify metrics & leadership verbs.
          </p>
        </div>

        {/* View Mode & Auto-Rotate Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <button
            onClick={handleToggleAutoRotate}
            title={isAutoRotating ? 'Pause auto-slide' : 'Auto-rotate slides (3.5s)'}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isAutoRotating
                ? 'bg-[#5520a5] text-white border-[#5520a5] shadow-sm ring-2 ring-[#5520a5]/20'
                : 'bg-[#f7f9f7] text-[#716b79] hover:text-[#201a29] border-[#e7e2eb]'
            }`}
          >
            {isAutoRotating ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span className="text-[11px] font-bold">Auto Rotating</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[11px]">Auto Rotate</span>
              </>
            )}
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'carousel' ? 'list' : 'carousel')}
            title={viewMode === 'carousel' ? 'Switch to All Bullets List' : 'Switch to Carousel Slide Mode'}
            className="p-1.5 rounded-xl bg-[#f7f9f7] hover:bg-[#eef2ee] text-[#716b79] hover:text-[#201a29] border border-[#e7e2eb] transition-colors"
          >
            {viewMode === 'carousel' ? <List className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live Animated Auto-Rotate Progress Bar */}
      {isAutoRotating && filteredBullets.length > 1 && (
        <div className="w-full h-1 bg-[#f0ebf3] rounded-full overflow-hidden -mt-2">
          <div
            className="h-full bg-[#5520a5] rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentIndex(0);
              setProgress(0);
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-[#5520a5] text-white shadow-sm'
                : 'bg-[#f6f3fa] text-[#716b79] hover:text-[#201a29] border border-[#e7e2eb]'
            }`}
          >
            All ({allBullets.length})
          </button>
          {unquantifiedCount > 0 && (
            <button
              onClick={() => {
                setFilter('unquantified');
                setCurrentIndex(0);
                setProgress(0);
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 flex items-center gap-1 ${
                filter === 'unquantified'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Needs Metrics ({unquantifiedCount})</span>
            </button>
          )}
          {weakVerbCount > 0 && (
            <button
              onClick={() => {
                setFilter('weak');
                setCurrentIndex(0);
                setProgress(0);
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
                filter === 'weak'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Weak Verbs ({weakVerbCount})
            </button>
          )}
        </div>

        {/* Carousel Stepper Buttons */}
        {viewMode === 'carousel' && filteredBullets.length > 1 && (
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <span className="text-[11px] font-semibold text-[#716b79]">
              {currentIndex + 1} / {filteredBullets.length}
            </span>
            <button
              onClick={handlePrev}
              aria-label="Previous bullet"
              className="p-1 rounded-lg bg-[#f6f3fa] hover:bg-[#eaf1ec] border border-[#dce5df] text-[#5520a5] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next bullet"
              className="p-1 rounded-lg bg-[#f6f3fa] hover:bg-[#eaf1ec] border border-[#dce5df] text-[#5520a5] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Slide Pill Navigator */}
      {viewMode === 'carousel' && filteredBullets.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {filteredBullets.map((bulletItem, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={bulletItem.id}
                onClick={() => handleSelectBullet(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#5520a5] text-white shadow-sm ring-2 ring-[#5520a5]/20'
                    : 'bg-[#f7f9f7] text-[#716b79] hover:bg-[#edf2ed] hover:text-[#201a29] border border-[#e7e2eb]'
                }`}
              >
                <span>#{idx + 1}</span>
                {!bulletItem.hasNumbers ? (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-300' : 'bg-rose-500'}`} />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-300' : 'bg-emerald-600'}`} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Slide Display Area */}
      {viewMode === 'carousel' ? (
        currentBullet ? (
          <div key={currentBullet.id} className="transition-all duration-300 animate-fadeIn">
            <BulletRewriteCard
              bulletIndex={currentBullet.bulletIndex}
              company={currentBullet.company}
              title={currentBullet.title}
              originalText={currentBullet.bulletText}
              jobDescriptionId={jobDescriptionId}
              onApplyRewrite={(newText) => {
                onApplyRewrite(currentBullet.workIndex, currentBullet.bulletIndex, newText);
              }}
            />
          </div>
        ) : (
          <p className="text-xs text-[#716b79] text-center py-6">No matching bullets in this filter.</p>
        )
      ) : (
        /* List Mode Fallback */
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {filteredBullets.map((item) => (
            <BulletRewriteCard
              key={item.id}
              bulletIndex={item.bulletIndex}
              company={item.company}
              title={item.title}
              originalText={item.bulletText}
              jobDescriptionId={jobDescriptionId}
              onApplyRewrite={(newText) => {
                onApplyRewrite(item.workIndex, item.bulletIndex, newText);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
