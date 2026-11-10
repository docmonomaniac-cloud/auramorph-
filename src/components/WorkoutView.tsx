import React, { useState } from 'react';
import { Exercise, WorkoutSession } from '../types/fitness';
import { ProgressionBar } from './ProgressionBar';
import { MetricChip } from './MetricChip';
import { ExerciseVideoModal } from './ExerciseVideoModal';
import { Play, Plus, Check, Clock, Calculator, Dumbbell, Award, ArrowRight, Tv, Video, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTimerBeep } from '../utils/audio';

interface WorkoutViewProps {
  workout: WorkoutSession;
  allWorkouts?: WorkoutSession[];
  onSelectWorkoutSession?: (session: WorkoutSession) => void;
  onUpdateWorkout: (updated: WorkoutSession) => void;
  onOpenRestTimer: (seconds: number) => void;
  onOpen1RMCalc: (weight: number, reps: number) => void;
  onCompleteWorkout: () => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  workout,
  allWorkouts,
  onSelectWorkoutSession,
  onUpdateWorkout,
  onOpenRestTimer,
  onOpen1RMCalc,
  onCompleteWorkout,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<'gym' | 'home'>((workout.location as 'gym' | 'home') || 'gym');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [selectedTutorialExercise, setSelectedTutorialExercise] = useState<Exercise | null>(null);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExCategory, setNewExCategory] = useState<'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core'>('Chest');
  const [newExMuscle, setNewExMuscle] = useState('');

  // Keep location in sync when workout changes from external nav
  React.useEffect(() => {
    if (workout.location) {
      setSelectedLocation(workout.location);
    }
  }, [workout.id, workout.location]);

  const currentExercise: Exercise | undefined = workout.exercises[activeExerciseIndex];

  // Calculate workout completion statistics
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercentage = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  // Calculate live volume lifted (kg)
  const currentLiftedVolume = workout.exercises.reduce((acc, ex) => {
    return (
      acc +
      ex.sets
        .filter((s) => s.completed)
        .reduce((sAcc, s) => sAcc + s.actualWeightKg * s.actualReps, 0)
    );
  }, 0);

  const handleToggleSet = (setIndex: number) => {
    if (!currentExercise) return;
    const isNowCompleted = !currentExercise.sets[setIndex].completed;

    const updatedExercises = workout.exercises.map((ex, exIdx) => {
      if (exIdx !== activeExerciseIndex) return ex;
      const updatedSets = ex.sets.map((s, sIdx) => {
        if (sIdx !== setIndex) return s;
        return { ...s, completed: isNowCompleted };
      });
      return { ...ex, sets: updatedSets };
    });

    const updatedWorkout: WorkoutSession = {
      ...workout,
      exercises: updatedExercises,
      status: 'in_progress',
    };
    onUpdateWorkout(updatedWorkout);

    if (isNowCompleted) {
      playTimerBeep('click');
      // Automatically prompt or start rest timer
      onOpenRestTimer(currentExercise.restTimeSeconds || 90);

      // Check if all sets of current exercise are completed
      const allSetsDone = updatedExercises[activeExerciseIndex].sets.every((s) => s.completed);
      if (allSetsDone) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#A3E635', '#10B981', '#4ADE80', '#ffffff'],
        });
      }
    }
  };

  const handleUpdateWeight = (setIndex: number, delta: number) => {
    if (!currentExercise) return;
    const updatedExercises = workout.exercises.map((ex, exIdx) => {
      if (exIdx !== activeExerciseIndex) return ex;
      const updatedSets = ex.sets.map((s, sIdx) => {
        if (sIdx !== setIndex) return s;
        const newWeight = Math.max(0, Math.round((s.actualWeightKg + delta) * 10) / 10);
        return { ...s, actualWeightKg: newWeight };
      });
      return { ...ex, sets: updatedSets };
    });
    onUpdateWorkout({ ...workout, exercises: updatedExercises });
  };

  const handleUpdateReps = (setIndex: number, delta: number) => {
    if (!currentExercise) return;
    const updatedExercises = workout.exercises.map((ex, exIdx) => {
      if (exIdx !== activeExerciseIndex) return ex;
      const updatedSets = ex.sets.map((s, sIdx) => {
        if (sIdx !== setIndex) return s;
        const newReps = Math.max(1, s.actualReps + delta);
        return { ...s, actualReps: newReps };
      });
      return { ...ex, sets: updatedSets };
    });
    onUpdateWorkout({ ...workout, exercises: updatedExercises });
  };

  const handleAddSet = () => {
    if (!currentExercise) return;
    const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
    const newSetNumber = currentExercise.sets.length + 1;
    const newSet = {
      id: `s-${Date.now()}`,
      setNumber: newSetNumber,
      previousWeightKg: lastSet ? lastSet.actualWeightKg : 50,
      previousReps: lastSet ? lastSet.actualReps : 10,
      targetWeightKg: lastSet ? lastSet.actualWeightKg : 50,
      targetReps: lastSet ? lastSet.actualReps : 10,
      actualWeightKg: lastSet ? lastSet.actualWeightKg : 50,
      actualReps: lastSet ? lastSet.actualReps : 10,
      completed: false,
    };

    const updatedExercises = workout.exercises.map((ex, exIdx) => {
      if (exIdx !== activeExerciseIndex) return ex;
      return { ...ex, sets: [...ex.sets, newSet] };
    });

    onUpdateWorkout({ ...workout, exercises: updatedExercises });
  };

  const handleAddNewExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newEx: Exercise = {
      id: `ex-${Date.now()}`,
      name: newExName.trim(),
      category: newExCategory,
      targetMuscle: newExMuscle.trim() || 'Target Muscle Group',
      equipment: 'Gym Apparatus',
      restTimeSeconds: 90,
      tutorial: {
        youtubeId: 'rT7DgCr-3pg',
        videoDurationSeconds: 150,
        tempo: '3-0-1-0',
        primaryCue: `Maintain strict spinal alignment, full range of motion, and eccentric control for ${newExMuscle || newExName}.`,
        breathingPattern: 'Inhale and brace on descent; exhale forcefully on peak concentric contraction.',
        barPathDescription: 'Controlled planar trajectory with consistent muscular tension.',
        biomechanicalCheckpoints: [
          'Stabilize core and maintain neutral spinal alignment throughout the set.',
          'Execute a controlled 3-second eccentric negative to maximize hypertrophic tension.',
          'Avoid joint bouncing or using torso momentum to shift the load.',
        ],
        commonMistakes: [
          'Compensating with secondary muscle groups due to excessive load.',
          'Shortening range of motion at bottom stretch.',
        ],
        musclesWorked: [
          { name: newExMuscle || 'Prime Mover', activationLevel: 92 },
          { name: 'Secondary Stabilizers', activationLevel: 68 },
        ],
        phases: [
          { phase: '01', name: 'Setup & Grip', startPct: 0, endPct: 25, coachCue: 'Establish firm footing and engage core brace.', muscleEngagement: 'Core' },
          { phase: '02', name: 'Eccentric Negative', startPct: 25, endPct: 60, coachCue: 'Lower steadily under active muscular tension.', muscleEngagement: 'Prime Mover (stretched)' },
          { phase: '03', name: 'Peak Drive', startPct: 60, endPct: 100, coachCue: 'Drive through full range of motion without momentum.', muscleEngagement: 'Prime Mover (contracted)' },
        ],
      },
      sets: [
        { id: `s-${Date.now()}-1`, setNumber: 1, previousWeightKg: 40, previousReps: 10, targetWeightKg: 40, targetReps: 10, actualWeightKg: 40, actualReps: 10, completed: false },
        { id: `s-${Date.now()}-2`, setNumber: 2, previousWeightKg: 40, previousReps: 10, targetWeightKg: 45, targetReps: 10, actualWeightKg: 45, actualReps: 10, completed: false },
        { id: `s-${Date.now()}-3`, setNumber: 3, previousWeightKg: 45, previousReps: 8, targetWeightKg: 50, targetReps: 8, actualWeightKg: 50, actualReps: 8, completed: false },
      ],
    };

    onUpdateWorkout({
      ...workout,
      exercises: [...workout.exercises, newEx],
    });
    setActiveExerciseIndex(workout.exercises.length);
    setNewExName('');
    setNewExMuscle('');
    setShowAddExerciseModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Location Selector (Gym vs Home) and Split Tabs */}
      {allWorkouts && allWorkouts.length > 0 && onSelectWorkoutSession && (
        <div className="bg-[#111618] border border-[#10B981]/25 rounded-2xl p-3 sm:p-4 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#10B981]/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-pulse" />
              <span className="font-mono text-xs uppercase text-[#A3E635] font-bold tracking-wider">
                Workout Environment & Mode:
              </span>
              <a
                href="https://www.instagram.com/dr.monomaniac/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded bg-[#182022] hover:bg-[#202b2e] border border-[#A3E635]/40 hover:border-[#A3E635] text-[10px] font-mono text-[#A3E635] font-bold inline-flex items-center gap-1 transition-all"
              >
                <span>MADE BY AARAV JAKHAR</span>
                <span className="text-[9px] text-[#4ADE80]">(@dr.monomaniac)</span>
              </a>
            </div>

            {/* Gym vs Home Mode Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20">
              <button
                onClick={() => {
                  setSelectedLocation('gym');
                  const firstGym = allWorkouts.find(w => w.location === 'gym' || !w.location);
                  if (firstGym && firstGym.id !== workout.id) {
                    onSelectWorkoutSession(firstGym);
                    setActiveExerciseIndex(0);
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all ${
                  selectedLocation === 'gym'
                    ? 'bg-[#A3E635] text-[#0A0D0E] shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>🏋️ Gym Workouts</span>
              </button>

              <button
                onClick={() => {
                  setSelectedLocation('home');
                  const firstHome = allWorkouts.find(w => w.location === 'home');
                  if (firstHome && firstHome.id !== workout.id) {
                    onSelectWorkoutSession(firstHome);
                    setActiveExerciseIndex(0);
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all ${
                  selectedLocation === 'home'
                    ? 'bg-[#A3E635] text-[#0A0D0E] shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>🏠 Home Workouts</span>
              </button>
            </div>
          </div>

          {/* Routine Switcher under selected mode */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-mono text-[#94A3B8]">
              {selectedLocation === 'gym' ? 'Select Gym PPL Routine:' : 'Select Home Calisthenics Routine:'}
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {allWorkouts
                .filter((w) => (w.location || 'gym') === selectedLocation)
                .map((w) => {
                  const isCurrent = w.id === workout.id;
                  const completedCount = w.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
                  const totalCount = w.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        onSelectWorkoutSession(w);
                        setActiveExerciseIndex(0);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-all ${
                        isCurrent
                          ? 'bg-[#A3E635] text-[#0A0D0E] font-bold shadow-[0_0_12px_rgba(163,230,53,0.35)]'
                          : 'bg-[#182022] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#20292c] border border-[#10B981]/15'
                      }`}
                    >
                      <Video className={`w-3 h-3 ${isCurrent ? 'text-[#0A0D0E]' : 'text-[#A3E635]'}`} />
                      <span>{w.title.split(':')[0]}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isCurrent ? 'bg-[#0A0D0E]/20 text-[#0A0D0E]' : 'bg-[#111618] text-[#64748B]'}`}>
                        {completedCount}/{totalCount} sets
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Active Workout Session Banner */}
      <div className="telemetry-card rounded-2xl p-5 sm:p-6 bg-[#111618]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium text-[#A3E635] uppercase tracking-wider">
                Active Hypertrophy Protocol
              </span>
              <span className="text-xs text-[#64748B]">·</span>
              <span className="text-xs text-[#94A3B8]">{workout.category}</span>
              <span className="text-xs text-[#64748B]">·</span>
              <a
                href="https://www.instagram.com/dr.monomaniac/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded bg-[#182022] hover:bg-[#202b2e] border border-[#A3E635]/40 hover:border-[#A3E635] text-[10px] font-mono text-[#A3E635] font-semibold inline-flex items-center gap-1 transition-all"
              >
                <span>MADE BY AARAV JAKHAR</span>
                <span className="text-[9px] text-[#4ADE80]">(@dr.monomaniac)</span>
              </a>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              {workout.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">{workout.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenRestTimer(currentExercise?.restTimeSeconds || 90)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#182022] border border-[#10B981]/30 text-xs sm:text-sm text-[#F8FAFC] hover:border-[#A3E635] hover:text-[#A3E635] transition-all"
            >
              <Clock className="w-4 h-4 text-[#A3E635]" />
              <span>Rest Stopwatch ({currentExercise?.restTimeSeconds || 90}s)</span>
            </button>

            <button
              onClick={() => onOpen1RMCalc(currentExercise?.sets[0]?.actualWeightKg || 80, currentExercise?.sets[0]?.actualReps || 8)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#182022] border border-[#10B981]/30 text-xs sm:text-sm text-[#F8FAFC] hover:border-[#A3E635] hover:text-[#A3E635] transition-all"
            >
              <Calculator className="w-4 h-4 text-[#4ADE80]" />
              <span>1RM Estimator</span>
            </button>

            <button
              onClick={onCompleteWorkout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs sm:text-sm glow-lime hover:scale-[1.02] transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Finish Workout</span>
            </button>
          </div>
        </div>

        {/* Workout Progression Bar per design specification */}
        <div className="space-y-1.5 pt-2">
          <ProgressionBar
            progressPercentage={progressPercentage}
            label="Workout Progression"
            currentValue={`${completedSets} Sets`}
            targetValue={`${totalSets} Total Sets (${Math.round(progressPercentage)}%)`}
            heightClass="h-3"
            showPulseHead={true}
          />
        </div>

        {/* Live Telemetry Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#10B981]/15">
          <MetricChip
            label="Volume Lifted"
            value={currentLiftedVolume.toLocaleString()}
            unit="KG"
            dotColor="#A3E635"
          />
          <MetricChip
            label="Active Duration"
            value="42"
            unit="MIN"
            dotColor="#10B981"
          />
          <MetricChip
            label="Caloric Expenditure"
            value={Math.round(280 + currentLiftedVolume * 0.02)}
            unit="KCAL"
            dotColor="#4ADE80"
          />
          <MetricChip
            label="Intensity Rating"
            value="RPE 8.5"
            subLabel="Optimal"
            dotColor="#A3E635"
          />
        </div>
      </div>

      {/* Main Grid: Exercise Navigator (Left) + Active Sets Logger (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Exercise Navigator */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-[#F8FAFC]">
              Exercise Routine ({workout.exercises.length})
            </h3>
            <button
              onClick={() => setShowAddExerciseModal(true)}
              className="flex items-center gap-1 text-xs text-[#A3E635] hover:underline font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exercise</span>
            </button>
          </div>

          <div className="space-y-2">
            {workout.exercises.map((ex, idx) => {
              const isActive = idx === activeExerciseIndex;
              const completedCount = ex.sets.filter((s) => s.completed).length;
              const isAllDone = completedCount === ex.sets.length && ex.sets.length > 0;

              return (
                <button
                  key={ex.id}
                  onClick={() => setActiveExerciseIndex(idx)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                    isActive
                      ? 'bg-[#182022] border-[#A3E635]/60 shadow-[0_0_20px_-5px_rgba(163,230,53,0.2)]'
                      : 'bg-[#111618] border-[#10B981]/15 hover:border-[#10B981]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono text-[#64748B]">
                          0{idx + 1}.
                        </span>
                        <span className="text-xs text-[#A3E635] font-medium truncate">
                          {ex.targetMuscle}
                        </span>
                      </div>
                      <div className="font-display font-semibold text-sm text-[#F8FAFC] truncate">
                        {ex.name}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 pt-1">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTutorialExercise(ex);
                        }}
                        className="p-1 rounded bg-[#182022] hover:bg-[#A3E635] hover:text-[#0A0D0E] text-[#A3E635] border border-[#10B981]/25 transition-all inline-flex items-center justify-center"
                        title="Watch Video Tutorial"
                      >
                        <Tv className="w-3.5 h-3.5" />
                      </span>

                      {isAllDone ? (
                        <div className="w-5 h-5 rounded-md bg-[#A3E635] flex items-center justify-center text-[#0A0D0E]">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-[#94A3B8]">
                          {completedCount}/{ex.sets.length}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Exercise & Sets Detail */}
        <div className="lg:col-span-8 space-y-4">
          {currentExercise ? (
            <div className="glass-panel-elevated rounded-2xl p-5 sm:p-6 border border-[#10B981]/30">
              
              {/* Exercise Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10B981]/15 gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-1">
                    <span className="text-[#A3E635] font-medium">{currentExercise.category}</span>
                    <span>·</span>
                    <span>{currentExercise.equipment}</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                    {currentExercise.name}
                  </h2>
                  {currentExercise.notes && (
                    <p className="text-xs text-[#94A3B8] mt-1 italic">
                      💡 {currentExercise.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedTutorialExercise(currentExercise)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs glow-lime hover:scale-[1.02] transition-all"
                    title="Watch Biomechanical Video Tutorial & Movement Phases"
                  >
                    <Video className="w-3.5 h-3.5 fill-current" />
                    <span>Video Tutorial</span>
                  </button>

                  <button
                    onClick={() => onOpenRestTimer(currentExercise.restTimeSeconds)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111618] border border-[#10B981]/20 text-xs text-[#94A3B8] hover:text-[#A3E635] transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#A3E635]" />
                    <span>{currentExercise.restTimeSeconds}s Rest</span>
                  </button>
                </div>
              </div>

              {/* Sets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#10B981]/15 text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
                      <th className="py-2.5 px-2">Set</th>
                      <th className="py-2.5 px-2">Previous</th>
                      <th className="py-2.5 px-2">Weight (KG)</th>
                      <th className="py-2.5 px-2">Reps</th>
                      <th className="py-2.5 px-2 text-center">Complete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#10B981]/10">
                    {currentExercise.sets.map((set, sIdx) => {
                      return (
                        <tr
                          key={set.id}
                          className={`transition-colors ${
                            set.completed ? 'bg-[#182022]/40' : 'hover:bg-[#182022]/20'
                          }`}
                        >
                          {/* Set number */}
                          <td className="py-3 px-2 font-display font-semibold text-[#F8FAFC]">
                            <span className="w-6 h-6 rounded-md bg-[#111618] border border-[#10B981]/20 inline-flex items-center justify-center font-mono text-xs text-[#A3E635]">
                              {set.setNumber}
                            </span>
                          </td>

                          {/* Previous */}
                          <td className="py-3 px-2 font-mono text-xs text-[#64748B]">
                            {set.previousWeightKg}kg × {set.previousReps}
                          </td>

                          {/* Weight input with micro-controls */}
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateWeight(sIdx, -2.5)}
                                className="w-6 h-6 rounded bg-[#111618] border border-[#10B981]/20 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#A3E635] flex items-center justify-center text-xs font-mono"
                              >
                                -
                              </button>
                              <div className="px-2.5 py-1 rounded bg-[#111618] border border-[#10B981]/30 font-display font-bold text-sm text-[#F8FAFC] tabular-nums min-w-[54px] text-center">
                                {set.actualWeightKg}
                              </div>
                              <button
                                onClick={() => handleUpdateWeight(sIdx, 2.5)}
                                className="w-6 h-6 rounded bg-[#111618] border border-[#10B981]/20 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#A3E635] flex items-center justify-center text-xs font-mono"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Reps input */}
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateReps(sIdx, -1)}
                                className="w-6 h-6 rounded bg-[#111618] border border-[#10B981]/20 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#A3E635] flex items-center justify-center text-xs font-mono"
                              >
                                -
                              </button>
                              <div className="px-2.5 py-1 rounded bg-[#111618] border border-[#10B981]/30 font-display font-bold text-sm text-[#F8FAFC] tabular-nums min-w-[44px] text-center">
                                {set.actualReps}
                              </div>
                              <button
                                onClick={() => handleUpdateReps(sIdx, 1)}
                                className="w-6 h-6 rounded bg-[#111618] border border-[#10B981]/20 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#A3E635] flex items-center justify-center text-xs font-mono"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Custom Checkbox per design spec: 
                              "Custom rounded squares (6px) with an unchecked border of #64748B. 
                              Checked state fills with #A3E635 and displays a #0A0D0E checkmark." */}
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => handleToggleSet(sIdx)}
                              className={`w-7 h-7 rounded-[6px] transition-all flex items-center justify-center mx-auto focus:outline-none ${
                                set.completed
                                  ? 'bg-[#A3E635] text-[#0A0D0E] shadow-[0_0_12px_rgba(163,230,53,0.4)]'
                                  : 'border-2 border-[#64748B] hover:border-[#A3E635] bg-transparent'
                              }`}
                              title={set.completed ? 'Set completed' : 'Mark set as completed'}
                            >
                              {set.completed && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Set Actions & Next Exercise */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t border-[#10B981]/15">
                <button
                  onClick={handleAddSet}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#111618] border border-[#10B981]/20 text-xs font-medium text-[#F8FAFC] hover:border-[#A3E635] hover:text-[#A3E635] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Set {currentExercise.sets.length + 1}</span>
                </button>

                {activeExerciseIndex < workout.exercises.length - 1 && (
                  <button
                    onClick={() => setActiveExerciseIndex(activeExerciseIndex + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#182022] border border-[#10B981]/30 text-xs font-display font-semibold text-[#A3E635] hover:bg-[#A3E635] hover:text-[#0A0D0E] transition-all"
                  >
                    <span>Next: {workout.exercises[activeExerciseIndex + 1].name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="telemetry-card rounded-2xl p-12 text-center bg-[#111618]">
              <Dumbbell className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
              <h3 className="font-display font-semibold text-lg text-[#F8FAFC]">
                No Exercise Selected
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
                Select an exercise from the left navigation or add a new custom movement.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Add Custom Exercise Modal */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleAddNewExercise}
            className="w-full max-w-md rounded-2xl glass-panel-elevated p-6 border border-[#10B981]/30 shadow-2xl"
          >
            <h3 className="font-display font-bold text-lg text-[#F8FAFC] mb-4">
              Add New Exercise to Protocol
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Exercise Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Incline Cable Flye"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  required
                  className="w-full bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Target Muscle Group
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lower Pectoralis / Serratus"
                  value={newExMuscle}
                  onChange={(e) => setNewExMuscle(e.target.value)}
                  className="w-full bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Category
                </label>
                <select
                  value={newExCategory}
                  onChange={(e) => setNewExCategory(e.target.value as typeof newExCategory)}
                  className="w-full bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#A3E635]"
                >
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Legs">Legs</option>
                  <option value="Arms">Arms</option>
                  <option value="Core">Core</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAddExerciseModal(false)}
                className="flex-1 py-2 rounded-lg bg-[#111618] border border-[#10B981]/20 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs glow-lime hover:scale-[1.01]"
              >
                Add Exercise
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Biomechanical Video Tutorial & Form Lab Modal */}
      <ExerciseVideoModal
        exercise={selectedTutorialExercise}
        isOpen={!!selectedTutorialExercise}
        onClose={() => setSelectedTutorialExercise(null)}
      />

    </div>
  );
};
