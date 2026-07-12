import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewScan from './pages/NewScan.jsx';
import ScoreReport from './pages/ScoreReport.jsx';
import ResumeEditor from './pages/ResumeEditor.jsx';
import Applications from './pages/Applications.jsx';
import Settings from './pages/Settings.jsx';
import Templates from './pages/Templates.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3 bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Verifying Account & Security...</span>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function BufferCheck({ children }) {
  const passed = typeof window !== 'undefined' && sessionStorage.getItem('ats_welcome_passed') === 'true';
  if (!passed) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ResumeIQ ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div className="max-w-md space-y-2">
            <h1 className="text-2xl font-black text-foreground">Something went wrong</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We encountered a client rendering error. Make sure your Express backend (`localhost:5000`) is running and accessible.
            </p>
            <pre className="p-4 rounded-xl bg-secondary/80 border border-border text-left text-[11px] text-rose-300 overflow-x-auto font-mono mt-4">
              {this.state.error && this.state.error.toString()}
            </pre>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-lg hover:bg-primary/90 transition-all"
          >
            Reload Platform & Return Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainContent() {
  const location = useLocation();
  const isWelcome = location.pathname === '/welcome';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!isWelcome && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route
            path="/"
            element={
              <BufferCheck>
                <LandingPage />
              </BufferCheck>
            }
          />
          <Route path="/templates" element={<Templates />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/new"
            element={
              <ProtectedRoute>
                <NewScan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/:id/score/:reportId"
            element={
              <ProtectedRoute>
                <ScoreReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/:id/editor"
            element={
              <ProtectedRoute>
                <ResumeEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <ResumeEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isWelcome && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
