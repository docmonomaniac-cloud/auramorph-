import React, { useState } from 'react';
import { UserProfile } from '../types/user';
import { PathwayTrack } from '../types/calisthenics';
import {
  User,
  MapPin,
  Scale,
  Ruler,
  Target,
  Utensils,
  Dumbbell,
  ShieldCheck,
  Stethoscope,
  RefreshCw,
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronRight,
  HeartHandshake,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onRetakeAssessment: () => void;
  onSignOut: () => void;
  onUpdateProfile?: (updated: UserProfile) => Promise<void> | void;
  onRegeneratePlan?: () => Promise<void> | void;
  isRegeneratingPlan?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onRetakeAssessment,
  onSignOut,
  onUpdateProfile,
  onRegeneratePlan,
  isRegeneratingPlan,
}) => {
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorConsultRequested, setDoctorConsultRequested] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(profile.fullName);
  const [editAge, setEditAge] = useState(profile.age);
  const [editCurrentWeight, setEditCurrentWeight] = useState(profile.currentWeightKg);
  const [editTargetWeight, setEditTargetWeight] = useState(profile.targetWeightKg);
  const [editCurrentHeight, setEditCurrentHeight] = useState(profile.currentHeightCm);
  const [editDesiredHeight, setEditDesiredHeight] = useState(profile.desiredHeightCm);
  const [editGoal, setEditGoal] = useState(profile.primaryGoal);
  const [editDiet, setEditDiet] = useState(profile.dietaryPreference);
  const [editEquipment, setEditEquipment] = useState(profile.equipment);
  const [editExperience, setEditExperience] = useState(profile.experienceLevel);
  const [editBudget, setEditBudget] = useState(profile.dailyBudget);
  const [editMealsPerDay, setEditMealsPerDay] = useState(profile.mealsPerDay);
  const [editCity, setEditCity] = useState(profile.city || '');
  const [editState, setEditState] = useState(profile.state || '');
  const [editLocality, setEditLocality] = useState(profile.locality || '');
  const [editTrack, setEditTrack] = useState<PathwayTrack>(profile.selectedTrack || 'both');

  // Compute BMI
  const heightM = profile.currentHeightCm / 100;
  const bmi = Math.round((profile.currentWeightKg / (heightM * heightM)) * 10) / 10;

  let bmiCategory = 'Normal';
  let bmiColor = 'text-[#4ADE80]';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-400';
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-orange-400';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese Class';
    bmiColor = 'text-red-400';
  }

  const handleRequestConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorConsultRequested(true);
    setTimeout(() => {
      setShowDoctorModal(false);
      setDoctorConsultRequested(false);
    }, 2400);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Profile Identity Card */}
      <div className="bg-[#111618] border border-[#10B981]/20 rounded-2xl p-6 sm:p-7 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/5 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#182022] border-2 border-[#A3E635] flex items-center justify-center text-2xl font-bold font-display text-[#A3E635] shadow-[0_0_20px_rgba(163,230,53,0.2)]">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#F8FAFC]">
                  {profile.fullName}
                </h1>
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
              <p className="text-xs font-mono text-[#94A3B8] mt-0.5">{profile.email}</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                {profile.city && profile.city.trim() ? (
                  <span className="inline-flex items-center gap-1 text-[#A3E635] font-mono">
                    <MapPin className="w-3 h-3" />
                    {profile.city}, {profile.state} {profile.locality ? `(${profile.locality})` : ''}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-400 font-mono">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    All-India General (City not specified)
                  </span>
                )}
                <span className="text-[#64748B]">·</span>
                <span className="text-[#94A3B8] font-mono">Age: {profile.age}</span>
                <span className="text-[#64748B]">·</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    profile.isTeenager || profile.age < 18
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                  }`}
                >
                  {profile.isTeenager || profile.age < 18 ? '🌱 Teenager (<18)' : '⚡ Adult (18+)'}
                </span>
                <span className="text-[#64748B]">·</span>
                <span className="text-[#94A3B8] font-mono">{profile.gender || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A3E635] text-[#0A0D0E] font-display font-bold text-xs hover:bg-[#bef264] transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            {onRegeneratePlan && (
              <button
                onClick={() => onRegeneratePlan()}
                disabled={isRegeneratingPlan}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#182022] hover:bg-[#202b2e] border border-[#A3E635]/40 text-xs font-mono text-[#A3E635] transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingPlan ? 'animate-spin' : ''}`} />
                <span>{isRegeneratingPlan ? 'REGENERATING...' : 'REGENERATE MY PLAN'}</span>
              </button>
            )}
            <button
              onClick={onRetakeAssessment}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#182022] hover:bg-[#202b2e] border border-[#10B981]/30 hover:border-[#A3E635] text-xs font-mono text-[#F8FAFC] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Full Re-assessment</span>
            </button>
            <button
              onClick={onSignOut}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#182022] hover:bg-red-950/40 border border-[#10B981]/30 hover:border-red-500/50 text-xs font-mono text-red-300 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Measurements & Metabolic Targets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Body Measurements */}
        <div className="bg-[#111618] border border-[#10B981]/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-[#A3E635] uppercase flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#A3E635]" />
              Body Measurements
            </h3>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              Units: {profile.weightUnit.toUpperCase()} / {profile.heightUnit.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
              <span className="text-[#94A3B8]">Current Weight:</span>
              <strong className="text-[#F8FAFC] text-sm">{profile.currentWeightKg.toFixed(1)} kg</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
              <span className="text-[#94A3B8]">Target Weight:</span>
              <strong className="text-[#10B981] text-sm">{profile.targetWeightKg.toFixed(1)} kg</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
              <span className="text-[#94A3B8]">Current Height:</span>
              <strong className="text-[#F8FAFC] text-sm">
                {profile.currentHeightCm} cm ({Math.floor(profile.currentHeightCm / 30.48)}'{Math.round((profile.currentHeightCm % 30.48) / 2.54)}")
              </strong>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
              <span className="text-[#94A3B8]">Baseline BMI:</span>
              <strong className={`${bmiColor} text-sm`}>{bmi} ({bmiCategory})</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Goals & Equipment */}
        <div className="bg-[#111618] border border-[#10B981]/20 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-[#A3E635] uppercase flex items-center gap-2">
            <Target className="w-4 h-4 text-[#A3E635]" />
            Goals & Training Matrix
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15 space-y-1">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Primary Goal</span>
              <span className="font-display font-bold text-[#A3E635] text-sm">{profile.primaryGoal}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15 space-y-1">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Experience Level</span>
              <span className="font-mono text-[#F8FAFC]">{profile.experienceLevel}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15 space-y-1">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Equipment Access</span>
              <span className="font-mono text-[#F8FAFC]">{profile.equipment}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#140E20] border border-[#A855F7]/30 space-y-1">
              <span className="text-[10px] font-mono text-[#C084FC] uppercase block flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#C084FC]" />
                <span>Athlete Track</span>
              </span>
              <span className="font-mono text-[#F8FAFC] font-semibold">
                {profile.selectedTrack === 'calisthenics'
                  ? 'Calisthenics Academy'
                  : profile.selectedTrack === 'fitness'
                  ? 'Fitness & Nutrition'
                  : 'Both (Full Spectrum)'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Food Preferences & Budget */}
        <div className="bg-[#111618] border border-[#10B981]/20 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-[#A3E635] uppercase flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#A3E635]" />
            Dietary DNA
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
              <span className="text-[#94A3B8]">Diet Category:</span>
              <span className="font-mono font-bold text-[#A3E635]">{profile.dietaryPreference}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
              <span className="text-[#94A3B8]">Daily Budget:</span>
              <span className="font-mono text-[#F8FAFC] text-[11px]">{profile.dailyBudget.split('(')[0]}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
              <span className="text-[#94A3B8]">Meals / Day:</span>
              <span className="font-mono text-[#F8FAFC]">{profile.mealsPerDay} meals</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15">
              <span className="text-[#94A3B8]">Allergies:</span>
              <span className="font-mono text-amber-300 text-[11px]">{profile.allergies.join(', ')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Regional Mandi & Local Nutrition Intel */}
      <div className="bg-[#111618] border border-[#10B981]/20 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#A3E635]" />
            <h3 className="font-display font-bold text-base text-[#F8FAFC]">
              {profile.localDiet.region}
            </h3>
          </div>
          <span className="text-xs font-mono text-[#4ADE80] bg-[#182022] px-2.5 py-1 rounded-md border border-[#10B981]/30">
            Localized Whole Foods · No Imported Gimmicks
          </span>
        </div>

        <p className="text-xs text-[#94A3B8]">
          Based on your location in <strong>{profile.city}, {profile.state}</strong>, your recommended staples are prioritized for local mandi freshness, daily affordability, and maximum bioavailability.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {profile.localDiet.staples.map((staple) => (
            <div
              key={staple}
              className="p-2.5 rounded-lg bg-[#0A0D0E] border border-[#10B981]/15 text-xs font-mono text-center text-[#F8FAFC]"
            >
              {staple}
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-[#0A0D0E] border border-[#10B981]/20 space-y-2 text-xs text-[#94A3B8]">
          <span className="text-[11px] font-mono text-[#A3E635] uppercase font-bold block">
            Local Procurement Strategy
          </span>
          {profile.localDiet.localShoppingTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-[#A3E635] font-bold">✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health, Safety, and Medical Consultation Section */}
      <div className="bg-[#182022] border border-amber-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-xs uppercase">
              <Stethoscope className="w-4 h-4 text-amber-400" />
              <span>Qualified Healthcare Professional Consultation</span>
            </div>
            <p className="text-xs text-[#94A3B8] max-w-2xl">
              AURAMORPH encourages athletes with hypertension, thyroid imbalances, diabetes, or musculoskeletal injuries to review their workout volume and caloric deficit with a licensed physician.
            </p>
          </div>

          <button
            onClick={() => setShowDoctorModal(true)}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-mono font-semibold transition-all"
          >
            Request Healthcare Review
          </button>
        </div>

        {/* Height Disclaimer reminder */}
        <div className="pt-3 border-t border-[#10B981]/15 text-[11px] text-[#64748B] flex items-start gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
          <span>
            Height Reality Check: Epiphyseal growth plates fuse in adulthood. We focus on core decompression, postural realignment, and muscle symmetry.
          </span>
        </div>
      </div>

      {/* Doctor Consultation Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D0E]/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#111618] border border-[#10B981]/30 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-[#182022] text-amber-400 border border-amber-500/30">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#F8FAFC]">
                  Physician Consultation Referral
                </h3>
                <p className="text-xs text-[#94A3B8]">Pre-training medical clearance assistance</p>
              </div>
            </div>

            {doctorConsultRequested ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#A3E635] mx-auto animate-bounce" />
                <p className="text-xs font-semibold text-[#A3E635]">Medical Referral Summary Generated!</p>
                <p className="text-[11px] text-[#94A3B8]">
                  Your biometric overview and caloric targets have been compiled for your doctor review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestConsultation} className="space-y-3.5 mt-3">
                <p className="text-xs text-[#94A3B8]">
                  Enter your doctor's name or clinic preference. We will generate a downloadable summary of your AURAMORPH biometrics and localized diet protocol for their review.
                </p>
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">
                    Primary Care Doctor / Hospital Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Verma / Medanta Clinic"
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">
                    Any specific health concern or medication?
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Mild lower-back disc bulge, mild hypertension..."
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/25 focus:border-[#A3E635] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] outline-none resize-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDoctorModal(false)}
                    className="px-3.5 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-medium text-xs font-display hover:bg-[#b2f746]"
                  >
                    Generate Medical Clearance Slip
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile & Biometrics Modal (Requirement 9) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#111618] border border-[#A3E635]/40 rounded-2xl max-w-lg w-full p-6 space-y-4 my-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/15">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#A3E635]" />
                <h3 className="font-display font-bold text-base text-[#F8FAFC]">
                  Edit Profile & Biometrics
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                ✕ Close
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                const updated: UserProfile = {
                  ...profile,
                  fullName: editName.trim() || profile.fullName,
                  age: Number(editAge) || profile.age,
                  currentWeightKg: Number(editCurrentWeight) || profile.currentWeightKg,
                  targetWeightKg: Number(editTargetWeight) || profile.targetWeightKg,
                  currentHeightCm: Number(editCurrentHeight) || profile.currentHeightCm,
                  desiredHeightCm: Number(editDesiredHeight) || profile.desiredHeightCm,
                  primaryGoal: editGoal as any,
                  dietaryPreference: editDiet as any,
                  equipment: editEquipment as any,
                  experienceLevel: editExperience as any,
                  dailyBudget: editBudget as any,
                  mealsPerDay: Number(editMealsPerDay) || profile.mealsPerDay,
                  city: editCity.trim(),
                  state: editState.trim(),
                  locality: editLocality.trim(),
                  isLocationSkipped: !editCity.trim(),
                  selectedTrack: editTrack,
                  isTeenager: Number(editAge) < 18,
                };
                if (onUpdateProfile) {
                  await onUpdateProfile(updated);
                }
                setIsSaving(false);
                setIsEditModalOpen(false);
              }}
              className="space-y-4 text-xs font-mono"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(Number(e.target.value))}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                    min="12"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editCurrentWeight}
                    onChange={(e) => setEditCurrentWeight(Number(e.target.value))}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Target Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editTargetWeight}
                    onChange={(e) => setEditTargetWeight(Number(e.target.value))}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Current Height (cm)</label>
                  <input
                    type="number"
                    value={editCurrentHeight}
                    onChange={(e) => setEditCurrentHeight(Number(e.target.value))}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Desired Height (cm)</label>
                  <input
                    type="number"
                    value={editDesiredHeight}
                    onChange={(e) => setEditDesiredHeight(Number(e.target.value))}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">
                    City <span className="text-[10px] text-[#A3E635]">(for local diet)</span>
                  </label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="e.g. Gurugram / Mumbai / Pune"
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">State</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    placeholder="e.g. Haryana / Maharashtra"
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Locality / Area (Optional)</label>
                <input
                  type="text"
                  value={editLocality}
                  onChange={(e) => setEditLocality(e.target.value)}
                  placeholder="e.g. Sector 14 / Bandra / Koramangala"
                  className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
                />
                <p className="text-[10px] text-[#94A3B8] mt-1 font-mono">
                  {editCity.trim()
                    ? `Saving will automatically regenerate your diet plan using affordable foods available in ${editCity.trim()}.`
                    : 'Leaving city blank will generate a general Indian diet plan.'}
                </p>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Primary Fitness Goal</label>
                <select
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value as any)}
                  className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                >
                  <option value="Healthy Weight Management">Healthy Weight Management</option>
                  <option value="Muscle Building">Muscle Building</option>
                  <option value="Strength Development">Strength Development</option>
                  <option value="Improving Fitness">Improving Fitness</option>
                  <option value="General Health and Wellness">General Health and Wellness</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Diet Preference</label>
                  <select
                    value={editDiet}
                    onChange={(e) => setEditDiet(e.target.value as any)}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Non-vegetarian">Non-vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Equipment Access</label>
                  <select
                    value={editEquipment}
                    onChange={(e) => setEditEquipment(e.target.value as any)}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                  >
                    <option value="Full gym access">Full gym access</option>
                    <option value="Dumbbells">Dumbbells</option>
                    <option value="Resistance bands">Resistance bands</option>
                    <option value="No equipment">No equipment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Experience Level</label>
                  <select
                    value={editExperience}
                    onChange={(e) => setEditExperience(e.target.value as any)}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Meals Per Day</label>
                  <select
                    value={editMealsPerDay}
                    onChange={(e) => setEditMealsPerDay(Number(e.target.value))}
                    className="w-full bg-[#0A0D0E] border border-[#10B981]/30 focus:border-[#A3E635] rounded-xl px-3 py-2 text-[#F8FAFC] outline-none"
                  >
                    <option value={2}>2 Meals</option>
                    <option value={3}>3 Meals</option>
                    <option value={4}>4 Meals</option>
                    <option value={5}>5 Meals</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#C084FC] block mb-1.5 flex items-center gap-1.5 font-bold">
                  <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>Athlete Pathway Track</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditTrack('fitness')}
                    className={`py-2 px-2 rounded-xl text-center border text-[11px] transition-all ${
                      editTrack === 'fitness'
                        ? 'bg-[#182022] border-[#A3E635] text-[#A3E635] font-bold'
                        : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8]'
                    }`}
                  >
                    Fitness & Diet
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTrack('calisthenics')}
                    className={`py-2 px-2 rounded-xl text-center border text-[11px] transition-all ${
                      editTrack === 'calisthenics'
                        ? 'bg-[#211136] border-[#C084FC] text-[#C084FC] font-bold'
                        : 'bg-[#0A0D0E] border-[#A855F7]/20 text-[#94A3B8]'
                    }`}
                  >
                    Calisthenics
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTrack('both')}
                    className={`py-2 px-2 rounded-xl text-center border text-[11px] transition-all ${
                      editTrack === 'both'
                        ? 'bg-gradient-to-r from-[#182022] to-[#211136] border-[#A3E635] text-[#F8FAFC] font-bold'
                        : 'bg-[#0A0D0E] border-[#10B981]/20 text-[#94A3B8]'
                    }`}
                  >
                    Both Tracks
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#10B981]/15">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#A3E635] text-[#0A0D0E] font-display font-bold text-xs hover:bg-[#bef264] transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving & Generating Plan...' : 'Save & Regenerate Plan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
