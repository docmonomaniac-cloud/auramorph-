import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types/user';
import { HeightRecord, PostureExercise } from '../types/growth';
import {
  POSTURE_EXERCISES,
  DAILY_GROWTH_SCHEDULE,
  DAILY_DOS,
  DAILY_DONTS,
  GROWTH_PLATE_SCIENCE_TOPICS
} from '../data/growthData';
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Info,
  Maximize2,
  Minimize2,
  Moon,
  Plus,
  Play,
  RotateCcw,
  Ruler,
  ShieldAlert,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
  UserCheck,
  Video,
  X
} from 'lucide-react';

interface HeightGrowthCentreViewProps {
  userProfile: UserProfile | null;
  heightRecords: HeightRecord[];
  onAddHeightRecord: (record: Omit<HeightRecord, 'id' | 'createdAt'>) => Promise<void> | void;
  onDeleteHeightRecord?: (id: string) => Promise<void> | void;
  onBackToDashboard?: () => void;
}

type TabType = 'exercises' | 'routine' | 'dos_donts' | 'tracker' | 'science';

export const HeightGrowthCentreView: React.FC<HeightGrowthCentreViewProps> = ({
  userProfile,
  heightRecords,
  onAddHeightRecord,
  onDeleteHeightRecord,
  onBackToDashboard
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('exercises');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(POSTURE_EXERCISES[0]?.id || null);

  // Height Record Form State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newHeightCm, setNewHeightCm] = useState<string>(
    userProfile?.currentHeightCm ? String(userProfile.currentHeightCm) : '170'
  );
  const [newDate, setNewDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState<string>('07:30');
  const [newNotes, setNewNotes] = useState<string>('Morning barefoot measurement');
  const [newMeasuredBy, setNewMeasuredBy] = useState<'Self' | 'Parent / Guardian' | 'Doctor / Clinic'>('Self');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Mid-Parental Height Calculator State
  const [fatherHeightCm, setFatherHeightCm] = useState<string>('175');
  const [motherHeightCm, setMotherHeightCm] = useState<string>('162');
  const [calculatorGender, setCalculatorGender] = useState<'Male' | 'Female'>(
    userProfile?.gender === 'Female' ? 'Female' : 'Male'
  );

  // Routine Checklist State (stored locally for interactive engagement)
  const [completedRoutineItems, setCompletedRoutineItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('auramorph_growth_routine_done');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleRoutineItem = (id: string) => {
    setCompletedRoutineItems((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('auramorph_growth_routine_done', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const isTeenager = userProfile?.isTeenager ?? ((userProfile?.age ?? 20) < 18);

  const categories = useMemo(() => {
    return ['All', 'Spine Decompression', 'Thoracic Mobility', 'Postural Alignment', 'Core & Pelvis'];
  }, []);

  const filteredExercises = useMemo(() => {
    if (selectedCategory === 'All') return POSTURE_EXERCISES;
    return POSTURE_EXERCISES.filter((ex) => ex.category === selectedCategory);
  }, [selectedCategory]);

  // Sorted height records ascending for graph
  const sortedRecords = useMemo(() => {
    return [...heightRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [heightRecords]);

  // Height progress stats
  const heightStats = useMemo(() => {
    if (sortedRecords.length === 0) {
      const current = userProfile?.currentHeightCm || 170;
      const target = userProfile?.desiredHeightCm || current;
      return {
        initial: current,
        latest: current,
        diff: 0,
        target,
        count: 0
      };
    }
    const initial = sortedRecords[0].heightCm;
    const latest = sortedRecords[sortedRecords.length - 1].heightCm;
    const diff = Number((latest - initial).toFixed(1));
    const target = userProfile?.desiredHeightCm || latest;
    return {
      initial,
      latest,
      diff,
      target,
      count: sortedRecords.length
    };
  }, [sortedRecords, userProfile]);

  // Genetic Height Estimate
  const midParentalEstimate = useMemo(() => {
    const f = parseFloat(fatherHeightCm) || 175;
    const m = parseFloat(motherHeightCm) || 162;
    if (calculatorGender === 'Male') {
      const target = (f + m + 13) / 2;
      return {
        target: Number(target.toFixed(1)),
        min: Number((target - 6).toFixed(1)),
        max: Number((target + 6).toFixed(1))
      };
    } else {
      const target = (f - 13 + m) / 2;
      return {
        target: Number(target.toFixed(1)),
        min: Number((target - 6).toFixed(1)),
        max: Number((target + 6).toFixed(1))
      };
    }
  }, [fatherHeightCm, motherHeightCm, calculatorGender]);

  const handleSaveHeightRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newHeightCm);
    if (isNaN(val) || val < 80 || val > 260) {
      alert('Please enter a valid height between 80 cm and 260 cm.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddHeightRecord({
        date: newDate,
        time: newTime,
        heightCm: val,
        measuredWithFootwear: false,
        notes: newNotes,
        measuredBy: newMeasuredBy
      });
      setShowAddModal(false);
      setNewNotes('Morning barefoot measurement');
    } catch (err) {
      console.error('Error saving height record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090A] text-slate-100 pb-20">
      {/* Background glowing ambient elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[300px] bg-fuchsia-600/8 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Dashboard
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-purple-400" />
              AURAMORPH Wellness Centre
            </div>
          </div>

          {/* Age Tag Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                isTeenager
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
              }`}
            >
              {isTeenager ? '🌱 Teenager Track (<18 Years)' : '⚡ Adult Track (18+ Years)'}
            </span>
            <span className="text-xs text-slate-400">
              User: <span className="text-white font-medium">{userProfile?.fullName || 'Athlete'}</span> (
              {userProfile?.age ? `${userProfile.age} yrs` : 'Active'})
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12161B] via-[#0E1216] to-[#0A0D10] border border-purple-500/25 p-6 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.12)] mb-8">
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              HEIGHT &amp; HEALTHY GROWTH{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400">
                CENTRE
              </span>
            </h1>
            <p className="text-sm sm:text-base text-purple-200/90 font-medium mb-4">
              Build healthy habits. Support your natural development.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              A comprehensive clinical, postural, and lifestyle resource designed to maximize your natural physical
              potential through verified spinal decompression, optimal sleep hygiene, bioavailable Indian nutrition,
              and posture alignment.
            </p>

            {/* Teenager-specific or Adult guidance highlight */}
            <div className="mt-4 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/25 flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-slate-300">
                {isTeenager ? (
                  <>
                    <strong className="text-purple-300 font-semibold">Adolescent Growth Protocol:</strong> In
                    teenagers under 18, our system strictly enforces{' '}
                    <span className="text-emerald-300 font-medium">zero restrictive calorie deficits</span> and
                    emphasizes bone-density nutrition (calcium, milk, paneer, sunlight), restorative 8–10 hour sleep,
                    and parental support.
                  </>
                ) : (
                  <>
                    <strong className="text-purple-300 font-semibold">Adult Posture &amp; Spinal Health:</strong> For
                    adults 18+, long-bone epiphyseal growth plates have typically ossified. Regular postural
                    alignment, thoracic expansion, and vertebral disc hydration routinely reclaim{' '}
                    <span className="text-purple-300 font-medium">1 to 3 cm of compressed stature</span> lost to daily
                    sitting and slouching.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Clinical & Safety Standards Disclaimer (Always visible, prominent) */}
        <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs sm:text-sm text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-300">Clinical &amp; Medical Safety Standards:</span> Longitudinal
            bone growth occurs strictly at epiphyseal growth plates during childhood and adolescence. No exercise,
            hanging, or supplement can lengthen closed bones. Postural and mobility exercises decompress vertebral
            discs, strengthen back stabilizers, and correct kyphotic slouching. If you or your guardian have clinical
            growth concerns, always consult a board-certified pediatrician or pediatric endocrinologist for bone age
            radiography.
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-white/10 no-scrollbar">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'exercises'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 text-purple-300" />
            Posture &amp; Mobility Exercises (10)
          </button>

          <button
            onClick={() => setActiveTab('routine')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'routine'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-300" />
            Daily Healthy Growth Routine
          </button>

          <button
            onClick={() => setActiveTab('dos_donts')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dos_donts'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-purple-300" />
            Daily DOs &amp; DON’Ts (14)
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tracker'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Ruler className="w-4 h-4 text-purple-300" />
            Height Tracker &amp; Progress
          </button>

          <button
            onClick={() => setActiveTab('science')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'science'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-300" />
            Growth Plate Science &amp; Genetics
          </button>
        </div>

        {/* TAB 1: POSTURE & MOBILITY EXERCISES */}
        {activeTab === 'exercises' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-400 mr-2">Focus Area:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-purple-500/25 text-purple-300 border border-purple-500/50'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Exercise Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredExercises.map((exercise) => {
                const isExpanded = expandedExerciseId === exercise.id;
                return (
                  <div
                    key={exercise.id}
                    className={`rounded-2xl bg-[#0D1115] border transition-all duration-300 overflow-hidden flex flex-col ${
                      isExpanded
                        ? 'border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.2)] ring-1 ring-purple-500/30'
                        : 'border-white/10 hover:border-purple-500/30'
                    }`}
                  >
                    {/* Header info */}
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                              {exercise.category}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-300">
                              {exercise.difficulty}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
                            {exercise.name}
                          </h3>
                          {exercise.sanskritName && (
                            <p className="text-xs text-purple-300/80 italic font-serif">
                              {exercise.sanskritName}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                          className={`p-2 rounded-xl transition ${
                            isExpanded
                              ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                              : 'bg-white/5 text-slate-300 hover:bg-purple-500/20 hover:text-purple-300'
                          }`}
                          title={isExpanded ? 'Collapse Tutorial' : 'Open Video Tutorial'}
                        >
                          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>
                      </div>

                      <div className="space-y-1.5 mt-3 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>
                            <strong>Target Duration:</strong> {exercise.durationOrReps}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                          <span>
                            <strong>Target Anatomy:</strong> {exercise.targetArea}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            <strong>Suitability:</strong> {exercise.suitableAgeRange}
                          </span>
                        </div>
                      </div>

                      {/* Benefits summary bullets */}
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                          Key Physiological Benefits
                        </p>
                        <ul className="space-y-1">
                          {exercise.benefits.slice(0, 3).map((b, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-purple-400 font-bold shrink-0">✓</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Expandable Inline Video Tutorial Drawer */}
                    {isExpanded && (
                      <div className="border-t border-purple-500/30 bg-[#090C0E] p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Video Player */}
                        <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-white/10 shadow-lg">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube-nocookie.com/embed/${exercise.youtubeVideoId}?rel=0&modestbranding=1`}
                            title={`${exercise.name} video tutorial`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                          <span>
                            Tutorial by: <span className="text-purple-300 font-medium">{exercise.videoChannel}</span>
                          </span>
                          <span className="text-slate-500 text-[11px]">Privacy-Enhanced Embed</span>
                        </div>

                        {/* Step by step instructions */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                            Step-By-Step Execution
                          </h4>
                          <ol className="space-y-2 text-xs text-slate-300">
                            {exercise.stepByStepInstructions.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Safety Precautions */}
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Safety Precautions
                          </h4>
                          <ul className="space-y-1 text-xs text-amber-200/90">
                            {exercise.safetyPrecautions.map((p, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="shrink-0">•</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Quick Action Bar */}
                    <div className="px-5 py-3 bg-[#0A0D10] border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {isExpanded ? 'Viewing full breakdown' : 'Click to watch tutorial & cues'}
                      </span>
                      <button
                        onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                        className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                      >
                        {isExpanded ? 'Close Video' : 'Open Video'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DAILY HEALTHY GROWTH ROUTINE */}
        {activeTab === 'routine' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0D1115] border border-purple-500/20 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Evidence-Based 24-Hour Growth Protocol
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Check off today's growth anchors. Consistency in sleep, sunlight, and Indian nutrition optimizes
                  pulsatile growth hormone signaling.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-purple-300 font-medium">
                  {completedRoutineItems.length} of {DAILY_GROWTH_SCHEDULE.length} Completed Today
                </span>
                <button
                  onClick={() => {
                    setCompletedRoutineItems([]);
                    try {
                      localStorage.removeItem('auramorph_growth_routine_done');
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white border border-white/10 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {DAILY_GROWTH_SCHEDULE.map((item, idx) => {
                const isDone = completedRoutineItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleRoutineItem(item.id)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${
                      isDone
                        ? 'bg-purple-950/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                        : 'bg-[#0D1115] border-white/10 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox Icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRoutineItem(item.id);
                        }}
                        className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition ${
                          isDone
                            ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                            : 'border border-white/20 hover:border-purple-400 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {item.timeWindow}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">Category: {item.category}</span>
                          </div>
                          {item.isTeenagerFocused && (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Crucial For Adolescents
                            </span>
                          )}
                        </div>

                        <h4
                          className={`text-base font-bold ${
                            isDone ? 'text-purple-200 line-through' : 'text-white'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                        {/* Recommended Actions */}
                        <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                          <p className="text-[11px] font-semibold uppercase text-purple-300 tracking-wider">
                            Daily Action Steps:
                          </p>
                          <ul className="space-y-1">
                            {item.recommendedActions.map((act, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Scientific Reason */}
                        <p className="text-[11px] text-slate-400 italic pt-1">
                          <strong className="text-purple-400 not-italic">Scientific Rationale:</strong>{' '}
                          {item.scientificReason}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DAILY DOS & DON'TS */}
        {activeTab === 'dos_donts' && (
          <div className="space-y-8">
            {/* Header intro */}
            <div className="p-5 rounded-2xl bg-[#0D1115] border border-purple-500/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Evidence-Based Guidelines: 7 DOs and 7 DON'Ts
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Protecting adolescent physiology from dangerous fads while instilling life-long musculoskeletal and
                endocrine habits.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 7 DOs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/30">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-emerald-400 uppercase tracking-wider">
                    7 Essential Daily DOs
                  </h4>
                </div>

                <div className="space-y-3">
                  {DAILY_DOS.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#0D1115] border border-emerald-500/20 hover:border-emerald-500/40 transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase">
                          DO #{idx + 1} • {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          {item.evidenceLevel}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{item.title}</h5>
                      <p className="text-xs text-purple-200/90 font-medium">{item.summary}</p>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7 DON'Ts */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-rose-500/30">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                    ✕
                  </div>
                  <h4 className="text-base font-bold text-rose-400 uppercase tracking-wider">
                    7 Critical Daily DON'Ts (Avoid Scams)
                  </h4>
                </div>

                <div className="space-y-3">
                  {DAILY_DONTS.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#0D1115] border border-rose-500/20 hover:border-rose-500/40 transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-rose-400 uppercase">
                          DON'T #{idx + 1} • {item.category}
                        </span>
                        <span className="text-[10px] text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          {item.evidenceLevel}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white">{item.title}</h5>
                      <p className="text-xs text-rose-200/90 font-medium">{item.summary}</p>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HEIGHT TRACKER & PROGRESS */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0D1115] border border-purple-500/25 shadow-md">
                <span className="text-xs text-slate-400 block mb-1">Baseline Height</span>
                <div className="text-2xl font-extrabold text-white">
                  {heightStats.initial}{' '}
                  <span className="text-xs font-normal text-purple-400">cm</span>
                </div>
                <span className="text-[10px] text-slate-500">First recorded stature</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0D1115] border border-purple-500/25 shadow-md">
                <span className="text-xs text-slate-400 block mb-1">Current Stature</span>
                <div className="text-2xl font-extrabold text-white">
                  {heightStats.latest}{' '}
                  <span className="text-xs font-normal text-purple-400">cm</span>
                </div>
                <span className="text-[10px] text-slate-500">Latest measurement</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0D1115] border border-purple-500/25 shadow-md">
                <span className="text-xs text-slate-400 block mb-1">Net Alignment Change</span>
                <div
                  className={`text-2xl font-extrabold ${
                    heightStats.diff >= 0 ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {heightStats.diff >= 0 ? `+${heightStats.diff}` : heightStats.diff}{' '}
                  <span className="text-xs font-normal">cm</span>
                </div>
                <span className="text-[10px] text-slate-500">Posture &amp; natural growth</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0D1115] border border-purple-500/25 shadow-md">
                <span className="text-xs text-slate-400 block mb-1">Target Stature</span>
                <div className="text-2xl font-extrabold text-purple-300">
                  {heightStats.target}{' '}
                  <span className="text-xs font-normal text-slate-400">cm</span>
                </div>
                <span className="text-[10px] text-slate-500">Desired genetic potential</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D1115] border border-white/10">
              <div className="text-xs text-slate-300">
                <strong className="text-purple-300">Measurement Tip:</strong> For the most consistent accuracy, always
                measure first thing in the morning barefoot against a vertical doorframe or wall with a flat ruler.
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                <Plus className="w-4 h-4" />
                Record New Measurement
              </button>
            </div>

            {/* SVG Visual Timeline Graph */}
            <div className="p-6 rounded-2xl bg-[#0D1115] border border-purple-500/25 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    Height Progress Timeline
                  </h4>
                  <p className="text-xs text-slate-400">
                    Tracking periodic stature measurements and diurnal postural variations.
                  </p>
                </div>
                <span className="text-xs text-purple-300 font-medium">
                  {sortedRecords.length} Measurement{sortedRecords.length !== 1 ? 's' : ''} Logged
                </span>
              </div>

              {sortedRecords.length < 2 ? (
                <div className="h-48 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center justify-center p-6 text-center">
                  <Ruler className="w-8 h-8 text-purple-400/50 mb-2" />
                  <p className="text-xs text-slate-300 font-medium">
                    {sortedRecords.length === 1
                      ? '1 measurement recorded. Add periodic measurements over weeks/months to plot your growth graph!'
                      : 'No periodic measurements recorded yet. Log your first measurement above.'}
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-medium transition"
                  >
                    + Add Measurement Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* SVG Chart */}
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[500px] h-64 relative bg-black/30 rounded-xl p-4 border border-white/5">
                      {(() => {
                        const heights = sortedRecords.map((r) => r.heightCm);
                        const minH = Math.min(...heights) - 2;
                        const maxH = Math.max(...heights) + 2;
                        const range = maxH - minH || 1;

                        const points = sortedRecords.map((r, i) => {
                          const x = 50 + (i / (sortedRecords.length - 1)) * 420;
                          const y = 200 - ((r.heightCm - minH) / range) * 160;
                          return { x, y, record: r };
                        });

                        const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

                        return (
                          <svg className="w-full h-full" viewBox="0 0 520 240">
                            {/* Grid lines */}
                            <line x1="40" y1="40" x2="480" y2="40" stroke="#ffffff10" strokeDasharray="3 3" />
                            <line x1="40" y1="120" x2="480" y2="120" stroke="#ffffff10" strokeDasharray="3 3" />
                            <line x1="40" y1="200" x2="480" y2="200" stroke="#ffffff20" />

                            {/* Gradient Area under curve */}
                            <defs>
                              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>

                            {/* Polygon for filled area */}
                            <polygon
                              points={`50,200 ${polylinePoints} ${points[points.length - 1].x},200`}
                              fill="url(#purpleGradient)"
                            />

                            {/* Line */}
                            <polyline
                              fill="none"
                              stroke="#C084FC"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={polylinePoints}
                            />

                            {/* Data points */}
                            {points.map((p, i) => (
                              <g key={i}>
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r="5"
                                  fill="#A855F7"
                                  stroke="#FFFFFF"
                                  strokeWidth="2"
                                />
                                <text
                                  x={p.x}
                                  y={p.y - 10}
                                  fill="#E9D5FF"
                                  fontSize="10"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                >
                                  {p.record.heightCm} cm
                                </text>
                                <text
                                  x={p.x}
                                  y="220"
                                  fill="#94A3B8"
                                  fontSize="9"
                                  textAnchor="middle"
                                >
                                  {p.record.date.slice(5)}
                                </text>
                              </g>
                            ))}
                          </svg>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Measurement Log History Table */}
            <div className="p-6 rounded-2xl bg-[#0D1115] border border-white/10 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Recorded Measurement History
              </h4>

              {sortedRecords.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No measurement logs saved yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="pb-2 font-semibold">Date &amp; Time</th>
                        <th className="pb-2 font-semibold">Stature (cm)</th>
                        <th className="pb-2 font-semibold">Measured By</th>
                        <th className="pb-2 font-semibold">Context / Notes</th>
                        {onDeleteHeightRecord && <th className="pb-2 font-semibold text-right">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sortedRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-white/5 transition">
                          <td className="py-2.5 text-white font-medium">
                            {rec.date} {rec.time ? `• ${rec.time}` : ''}
                          </td>
                          <td className="py-2.5">
                            <span className="font-bold text-purple-300">{rec.heightCm} cm</span>
                            <span className="text-[10px] text-slate-400 ml-1">
                              ({(rec.heightCm / 30.48).toFixed(1)} ft)
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-300">{rec.measuredBy || 'Self'}</td>
                          <td className="py-2.5 text-slate-300 max-w-xs truncate">{rec.notes || '—'}</td>
                          {onDeleteHeightRecord && (
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => onDeleteHeightRecord(rec.id)}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Diurnal Variation Scientific Callout */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-purple-300">Why does height fluctuate daily by 1–2 cm?</span>
              <p className="leading-relaxed">
                During 8 hours of horizontal sleep, your intervertebral discs absorb synovial fluid like sponges (disc
                imbibition). Over the course of standing and walking during the day, axial gravity compresses these 23
                discs, decreasing your standing stature by 1–2 cm by evening. This diurnal fluctuation is completely
                natural and normal!
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: GROWTH PLATE SCIENCE & GENETICS */}
        {activeTab === 'science' && (
          <div className="space-y-8">
            {/* Mid-Parental Height Calculator */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12161C] to-[#0A0D10] border border-purple-500/30 shadow-lg space-y-4">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Mid-Parental Genetic Target Estimator (Tanner Formula)
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Genetics account for roughly 70–80% of final adult stature. Use the clinically recognized Tanner
                  mid-parental formula to calculate your expected genetic target range (±6 cm).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Biological Gender</label>
                  <select
                    value={calculatorGender}
                    onChange={(e) => setCalculatorGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-purple-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Father's Height (cm)</label>
                  <input
                    type="number"
                    value={fatherHeightCm}
                    onChange={(e) => setFatherHeightCm(e.target.value)}
                    min="120"
                    max="240"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mother's Height (cm)</label>
                  <input
                    type="number"
                    value={motherHeightCm}
                    onChange={(e) => setMotherHeightCm(e.target.value)}
                    min="120"
                    max="240"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Calculated Result Box */}
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Mid-Parental Target Range</span>
                  <div className="text-xl font-bold text-white">
                    {midParentalEstimate.min} cm – {midParentalEstimate.max} cm{' '}
                    <span className="text-xs font-normal text-purple-300">
                      (Target Median: {midParentalEstimate.target} cm)
                    </span>
                  </div>
                </div>
                <div className="text-xs text-purple-200 max-w-sm">
                  Healthy nutrition, restorative sleep, and good posture help you land at the top of this natural
                  genetic boundary.
                </div>
              </div>
            </div>

            {/* Scientific breakdown topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GROWTH_PLATE_SCIENCE_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className="p-6 rounded-2xl bg-[#0D1115] border border-white/10 hover:border-purple-500/30 transition space-y-3"
                >
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    {topic.title}
                  </h4>
                  <p className="text-xs text-purple-200 font-semibold">{topic.summary}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{topic.details}</p>

                  {topic.mythBuster && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed">
                      {topic.mythBuster}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 italic pt-1">
                    <strong className="text-purple-400 not-italic">Clinical Mechanism:</strong>{' '}
                    {topic.scientificExplanation}
                  </p>
                </div>
              ))}
            </div>

            {/* Endocrinologist guidance card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-purple-500/25 flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-xl space-y-1">
                <h4 className="text-sm font-bold text-white">When should an adolescent consult a doctor?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If growth velocity slows significantly below 4–5 cm per year during early adolescence, or if pubertal
                  signs do not appear by age 14, a pediatric endocrinologist can evaluate hormonal axes (thyroid, IGF-1,
                  HGH) and perform a simple non-invasive left wrist X-ray to assess bone age.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-xs font-semibold text-white">
                <ShieldAlert className="w-4 h-4 text-purple-300" />
                Certified Medical Standards
              </div>
            </div>
          </div>
        )}

        {/* Modal: Record New Height Measurement */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-2xl bg-[#0E1216] border border-purple-500/40 p-6 shadow-[0_0_50px_rgba(168,85,247,0.25)] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-purple-400" />
                  Record Height Measurement
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveHeightRecord} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Height (cm) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="80"
                    max="260"
                    required
                    value={newHeightCm}
                    onChange={(e) => setNewHeightCm(e.target.value)}
                    placeholder="e.g. 172.5"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:border-purple-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Approx: {(parseFloat(newHeightCm || '0') / 30.48).toFixed(1)} feet
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Measurement Date *</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Time of Day</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Measured By</label>
                  <select
                    value={newMeasuredBy}
                    onChange={(e) =>
                      setNewMeasuredBy(e.target.value as 'Self' | 'Parent / Guardian' | 'Doctor / Clinic')
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-purple-500 outline-none"
                  >
                    <option value="Self">Self (Wall &amp; Ruler)</option>
                    <option value="Parent / Guardian">Parent / Guardian (Assisted)</option>
                    <option value="Doctor / Clinic">Doctor / Clinic (Stadiometer)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Notes / Context (Optional)</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Morning measurement barefoot against flat wall"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Measurement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer Aarav Jakhar Brand Signature */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400">
            AURAMORPH &bull; Transform Your Habits. Elevate Your Potential.
          </p>
          <p className="text-[11px] text-purple-300 font-mono tracking-wider mt-1">
            MADE BY AARAV JAKHAR (
            <a
              href="https://www.instagram.com/dr.monomaniac/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline font-semibold transition"
            >
              @dr.monomaniac
            </a>
            )
          </p>
        </div>
      </div>
    </div>
  );
};
