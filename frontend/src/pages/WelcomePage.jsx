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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden p-6 sm:p-10 selection:bg-blue-500/30">
      {/* Background ambient lighting & glowing particles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[130px] pointer-events-none animate-pulse duration-700" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Glassmorphic Portal Box */}
      <div className="relative z-10 max-w-4xl w-full rounded-3xl bg-slate-900/80 border border-white/10 shadow-[0_0_80px_-15px_rgba(59,130,246,0.3)] backdrop-blur-2xl p-8 sm:p-12 md:p-14 transition-all duration-500 flex flex-col items-center text-center">
        
        {/* Top Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Enterprise ATS Platform & Dual Overleaf Studio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
          Welcome to <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">ATS-AI</span> (<span className="text-white/90">ResumeIQ</span>)
        </h1>
        <p className="max-w-2xl text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal mb-8">
          The industry’s most advanced deterministic 6-Pillar resume optimization engine, Universal Document Syntax Renderer, and 12+ FAANG career track template gallery.
        </p>

        {/* System Initializing Buffer Bar */}
        <div className="w-full max-w-xl bg-slate-950/90 rounded-2xl border border-white/10 p-5 mb-8 shadow-inner text-left space-y-3.5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-2 text-slate-300 font-mono">
              <Terminal className="w-4 h-4 text-blue-400 shrink-0" />
              {bufferReady ? '🚀 System Buffer Ready — All Engines Online' : '⚙️ Initializing Deterministic ATS & LaTeX Engines...'}
            </span>
            <span className="text-blue-400 font-mono font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-400 font-medium">
            <div className={`flex items-center gap-1.5 transition-colors ${progress >= 25 ? 'text-emerald-400 font-bold' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>6-Pillar Engine</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${progress >= 50 ? 'text-emerald-400 font-bold' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Overleaf Studio</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${progress >= 75 ? 'text-emerald-400 font-bold' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Universal Renderer</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${progress >= 100 ? 'text-emerald-400 font-bold' : ''}`}>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>12+ Templates</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Highlight Grid inside the Welcome Portal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-10 text-left">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">6-Pillar Diagnostic</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans N-gram keywords, formatting traps, metrics, verbs, seniority, & skim density.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Dual Overleaf Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toggle between LaTeX code source and Form mode with real-time visual output.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Universal Renderer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates all HTML tags (`&lt;br&gt;`), LaTeX, & Markdown into clean visual DOM elements.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">12+ FAANG Templates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated layouts for Frontend, Backend, AI/ML, DevOps, & Amazon Leadership.
            </p>
          </div>
        </div>

        {/* Primary Action Button Suite */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleEnterPlatform}
            disabled={!bufferReady}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-all duration-300 transform ${
              bufferReady 
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white hover:scale-105 active:scale-95 cursor-pointer' 
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
            }`}
          >
            <span>✨ Enter ATS-AI Platform</span>
            <ArrowRight className="w-5 h-5 animate-bounce-x" />
          </button>

          <button
            onClick={handleQuickTemplates}
            disabled={!bufferReady}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Explore 12+ Templates</span>
          </button>
        </div>

        {/* Footer Security Note */}
        <div className="mt-8 pt-6 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Deterministic Parser Engine Active
          </span>
          <span className="font-mono text-[11px]">v3.0.0-PRO-BUILD</span>
        </div>

      </div>
    </div>
  );
}
