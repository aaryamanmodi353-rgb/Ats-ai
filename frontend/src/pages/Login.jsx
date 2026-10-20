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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f7f6f9]">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 rounded-2xl bg-white border border-[#e7e2eb] shadow-sm relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#f0e8fa] border border-[#dfd1f0] flex items-center justify-center text-[#5520a5] mx-auto mb-4">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#201a29] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-[#716b79] leading-relaxed">
            Sign in to access your saved resume snapshots, custom keywords, and Kanban application board.
          </p>
        </div>

        {/* Instant Demo Login Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#f0e8fa] hover:bg-[#e7d9f5] border border-[#d9c5ef] text-[#5520a5] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xs"
          >
            {demoLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#5520a5]" />
                <span>Signing in as Alex Morgan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#5520a5]" />
                <span>⚡ Instant One-Click Demo Login</span>
              </>
            )}
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#f0ebf3]"></div>
          <span className="flex-shrink mx-4 text-[11px] font-semibold text-[#716b79] uppercase tracking-wider">Or Sign In with Email</span>
          <div className="flex-grow border-t border-[#f0ebf3]"></div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#716b79] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#5520a5]" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f7f9f7] border border-[#e7e2eb] text-sm text-[#201a29] placeholder:text-[#716b79] focus:outline-none focus:border-[#5520a5] transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#716b79] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#5520a5]" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#f7f9f7] border border-[#e7e2eb] text-sm text-[#201a29] placeholder:text-[#716b79] focus:outline-none focus:border-[#5520a5] transition-colors font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || demoLoading}
            className="w-full py-3.5 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
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

        <div className="pt-4 border-t border-[#f0ebf3] text-center space-y-3">
          <p className="text-xs text-[#716b79]">
            Don&apos;t have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-[#5520a5] hover:underline inline-flex items-center gap-1">
              Create a Free Account <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#716b79]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>Encrypted with 256-bit JWT & bcrypt security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
