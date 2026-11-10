import React, { useState } from 'react';
import { Activity, Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, KeyRound, Check, Dumbbell, Zap, Layers } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { PathwayTrack } from '../types/calisthenics';

interface AuthViewProps {
  onSuccess: (userData: {
    email: string;
    name?: string;
    isNewAccount: boolean;
    uid?: string;
    selectedTrack?: PathwayTrack;
  }) => void;
  onContinueDemo?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [selectedTrack, setSelectedTrack] = useState<PathwayTrack>('both');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name to personalize your biometric profile.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (fullName.trim()) {
          try {
            await updateProfile(userCredential.user, { displayName: fullName.trim() });
          } catch {
            // non-fatal
          }
        }
        setIsSubmitting(false);
        onSuccess({
          email: userCredential.user.email || email,
          name: fullName.trim() || userCredential.user.displayName || email.split('@')[0],
          isNewAccount: true,
          uid: userCredential.user.uid,
          selectedTrack,
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        setIsSubmitting(false);
        onSuccess({
          email: userCredential.user.email || email,
          name: userCredential.user.displayName || fullName || email.split('@')[0],
          isNewAccount: false,
          uid: userCredential.user.uid,
          selectedTrack,
        });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      console.warn('Firebase Auth notice:', err);
      // Clean readable error strings
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please switch to Sign In.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid credentials. Please verify your email and password.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMessage('No athlete account found with this email. Please create an account.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in popup was cancelled.');
      } else {
        // Friendly fallback for offline/preview conditions
        setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setIsGoogleLoading(false);
      onSuccess({
        email: result.user.email || 'athlete@auramorph.fit',
        name: result.user.displayName || 'AURAMORPH Athlete',
        isNewAccount: false,
        uid: result.user.uid,
        selectedTrack,
      });
    } catch (err: any) {
      setIsGoogleLoading(false);
      console.warn('Google sign-in popup notice:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google sign-in window was closed.');
      } else {
        setErrorMessage(err.message || 'Google sign-in could not be completed.');
      }
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter a valid email for password reset.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccess(false);
        setForgotEmail('');
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not send reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D0E] text-[#F8FAFC] flex flex-col justify-between selection:bg-[#A3E635] selection:text-[#0A0D0E] relative overflow-hidden">
      
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#A3E635]/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#10B981]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header / Brand Bar */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111618] border border-[#10B981]/30 flex items-center justify-center text-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.15)]">
            <Activity className="w-5 h-5 text-[#A3E635]" />
          </div>
          <div>
            <div className="font-display text-2xl font-black tracking-tight text-[#F8FAFC]">
              AURAMORPH<span className="text-[#A3E635]">.</span>
            </div>
            <div className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase">
              Transform Your Habits. Elevate Your Potential.
            </div>
          </div>
        </div>

        {/* Made by Aarav Jakhar Badging with Instagram */}
        <a
          href="https://www.instagram.com/dr.monomaniac/"
          target="_blank"
          rel="noopener noreferrer"
          title="Created by Aarav Jakhar (@dr.monomaniac)"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111618] hover:bg-[#182022] border border-[#A3E635]/40 hover:border-[#A3E635] text-xs font-mono text-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.15)] transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
          <span className="font-bold tracking-wider">MADE BY AARAV JAKHAR</span>
          <span className="hidden sm:inline text-[10px] text-[#4ADE80] opacity-80">(@dr.monomaniac)</span>
        </a>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          
          {/* Card Container */}
          <div className="bg-[#111618] border border-[#10B981]/20 rounded-2xl p-7 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            
            {/* Header Accent Line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#A3E635] to-transparent opacity-80" />

            {/* Welcome Heading as requested */}
            <div className="text-center mb-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182022] border border-[#A3E635]/30 text-xs font-mono text-[#A3E635] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                BIOMETRIC ACCESS PORTAL
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-[#F8FAFC]">
                Your Body. Your Goals. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3E635] to-[#4ADE80]">
                  Your Science.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 font-normal">
                {mode === 'login'
                  ? 'Access your telemetry stream, localized nutrition, and workouts.'
                  : 'Create an account to initiate your personalized fitness assessment.'}
              </p>
            </div>

            {/* 3-Column Athlete Track Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-mono text-[#F8FAFC] uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>WHAT IS YOUR FITNESS INTEREST?</span>
                </label>
                <span className="text-[10px] font-mono text-[#C084FC]">
                  {selectedTrack === 'fitness'
                    ? 'Fitness & Diet'
                    : selectedTrack === 'calisthenics'
                    ? 'Calisthenics Academy'
                    : 'Both Protocols'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* 1. Fitness & Nutrition */}
                <button
                  type="button"
                  onClick={() => setSelectedTrack('fitness')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[92px] ${
                    selectedTrack === 'fitness'
                      ? 'bg-[#1E112E] border-[#C084FC] shadow-[0_0_20px_rgba(192,132,252,0.35)] ring-2 ring-[#C084FC] text-[#F8FAFC]'
                      : 'bg-[#0A0D0E] border-[#10B981]/20 hover:border-[#C084FC]/40 text-[#94A3B8]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border ${
                    selectedTrack === 'fitness'
                      ? 'bg-[#2E184D] border-[#C084FC] text-[#C084FC]'
                      : 'bg-[#111618] border-[#10B981]/30 text-[#A3E635]'
                  }`}>
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] font-display font-bold text-[#F8FAFC] leading-tight mt-1.5">
                    Fitness & Diet
                  </div>
                  <div className="text-[9px] font-mono text-[#94A3B8] mt-0.5 leading-tight">
                    Gym & Macros
                  </div>
                </button>

                {/* 2. Calisthenics */}
                <button
                  type="button"
                  onClick={() => setSelectedTrack('calisthenics')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[92px] ${
                    selectedTrack === 'calisthenics'
                      ? 'bg-[#1E112E] border-[#C084FC] shadow-[0_0_20px_rgba(192,132,252,0.35)] ring-2 ring-[#C084FC] text-[#F8FAFC]'
                      : 'bg-[#0A0D0E] border-[#A855F7]/25 hover:border-[#C084FC]/40 text-[#94A3B8]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border ${
                    selectedTrack === 'calisthenics'
                      ? 'bg-[#2E184D] border-[#C084FC] text-[#C084FC]'
                      : 'bg-[#111618] border-[#A855F7]/40 text-[#C084FC]'
                  }`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] font-display font-bold text-[#F8FAFC] leading-tight mt-1.5">
                    Calisthenics
                  </div>
                  <div className="text-[9px] font-mono text-[#C084FC] mt-0.5 leading-tight">
                    Skill Academy
                  </div>
                </button>

                {/* 3. Both */}
                <button
                  type="button"
                  onClick={() => setSelectedTrack('both')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[92px] ${
                    selectedTrack === 'both'
                      ? 'bg-[#1E112E] border-[#C084FC] shadow-[0_0_20px_rgba(192,132,252,0.35)] ring-2 ring-[#C084FC] text-[#F8FAFC]'
                      : 'bg-[#0A0D0E] border-[#10B981]/20 hover:border-[#C084FC]/40 text-[#94A3B8]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border ${
                    selectedTrack === 'both'
                      ? 'bg-[#2E184D] border-[#C084FC] text-[#C084FC]'
                      : 'bg-[#111618] border-[#A3E635]/40 text-[#A3E635]'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] font-display font-bold text-[#F8FAFC] leading-tight mt-1.5">
                    Both
                  </div>
                  <div className="text-[9px] font-mono text-[#4ADE80] mt-0.5 leading-tight">
                    Full System
                  </div>
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#0A0D0E] rounded-xl border border-[#10B981]/15 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-[#182022] text-[#A3E635] border border-[#A3E635]/30 shadow-sm font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-[#182022] text-[#A3E635] border border-[#A3E635]/30 shadow-sm font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google Sign-in Option */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#182022] hover:bg-[#1f2a2d] border border-[#10B981]/25 hover:border-[#A3E635]/50 text-sm font-medium text-[#F8FAFC] transition-all transform active:scale-[0.99] mb-5 group"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-[#A3E635] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-[#10B981]/15 w-full" />
              <span className="bg-[#111618] px-3 text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                or with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Jakhar"
                      className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@auramorph.fit"
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wide">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-[#A3E635] hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#94A3B8]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0A0D0E] border-[#10B981]/30 text-[#A3E635] focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#A3E635] hover:bg-[#b2f746] text-[#0A0D0E] font-display font-bold text-sm tracking-wide transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-[#0A0D0E] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In & Launch AURAMORPH' : 'Create Account & Begin Assessment'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Trust & Security Badge */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-mono text-[#64748B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>256-Bit Encrypted · Strict Health Data Confidentiality</span>
            </div>

          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D0E]/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#111618] border border-[#10B981]/30 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-[#182022] text-[#A3E635] border border-[#A3E635]/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#F8FAFC]">Reset Credentials</h3>
                <p className="text-xs text-[#94A3B8]">We will send you a secure verification link</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#A3E635] mx-auto animate-bounce" />
                <p className="text-xs font-semibold text-[#A3E635]">Recovery link dispatched!</p>
                <p className="text-[11px] text-[#94A3B8]">Check your inbox to create your new biometric access key.</p>
              </div>
            ) : (
              <form onSubmit={handleSendResetEmail} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Your registered email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="athlete@auramorph.fit"
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-medium text-xs font-display hover:bg-[#b2f746]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Editorial Footer */}
      <footer className="px-6 py-4 border-t border-[#10B981]/15 text-center text-xs text-[#64748B] relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2">
        <p>AURAMORPH · Transform Your Habits. Elevate Your Potential. · Created by <strong className="text-[#F8FAFC]">Aarav Jakhar</strong> (<a href="https://www.instagram.com/dr.monomaniac/" target="_blank" rel="noopener noreferrer" className="text-[#A3E635] hover:underline font-mono">@dr.monomaniac</a>) · 2026 Edition</p>
      </footer>
    </div>
  );
};
