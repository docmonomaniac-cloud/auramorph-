import React, { useState, useMemo } from 'react';
import {
  CALISTHENICS_SKILLS,
  CALISTHENICS_ROUTINES,
} from '../data/calisthenicsData';
import {
  CalisthenicsExercise,
  CalisthenicsRoutine,
  SkillTier,
  SkillCategory,
} from '../types/calisthenics';
import {
  Zap,
  Play,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Search,
  Flame,
  Award,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Dumbbell,
  Clock,
  RotateCcw,
  Layers,
  Activity,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CalisthenicsAcademyViewProps {
  masteredSkillIds: string[];
  onToggleMastery: (skillId: string) => void;
  onOpenRestTimer?: (seconds: number) => void;
  athleteName?: string;
}

export const CalisthenicsAcademyView: React.FC<CalisthenicsAcademyViewProps> = ({
  masteredSkillIds,
  onToggleMastery,
  onOpenRestTimer,
  athleteName = 'Athlete',
}) => {
  // Navigation / View state
  const [activeTab, setActiveTab] = useState<'skills' | 'routines'>('skills');

  // Filters state
  const [selectedTier, setSelectedTier] = useState<SkillTier | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMastery, setFilterMastery] = useState<'all' | 'mastered' | 'unmastered'>('all');

  // Active expanded exercise drawer (one at a time or toggleable)
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>('skill-push-ups');

  // Selected routine modal/card view
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(CALISTHENICS_ROUTINES[0].id);

  // Compute stats
  const totalSkills = CALISTHENICS_SKILLS.length;
  const masteredCount = masteredSkillIds.length;
  const masteryPercentage = Math.round((masteredCount / totalSkills) * 100);

  const beginnerTotal = CALISTHENICS_SKILLS.filter((s) => s.tier === 'beginner').length;
  const beginnerMastered = CALISTHENICS_SKILLS.filter(
    (s) => s.tier === 'beginner' && masteredSkillIds.includes(s.id)
  ).length;

  const intermediateTotal = CALISTHENICS_SKILLS.filter((s) => s.tier === 'intermediate').length;
  const intermediateMastered = CALISTHENICS_SKILLS.filter(
    (s) => s.tier === 'intermediate' && masteredSkillIds.includes(s.id)
  ).length;

  const advancedTotal = CALISTHENICS_SKILLS.filter((s) => s.tier === 'advanced').length;
  const advancedMastered = CALISTHENICS_SKILLS.filter(
    (s) => s.tier === 'advanced' && masteredSkillIds.includes(s.id)
  ).length;

  // Rank determination
  const athleteRank = useMemo(() => {
    if (masteredCount >= 19) return { title: 'ELITE AURAMORPH', color: 'text-[#E879F9]', bg: 'bg-[#581c87]/40 border-[#C084FC]' };
    if (masteredCount >= 12) return { title: 'KINETIC MASTER', color: 'text-[#C084FC]', bg: 'bg-[#3b0764]/40 border-[#A855F7]' };
    if (masteredCount >= 5) return { title: 'ADEPT ATHLETE', color: 'text-[#A855F7]', bg: 'bg-[#2e1065]/40 border-[#9333ea]' };
    return { title: 'KINETIC INITIATE', color: 'text-[#A3E635]', bg: 'bg-[#182022] border-[#10B981]/40' };
  }, [masteredCount]);

  // Filter skills list
  const filteredSkills = useMemo(() => {
    return CALISTHENICS_SKILLS.filter((skill) => {
      if (selectedTier !== 'all' && skill.tier !== selectedTier) return false;
      if (selectedCategory !== 'all' && skill.category !== selectedCategory) return false;

      const isMastered = masteredSkillIds.includes(skill.id);
      if (filterMastery === 'mastered' && !isMastered) return false;
      if (filterMastery === 'unmastered' && isMastered) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = skill.name.toLowerCase().includes(q);
        const matchesCategory = skill.category.toLowerCase().includes(q);
        const matchesMuscle = skill.musclesTargeted.some((m) => m.toLowerCase().includes(q));
        const matchesDesc = skill.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesMuscle && !matchesDesc) return false;
      }
      return true;
    });
  }, [selectedTier, selectedCategory, filterMastery, searchQuery, masteredSkillIds]);

  const handleToggle = (skillId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyMastered = masteredSkillIds.includes(skillId);
    if (!isCurrentlyMastered) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C084FC', '#A855F7', '#E879F9', '#FFFFFF', '#A3E635'],
      });
    }
    onToggleMastery(skillId);
  };

  const handleToggleExpand = (skillId: string) => {
    setExpandedSkillId((prev) => (prev === skillId ? null : skillId));
  };

  // Helper to test if prerequisites are met
  const arePrerequisitesMet = (skill: CalisthenicsExercise): boolean => {
    if (skill.prerequisites.length === 0) return true;
    return skill.prerequisites.every((prereqId) => masteredSkillIds.includes(prereqId));
  };

  const selectedRoutine = CALISTHENICS_ROUTINES.find((r) => r.id === selectedRoutineId) || CALISTHENICS_ROUTINES[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 selection:bg-[#C084FC] selection:text-[#0A0D0E]">
      
      {/* ============================================================ */}
      {/* 1. HERO & BRANDING SECTION - Bioluminescent Neon Purple */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#120D1D] via-[#0E0F14] to-[#0A0D0E] border border-[#A855F7]/30 p-6 sm:p-8 lg:p-10 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        
        {/* Ambient bioluminescent glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#A855F7]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#C084FC]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26143B] border border-[#C084FC]/50 text-xs font-mono text-[#C084FC] shadow-[0_0_15px_rgba(192,132,252,0.25)]">
                <Zap className="w-3.5 h-3.5 text-[#C084FC] animate-pulse" />
                NEURO-KINETIC BODYWEIGHT SYSTEM
              </span>

              {/* Aarav Jakhar Creator Signature Link */}
              <a
                href="https://www.instagram.com/dr.monomaniac/"
                target="_blank"
                rel="noopener noreferrer"
                title="Created by Aarav Jakhar (@dr.monomaniac)"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1226] hover:bg-[#2A1B3D] border border-[#A855F7]/60 hover:border-[#C084FC] text-xs font-mono text-[#C084FC] transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-ping" />
                <span className="font-bold">MADE BY AARAV JAKHAR</span>
                <span className="text-[10px] text-[#E879F9]">(@dr.monomaniac)</span>
              </a>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-[#F8FAFC]">
              CALISTHENICS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#A855F7]">
                ACADEMY & SKILL MATRIX
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Master the physical laws of relative strength. Progress from fundamental push and pull foundations
              to elite levers, freestanding handstands, planches, and dynamic bar transitions.
            </p>
          </div>

          {/* Mastered Progress Dial / Rank Card */}
          <div className="shrink-0 bg-[#170E28]/90 border border-[#A855F7]/40 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center min-w-[260px]">
            <div className={`px-3 py-1 rounded-full border text-[11px] font-mono tracking-wider font-bold mb-3 ${athleteRank.bg} ${athleteRank.color}`}>
              {athleteRank.title}
            </div>

            <div className="relative flex items-center justify-center my-1">
              <div className="text-4xl sm:text-5xl font-display font-black text-[#F8FAFC]">
                {masteredCount}
                <span className="text-lg font-mono text-[#94A3B8] font-normal"> / {totalSkills}</span>
              </div>
            </div>

            <div className="text-xs font-mono text-[#C084FC] font-semibold mt-1">
              {masteryPercentage}% SKILLS MASTERED
            </div>

            {/* Overall progress bar */}
            <div className="w-full bg-[#0A0D0E] h-2.5 rounded-full mt-3 overflow-hidden border border-[#A855F7]/30">
              <div
                className="h-full bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#E879F9] transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(4, masteryPercentage)}%` }}
              />
            </div>

            {/* Tier Breakdown Mini-pills */}
            <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-[#A855F7]/20 text-[11px] font-mono text-[#94A3B8]">
              <div className="text-center">
                <div className="text-emerald-400 font-bold">{beginnerMastered}/{beginnerTotal}</div>
                <div className="text-[9px] uppercase tracking-wider">Beginner</div>
              </div>
              <div className="text-center">
                <div className="text-[#C084FC] font-bold">{intermediateMastered}/{intermediateTotal}</div>
                <div className="text-[9px] uppercase tracking-wider">Interm.</div>
              </div>
              <div className="text-center">
                <div className="text-[#E879F9] font-bold">{advancedMastered}/{advancedTotal}</div>
                <div className="text-[9px] uppercase tracking-wider">Advanced</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs: Skills Library vs Daily Practice Plans */}
        <div className="mt-8 pt-6 border-t border-[#A855F7]/20 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-xl bg-[#0A0D0E]/80 border border-[#A855F7]/30">
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-display font-bold transition-all ${
                activeTab === 'skills'
                  ? 'bg-[#A855F7] text-[#0A0D0E] shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Skill Progression Matrix ({totalSkills})</span>
            </button>
            <button
              onClick={() => setActiveTab('routines')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-display font-bold transition-all ${
                activeTab === 'routines'
                  ? 'bg-[#A855F7] text-[#0A0D0E] shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Daily Practice Plans ({CALISTHENICS_ROUTINES.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#94A3B8]">
            <span className="hidden sm:inline">Active Athlete:</span>
            <span className="text-[#F8FAFC] font-bold px-2 py-0.5 rounded bg-[#1C142B] border border-[#A855F7]/30">
              {athleteName}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SKILL PROGRESSION MATRIX VIEW */}
      {/* ============================================================ */}
      {activeTab === 'skills' && (
        <section className="space-y-6">
          
          {/* Filter, Search & Status Controls */}
          <div className="bg-[#111618] border border-[#A855F7]/20 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills (e.g. Muscle-up, Front lever, Handstand, Lats)..."
                  className="w-full bg-[#0A0D0E] border border-[#A855F7]/30 focus:border-[#C084FC] focus:ring-1 focus:ring-[#C084FC] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] outline-none transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setFilterMastery('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    filterMastery === 'all'
                      ? 'bg-[#2E184D] text-[#C084FC] border border-[#A855F7]/50 font-bold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0D0E]'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setFilterMastery('mastered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                    filterMastery === 'mastered'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/50 font-bold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0D0E]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mastered ({masteredCount})</span>
                </button>
                <button
                  onClick={() => setFilterMastery('unmastered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                    filterMastery === 'unmastered'
                      ? 'bg-[#2E184D] text-[#C084FC] border border-[#A855F7]/50 font-bold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0D0E]'
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>Needs Practice ({totalSkills - masteredCount})</span>
                </button>
              </div>
            </div>

            {/* Level & Category Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#A855F7]/15">
              
              {/* Level Tiers */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[11px] font-mono text-[#94A3B8] mr-1 uppercase">Tier:</span>
                {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all whitespace-nowrap ${
                      selectedTier === tier
                        ? 'bg-[#A855F7] text-[#0A0D0E] font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-[#181224] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {tier === 'all' ? 'All Tiers' : tier}
                  </button>
                ))}
              </div>

              {/* Movement Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[11px] font-mono text-[#94A3B8] mr-1 uppercase">Movement:</span>
                {(['all', 'push', 'pull', 'core', 'legs', 'statics', 'dynamics'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#C084FC] text-[#0A0D0E] font-bold shadow-[0_0_12px_rgba(192,132,252,0.3)]'
                        : 'bg-[#181224] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {cat === 'all' ? 'All Movements' : cat}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Result Count Banner */}
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
            <span>Showing {filteredSkills.length} of {totalSkills} calisthenics skills</span>
            {(selectedTier !== 'all' || selectedCategory !== 'all' || searchQuery || filterMastery !== 'all') && (
              <button
                onClick={() => {
                  setSelectedTier('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setFilterMastery('all');
                }}
                className="text-[#C084FC] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          {/* Skill Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map((skill) => {
              const isMastered = masteredSkillIds.includes(skill.id);
              const isExpanded = expandedSkillId === skill.id;
              const prereqsMet = arePrerequisitesMet(skill);

              // Tier color accent
              const tierBadgeClass =
                skill.tier === 'beginner'
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                  : skill.tier === 'intermediate'
                  ? 'bg-[#3b0764]/70 text-[#C084FC] border-[#A855F7]/50'
                  : 'bg-fuchsia-950/70 text-[#E879F9] border-fuchsia-500/50';

              return (
                <div
                  key={skill.id}
                  className={`group relative rounded-2xl bg-[#111618] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
                    isMastered
                      ? 'border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.12)]'
                      : isExpanded
                      ? 'border-[#C084FC] shadow-[0_0_30px_rgba(192,132,252,0.2)]'
                      : 'border-[#A855F7]/25 hover:border-[#A855F7]/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  } ${isExpanded ? 'md:col-span-2 lg:col-span-3' : ''}`}
                >
                  {/* Mastered corner ribbon */}
                  {isMastered && (
                    <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-300 border-b border-l border-emerald-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>MASTERED</span>
                    </div>
                  )}

                  {/* Card Content Top */}
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 pr-16">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold border ${tierBadgeClass}`}>
                          {skill.tier}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#181224] text-[#C084FC] text-[10px] font-mono uppercase tracking-wider border border-[#A855F7]/30">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    {/* Skill Title & Target */}
                    <div>
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#F8FAFC] group-hover:text-[#C084FC] transition-colors flex items-center gap-2">
                        <span>{skill.name}</span>
                        {!prereqsMet && !isMastered && (
                          <span
                            title="Prerequisites not yet mastered (flexible access allowed)"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#2D1630] border border-[#E879F9]/40 text-[10px] font-mono text-[#E879F9]"
                          >
                            <Lock className="w-3 h-3 text-[#E879F9]" />
                            <span>Adv.</span>
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>

                    {/* Target Metric Pill */}
                    <div className="p-2.5 rounded-xl bg-[#0A0D0E] border border-[#A855F7]/20 flex items-center justify-between text-xs">
                      <span className="font-mono text-[#94A3B8] text-[11px] uppercase tracking-wider">Benchmark:</span>
                      <span className="font-display font-bold text-[#C084FC]">
                        {skill.holdTarget || skill.repsTarget}
                      </span>
                    </div>

                    {/* Targeted Muscle Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {skill.musclesTargeted.slice(0, 3).map((m) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1C142B] text-[#D8B4FE] border border-[#A855F7]/20"
                        >
                          {m}
                        </span>
                      ))}
                      {skill.musclesTargeted.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1C142B] text-[#94A3B8]">
                          +{skill.musclesTargeted.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Prerequisite status bar if not met */}
                    {!prereqsMet && !isMastered && skill.prerequisites.length > 0 && (
                      <div className="p-2 rounded-lg bg-[#24122D]/60 border border-[#E879F9]/30 text-[11px] font-mono text-[#F472B6] flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#F472B6]" />
                        <span className="truncate">
                          Prerequisites: {skill.prerequisites.map((p) => p.replace('skill-', '').replace('-', ' ')).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className="p-4 sm:p-5 bg-[#0D0A14] border-t border-[#A855F7]/20 flex items-center justify-between gap-3">
                    
                    {/* Toggle Mastery Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggle(skill.id, e)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-display font-bold transition-all ${
                        isMastered
                          ? 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/50'
                          : 'bg-[#1F1433] hover:bg-[#2A1A45] text-[#C084FC] border border-[#A855F7]/40 hover:border-[#C084FC]'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-400' : 'text-[#A855F7]'}`} />
                      <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>

                    {/* Expand Inline Video & Form Guide Button (Q2 inline drawer implementation) */}
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(skill.id)}
                      className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-display font-semibold transition-all ${
                        isExpanded
                          ? 'bg-[#C084FC] text-[#0A0D0E] shadow-[0_0_15px_rgba(192,132,252,0.4)]'
                          : 'bg-[#170E24] text-[#F8FAFC] hover:bg-[#24153A] border border-[#A855F7]/30'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">{isExpanded ? 'Hide Guide' : 'Tutorial & Cues'}</span>
                      <span className="sm:hidden">{isExpanded ? 'Hide' : 'Video'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* ============================================================ */}
                  {/* 3. EXPANDABLE INLINE DRAWER (User Interview Decision Q2) */}
                  {/* ============================================================ */}
                  {isExpanded && (
                    <div className="border-t border-[#C084FC]/40 bg-[#0E0B17] p-5 sm:p-7 space-y-6 animate-in fade-in duration-300">
                      
                      <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Video Player Column */}
                        <div className="lg:w-1/2 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#C084FC] animate-ping" />
                              <span className="font-mono text-xs text-[#C084FC] uppercase tracking-wider font-bold">
                                Form Masterclass: {skill.videoTitle}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-[#94A3B8]">
                              By {skill.videoChannel}
                            </span>
                          </div>

                          {/* 16:9 Responsive Embed */}
                          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0A0D0E] border border-[#A855F7]/40 shadow-2xl">
                            {skill.youtubeVideoId ? (
                              <iframe
                                src={`https://www.youtube-nocookie.com/embed/${skill.youtubeVideoId}?rel=0&modestbranding=1`}
                                title={`${skill.name} Tutorial`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#94A3B8] space-y-2">
                                <Play className="w-10 h-10 text-[#C084FC] opacity-60" />
                                <p className="text-xs font-mono">Tutorial coming soon for {skill.name}</p>
                              </div>
                            )}
                          </div>

                          {/* Alternative Video Link in case iframe is blocked in strict environments */}
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] px-1">
                            <span>Video playback issue?</span>
                            <a
                              href={`https://www.youtube.com/watch?v=${skill.youtubeVideoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#C084FC] hover:underline inline-flex items-center gap-1"
                            >
                              <span>Watch on YouTube</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Step-by-Step & Form Cues Column */}
                        <div className="lg:w-1/2 space-y-5">
                          
                          {/* Step-by-Step Instructions */}
                          <div>
                            <h4 className="font-display font-bold text-sm text-[#F8FAFC] flex items-center gap-2 mb-2.5">
                              <Sparkles className="w-4 h-4 text-[#C084FC]" />
                              <span>Step-by-Step Movement Breakdown</span>
                            </h4>
                            <ol className="space-y-2">
                              {skill.stepByStepInstructions.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#CBD5E1] leading-relaxed">
                                  <span className="w-5 h-5 rounded-full bg-[#26153E] border border-[#A855F7]/40 flex items-center justify-center text-[11px] font-mono font-bold text-[#C084FC] shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Precision Form Cues */}
                          <div className="p-3.5 rounded-xl bg-[#140D21] border border-[#A855F7]/30">
                            <h5 className="font-mono text-xs font-bold text-[#C084FC] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" />
                              <span>Precision Form Cues</span>
                            </h5>
                            <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                              {skill.formCues.map((cue, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-[#C084FC] font-bold">›</span>
                                  <span>{cue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>

                      </div>

                      {/* Common Mistakes & Safety Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#A855F7]/20">
                        
                        {/* Common Mistakes */}
                        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                          <h5 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            <span>Common Mistakes to Avoid</span>
                          </h5>
                          <ul className="space-y-1 text-xs text-[#E2E8F0]">
                            {skill.commonMistakes.map((mistake, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-red-400 font-bold">✕</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Safety & Joint Precautions */}
                        <div className="p-4 rounded-xl bg-[#1A1229] border border-[#A855F7]/30 space-y-2">
                          <h5 className="text-xs font-mono font-bold text-[#C084FC] uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#C084FC]" />
                            <span>Joint Safety & Protection</span>
                          </h5>
                          <ul className="space-y-1 text-xs text-[#E2E8F0]">
                            {skill.safetyPrecautions.map((safe, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-[#C084FC] font-bold">✓</span>
                                <span>{safe}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                      {/* Regressions and Next Progressions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#A855F7]/20 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#94A3B8] shrink-0">Easier Regression:</span>
                          <span className="text-[#F8FAFC] truncate">
                            {skill.easierAlternatives.join(' · ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#94A3B8] shrink-0">Next Progression:</span>
                          <span className="text-[#C084FC] font-semibold truncate">
                            {skill.harderVariations.join(' · ')}
                          </span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* ============================================================ */}
      {/* 4. DAILY PRACTICE PLANS & STRUCTURED ROUTINES VIEW */}
      {/* ============================================================ */}
      {activeTab === 'routines' && (
        <section className="space-y-6">
          
          <div className="bg-[#111618] border border-[#A855F7]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono text-[#C084FC] uppercase tracking-wider">
                  PERIODIZED BODYWEIGHT TRAINING
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F8FAFC]">
                  Daily Practice Protocols
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  Choose a dedicated session tailored to your current physical focus.
                </p>
              </div>

              {/* Rest Stopwatch Trigger */}
              {onOpenRestTimer && (
                <button
                  type="button"
                  onClick={() => onOpenRestTimer(90)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#211438] hover:bg-[#2F1D50] border border-[#A855F7]/40 text-xs font-display font-bold text-[#C084FC] transition-all shadow-md"
                >
                  <Clock className="w-4 h-4 text-[#C084FC]" />
                  <span>Launch 90s Rest Timer</span>
                </button>
              )}
            </div>

            {/* Routine selector buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CALISTHENICS_ROUTINES.map((routine) => {
                const isSelected = selectedRoutineId === routine.id;
                return (
                  <button
                    key={routine.id}
                    onClick={() => setSelectedRoutineId(routine.id)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#291745] border-[#C084FC] shadow-[0_0_20px_rgba(192,132,252,0.25)]'
                        : 'bg-[#0A0D0E] border-[#A855F7]/20 hover:border-[#A855F7]/50 text-[#94A3B8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                        routine.tier === 'beginner'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                          : routine.tier === 'intermediate'
                          ? 'bg-[#3b0764]/70 text-[#C084FC] border-[#A855F7]/50'
                          : 'bg-fuchsia-950/70 text-[#E879F9] border-fuchsia-500/50'
                      }`}>
                        {routine.tier}
                      </span>
                      <span className="text-[11px] font-mono text-[#94A3B8]">
                        {routine.durationMinutes} min
                      </span>
                    </div>
                    <div className="font-display font-bold text-sm text-[#F8FAFC] leading-snug">
                      {routine.title}
                    </div>
                    <div className="text-[11px] text-[#94A3B8] mt-1 line-clamp-1">
                      {routine.exercises.length} exercises
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Active Routine Card */}
          <div className="bg-[#111618] border border-[#C084FC]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Routine Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#A855F7]/20">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C084FC] animate-ping" />
                  <span className="text-xs font-mono text-[#C084FC] uppercase tracking-wider font-bold">
                    Active Protocol Details
                  </span>
                </div>
                <h3 className="text-2xl font-display font-black text-[#F8FAFC]">
                  {selectedRoutine.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
                  {selectedRoutine.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#CBD5E1] bg-[#0A0D0E] p-3 rounded-xl border border-[#A855F7]/30 shrink-0">
                <div>
                  <div className="text-[#94A3B8] text-[10px] uppercase">Duration</div>
                  <div className="font-bold text-[#F8FAFC]">{selectedRoutine.durationMinutes} Mins</div>
                </div>
                <div className="h-6 w-[1px] bg-[#A855F7]/30" />
                <div>
                  <div className="text-[#94A3B8] text-[10px] uppercase">Exercises</div>
                  <div className="font-bold text-[#F8FAFC]">{selectedRoutine.exercises.length} Drills</div>
                </div>
              </div>
            </div>

            {/* Routine Exercises Table */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#C084FC]" />
                <span>Exercise Sequencing & Rest Intervals</span>
              </h4>

              <div className="space-y-2.5">
                {selectedRoutine.exercises.map((ex, index) => {
                  const matchingSkill = CALISTHENICS_SKILLS.find((s) => s.id === ex.skillId);
                  const isMastered = masteredSkillIds.includes(ex.skillId);

                  return (
                    <div
                      key={ex.skillId + index}
                      className="p-4 rounded-xl bg-[#0A0D0E] border border-[#A855F7]/20 hover:border-[#A855F7]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#1B112B] border border-[#A855F7]/40 flex items-center justify-center font-mono font-bold text-xs text-[#C084FC] shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-display font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
                            <span>{ex.skillName}</span>
                            {isMastered && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          {ex.notes && (
                            <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">
                              Focus: {ex.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono self-end md:self-center">
                        <div className="px-3 py-1 rounded bg-[#170E24] border border-[#A855F7]/30 text-[#F8FAFC]">
                          <span className="text-[#94A3B8]">Target: </span>
                          <strong className="text-[#C084FC]">{ex.sets} sets × {ex.repsOrHold}</strong>
                        </div>
                        <div className="px-2.5 py-1 rounded bg-[#170E24] border border-[#A855F7]/30 text-[#94A3B8]">
                          Rest: <strong className="text-[#F8FAFC]">{ex.restSeconds}s</strong>
                        </div>
                        {matchingSkill && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('skills');
                              setSelectedTier('all');
                              setSelectedCategory('all');
                              setSearchQuery(matchingSkill.name);
                              setExpandedSkillId(matchingSkill.id);
                            }}
                            className="p-1.5 rounded-lg bg-[#24133A] hover:bg-[#341B54] text-[#C084FC] border border-[#A855F7]/40 transition-all"
                            title="Open Video & Form Guide"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Routine Footer Action */}
            <div className="pt-4 border-t border-[#A855F7]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#94A3B8] font-mono">
                Perform warmup before straight-arm isometric holds. Respect scheduled rest between sets.
              </div>
              <button
                type="button"
                onClick={() => {
                  confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#C084FC', '#A855F7', '#E879F9'],
                  });
                  if (onOpenRestTimer) onOpenRestTimer(90);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] hover:from-[#9333ea] hover:to-[#a855f7] text-[#0A0D0E] font-display font-bold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
              >
                <span>Complete Practice Routine</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>

          </div>

        </section>
      )}

    </div>
  );
};
