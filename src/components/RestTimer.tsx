import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, X, Maximize2, Minimize2 } from 'lucide-react';
import { playTimerBeep } from '../utils/audio';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 90,
  isOpen,
  onClose,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setRemaining(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            playTimerBeep('complete');
            setIsRunning(false);
            return 0;
          }
          if (prev <= 4) {
            playTimerBeep('countdown');
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  if (!isOpen) return null;

  const toggleRun = () => {
    if (remaining === 0) {
      setRemaining(totalSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
  };

  const selectPreset = (secs: number) => {
    setTotalSeconds(secs);
    setRemaining(secs);
    setIsRunning(true);
    playTimerBeep('click');
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progressPct = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#111618] border border-[#A3E635]/40 shadow-[0_0_20px_rgba(163,230,53,0.25)]">
        <div className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
        <span className="font-display font-bold text-sm tabular-nums text-[#A3E635]">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <button
          onClick={toggleRun}
          className="text-[#F8FAFC] hover:text-[#A3E635] p-1 transition-colors"
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
        </button>
        <button
          onClick={() => setIsMinimized(false)}
          className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 transition-colors"
          title="Expand"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl glass-panel-elevated p-5 shadow-2xl border border-[#10B981]/30">
      <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/15 mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#A3E635]" />
          <span className="font-display font-semibold text-sm text-[#F8FAFC]">
            Recovery Interval Timer
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-[#94A3B8] hover:text-[#F8FAFC] rounded transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-[#94A3B8] hover:text-[#ffb4ab] rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Numerical Timer Display */}
      <div className="text-center py-2">
        <div className="font-display text-4xl font-bold tracking-tight text-[#F8FAFC] tabular-nums mb-1">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p className="text-xs text-[#94A3B8]">
          {remaining === 0
            ? 'Rest finished! Step up to next set.'
            : isRunning
            ? 'Muscle ATP restocking in progress...'
            : 'Rest interval paused'}
        </p>
      </div>

      {/* Progress Bar with pulse head */}
      <div className="my-3">
        <div className="w-full h-2 bg-[#182022] rounded-full overflow-hidden border border-[#10B981]/20">
          <div
            className="h-full bg-gradient-to-r from-[#10B981] to-[#A3E635] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Quick Interval Preset Buttons */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {[30, 60, 90, 120].map((secs) => (
          <button
            key={secs}
            onClick={() => selectPreset(secs)}
            className={`py-1 text-xs font-mono rounded transition-colors ${
              totalSeconds === secs
                ? 'bg-[#A3E635] text-[#0A0D0E] font-bold shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                : 'bg-[#111618] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#10B981]/15'
            }`}
          >
            {secs}s
          </button>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleRun}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-display text-xs font-semibold tracking-wide transition-all ${
            isRunning
              ? 'bg-[#182022] text-[#F8FAFC] border border-[#10B981]/30 hover:border-[#ffb4ab]'
              : 'bg-[#A3E635] text-[#0A0D0E] glow-lime hover:scale-[1.02]'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> {remaining === 0 ? 'Restart' : 'Resume'}
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="p-2.5 rounded-lg bg-[#111618] border border-[#10B981]/20 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
