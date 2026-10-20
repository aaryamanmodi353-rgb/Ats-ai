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
    <header className="sticky top-0 z-50 w-full border-b border-[#e7e2eb] bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#5520a5] flex items-center justify-center text-white shadow-sm group-hover:bg-[#3f167b] transition-colors">
            <FileCheck className="w-5 h-5 text-[#f0e8fa]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight leading-none text-[#201a29]">
              Resume<span className="text-[#5520a5]">IQ</span><span className="text-[#5520a5]">.</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#716b79] mt-0.5">
              ATS Intelligence
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 ${
              path === '/dashboard' ? 'text-[#5520a5]' : 'text-[#716b79] hover:text-[#201a29]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/resume/new"
            className={`px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 ${
              path.startsWith('/resume') ? 'text-[#5520a5]' : 'text-[#716b79] hover:text-[#201a29]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>ATS Scan & Score</span>
          </Link>

          <Link
            to="/templates"
            className={`px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 ${
              path === '/templates' ? 'text-[#5520a5]' : 'text-[#716b79] hover:text-[#201a29]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>Famous Templates</span>
          </Link>

          <Link
            to="/applications"
            className={`px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 ${
              path === '/applications' ? 'text-[#5520a5]' : 'text-[#716b79] hover:text-[#201a29]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-[#5520a5]" />
            <span>Tracker</span>
          </Link>

          <Link
            to="/settings"
            className={`px-3 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 ${
              path === '/settings' ? 'text-[#5520a5]' : 'text-[#716b79] hover:text-[#201a29]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            to={user ? '/resume/new' : '/login'}
            className="px-4 py-2 rounded-xl bg-[#5520a5] hover:bg-[#3f167b] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Scan</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#e7e2eb]">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#f3eff7] border border-[#e6e0eb] text-xs font-semibold text-[#201a29]">
                <div className="w-5 h-5 rounded-full bg-[#5520a5] flex items-center justify-center text-[10px] text-white font-bold uppercase">
                  {user.fullName ? user.fullName.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.fullName}</span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="p-2 rounded-xl bg-[#f3eff7] hover:bg-rose-50 text-[#716b79] hover:text-rose-600 border border-[#e6e0eb] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#e7e2eb]">
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
            className="lg:hidden p-2 rounded-xl bg-[#f3eff7] hover:bg-[#f2eef6] border border-[#e6e0eb] text-[#201a29] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e7e2eb] bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
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
