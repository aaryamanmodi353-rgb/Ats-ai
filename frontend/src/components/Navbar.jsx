import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileCheck, Sparkles, Kanban, Settings, LayoutDashboard, Plus } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <FileCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight leading-none text-foreground">
              Resume<span className="gradient-text">IQ</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-0.5">
              MERN Intelligence
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 bg-secondary/40 border border-border/50 rounded-full p-1.5 px-3">
          <Link
            to="/dashboard"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              path === '/dashboard' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/resume/new"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              path.startsWith('/resume') ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>ATS Scan & Score</span>
          </Link>

          <Link
            to="/applications"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              path === '/applications' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-indigo-400" />
            <span>Application Tracker</span>
          </Link>

          <Link
            to="/settings"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              path === '/settings' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/resume/new"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Audit Scan</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
