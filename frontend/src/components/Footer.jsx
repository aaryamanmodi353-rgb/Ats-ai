import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border/40">
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight">
                Resume<span className="gradient-text">IQ</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Empowering candidates with pure JavaScript MERN ATS compatibility scoring, anti-fabrication AI bullet rewrites, and real-time live section editing.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Express.js API • Zero-Config Embedded MongoDB • PII Encrypted</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/resume/new" className="hover:text-foreground transition-colors">ATS Scan & Score</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Score Analytics Dashboard</Link></li>
              <li><Link to="/applications" className="hover:text-foreground transition-colors">Kanban Application Tracker</Link></li>
              <li><Link to="/settings" className="hover:text-foreground transition-colors">MERN Preferences</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Target Personas</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors">Fresh Graduates & Interns</li>
              <li className="hover:text-foreground transition-colors">Career Switchers</li>
              <li className="hover:text-foreground transition-colors">High-Volume Tech Applicants</li>
              <li className="hover:text-foreground transition-colors">Recruiter Formatting Audit</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ResumeIQ Platform. Built on MERN Stack (MongoDB, Express, React, Node.js).</p>
          <div className="flex items-center gap-6">
            <span>Deterministic Scoring Engine v1.0</span>
            <span>•</span>
            <span className="flex items-center gap-1">Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for job seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
