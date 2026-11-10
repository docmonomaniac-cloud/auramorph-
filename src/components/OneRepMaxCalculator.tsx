import React, { useState } from 'react';
import { Calculator, X, ChevronRight } from 'lucide-react';

interface OneRepMaxCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWeight?: number;
  defaultReps?: number;
}

export const OneRepMaxCalculator: React.FC<OneRepMaxCalculatorProps> = ({
  isOpen,
  onClose,
  defaultWeight = 85,
  defaultReps = 6,
}) => {
  const [weight, setWeight] = useState(defaultWeight);
  const [reps, setReps] = useState(defaultReps);

  if (!isOpen) return null;

  // Brzycki formula: Weight / (1.0278 - (0.0278 * Reps))
  // Epley formula: Weight * (1 + (Reps / 30))
  const brzycki1RM = reps === 1 ? weight : weight / (1.0278 - 0.0278 * Math.min(reps, 15));
  const epley1RM = reps === 1 ? weight : weight * (1 + reps / 30);
  const avg1RM = Math.round(((brzycki1RM + epley1RM) / 2) * 10) / 10;

  const percentages = [
    { pct: 95, reps: '2 Reps' },
    { pct: 90, reps: '3-4 Reps' },
    { pct: 85, reps: '5-6 Reps' },
    { pct: 80, reps: '7-8 Reps' },
    { pct: 75, reps: '10 Reps' },
    { pct: 70, reps: '12 Reps' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl glass-panel-elevated p-6 border border-[#10B981]/30 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#10B981]/15 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#111618] text-[#A3E635] border border-[#10B981]/20">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-[#F8FAFC]">1RM Bio-Mechanical Estimator</h3>
              <p className="text-xs text-[#94A3B8]">Brzycki & Epley athletic consensus algorithm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#ffb4ab] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
              Load Lifted (kg)
            </label>
            <div className="flex items-center bg-[#111618] rounded-lg border border-[#10B981]/20 px-3 py-2 focus-within:border-[#A3E635]">
              <input
                type="number"
                step="0.5"
                min="1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent text-[#F8FAFC] font-display font-semibold text-lg focus:outline-none tabular-nums"
              />
              <span className="text-xs text-[#64748B] font-mono ml-1">KG</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
              Reps to Failure
            </label>
            <div className="flex items-center bg-[#111618] rounded-lg border border-[#10B981]/20 px-3 py-2 focus-within:border-[#A3E635]">
              <input
                type="number"
                min="1"
                max="20"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value) || 1)}
                className="w-full bg-transparent text-[#F8FAFC] font-display font-semibold text-lg focus:outline-none tabular-nums"
              />
              <span className="text-xs text-[#64748B] font-mono ml-1">REPS</span>
            </div>
          </div>
        </div>

        {/* Highlighted 1RM Card */}
        <div className="telemetry-card rounded-xl p-4 mb-6 text-center bg-[#111618]">
          <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-mono">
            Estimated 1-Rep Maximum
          </span>
          <div className="font-display text-4xl font-bold text-[#A3E635] tabular-nums mt-1 mb-1">
            {avg1RM} <span className="text-lg font-normal text-[#F8FAFC]">KG</span>
          </div>
          <p className="text-xs text-[#64748B]">
            Theoretical limit based on {weight} kg × {reps} repetition strain
          </p>
        </div>

        {/* Percentage Table */}
        <div className="space-y-1.5 mb-6">
          <span className="text-xs font-medium text-[#94A3B8] block mb-2">
            Target Intensity Zones
          </span>
          <div className="grid grid-cols-2 gap-2">
            {percentages.map((item) => {
              const zoneWeight = Math.round(avg1RM * (item.pct / 100) * 2) / 2;
              return (
                <div
                  key={item.pct}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#111618] border border-[#10B981]/15 text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[#A3E635] font-semibold">{item.pct}%</span>
                    <span className="text-[#64748B]">({item.reps})</span>
                  </div>
                  <span className="font-display font-bold text-[#F8FAFC] tabular-nums">
                    {zoneWeight} kg
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-sm glow-lime hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
        >
          <span>Apply to Active Workout</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
