export type SkillTier = 'beginner' | 'intermediate' | 'advanced';

export type SkillCategory = 'push' | 'pull' | 'core' | 'legs' | 'statics' | 'dynamics';

export type PathwayTrack = 'fitness' | 'calisthenics' | 'both';

export interface CalisthenicsExercise {
  id: string;
  name: string;
  tier: SkillTier;
  category: SkillCategory;
  prerequisites: string[]; // IDs of precursor skills
  nextProgressions: string[]; // IDs of next level skills
  repsTarget: string;
  holdTarget?: string;
  description: string;
  youtubeVideoId: string;
  videoChannel: string;
  videoTitle: string;
  stepByStepInstructions: string[];
  formCues: string[];
  commonMistakes: string[];
  safetyPrecautions: string[];
  easierAlternatives: string[];
  harderVariations: string[];
  musclesTargeted: string[];
}

export interface CalisthenicsRoutine {
  id: string;
  title: string;
  tier: SkillTier;
  durationMinutes: number;
  description: string;
  focus: string;
  exercises: {
    skillId: string;
    skillName: string;
    sets: number;
    repsOrHold: string;
    restSeconds: number;
    notes?: string;
  }[];
}

export interface UserCalisthenicsProgress {
  masteredSkillIds: string[];
  inProgressSkillIds: string[];
  lastPracticedDate?: string;
  skillNotes?: Record<string, string>;
  completedRoutinesCount?: number;
}
