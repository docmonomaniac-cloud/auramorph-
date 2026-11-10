import React, { useState } from 'react';
import {
  UserProfile,
  DietaryPreference,
  ExperienceLevel,
  EquipmentLevel,
  FitnessGoal,
  BudgetTier,
} from '../types/user';
import { PathwayTrack } from '../types/calisthenics';
import {
  calculateTargets,
  generateLocalDietPlan,
  INDIAN_STATES,
  COMMON_ALLERGIES,
  COMMON_DISLIKED_FOODS,
  REGULAR_STAPLE_OPTIONS,
} from '../utils/localDietEngine';
import {
  User,
  MapPin,
  Scale,
  Ruler,
  Target,
  Utensils,
  Dumbbell,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  CheckCircle2,
  Stethoscope,
  HeartHandshake,
  DollarSign,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FitnessAssessmentWizardProps {
  initialEmail?: string;
  initialName?: string;
  initialTrack?: PathwayTrack;
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const FitnessAssessmentWizard: React.FC<FitnessAssessmentWizardProps> = ({
  initialEmail = '',
  initialName = '',
  initialTrack,
  onComplete,
  onCancel,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<PathwayTrack | null>(initialTrack || null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  const handleSelectTrack = (track: PathwayTrack) => {
    setSelectedTrack(track);
    setStepError('');
    if (track === 'calisthenics') {
      setPrimaryGoal('Strength Development');
      setEquipment('No equipment');
    } else if (track === 'fitness') {
      setPrimaryGoal('Healthy Weight Management');
      setEquipment('Full gym access');
    }
  };

  // Step 1: Personal Info
  const [fullName, setFullName] = useState(initialName || '');
  const [age, setAge] = useState<number>(24);
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Non-binary' | 'Prefer not to say'>('Male');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Haryana');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [skipLocation, setSkipLocation] = useState<boolean>(false);

  const handleDobChange = (dobString: string) => {
    setDateOfBirth(dobString);
    if (dobString) {
      const birthDate = new Date(dobString);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 10 && calculatedAge <= 95) {
        setAge(calculatedAge);
      }
    }
  };

  // Step 2: Body Measurements & Units
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(98.0);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(82.0);
  const [currentHeightCm, setCurrentHeightCm] = useState<number>(178);
  const [desiredHeightCm, setDesiredHeightCm] = useState<number>(178);

  // Helper unit conversions for inputs
  const displayedCurrentWeight = weightUnit === 'kg' ? currentWeightKg : Math.round(currentWeightKg * 2.20462 * 10) / 10;
  const displayedTargetWeight = weightUnit === 'kg' ? targetWeightKg : Math.round(targetWeightKg * 2.20462 * 10) / 10;
  const displayedCurrentHeight = heightUnit === 'cm' ? currentHeightCm : Math.round((currentHeightCm / 30.48) * 10) / 10;
  const displayedDesiredHeight = heightUnit === 'cm' ? desiredHeightCm : Math.round((desiredHeightCm / 30.48) * 10) / 10;

  // Step 3: Goals, Experience, Equipment (Personalized for Calisthenics if selected)
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(
    initialTrack === 'calisthenics' ? 'Strength Development' : 'Healthy Weight Management'
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediate');
  const [equipment, setEquipment] = useState<EquipmentLevel>(
    initialTrack === 'calisthenics' ? 'No equipment' : 'Full gym access'
  );

  // Step 4: Food Preferences & Budget
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('Vegetarian');
  const [allergies, setAllergies] = useState<string[]>(['None']);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  const [dailyBudget, setDailyBudget] = useState<BudgetTier>('Budget Friendly (₹120–250/day)');
  const [mealsPerDay, setMealsPerDay] = useState<number>(3);
  const [regularFoods, setRegularFoods] = useState<string[]>([
    'Whole Wheat Roti',
    'Yellow Moong Dal',
    'Homemade Curd (Dahi)',
    'Fresh Paneer',
    'Green Vegetables',
  ]);

  // Step Validation Error
  const [stepError, setStepError] = useState<string>('');

  const isTeenager = age < 18;
  const isAdultDesiringHeight = age >= 20 && desiredHeightCm > currentHeightCm;

  const toggleAllergy = (item: string) => {
    if (item === 'None') {
      setAllergies(['None']);
      return;
    }
    const filtered = allergies.filter((a) => a !== 'None');
    if (filtered.includes(item)) {
      const next = filtered.filter((a) => a !== item);
      setAllergies(next.length === 0 ? ['None'] : next);
    } else {
      setAllergies([...filtered, item]);
    }
  };

  const toggleDislike = (food: string) => {
    if (dislikedFoods.includes(food)) {
      setDislikedFoods(dislikedFoods.filter((f) => f !== food));
    } else {
      setDislikedFoods([...dislikedFoods, food]);
    }
  };

  const toggleRegularFood = (food: string) => {
    if (regularFoods.includes(food)) {
      setRegularFoods(regularFoods.filter((f) => f !== food));
    } else {
      setRegularFoods([...regularFoods, food]);
    }
  };

  const handleWeightChange = (valStr: string, isTarget = false) => {
    const val = parseFloat(valStr) || 0;
    const inKg = weightUnit === 'kg' ? val : Math.round((val / 2.20462) * 10) / 10;
    if (isTarget) {
      setTargetWeightKg(inKg);
    } else {
      setCurrentWeightKg(inKg);
    }
  };

  const handleHeightChange = (valStr: string, isDesired = false) => {
    const val = parseFloat(valStr) || 0;
    const inCm = heightUnit === 'cm' ? Math.round(val) : Math.round(val * 30.48);
    if (isDesired) {
      setDesiredHeightCm(inCm);
    } else {
      setCurrentHeightCm(inCm);
    }
  };

  const validateAndProceed = () => {
    setStepError('');

    // STEP 1: WHAT IS YOUR FITNESS INTEREST? (Mandatory)
    if (currentStep === 1) {
      if (!selectedTrack) {
        setStepError('Please select one of the three fitness interest options before continuing.');
        return;
      }
    }

    // STEP 2: PERSONAL INFORMATION & LOCATION
    if (currentStep === 2) {
      if (!fullName.trim()) {
        setStepError('Please enter your full name.');
        return;
      }
      if (!age || age < 12 || age > 95) {
        setStepError('Please enter a valid age between 12 and 95.');
        return;
      }
      if (!skipLocation) {
        if (!city.trim()) {
          setStepError('City is required for location-specific diet recommendations. If you prefer to skip, check "Skip location for now" below to receive a general Indian diet plan.');
          return;
        }
        if (!state.trim()) {
          setStepError('Please select your State.');
          return;
        }
      }
    }

    // STEP 3: BODY MEASUREMENTS
    if (currentStep === 3) {
      if (currentWeightKg < 30 || currentWeightKg > 280) {
        setStepError('Please enter a realistic current weight.');
        return;
      }
      if (currentHeightCm < 100 || currentHeightCm > 240) {
        setStepError('Please enter a realistic height.');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finalizeAssessment();
    }
  };

  const finalizeAssessment = () => {
    const targets = calculateTargets({
      age,
      currentWeightKg,
      targetWeightKg,
      currentHeightCm,
      gender,
      primaryGoal,
    });

    const finalCity = skipLocation ? '' : city.trim();
    const finalState = skipLocation ? '' : state.trim();
    const finalLocality = skipLocation ? '' : locality.trim();

    const localDiet = generateLocalDietPlan({
      state: finalState,
      city: finalCity,
      locality: finalLocality,
      dietaryPreference,
      budget: dailyBudget,
      allergies,
      dislikedFoods,
      mealsPerDay,
      targetCalories: targets.dailyCalorieTarget,
      proteinTargetG: targets.dailyProteinTargetG,
    });

    const finalProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: initialEmail,
      fullName,
      age,
      dateOfBirth: dateOfBirth || undefined,
      gender,
      country,
      state: finalState,
      city: finalCity,
      locality: finalLocality,
      isLocationSkipped: skipLocation,
      weightUnit,
      heightUnit,
      currentWeightKg,
      targetWeightKg,
      currentHeightCm,
      desiredHeightCm,
      primaryGoal,
      experienceLevel,
      equipment,
      dietaryPreference,
      allergies,
      dislikedFoods,
      dailyBudget,
      mealsPerDay,
      regularFoods,
      dailyCalorieTarget: targets.dailyCalorieTarget,
      dailyProteinTargetG: targets.dailyProteinTargetG,
      dailyCarbsTargetG: targets.dailyCarbsTargetG,
      dailyFatTargetG: targets.dailyFatTargetG,
      dailyHydrationTargetMl: targets.dailyHydrationTargetMl,
      dailyMovementTargetKcal: targets.dailyMovementTargetKcal,
      localDiet,
      selectedTrack: selectedTrack || 'both',
      calisthenicsMastery: [],
      hasCompletedOnboarding: true,
      createdAt: new Date().toISOString(),
      isTeenager,
    };

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#A3E635', '#10B981', '#34D399', '#F8FAFC'],
    });

    onComplete(finalProfile);
  };

  // Step Titles
  const stepTitles = [
    'Fitness Interest',
    'Personal Information & Location',
    'Body Measurements & Biometrics',
    'Fitness Goals & Equipment',
    'Diet Preferences & Budget',
    'Bio-Precision Local Protocol',
  ];

  return (
    <div className="min-h-screen bg-[#0A0D0E] text-[#F8FAFC] py-8 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col justify-between selection:bg-[#A3E635] selection:text-[#0A0D0E]">
      
      {/* Top Wizard Bar */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#10B981]/15 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-ping" />
            <span className="font-display font-bold text-lg text-[#F8FAFC]">
              AURAMORPH Assessment Wizard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#94A3B8]">
              Step <strong className="text-[#A3E635]">{currentStep}</strong> of {totalSteps}
            </span>
            <a
              href="https://www.instagram.com/dr.monomaniac/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded bg-[#182022] hover:bg-[#202b2e] border border-[#A3E635]/40 hover:border-[#A3E635] text-[10px] font-mono font-bold text-[#A3E635] inline-flex items-center gap-1 transition-all"
            >
              <span>MADE BY AARAV JAKHAR</span>
              <span className="text-[9px] text-[#4ADE80]">(@dr.monomaniac)</span>
            </a>
          </div>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-mono text-[#94A3B8] mb-2">
            <span>{stepTitles[currentStep - 1]}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% COMPLETED</span>
          </div>
          <div className="w-full bg-[#111618] border border-[#10B981]/20 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-[#10B981] to-[#A3E635] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(163,230,53,0.5)]"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          {/* Step Pill Indicators */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mt-3">
            {[1, 2, 3, 4, 5, 6].map((step) => {
              const isPast = step < currentStep;
              const isCurrent = step === currentStep;
              return (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all ${
                    isPast
                      ? 'bg-[#10B981]'
                      : isCurrent
                      ? 'bg-[#A3E635] shadow-[0_0_8px_rgba(163,230,53,0.8)]'
                      : 'bg-[#182022]'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Step Error Notification */}
        {stepError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{stepError}</span>
          </div>
        )}

        {/* Step Content Container */}
        <div className="bg-[#111618] border border-[#10B981]/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
          
          {/* STEP 1: WHAT IS YOUR FITNESS INTEREST? */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26143B] border border-[#C084FC]/50 text-xs font-mono text-[#C084FC] mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                  STEP 1 · MANDATORY PATHWAY ONBOARDING
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#F8FAFC] tracking-tight uppercase">
                  WHAT IS YOUR FITNESS INTEREST?
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5">
                  Select your primary fitness interest below. This configures your personalized workout programming, nutritional protocols, and dashboard experience.
                </p>
              </div>

              {/* 3 Large Selectable Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 pt-2">
                
                {/* 1. FITNESS & NUTRITION */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectTrack('fitness')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelectTrack('fitness');
                  }}
                  className={`group relative rounded-2xl p-6 sm:p-7 border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between text-left select-none ${
                    selectedTrack === 'fitness'
                      ? 'border-[#C084FC] bg-[#1E112E] shadow-[0_0_30px_rgba(192,132,252,0.35)] ring-2 ring-[#C084FC]'
                      : 'border-[#10B981]/25 bg-[#0A0D0E] hover:border-[#C084FC]/50 hover:bg-[#140E20]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                        selectedTrack === 'fitness'
                          ? 'bg-[#2E184D] border-[#C084FC] text-[#C084FC] shadow-[0_0_15px_rgba(192,132,252,0.4)]'
                          : 'bg-[#182022] border-[#10B981]/30 text-[#A3E635]'
                      }`}>
                        <Dumbbell className="w-6 h-6" />
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedTrack === 'fitness'
                          ? 'border-[#C084FC] bg-[#C084FC] text-[#0A0D0E]'
                          : 'border-[#475569] bg-[#111618]'
                      }`}>
                        {selectedTrack === 'fitness' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A3E635] font-semibold">
                        Pathway 1
                      </span>
                      <h3 className="text-lg sm:text-xl font-display font-extrabold text-[#F8FAFC] tracking-tight mt-0.5">
                        FITNESS & NUTRITION
                      </h3>
                    </div>

                    <ul className="space-y-2.5 text-xs text-[#CBD5E1] pt-3 border-t border-[#10B981]/15">
                      <li className="flex items-start gap-2">
                        <span className="text-[#C084FC] font-bold mt-0.5">›</span>
                        <span>Personalized Indian diet plans.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#C084FC] font-bold mt-0.5">›</span>
                        <span>Fitness and workout routines.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#10B981]/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                    <span>Gym & Macro Science</span>
                    <span className={selectedTrack === 'fitness' ? 'text-[#C084FC] font-bold' : 'text-[#64748B]'}>
                      {selectedTrack === 'fitness' ? '✓ Selected' : 'Click to select'}
                    </span>
                  </div>
                </div>

                {/* 2. CALISTHENICS */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectTrack('calisthenics')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelectTrack('calisthenics');
                  }}
                  className={`group relative rounded-2xl p-6 sm:p-7 border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between text-left select-none ${
                    selectedTrack === 'calisthenics'
                      ? 'border-[#C084FC] bg-[#1E112E] shadow-[0_0_30px_rgba(192,132,252,0.35)] ring-2 ring-[#C084FC]'
                      : 'border-[#A855F7]/30 bg-[#0A0D0E] hover:border-[#C084FC]/50 hover:bg-[#140E20]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                        selectedTrack === 'calisthenics'
                          ? 'bg-[#2E184D] border-[#C084FC] text-[#C084FC] shadow-[0_0_15px_rgba(192,132,252,0.4)]'
                          : 'bg-[#181224] border-[#A855F7]/40 text-[#C084FC]'
                      }`}>
                        <Zap className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedTrack === 'calisthenics'
                          ? 'border-[#C084FC] bg-[#C084FC] text-[#0A0D0E]'
                          : 'border-[#475569] bg-[#111618]'
                      }`}>
                        {selectedTrack === 'calisthenics' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C084FC] font-semibold">
                        Pathway 2 · Academy
                      </span>
                      <h3 className="text-lg sm:text-xl font-display font-extrabold text-[#F8FAFC] tracking-tight mt-0.5">
                        CALISTHENICS
                      </h3>
                    </div>

                    <ul className="space-y-2.5 text-xs text-[#CBD5E1] pt-3 border-t border-[#A855F7]/20">
                      <li className="flex items-start gap-2">
                        <span className="text-[#C084FC] font-bold mt-0.5">›</span>
                        <span>Learn bodyweight exercises.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#C084FC] font-bold mt-0.5">›</span>
                        <span>Master calisthenics skills and tricks.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#C084FC] font-bold mt-0.5">›</span>
                        <span>Follow step-by-step video tutorials.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#A855F7]/15 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                    <span>Bodyweight Mastery</span>
                    <span className={selectedTrack === 'calisthenics' ? 'text-[#C084FC] font-bold' : 'text-[#64748B]'}>
                      {selectedTrack === 'calisthenics' ? '✓ Selected' : 'Click to select'}
                    </span>
                  </div>
                </div>

                {/* 3. BOTH */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectTrack('both')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelectTrack('both');
                  }}
                  className={`group relative rounded-2xl p-6 sm:p-7 border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between text-left select-none ${
                    selectedTrack === 'both'
                      ? 'border-[#C084FC] bg-[#1E112E] shadow-[0_0_30px_rgba(192,132,252,0.35)] ring-2 ring-[#C084FC]'
                      : 'border-[#10B981]/25 bg-[#0A0D0E] hover:border-[#C084FC]/50 hover:bg-[#140E20]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                        selectedTrack === 'both'
                          ? 'bg-gradient-to-br from-[#182022] to-[#2E184D] border-[#C084FC] text-[#F8FAFC] shadow-[0_0_15px_rgba(192,132,252,0.4)]'
                          : 'bg-[#182022] border-[#A3E635]/40 text-[#A3E635]'
                      }`}>
                        <Sparkles className="w-6 h-6 text-[#A3E635]" />
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedTrack === 'both'
                          ? 'border-[#C084FC] bg-[#C084FC] text-[#0A0D0E]'
                          : 'border-[#475569] bg-[#111618]'
                      }`}>
                        {selectedTrack === 'both' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E879F9] font-semibold">
                        Pathway 3 · Complete
                      </span>
                      <h3 className="text-lg sm:text-xl font-display font-extrabold text-[#F8FAFC] tracking-tight mt-0.5">
                        BOTH
                      </h3>
                    </div>

                    <ul className="space-y-2.5 text-xs text-[#CBD5E1] pt-3 border-t border-[#10B981]/15">
                      <li className="flex items-start gap-2">
                        <span className="text-[#C084FC] font-bold mt-0.5">›</span>
                        <span>Access all Fitness & Nutrition features.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#C084FC] font-bold mt-0.5">›</span>
                        <span>Access the complete Calisthenics Academy.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#10B981]/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                    <span>Complete System</span>
                    <span className={selectedTrack === 'both' ? 'text-[#C084FC] font-bold' : 'text-[#64748B]'}>
                      {selectedTrack === 'both' ? '✓ Selected' : 'Click to select'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Selection status notification */}
              <div className="p-3.5 rounded-xl bg-[#140E20] border border-[#A855F7]/30 flex items-center justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Active Selection:</span>
                <span className="text-[#C084FC] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C084FC]" />
                  {selectedTrack === 'fitness'
                    ? 'Fitness & Nutrition Track Selected'
                    : selectedTrack === 'calisthenics'
                    ? 'Calisthenics Academy Track Selected'
                    : selectedTrack === 'both'
                    ? 'Both Protocols Track Selected'
                    : 'Please select one card above to continue'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F8FAFC]">
                  Personal Information & Location
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  Location is critical: we use your state and city to recommend authentic, budget-friendly Indian nutrition available in your local markets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Jakhar"
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-4 py-2.5 text-sm text-[#F8FAFC] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase">
                      Date of Birth (Optional)
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => handleDobChange(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-4 py-2 text-sm text-[#F8FAFC] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      min={12}
                      max={95}
                      className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-4 py-2 text-sm text-[#F8FAFC] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Age-Group Personalization Experience (Teenager <18 vs Adult 18+) */}
              {isTeenager ? (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-purple-200 text-xs space-y-2 shadow-[0_0_20px_rgba(168,85,247,0.12)]">
                  <div className="flex items-center gap-2 font-bold text-purple-300">
                    <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>TEENAGER DEVELOPMENT PROTOCOL ACTIVE (&lt;18 YEARS)</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-bold">&bull;</span>
                      <span><strong>Healthy Growth First:</strong> Focus on natural physical development, athletic conditioning, posture, and mobility.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span><strong>Strict Safety:</strong> Zero extreme weight loss, zero restrictive cutting diets, and zero calorie-deficit challenges.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-purple-400 font-bold">&bull;</span>
                      <span><strong>Nourishing Indian Diet:</strong> Wholesome milk, curd, paneer, chana, dal, and seasonal greens to support bone mineralization.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span><strong>Honest Science:</strong> No false height promises; guidance includes parental/guardian consultation.</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#111618] border border-[#10B981]/30 text-xs space-y-1 text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-[#A3E635]">
                    <Sparkles className="w-4 h-4 text-[#A3E635] shrink-0" />
                    <span>ADULT FITNESS &amp; RECOMPOSITION PROTOCOL (18+ YEARS)</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    Personalized fitness, progressive hypertrophy, spinal decompression, and targeted nutrition calibrated to your body composition goals.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase">
                  Gender (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 px-3 text-xs rounded-xl border text-center transition-all ${
                        gender === g
                          ? 'bg-[#182022] border-[#A3E635] text-[#A3E635] font-semibold shadow-[0_0_10px_rgba(163,230,53,0.15)]'
                          : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Fields */}
              <div className="pt-2 border-t border-[#10B981]/15">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#A3E635]" />
                    <span className="text-xs font-mono text-[#A3E635] font-bold uppercase tracking-wider">
                      Geographic Nutrition Mapping
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    {skipLocation ? 'All-India General Mode' : 'City Required for Local Mandi Intel'}
                  </span>
                </div>

                <div className={`space-y-3 transition-opacity ${skipLocation ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        disabled={skipLocation}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase">
                        State *
                      </label>
                      <select
                        value={state}
                        disabled={skipLocation}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] outline-none"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s} className="bg-[#111618] text-[#F8FAFC]">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase flex items-center justify-between">
                        <span>City *</span>
                        <span className="text-[10px] text-[#A3E635] lowercase font-semibold">required</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        disabled={skipLocation}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Gurugram / Mumbai / Jaipur / Pune"
                        className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 uppercase">
                      Locality / Area (Optional)
                    </label>
                    <input
                      type="text"
                      value={locality}
                      disabled={skipLocation}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Sector 14 / Cyber City / Bandra / Koramangala"
                      className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                    />
                    <p className="text-[11px] text-[#64748B] mt-1 font-mono">
                      Optional neighborhood details help locate nearby sabzi mandis & fresh dairies.
                    </p>
                  </div>
                </div>

                {/* Skip Location Option (Requirement 6) */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20 hover:border-[#10B981]/40 transition-colors">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipLocation}
                      onChange={(e) => setSkipLocation(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#A3E635] cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#F8FAFC] block">
                        Skip location for now (Use general Indian diet plan)
                      </span>
                      <span className="text-[#94A3B8] text-[11px] block mt-0.5">
                        Local diet recommendations require a city. If you skip, you will receive an All-India balanced diet plan and can update your city anytime from My Profile.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BODY MEASUREMENTS & HEALTH REALITY CHECK */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F8FAFC]">
                    Body Measurements
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                    Precision baseline to calibrate your daily deficit and protein synthesis requirements.
                  </p>
                </div>

                {/* Unit Toggles */}
                <div className="flex items-center gap-2 bg-[#0A0D0E] p-1 rounded-xl border border-[#10B981]/20">
                  <div className="flex rounded-lg overflow-hidden border border-[#10B981]/20">
                    <button
                      type="button"
                      onClick={() => setWeightUnit('kg')}
                      className={`px-2.5 py-1 text-xs font-mono font-medium ${
                        weightUnit === 'kg' ? 'bg-[#A3E635] text-[#0A0D0E] font-bold' : 'text-[#94A3B8]'
                      }`}
                    >
                      KG
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit('lbs')}
                      className={`px-2.5 py-1 text-xs font-mono font-medium ${
                        weightUnit === 'lbs' ? 'bg-[#A3E635] text-[#0A0D0E] font-bold' : 'text-[#94A3B8]'
                      }`}
                    >
                      LBS
                    </button>
                  </div>

                  <div className="flex rounded-lg overflow-hidden border border-[#10B981]/20">
                    <button
                      type="button"
                      onClick={() => setHeightUnit('cm')}
                      className={`px-2.5 py-1 text-xs font-mono font-medium ${
                        heightUnit === 'cm' ? 'bg-[#A3E635] text-[#0A0D0E] font-bold' : 'text-[#94A3B8]'
                      }`}
                    >
                      CM
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightUnit('ft')}
                      className={`px-2.5 py-1 text-xs font-mono font-medium ${
                        heightUnit === 'ft' ? 'bg-[#A3E635] text-[#0A0D0E] font-bold' : 'text-[#94A3B8]'
                      }`}
                    >
                      FT
                    </button>
                  </div>
                </div>
              </div>

              {/* Weight Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-[#94A3B8] uppercase flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#A3E635]" />
                      Current Weight ({weightUnit})
                    </label>
                    <span className="text-xs font-mono text-[#A3E635]">
                      {currentWeightKg.toFixed(1)} kg
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={displayedCurrentWeight}
                    onChange={(e) => handleWeightChange(e.target.value, false)}
                    className="w-full bg-[#111618] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-4 py-2.5 text-lg font-mono font-bold text-[#F8FAFC] outline-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-[#94A3B8] uppercase flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#10B981]" />
                      Target Weight ({weightUnit})
                    </label>
                    <span className="text-xs font-mono text-[#10B981]">
                      {targetWeightKg.toFixed(1)} kg
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={displayedTargetWeight}
                    onChange={(e) => handleWeightChange(e.target.value, true)}
                    className="w-full bg-[#111618] border border-[#10B981]/30 focus:border-[#10B981] rounded-xl px-4 py-2.5 text-lg font-mono font-bold text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              {/* Height Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-[#94A3B8] uppercase flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#A3E635]" />
                      Current Height ({heightUnit})
                    </label>
                    <span className="text-xs font-mono text-[#A3E635]">
                      {currentHeightCm} cm ({Math.floor(currentHeightCm / 30.48)}'{Math.round((currentHeightCm % 30.48) / 2.54)}")
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={displayedCurrentHeight}
                    onChange={(e) => handleHeightChange(e.target.value, false)}
                    className="w-full bg-[#111618] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-4 py-2.5 text-lg font-mono font-bold text-[#F8FAFC] outline-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono text-[#94A3B8] uppercase flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#94A3B8]" />
                      Desired Height ({heightUnit})
                    </label>
                    <span className="text-xs font-mono text-[#94A3B8]">
                      {desiredHeightCm} cm
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={displayedDesiredHeight}
                    onChange={(e) => handleHeightChange(e.target.value, true)}
                    className="w-full bg-[#111618] border border-[#10B981]/30 focus:border-[#94A3B8] rounded-xl px-4 py-2.5 text-lg font-mono font-bold text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              {/* CRITICAL HEALTH DISCLAIMER: Scientific Reality on Height */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#182022] border border-[#10B981]/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#A3E635] font-bold">
                  <ShieldAlert className="w-4 h-4 text-[#A3E635]" />
                  <span>SCIENTIFIC INTEGRITY & HEALTH ADVISORY: ADULT HEIGHT BIOLOGY</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  <strong className="text-[#F8FAFC]">No False Promises:</strong> In post-pubertal adults (typically age 18–21+), epiphyseal growth plates have permanently fused. <strong className="text-amber-300">Adult height cannot be increased through diet, exercises, supplements, or stretching.</strong>
                </p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  What training <em className="text-[#A3E635]">does</em> accomplish is decompressing intervertebral discs (restoring 0.5–1.5 cm of posture loss), strengthening erector spinae, and rectifying forward-head posture and anterior pelvic tilt. We engineer realistic posture alignment, athletic proportion, and core stability.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: FITNESS GOALS & EQUIPMENT */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F8FAFC]">
                  Fitness Goals & Training Access
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  Select your primary objective to configure metabolic burn rates and exercise splits.
                </p>
              </div>

              {/* Goal Cards */}
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase">
                  Primary Fitness Objective
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'Healthy Weight Management',
                      label: 'Healthy Weight Management',
                      desc: 'Fat reduction with lean muscle preservation via balanced deficit.',
                    },
                    {
                      id: 'Muscle Building',
                      label: 'Muscle Building',
                      desc: 'Hypertrophy and progressive volume overload with caloric surplus.',
                    },
                    {
                      id: 'Strength Development',
                      label: 'Strength Development',
                      desc: 'Heavy compound power (squat, bench, deadlift) and CNS adaptation.',
                    },
                    {
                      id: 'Improving Fitness',
                      label: 'Improving Fitness',
                      desc: 'Aerobic stamina, VO2 max elevation, agility, and joint resilience.',
                    },
                    {
                      id: 'General Health and Wellness',
                      label: 'General Health and Wellness',
                      desc: 'Sustainable longevity, metabolic balance, flexibility, and daily energy.',
                    },
                  ].map((goal) => {
                    const isSelected = primaryGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => setPrimaryGoal(goal.id as FitnessGoal)}
                        className={`p-4 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-[#182022] border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.18)]'
                            : 'bg-[#0A0D0E] border-[#10B981]/20 hover:border-[#10B981]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-sm font-display font-bold ${
                              isSelected ? 'text-[#A3E635]' : 'text-[#F8FAFC]'
                            }`}
                          >
                            {goal.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />}
                        </div>
                        <p className="text-xs text-[#94A3B8]">{goal.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Beginner', desc: '0 – 1 year training' },
                    { id: 'Intermediate', desc: '1 – 3 years regular lifting' },
                    { id: 'Advanced', desc: '3+ years structured athletic training' },
                  ].map((lvl) => {
                    const isSelected = experienceLevel === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setExperienceLevel(lvl.id as ExperienceLevel)}
                        className={`p-3 rounded-xl text-center border transition-all ${
                          isSelected
                            ? 'bg-[#182022] border-[#A3E635] text-[#A3E635] font-semibold'
                            : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        <div className="text-xs font-bold">{lvl.id}</div>
                        <div className="text-[10px] text-[#64748B] mt-0.5">{lvl.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Equipment Access */}
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase">
                  Available Workout Equipment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'No equipment', label: 'No Equipment', desc: 'Bodyweight & calisthenics' },
                    { id: 'Dumbbells', label: 'Dumbbells', desc: 'Pair of dumbbells' },
                    { id: 'Resistance bands', label: 'Resistance Bands', desc: 'Latex loops & bands' },
                    { id: 'Full gym access', label: 'Full Gym Access', desc: 'Barbells, cables & machines' },
                  ].map((eq) => {
                    const isSelected = equipment === eq.id;
                    return (
                      <button
                        key={eq.id}
                        type="button"
                        onClick={() => setEquipment(eq.id as EquipmentLevel)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-[#182022] border-[#A3E635] text-[#A3E635]'
                            : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#F8FAFC]">{eq.label}</div>
                        <div className="text-[10px] text-[#64748B] mt-1">{eq.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FOOD PREFERENCES & BUDGET */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F8FAFC]">
                  Food Preferences & Local Budget
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  We formulate high-protein, nutrient-dense meal templates using accessible Indian whole foods.
                </p>
              </div>

              {/* Dietary Category */}
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase">
                  Dietary Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Vegetarian', 'Eggetarian', 'Non-vegetarian', 'Vegan'] as const).map((pref) => {
                    const isSelected = dietaryPreference === pref;
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setDietaryPreference(pref)}
                        className={`p-3.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-[#182022] border-[#A3E635] text-[#A3E635] font-bold shadow-[0_0_12px_rgba(163,230,53,0.15)]'
                            : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        <div className="text-xs">{pref}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daily Food Budget */}
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#A3E635]" />
                  Daily Food Budget
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {([
                    'Budget Friendly (₹120–250/day)',
                    'Balanced (₹250–450/day)',
                    'Flexible (₹450+/day)',
                  ] as const).map((b) => {
                    const isSelected = dailyBudget === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setDailyBudget(b)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#182022] border-[#A3E635] text-[#A3E635] font-semibold'
                            : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#F8FAFC]">{b.split('(')[0]}</div>
                        <div className="text-[11px] text-[#A3E635] font-mono mt-0.5">
                          {b.includes('(') ? `(${b.split('(')[1]}` : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#64748B] mt-1 font-mono">
                  We prioritize dal, paneer, curd, chana, and seasonal vegetables to give you maximum protein per rupee.
                </p>
              </div>

              {/* Number of Meals */}
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase">
                  Preferred Number of Meals Per Day
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMealsPerDay(m)}
                      className={`py-2 text-xs rounded-xl border text-center transition-all ${
                        mealsPerDay === m
                          ? 'bg-[#182022] border-[#A3E635] text-[#A3E635] font-bold'
                          : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8]'
                      }`}
                    >
                      {m} Meals
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies Selection */}
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase">
                  Food Allergies / Intolerances
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ALLERGIES.map((item) => {
                    const isSelected = allergies.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAllergy(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                          isSelected
                            ? 'bg-[#182022] border-[#A3E635] text-[#A3E635] font-bold'
                            : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Foods Disliked */}
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase">
                  Foods You Dislike (Excluded from recommendations)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_DISLIKED_FOODS.map((food) => {
                    const isDisliked = dislikedFoods.includes(food);
                    return (
                      <button
                        key={food}
                        type="button"
                        onClick={() => toggleDislike(food)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                          isDisliked
                            ? 'bg-red-950/40 border-red-500/50 text-red-300 font-semibold'
                            : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8]'
                        }`}
                      >
                        {food} {isDisliked ? '✕' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Regularly Eaten Indian Staples */}
              <div>
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase">
                  Foods You Regularly Eat (Select to retain familiarity)
                </label>
                <div className="flex flex-wrap gap-2">
                  {REGULAR_STAPLE_OPTIONS.map((food) => {
                    const isSelected = regularFoods.includes(food);
                    return (
                      <button
                        key={food}
                        type="button"
                        onClick={() => toggleRegularFood(food)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                          isSelected
                            ? 'bg-[#182022] border-[#10B981] text-[#4ADE80] font-medium'
                            : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8]'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {food}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: BIO-PRECISION LOCAL PROTOCOL REVIEW */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182022] border border-[#A3E635]/30 text-xs font-mono text-[#A3E635] mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                  LOCALIZED NUTRITION & BIO-ENGINEERING SYNTHESIS
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F8FAFC]">
                  Precision Plan for {fullName}
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  Engineered specifically for {city}, {state} ({dailyBudget}) using 100% {dietaryPreference.toLowerCase()} whole food principles.
                </p>
              </div>

              {/* Calculated Targets Matrix */}
              {(() => {
                const tg = calculateTargets({
                  age,
                  currentWeightKg,
                  targetWeightKg,
                  currentHeightCm,
                  gender,
                  primaryGoal,
                });
                const local = generateLocalDietPlan({
                  state,
                  city,
                  locality,
                  dietaryPreference,
                  budget: dailyBudget,
                  allergies,
                  dislikedFoods,
                  mealsPerDay,
                  targetCalories: tg.dailyCalorieTarget,
                  proteinTargetG: tg.dailyProteinTargetG,
                });

                return (
                  <div className="space-y-5">
                    {/* Metrics 4-Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20 text-center">
                        <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Daily Energy Target</span>
                        <span className="text-xl font-mono font-black text-[#A3E635]">{tg.dailyCalorieTarget}</span>
                        <span className="text-[10px] text-[#64748B] block">kcal / day</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20 text-center">
                        <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Protein Target</span>
                        <span className="text-xl font-mono font-black text-[#4ADE80]">{tg.dailyProteinTargetG}g</span>
                        <span className="text-[10px] text-[#64748B] block">Lean Sparing</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20 text-center">
                        <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Water Intake</span>
                        <span className="text-xl font-mono font-black text-cyan-400">{(tg.dailyHydrationTargetMl / 1000).toFixed(1)}L</span>
                        <span className="text-[10px] text-[#64748B] block">Optimal Hydration</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20 text-center">
                        <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Burn / Activity</span>
                        <span className="text-xl font-mono font-black text-orange-400">{tg.dailyMovementTargetKcal}</span>
                        <span className="text-[10px] text-[#64748B] block">kcal / day</span>
                      </div>
                    </div>

                    {/* Regional Staples & Mandi Intelligence */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#0A0D0E] border border-[#10B981]/25 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#A3E635]" />
                          <h4 className="text-xs font-mono font-bold text-[#A3E635] uppercase">
                            {local.region}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-[#94A3B8]">
                          Zero Imported Gimmicks
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {local.staples.map((staple) => (
                          <span
                            key={staple}
                            className="px-2.5 py-1 rounded-md bg-[#182022] border border-[#10B981]/30 text-xs font-mono text-[#F8FAFC]"
                          >
                            {staple}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-[#10B981]/15 text-xs text-[#94A3B8]">
                        {local.localShoppingTips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-[#A3E635] font-bold">✓</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meal Schedule Preview */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
                        Personalized Daily Meal Template
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {local.sampleMealPlan.slice(0, mealsPerDay).map((m, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20 space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-display font-bold text-[#F8FAFC]">{m.mealName}</span>
                              <span className="font-mono text-[#A3E635] text-[11px]">~{m.proteinG}g Pro</span>
                            </div>
                            <ul className="text-xs text-[#94A3B8] space-y-1 list-disc list-inside">
                              {m.items.map((item, itemIdx) => (
                                <li key={itemIdx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Medical Professional & Safety Disclaimer */}
                    <div className="p-4 rounded-xl bg-[#182022] border border-amber-500/30 text-xs text-[#94A3B8] space-y-2">
                      <div className="flex items-center gap-2 font-mono text-amber-300 font-bold">
                        <Stethoscope className="w-4 h-4 text-amber-400" />
                        <span>IMPORTANT HEALTH & SAFETY NOTICE</span>
                      </div>
                      <p>
                        The algorithms in AURAMORPH provide general exercise science and evidence-based nutrition education tailored to healthy adults. If you have pre-existing cardiovascular conditions, diabetes, renal diseases, or joint injuries, please consult with a qualified physician or registered dietitian before embarking on any training or caloric deficit regimen.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Navigation Controls: Back & Continue */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#10B981]/15">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setStepError('');
                  setCurrentStep((prev) => prev - 1);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#182022] hover:bg-[#202b2e] border border-[#10B981]/25 text-xs sm:text-sm font-medium text-[#F8FAFC] transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#94A3B8]" />
                <span>Back</span>
              </button>
            ) : onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Back to Login
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={validateAndProceed}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A3E635] hover:bg-[#b2f746] text-[#0A0D0E] font-display font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all transform active:scale-95"
            >
              <span>{currentStep === totalSteps ? 'Confirm & Launch My Plan' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Trust & Aarav Jakhar Signature Footer */}
      <footer className="pt-6 text-center text-xs text-[#64748B] flex flex-wrap items-center justify-center gap-3">
        <span>AURAMORPH · Transform Your Habits. Elevate Your Potential.</span>
        <span>·</span>
        <a
          href="https://www.instagram.com/dr.monomaniac/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[#A3E635] hover:underline inline-flex items-center gap-1"
        >
          <span>MADE BY AARAV JAKHAR</span>
          <span className="text-[10px] text-[#4ADE80]">(@dr.monomaniac)</span>
        </a>
        <span>·</span>
        <span>Biometric Data Stored Securely in Firestore</span>
      </footer>

    </div>
  );
};
