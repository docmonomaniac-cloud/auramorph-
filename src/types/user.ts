import { HeightRecord } from './growth';

export type DietaryPreference = 'Vegetarian' | 'Eggetarian' | 'Non-vegetarian' | 'Vegan';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type EquipmentLevel = 'No equipment' | 'Dumbbells' | 'Resistance bands' | 'Full gym access';

export type FitnessGoal =
  | 'Healthy Weight Management'
  | 'Muscle Building'
  | 'Strength Development'
  | 'Improving Fitness'
  | 'General Health and Wellness';

export type BudgetTier = 'Budget Friendly (₹120–250/day)' | 'Balanced (₹250–450/day)' | 'Flexible (₹450+/day)';

export interface LocalFoodItem {
  id: string;
  name: string;
  localName?: string;
  serving: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  category: string;
  affordabilityScore: 'Low Cost' | 'Moderate' | 'Premium';
  regionReason: string;
}

export interface LocalDietRecommendation {
  region: string;
  staples: string[];
  recommendedFoods: LocalFoodItem[];
  sampleMealPlan: {
    mealName: string;
    items: string[];
    approxCalories: number;
    proteinG: number;
  }[];
  localShoppingTips: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  age: number;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  
  // Location
  country: string;
  state: string;
  city: string;
  locality?: string;
  isLocationSkipped?: boolean;

  // Body Measurements
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft';
  currentWeightKg: number;
  targetWeightKg: number;
  currentHeightCm: number;
  desiredHeightCm: number;
  heightRecords?: HeightRecord[];

  // Goals & Training
  primaryGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  equipment: EquipmentLevel;

  // Nutrition Preferences
  dietaryPreference: DietaryPreference;
  allergies: string[];
  dislikedFoods: string[];
  dailyBudget: BudgetTier;
  mealsPerDay: number;
  regularFoods: string[];

  // Generated Plan & Metrics
  dailyCalorieTarget: number;
  dailyProteinTargetG: number;
  dailyCarbsTargetG: number;
  dailyFatTargetG: number;
  dailyHydrationTargetMl: number;
  dailyMovementTargetKcal: number;
  
  // Localized Recommendations
  localDiet: LocalDietRecommendation;

  // Onboarding status & Pathway
  hasCompletedOnboarding: boolean;
  createdAt: string;
  isTeenager: boolean;
  selectedTrack?: 'fitness' | 'calisthenics' | 'both';
  calisthenicsMastery?: string[];
}

export interface AiPlanMealItem {
  name: string;
  quantity: string;
  calories: number;
  proteinG: number;
  costEstInr?: number;
  notes?: string;
}

export interface AiPlanMeal {
  mealName: string;
  time?: string;
  items: AiPlanMealItem[];
  approxCalories: number;
  approxProteinG: number;
}

export interface AiProteinSource {
  food: string;
  proteinPerServing: string;
  affordability: string;
}

export interface AiFoodAlternative {
  original: string;
  localReplacement: string;
  benefit: string;
}

export interface AiExercisePlanItem {
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  equipment: string;
  beginnerAlternative: string;
  formCues: string;
}

export interface AiWorkoutSessionPlan {
  id: string;
  title: string;
  day: string;
  category: string;
  durationMinutes: number;
  isRestDay: boolean;
  warmup: string[];
  cooldown: string[];
  exercises: AiExercisePlanItem[];
}

export interface PersonalPlan {
  id: string;
  userId: string;
  createdAt: string;
  summary: string;
  heightGuidance?: string;
  dietPlan: {
    dailyCalorieTarget: number;
    dailyProteinG: number;
    dailyCarbsG: number;
    dailyFatG: number;
    estimatedDailyCostInr: number;
    meals: AiPlanMeal[];
    proteinSources: AiProteinSource[];
    localAlternatives: AiFoodAlternative[];
    safetyNotes: string[];
  };
  workoutPlan: {
    experienceLevel: string;
    weeklyFrequency: number;
    schedule: { day: string; focus: string; type: string; isRest: boolean }[];
    sessions: AiWorkoutSessionPlan[];
    recoveryGuidelines: string[];
  };
}
