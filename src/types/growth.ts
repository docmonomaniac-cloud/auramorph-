export interface HeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  heightCm: number;
  measuredWithFootwear?: boolean;
  notes?: string;
  measuredBy?: 'Self' | 'Parent / Guardian' | 'Doctor / Clinic';
  createdAt: string;
}

export interface PostureExercise {
  id: string;
  name: string;
  sanskritName?: string;
  category: 'Spine Decompression' | 'Thoracic Mobility' | 'Core & Pelvis' | 'Postural Alignment';
  youtubeVideoId: string;
  videoChannel: string;
  durationOrReps: string;
  targetArea: string;
  suitableAgeRange: string;
  difficulty: 'Beginner' | 'Gentle' | 'Intermediate';
  benefits: string[];
  stepByStepInstructions: string[];
  safetyPrecautions: string[];
}

export interface GrowthScheduleItem {
  id: string;
  timeWindow: string;
  title: string;
  category: 'Sleep' | 'Nutrition' | 'Activity & Sunshine' | 'Posture' | 'Recovery';
  description: string;
  recommendedActions: string[];
  scientificReason: string;
  isTeenagerFocused?: boolean;
}

export interface GrowthGuidelineItem {
  id: string;
  title: string;
  summary: string;
  details: string;
  category: 'Nutrition' | 'Sleep & Recovery' | 'Physical Activity' | 'Posture & Ergonomics' | 'Medical Safety' | 'Activity & Sunshine';
  evidenceLevel: 'Clinical Recommendation' | 'Physiological Fact' | 'Safety Protocol';
}

export interface GrowthSpurtEducationalFact {
  id: string;
  title: string;
  summary: string;
  details: string;
  mythBuster?: string;
  scientificExplanation: string;
}
