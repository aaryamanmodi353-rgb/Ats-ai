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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background/95 to-secondary/20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 mx-auto mb-4">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Create Free Account
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get instant access to our 6-Pillar Deterministic ATS Audit engine, AI Bullet Coach, and single-column document exporters.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Password (6+ characters)</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-medium"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-secondary/60 border border-border/60 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Included on your Free Tier Account:</span>
            </div>
            <p className="pl-6 text-[11px] leading-relaxed">
              Unlimited 6-pillar compatibility checks, TF-IDF keyword extraction, and clean DOCX / TXT exports.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
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

        <div className="pt-4 border-t border-border/40 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            Already have a ResumeIQ account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
              Sign In Here <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit JWT & bcrypt encrypted security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
