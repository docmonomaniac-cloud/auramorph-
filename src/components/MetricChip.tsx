import React from 'react';

interface MetricChipProps {
  label: string;
  value: string | number;
  unit?: string;
  dotColor?: string; // default neon mint/lime
  subLabel?: string;
}

export const MetricChip: React.FC<MetricChipProps> = ({
  label,
  value,
  unit,
  dotColor = '#A3E635',
  subLabel,
}) => {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[rgba(24,32,34,0.9)] border border-[rgba(74,222,128,0.2)] text-xs text-[#F8FAFC]">
      {/* 6px circular neon dot indicator */}
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
        style={{ backgroundColor: dotColor, color: dotColor }}
      />
      <div className="flex flex-col">
        <span className="text-[11px] text-[#94A3B8] font-medium leading-none mb-0.5">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-semibold text-sm tabular-nums text-[#F8FAFC]">
            {value}
          </span>
          {unit && <span className="text-[11px] text-[#64748B]">{unit}</span>}
          {subLabel && <span className="text-[10px] text-[#10B981] ml-1">{subLabel}</span>}
        </div>
      </div>
    </div>
  );
};
