import React from 'react';

interface ProgressionBarProps {
  progressPercentage: number;
  label?: string;
  currentValue?: string | number;
  targetValue?: string | number;
  heightClass?: string;
  showPulseHead?: boolean;
}

export const ProgressionBar: React.FC<ProgressionBarProps> = ({
  progressPercentage,
  label,
  currentValue,
  targetValue,
  heightClass = 'h-2.5',
  showPulseHead = true,
}) => {
  const clamped = Math.min(100, Math.max(0, progressPercentage));

  return (
    <div className="w-full">
      {(label || currentValue !== undefined) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          {label && <span className="text-[#94A3B8]">{label}</span>}
          {currentValue !== undefined && (
            <span className="font-mono text-[#F8FAFC]">
              <span className="text-[#A3E635] font-semibold">{currentValue}</span>
              {targetValue !== undefined && (
                <span className="text-[#64748B]"> / {targetValue}</span>
              )}
            </span>
          )}
        </div>
      )}
      <div className={`relative w-full ${heightClass} bg-[#182022] rounded-full overflow-visible border border-[#10B981]/20`}>
        {/* Completed Segment: linear gradient #10B981 to #A3E635 */}
        <div
          className="h-full rounded-full transition-all duration-500 ease-out relative"
          style={{
            width: `${clamped}%`,
            background: 'linear-gradient(90deg, #10B981 0%, #A3E635 100%)',
            boxShadow: '0 0 14px rgba(163, 230, 53, 0.35)',
          }}
        >
          {/* Animated Glowing Pulse Head */}
          {showPulseHead && clamped > 0 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#A3E635] shadow-[0_0_12px_#A3E635] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0D0E]" />
              <span className="absolute inset-0 rounded-full bg-[#A3E635] animate-ping opacity-75" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
