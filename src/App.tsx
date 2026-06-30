import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import { AuthView } from './types';

// Import Screens
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import VerifyOtpScreen from './components/VerifyOtpScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import ResetSuccessScreen from './components/ResetSuccessScreen';
import DashboardScreen from './components/dashboard/DashboardScreen';

import { LogOut, Calendar, Mail, User as UserIcon, CheckCircle2, Sparkles, Loader2, Info, X } from 'lucide-react';

const mockUserProfile = {
  uid: 'mock-nexus-dev-101',
  email: 'kashak@nexus.com',
  fullName: 'Kashak Singh',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  createdAt: Date.now(),
  emailVerified: true,
};

export default function App() {
  const {
    user: currentUser,
    userProfile: firestoreUser,
    isInitialized,
    loading: isLoadingAuth,
    toasts,
    removeToast,
    logout,
  } = useAuth();

  const [view, setView] = useState<AuthView | 'dashboard'>('splash');
  const [oobCode, setOobCode] = useState<string | null>(null);

  // States for flows
  const [tempRegisteredUser, setTempRegisteredUser] = useState<{
    uid: string;
    email: string;
    fullName: string;
  } | null>(null);
  const [resetEmail, setResetEmail] = useState<string>('');

  // Handle URL deep-links (e.g. Firebase email action codes)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const code = params.get('oobCode');

    if (mode === 'resetPassword' && code) {
      setOobCode(code);
      setView('reset-password');
      // Clean up search query params gracefully
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Sync route state with user profile verification status
  useEffect(() => {
    if (currentUser && firestoreUser) {
      if (firestoreUser.emailVerified === false && firestoreUser.otpCode) {
        setTempRegisteredUser({
          uid: currentUser.uid,
          email: currentUser.email || '',
          fullName: firestoreUser.fullName || '',
        });
        setView('verify-otp');
      } else if (view === 'splash' || view === 'onboarding' || view === 'login' || view === 'signup') {
        // Go straight to verified member area once loaded
        setView('dashboard');
      }
    }
  }, [currentUser, firestoreUser]);

  const handleSplashComplete = () => {
    setView('onboarding');
  };

  const handleOnboardingComplete = () => {
    setView('login');
  };

  const handleLoginSuccess = () => {
    setView('dashboard');
  };

  const handleSignupSuccess = () => {
    // Handled by AuthContext state sync
  };

  const handleOtpVerificationSuccess = () => {
    setTempRegisteredUser(null);
    setView('dashboard');
  };

  const handleResetSuccess = () => {
    setView('reset-success');
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setView('login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // If fully logged in and email verified, display gorgeous profile dashboard
  const isFullyAuthenticated =
    (currentUser && firestoreUser && firestoreUser.emailVerified !== false) ||
    view === 'dashboard';

  if (isFullyAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#FAF6F0] font-sans relative">
        <DashboardScreen 
          userProfile={firestoreUser || mockUserProfile} 
          onLogout={handleSignOut} 
        />

        {/* Global Floating Toast Overlay Container */}
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center justify-between p-4 rounded-xl shadow-lg border pointer-events-auto ${
                  toast.type === 'error'
                    ? 'bg-[#FDF2F2] border-red-200 text-red-700'
                    : toast.type === 'success'
                    ? 'bg-[#F2FAF5] border-[#A4B494]/30 text-emerald-800'
                    : 'bg-white border-[#624F43]/10 text-[#3E332E]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Info className="w-4.5 h-4.5 flex-shrink-0" />
                  <span className="text-xs font-sans font-bold leading-relaxed">{toast.message}</span>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors ml-2 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>


      </div>
    );
  }

  // Render helper for screens inside high fidelity viewport frame
  const renderScreen = () => {
    switch (view) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'onboarding':
        return (
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
            onBackToLogin={() => setView('login')}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onSuccess={handleLoginSuccess}
            onNavigateToSignup={() => setView('signup')}
            onNavigateToForgot={() => setView('forgot-password')}
            onNavigateToOnboarding={() => setView('onboarding')}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onSuccess={handleSignupSuccess}
            onNavigateToLogin={() => setView('login')}
          />
        );
      case 'verify-otp':
        return (
          <VerifyOtpScreen
            email={tempRegisteredUser?.email || currentUser?.email || ''}
            userId={tempRegisteredUser?.uid || currentUser?.uid || ''}
            onSuccess={handleOtpVerificationSuccess}
            onBack={() => setView('signup')}
            onClose={() => setView('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onBackToLogin={() => setView('login')}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordScreen
            email={resetEmail}
            oobCode={oobCode || undefined}
            onSuccess={handleResetSuccess}
            onBack={() => setView('forgot-password')}
          />
        );
      case 'reset-success':
        return <ResetSuccessScreen onGoToLogin={() => setView('login')} />;
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EADBC8]/40 flex flex-col items-center justify-center py-6 px-4 font-sans select-none overflow-hidden relative">
      {/* Decorative background grid/ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FFF5EC] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#EADBC8]/20 blur-[150px] pointer-events-none" />

      {/* Main frame wrapper */}
      <div className="relative w-full max-w-md bg-brand-bg rounded-[44px] shadow-2xl border-[8px] border-[#4E3E34]/15 overflow-hidden flex flex-col custom-shadow aspect-[9/18] min-h-[750px] max-h-[820px]">
        
        {/* Toast Overlay Container */}
        <div className="absolute top-16 left-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center justify-between p-3.5 rounded-xl shadow-lg border pointer-events-auto ${
                  toast.type === 'error'
                    ? 'bg-[#FDF2F2] border-red-200 text-red-700'
                    : toast.type === 'success'
                    ? 'bg-[#F2FAF5] border-brand-sage/20 text-brand-sage-dark'
                    : 'bg-[#FDFBF7] border-brand-mocha/10 text-brand-mocha-dark'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Info className="w-4.5 h-4.5 flex-shrink-0" />
                  <span className="text-xs font-medium font-sans leading-relaxed">{toast.message}</span>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors ml-2 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Device camera hole mock */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#3E332E]/25 rounded-full z-50 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3E332E]/50" />
        </div>

        {/* Device status bar spacing */}
        <div className="h-9 bg-transparent w-full" />

        <div className="flex-grow overflow-hidden relative">
          {!isInitialized ? (
            <div className="flex flex-col items-center justify-center min-h-full bg-brand-bg text-brand-mocha">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-xs font-sans tracking-widest uppercase mt-4 text-brand-mocha-dark/60 font-semibold">
                Initializing Nexus...
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>
          )}
        </div>

        {/* Device bottom bar mock */}
        <div className="h-6 bg-transparent w-full flex items-center justify-center relative">
          <div className="w-28 h-1 bg-[#3E332E]/30 rounded-full" />
        </div>
      </div>



      {/* Presentation credit footer */}
      <p className="mt-4 text-[10px] font-mono text-brand-mocha-dark/60 tracking-widest uppercase font-medium">
        NEXUS PLANNER • PREMIUM PORTRAIT PREVIEW
      </p>
    </div>
  );
}
