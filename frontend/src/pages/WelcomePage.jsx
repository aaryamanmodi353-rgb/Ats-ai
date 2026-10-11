import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ShieldCheck, Cpu, Layout, FileText, CheckCircle2, 
  ArrowRight, Zap, Award, Layers, Terminal
} from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [bufferReady, setBufferReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBufferReady(true);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const handleEnterPlatform = () => {
    sessionStorage.setItem('ats_welcome_passed', 'true');
    navigate('/');
  };

  const handleQuickTemplates = () => {
    sessionStorage.setItem('ats_welcome_passed', 'true');
    navigate('/templates');
  };

  const handleQuickEditor = () => {
    sessionStorage.setItem('ats_welcome_passed', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-[#141c18] flex flex-col items-center justify-center relative overflow-hidden p-6 sm:p-10">
      {/* Main Clean Portal Box */}
      <div className="relative z-10 max-w-4xl w-full rounded-3xl bg-white border border-[#e6e9e4] shadow-sm p-8 sm:p-12 md:p-14 flex flex-col items-center text-center">
        
        {/* Top Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e6f0ea] border border-[#d2e2d8] text-[#164e3f] text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#164e3f]" />
          <span>Enterprise ATS Platform & Dual Overleaf Studio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#164e3f]" />
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#141c18] mb-4 leading-tight">
          Welcome to <span className="text-[#164e3f]">ATS-AI</span> (<span>ResumeIQ</span>)
        </h1>
        <p className="max-w-2xl text-[#5c6962] text-sm sm:text-base md:text-lg leading-relaxed font-normal mb-8">
          The industry’s most advanced deterministic 6-Pillar resume optimization engine, Universal Document Syntax Renderer, and 12+ FAANG career track template gallery.
        </p>

        {/* System Initializing Buffer Bar */}
        <div className="w-full max-w-xl bg-[#f7f9f7] rounded-2xl border border-[#e6e9e4] p-5 mb-8 text-left space-y-3.5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-2 text-[#141c18] font-mono">
              <Terminal className="w-4 h-4 text-[#164e3f] shrink-0" />
              {bufferReady ? '🚀 System Buffer Ready — All Engines Online' : '⚙️ Initializing Deterministic ATS & LaTeX Engines...'}
            </span>
            <span className="text-[#164e3f] font-mono font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#e6ede8] overflow-hidden">
            <div 
              className="h-full rounded-full bg-[#164e3f] transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-[#5c6962] font-medium">
            <div className={`flex items-center gap-1.5 transition-colors ${progress >= 25 ? 'text-[#164e3f] font-semibold' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>6-Pillar Engine</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${progress >= 50 ? 'text-[#164e3f] font-semibold' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Overleaf Studio</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${progress >= 75 ? 'text-[#164e3f] font-semibold' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Universal Renderer</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${progress >= 100 ? 'text-[#164e3f] font-semibold' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>12+ Templates</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Highlight Grid inside the Welcome Portal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-10 text-left">
          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-[#e6e9e4] hover:border-[#164e3f] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#e6f0ea] border border-[#d2e2d8] flex items-center justify-center text-[#164e3f] mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#141c18] mb-1">6-Pillar Diagnostic</h3>
            <p className="text-xs text-[#5c6962] leading-relaxed">
              Scans N-gram keywords, formatting traps, metrics, verbs, seniority, & skim density.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-[#e6e9e4] hover:border-[#164e3f] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#e6f0ea] border border-[#d2e2d8] flex items-center justify-center text-[#164e3f] mb-3">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#141c18] mb-1">Dual Overleaf Studio</h3>
            <p className="text-xs text-[#5c6962] leading-relaxed">
              Toggle between LaTeX code source and Form mode with real-time visual output.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-[#e6e9e4] hover:border-[#164e3f] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#e6f0ea] border border-[#d2e2d8] flex items-center justify-center text-[#164e3f] mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#141c18] mb-1">Universal Renderer</h3>
            <p className="text-xs text-[#5c6962] leading-relaxed">
              Evaluates all HTML tags (`&lt;br&gt;`), LaTeX, & Markdown into clean visual DOM elements.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-[#e6e9e4] hover:border-[#164e3f] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#e6f0ea] border border-[#d2e2d8] flex items-center justify-center text-[#164e3f] mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#141c18] mb-1">12+ FAANG Templates</h3>
            <p className="text-xs text-[#5c6962] leading-relaxed">
              Curated layouts for Frontend, Backend, AI/ML, DevOps, & Amazon Leadership.
            </p>
          </div>
        </div>

        {/* Primary Action Button Suite */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleEnterPlatform}
            disabled={!bufferReady}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm ${
              bufferReady 
                ? 'bg-[#164e3f] hover:bg-[#124235] text-white active:scale-95 cursor-pointer' 
                : 'bg-[#e6ede8] text-[#5c6962] border border-[#d2e2d8] cursor-not-allowed opacity-75'
            }`}
          >
            <span>✨ Enter ATS-AI Platform</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleQuickTemplates}
            disabled={!bufferReady}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#e6f0ea] hover:bg-[#d8e7de] border border-[#c8ded1] text-[#164e3f] font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4 text-[#164e3f]" />
            <span>Explore 12+ Templates</span>
          </button>
        </div>

        {/* Footer Security Note */}
        <div className="mt-8 pt-6 border-t border-[#eef1ed] w-full flex flex-col sm:flex-row items-center justify-between text-xs text-[#5c6962] gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#164e3f] inline-block" />
            Deterministic Parser Engine Active
          </span>
          <span className="font-mono text-[11px]">v3.0.0-PRO-BUILD</span>
        </div>

      </div>
    </div>
  );
}
