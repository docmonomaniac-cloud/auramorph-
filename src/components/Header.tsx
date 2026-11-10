import React, { useState } from 'react';
import { Activity, Flame, Dumbbell, User, LogOut, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';
import { UserProfile } from '../types/user';

export type AppView = 'dashboard' | 'workout' | 'nutrition' | 'coach' | 'biometrics' | 'profile' | 'calisthenics' | 'growth';

interface HeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  streakDays: number;
  onQuickStartWorkout: () => void;
  isWorkoutActive: boolean;
  userProfile?: UserProfile;
  onSignOut?: () => void;
  onRetakeAssessment?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  streakDays,
  onQuickStartWorkout,
  isWorkoutActive,
  userProfile,
  onSignOut,
  onRetakeAssessment,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Telemetry Stream' },
    { id: 'growth', label: 'Growth Centre' },
    { id: 'calisthenics', label: 'Calisthenics' },
    { id: 'nutrition', label: 'My Diet Plan' },
    { id: 'workout', label: 'My Workout Plan' },
    { id: 'biometrics', label: 'My Progress' },
    { id: 'coach', label: 'AI Coach' },
    { id: 'profile', label: 'My Profile' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0D0E]/90 backdrop-blur-xl border-b border-[#10B981]/15 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Zone 1: Wordmark & Aarav Jakhar Signature Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={() => onSelectView('dashboard')}
            className="group flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] rounded-md"
          >
            <div className="w-8 h-8 rounded-lg bg-[#111618] border border-[#10B981]/30 flex items-center justify-center text-[#A3E635] group-hover:border-[#A3E635] transition-colors">
              <Activity className="w-4 h-4 text-[#A3E635]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-[#F8FAFC] whitespace-nowrap leading-none">
                AURAMORPH<span className="text-[#A3E635]">.</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono tracking-wider text-[#94A3B8] uppercase mt-0.5">
                Transform Your Habits · Elevate Your Potential
              </span>
            </div>
          </button>

          {/* Signature Made by Aarav Jakhar Badging with Instagram */}
          <a
            href="https://www.instagram.com/dr.monomaniac/"
            target="_blank"
            rel="noopener noreferrer"
            title="Created by Aarav Jakhar (@dr.monomaniac)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#182022] hover:bg-[#1c272a] border border-[#A3E635]/40 hover:border-[#A3E635] text-[11px] sm:text-xs font-mono text-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.18)] transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
            <span className="font-bold tracking-wider">MADE BY AARAV JAKHAR</span>
            <span className="hidden md:inline text-[10px] text-[#4ADE80] opacity-80">(@dr.monomaniac)</span>
          </a>
          
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#182022] border border-[#10B981]/20 text-xs font-mono text-[#4ADE80]">
            <Flame className="w-3.5 h-3.5 fill-[#4ADE80] text-[#4ADE80]" />
            <span className="font-semibold">{streakDays}D STREAK</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (All requested sections included) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const isPurpleSection = item.id === 'calisthenics' || item.id === 'growth';
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`relative px-3 py-1.5 text-xs xl:text-sm font-medium tracking-tight rounded-md transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? isPurpleSection
                      ? 'text-[#C084FC] bg-[#1E112E] border border-[#A855F7]/40 shadow-[0_0_15px_-3px_rgba(192,132,252,0.3)] font-semibold'
                      : 'text-[#A3E635] bg-[#182022] border border-[#10B981]/30 shadow-[0_0_15px_-3px_rgba(163,230,53,0.15)] font-semibold'
                    : isPurpleSection
                    ? 'text-[#C084FC]/80 hover:text-[#E879F9] hover:bg-[#1A1028]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111618]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full ${
                      isPurpleSection ? 'bg-[#C084FC]' : 'bg-[#A3E635]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & User Profile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick Workout Button */}
          <button
            onClick={onQuickStartWorkout}
            className={`group relative hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all transform active:scale-95 whitespace-nowrap shrink-0 ${
              isWorkoutActive
                ? 'bg-[#182022] border border-[#A3E635] text-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.2)]'
                : 'bg-[#A3E635] text-[#0A0D0E] hover:bg-[#b2f746]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
            <span>{isWorkoutActive ? 'Resume Workout' : 'Start Push Day'}</span>
          </button>

          {/* User Account / Avatar Dropdown */}
          {userProfile && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#111618] border border-[#10B981]/25 hover:border-[#A3E635]/60 text-xs transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#182022] border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] font-display font-bold text-xs">
                  {userProfile.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[#F8FAFC] leading-none truncate max-w-[90px]">
                    {userProfile.fullName.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-mono text-[#A3E635] leading-tight">
                    {userProfile.city || userProfile.state || 'India'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111618] border border-[#10B981]/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[#10B981]/15 mb-1">
                    <div className="text-xs font-bold text-[#F8FAFC]">{userProfile.fullName}</div>
                    <div className="text-[10px] font-mono text-[#94A3B8] truncate">{userProfile.email}</div>
                    <div className="text-[10px] font-mono text-[#4ADE80] mt-0.5">
                      {userProfile.dietaryPreference} · {userProfile.currentWeightKg}kg · {userProfile.city || userProfile.state || 'All-India'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSelectView('growth');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#C084FC] hover:bg-[#1E112E] hover:text-[#E879F9] transition-all text-left font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                    <span>Height &amp; Growth Centre</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSelectView('calisthenics');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#C084FC] hover:bg-[#1E112E] hover:text-[#E879F9] transition-all text-left font-semibold"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#C084FC]" />
                    <span>Calisthenics Academy</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSelectView('profile');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#F8FAFC] hover:bg-[#182022] hover:text-[#A3E635] transition-all text-left"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>View Full Profile</span>
                  </button>

                  {onRetakeAssessment && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onRetakeAssessment();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#F8FAFC] hover:bg-[#182022] hover:text-[#A3E635] transition-all text-left"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-take Assessment</span>
                    </button>
                  )}

                  {onSignOut && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-300 hover:bg-red-950/40 transition-all text-left border-t border-[#10B981]/15 mt-1 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto gap-1 pt-2.5 pb-1 border-t border-[#10B981]/10 mt-2 scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const isPurpleSection = item.id === 'calisthenics' || item.id === 'growth';
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? isPurpleSection
                    ? 'bg-[#1E112E] text-[#C084FC] border border-[#A855F7]/40 font-semibold shadow-sm'
                    : 'bg-[#182022] text-[#A3E635] border border-[#10B981]/30 font-semibold'
                  : isPurpleSection
                  ? 'text-[#C084FC]/80 hover:text-[#E879F9]'
                  : 'text-[#94A3B8]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
