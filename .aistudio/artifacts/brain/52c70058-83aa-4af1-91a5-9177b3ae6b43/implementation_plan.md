# Implementation Plan: AURAMORPH Calisthenics Academy

Add a dedicated **Calisthenics Academy** section to the existing **AURAMORPH** website, featuring multi-track onboarding (Fitness & Nutrition, Calisthenics, or Both), a separate glowing neon-purple Calisthenics dashboard, skill progression tiers (Beginner, Intermediate, Advanced), an expandable inline tutorial video drawer with technique instructions, and personal skill mastery tracking without altering or damaging existing features.

---

## 1. User Journey & Architectural Overview

```
                          ┌────────────────────────┐
                          │   AURAMORPH AuthView   │
                          │   Pathway Selection:   │
                          │  • Fitness & Nutrition │
                          │  • Calisthenics Academy│
                          │  • Both (Mastery)      │
                          └───────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                 [Returning User]             [New User]
                         │                         │
                         ▼                         ▼
               [Load Firestore Profile]  [Fitness & Calisthenics]
                         │               [  Assessment Wizard   ]
                         │                         │
                         └────────────┬────────────┘
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │       AURAMORPH Unified Athletic Shell          │
             ├───────────────────────┬─────────────────────────┤
             │  Fitness & Nutrition  │   Calisthenics Academy  │
             │  • Telemetry Stream   │   • Beginner / Inter /  │
             │  • My Diet Plan (AI)  │     Advanced Tiers      │
             │  • My Workout Plan    │   • Skill Progression   │
             │  • My Progress        │   • Expandable Drawers  │
             │  • AI Coach (Gemini)  │   • Real Video Tutorials│
             │  • My Profile         │   • Daily Practice Routines
             └───────────────────────┴─────────────────────────┘
```

---

## 2. Component & Data Structure

### 2.1 Types (`src/types/calisthenics.ts` & `src/types/user.ts`)
* **Pathway Track**:
  ```typescript
  export type PathwayTrack = 'fitness' | 'calisthenics' | 'both';
  ```
* **Calisthenics Skill Interface**:
  ```typescript
  export type SkillTier = 'beginner' | 'intermediate' | 'advanced';
  export type SkillCategory = 'push' | 'pull' | 'core' | 'legs' | 'statics' | 'dynamics';

  export interface CalisthenicsExercise {
    id: string;
    name: string;
    tier: SkillTier;
    category: SkillCategory;
    prerequisites: string[]; // skill IDs required/recommended
    nextProgressions: string[]; // next unlockable skills
    repsTarget: string;
    holdTarget?: string;
    description: string;
    youtubeVideoId: string; // real verified YouTube tutorial embed
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
  ```
* **User Calisthenics Progress (`CalisthenicsProgress`)**:
  * `masteredSkillIds: string[]`
  * `inProgressSkillIds: string[]`
  * `lastPracticedDate?: string`
  * `skillNotes: Record<string, string>`
  * `dailyRoutineCompleted: Record<string, boolean>`

### 2.2 Complete Skill Database (`src/data/calisthenicsData.ts`)
Comprehensive catalog covering all 23+ requested skills:
* **Beginner Skills**:
  1. *Push-ups* (Standard, Incline, Knee variations)
  2. *Pull-ups* (Pronated dead-hang to chest-to-bar)
  3. *Chin-ups* (Supinated grip bicep and lat overload)
  4. *Dips* (Parallel bar straight-bar dips)
  5. *Australian rows* (Inverted horizontal rows)
  6. *Plank* (Posterior pelvic tilt hollow plank)
  7. *Hollow body hold* (Gymnastic anterior chain tension)
  8. *L-sit progression* (Tuck L-sit to full parallettes hold)
* **Intermediate Skills**:
  9. *Muscle-up progression* (Explosive high pull-ups, transitions)
  10. *Handstand progression* (Chest-to-wall, kick-up balance)
  11. *Pistol squats* (Single leg balance and mobility)
  12. *Dragon flag progression* (Tuck to eccentric body lever)
  13. *Tuck front lever* (Straight arm scapular depression)
  14. *Tuck back lever* (Shoulder extension and German hang prep)
  15. *Human flag preparation* (Side lever oblique engagement)
* **Advanced Skills**:
  16. *Full front lever* (Horizontal straight-arm hold)
  17. *Full back lever* (Complete horizontal shoulder extension)
  18. *Planche progression* (Leaning planche, tuck, straddle, full)
  19. *Freestanding handstand* (Zero wall assistance 30s+ hold)
  20. *Handstand push-ups* (Strict vertical bodyweight press)
  21. *Human flag* (Full horizontal lateral bar hold)
  22. *Advanced muscle-ups* (Strict slow muscle-up without momentum)
  23. *One-arm pull-up progression* (Archer pull-up, assisted single-arm)

### 2.3 Verified Video Tutorial Curation
Each exercise references verified, working high-definition YouTube calisthenics tutorials (from reputable creators like *Calisthenicmovement*, *FitnessFAQs*, *Tom Merrick*, *SaturnoMovement*, *Chris Heria*, *Dominik Sky*).
* Includes a graceful fallback: if an embed fails or cannot load, an interactive animated breakdown is rendered with the notice: *"HD Video Demonstration coming soon · Review complete technique checklist below"*.

---

## 3. UI Implementation & Visual Aesthetics

### 3.1 Styling: Deep Black & Bioluminescent Neon Purple
* Core theme: `#0A0D0E` (deep black), accented with `#A855F7` (electric purple), `#C084FC` (neon violet glow), `#7E22CE` (deep violet border), and `#3B0764` (subtle ambient lighting).
* Glow effects: `box-shadow: 0 0 25px rgba(168, 85, 247, 0.25)`.
* Retains existing green/lime `#A3E635` for general fitness views, giving Calisthenics Academy its distinct, prestigious identity as requested.

### 3.2 Layout & Features of `CalisthenicsAcademyView.tsx`
1. **Academy Hero Header**:
   * Title: `AURAMORPH CALISTHENICS ACADEMY`
   * Subtitle: *Master Your Bodyweight. Defy Gravity.*
   * Signature: `MADE BY AARAV JAKHAR (@dr.monomaniac)`
   * Level filter pills: All, Beginner, Intermediate, Advanced
   * Category filter pills: Push, Pull, Core, Statics, Dynamics
2. **Mastery Telemetry Hub**:
   * Total Skills Mastered tracker (`X / 23 skills`)
   * Mastery XP level (Initiate → Intermediate Athlete → Elite Bodyweight Master)
   * Interactive Skill Progression Roadmap / Dependency Matrix
3. **Interactive Skill Cards with Expandable Inline Drawers**:
   * Front card: Skill name, tier badge, category, targeted muscles, mastery toggle checkmark, prerequisites preview, and *"Watch Tutorial & Form Cues"* button.
   * **Inline Drawer (reveals smoothly below card upon click)**:
     - 16:9 embedded YouTube video player with privacy-enhanced mode
     - Step-by-step execution protocol
     - Biomechanical form cues & alignment tips
     - Common mistakes to avoid
     - Safety precautions (scapular health, wrist warmup)
     - Easier regressions & harder next-step variations
     - "Mark Skill Mastered" button with confetti celebration
4. **Daily Practice Routines**:
   * *Beginner Upper-Body Calisthenics Circuit*
   * *Handstand Balance & Shoulder Mobility Routine*
   * *Front Lever & Back Lever Isometric Day*
   * *Core Compression & L-Sit Finisher*

---

## 4. Onboarding & Login Pathway Selection

### 4.1 Login / Registration View (`src/components/AuthView.tsx`)
* Add a 3-column Pathway Selector:
  1. **Fitness & Nutrition**: Meal plans, gym PPL workouts, calorie/macro telemetry
  2. **Calisthenics Academy**: Skill mastery, bodyweight progressions, video tutorials
  3. **Both (All-in-One Mastery)**: Complete access to all features
* Store selection in user state and pass to assessment or dashboard.

### 4.2 Fitness Assessment Wizard (`src/components/FitnessAssessmentWizard.tsx`)
* When user selected `calisthenics`:
  - Personalize goal options for Calisthenics (Bodyweight Strength, Handstand, Lever Mastery).
  - Defaults equipment to "No equipment / Pull-up bar & Dip station".
  - Adds baseline bodyweight assessment (push-up max, pull-up capability).
* When user selected `both`:
  - Full biometric + calisthenics integration.

### 4.3 Navigation & Header (`src/components/Header.tsx` & `src/App.tsx`)
* Add **`Calisthenics`** to the navigation bar.
* Responsive desktop + tablet + mobile menu rows.
* If a user chose `calisthenics` as their exclusive path, direct them to Calisthenics Academy upon login, while keeping the full navigation available.

---

## 5. Safety & Quality Checklist

- [x] Strict preservation of existing files: no deletion or alteration of diet engine, workout logger, biometrics history, or Gemini AI coach.
- [x] Zero telemetry or status indicator clutter in UI.
- [x] Real verified video IDs with fallback protection ("Tutorial coming soon").
- [x] Mobile-responsive cards and embedded responsive 16:9 containers.
- [x] TypeScript validation (`tsc --noEmit`) and Vite build verification (`npm run build`).
