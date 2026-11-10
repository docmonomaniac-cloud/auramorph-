import React, { useState } from 'react';
import { BiometricEntry } from '../types/fitness';
import { UserProfile } from '../types/user';
import { MetricChip } from './MetricChip';
import { ProgressionBar } from './ProgressionBar';
import { Activity, Plus, TrendingDown, Moon, Heart, Flame, ShieldCheck, Check, Scale } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BiometricsViewProps {
  history: BiometricEntry[];
  onAddEntry: (entry: BiometricEntry) => void;
  userProfile?: UserProfile;
}

export const BiometricsView: React.FC<BiometricsViewProps> = ({
  history,
  onAddEntry,
  userProfile,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [newWeight, setNewWeight] = useState('97.5');
  const [newBodyFat, setNewBodyFat] = useState('27.0');
  const [newSleep, setNewSleep] = useState('8.0');
  const [newRecovery, setNewRecovery] = useState('92');

  const latest = history[history.length - 1] || {
    weightKg: 98.0,
    bodyFatPct: 27.5,
    sleepHours: 8.0,
    restingHeartRate: 72,
    recoveryScore: 92,
    volumeTonnageKg: 5800,
  };

  const startWeight = userProfile?.currentWeightKg || history[0]?.weightKg || 98.0;
  const weightChange = Math.round((latest.weightKg - startWeight) * 10) / 10;
  const targetWeight = userProfile?.targetWeightKg || 82.0;
  const totalWeightGoal = Math.abs(startWeight - targetWeight);
  const weightLost = Math.round((startWeight - latest.weightKg) * 10) / 10;
  const weightDiff = Math.abs(latest.weightKg - targetWeight);
  const progressPct = totalWeightGoal > 0 ? Math.max(0, Math.min(100, ((totalWeightGoal - weightDiff) / totalWeightGoal) * 100)) : 100;

  // Chart coordinates calculation for SVG
  const minWeight = Math.min(...history.map((h) => h.weightKg), 80.0) - 1.0;
  const maxWeight = Math.max(...history.map((h) => h.weightKg), 100.0) + 1.0;
  const chartHeight = 160;
  const chartWidth = 580;

  const points = history.map((entry, idx) => {
    const x = (idx / (history.length - 1 || 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((entry.weightKg - minWeight) / (maxWeight - minWeight || 1)) * (chartHeight - 30) - 15;
    return { x, y, ...entry };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : '';

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: BiometricEntry = {
      date: new Date().toISOString().split('T')[0],
      dayLabel: `Day ${history.length + 1}`,
      weightKg: parseFloat(newWeight) || 49.5,
      bodyFatPct: parseFloat(newBodyFat) || 12.8,
      sleepHours: parseFloat(newSleep) || 8.0,
      restingHeartRate: 58,
      recoveryScore: parseInt(newRecovery) || 94,
      volumeTonnageKg: 4300,
    };
    onAddEntry(entry);
    setShowLogModal(false);
    confetti({ particleCount: 30, spread: 60, colors: ['#A3E635', '#10B981'] });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Transformation Header */}
      <div className="telemetry-card rounded-2xl p-5 sm:p-6 bg-[#111618]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10B981]/15 gap-3 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium text-[#A3E635] uppercase tracking-wider">
                {userProfile?.fullName || 'Athlete'} · Transformation & Biometrics Telemetry
              </span>
              <span className="text-xs text-[#64748B]">·</span>
              <span className="text-xs text-[#94A3B8]">Height: {userProfile?.currentHeightCm || 178} cm</span>
              <span className="text-xs text-[#64748B]">·</span>
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
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
              {userProfile?.primaryGoal || 'Healthy Weight Management'} Progress Stream
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Precision tracking of body recomposition, neuromuscular readiness, and systemic recovery toward {targetWeight.toFixed(1)} kg goal.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs sm:text-sm glow-lime hover:scale-[1.02] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Today's Biometrics</span>
          </button>
        </div>

        {/* Top Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <MetricChip
            label="Current Body Mass"
            value={latest.weightKg}
            unit="KG"
            dotColor="#A3E635"
            subLabel={`${weightLost >= 0 ? '-' : '+'}${Math.abs(Math.round(weightLost * 10) / 10)} kg towards 82kg`}
          />
          <MetricChip
            label="Body Fat Estimate"
            value={latest.bodyFatPct}
            unit="%"
            dotColor="#10B981"
            subLabel="Deficit Active"
          />
          <MetricChip
            label="Neuromuscular Readiness"
            value={latest.recoveryScore}
            unit="/ 100"
            dotColor="#4ADE80"
            subLabel="Optimal"
          />
          <MetricChip
            label="Deep Sleep Duration"
            value={latest.sleepHours}
            unit="HRS"
            dotColor="#ccff80"
            subLabel="8h Recovery Target"
          />
        </div>

        {/* Milestone Progression */}
        <div className="pt-2">
          <ProgressionBar
            progressPercentage={progressPct}
            label={`${userProfile?.fullName || 'Athlete'} Recomposition Milestone (Target: ${targetWeight.toFixed(1)} kg · Sustained Shred)`}
            currentValue={`${Math.max(0, weightLost).toFixed(1)} kg shredded`}
            targetValue={`${totalWeightGoal.toFixed(1)} kg total goal (${Math.round(progressPct)}%)`}
            heightClass="h-3"
            showPulseHead={true}
          />
        </div>
      </div>

      {/* Grid: Weight Trajectory Chart + Weekly Volume & Recovery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Weight Chart */}
        <div className="lg:col-span-8 glass-panel-elevated rounded-2xl p-5 sm:p-6 border border-[#10B981]/25">
          <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/15 mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#A3E635]" />
              <h3 className="font-display font-semibold text-sm sm:text-base text-[#F8FAFC]">
                {userProfile?.fullName || 'Athlete'} Mass Trajectory & Deficit Trendline
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#A3E635]">
              <span>Target: 82.0 kg · Height: 178 cm</span>
            </div>
          </div>

          {/* SVG Chart with glowing path */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-44 overflow-visible"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A3E635" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#A3E635" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Horizontal reference grid lines */}
                {[0.25, 0.5, 0.75].map((pct, i) => (
                  <line
                    key={i}
                    x1="10"
                    y1={chartHeight * pct}
                    x2={chartWidth - 10}
                    y2={chartHeight * pct}
                    stroke="rgba(16, 185, 129, 0.1)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area under curve */}
                {areaD && <path d={areaD} fill="url(#chartGradient)" />}

                {/* Main line */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#A3E635"
                    strokeWidth="2.5"
                    filter="url(#glow)"
                  />
                )}

                {/* Data points */}
                {points.map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#0A0D0E"
                      stroke="#A3E635"
                      strokeWidth="2"
                    />
                    {/* Value label */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      fill="#F8FAFC"
                      fontSize="10"
                      fontFamily="Space Grotesk"
                      textAnchor="middle"
                      className="font-semibold tabular-nums"
                    >
                      {pt.weightKg}
                    </text>
                    {/* Day label */}
                    <text
                      x={pt.x}
                      y={chartHeight - 4}
                      fill="#64748B"
                      fontSize="10"
                      fontFamily="Space Grotesk"
                      textAnchor="middle"
                    >
                      {pt.dayLabel}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#94A3B8] mt-3 pt-3 border-t border-[#10B981]/15">
            <span>Steady rate of -0.45 kg/week within healthy sports science boundary.</span>
            <span className="text-[#A3E635] font-mono font-medium">Metabolic Health: Peak</span>
          </div>
        </div>

        {/* Right Column: Weekly Volume Load & CNS Readiness breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel-elevated rounded-2xl p-5 border border-[#10B981]/25">
            <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/15 mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#A3E635]" />
                <h3 className="font-display font-semibold text-sm text-[#F8FAFC]">
                  Weekly Volume Tonnage
                </h3>
              </div>
              <span className="text-xs font-mono text-[#A3E635]">51,850 kg</span>
            </div>

            <div className="space-y-2">
              {history.map((day) => {
                const maxDayVol = 12000;
                const barPct = (day.volumeTonnageKg / maxDayVol) * 100;

                return (
                  <div key={day.date} className="flex items-center gap-2 text-xs">
                    <span className="w-8 font-mono text-[#64748B]">{day.dayLabel}</span>
                    <div className="flex-1 h-2 bg-[#182022] rounded-full overflow-hidden border border-[#10B981]/15">
                      <div
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#A3E635]"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    <span className="w-16 text-right font-mono text-[#F8FAFC] tabular-nums">
                      {day.volumeTonnageKg > 0 ? `${day.volumeTonnageKg.toLocaleString()}kg` : 'Rest'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recovery Readiness Box */}
          <div className="telemetry-card rounded-2xl p-5 bg-[#111618] border border-[#10B981]/20">
            <div className="flex items-center gap-2.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
              <h4 className="font-display font-semibold text-sm text-[#F8FAFC]">
                CNS & Sleep Telemetry
              </h4>
            </div>
            <div className="space-y-2 text-xs text-[#94A3B8]">
              <div className="flex items-center justify-between">
                <span>Resting Heart Rate</span>
                <span className="font-mono text-[#F8FAFC] font-semibold">{latest.restingHeartRate} BPM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sleep Architecture</span>
                <span className="font-mono text-[#F8FAFC] font-semibold">{latest.sleepHours} Hours (92% Deep/REM)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Central Fatigue Status</span>
                <span className="font-mono text-[#A3E635] font-semibold">Ready for Heavy Loads</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveLog}
            className="w-full max-w-md rounded-2xl glass-panel-elevated p-6 border border-[#10B981]/30 shadow-2xl"
          >
            <h3 className="font-display font-bold text-lg text-[#F8FAFC] mb-4">
              Log Today's Biometric Measurements
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Body Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Body Fat (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newBodyFat}
                  onChange={(e) => setNewBodyFat(e.target.value)}
                  className="w-full bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Sleep Duration (hrs)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newSleep}
                  onChange={(e) => setNewSleep(e.target.value)}
                  className="w-full bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Recovery Score (1-100)
                </label>
                <input
                  type="number"
                  value={newRecovery}
                  onChange={(e) => setNewRecovery(e.target.value)}
                  className="w-full bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#A3E635]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="flex-1 py-2 rounded-lg bg-[#111618] border border-[#10B981]/20 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs glow-lime hover:scale-[1.01]"
              >
                Save Biometrics
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
