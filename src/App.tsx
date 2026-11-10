import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { WorkoutView } from './components/WorkoutView';
import { NutritionView } from './components/NutritionView';
import { AiCoachView } from './components/AiCoachView';
import { BiometricsView } from './components/BiometricsView';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { FitnessAssessmentWizard } from './components/FitnessAssessmentWizard';
import { CalisthenicsAcademyView } from './components/CalisthenicsAcademyView';
import { HeightGrowthCentreView } from './components/HeightGrowthCentreView';
import { RestTimer } from './components/RestTimer';
import { OneRepMaxCalculator } from './components/OneRepMaxCalculator';
import { Activity } from 'lucide-react';
import {
  WORKOUT_SESSIONS,
  INITIAL_MEAL_CATEGORIES,
  INITIAL_COACH_MESSAGES,
  BIOMETRIC_HISTORY,
} from './data/initialData';
import { WorkoutSession, MealCategory, CoachMessage, BiometricEntry } from './types/fitness';
import { UserProfile, PersonalPlan } from './types/user';
import { PathwayTrack } from './types/calisthenics';
import { HeightRecord } from './types/growth';
import { generateRuleBasedPlan, generateLocalDietPlan } from './utils/localDietEngine';
import { adaptAiPlanToMealCategories, adaptAiPlanToWorkoutSessions } from './utils/planAdapters';
import { auth, db, testFirestoreConnection } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation State supporting all requested sections
  const [currentView, setCurrentView] = useState<'dashboard' | 'workout' | 'nutrition' | 'coach' | 'biometrics' | 'profile' | 'calisthenics' | 'growth'>('dashboard');
  
  // Strict User Authentication & Lifecycle State (Public starts strictly unauthenticated)
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [pendingAuthData, setPendingAuthData] = useState<{ email: string; name?: string } | null>(null);
  const [pendingTrack, setPendingTrack] = useState<PathwayTrack | undefined>(undefined);

  // Calisthenics Academy Mastered Skills State
  const [masteredCalisthenicsSkills, setMasteredCalisthenicsSkills] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('auramorph_calisthenics_mastery');
      if (cached) return JSON.parse(cached);
    } catch {}
    return ['skill-push-ups'];
  });

  // Authenticated User Profile (Never defaulted to demo data)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // AI-Generated Personal Plan (Powered by Google Gemini & stored in Firestore)
  const [aiPlan, setAiPlan] = useState<PersonalPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  // Workouts State (Dynamically populated from user's AI-generated plan)
  const [workoutsList, setWorkoutsList] = useState<WorkoutSession[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);

  // Nutrition & Metabolic Targets State (Dynamically mapped from user's AI-generated plan)
  const [mealCategories, setMealCategories] = useState<MealCategory[]>([]);
  const [waterIntakeMl, setWaterIntakeMl] = useState(3000);
  const [movementKcal, setMovementKcal] = useState(450);
  const [proteinTargetG, setProteinTargetG] = useState(140);
  const [hydrationTargetMl, setHydrationTargetMl] = useState(3500);
  const [movementTargetKcal, setMovementTargetKcal] = useState(500);

  // User Biometrics History (Loaded directly from Firestore for the authenticated user)
  const [biometricsHistory, setBiometricsHistory] = useState<BiometricEntry[]>([]);

  // User Height Records for Height & Growth Centre
  const [heightRecords, setHeightRecords] = useState<HeightRecord[]>([]);

  // Initial Firestore Connection Test & Firebase Auth Listener
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // Visitor is unauthenticated: clear all state & display AuthView first
        setIsAuthenticated(false);
        setIsOnboarding(false);
        setUserProfile(null);
        setAiPlan(null);
        setMealCategories([]);
        setWorkoutsList([]);
        setActiveWorkout(null);
        setBiometricsHistory([]);
        setHeightRecords([]);
        setPendingAuthData(null);
        setIsAuthChecking(false);
        return;
      }

      // User is authenticated with Firebase
      setIsAuthenticated(true);
      try {
        // Check Firestore for user's profile
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data()?.currentWeightKg && userDocSnap.data()?.primaryGoal) {
          // RETURNING USER: Retrieve their own profile from Firestore
          const loaded = userDocSnap.data() as UserProfile;
          setUserProfile(loaded);
          setProteinTargetG(loaded.dailyProteinTargetG || 145);
          setHydrationTargetMl(loaded.dailyHydrationTargetMl || 4000);
          setMovementTargetKcal(loaded.dailyMovementTargetKcal || 550);

          // Restore Calisthenics Mastery & Track
          if (loaded.calisthenicsMastery && Array.isArray(loaded.calisthenicsMastery)) {
            setMasteredCalisthenicsSkills(loaded.calisthenicsMastery);
          }
          if (loaded.selectedTrack === 'calisthenics') {
            setCurrentView('calisthenics');
          }

          // Retrieve their own saved diet and workout plan from Firestore
          const planDocRef = doc(db, 'users', firebaseUser.uid, 'plans', 'current');
          const planDocSnap = await getDoc(planDocRef);
          if (planDocSnap.exists()) {
            const loadedPlan = planDocSnap.data() as PersonalPlan;
            setAiPlan(loadedPlan);
            const dynamicMeals = adaptAiPlanToMealCategories(loadedPlan);
            setMealCategories(dynamicMeals);
            const dynamicWorkouts = adaptAiPlanToWorkoutSessions(loadedPlan, loaded);
            setWorkoutsList(dynamicWorkouts);
            if (dynamicWorkouts.length > 0) {
              setActiveWorkout(dynamicWorkouts[0]);
            }
          } else {
            // Plan not yet created for this user: generate and save it
            await generateAndSavePlan(loaded, firebaseUser.uid);
          }

          // Retrieve user's own biometrics progress from Firestore
          const progCol = collection(db, 'users', firebaseUser.uid, 'progress');
          const progSnap = await getDocs(progCol);
          if (!progSnap.empty) {
            const loadedBio: BiometricEntry[] = [];
            progSnap.forEach((d) => {
              const data = d.data();
              loadedBio.push({
                date: data.date,
                dayLabel: new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' }),
                weightKg: data.weightKg,
                bodyFatPct: data.bodyFatPct || 22.0,
                sleepHours: data.sleepHours || 8.0,
                restingHeartRate: data.restingHeartRate || 60,
                recoveryScore: data.recoveryScore || 90,
                volumeTonnageKg: data.volumeTonnageKg || 2500,
              });
            });
            setBiometricsHistory(loadedBio);
          } else {
            const today = new Date().toISOString().split('T')[0];
            setBiometricsHistory([
              {
                date: today,
                dayLabel: 'Today',
                weightKg: loaded.currentWeightKg,
                bodyFatPct: 22.0,
                sleepHours: 8.0,
                restingHeartRate: 62,
                recoveryScore: 92,
                volumeTonnageKg: 2000,
              },
            ]);
          }

          // Retrieve user's height records from Firestore
          try {
            const heightCol = collection(db, 'users', firebaseUser.uid, 'height_records');
            const heightSnap = await getDocs(heightCol);
            if (!heightSnap.empty) {
              const loadedHeights: HeightRecord[] = [];
              heightSnap.forEach((d) => {
                loadedHeights.push(d.data() as HeightRecord);
              });
              setHeightRecords(loadedHeights);
            } else if (loaded.currentHeightCm) {
              const initRec: HeightRecord = {
                id: `height-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                time: '08:00',
                heightCm: loaded.currentHeightCm,
                measuredWithFootwear: false,
                notes: 'Baseline measurement from assessment',
                measuredBy: 'Self',
                createdAt: new Date().toISOString(),
              };
              setHeightRecords([initRec]);
              await setDoc(doc(db, 'users', firebaseUser.uid, 'height_records', initRec.id), initRec);
            }
          } catch (heightErr) {
            console.warn('Height records load notice:', heightErr);
          }

          setIsOnboarding(false);
        } else {
          // NEW USER: Redirect to FitnessAssessmentWizard
          setPendingAuthData({
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
          });
          setIsOnboarding(true);
        }
      } catch (err) {
        console.warn('Initial Firestore data load notice:', err);
        // If error fetching, guide new user to assessment
        setPendingAuthData({
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
        });
        setIsOnboarding(true);
      } finally {
        setIsAuthChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);
  // AI Coach Messages State
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>(INITIAL_COACH_MESSAGES);

  // Global Rest Timer Modal/Floating bar state
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [restTimerSeconds, setRestTimerSeconds] = useState(90);

  // 1RM Estimator Modal State
  const [is1RMOpen, setIs1RMOpen] = useState(false);
  const [calc1RMWeight, setCalc1RMWeight] = useState(65);
  const [calc1RMReps, setCalc1RMReps] = useState(8);

  const streakDays = 1;

  // AI Plan Generator connected to Gemini API and Firestore
  const generateAndSavePlan = async (profile: UserProfile, targetUid?: string) => {
    setIsGeneratingPlan(true);
    try {
      let finalPlan: PersonalPlan | null = null;
      try {
        const response = await fetch('/api/generate-personal-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ profile }),
        });

        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          const result = await response.json();
          if (result && result.plan) {
            finalPlan = result.plan;
          }
        } else {
          console.warn('Non-JSON response received from plan generator, using local precision engine.');
        }
      } catch (fetchErr) {
        console.warn('API plan synthesis notice, falling back to local engine:', fetchErr);
      }

      if (!finalPlan) {
        finalPlan = generateRuleBasedPlan(profile);
      }

      setAiPlan(finalPlan);

      // Dynamically replace hardcoded sample diet & workout data across the app
      const dynamicMeals = adaptAiPlanToMealCategories(finalPlan);
      setMealCategories(dynamicMeals);
      const dynamicWorkouts = adaptAiPlanToWorkoutSessions(finalPlan, profile);
      setWorkoutsList(dynamicWorkouts);
      if (dynamicWorkouts.length > 0) {
        setActiveWorkout(dynamicWorkouts[0]);
      }

      // Update metabolic targets if specified in AI diet plan
      if (finalPlan.dietPlan) {
        if (finalPlan.dietPlan.dailyProteinG) {
          setProteinTargetG(finalPlan.dietPlan.dailyProteinG);
        }
        if (finalPlan.dietPlan.dailyCalorieTarget) {
          setUserProfile((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              dailyCalorieTarget: finalPlan!.dietPlan.dailyCalorieTarget,
              dailyProteinTargetG: finalPlan!.dietPlan.dailyProteinG || prev.dailyProteinTargetG,
            };
          });
        }
      }

      // Store into Firestore subcollection
      const uid = targetUid || auth.currentUser?.uid;
      if (uid && finalPlan) {
        try {
          const planRef = doc(db, 'users', uid, 'plans', 'current');
          await setDoc(planRef, {
            ...finalPlan,
            id: 'current',
            userId: uid,
            updatedAt: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('Firestore plan save notice:', dbErr);
        }
      }

      // Visual feedback celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#A3E635', '#10B981', '#4ADE80'],
      });
    } catch (err) {
      console.warn('Handled personal plan generation event:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Handle Auth login/signup
  const handleAuthSuccess = (userData: {
    email: string;
    name?: string;
    isNewAccount: boolean;
    uid?: string;
    selectedTrack?: PathwayTrack;
  }) => {
    setIsAuthChecking(true);
    if (userData.selectedTrack) {
      setPendingTrack(userData.selectedTrack);
      if (userData.selectedTrack === 'calisthenics') {
        setCurrentView('calisthenics');
      }
    }
  };

  // Handle Calisthenics Mastery Toggling with Persistent Storage
  const handleToggleCalisthenicsMastery = (skillId: string) => {
    setMasteredCalisthenicsSkills((prev) => {
      const next = prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId];
      try {
        localStorage.setItem('auramorph_calisthenics_mastery', JSON.stringify(next));
      } catch {}

      if (auth.currentUser) {
        try {
          setDoc(
            doc(db, 'users', auth.currentUser.uid),
            { calisthenicsMastery: next },
            { merge: true }
          );
        } catch (fsErr) {
          console.warn('Firestore calisthenics sync notice:', fsErr);
        }
      }
      return next;
    });
  };

  // Handle Assessment Completion
  const handleAssessmentComplete = async (newProfile: UserProfile) => {
    const uid = auth.currentUser?.uid || newProfile.id || `usr-${Date.now()}`;
    const profileWithUid = {
      ...newProfile,
      id: uid,
      selectedTrack: newProfile.selectedTrack || pendingTrack || 'both',
    };
    setUserProfile(profileWithUid);
    setIsOnboarding(false);
    setIsAuthenticated(true);
    setProteinTargetG(profileWithUid.dailyProteinTargetG || 145);
    setHydrationTargetMl(profileWithUid.dailyHydrationTargetMl || 4000);
    setMovementTargetKcal(profileWithUid.dailyMovementTargetKcal || 550);
    
    // Route to Calisthenics Academy if user selected calisthenics track
    if (profileWithUid.selectedTrack === 'calisthenics') {
      setCurrentView('calisthenics');
    } else {
      setCurrentView('dashboard');
    }

    // Persist profile to Firestore
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), profileWithUid);
      } catch (err) {
        console.warn('Firestore profile persist notice:', err);
      }
    }

    // Record initial height baseline record
    if (profileWithUid.currentHeightCm) {
      const initRec: HeightRecord = {
        id: `height-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: '08:00',
        heightCm: profileWithUid.currentHeightCm,
        measuredWithFootwear: false,
        notes: 'Initial measurement from onboarding assessment',
        measuredBy: 'Self',
        createdAt: new Date().toISOString(),
      };
      setHeightRecords([initRec]);
      if (auth.currentUser) {
        try {
          await setDoc(doc(db, 'users', auth.currentUser.uid, 'height_records', initRec.id), initRec);
        } catch (e) {
          console.warn('Initial height record sync notice:', e);
        }
      }
    }

    // Generate AI Plan with Gemini and save to Firestore
    await generateAndSavePlan(profileWithUid, uid);
  };

  // Add Height Measurement Record
  const handleAddHeightRecord = async (newRecord: Omit<HeightRecord, 'id' | 'createdAt'>) => {
    const recordId = `height-${Date.now()}`;
    const fullRecord: HeightRecord = {
      ...newRecord,
      id: recordId,
      createdAt: new Date().toISOString(),
    };
    setHeightRecords((prev) => [...prev, fullRecord]);

    // Update current height in userProfile if changed
    if (userProfile && fullRecord.heightCm !== userProfile.currentHeightCm) {
      const updatedProfile: UserProfile = {
        ...userProfile,
        currentHeightCm: fullRecord.heightCm,
      };
      setUserProfile(updatedProfile);
      if (auth.currentUser) {
        try {
          await setDoc(doc(db, 'users', auth.currentUser.uid), updatedProfile, { merge: true });
        } catch (e) {
          console.warn('Profile height sync notice:', e);
        }
      }
    }

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'height_records', recordId), fullRecord);
      } catch (err) {
        console.warn('Firestore height record save notice:', err);
      }
    }
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  // Delete Height Record
  const handleDeleteHeightRecord = async (id: string) => {
    setHeightRecords((prev) => prev.filter((r) => r.id !== id));
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'height_records', id));
      } catch (err) {
        console.warn('Firestore height record delete notice:', err);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      // non-fatal
    }
    setIsAuthenticated(false);
    setIsOnboarding(false);
    setUserProfile(null);
    setAiPlan(null);
    setMealCategories([]);
    setWorkoutsList([]);
    setActiveWorkout(null);
    setBiometricsHistory([]);
    setHeightRecords([]);
    setPendingAuthData(null);
    try {
      localStorage.removeItem('auramorph_user_profile_v2');
      localStorage.removeItem('kinetix_user_profile_v2');
    } catch {
      // ignore
    }
    setCurrentView('dashboard');
  };

  const handleAddBiometricLog = async (entry: BiometricEntry) => {
    setBiometricsHistory((prev) => [...prev, entry]);
    if (auth.currentUser) {
      try {
        const logDocRef = doc(db, 'users', auth.currentUser.uid, 'progress', entry.date);
        await setDoc(logDocRef, {
          id: entry.date,
          userId: auth.currentUser.uid,
          date: entry.date,
          weightKg: entry.weightKg,
          workoutsCompleted: 1,
          caloriesConsumed: Math.round(mealCategories.flatMap((m) => m.items).reduce((s, i) => s + i.calories, 0)),
          proteinGConsumed: Math.round(mealCategories.flatMap((m) => m.items).reduce((s, i) => s + i.protein, 0)),
          waterMlConsumed: waterIntakeMl,
          notes: `Recorded on ${entry.dayLabel}`,
        });
      } catch (fsErr) {
        console.warn('Firestore progress write notice:', fsErr);
      }
    }
  };

  const handleSelectWorkoutSession = (session: WorkoutSession) => {
    const found = workoutsList.find((w) => w.id === session.id) || session;
    setActiveWorkout(found);
  };

  const handleUpdateActiveWorkout = (updated: WorkoutSession) => {
    setActiveWorkout(updated);
    setWorkoutsList((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const handleOpenRestTimer = (seconds: number) => {
    setRestTimerSeconds(seconds);
    setIsRestTimerOpen(true);
  };

  const handleOpen1RMCalc = (weight: number, reps: number) => {
    setCalc1RMWeight(weight);
    setCalc1RMReps(reps);
    setIs1RMOpen(true);
  };

  const handleQuickAddProtein = (amountG: number) => {
    const quickItem = {
      id: `m-quick-${Date.now()}`,
      foodId: 'food-whey',
      name: amountG >= 20 ? 'Fresh Paneer / Whey Boost' : 'Roasted Sattu Protein Quick Shot',
      servings: 1,
      portionGrams: amountG * 4,
      calories: Math.round(amountG * 4.2),
      protein: amountG,
      carbs: 2,
      fat: 0.5,
    };
    setMealCategories((prev) => {
      return prev.map((cat, idx) => {
        if (cat.id === 'postworkout' || idx === 3) {
          return { ...cat, items: [...cat.items, quickItem] };
        }
        return cat;
      });
    });
  };

  const handleQuickAddMovement = (amountKcal: number) => {
    setMovementKcal((prev) => prev + amountKcal);
  };

  const handleUpdateTargets = (targets: { protein: number; hydration: number; movement: number }) => {
    setProteinTargetG(targets.protein);
    setHydrationTargetMl(targets.hydration);
    setMovementTargetKcal(targets.movement);
  };

  const handleSendMessage = (text: string) => {
    try {
      if (text.startsWith('{"id":"msg-')) {
        const parsed = JSON.parse(text) as CoachMessage;
        setCoachMessages((prev) => [...prev, parsed]);
        return;
      }
    } catch {
      // normal user text
    }

    const userMsg: CoachMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCoachMessages((prev) => [...prev, userMsg]);
  };

  const handleCompleteWorkout = () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#A3E635', '#10B981', '#5bed8d', '#ffffff'],
    });

    const workoutToComplete = activeWorkout || workoutsList[0];
    if (!workoutToComplete) return;

    const updated: WorkoutSession = {
      ...workoutToComplete,
      status: 'completed' as const,
      exercises: workoutToComplete.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map((s) => ({ ...s, completed: true })),
      })),
    };
    handleUpdateActiveWorkout(updated);
  };

  const handleApplyCoachAction = (actionType: string) => {
    if (actionType === 'macro_adjustment') {
      setCurrentView('nutrition');
    } else if (actionType === 'recovery_protocol') {
      setCurrentView('workout');
    }
  };

  // Loading screen while verifying Firebase Authentication status
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0A0D0E] text-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#A3E635] selection:text-[#0A0D0E]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A3E635]/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#111618] border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] shadow-[0_0_25px_rgba(163,230,53,0.2)]">
            <Activity className="w-7 h-7 text-[#A3E635] animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight text-[#F8FAFC]">
              AURAMORPH<span className="text-[#A3E635]">.</span>
            </h1>
            <p className="text-[11px] font-mono tracking-wider text-[#94A3B8] uppercase mt-0.5">
              Transform Your Habits. Elevate Your Potential.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182022] border border-[#10B981]/30 text-xs font-mono text-[#A3E635]">
            <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
            <span>Verifying Biometric Authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  // If user is unauthenticated, show the Login/Signup page first (No demo, no dashboard leakage)
  if (!isAuthenticated || !auth.currentUser) {
    return (
      <AuthView
        onSuccess={handleAuthSuccess}
      />
    );
  }

  // If user is onboarding / taking assessment, show the Multi-step Assessment Wizard
  if (isOnboarding) {
    return (
      <FitnessAssessmentWizard
        initialEmail={pendingAuthData?.email || userProfile?.email || auth.currentUser?.email || ''}
        initialName={pendingAuthData?.name || userProfile?.fullName || auth.currentUser?.displayName || ''}
        initialTrack={pendingTrack || userProfile?.selectedTrack || 'both'}
        onComplete={handleAssessmentComplete}
        onCancel={() => {
          if (!userProfile) {
            handleSignOut();
          } else {
            setIsOnboarding(false);
          }
        }}
      />
    );
  }

  // Guard against null userProfile before rendering personal dashboard
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#0A0D0E] text-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#A3E635] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs font-mono text-[#94A3B8]">Loading athlete telemetry...</p>
      </div>
    );
  }

  const effectiveWorkout = activeWorkout || workoutsList[0] || WORKOUT_SESSIONS[0];
  const effectiveWorkoutsList = workoutsList.length > 0 ? workoutsList : WORKOUT_SESSIONS;

  return (
    <div className="min-h-screen bg-[#0A0D0E] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#A3E635] selection:text-[#0A0D0E]">
      
      {/* Top Header Navigation Bar with user profile integration */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        streakDays={streakDays}
        onQuickStartWorkout={() => setCurrentView('workout')}
        isWorkoutActive={effectiveWorkout.status === 'in_progress'}
        userProfile={userProfile}
        onSignOut={handleSignOut}
        onRetakeAssessment={() => setIsOnboarding(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full">
        {currentView === 'dashboard' && (
          <DashboardView
            workout={effectiveWorkout}
            allWorkouts={effectiveWorkoutsList}
            onSelectWorkoutSession={handleSelectWorkoutSession}
            mealCategories={mealCategories}
            biometrics={biometricsHistory}
            latestCoachMessage={coachMessages[coachMessages.length - 1]}
            streakDays={streakDays}
            waterIntakeMl={waterIntakeMl}
            movementKcal={movementKcal}
            proteinTarget={proteinTargetG}
            hydrationTargetMl={hydrationTargetMl}
            movementTargetKcal={movementTargetKcal}
            userProfile={userProfile}
            aiPlan={aiPlan}
            onRegeneratePlan={() => generateAndSavePlan(userProfile)}
            isRegeneratingPlan={isGeneratingPlan}
            onAddBiometricLog={handleAddBiometricLog}
            onNavigate={setCurrentView}
            onOpenRestTimer={handleOpenRestTimer}
            onQuickWater={(ml) => setWaterIntakeMl((prev) => Math.min(6000, prev + ml))}
            onQuickAddProtein={handleQuickAddProtein}
            onQuickAddMovement={handleQuickAddMovement}
            onUpdateTargets={handleUpdateTargets}
          />
        )}

        {/* Calisthenics Academy */}
        {currentView === 'calisthenics' && (
          <CalisthenicsAcademyView
            masteredSkillIds={masteredCalisthenicsSkills}
            onToggleMastery={handleToggleCalisthenicsMastery}
            onOpenRestTimer={handleOpenRestTimer}
            athleteName={userProfile?.fullName || 'Athlete'}
          />
        )}

        {/* Height & Growth Centre */}
        {currentView === 'growth' && (
          <HeightGrowthCentreView
            userProfile={userProfile}
            heightRecords={heightRecords}
            onAddHeightRecord={handleAddHeightRecord}
            onDeleteHeightRecord={handleDeleteHeightRecord}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {/* 1. My Workout Plan */}
        {currentView === 'workout' && (
          <WorkoutView
            workout={effectiveWorkout}
            allWorkouts={effectiveWorkoutsList}
            onSelectWorkoutSession={handleSelectWorkoutSession}
            onUpdateWorkout={handleUpdateActiveWorkout}
            onOpenRestTimer={handleOpenRestTimer}
            onOpen1RMCalc={handleOpen1RMCalc}
            onCompleteWorkout={handleCompleteWorkout}
          />
        )}

        {/* 2. My Diet Plan */}
        {currentView === 'nutrition' && (
          <NutritionView
            mealCategories={mealCategories}
            onUpdateMeals={setMealCategories}
            waterIntakeMl={waterIntakeMl}
            onUpdateWater={setWaterIntakeMl}
            userProfile={userProfile}
            aiPlan={aiPlan}
          />
        )}

        {/* AI Sports Coach */}
        {currentView === 'coach' && (
          <AiCoachView
            messages={coachMessages}
            onSendMessage={handleSendMessage}
            onApplyAction={handleApplyCoachAction}
            userTelemetry={{
              streakDays,
              weightKg: biometricsHistory[biometricsHistory.length - 1]?.weightKg || userProfile.currentWeightKg,
              currentProtein: Math.round(mealCategories.flatMap((m) => m.items).reduce((sum, i) => sum + i.protein, 0) * 10) / 10,
              proteinTarget: proteinTargetG,
              currentHydrationMl: waterIntakeMl,
              hydrationTargetMl,
              currentMovementKcal: movementKcal,
              movementTargetKcal,
              recoveryScore: biometricsHistory[biometricsHistory.length - 1]?.recoveryScore || 92,
            }}
          />
        )}

        {/* 3. My Progress */}
        {currentView === 'biometrics' && (
          <BiometricsView
            history={biometricsHistory}
            onAddEntry={(entry) => setBiometricsHistory((prev) => [...prev, entry])}
            userProfile={userProfile}
          />
        )}

        {/* 4. My Profile */}
        {currentView === 'profile' && (
          <ProfileView
            profile={userProfile}
            onRetakeAssessment={() => setIsOnboarding(true)}
            onSignOut={handleSignOut}
            onUpdateProfile={async (updated) => {
              // Recompute regional diet recommendations based on updated city and state
              const updatedLocalDiet = generateLocalDietPlan({
                state: updated.state,
                city: updated.city,
                locality: updated.locality,
                dietaryPreference: updated.dietaryPreference,
                budget: updated.dailyBudget,
                allergies: updated.allergies,
                dislikedFoods: updated.dislikedFoods,
                mealsPerDay: updated.mealsPerDay,
                targetCalories: updated.dailyCalorieTarget,
                proteinTargetG: updated.dailyProteinTargetG,
              });
              const profileWithDiet = { ...updated, localDiet: updatedLocalDiet };
              setUserProfile(profileWithDiet);
              if (auth.currentUser) {
                try {
                  await setDoc(doc(db, 'users', auth.currentUser.uid), profileWithDiet);
                } catch (fsErr) {
                  console.warn('Firestore profile write note:', fsErr);
                }
              }
              // Requirement 8: Regenerate the diet plan when the location changes
              await generateAndSavePlan(profileWithDiet);
            }}
            onRegeneratePlan={() => generateAndSavePlan(userProfile)}
            isRegeneratingPlan={isGeneratingPlan}
          />
        )}
      </main>

      {/* Global Interactive Rest Stopwatch */}
      <RestTimer
        isOpen={isRestTimerOpen}
        initialSeconds={restTimerSeconds}
        onClose={() => setIsRestTimerOpen(false)}
      />

      {/* Global 1RM Estimator Modal */}
      <OneRepMaxCalculator
        isOpen={is1RMOpen}
        onClose={() => setIs1RMOpen(false)}
        defaultWeight={calc1RMWeight}
        defaultReps={calc1RMReps}
      />

      {/* Editorial footer with Made by Aarav Jakhar signature and active user metrics */}
      <footer className="border-t border-[#10B981]/15 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#64748B] bg-[#0A0D0E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display font-semibold text-[#F8FAFC]">AURAMORPH</span>
            <span>·</span>
            <span className="text-[#94A3B8]">Transform Your Habits. Elevate Your Potential.</span>
            <span>·</span>
            <a
              href="https://www.instagram.com/dr.monomaniac/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded bg-[#182022] hover:bg-[#202b2e] border border-[#A3E635]/40 hover:border-[#A3E635] text-[#A3E635] font-mono text-[11px] font-bold transition-all inline-flex items-center gap-1.5"
            >
              <span>MADE BY AARAV JAKHAR</span>
              <span className="text-[10px] text-[#4ADE80]">(@dr.monomaniac)</span>
            </a>
          </div>
          <div className="font-mono text-[11px] text-[#94A3B8]">
            Athlete: {userProfile.fullName} · {userProfile.currentWeightKg.toFixed(1)} kg ({userProfile.city ? `${userProfile.city}, ${userProfile.state}` : (userProfile.state || 'All-India')}) · {userProfile.dietaryPreference}
          </div>
        </div>
      </footer>
    </div>
  );
}
