import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, Cpu, Layout, CheckCircle2,
  ArrowRight, Award, Layers, Terminal, FileCheck,
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

  const stages = [
    { label: '6-Pillar Engine', ready: progress >= 25 },
    { label: 'Overleaf Studio', ready: progress >= 50 },
    { label: 'Universal Renderer', ready: progress >= 75 },
    { label: '12+ Templates', ready: progress >= 100 },
  ];

  return (
    <div className="welcome-shell min-h-screen flex flex-col overflow-hidden bg-[#f7f6f9] text-[#201a29]">
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5520a5] text-white shadow-sm">
            <FileCheck className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-semibold tracking-tight">Resume<span className="text-[#5520a5]">IQ</span></span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#716b79] sm:text-[11px]">
          <span className={`h-2 w-2 rounded-full ${bufferReady ? 'bg-emerald-500' : 'bg-violet-500 animate-pulse'}`} />
          {bufferReady ? 'Ready to begin' : 'Preparing workspace'}
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 pb-12 pt-4 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-10 lg:pb-16">
        <section className="py-8 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dfd1f0] bg-[#f0e8fa] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5520a5] sm:text-[11px]">
            <Sparkles className="h-3.5 w-3.5" />
            ATS intelligence & resume studio
          </div>

          <h1 className="mx-auto max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#201a29] sm:text-5xl lg:mx-0 xl:text-6xl">
            Welcome to <span className="gradient-text">ATS-AI.</span>
            <span className="mt-2 block text-2xl font-medium text-[#716b79] sm:text-3xl">Your next resume starts here.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#716b79] sm:text-base lg:mx-0">
            The industry’s most advanced deterministic 6-Pillar resume optimization engine, Universal Document Syntax Renderer, and 12+ FAANG career track template gallery.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 text-left sm:grid-cols-2">
            {[
              { icon: ShieldCheck, title: '6-Pillar Diagnostic', text: 'Keywords, formatting, metrics, verbs, seniority, and readability.' },
              { icon: Layout, title: 'Dual Overleaf Studio', text: 'Switch between LaTeX source and visual form editing.' },
              { icon: Cpu, title: 'Universal Renderer', text: 'Preview HTML, LaTeX, and Markdown in a clean document view.' },
              { icon: Layers, title: '12+ Career Templates', text: 'Explore tailored layouts for technology and business roles.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 border-t border-[#e7e2eb] pt-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0e8fa] text-[#5520a5]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-[#201a29]">{title}</h2>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#716b79]">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <button
              onClick={handleEnterPlatform}
              disabled={!bufferReady}
              className={`w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition-all sm:w-auto ${
                bufferReady
                  ? 'bg-[#5520a5] text-white shadow-[0_10px_28px_rgba(85,32,165,.2)] hover:bg-[#3f167b]'
                  : 'cursor-not-allowed border border-[#dfd1f0] bg-[#e9e3ee] text-[#716b79] opacity-75'
              }`}
            >
              <span className="flex items-center justify-center gap-2">Enter ATS-AI Platform <ArrowRight className="h-4 w-4" /></span>
            </button>
            <button
              onClick={handleQuickTemplates}
              disabled={!bufferReady}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfd1f0] bg-white px-5 py-3.5 text-sm font-medium text-[#5520a5] transition-colors hover:bg-[#f0e8fa] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Award className="h-4 w-4" />
              Explore 12+ Templates
            </button>
          </div>
        </section>

        <section className="welcome-loader relative mx-auto w-full max-w-2xl rounded-[1.7rem] p-4 sm:p-6 lg:p-8" aria-label="Workspace loading progress">
          <div className="relative z-10 rounded-[1.25rem] border border-white/10 bg-[#160d23]/65 p-5 shadow-[0_18px_60px_rgba(0,0,0,.28)] backdrop-blur-sm sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200/15 bg-violet-300/10 text-violet-100">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200/65">Workspace initialization</p>
                  <p className="mt-1 text-sm font-medium text-white">{bufferReady ? 'Your workspace is ready' : 'Setting up your workspace'}</p>
                </div>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-violet-100/70">{bufferReady ? 'Complete' : 'Loading'}</span>
            </div>

            <div className="flex flex-col items-center gap-7 py-8 sm:flex-row sm:py-10">
              <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-violet-300/[0.06]">
                <svg className="h-36 w-36 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.11)" strokeWidth="3" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#welcomeProgressGradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray="264" strokeDashoffset={264 - (264 * progress) / 100} className="transition-all duration-200" />
                  <defs>
                    <linearGradient id="welcomeProgressGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#c4a2ff" />
                      <stop offset="100%" stopColor="#f0b6ff" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-semibold tracking-tight text-white">{progress}<span className="text-base text-violet-100/65">%</span></p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-violet-100/50">Loading</p>
                </div>
              </div>

              <div className="w-full flex-1">
                <p className="text-sm font-medium text-white">{bufferReady ? 'Everything is ready.' : 'Preparing your tools.'}</p>
                <p className="mt-2 text-xs leading-relaxed text-violet-100/60">
                  {bufferReady ? 'Enter the platform when you’re ready.' : 'Your resume workspace is getting the finishing touches.'}
                </p>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300 transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-5">
              {stages.map(({ label, ready }) => (
                <div key={label} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] transition-colors sm:text-[11px] ${ready ? 'bg-violet-300/[0.08] text-violet-100' : 'text-violet-100/45'}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${ready ? 'text-violet-200' : 'text-white/25'}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 border-t border-[#e7e2eb] px-5 py-5 text-[10px] text-[#716b79] sm:flex-row sm:px-8 lg:px-10">
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#5520a5]" />Deterministic Parser Engine Active</span>
        <span className="font-mono tracking-wider">v3.0.0-PRO-BUILD</span>
      </footer>
    </div>
  );
}
