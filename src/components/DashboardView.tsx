import React, { useState } from 'react';
import { WorkoutSession, MealCategory, BiometricEntry, CoachMessage, Exercise } from '../types/fitness';
import { UserProfile, PersonalPlan } from '../types/user';
import { ProgressionBar } from './ProgressionBar';
import { MetricChip } from './MetricChip';
import { ExerciseVideoModal } from './ExerciseVideoModal';
import { DailyMetabolicTracker } from './DailyMetabolicTracker';
import {
  Play,
  Flame,
  Activity,
  Sparkles,
  Utensils,
  Droplets,
  Dumbbell,
  Clock,
  ChevronRight,
  CheckCircle2,
  Tv,
  Calendar,
  Scale,
  MapPin,
  Target,
  User,
  HeartPulse,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  Plus,
  Check,
  Info,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  workout: WorkoutSession;
  allWorkouts?: WorkoutSession[];
  onSelectWorkoutSession?: (session: WorkoutSession) => void;
  mealCategories: MealCategory[];
  biometrics: BiometricEntry[];
  latestCoachMessage?: CoachMessage;
  streakDays: number;
  waterIntakeMl: number;
  movementKcal: number;
  proteinTarget: number;
  hydrationTargetMl: number;
  movementTargetKcal: number;
  userProfile?: UserProfile;
  aiPlan?: PersonalPlan | null;
  onRegeneratePlan?: () => Promise<void> | void;
  isRegeneratingPlan?: boolean;
  onAddBiometricLog?: (entry: BiometricEntry) => void;
  onNavigate: (view: 'dashboard' | 'workout' | 'nutrition' | 'coach' | 'biometrics' | 'profile' | 'calisthenics' | 'growth') => void;
  onOpenRestTimer: (seconds: number) => void;
  onQuickWater: (amountMl: number) => void;
  onQuickAddProtein: (amountG: number) => void;
  onQuickAddMovement: (amountKcal: number) => void;
  onUpdateTargets: (targets: { protein: number; hydration: number; movement: number }) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  workout,
  allWorkouts,
  onSelectWorkoutSession,
  mealCategories,
  biometrics,
  latestCoachMessage,
  streakDays,
  waterIntakeMl,
  movementKcal,
  proteinTarget,
  hydrationTargetMl,
  movementTargetKcal,
  userProfile,
  aiPlan,
  onRegeneratePlan,
  isRegeneratingPlan,
  onAddBiometricLog,
  onNavigate,
  onOpenRestTimer,
  onQuickWater,
  onQuickAddProtein,
  onQuickAddMovement,
  onUpdateTargets,
}) => {
  const [selectedTutorialExercise, setSelectedTutorialExercise] = useState<Exercise | null>(null);
  const [quickWeightInput, setQuickWeightInput] = useState<string>('');
  const [logSuccessMessage, setLogSuccessMessage] = useState<string>('');
  const [activePlanTab, setActivePlanTab] = useState<'diet' | 'training' | 'progress'>('diet');

  const activeWeight = userProfile?.currentWeightKg || 98.0;
  const targetWeight = userProfile?.targetWeightKg || 82.0;
  const activeHeight = userProfile?.currentHeightCm || 178;
  const desiredHeight = userProfile?.desiredHeightCm || 178;
  const userName = userProfile?.fullName || 'Athlete';
  const userGoal = userProfile?.primaryGoal || 'Healthy Weight Management';
  const hasCity = Boolean(userProfile?.city && userProfile.city.trim());
  const userLocation = hasCity
    ? `${userProfile!.city}${userProfile?.state ? ', ' + userProfile.state : ''}`
    : 'All-India General (City not specified)';
  const dietCategory = userProfile?.dietaryPreference || 'Vegetarian';
  const isTeenager = (userProfile?.age || 22) < 20;
  const hasHeightGoal = desiredHeight > activeHeight;

  const latestBio = biometrics[biometrics.length - 1] || {
    weightKg: activeWeight,
    bodyFatPct: 27.5,
    recoveryScore: 92,
    sleepHours: 8.0,
  };

  // Workout progress
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const workoutProgressPct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  // Nutrition progress
  const allItems = mealCategories.flatMap((m) => m.items);
  const totalCalories = Math.round(allItems.reduce((sum, item) => sum + item.calories, 0));
  const totalProtein = Math.round(allItems.reduce((sum, item) => sum + item.protein, 0) * 10) / 10;
  const CALORIE_TARGET = userProfile?.dailyCalorieTarget || 2000;
  const PROTEIN_TARGET = userProfile?.dailyProteinTargetG || proteinTarget || 145;
  const HYDRATION_TARGET = userProfile?.dailyHydrationTargetMl || hydrationTargetMl || 4000;

  // Weekly schedule overview
  const weeklySchedule = [
    { day: 'Mon', focus: 'Push Day (Chest / Shoulders / Triceps)', type: 'Gym / Home', active: true },
    { day: 'Tue', focus: 'Pull Day (Back / Traps / Biceps)', type: 'Gym / Home', active: false },
    { day: 'Wed', focus: 'Active Mobility & 8k Steps Walk', type: 'Recovery', active: false },
    { day: 'Thu', focus: 'Legs & Core Compound Hypertrophy', type: 'Gym / Home', active: false },
    { day: 'Fri', focus: 'Upper Body Explosive Volume', type: 'Gym / Home', active: false },
    { day: 'Sat', focus: 'Metabolic Conditioning & Core', type: 'Home Calisthenics', active: false },
    { day: 'Sun', focus: 'Full Restoration & CNS Recovery', type: 'Rest Day', active: false },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* 4 Core Quick Navigation Cards (Requested 4 Sections) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('nutrition')}
          className="p-3.5 rounded-xl bg-[#111618] hover:bg-[#182022] border border-[#10B981]/25 hover:border-[#A3E635] text-left transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold text-[#A3E635] uppercase flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#A3E635]" />
              1. My Diet Plan
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#A3E635] group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-xs font-semibold text-[#F8FAFC]">
            {hasCity ? `${userProfile!.city} · ${dietCategory}` : `All-India · ${dietCategory}`}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
            {totalProtein}g / {PROTEIN_TARGET}g Protein Target
          </div>
        </button>

        <button
          onClick={() => onNavigate('workout')}
          className="p-3.5 rounded-xl bg-[#111618] hover:bg-[#182022] border border-[#10B981]/25 hover:border-[#A3E635] text-left transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold text-[#A3E635] uppercase flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-[#A3E635]" />
              2. My Workout Plan
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#A3E635] group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-xs font-semibold text-[#F8FAFC]">
            PPL Split · Gym & Home
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
            Video Tutorials & Tempo Log
          </div>
        </button>

        <button
          onClick={() => onNavigate('biometrics')}
          className="p-3.5 rounded-xl bg-[#111618] hover:bg-[#182022] border border-[#10B981]/25 hover:border-[#A3E635] text-left transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold text-[#A3E635] uppercase flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#A3E635]" />
              3. My Progress
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#A3E635] group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-xs font-semibold text-[#F8FAFC]">
            {activeWeight.toFixed(1)} kg → {targetWeight.toFixed(1)} kg
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
            Body Recomposition Curve
          </div>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="p-3.5 rounded-xl bg-[#111618] hover:bg-[#182022] border border-[#10B981]/25 hover:border-[#A3E635] text-left transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold text-[#A3E635] uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#A3E635]" />
              4. My Profile
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#A3E635] group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="text-xs font-semibold text-[#F8FAFC]">
            {userName}
          </div>
          <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
            {userLocation}
          </div>
        </button>
      </div>

      {/* AI Personalisation Engine & Core Protocol Showcase (Gemini + Firestore) */}
      <div className="bg-[#111618] border border-[#A3E635]/30 rounded-2xl p-6 sm:p-7 shadow-[0_0_25px_rgba(163,230,53,0.08)] relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-[#A3E635]/5 blur-3xl pointer-events-none" />

        {/* Engine Header & Regenerate action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#10B981]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#182022] border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#A3E635] tracking-widest uppercase">
                  AI-POWERED PERSONALISATION ENGINE
                </span>
                <span className="px-2 py-0.5 rounded bg-[#182022] border border-[#10B981]/30 text-[10px] font-mono text-[#4ADE80]">
                  GEMINI 3.8 FLASH + FIRESTORE
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-[#F8FAFC] tracking-tight mt-0.5">
                AURAMORPH Protocol for {userName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRegeneratePlan && (
              <button
                onClick={() => onRegeneratePlan()}
                disabled={isRegeneratingPlan}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A3E635] text-[#0A0D0E] hover:bg-[#bef264] border border-[#A3E635] text-xs font-mono font-bold tracking-wider transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(163,230,53,0.25)] hover:scale-[1.02]"
              >
                <RefreshCw className={`w-4 h-4 ${isRegeneratingPlan ? 'animate-spin' : ''}`} />
                <span>{isRegeneratingPlan ? 'ANALYZING PROFILE & REGENERATING...' : 'REGENERATE MY PLAN'}</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Scientific Executive Summary */}
        <div className="py-4 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-b border-[#10B981]/15">
          <strong className="text-[#F8FAFC] font-semibold">Scientific Plan Summary: </strong>
          {aiPlan?.summary ||
            `Personalized protocol designed for ${userName} (${activeWeight} kg → ${targetWeight} kg target) focused on ${userGoal}. Nutrition prioritizes affordable ${userLocation} regional vegetarian staples with a ${userProfile?.dailyBudget || 'budget-friendly'} structure and progressive ${userProfile?.experienceLevel || 'Beginner'} training.`}
        </div>

        {/* Calisthenics Academy Quick Launch Banner */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#170E28] via-[#120B20] to-[#0A0D0E] border border-[#A855F7]/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_25px_rgba(168,85,247,0.12)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#26143B] border border-[#C084FC]/50 flex items-center justify-center text-[#C084FC] shrink-0 shadow-[0_0_12px_rgba(192,132,252,0.3)]">
              <Zap className="w-5 h-5 text-[#C084FC] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm text-[#F8FAFC]">
                  CALISTHENICS ACADEMY
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3B0764] text-[#E879F9] border border-[#C084FC]/40 font-bold">
                  23 SKILLS · 4 ROUTINES
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Master bodyweight progressions: Handstands, Levers, Muscle-ups, and Planches with interactive video masterclasses.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('calisthenics')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-[#0A0D0E] hover:from-[#9333ea] hover:to-[#a855f7] font-display font-bold text-xs tracking-wide shrink-0 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
          >
            <span>Launch Academy</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Prominent HEIGHT & HEALTHY GROWTH Card */}
        <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-[#1A0E2E] via-[#130E22] to-[#0A0D10] border border-[#C084FC]/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_30px_rgba(192,132,252,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E1045] border border-[#E879F9]/50 flex items-center justify-center text-[#E879F9] shrink-0 shadow-[0_0_15px_rgba(232,121,249,0.35)]">
              <Sparkles className="w-5 h-5 text-[#E879F9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm text-[#F8FAFC] tracking-tight">
                  HEIGHT &amp; HEALTHY GROWTH
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-[#C084FC] border border-[#A855F7]/40 font-bold uppercase">
                  {isTeenager ? 'Teen & Adult Track' : 'Postural Alignment'}
                </span>
              </div>
              <p className="text-xs text-purple-200/90 font-medium mt-0.5">
                Build healthy habits. Support your natural development.
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                10 posture &amp; mobility video routines &bull; Daily healthy growth schedule &bull; Interactive height tracker &bull; Growth plate science
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('growth')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C084FC] to-[#A855F7] text-[#0A0D0E] hover:from-[#e879f9] hover:to-[#c084fc] font-display font-bold text-xs tracking-wide shrink-0 transition-all shadow-[0_0_15px_rgba(192,132,252,0.35)] flex items-center gap-1.5"
          >
            <span>Enter Growth Centre</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Local City Requirement Advisory (Requirement 6) */}
        {!hasCity && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-300">
                  General Indian Balanced Nutrition Plan
                </strong>
                Local diet recommendations require a city. You are currently viewing a general Indian diet plan. Add your city in My Profile anytime to unlock regional mandi prices and local staples.
              </div>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-mono text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Add City in Profile
            </button>
          </div>
        )}

        {/* Height Guidance Science Advisory (Requirement 4) */}
        {(hasHeightGoal || isTeenager || aiPlan?.heightGuidance) && (
          <div className="mt-4 p-4 rounded-xl bg-[#182022] border border-blue-500/30 text-xs text-[#94A3B8] flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-display font-bold text-[#F8FAFC] text-xs uppercase tracking-wide flex items-center gap-2">
                <span>Height & Epiphyseal Growth-Plate Guidance</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30">
                  GENETIC & CLINICAL SCIENCE
                </span>
              </div>
              <p className="leading-relaxed text-[#CBD5E1]">
                {aiPlan?.heightGuidance ||
                  (isTeenager
                    ? 'Final adult height is primarily determined by genetics (80–85%) and the biological state of long-bone epiphyseal growth plates, which naturally fuse following puberty (ages 16–21). No exercise, stretching, hanging, or diet can increase bone length once growth plates have fused. For growing adolescents: prioritize 8.5–9.5 hours of deep sleep (when nocturnal growth hormone is secreted), balanced calcium and Vitamin D3, and consult a pediatrician or endocrinologist if you have concerns about clinical growth.'
                    : 'Final adult height is genetically regulated through long-bone epiphyseal plates that fuse post-puberty. Stretches or hanging cannot lengthen fused skeletal bones. Adults can maximize functional postural height (1–2 cm) through thoracic spine decompression, hip flexor mobility, and deep core stabilization.')}
              </p>
            </div>
          </div>
        )}

        {/* Section Selection Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-[#0A0D0E] rounded-xl border border-[#10B981]/15 w-fit">
          <button
            onClick={() => setActivePlanTab('diet')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
              activePlanTab === 'diet'
                ? 'bg-[#182022] text-[#A3E635] border border-[#A3E635]/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>MY PERSONAL DIET</span>
          </button>
          <button
            onClick={() => setActivePlanTab('training')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
              activePlanTab === 'training'
                ? 'bg-[#182022] text-[#A3E635] border border-[#A3E635]/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>MY TRAINING PLAN</span>
          </button>
          <button
            onClick={() => setActivePlanTab('progress')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
              activePlanTab === 'progress'
                ? 'bg-[#182022] text-[#A3E635] border border-[#A3E635]/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>MY PROGRESS</span>
          </button>
        </div>

        {/* Tab 1: MY PERSONAL DIET (Requirement 5.1) */}
        {activePlanTab === 'diet' && (
          <div className="mt-5 space-y-5">
            {/* Diet Metrics & Budget Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/15">
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Daily Calorie Target</span>
                <span className="font-display font-bold text-lg text-[#F8FAFC]">
                  {aiPlan?.dietPlan.dailyCalorieTarget || userProfile?.dailyCalorieTarget || 2050} kcal
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Protein Requirement</span>
                <span className="font-display font-bold text-lg text-[#A3E635]">
                  {aiPlan?.dietPlan.dailyProteinG || userProfile?.dailyProteinTargetG || 145}g / day
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Estimated Daily Cost</span>
                <span className="font-display font-bold text-lg text-[#4ADE80]">
                  ₹{aiPlan?.dietPlan.estimatedDailyCostInr || 180} <span className="text-xs font-normal text-[#94A3B8]">/ day</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Budget Tier</span>
                <span className="font-display font-bold text-xs text-[#F8FAFC] truncate block mt-1">
                  {userProfile?.dailyBudget || 'Budget Friendly (₹120–250/day)'}
                </span>
              </div>
            </div>

            {/* Daily Meals Breakdown with Quantities, Calories, and Costs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#A3E635]" />
                  <span>Daily Meal Distribution ({userProfile?.mealsPerDay || 3} Meals per Day)</span>
                </h4>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  Location: <strong className="text-[#A3E635]">{userLocation}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(aiPlan?.dietPlan.meals && aiPlan.dietPlan.meals.length > 0
                  ? aiPlan.dietPlan.meals
                  : [
                      {
                        mealName: 'Energizing Morning Breakfast',
                        time: '8:30 AM',
                        items: [
                          {
                            name: 'Low-Fat Cow Paneer Bhurji & Whole Wheat Roti',
                            quantity: '120g fresh paneer + 2 medium rotis',
                            calories: 420,
                            proteinG: 28,
                            costEstInr: 45,
                            notes: 'Leucine rich; prepared with mustard oil and turmeric.',
                          },
                          {
                            name: 'Spiced Buttermilk (Chaas)',
                            quantity: '250 ml with roasted jeera',
                            calories: 85,
                            proteinG: 6,
                            costEstInr: 15,
                            notes: 'Natural gut flora and calcium support.',
                          },
                        ],
                        approxCalories: 505,
                        approxProteinG: 34,
                      },
                      {
                        mealName: 'High-Bioavailability Lunch',
                        time: '1:30 PM',
                        items: [
                          {
                            name: 'Slow Cooked Yellow Dal (Moong & Masoor Blend)',
                            quantity: '1 large bowl (250g)',
                            calories: 220,
                            proteinG: 14,
                            costEstInr: 25,
                            notes: 'Complete essential amino acid profile.',
                          },
                          {
                            name: 'Steamed Rice & Fresh Phulka',
                            quantity: '1 cup rice + 1 roti',
                            calories: 260,
                            proteinG: 6,
                            costEstInr: 15,
                            notes: 'Glycogen replenishment.',
                          },
                          {
                            name: 'Fresh Curd (Dahi) & Cucumber Salad',
                            quantity: '150g curd + salad',
                            calories: 120,
                            proteinG: 6,
                            costEstInr: 20,
                            notes: 'Probiotics and dietary fiber.',
                          },
                        ],
                        approxCalories: 600,
                        approxProteinG: 26,
                      },
                      {
                        mealName: 'Post-Workout / Evening Snack',
                        time: '5:30 PM',
                        items: [
                          {
                            name: 'Roasted Chana & Sprouted Moong Chaat',
                            quantity: '80g chana + sprouts with lemon',
                            calories: 240,
                            proteinG: 16,
                            costEstInr: 25,
                            notes: 'Crisp, high-satiety plant protein.',
                          },
                        ],
                        approxCalories: 240,
                        approxProteinG: 16,
                      },
                      {
                        mealName: 'Restorative Dinner',
                        time: '8:30 PM',
                        items: [
                          {
                            name: 'Soya Chunks Curry with Seasonal Greens',
                            quantity: '50g soya chunks + seasonal sabzi',
                            calories: 320,
                            proteinG: 32,
                            costEstInr: 35,
                            notes: '52% protein density by dry weight.',
                          },
                          {
                            name: 'Whole Wheat Roti with Ajwain',
                            quantity: '2 rotis',
                            calories: 180,
                            proteinG: 5,
                            costEstInr: 12,
                            notes: 'Ajwain supports overnight digestion.',
                          },
                        ],
                        approxCalories: 500,
                        approxProteinG: 37,
                      },
                    ]
                ).map((meal, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/15 space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/10">
                        <span className="font-display font-semibold text-xs text-[#F8FAFC]">
                          {meal.mealName}
                        </span>
                        <div className="flex items-center gap-2">
                          {meal.time && (
                            <span className="text-[10px] font-mono text-[#94A3B8]">{meal.time}</span>
                          )}
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#182022] text-[#A3E635] font-bold">
                            ~{meal.approxProteinG}g Pro
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-2">
                        {meal.items.map((it, iIdx) => (
                          <div key={iIdx} className="text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-medium text-[#F8FAFC]">{it.name}</span>
                                <span className="text-[11px] text-[#A3E635] block font-mono">
                                  Qty: {it.quantity}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[11px] font-mono text-[#F8FAFC]">
                                  {it.calories} kcal
                                </span>
                                {it.costEstInr ? (
                                  <span className="text-[10px] text-[#4ADE80] font-mono block">
                                    ~₹{it.costEstInr}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            {it.notes && (
                              <p className="text-[10px] text-[#64748B] mt-0.5 italic">{it.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#10B981]/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                      <span>Approx: {meal.approxCalories} kcal</span>
                      <span className="text-[#A3E635]">Target: ~{meal.approxProteinG}g Protein</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Food Alternatives Card */}
            <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/15 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-xs uppercase tracking-wide text-[#F8FAFC] flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Cost-Effective Local Food Alternatives</span>
                </h4>
                <span className="text-[10px] font-mono text-[#4ADE80]">No Expensive Imported Groceries</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(aiPlan?.dietPlan.localAlternatives || [
                  {
                    original: 'Imported Quinoa',
                    localReplacement: 'Dalia (Broken Wheat) / Millets',
                    benefit: 'Equal complex fiber & slow carbs at 1/5th grocery cost',
                  },
                  {
                    original: 'Avocado',
                    localReplacement: 'Cold-pressed Mustard Oil + Roasted Peanuts',
                    benefit: 'Healthy monounsaturated fats & Vitamin E locally sourced',
                  },
                  {
                    original: 'Greek Yogurt',
                    localReplacement: 'Hung Curd (Dahi drained in muslin cloth)',
                    benefit: 'Identical protein density without industrial processing',
                  },
                  {
                    original: 'Commercial Whey Protein',
                    localReplacement: 'Roasted Sattu or 100g Cow Paneer',
                    benefit: 'Whole-food amino acid profile with prolonged satiety',
                  },
                ]).map((alt, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#111618] border border-[#10B981]/15">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#94A3B8] line-through">{alt.original}</span>
                      <span className="text-[#A3E635] font-bold">➔ {alt.localReplacement}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">{alt.benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MY TRAINING PLAN (Requirement 5.2) */}
        {activePlanTab === 'training' && (
          <div className="mt-5 space-y-5">
            {/* Weekly Schedule Overview */}
            <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/15 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-xs uppercase tracking-wide text-[#F8FAFC] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>Weekly Training Schedule & Recovery Days</span>
                </h4>
                <span className="text-[10px] font-mono text-[#A3E635]">
                  Experience: {userProfile?.experienceLevel || 'Beginner'} · Equipment: {userProfile?.equipment || 'Dumbbells'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {(aiPlan?.workoutPlan.schedule || [
                  { day: 'Monday', focus: 'Push (Chest & Triceps)', type: 'Strength', isRest: false },
                  { day: 'Tuesday', focus: 'Pull (Back & Biceps)', type: 'Strength', isRest: false },
                  { day: 'Wednesday', focus: 'Spinal Mobility Flow', type: 'Recovery Day', isRest: true },
                  { day: 'Thursday', focus: 'Legs & Core Compound', type: 'Hypertrophy', isRest: false },
                  { day: 'Friday', focus: 'Upper Body Volume', type: 'Metabolic', isRest: false },
                  { day: 'Saturday', focus: 'Zone-2 Steady Walk', type: 'Cardio', isRest: true },
                  { day: 'Sunday', focus: 'CNS & Muscle Restoration', type: 'Rest Day', isRest: true },
                ]).map((sch, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-2.5 rounded-lg border text-left ${
                      sch.isRest
                        ? 'bg-[#111618] border-[#10B981]/15 text-[#94A3B8]'
                        : 'bg-[#182022] border-[#A3E635]/40 text-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className={sch.isRest ? 'text-[#64748B]' : 'text-[#A3E635] font-bold'}>
                        {sch.day.slice(0, 3)}
                      </span>
                      {sch.isRest ? (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#0A0D0E] text-[#94A3B8]">Rest</span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
                      )}
                    </div>
                    <p className="text-xs font-semibold leading-tight">{sch.focus}</p>
                    <span className="text-[10px] font-mono text-[#64748B] block mt-1">{sch.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Exercises with Sets, Reps, Rest, Warm-up, and Beginner Alternatives */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-[#A3E635]" />
                  <span>Daily Exercises, Sets & Repetitions (Calibrated)</span>
                </h4>
                <button
                  onClick={() => onNavigate('workout')}
                  className="text-xs text-[#A3E635] hover:underline font-mono"
                >
                  Open Full Workout View →
                </button>
              </div>

              {/* Warm-up / Cool-down protocol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
                  <span className="font-mono text-[10px] font-bold text-[#A3E635] uppercase block mb-1">
                    Warm-Up Protocol (5-8 Mins)
                  </span>
                  <ul className="space-y-1 text-[#94A3B8] text-[11px]">
                    <li>• Shoulder dislocations with towel/band (15 reps)</li>
                    <li>• Cat-cow spinal waves for lumbar decompression (10 reps)</li>
                    <li>• Light bodyweight push-ups or wall slides (2 sets of 8)</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
                  <span className="font-mono text-[10px] font-bold text-[#4ADE80] uppercase block mb-1">
                    Cool-Down & Decompression (5 Mins)
                  </span>
                  <ul className="space-y-1 text-[#94A3B8] text-[11px]">
                    <li>• Passive doorway pectoral stretch (30s per side)</li>
                    <li>• Child pose with deep diaphragmatic breathing (2 mins)</li>
                    <li>• Overhead lat hang for spine elongation (45s)</li>
                  </ul>
                </div>
              </div>

              {/* Exercises List */}
              <div className="space-y-2">
                {(aiPlan?.workoutPlan.sessions?.[0]?.exercises || [
                  {
                    name: 'Dumbbell Floor Press / Push-Up',
                    targetMuscle: 'Pectoralis Major & Triceps',
                    sets: 3,
                    reps: '8-12 reps',
                    restSeconds: 90,
                    equipment: userProfile?.equipment || 'Dumbbells',
                    beginnerAlternative: 'Incline push-ups against bench or wall',
                    formCues: 'Tuck elbows at 45 degrees, squeeze chest, 3s lowering tempo.',
                  },
                  {
                    name: 'Overhead Shoulder Press',
                    targetMuscle: 'Anterior & Lateral Deltoids',
                    sets: 3,
                    reps: '10-12 reps',
                    restSeconds: 90,
                    equipment: userProfile?.equipment || 'Dumbbells',
                    beginnerAlternative: 'Seated band shoulder press or light dumbbells',
                    formCues: 'Brace core, do not arch lower back excessively at lockout.',
                  },
                  {
                    name: 'Bench / Chair Triceps Dips',
                    targetMuscle: 'Triceps Brachii',
                    sets: 3,
                    reps: '12-15 reps',
                    restSeconds: 60,
                    equipment: 'Chair or Bench',
                    beginnerAlternative: 'Dips with bent knees close to body',
                    formCues: 'Keep spine close to bench edge, lower until elbows hit 90 degrees.',
                  },
                ]).map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    className="p-3 rounded-xl bg-[#0A0D0E] border border-[#10B981]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[#182022] text-[#A3E635] flex items-center justify-center font-mono font-bold text-[11px]">
                          {exIdx + 1}
                        </span>
                        <span className="font-semibold text-[#F8FAFC] text-sm">{ex.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182022] text-[#4ADE80]">
                          {ex.targetMuscle}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] pl-7">
                        <strong className="text-[#A3E635]">Beginner Alt:</strong> {ex.beginnerAlternative}
                      </div>
                      <div className="text-[10px] text-[#64748B] pl-7 italic">
                        Cue: {ex.formCues}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-7 sm:pl-0 shrink-0 font-mono">
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#F8FAFC]">
                          {ex.sets} sets × {ex.reps}
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">Rest: {ex.restSeconds}s</div>
                      </div>
                      <button
                        onClick={() => onOpenRestTimer(ex.restSeconds || 90)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#182022] hover:bg-[#1f2a2d] border border-[#10B981]/30 text-xs text-[#A3E635] flex items-center gap-1"
                        title="Start Rest Timer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Timer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: MY PROGRESS (Requirement 5.3) */}
        {activePlanTab === 'progress' && (
          <div className="mt-5 space-y-5">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/15">
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Weight Delta</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display font-extrabold text-2xl text-[#A3E635]">
                    {activeWeight.toFixed(1)} kg
                  </span>
                  <span className="text-xs font-mono text-[#94A3B8]">
                    ➔ Target: {targetWeight.toFixed(1)} kg
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#4ADE80] block mt-1">
                  Remaining: {(activeWeight - targetWeight).toFixed(1)} kg to shed
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/15">
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Workout Completion</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display font-extrabold text-2xl text-[#F8FAFC]">
                    {completedSets} / {totalSets || 12}
                  </span>
                  <span className="text-xs font-mono text-[#A3E635]">
                    Sets Completed ({Math.round(workoutProgressPct)}%)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#94A3B8] block mt-1">
                  Active Streak: {streakDays} days consistent
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/15">
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Nutrition Adherence</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display font-extrabold text-2xl text-[#A3E635]">
                    {totalProtein}g
                  </span>
                  <span className="text-xs font-mono text-[#94A3B8]">
                    / {PROTEIN_TARGET}g Target
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#4ADE80] block mt-1">
                  Hydration: {waterIntakeMl} / {HYDRATION_TARGET} ml
                </span>
              </div>
            </div>

            {/* Interactive Weight Log to Firestore */}
            <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-xs uppercase tracking-wide text-[#F8FAFC] flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>Log Today's Body Weight (Stored in Firebase Firestore)</span>
                </h4>
                <span className="text-[10px] font-mono text-[#94A3B8]">Persistent Telemetry</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-60">
                  <input
                    type="number"
                    step="0.1"
                    placeholder={`e.g. ${activeWeight.toFixed(1)}`}
                    value={quickWeightInput}
                    onChange={(e) => setQuickWeightInput(e.target.value)}
                    className="w-full bg-[#111618] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] font-mono outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-mono text-[#94A3B8]">kg</span>
                </div>

                <button
                  onClick={() => {
                    const parsed = parseFloat(quickWeightInput);
                    if (!isNaN(parsed) && parsed > 20 && parsed < 300) {
                      const newEntry: BiometricEntry = {
                        date: new Date().toISOString().split('T')[0],
                        dayLabel: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
                        weightKg: parsed,
                        bodyFatPct: 27.0,
                        sleepHours: 8.0,
                        restingHeartRate: 58,
                        recoveryScore: 92,
                        volumeTonnageKg: 2800,
                      };
                      if (onAddBiometricLog) {
                        onAddBiometricLog(newEntry);
                      }
                      setLogSuccessMessage(`Recorded ${parsed} kg to Firestore!`);
                      setQuickWeightInput('');
                      setTimeout(() => setLogSuccessMessage(''), 3000);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#A3E635] text-[#0A0D0E] font-display font-bold text-xs hover:bg-[#bef264] transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Log to Firestore</span>
                </button>

                {logSuccessMessage && (
                  <span className="text-xs font-mono text-[#4ADE80] flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>{logSuccessMessage}</span>
                  </span>
                )}
              </div>

              {/* Recent Biometric History Snapshot */}
              <div className="pt-3 border-t border-[#10B981]/10">
                <span className="text-[11px] font-mono text-[#94A3B8] block mb-2">Recent Timeline:</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {biometrics.slice(-5).map((b, bIdx) => (
                    <div
                      key={bIdx}
                      className="px-3 py-1.5 rounded-lg bg-[#111618] border border-[#10B981]/15 text-xs font-mono shrink-0"
                    >
                      <span className="text-[#94A3B8] text-[10px] block">{b.date} ({b.dayLabel})</span>
                      <span className="font-bold text-[#A3E635]">{b.weightKg.toFixed(1)} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Telemetry Card with Bio-Luminescent Accents & Aarav Jakhar Branding */}
      <div className="telemetry-card rounded-2xl p-6 sm:p-7 bg-[#111618]">
        {/* Profile Kicker Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#10B981]/15">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <a
              href="https://www.instagram.com/dr.monomaniac/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-[#182022] hover:bg-[#202b2e] border border-[#A3E635]/40 hover:border-[#A3E635] font-mono font-bold text-[#A3E635] shadow-[0_0_10px_rgba(163,230,53,0.2)] inline-flex items-center gap-1.5 transition-all"
            >
              <span>MADE BY AARAV JAKHAR</span>
              <span className="text-[10px] text-[#4ADE80]">(@dr.monomaniac)</span>
            </a>
            <span className="text-[#64748B]">·</span>
            <span className="font-mono text-[#F8FAFC]">Athlete: <strong className="text-[#F8FAFC]">{userName}</strong></span>
            <span className="text-[#64748B]">·</span>
            <span className="font-mono text-[#F8FAFC]">Weight: <strong className="text-[#A3E635]">{activeWeight.toFixed(1)} kg</strong></span>
            <span className="text-[#64748B]">·</span>
            <span className="font-mono text-[#F8FAFC]">Height: <strong className="text-[#A3E635]">{activeHeight} cm</strong></span>
            <span className="text-[#64748B]">·</span>
            <span className="font-mono text-[#4ADE80]">{userGoal}</span>
          </div>

          {/* Quick Workout Session Launcher */}
          {allWorkouts && onSelectWorkoutSession && (
            <div className="flex items-center gap-1.5 text-xs font-mono flex-wrap">
              <span className="text-[#94A3B8] mr-1 hidden sm:inline">Routines:</span>
              {allWorkouts.map((w) => {
                const isCurrent = w.id === workout.id;
                const isGym = w.location === 'gym' || !w.location;
                return (
                  <button
                    key={w.id}
                    onClick={() => onSelectWorkoutSession(w)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      isCurrent
                        ? 'bg-[#A3E635] text-[#0A0D0E] font-bold shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                        : 'bg-[#182022] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#10B981]/20'
                    }`}
                  >
                    {isGym ? '🏋️ ' : '🏠 '}
                    {w.title.includes('Push') ? 'Push' : w.title.includes('Pull') ? 'Pull' : 'Legs'}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[#A3E635] tracking-widest uppercase">
                {userName.toUpperCase()} BIO-METABOLIC TELEMETRY STREAM
              </span>
              <span className="text-xs text-[#64748B]">·</span>
              <span className="text-xs text-[#10B981] font-mono">LOCATION: {userLocation.toUpperCase()}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
              {userGoal} & Precision Fueling
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl">
              Calibrated for {userName} ({activeWeight.toFixed(1)} kg · {activeHeight} cm): {CALORIE_TARGET} kcal target, {PROTEIN_TARGET}g+ localized protein floor, and dual Gym PPL + Home Calisthenics with interactive video tutorials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('workout')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs sm:text-sm glow-lime hover:scale-[1.02] transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Active Push Workout</span>
            </button>
            <button
              onClick={() => onNavigate('nutrition')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#182022] hover:bg-[#202b2e] border border-[#10B981]/30 text-xs sm:text-sm font-medium text-[#F8FAFC] transition-all"
            >
              <Utensils className="w-4 h-4 text-[#A3E635]" />
              <span>Personalised Meal Plan</span>
            </button>
          </div>
        </div>

        {/* 4 Biometric Metric Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <MetricChip
            label="Current Body Mass"
            value={activeWeight.toFixed(1)}
            unit="KG"
            subLabel={`Target: ${targetWeight.toFixed(1)}kg`}
            dotColor="#A3E635"
          />
          <MetricChip
            label="Stature / Posture"
            value={activeHeight}
            unit="CM"
            subLabel="Baseline"
            dotColor="#10B981"
          />
          <MetricChip
            label="Daily Caloric Ceiling"
            value={totalCalories}
            unit={`/ ${CALORIE_TARGET} KCAL`}
            dotColor="#10B981"
          />
          <MetricChip
            label="Lean Tissue Sparing"
            value={totalProtein}
            unit={`/ ${PROTEIN_TARGET}G`}
            dotColor="#A3E635"
          />
        </div>
      </div>

      {/* Circular Progress Metabolic Tracker */}
      <DailyMetabolicTracker
        currentProtein={totalProtein}
        proteinTarget={PROTEIN_TARGET}
        currentHydrationMl={waterIntakeMl}
        hydrationTargetMl={HYDRATION_TARGET}
        currentMovementKcal={movementKcal}
        movementTargetKcal={movementTargetKcal}
        onAddProtein={onQuickAddProtein}
        onAddHydration={onQuickWater}
        onAddMovement={onQuickAddMovement}
        onUpdateTargets={onUpdateTargets}
      />

      {/* 2-Column Split: Active Workout & Personalised Local Diet Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Workout Mission Control */}
        <div className="lg:col-span-7 glass-panel-elevated rounded-2xl p-5 sm:p-6 border border-[#10B981]/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/15 mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#A3E635]" />
                <h2 className="font-display font-bold text-base sm:text-lg text-[#F8FAFC]">
                  Daily Exercise Recommendations
                </h2>
              </div>
              <span className="text-xs font-mono text-[#A3E635] bg-[#111618] px-2.5 py-1 rounded border border-[#10B981]/20">
                ACTIVE SPLIT
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
                {workout.title}
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">{workout.subtitle}</p>
            </div>

            {/* Exercise Preview List */}
            <div className="space-y-2 mb-5">
              {workout.exercises.slice(0, 4).map((ex, idx) => {
                const doneSets = ex.sets.filter((s) => s.completed).length;
                const isAllDone = doneSets === ex.sets.length && ex.sets.length > 0;

                return (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#111618] border border-[#10B981]/15 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-[#182022] text-[#A3E635] flex items-center justify-center font-mono font-semibold text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-[#F8FAFC]">{ex.name}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <button
                        onClick={() => setSelectedTutorialExercise(ex)}
                        className="px-2 py-0.5 rounded bg-[#182022] hover:bg-[#A3E635] hover:text-[#0A0D0E] text-[#A3E635] border border-[#10B981]/25 text-[11px] transition-colors flex items-center gap-1"
                        title="Watch video tutorial"
                      >
                        <Tv className="w-3 h-3" />
                        <span>Tutorial</span>
                      </button>
                      <span className="text-[#94A3B8] text-[11px] hidden sm:inline">{ex.targetMuscle}</span>
                      <span className={`text-xs ${isAllDone ? 'text-[#A3E635] font-bold' : 'text-[#64748B]'}`}>
                        {doneSets}/{ex.sets.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#10B981]/15 gap-3">
            <button
              onClick={() => onOpenRestTimer(90)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#111618] border border-[#10B981]/20 text-xs text-[#94A3B8] hover:text-[#A3E635] transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Launch Rest Timer (90s)</span>
            </button>

            <button
              onClick={() => onNavigate('workout')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs glow-lime hover:scale-[1.02] transition-all"
            >
              <span>Full Workout Routine</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Card: Personalised Meal Suggestions (Haryana / Local Diet) */}
        <div className="lg:col-span-5 glass-panel-elevated rounded-2xl p-5 sm:p-6 border border-[#10B981]/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/15 mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#10B981]" />
                <h2 className="font-display font-bold text-base sm:text-lg text-[#F8FAFC]">
                  Personalised Meal Suggestions
                </h2>
              </div>
              <button
                onClick={() => onNavigate('nutrition')}
                className="text-xs text-[#A3E635] hover:underline font-medium"
              >
                My Diet Plan →
              </button>
            </div>

            {/* Protein & Calorie Snapshot */}
            <div className="space-y-3 mb-5">
              <div className="p-3.5 rounded-xl bg-[#111618] border border-[#10B981]/15 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#94A3B8] block">Today's Protein Floor</span>
                  <div className="font-display text-2xl font-bold text-[#A3E635] tabular-nums mt-0.5">
                    {totalProtein} <span className="text-sm font-normal text-[#F8FAFC]">/ {PROTEIN_TARGET}g</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#94A3B8] block">Remaining</span>
                  <div className="font-display text-lg font-semibold text-[#F8FAFC] tabular-nums mt-0.5">
                    {Math.max(0, Math.round((PROTEIN_TARGET - totalProtein) * 10) / 10)}g
                  </div>
                </div>
              </div>

              {/* Local Diet Recommendations preview */}
              <div className="text-xs space-y-2">
                <div className="flex items-center justify-between text-[#94A3B8] font-medium">
                  <span className="flex items-center gap-1.5 text-[#A3E635] font-mono text-[11px]">
                    <MapPin className="w-3 h-3" />
                    {userLocation} Local Staples
                  </span>
                  <span className="text-[10px] text-[#4ADE80] font-mono">100% {dietCategory}</span>
                </div>

                {userProfile?.localDiet?.recommendedFoods ? (
                  userProfile.localDiet.recommendedFoods.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#111618]/70 border border-[#10B981]/15 text-[#F8FAFC]"
                    >
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-[10px] text-[#94A3B8] block">{item.serving}</span>
                      </div>
                      <span className="font-mono text-[#A3E635] font-bold">~{item.proteinG}g Pro</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#111618]/70 border border-[#10B981]/15 text-[#F8FAFC]">
                      <span>Desi Low-Fat Paneer Bhurji & Phulkas</span>
                      <span className="font-mono text-[#A3E635]">28.4g Pro</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#111618]/70 border border-[#10B981]/15 text-[#F8FAFC]">
                      <span>Roasted Chana & Sattu Shaker</span>
                      <span className="font-mono text-[#A3E635]">15.0g Pro</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#111618]/70 border border-[#10B981]/15 text-[#F8FAFC]">
                      <span>Moong Dal Tadka & Desi Dahi</span>
                      <span className="font-mono text-[#A3E635]">22.5g Pro</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Daily Water Intake Guidance */}
          <div className="pt-4 border-t border-[#10B981]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#4ADE80]" />
              <span className="text-xs font-mono text-[#F8FAFC]">
                {waterIntakeMl} / {HYDRATION_TARGET} ml Hydration
              </span>
            </div>
            <button
              onClick={() => onQuickWater(250)}
              className="px-3 py-1.5 rounded-lg bg-[#111618] border border-[#10B981]/25 text-xs text-[#A3E635] hover:bg-[#182022] transition-colors"
            >
              +250ml Water
            </button>
          </div>
        </div>

      </div>

      {/* Weekly Workout Schedule (Requirement 7) */}
      <div className="bg-[#111618] border border-[#10B981]/20 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/15">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#A3E635]" />
            <h3 className="font-display font-bold text-base text-[#F8FAFC]">
              Weekly Workout Schedule
            </h3>
          </div>
          <span className="text-xs font-mono text-[#A3E635] bg-[#182022] px-2.5 py-1 rounded border border-[#10B981]/30">
            PPL (Push - Pull - Legs) Protocol
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {weeklySchedule.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-left transition-all ${
                item.active
                  ? 'bg-[#182022] border-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.15)]'
                  : 'bg-[#0A0D0E] border-[#10B981]/15'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className={`font-bold ${item.active ? 'text-[#A3E635]' : 'text-[#94A3B8]'}`}>
                  {item.day}
                </span>
                {item.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
                )}
              </div>
              <p className="text-xs font-medium text-[#F8FAFC] line-clamp-2">
                {item.focus}
              </p>
              <span className="text-[10px] font-mono text-[#64748B] block mt-1">
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Coach Specialized Pattern Card */}
      {latestCoachMessage && (
        <div className="ai-coach-card rounded-2xl p-5 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#10B981]/15 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#182022] border border-[#10B981]/30 flex items-center justify-center text-[#A3E635]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-display font-semibold text-sm text-[#F8FAFC]">
                AI Biometric Performance Insight
              </h3>
            </div>
            <span className="text-xs font-mono text-[#A3E635]">
              {latestCoachMessage.timestamp}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed whitespace-pre-line mb-3">
            {latestCoachMessage.text}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {latestCoachMessage.tags?.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111618] border border-[#10B981]/20 text-[#4ADE80]"
                >
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={() => onNavigate('coach')}
              className="text-xs text-[#A3E635] hover:underline font-display font-semibold flex items-center gap-1"
            >
              <span>Open Dialogue with Coach</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Biomechanical Video Tutorial Modal */}
      <ExerciseVideoModal
        exercise={selectedTutorialExercise}
        isOpen={!!selectedTutorialExercise}
        onClose={() => setSelectedTutorialExercise(null)}
      />

    </div>
  );
};
