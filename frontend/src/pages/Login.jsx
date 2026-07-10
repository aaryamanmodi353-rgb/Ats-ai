import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogIn, Sparkles, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    const result = await login('alex.morgan@dev-portfolio.com', 'password123');
    setDemoLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background/95 to-secondary/20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mx-auto mb-4">
            <LogIn className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sign in to access your saved resume snapshots, custom keywords, and Kanban application board.
          </p>
        </div>

        {/* Instant Demo Login Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm group"
          >
            {demoLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in as Alex Morgan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>⚡ Instant One-Click Demo Login</span>
              </>
            )}
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border/60"></div>
          <span className="flex-shrink mx-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Or Sign In with Email</span>
          <div className="flex-grow border-t border-border/60"></div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || demoLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Platform</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-border/40 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account yet?{' '}
            <Link to="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
              Create a Free Account <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted with 256-bit JWT & bcrypt security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
