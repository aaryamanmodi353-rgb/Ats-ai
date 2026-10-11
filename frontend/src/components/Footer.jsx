import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#e6e9e4] bg-white mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#e6e9e4]">
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#164e3f] flex items-center justify-center text-white">
                <FileCheck className="w-4 h-4 text-[#e6f0ea]" />
              </div>
              <span className="text-lg font-black tracking-tight text-[#141c18]">
                Resume<span className="text-[#164e3f]">IQ</span><span className="text-[#164e3f]">.</span>
              </span>
            </Link>
            <p className="text-sm text-[#5c6962] max-w-sm leading-relaxed">
              Empowering candidates with pure JavaScript MERN ATS compatibility scoring, anti-fabrication AI bullet rewrites, and real-time live section editing.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#164e3f] font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Express.js API • Zero-Config Embedded MongoDB • PII Encrypted</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141c18] mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-[#5c6962]">
              <li><Link to="/resume/new" className="hover:text-[#164e3f] transition-colors">ATS Scan & Score</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#164e3f] transition-colors">Score Analytics Dashboard</Link></li>
              <li><Link to="/applications" className="hover:text-[#164e3f] transition-colors">Kanban Application Tracker</Link></li>
              <li><Link to="/settings" className="hover:text-[#164e3f] transition-colors">MERN Preferences</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#141c18] mb-4">Target Personas</h4>
            <ul className="space-y-2.5 text-sm text-[#5c6962]">
              <li className="hover:text-[#164e3f] transition-colors">Fresh Graduates & Interns</li>
              <li className="hover:text-[#164e3f] transition-colors">Career Switchers</li>
              <li className="hover:text-[#164e3f] transition-colors">High-Volume Tech Applicants</li>
              <li className="hover:text-[#164e3f] transition-colors">Recruiter Formatting Audit</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5c6962]">
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
