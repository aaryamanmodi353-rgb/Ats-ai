import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileCheck, Sparkles, Kanban, Settings, LayoutDashboard, Plus, LogIn, LogOut, User, FileText, BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e9e3ef] bg-white/90 shadow-[0_4px_22px_rgba(47,24,67,0.035)] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1520px] items-center justify-between px-4 sm:px-6 xl:px-10">
        <Link to="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7438bd] to-[#4d1d98] text-white shadow-[0_7px_16px_rgba(85,32,165,0.2)] transition-transform group-hover:-translate-y-0.5">
            <FileCheck className="h-5 w-5 text-[#f7f0ff]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[19px] font-black leading-none tracking-tight text-[#201a29]">
              Resume<span className="text-[#5520a5]">IQ</span><span className="text-[#5520a5]">.</span>
            </span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.19em] text-[#817889]">
              ATS Intelligence
            </span>
          </div>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-2xl border border-[#eee8f3] bg-[#faf9fc] p-1 xl:flex">
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              path === '/dashboard' ? 'bg-white text-[#5520a5] shadow-sm ring-1 ring-[#eee8f3]' : 'text-[#716b79] hover:bg-white/80 hover:text-[#201a29]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/resume/new"
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              path.startsWith('/resume') ? 'bg-white text-[#5520a5] shadow-sm ring-1 ring-[#eee8f3]' : 'text-[#716b79] hover:bg-white/80 hover:text-[#201a29]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>ATS Scan & Score</span>
          </Link>

          <Link
            to="/templates"
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              path === '/templates' ? 'bg-white text-[#5520a5] shadow-sm ring-1 ring-[#eee8f3]' : 'text-[#716b79] hover:bg-white/80 hover:text-[#201a29]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>Famous Templates</span>
          </Link>

          <Link
            to="/applications"
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              path === '/applications' ? 'bg-white text-[#5520a5] shadow-sm ring-1 ring-[#eee8f3]' : 'text-[#716b79] hover:bg-white/80 hover:text-[#201a29]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>Tracker</span>
          </Link>

          <Link
            to="/settings"
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              path === '/settings' ? 'bg-white text-[#5520a5] shadow-sm ring-1 ring-[#eee8f3]' : 'text-[#716b79] hover:bg-white/80 hover:text-[#201a29]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <Link
            to={user ? '/resume/new' : '/login'}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6124ad] to-[#7539bc] px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(85,32,165,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_11px_22px_rgba(85,32,165,0.25)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Scan</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 border-l border-[#e9e3ef] pl-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-[#e8e1ee] bg-[#faf8fc] px-2.5 py-1.5 text-xs font-semibold text-[#352b40]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#7438bd] to-[#4d1d98] text-[10px] font-bold uppercase text-white shadow-sm">
                  {user.fullName ? user.fullName.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.fullName}</span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="rounded-xl border border-[#e8e1ee] bg-white p-2.5 text-[#716b79] transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 border-l border-[#e9e3ef] pl-2.5">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#716b79] hover:text-[#201a29] transition-colors flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-bold text-xs transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="rounded-xl border border-[#e8e1ee] bg-[#faf8fc] p-2.5 text-[#5520a5] transition-colors hover:bg-[#f0e8fa] xl:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="space-y-1.5 border-t border-[#eee8f3] bg-white/95 px-4 py-4 shadow-[0_18px_30px_rgba(39,20,58,0.1)] backdrop-blur-xl animate-in slide-in-from-top duration-200 xl:hidden">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
              path === '/dashboard' ? 'bg-[#f0e8fa] text-[#5520a5]' : 'text-[#716b79] hover:bg-[#f3eff7] hover:text-[#201a29]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/resume/new"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
              path.startsWith('/resume') ? 'bg-[#f0e8fa] text-[#5520a5]' : 'text-[#716b79] hover:bg-[#f3eff7] hover:text-[#201a29]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#5520a5]" />
            <span>ATS Scan & Score</span>
          </Link>
          <Link
            to="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
              path === '/templates' ? 'bg-[#f0e8fa] text-[#5520a5]' : 'text-[#716b79] hover:bg-[#f3eff7] hover:text-[#201a29]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#5520a5]" />
            <span>Famous Templates</span>
          </Link>
          <Link
            to="/applications"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
              path === '/applications' ? 'bg-[#f0e8fa] text-[#5520a5]' : 'text-[#716b79] hover:bg-[#f3eff7] hover:text-[#201a29]'
            }`}
          >
            <Kanban className="w-4 h-4 text-[#5520a5]" />
            <span>Application Tracker</span>
          </Link>
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
              path === '/settings' ? 'bg-[#f0e8fa] text-[#5520a5]' : 'text-[#716b79] hover:bg-[#f3eff7] hover:text-[#201a29]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      )}
    </header>
  );
}
