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
    <div className="auth-shell min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="auth-dialog relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-[#e7e2eb] bg-white md:grid-cols-[0.92fr_1.08fr]">
        <aside className="auth-art relative flex min-h-[300px] flex-col justify-between overflow-hidden p-7 text-white sm:p-10 lg:p-12">
          <div className="relative z-10">
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-violet-100 backdrop-blur-sm">
                <LogIn className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-violet-100/70">ResumeIQ workspace</span>
            </div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200/70">Your next chapter</p>
            <h1 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Welcome Back</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-violet-100/70">
              Sign in to access your saved resume snapshots, custom keywords, and Kanban application board.
            </p>
          </div>

          <div className="relative z-10 mt-10 rounded-2xl border border-white/15 bg-[#160d23]/45 p-5 backdrop-blur-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-violet-100/60">Your workspace</span>
              <Sparkles className="h-4 w-4 text-violet-200" />
            </div>
            <div className="grid gap-3 text-xs text-violet-50/85 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-violet-300" />Resume snapshots</div>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300" />Custom keywords</div>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />Application board</div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl" />
        </aside>

        <section className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <div className="mb-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5520a5]">Account access</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#201a29]">Sign in to ResumeIQ</h2>
          </div>

          <div className="mb-5">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading || submitting}
              className="w-full rounded-xl border border-[#d9c5ef] bg-[#f7f2fc] px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#5520a5] transition-all hover:border-[#c8afe7] hover:bg-[#f0e8fa] disabled:opacity-60"
            >
              {demoLoading ? (
                <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Signing in as Alex Morgan...</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><Sparkles className="h-4 w-4" />⚡ Instant One-Click Demo Login</span>
              )}
            </button>
          </div>

          <div className="relative mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#eee8f2]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a8291]">Or use your email</span>
            <div className="h-px flex-1 bg-[#eee8f2]" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#716b79]">
                <Mail className="h-3.5 w-3.5 text-[#7140ad]" /><span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#e7e2eb] bg-[#faf9fb] px-4 py-3 text-sm font-medium text-[#201a29] placeholder:text-[#9b94a1] transition-colors focus:border-[#8a4ade] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#716b79]">
                <Lock className="h-3.5 w-3.5 text-[#7140ad]" /><span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#e7e2eb] bg-[#faf9fb] px-4 py-3 text-sm font-medium text-[#201a29] placeholder:text-[#9b94a1] transition-colors focus:border-[#8a4ade] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || demoLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5520a5] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(85,32,165,.18)] transition-all hover:bg-[#3f167b] active:scale-[0.99] disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /><span>Authenticating...</span></>
              ) : (
                <><span>Sign In to Platform</span><ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-[#eee8f2] pt-5 text-center">
            <p className="text-xs text-[#716b79]">
              Don&apos;t have an account yet?{' '}
              <Link to="/signup" className="inline-flex items-center gap-1 font-semibold text-[#5520a5] hover:underline">
                Create a Free Account <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#8a8291]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#7140ad]" />
              <span>Encrypted with 256-bit JWT & bcrypt security</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
