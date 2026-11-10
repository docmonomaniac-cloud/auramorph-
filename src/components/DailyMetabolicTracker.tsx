import React, { useState } from 'react';
import { Activity, Droplets, Dumbbell, Flame, Plus, Settings2, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTimerBeep } from '../utils/audio';

interface DailyMetabolicTrackerProps {
  currentProtein: number;
  proteinTarget: number;
  currentHydrationMl: number;
  hydrationTargetMl: number;
  currentMovementKcal: number;
  movementTargetKcal: number;
  onAddProtein: (amountG: number) => void;
  onAddHydration: (amountMl: number) => void;
  onAddMovement: (amountKcal: number) => void;
  onUpdateTargets: (targets: { protein: number; hydration: number; movement: number }) => void;
}

export const DailyMetabolicTracker: React.FC<DailyMetabolicTrackerProps> = ({
  currentProtein,
  proteinTarget,
  currentHydrationMl,
  hydrationTargetMl,
  currentMovementKcal,
  movementTargetKcal,
  onAddProtein,
  onAddHydration,
  onAddMovement,
  onUpdateTargets,
}) => {
  const [activeHoverRing, setActiveHoverRing] = useState<'all' | 'protein' | 'hydration' | 'movement'>('all');
  const [isCalibrateModalOpen, setIsCalibrateModalOpen] = useState(false);

  // Target calibration form state
  const [tempProteinTarget, setTempProteinTarget] = useState(proteinTarget);
  const [tempHydrationTarget, setTempHydrationTarget] = useState(hydrationTargetMl);
  const [tempMovementTarget, setTempMovementTarget] = useState(movementTargetKcal);

  // Percentages clamped between 0 and 100 for display, with raw overflow support
  const proteinPct = Math.min(100, Math.max(0, (currentProtein / proteinTarget) * 100));
  const hydrationPct = Math.min(100, Math.max(0, (currentHydrationMl / hydrationTargetMl) * 100));
  const movementPct = Math.min(100, Math.max(0, (currentMovementKcal / movementTargetKcal) * 100));

  const averageSyncPct = Math.round((proteinPct + hydrationPct + movementPct) / 3);

  // Ring 1 (Outer): Protein - Radius 114
  const r1 = 114;
  const c1 = 2 * Math.PI * r1;
  const strokeDashoffset1 = c1 - (proteinPct / 100) * c1;

  // Ring 2 (Middle): Hydration - Radius 88
  const r2 = 88;
  const c2 = 2 * Math.PI * r2;
  const strokeDashoffset2 = c2 - (hydrationPct / 100) * c2;

  // Ring 3 (Inner): Movement - Radius 62
  const r3 = 62;
  const c3 = 2 * Math.PI * r3;
  const strokeDashoffset3 = c3 - (movementPct / 100) * c3;

  // Calculate tip pulse head coordinates
  const getTipCoords = (radius: number, pct: number) => {
    // Start at top (-90 degrees), sweeps clockwise
    const angle = -90 + (pct / 100) * 360;
    const rad = (angle * Math.PI) / 180;
    return {
      x: 150 + radius * Math.cos(rad),
      y: 150 + radius * Math.sin(rad),
    };
  };

  const tip1 = getTipCoords(r1, proteinPct);
  const tip2 = getTipCoords(r2, hydrationPct);
  const tip3 = getTipCoords(r3, movementPct);

  const handleQuickAddProtein = (amount: number) => {
    playTimerBeep('click');
    onAddProtein(amount);
    if (currentProtein + amount >= proteinTarget) {
      confetti({ particleCount: 35, spread: 60, colors: ['#A3E635', '#10B981'] });
    }
  };

  const handleQuickAddWater = (amount: number) => {
    playTimerBeep('click');
    onAddHydration(amount);
    if (currentHydrationMl + amount >= hydrationTargetMl) {
      confetti({ particleCount: 35, spread: 60, colors: ['#4ADE80', '#38bdf8'] });
    }
  };

  const handleQuickAddMovement = (amount: number) => {
    playTimerBeep('click');
    onAddMovement(amount);
    if (currentMovementKcal + amount >= movementTargetKcal) {
      confetti({ particleCount: 35, spread: 60, colors: ['#10B981', '#A3E635'] });
    }
  };

  const handleSaveCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTargets({
      protein: Math.max(50, tempProteinTarget),
      hydration: Math.max(1000, tempHydrationTarget),
      movement: Math.max(100, tempMovementTarget),
    });
    setIsCalibrateModalOpen(false);
    confetti({ particleCount: 25, spread: 50, colors: ['#A3E635', '#10B981'] });
  };

  return (
    <div className="telemetry-card rounded-2xl p-5 sm:p-7 bg-[#111618] border border-[#10B981]/25">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10B981]/15 gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-medium text-[#A3E635] uppercase tracking-wider">
              Circadian Bio-Feedback Engine
            </span>
            <span className="text-xs text-[#64748B]">·</span>
            <span className="text-xs text-[#10B981] font-mono">Real-Time Synthesis</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
            Daily Metabolic Goal Tracker
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Concentric multi-ring telemetry visualizing protein synthesis, cellular hydration, and active movement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setTempProteinTarget(proteinTarget);
              setTempHydrationTarget(hydrationTargetMl);
              setTempMovementTarget(movementTargetKcal);
              setIsCalibrateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182022] border border-[#10B981]/20 text-xs font-medium text-[#94A3B8] hover:text-[#A3E635] hover:border-[#A3E635] transition-all"
            title="Calibrate Metabolic Targets"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Calibrate Targets</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Concentric Circular Ring (Left) + Metric Telemetry Tiles & Quick Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Interactive Circular Multi-Ring */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 select-none">
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full transform -rotate-90 overflow-visible"
            >
              <defs>
                {/* Glow filters for each bioluminescent ring */}
                <filter id="glowLime" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#A3E635" floodOpacity="0.7" />
                </filter>
                <filter id="glowMint" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#4ADE80" floodOpacity="0.7" />
                </filter>
                <filter id="glowEmerald" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10B981" floodOpacity="0.7" />
                </filter>
              </defs>

              {/* Ring 1 (Outer - Protein): Track & Progress */}
              <circle
                cx="150"
                cy="150"
                r={r1}
                fill="none"
                stroke="#182022"
                strokeWidth="13"
                className="transition-opacity"
                opacity={activeHoverRing === 'all' || activeHoverRing === 'protein' ? 1 : 0.35}
              />
              <circle
                cx="150"
                cy="150"
                r={r1}
                fill="none"
                stroke="#A3E635"
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={c1}
                strokeDashoffset={strokeDashoffset1}
                filter="url(#glowLime)"
                className="transition-all duration-700 ease-out cursor-pointer"
                onMouseEnter={() => setActiveHoverRing('protein')}
                onMouseLeave={() => setActiveHoverRing('all')}
                onClick={() => setActiveHoverRing(activeHoverRing === 'protein' ? 'all' : 'protein')}
                opacity={activeHoverRing === 'all' || activeHoverRing === 'protein' ? 1 : 0.3}
              />
              {/* Outer Ring Pulse Head */}
              {proteinPct > 2 && (
                <circle
                  cx={tip1.x}
                  cy={tip1.y}
                  r="7"
                  fill="#0A0D0E"
                  stroke="#A3E635"
                  strokeWidth="3"
                  filter="url(#glowLime)"
                />
              )}

              {/* Ring 2 (Middle - Hydration): Track & Progress */}
              <circle
                cx="150"
                cy="150"
                r={r2}
                fill="none"
                stroke="#182022"
                strokeWidth="13"
                className="transition-opacity"
                opacity={activeHoverRing === 'all' || activeHoverRing === 'hydration' ? 1 : 0.35}
              />
              <circle
                cx="150"
                cy="150"
                r={r2}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={c2}
                strokeDashoffset={strokeDashoffset2}
                filter="url(#glowMint)"
                className="transition-all duration-700 ease-out cursor-pointer"
                onMouseEnter={() => setActiveHoverRing('hydration')}
                onMouseLeave={() => setActiveHoverRing('all')}
                onClick={() => setActiveHoverRing(activeHoverRing === 'hydration' ? 'all' : 'hydration')}
                opacity={activeHoverRing === 'all' || activeHoverRing === 'hydration' ? 1 : 0.3}
              />
              {/* Middle Ring Pulse Head */}
              {hydrationPct > 2 && (
                <circle
                  cx={tip2.x}
                  cy={tip2.y}
                  r="7"
                  fill="#0A0D0E"
                  stroke="#4ADE80"
                  strokeWidth="3"
                  filter="url(#glowMint)"
                />
              )}

              {/* Ring 3 (Inner - Movement): Track & Progress */}
              <circle
                cx="150"
                cy="150"
                r={r3}
                fill="none"
                stroke="#182022"
                strokeWidth="13"
                className="transition-opacity"
                opacity={activeHoverRing === 'all' || activeHoverRing === 'movement' ? 1 : 0.35}
              />
              <circle
                cx="150"
                cy="150"
                r={r3}
                fill="none"
                stroke="#10B981"
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={c3}
                strokeDashoffset={strokeDashoffset3}
                filter="url(#glowEmerald)"
                className="transition-all duration-700 ease-out cursor-pointer"
                onMouseEnter={() => setActiveHoverRing('movement')}
                onMouseLeave={() => setActiveHoverRing('all')}
                onClick={() => setActiveHoverRing(activeHoverRing === 'movement' ? 'all' : 'movement')}
                opacity={activeHoverRing === 'all' || activeHoverRing === 'movement' ? 1 : 0.3}
              />
              {/* Inner Ring Pulse Head */}
              {movementPct > 2 && (
                <circle
                  cx={tip3.x}
                  cy={tip3.y}
                  r="7"
                  fill="#0A0D0E"
                  stroke="#10B981"
                  strokeWidth="3"
                  filter="url(#glowEmerald)"
                />
              )}
            </svg>

            {/* Interactive Ring Center Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
              {activeHoverRing === 'all' && (
                <>
                  <span className="font-mono text-[11px] text-[#94A3B8] uppercase tracking-wider mb-0.5">
                    Metabolic Sync
                  </span>
                  <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#F8FAFC] tabular-nums">
                    {averageSyncPct}<span className="text-xl text-[#A3E635]">%</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#10B981] mt-0.5">
                    {averageSyncPct >= 80 ? 'Peak State' : averageSyncPct >= 50 ? 'On Track' : 'Priming'}
                  </span>
                </>
              )}

              {activeHoverRing === 'protein' && (
                <>
                  <span className="font-mono text-[11px] text-[#A3E635] uppercase tracking-wider mb-0.5">
                    Protein Synthesis
                  </span>
                  <div className="font-display font-bold text-2xl text-[#F8FAFC] tabular-nums">
                    {currentProtein} <span className="text-xs font-normal text-[#94A3B8]">/ {proteinTarget}g</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#A3E635] mt-0.5">
                    {Math.round(proteinPct)}% Done
                  </span>
                </>
              )}

              {activeHoverRing === 'hydration' && (
                <>
                  <span className="font-mono text-[11px] text-[#4ADE80] uppercase tracking-wider mb-0.5">
                    Hydration
                  </span>
                  <div className="font-display font-bold text-2xl text-[#F8FAFC] tabular-nums">
                    {currentHydrationMl} <span className="text-xs font-normal text-[#94A3B8]">/ {hydrationTargetMl}ml</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#4ADE80] mt-0.5">
                    {Math.round(hydrationPct)}% Hydrated
                  </span>
                </>
              )}

              {activeHoverRing === 'movement' && (
                <>
                  <span className="font-mono text-[11px] text-[#10B981] uppercase tracking-wider mb-0.5">
                    Active Movement
                  </span>
                  <div className="font-display font-bold text-2xl text-[#F8FAFC] tabular-nums">
                    {currentMovementKcal} <span className="text-xs font-normal text-[#94A3B8]">/ {movementTargetKcal} kcal</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#10B981] mt-0.5">
                    {Math.round(movementPct)}% Burned
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick ring legend chips */}
          <div className="flex items-center gap-3 mt-4 text-[11px] font-mono">
            <button
              onClick={() => setActiveHoverRing(activeHoverRing === 'protein' ? 'all' : 'protein')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                activeHoverRing === 'protein' ? 'bg-[#182022] text-[#A3E635]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] shadow-[0_0_8px_#A3E635]" />
              <span>Protein ({Math.round(proteinPct)}%)</span>
            </button>

            <button
              onClick={() => setActiveHoverRing(activeHoverRing === 'hydration' ? 'all' : 'hydration')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                activeHoverRing === 'hydration' ? 'bg-[#182022] text-[#4ADE80]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" />
              <span>Hydration ({Math.round(hydrationPct)}%)</span>
            </button>

            <button
              onClick={() => setActiveHoverRing(activeHoverRing === 'movement' ? 'all' : 'movement')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                activeHoverRing === 'movement' ? 'bg-[#182022] text-[#10B981]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
              <span>Movement ({Math.round(movementPct)}%)</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3 Detailed Target Cards with Quick Logging Controls */}
        <div className="lg:col-span-7 space-y-3.5">
          
          {/* Card 1: Protein Target */}
          <div
            className={`p-4 rounded-xl transition-all border ${
              activeHoverRing === 'protein'
                ? 'bg-[#182022] border-[#A3E635] shadow-[0_0_20px_-5px_rgba(163,230,53,0.25)]'
                : 'bg-[#111618] border-[#10B981]/15 hover:border-[#10B981]/30'
            }`}
            onMouseEnter={() => setActiveHoverRing('protein')}
            onMouseLeave={() => setActiveHoverRing('all')}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#182022] border border-[#10B981]/30 flex items-center justify-center text-[#A3E635]">
                  <Dumbbell className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-sm text-[#F8FAFC]">
                      Daily Protein Synthesis
                    </span>
                    <span className="text-[11px] font-mono text-[#A3E635] font-semibold">
                      {Math.round(proteinPct)}%
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">
                    Threshold for myofibrillar repair & positive nitrogen balance
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-display font-bold text-base text-[#F8FAFC] tabular-nums">
                  {currentProtein} <span className="text-xs text-[#64748B]">/ {proteinTarget}g</span>
                </div>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  {currentProtein >= proteinTarget ? (
                    <span className="text-[#A3E635] flex items-center gap-1 justify-end font-medium">
                      <Check className="w-3 h-3 stroke-[3]" /> Target Met
                    </span>
                  ) : (
                    `${(proteinTarget - currentProtein).toFixed(1)}g remaining`
                  )}
                </span>
              </div>
            </div>

            {/* Mini Progress Track */}
            <div className="w-full h-1.5 bg-[#182022] rounded-full overflow-hidden border border-[#10B981]/15 mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#A3E635] transition-all duration-500"
                style={{ width: `${proteinPct}%` }}
              />
            </div>

            {/* Quick Logging Buttons */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#10B981]/10">
              <span className="text-[11px] text-[#64748B] font-mono">Quick Log:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickAddProtein(15)}
                  className="px-2.5 py-1 rounded bg-[#182022] hover:bg-[#A3E635] hover:text-[#0A0D0E] text-[#A3E635] border border-[#10B981]/25 text-[11px] font-mono transition-colors"
                >
                  +15g Sattu / Dahi
                </button>
                <button
                  onClick={() => handleQuickAddProtein(25)}
                  className="px-2.5 py-1 rounded bg-[#182022] hover:bg-[#A3E635] hover:text-[#0A0D0E] text-[#A3E635] border border-[#10B981]/25 text-[11px] font-mono transition-colors font-semibold"
                >
                  +25g Paneer / Whey
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Hydration Target */}
          <div
            className={`p-4 rounded-xl transition-all border ${
              activeHoverRing === 'hydration'
                ? 'bg-[#182022] border-[#4ADE80] shadow-[0_0_20px_-5px_rgba(74,222,128,0.25)]'
                : 'bg-[#111618] border-[#10B981]/15 hover:border-[#10B981]/30'
            }`}
            onMouseEnter={() => setActiveHoverRing('hydration')}
            onMouseLeave={() => setActiveHoverRing('all')}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#182022] border border-[#10B981]/30 flex items-center justify-center text-[#4ADE80]">
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-sm text-[#F8FAFC]">
                      Cellular Hydration
                    </span>
                    <span className="text-[11px] font-mono text-[#4ADE80] font-semibold">
                      {Math.round(hydrationPct)}%
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">
                    Electrolyte transport & intracellular muscular volumization
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-display font-bold text-base text-[#F8FAFC] tabular-nums">
                  {currentHydrationMl} <span className="text-xs text-[#64748B]">/ {hydrationTargetMl}ml</span>
                </div>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  {currentHydrationMl >= hydrationTargetMl ? (
                    <span className="text-[#4ADE80] flex items-center gap-1 justify-end font-medium">
                      <Check className="w-3 h-3 stroke-[3]" /> Target Met
                    </span>
                  ) : (
                    `${hydrationTargetMl - currentHydrationMl}ml remaining`
                  )}
                </span>
              </div>
            </div>

            {/* Mini Progress Track */}
            <div className="w-full h-1.5 bg-[#182022] rounded-full overflow-hidden border border-[#10B981]/15 mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#4ADE80] transition-all duration-500"
                style={{ width: `${hydrationPct}%` }}
              />
            </div>

            {/* Quick Logging Buttons */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#10B981]/10">
              <span className="text-[11px] text-[#64748B] font-mono">Quick Log:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickAddWater(250)}
                  className="px-2.5 py-1 rounded bg-[#182022] hover:bg-[#4ADE80] hover:text-[#0A0D0E] text-[#4ADE80] border border-[#10B981]/25 text-[11px] font-mono transition-colors"
                >
                  +250ml Glass
                </button>
                <button
                  onClick={() => handleQuickAddWater(500)}
                  className="px-2.5 py-1 rounded bg-[#182022] hover:bg-[#4ADE80] hover:text-[#0A0D0E] text-[#4ADE80] border border-[#10B981]/25 text-[11px] font-mono transition-colors font-semibold"
                >
                  +500ml Shaker
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Active Movement Target */}
          <div
            className={`p-4 rounded-xl transition-all border ${
              activeHoverRing === 'movement'
                ? 'bg-[#182022] border-[#10B981] shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)]'
                : 'bg-[#111618] border-[#10B981]/15 hover:border-[#10B981]/30'
            }`}
            onMouseEnter={() => setActiveHoverRing('movement')}
            onMouseLeave={() => setActiveHoverRing('all')}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#182022] border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-sm text-[#F8FAFC]">
                      Active Movement Expenditure
                    </span>
                    <span className="text-[11px] font-mono text-[#10B981] font-semibold">
                      {Math.round(movementPct)}%
                    </span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">
                    Non-exercise activity thermogenesis (NEAT) + active workout burn
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-display font-bold text-base text-[#F8FAFC] tabular-nums">
                  {currentMovementKcal} <span className="text-xs text-[#64748B]">/ {movementTargetKcal} kcal</span>
                </div>
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  {currentMovementKcal >= movementTargetKcal ? (
                    <span className="text-[#10B981] flex items-center gap-1 justify-end font-medium">
                      <Check className="w-3 h-3 stroke-[3]" /> Target Met
                    </span>
                  ) : (
                    `${movementTargetKcal - currentMovementKcal} kcal remaining`
                  )}
                </span>
              </div>
            </div>

            {/* Mini Progress Track */}
            <div className="w-full h-1.5 bg-[#182022] rounded-full overflow-hidden border border-[#10B981]/15 mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#00a572] to-[#10B981] transition-all duration-500"
                style={{ width: `${movementPct}%` }}
              />
            </div>

            {/* Quick Logging Buttons */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#10B981]/10">
              <span className="text-[11px] text-[#64748B] font-mono">Quick Log:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickAddMovement(50)}
                  className="px-2.5 py-1 rounded bg-[#182022] hover:bg-[#10B981] hover:text-[#0A0D0E] text-[#10B981] border border-[#10B981]/25 text-[11px] font-mono transition-colors"
                >
                  +50 kcal (15-min Walk)
                </button>
                <button
                  onClick={() => handleQuickAddMovement(100)}
                  className="px-2.5 py-1 rounded bg-[#182022] hover:bg-[#10B981] hover:text-[#0A0D0E] text-[#10B981] border border-[#10B981]/25 text-[11px] font-mono transition-colors font-semibold"
                >
                  +100 kcal (Cardio / Steps)
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Target Calibration Modal */}
      {isCalibrateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveCalibration}
            className="w-full max-w-md rounded-2xl glass-panel-elevated p-6 border border-[#10B981]/30 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/15 mb-4">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[#A3E635]" />
                <h3 className="font-display font-bold text-base text-[#F8FAFC]">
                  Calibrate Circadian Targets
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCalibrateModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#ffb4ab] text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Daily Protein Target (grams)
                </label>
                <div className="flex items-center bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 focus-within:border-[#A3E635]">
                  <input
                    type="number"
                    min="50"
                    max="300"
                    step="5"
                    value={tempProteinTarget}
                    onChange={(e) => setTempProteinTarget(parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent text-[#F8FAFC] font-display font-semibold text-base focus:outline-none tabular-nums"
                  />
                  <span className="text-xs font-mono text-[#A3E635] ml-1">GRAMS</span>
                </div>
                <span className="text-[11px] text-[#64748B] mt-1 block">
                  Recommended: 1.8g - 2.2g per kg body mass
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Daily Hydration Target (ml)
                </label>
                <div className="flex items-center bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 focus-within:border-[#4ADE80]">
                  <input
                    type="number"
                    min="1000"
                    max="6000"
                    step="250"
                    value={tempHydrationTarget}
                    onChange={(e) => setTempHydrationTarget(parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent text-[#F8FAFC] font-display font-semibold text-base focus:outline-none tabular-nums"
                  />
                  <span className="text-xs font-mono text-[#4ADE80] ml-1">MILLILITERS</span>
                </div>
                <span className="text-[11px] text-[#64748B] mt-1 block">
                  Recommended: 3,500ml - 4,500ml for athletic hydration
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Daily Movement Target (active kcal)
                </label>
                <div className="flex items-center bg-[#111618] rounded-lg border border-[#10B981]/20 px-3.5 py-2 focus-within:border-[#10B981]">
                  <input
                    type="number"
                    min="100"
                    max="1500"
                    step="50"
                    value={tempMovementTarget}
                    onChange={(e) => setTempMovementTarget(parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent text-[#F8FAFC] font-display font-semibold text-base focus:outline-none tabular-nums"
                  />
                  <span className="text-xs font-mono text-[#10B981] ml-1">KCAL</span>
                </div>
                <span className="text-[11px] text-[#64748B] mt-1 block">
                  Combines active training volume + daily steps
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCalibrateModalOpen(false)}
                className="flex-1 py-2 rounded-lg bg-[#111618] border border-[#10B981]/20 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs glow-lime hover:scale-[1.01]"
              >
                Apply Targets
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
