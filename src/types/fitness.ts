export interface ExerciseSet {
  id: string;
  setNumber: number;
  previousWeightKg: number;
  previousReps: number;
  targetWeightKg: number;
  targetReps: number;
  actualWeightKg: number;
  actualReps: number;
  completed: boolean;
  isWarmup?: boolean;
}

export interface VideoChapter {
  timeSeconds: number;
  title: string;
  cue: string;
}

export interface MovementPhase {
  phase: string;
  name: string;
  startPct: number;
  endPct: number;
  coachCue: string;
  muscleEngagement: string;
}

export interface ExerciseTutorial {
  youtubeId?: string;
  videoDurationSeconds: number;
  tempo: string; // e.g. "3-1-1-0"
  primaryCue: string;
  breathingPattern: string;
  biomechanicalCheckpoints: string[];
  commonMistakes: string[];
  phases: MovementPhase[];
  barPathDescription: string;
  musclesWorked: { name: string; activationLevel: number }[];
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  category: 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core';
  equipment: string;
  notes?: string;
  sets: ExerciseSet[];
  restTimeSeconds: number;
  tutorial?: ExerciseTutorial;
}

export interface WorkoutSession {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location?: 'gym' | 'home';
  durationMinutes: number;
  estimatedCalories: number;
  totalVolumeKg: number;
  exercises: Exercise[];
  status: 'scheduled' | 'in_progress' | 'completed';
}

export interface NutritionItem {
  id: string;
  name: string;
  hindiName?: string;
  servingSize: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: 'Vegetarian High-Protein' | 'Dairy & Soya' | 'Lentils & Pulses' | 'Non-Veg Protein' | 'Grains & Carbs' | 'Healthy Fats' | 'Beverages';
  isVegetarian: boolean;
  highlight?: string;
}

export interface LoggedMealItem {
  id: string;
  foodId: string;
  name: string;
  servings: number;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealCategory {
  id: string;
  name: string;
  timeLabel: string;
  items: LoggedMealItem[];
}

export interface CoachMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  tags?: string[];
  actionRecommendation?: {
    type: 'macro_adjustment' | 'add_exercise' | 'recovery_protocol';
    title: string;
    description: string;
    applied?: boolean;
  };
}

export interface BiometricEntry {
  date: string;
  dayLabel: string;
  weightKg: number;
  bodyFatPct: number;
  sleepHours: number;
  restingHeartRate: number;
  recoveryScore: number;
  volumeTonnageKg: number;
}
