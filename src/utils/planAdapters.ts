import { PersonalPlan, UserProfile } from '../types/user';
import { MealCategory, WorkoutSession, Exercise } from '../types/fitness';
import {
  PUSH_EXERCISES,
  PULL_EXERCISES,
  LEGS_EXERCISES,
  HOME_PUSH_EXERCISES,
  HOME_PULL_EXERCISES,
  HOME_LEGS_EXERCISES,
  INITIAL_MEAL_CATEGORIES,
  WORKOUT_SESSIONS,
} from '../data/initialData';

const ALL_REFERENCE_EXERCISES: Exercise[] = [
  ...PUSH_EXERCISES,
  ...PULL_EXERCISES,
  ...LEGS_EXERCISES,
  ...HOME_PUSH_EXERCISES,
  ...HOME_PULL_EXERCISES,
  ...HOME_LEGS_EXERCISES,
];

/**
 * Transforms an AI-generated PersonalPlan into dynamic MealCategory arrays
 * for live display in NutritionView and DashboardView.
 */
export function adaptAiPlanToMealCategories(plan: PersonalPlan | null | undefined): MealCategory[] {
  if (!plan?.dietPlan?.meals || plan.dietPlan.meals.length === 0) {
    return INITIAL_MEAL_CATEGORIES;
  }

  return plan.dietPlan.meals.map((meal, idx) => {
    const mealId = `meal-${idx}-${meal.mealName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    return {
      id: mealId,
      name: meal.mealName,
      timeLabel: meal.time || `${8 + idx * 3}:00 AM`,
      items: (meal.items || []).map((item, itemIdx) => {
        const cal = Number(item.calories) || 200;
        const protein = Number(item.proteinG) || 15;
        // Balance approximate macros from total calories
        const remainingCals = Math.max(0, cal - protein * 4);
        const fat = Math.round(((remainingCals * 0.25) / 9) * 10) / 10;
        const carbs = Math.round((Math.max(0, remainingCals - fat * 9) / 4) * 10) / 10;

        return {
          id: `item-${idx}-${itemIdx}`,
          foodId: `food-${idx}-${itemIdx}`,
          name: item.name + (item.quantity ? ` (${item.quantity})` : ''),
          servings: 1,
          portionGrams: 100,
          calories: Math.round(cal),
          protein: Math.round(protein * 10) / 10,
          carbs,
          fat,
        };
      }),
    };
  });
}

/**
 * Transforms an AI-generated PersonalPlan into dynamic WorkoutSession arrays
 * with video tutorials, sets, reps, and form cues for WorkoutView and DashboardView.
 */
export function adaptAiPlanToWorkoutSessions(
  plan: PersonalPlan | null | undefined,
  profile?: UserProfile
): WorkoutSession[] {
  if (!plan?.workoutPlan?.sessions || plan.workoutPlan.sessions.length === 0) {
    return WORKOUT_SESSIONS;
  }

  return plan.workoutPlan.sessions.map((session, sIdx) => {
    const isHome =
      profile?.equipment === 'No equipment' ||
      session.category?.toLowerCase().includes('home') ||
      session.title?.toLowerCase().includes('home');
    const sessionId = session.id || `session-${sIdx}`;

    const exercises: Exercise[] = (session.exercises || []).map((ex, exIdx) => {
      // Find matching tutorial from our curated exercise library
      const matched = ALL_REFERENCE_EXERCISES.find(
        (e) =>
          e.name.toLowerCase().includes(ex.name.toLowerCase()) ||
          ex.name.toLowerCase().includes(e.name.toLowerCase())
      );

      const targetSetsCount = typeof ex.sets === 'number' && ex.sets > 0 ? ex.sets : 3;

      let defaultReps = 10;
      if (typeof ex.reps === 'string') {
        const nums = ex.reps.match(/\d+/g);
        if (nums && nums.length > 0) {
          defaultReps = Math.round(nums.reduce((a, b) => a + Number(b), 0) / nums.length);
        }
      }

      const sets = Array.from({ length: targetSetsCount }, (_, setIdx) => ({
        id: `${sessionId}-ex${exIdx}-s${setIdx + 1}`,
        setNumber: setIdx + 1,
        previousWeightKg: isHome ? 0 : 20,
        previousReps: defaultReps,
        targetWeightKg: isHome ? 0 : 25,
        targetReps: defaultReps,
        actualWeightKg: isHome ? 0 : 25,
        actualReps: defaultReps,
        completed: setIdx === 0,
      }));

      // Infer exercise category
      let category: 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core' = 'Chest';
      const m = (ex.targetMuscle || '').toLowerCase() + ' ' + (ex.name || '').toLowerCase();
      if (m.includes('back') || m.includes('lat') || m.includes('rhomboid') || m.includes('row')) {
        category = 'Back';
      } else if (m.includes('shoulder') || m.includes('delt') || m.includes('press') || m.includes('overhead')) {
        category = 'Shoulders';
      } else if (m.includes('leg') || m.includes('quad') || m.includes('hamstring') || m.includes('glute') || m.includes('squat')) {
        category = 'Legs';
      } else if (m.includes('bicep') || m.includes('tricep') || m.includes('arm') || m.includes('curl') || m.includes('dip')) {
        category = 'Arms';
      } else if (m.includes('core') || m.includes('abs') || m.includes('plank')) {
        category = 'Core';
      }

      return {
        id: `ex-${sessionId}-${exIdx}`,
        name: ex.name,
        targetMuscle: ex.targetMuscle || 'Target Muscle Group',
        category,
        equipment: ex.equipment || profile?.equipment || 'Bodyweight / Dumbbells',
        notes: `${ex.formCues || 'Maintain continuous muscular tension'} · Alt: ${ex.beginnerAlternative || 'Standard variation'}`,
        restTimeSeconds: ex.restSeconds || 90,
        sets,
        tutorial: matched?.tutorial || {
          youtubeId: isHome ? 'IODxDxX7oi4' : 'rT7DgCr-3pg',
          videoDurationSeconds: 150,
          tempo: '3-0-1-0',
          primaryCue: ex.formCues || 'Control the 3-second eccentric phase and explode through sticking point.',
          breathingPattern: 'Inhale during negative lowering; exhale forcefully through exertion.',
          barPathDescription: 'Vertical and curvilinear kinetic line aligned with muscle fiber orientation.',
          biomechanicalCheckpoints: [
            ex.formCues || 'Maintain stacked joints and spinal neutral posture.',
            `Alternative: ${ex.beginnerAlternative || 'Perform controlled tempo variation.'}`,
            'Anchor core and prevent ballistic momentum.',
          ],
          commonMistakes: [
            'Using ballistic momentum rather than muscular tension.',
            'Shortening the full active range of motion.',
          ],
          musclesWorked: [
            { name: ex.targetMuscle || 'Target Muscle Group', activationLevel: 95 },
            { name: 'Core Stabilizers', activationLevel: 75 },
          ],
          phases: [
            { phase: '01', name: 'Kinetic Setup', startPct: 0, endPct: 20, coachCue: 'Establish stable base of support.', muscleEngagement: 'Core & Scapulae' },
            { phase: '02', name: 'Eccentric Negative', startPct: 20, endPct: 55, coachCue: 'Lower in 3 seconds resisting gravity.', muscleEngagement: ex.targetMuscle || 'Target Muscle' },
            { phase: '03', name: 'Stretch Reversal', startPct: 55, endPct: 70, coachCue: 'Pause briefly at full active elongation.', muscleEngagement: 'Tension Reversal' },
            { phase: '04', name: 'Concentric Drive', startPct: 70, endPct: 100, coachCue: 'Drive upward with explosive intent.', muscleEngagement: ex.targetMuscle || 'Target Muscle' },
          ],
        },
      };
    });

    return {
      id: sessionId,
      title: session.title,
      subtitle: `${session.day} · ${session.category} · ${session.durationMinutes || 45} mins`,
      category: session.category || 'Target Training',
      location: isHome ? ('home' as const) : ('gym' as const),
      durationMinutes: session.durationMinutes || 45,
      estimatedCalories: Math.round((session.durationMinutes || 45) * 6.5),
      totalVolumeKg: isHome ? 0 : 3400,
      exercises: exercises.length > 0 ? exercises : PUSH_EXERCISES,
      status: 'scheduled' as const,
    };
  });
}
