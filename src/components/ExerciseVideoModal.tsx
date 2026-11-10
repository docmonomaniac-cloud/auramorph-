import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types/fitness';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Activity,
  Maximize2,
  Tv,
  Check,
} from 'lucide-react';
import { playTimerBeep } from '../utils/audio';

interface ExerciseVideoModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseVideoModal: React.FC<ExerciseVideoModalProps> = ({
  exercise,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'youtube'>('simulation');
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [scrubberPct, setScrubberPct] = useState(0); // 0 to 100
  const [cameraAngle, setCameraAngle] = useState<'side' | 'isometric' | 'front'>('isometric');
  const [showBarPath, setShowBarPath] = useState(true);
  const [showMuscleHeatmap, setShowMuscleHeatmap] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [checkedCheckpoints, setCheckedCheckpoints] = useState<Record<number, boolean>>({});

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  const tutorial = exercise?.tutorial;

  // Reset or initialize state when exercise changes
  useEffect(() => {
    if (exercise) {
      setScrubberPct(0);
      setIsPlaying(true);
      setCheckedCheckpoints({});
      lastTimeRef.current = performance.now();
    }
  }, [exercise]);

  // Kinematic simulation animation loop
  useEffect(() => {
    if (!isOpen || activeTab !== 'simulation') return;

    const cycleDurationMs = (tutorial?.videoDurationSeconds ? 4000 : 3500) / playbackSpeed;

    const animate = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (isPlaying) {
        setScrubberPct((prev) => {
          const next = prev + (delta / cycleDurationMs) * 100;
          if (next >= 100) {
            return 0; // loop
          }
          return next;
        });
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, activeTab, isPlaying, playbackSpeed, tutorial]);

  if (!isOpen || !exercise || !tutorial) return null;

  // Determine current movement phase based on scrubberPct
  const currentPhase =
    tutorial.phases.find(
      (p) => scrubberPct >= p.startPct && scrubberPct < p.endPct
    ) || tutorial.phases[tutorial.phases.length - 1];

  const toggleCheckpoint = (idx: number) => {
    setCheckedCheckpoints((prev) => {
      const next = !prev[idx];
      if (next) playTimerBeep('click');
      return { ...prev, [idx]: next };
    });
  };

  const handleScrubberChange = (val: number) => {
    setScrubberPct(val);
    setIsPlaying(false);
  };

  // Kinematic calculations for SVG rendering
  // cycle: 0 -> unrack/top, 50 -> bottom/stretch, 100 -> lockout
  const t = scrubberPct / 100;
  // Normalized sinusoidal curve: 0 at start, 1 at bottom (0.5), 0 at end (1.0)
  const repProgress = Math.sin(t * Math.PI); // 0 -> 1 -> 0

  // Calculate dynamic coordinates depending on exercise type
  const isBench = exercise.id.includes('bench') || exercise.name.toLowerCase().includes('bench');
  const isIncline = exercise.name.toLowerCase().includes('incline');
  const isMilitary = exercise.name.toLowerCase().includes('overhead') || exercise.name.toLowerCase().includes('military');
  const isLateral = exercise.name.toLowerCase().includes('lateral');
  const isTriceps = exercise.name.toLowerCase().includes('triceps');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl rounded-2xl glass-panel-elevated border border-[#10B981]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#10B981]/15 bg-[#111618]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#182022] border border-[#10B981]/30 flex items-center justify-center text-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.25)] shrink-0">
              <Tv className="w-4 h-4 text-[#A3E635]" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-[#A3E635] font-semibold uppercase tracking-wider">
                  BIOMECHANICAL VIDEO TUTORIAL
                </span>
                <span className="text-[#64748B]">·</span>
                <span className="text-[#94A3B8]">{exercise.category}</span>
                <span className="text-[#64748B]">·</span>
                <span className="text-[#10B981] font-mono">{exercise.targetMuscle}</span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#F8FAFC]">
                {exercise.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Tab Selector: Kinematic Simulation vs YouTube HD Stream */}
            <div className="flex items-center bg-[#182022] p-1 rounded-lg border border-[#10B981]/20">
              <button
                onClick={() => setActiveTab('simulation')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'simulation'
                    ? 'bg-[#A3E635] text-[#0A0D0E] font-semibold shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Kinematic Lab</span>
              </button>
              {tutorial.youtubeId && (
                <button
                  onClick={() => setActiveTab('youtube')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === 'youtube'
                      ? 'bg-[#A3E635] text-[#0A0D0E] font-semibold shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Coach HD Video</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#94A3B8] hover:text-[#ffb4ab] rounded-lg bg-[#182022] border border-[#10B981]/20 transition-colors"
              title="Close Tutorial"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Video Viewport */}
          {activeTab === 'simulation' ? (
            <div className="relative rounded-2xl overflow-hidden border border-[#10B981]/30 bg-[#070b0c] shadow-2xl">
              
              {/* Kinematic SVG Rendering Stage */}
              <div className="relative w-full h-72 sm:h-84 md:h-96 flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 600 360"
                  className="w-full h-full max-h-full select-none"
                >
                  <defs>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0A0D0E" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="barGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A3E635" />
                      <stop offset="50%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#A3E635" />
                    </linearGradient>
                    <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#A3E635" floodOpacity="0.8" />
                    </filter>
                  </defs>

                  {/* Stage background glow */}
                  <rect width="600" height="360" fill="#0A0D0E" />
                  <ellipse cx="300" cy="180" rx="260" ry="150" fill="url(#centerGlow)" />

                  {/* Floor / Platform Grid Lines */}
                  <line x1="60" y1="310" x2="540" y2="310" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" />
                  <line x1="120" y1="325" x2="480" y2="325" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" strokeDasharray="6 6" />

                  {/* Specific Kinematic Visualizations */}
                  {isBench && (
                    <g transform="translate(60, 20)">
                      {/* Bench Pad */}
                      <rect x="120" y="210" width="240" height="24" rx="6" fill="#182022" stroke="#10B981" strokeWidth="1.5" />
                      {/* Bench Legs */}
                      <rect x="140" y="234" width="16" height="76" fill="#111618" />
                      <rect x="320" y="234" width="16" height="76" fill="#111618" />
                      {/* Bench Uprights */}
                      <rect x="100" y="110" width="14" height="150" fill="#182022" stroke="rgba(16, 185, 129, 0.3)" />

                      {/* Bar Path Curve Guide */}
                      {showBarPath && (
                        <g>
                          <path
                            d="M 230 115 Q 235 155 245 195"
                            fill="none"
                            stroke="#A3E635"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            opacity="0.8"
                          />
                          <text x="255" y="155" fill="#A3E635" fontSize="10" fontFamily="Space Grotesk">
                            J-Curve Trajectory
                          </text>
                        </g>
                      )}

                      {/* Athlete Body & Torso */}
                      {/* Head */}
                      <circle cx="160" cy="200" r="16" fill="#182022" stroke="#94A3B8" strokeWidth="2" />
                      {/* Spine / Torso arch */}
                      <path
                        d="M 176 205 Q 220 195 270 210"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />

                      {/* Muscle Heatmap on Chest (Pectoralis Major) */}
                      {showMuscleHeatmap && (
                        <ellipse
                          cx="225"
                          cy="195"
                          rx="24"
                          ry="14"
                          fill="#A3E635"
                          opacity={0.35 + repProgress * 0.45}
                          filter="url(#neonBlur)"
                        />
                      )}

                      {/* Leg and Foot on floor */}
                      <polyline
                        points="270,210 320,240 330,310 350,310"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Arms & Barbell moving along trajectory */}
                      {(() => {
                        const barY = 115 + repProgress * 80;
                        const barX = 230 + repProgress * 15;
                        const elbowX = 220 + repProgress * 5;
                        const elbowY = 160 + repProgress * 45;

                        return (
                          <g>
                            {/* Arms */}
                            <line x1="200" y1="200" x2={elbowX} y2={elbowY} stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
                            <line x1={elbowX} y1={elbowY} x2={barX} y2={barY} stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
                            {/* Elbow joint indicator */}
                            <circle cx={elbowX} cy={elbowY} r="5" fill="#0A0D0E" stroke="#A3E635" strokeWidth="2" />

                            {/* Barbell & Plates */}
                            <line x1="130" y1={barY} x2="330" y2={barY} stroke="url(#barGlow)" strokeWidth="8" filter="url(#neonBlur)" />
                            {/* Plates */}
                            <rect x="140" y={barY - 32} width="16" height="64" rx="4" fill="#182022" stroke="#A3E635" strokeWidth="2" />
                            <rect x="304" y={barY - 32} width="16" height="64" rx="4" fill="#182022" stroke="#A3E635" strokeWidth="2" />
                            {/* Hands gripping bar */}
                            <circle cx={barX - 15} cy={barY} r="7" fill="#0A0D0E" stroke="#10B981" strokeWidth="2" />
                            <circle cx={barX + 15} cy={barY} r="7" fill="#0A0D0E" stroke="#10B981" strokeWidth="2" />
                          </g>
                        );
                      })()}
                    </g>
                  )}

                  {isIncline && (
                    <g transform="translate(60, 20)">
                      {/* Incline Bench Pad at 30° */}
                      <line x1="140" y1="260" x2="300" y2="150" stroke="#182022" strokeWidth="24" strokeLinecap="round" />
                      <line x1="140" y1="260" x2="300" y2="150" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
                      {/* Seat */}
                      <rect x="120" y="250" width="40" height="14" rx="4" fill="#182022" stroke="#10B981" strokeWidth="1.5" />
                      {/* Stand */}
                      <line x1="220" y1="205" x2="220" y2="310" stroke="#182022" strokeWidth="12" />

                      {/* Upper Pec Muscle Heatmap */}
                      {showMuscleHeatmap && (
                        <ellipse
                          cx="245"
                          cy="175"
                          rx="22"
                          ry="12"
                          transform="rotate(-30 245 175)"
                          fill="#A3E635"
                          opacity={0.35 + repProgress * 0.45}
                          filter="url(#neonBlur)"
                        />
                      )}

                      {/* Head on incline */}
                      <circle cx="280" cy="140" r="16" fill="#182022" stroke="#94A3B8" strokeWidth="2" />

                      {/* Dumbbells moving along converging arc */}
                      {(() => {
                        const dbY = 95 + repProgress * 65;
                        const dbX = 220 + repProgress * 20;

                        return (
                          <g>
                            {/* Arms */}
                            <line x1="230" y1="180" x2={dbX - 25} y2={dbY + 30} stroke="#94A3B8" strokeWidth="5" />
                            <line x1={dbX - 25} y1={dbY + 30} x2={dbX} y2={dbY} stroke="#94A3B8" strokeWidth="5" />
                            {/* Dumbbell */}
                            <rect x={dbX - 20} y={dbY - 8} width="40" height="16" rx="3" fill="#182022" stroke="#A3E635" strokeWidth="2" filter="url(#neonBlur)" />
                            <circle cx={dbX - 18} cy={dbY} r="12" fill="#111618" stroke="#10B981" strokeWidth="2" />
                            <circle cx={dbX + 18} cy={dbY} r="12" fill="#111618" stroke="#10B981" strokeWidth="2" />
                          </g>
                        );
                      })()}
                    </g>
                  )}

                  {isMilitary && (
                    <g transform="translate(90, 10)">
                      {/* Standing Athlete */}
                      {/* Head */}
                      <circle cx="210" cy="140" r="18" fill="#182022" stroke="#94A3B8" strokeWidth="2" />
                      {/* Torso & Legs in strict vertical standing plank */}
                      <line x1="210" y1="158" x2="210" y2="235" stroke="#94A3B8" strokeWidth="12" strokeLinecap="round" />
                      <line x1="210" y1="235" x2="200" y2="320" stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />
                      <line x1="210" y1="235" x2="220" y2="320" stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />

                      {/* Bar path straight vertical line */}
                      {showBarPath && (
                        <g>
                          <line x1="228" y1="50" x2="228" y2="155" stroke="#A3E635" strokeWidth="2" strokeDasharray="3 3" />
                          <text x="238" y="100" fill="#A3E635" fontSize="10" fontFamily="Space Grotesk">
                            Strict Vertical Path
                          </text>
                        </g>
                      )}

                      {/* Muscle Heatmap for Deltoids & Traps */}
                      {showMuscleHeatmap && (
                        <circle
                          cx="210"
                          cy="165"
                          r="20"
                          fill="#A3E635"
                          opacity={0.3 + (1 - repProgress) * 0.5}
                          filter="url(#neonBlur)"
                        />
                      )}

                      {/* Barbell moving up and down */}
                      {(() => {
                        const barY = 55 + repProgress * 95;
                        return (
                          <g>
                            <line x1="110" y1={barY} x2="310" y2={barY} stroke="url(#barGlow)" strokeWidth="7" filter="url(#neonBlur)" />
                            <rect x="120" y={barY - 26} width="14" height="52" rx="3" fill="#182022" stroke="#A3E635" strokeWidth="2" />
                            <rect x="286" y={barY - 26} width="14" height="52" rx="3" fill="#182022" stroke="#A3E635" strokeWidth="2" />
                            {/* Arms extending overhead */}
                            <line x1="205" y1="165" x2="195" y2={barY + 15} stroke="#94A3B8" strokeWidth="5" />
                            <line x1="195" y1={barY + 15} x2="185" y2={barY} stroke="#94A3B8" strokeWidth="5" />
                            <line x1="215" y1="165" x2="225" y2={barY + 15} stroke="#94A3B8" strokeWidth="5" />
                            <line x1="225" y1={barY + 15} x2="235" y2={barY} stroke="#94A3B8" strokeWidth="5" />
                          </g>
                        );
                      })()}
                    </g>
                  )}

                  {(isLateral || isTriceps) && (
                    <g transform="translate(80, 15)">
                      {/* Cable Column Machine on Left */}
                      <rect x="70" y="40" width="20" height="280" fill="#182022" stroke="#10B981" strokeWidth="1.5" />
                      <circle cx="80" cy={isLateral ? "260" : "60"} r="8" fill="#A3E635" />
                      {/* Weight Stack */}
                      <rect x="73" y="180" width="14" height="80" fill="#111618" stroke="#10B981" strokeWidth="1" />

                      {/* Standing Athlete */}
                      <circle cx="240" cy="130" r="16" fill="#182022" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="240" y1="146" x2="240" y2="230" stroke="#94A3B8" strokeWidth="10" strokeLinecap="round" />
                      <line x1="240" y1="230" x2="225" y2="310" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
                      <line x1="240" y1="230" x2="255" y2="310" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />

                      {/* Arm & Cable trajectory */}
                      {isLateral && (() => {
                        const armAngle = -75 + (1 - repProgress) * 75; // abducts from 0 to 75 deg
                        const handX = 240 + Math.cos((armAngle * Math.PI) / 180) * 85;
                        const handY = 160 + Math.sin((armAngle * Math.PI) / 180) * 85;

                        return (
                          <g>
                            {/* Cable from pulley */}
                            <line x1="80" y1="260" x2={handX} y2={handY} stroke="rgba(163, 230, 53, 0.5)" strokeWidth="2" />
                            {/* Arm */}
                            <line x1="240" y1="155" x2={handX} y2={handY} stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
                            {/* Lateral Delt Highlight */}
                            {showMuscleHeatmap && (
                              <circle cx="242" cy="155" r="14" fill="#A3E635" opacity={0.3 + (1 - repProgress) * 0.5} filter="url(#neonBlur)" />
                            )}
                            {/* Handle / Hand */}
                            <circle cx={handX} cy={handY} r="6" fill="#A3E635" filter="url(#neonBlur)" />
                          </g>
                        );
                      })()}

                      {isTriceps && (() => {
                        const forearmAngle = 30 + (1 - repProgress) * 90; // extends from flexion behind neck to lockout
                        const elbowX = 260;
                        const elbowY = 110;
                        const handX = elbowX + Math.cos((forearmAngle * Math.PI) / 180) * 65;
                        const handY = elbowY + Math.sin((forearmAngle * Math.PI) / 180) * 65;

                        return (
                          <g>
                            {/* Cable from high pulley */}
                            <line x1="80" y1="60" x2={handX} y2={handY} stroke="rgba(163, 230, 53, 0.5)" strokeWidth="2" />
                            {/* Upper arm pinned stationary */}
                            <line x1="240" y1="150" x2={elbowX} y2={elbowY} stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />
                            {/* Forearm driving out */}
                            <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
                            {/* Triceps Long Head Highlight */}
                            {showMuscleHeatmap && (
                              <line x1="245" y1="145" x2="258" y2="115" stroke="#A3E635" strokeWidth="10" strokeLinecap="round" opacity={0.4 + (1 - repProgress) * 0.5} filter="url(#neonBlur)" />
                            )}
                            {/* Rope Ends */}
                            <circle cx={handX} cy={handY} r="7" fill="#A3E635" />
                          </g>
                        );
                      })()}
                    </g>
                  )}
                </svg>

                {/* Live Movement Phase Badge (Top Center) */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-[#111618]/90 border border-[#A3E635]/40 backdrop-blur-md flex items-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
                  <span className="font-display font-semibold text-xs text-[#F8FAFC]">
                    Phase {currentPhase.phase}: {currentPhase.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#A3E635]">
                    ({Math.round(scrubberPct)}%)
                  </span>
                </div>

                {/* Overlays / Toggles (Top Right) */}
                <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
                  <button
                    onClick={() => setShowBarPath(!showBarPath)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 border ${
                      showBarPath
                        ? 'bg-[#182022] text-[#A3E635] border-[#A3E635]/50'
                        : 'bg-[#111618]/80 text-[#64748B] border-[#10B981]/15'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Bar Path</span>
                  </button>
                  <button
                    onClick={() => setShowMuscleHeatmap(!showMuscleHeatmap)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 border ${
                      showMuscleHeatmap
                        ? 'bg-[#182022] text-[#4ADE80] border-[#4ADE80]/50'
                        : 'bg-[#111618]/80 text-[#64748B] border-[#10B981]/15'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Muscle Heat</span>
                  </button>
                </div>

                {/* Camera Angle Selector (Top Left) */}
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-[#111618]/90 p-1 rounded-lg border border-[#10B981]/20">
                  {(['side', 'isometric', 'front'] as const).map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setCameraAngle(angle)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                        cameraAngle === angle
                          ? 'bg-[#A3E635] text-[#0A0D0E] font-bold'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      {angle}
                    </button>
                  ))}
                </div>

                {/* Live Coach Cue Subtitle (Bottom Center) */}
                <div className="absolute bottom-16 left-4 right-4 text-center pointer-events-none">
                  <div className="inline-block max-w-xl px-4 py-2 rounded-xl bg-[#0A0D0E]/85 border border-[#10B981]/30 backdrop-blur-md text-xs sm:text-sm text-[#F8FAFC] shadow-lg">
                    <span className="text-[#A3E635] font-semibold mr-1.5">Coach Cue:</span>
                    <span>"{currentPhase.coachCue}"</span>
                  </div>
                </div>

                {/* Timeline Scrubber & Player Controls (Bottom Strip) */}
                <div className="absolute bottom-0 inset-x-0 bg-[#111618]/95 border-t border-[#10B981]/20 px-4 py-2.5 flex items-center gap-3 backdrop-blur-md">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-lg bg-[#A3E635] text-[#0A0D0E] flex items-center justify-center glow-lime-sm hover:scale-105 transition-transform shrink-0"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setScrubberPct(0);
                      setIsPlaying(true);
                    }}
                    className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded transition-colors shrink-0"
                    title="Restart loop"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Scrubber slider with phase tick marks */}
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={scrubberPct}
                      onChange={(e) => handleScrubberChange(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[#182022] rounded-lg appearance-none cursor-pointer accent-[#A3E635]"
                    />
                  </div>

                  {/* Playback speed selector */}
                  <div className="flex items-center gap-1 shrink-0">
                    {[0.5, 1.0, 1.5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                          playbackSpeed === speed
                            ? 'bg-[#A3E635] text-[#0A0D0E] font-bold'
                            : 'bg-[#182022] text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        {speed === 0.5 ? '0.5x Slow-Mo' : `${speed}x`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* YouTube HD Stream Embed Tab */
            <div className="relative rounded-2xl overflow-hidden border border-[#10B981]/30 bg-[#070b0c] aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${tutorial.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={`${exercise.name} Video Tutorial`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Biomechanical Telemetry & Execution Matrices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Primary Cue Card */}
            <div className="md:col-span-2 telemetry-card rounded-xl p-4 sm:p-5 bg-[#111618]">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-[#A3E635]" />
                <span className="font-display font-semibold text-xs sm:text-sm text-[#F8FAFC]">
                  Primary Movement Objective
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed italic">
                "{tutorial.primaryCue}"
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#10B981]/15">
                <div>
                  <span className="text-[11px] text-[#94A3B8] block">Prescribed Tempo</span>
                  <span className="font-mono text-xs font-semibold text-[#A3E635]">
                    {tutorial.tempo} (Eccentric · Pause · Concentric · Lockout)
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#94A3B8] block">Breathing Protocol</span>
                  <span className="font-mono text-xs text-[#4ADE80]">
                    {tutorial.breathingPattern.slice(0, 52)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Muscle Activation Gauge */}
            <div className="glass-panel-elevated rounded-xl p-4 sm:p-5 border border-[#10B981]/20">
              <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/15 mb-3">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="font-display font-semibold text-xs text-[#F8FAFC]">
                    Prime Mover Recruitment
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {tutorial.musclesWorked.map((m, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#F8FAFC] truncate">{m.name}</span>
                      <span className="font-mono text-[#A3E635]">{m.activationLevel}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#182022] rounded-full overflow-hidden border border-[#10B981]/15">
                      <div
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#A3E635]"
                        style={{ width: `${m.activationLevel}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 2-Column Grid: Biomechanical Checkpoints vs Common Traps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Interactive Checkable Checkpoints */}
            <div className="glass-panel-elevated rounded-xl p-5 border border-[#10B981]/25">
              <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/15 mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
                  <h3 className="font-display font-semibold text-sm text-[#F8FAFC]">
                    Pre-Lift Form Checkpoints
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#94A3B8]">
                  {Object.values(checkedCheckpoints).filter(Boolean).length} / {tutorial.biomechanicalCheckpoints.length} verified
                </span>
              </div>

              <div className="space-y-2.5">
                {tutorial.biomechanicalCheckpoints.map((point, idx) => {
                  const isChecked = !!checkedCheckpoints[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleCheckpoint(idx)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-[#182022] border-[#A3E635]/50 text-[#F8FAFC]'
                          : 'bg-[#111618] border-[#10B981]/15 hover:border-[#10B981]/30 text-[#94A3B8]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-[5px] mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-[#A3E635] text-[#0A0D0E]'
                            : 'border border-[#64748B]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs leading-relaxed">{point}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Injury Traps & Form Faults */}
            <div className="telemetry-card rounded-xl p-5 bg-[#111618] border border-[#ffb4ab]/20">
              <div className="flex items-center gap-2 pb-3 border-b border-[#ffb4ab]/15 mb-3">
                <AlertTriangle className="w-4 h-4 text-[#ffb4ab]" />
                <h3 className="font-display font-semibold text-sm text-[#ffb4ab]">
                  Common Bio-Mechanical Errors
                </h3>
              </div>

              <div className="space-y-2.5">
                {tutorial.commonMistakes.map((mistake, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#182022]/60 border border-[#ffb4ab]/15 text-xs text-[#F8FAFC] flex items-start gap-2.5"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span className="leading-relaxed text-[#d4e4fa]">{mistake}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#10B981]/15 bg-[#111618] flex items-center justify-between gap-3">
          <div className="text-xs text-[#94A3B8] hidden sm:block">
            Bar Path: <strong className="text-[#A3E635]">{tutorial.barPathDescription}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#182022] border border-[#10B981]/25 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              Close Guide
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs sm:text-sm glow-lime hover:scale-[1.02] transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Ready to Lift! Log Set</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
