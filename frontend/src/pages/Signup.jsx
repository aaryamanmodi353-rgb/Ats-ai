import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    setSubmitting(true);
    const result = await signup(fullName, email, password);
    setSubmitting(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f7f8f6]">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-2xl bg-white border border-[#e6e9e4] shadow-sm relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#e6f0ea] border border-[#d2e2d8] flex items-center justify-center text-[#164e3f] mx-auto mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141c18] tracking-tight">
            Create Free Account
          </h2>
          <p className="text-sm text-[#5c6962] leading-relaxed">
            Get instant access to our 6-Pillar Deterministic ATS Audit engine, AI Bullet Coach, and single-column document exporters.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c6962] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#164e3f]" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f7f9f7] border border-[#e6e9e4] text-sm text-[#141c18] placeholder:text-[#5c6962] focus:outline-none focus:border-[#164e3f] transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c6962] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#164e3f]" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f7f9f7] border border-[#e6e9e4] text-sm text-[#141c18] placeholder:text-[#5c6962] focus:outline-none focus:border-[#164e3f] transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c6962] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#164e3f]" />
                <span>Password (6+ characters)</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f7f9f7] border border-[#e6e9e4] text-sm text-[#141c18] placeholder:text-[#5c6962] focus:outline-none focus:border-[#164e3f] transition-colors font-medium"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f4f8f5] border border-[#d2e2d8] text-xs text-[#5c6962] space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[#141c18]">
              <CheckCircle2 className="w-4 h-4 text-[#164e3f] shrink-0" />
              <span>Included on your Free Tier Account:</span>
            </div>
            <p className="pl-6 text-[11px] leading-relaxed">
              Unlimited 6-pillar compatibility checks, TF-IDF keyword extraction, and clean DOCX / TXT exports.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#164e3f] hover:bg-[#124235] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Get Started Instantly</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#eef1ed] text-center space-y-3">
          <p className="text-xs text-[#5c6962]">
            Already have a ResumeIQ account?{' '}
            <Link to="/login" className="font-semibold text-[#164e3f] hover:underline inline-flex items-center gap-1">
              Sign In Here <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5c6962]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#164e3f]" />
            <span>256-bit JWT & bcrypt encrypted security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
