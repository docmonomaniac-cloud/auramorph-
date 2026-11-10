import React, { useState, useEffect, useRef } from 'react';
import { CoachMessage } from '../types/fitness';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  Zap,
  Brain,
  RotateCcw,
  Cpu,
  Flame,
  Utensils,
  Moon,
  AlertCircle,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTimerBeep } from '../utils/audio';

interface AiCoachViewProps {
  messages: CoachMessage[];
  onSendMessage: (text: string) => void;
  onApplyAction?: (actionType: string) => void;
  userTelemetry?: {
    streakDays: number;
    weightKg: number;
    currentProtein: number;
    proteinTarget: number;
    currentHydrationMl: number;
    hydrationTargetMl: number;
    currentMovementKcal: number;
    movementTargetKcal: number;
    recoveryScore: number;
  };
}

type ModelType = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon';
type RoleType = 'sports_scientist' | 'indian_nutrition' | 'recovery_cns' | 'transformation_coach';

interface ChatItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  roleUsed?: string;
  tags?: string[];
  actionRecommendation?: {
    type: 'macro_adjustment' | 'add_exercise' | 'recovery_protocol';
    title: string;
    description: string;
  };
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({
  messages: initialMessages,
  onSendMessage,
  onApplyAction,
  userTelemetry = {
    streakDays: 1,
    weightKg: 98.0,
    currentProtein: 145.0,
    proteinTarget: 145,
    currentHydrationMl: 3100,
    hydrationTargetMl: 4000,
    currentMovementKcal: 520,
    movementTargetKcal: 600,
    recoveryScore: 92,
  },
}) => {
  // Model selector: gemini-4-argon (complex), gemini-3.8-flash (general), gemini-3.1-flash-lite (fast)
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-3.8-flash');
  // Role persona with tailored system instructions
  const [selectedRole, setSelectedRole] = useState<RoleType>('sports_scientist');
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Initialize conversation thread from initial seed messages
  const [chatHistory, setChatHistory] = useState<ChatItem[]>(() => {
    return initialMessages.map((m) => ({
      id: m.id,
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
      timestamp: m.timestamp,
      tags: m.tags,
      actionRecommendation: m.actionRecommendation,
      modelUsed: 'gemini-3.8-flash',
    }));
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isGenerating]);

  // Role Personas configuration
  const ROLES: {
    id: RoleType;
    label: string;
    sub: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: 'sports_scientist',
      label: 'Sports Scientist & Biomechanist',
      sub: 'Mechanical tension, RPE & exercise kinematics',
      icon: Brain,
      color: '#A3E635',
    },
    {
      id: 'indian_nutrition',
      label: 'Indian Athletic Nutritionist',
      sub: 'Bioavailable proteins, leucine & digestive gut health',
      icon: Utensils,
      color: '#4ADE80',
    },
    {
      id: 'recovery_cns',
      label: 'CNS Recovery & Circadian Specialist',
      sub: 'Sleep architecture, HRV & deload pacing',
      icon: Moon,
      color: '#10B981',
    },
    {
      id: 'transformation_coach',
      label: 'Transformation Head Coach',
      sub: 'Caloric deficit pacing & habit architecture',
      icon: Flame,
      color: '#ccff80',
    },
  ];

  // Model configurations
  const MODELS: {
    id: ModelType;
    label: string;
    badge: string;
    description: string;
  }[] = [
    {
      id: 'gemini-3.8-flash',
      label: 'Gemini 3.8 Flash',
      badge: 'General Tasks',
      description: 'Balanced sports science reasoning & fast generation',
    },
    {
      id: 'gemini-3.1-flash-lite',
      label: 'Gemini 3.1 Flash Lite',
      badge: 'Fast Tasks',
      description: 'Ultra-low latency for quick macro checks & cues',
    },
    {
      id: 'gemini-4-argon',
      label: 'Gemini 4 Argon',
      badge: 'Complex Tasks',
      description: 'Deep periodization & complex biochemical reasoning',
    },
  ];

  // Dynamic quick prompts based on role
  const getRolePrompts = (role: RoleType) => {
    switch (role) {
      case 'sports_scientist':
        return [
          'Barbell Bench vs Incline Dumbbell: Which provides superior upper clavicular recruitment?',
          'How do I calibrate RPE 8.5 vs RPE 10 to maximize motor unit recruitment without CNS burnout?',
          'What is the ideal intra-set rest period for myofibrillar hypertrophy on heavy compounds?',
        ];
      case 'indian_nutrition':
        return [
          'How can a 100% pure vegetarian hit 145g+ protein daily without eggs or meat?',
          'Compare Low-Fat Paneer vs Soya Chunks for maximum satiety during a fat loss deficit.',
          'Roasted Chana Sattu shaker: How to optimize electrolytes and leucine for fat burning?',
        ];
      case 'recovery_cns':
        return [
          'My resting heart rate is 72 BPM and recovery score is 92%. Am I cleared for heavy compounds?',
          'What is the optimal rest interval between heavy sets during a caloric deficit?',
          'How does 4,000 mL hydration daily accelerate metabolic clearance during fat loss?',
        ];
      case 'transformation_coach':
        return [
          'At 98.0 kg and 178 cm, what is the ideal fat-loss deficit to hit 82.0 kg without losing muscle?',
          'Should I combine Gym PPL split with Home Calisthenics sessions for higher weekly expenditure?',
          'How do I maintain strict vegetarian compliance while traveling or dining out?',
        ];
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isGenerating) return;

    setApiError(null);
    playTimerBeep('click');

    const userMessage: ChatItem = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    if (!textToSend) setInputText('');
    setIsGenerating(true);

    try {
      // Build conversation turns payload for Gemini API
      // History format: [{ role: 'user' | 'model', text: string }]
      const conversationPayload = newHistory.slice(-10).map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: conversationPayload.slice(0, -1), // previous turns
          model: selectedModel,
          role: selectedRole,
          userTelemetry,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }

      const data = await res.json();
      const modelReplyText = data.text || 'No response generated.';

      // Extract recommended action if applicable
      let actionRecommendation;
      if (modelReplyText.toLowerCase().includes('macro') || modelReplyText.toLowerCase().includes('protein')) {
        actionRecommendation = {
          type: 'macro_adjustment' as const,
          title: 'Review Indian Macro Calibration',
          description: 'Synchronize daily intake with verified bioavailability targets.',
        };
      } else if (modelReplyText.toLowerCase().includes('decompression') || modelReplyText.toLowerCase().includes('stretch')) {
        actionRecommendation = {
          type: 'recovery_protocol' as const,
          title: 'Apply Lumbar & Spine Protocol',
          description: 'Launch passive hang and hip flushes.',
        };
      }

      const aiMessage: ChatItem = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: modelReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        roleUsed: selectedRole,
        actionRecommendation,
      };

      setChatHistory((prev) => [...prev, aiMessage]);
      onSendMessage(text); // inform parent
    } catch (err: any) {
      console.error('Chat error:', err);
      setApiError(err.message || 'Unable to connect to Gemini API. Check your connection or secrets.');

      // Fallback local response so the user isn't stuck
      const fallbackMsg: ChatItem = {
        id: `fallback-${Date.now()}`,
        role: 'model',
        text: `[Offline Sports Science Advice]\n\nRegarding: "${text}"\n\n• Muscle Readiness: Your current telemetry indicates 91% recovery. Ensure protein distribution is spaced across 3-4 meals.\n• Immediate Form Check: Maintain a 3-second eccentric tempo and prevent momentum leaks.\n\n(Server note: ${err.message || 'API connection retry required'})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };
      setChatHistory((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
    playTimerBeep('click');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner: AI Coach Persona & Model Control Deck */}
      <div className="telemetry-card rounded-2xl p-5 sm:p-6 bg-[#111618] border border-[#10B981]/25">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#10B981]/15 gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#182022] border border-[#10B981]/40 flex items-center justify-center text-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.25)] shrink-0">
              <Brain className="w-6 h-6 text-[#A3E635]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-mono font-medium text-[#A3E635] uppercase tracking-wider">
                  MULTI-TURN GEMINI INTELLIGENCE
                </span>
                <span className="text-xs text-[#64748B]">·</span>
                <span className="text-xs text-[#10B981] font-mono">Telemetry Synchronized</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                AURAMORPH AI Sports Scientist & Coach
              </h1>
            </div>
          </div>

          {/* Model Selector Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Gemini Engine:</span>
            </span>

            <div className="flex items-center bg-[#182022] p-1 rounded-lg border border-[#10B981]/20 overflow-x-auto max-w-full">
              {MODELS.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-display transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#A3E635] text-[#0A0D0E] font-bold shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                    title={m.description}
                  >
                    <span>{m.label}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-[#0A0D0E]' : 'text-[#64748B]'}`}>
                      ({m.badge})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Persona Role Selection Tabs */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#94A3B8] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>Select Coaching Persona (System Instruction):</span>
            </span>
            <button
              onClick={handleClearChat}
              className="text-xs text-[#64748B] hover:text-[#ffb4ab] flex items-center gap-1 transition-colors"
              title="Clear current conversation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;

              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#182022] border-[#A3E635] shadow-[0_0_15px_-3px_rgba(163,230,53,0.2)]'
                      : 'bg-[#111618] border-[#10B981]/15 hover:border-[#10B981]/30'
                  }`}
                >
                  <div
                    className="p-1.5 rounded-lg shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isSelected ? 'rgba(163,230,53,0.15)' : '#182022',
                      color: r.color,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-semibold text-xs text-[#F8FAFC] truncate">
                      {r.label}
                    </div>
                    <div className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                      {r.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Athlete Telemetry Ribbon */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#10B981]/15 text-xs font-mono text-[#94A3B8]">
          <span className="text-[#64748B]">Context Injected:</span>
          <span className="text-[#A3E635] font-semibold">{userTelemetry.streakDays}D Streak</span>
          <span>·</span>
          <span className="text-[#F8FAFC]">{userTelemetry.weightKg} kg</span>
          <span>·</span>
          <span className="text-[#4ADE80]">{userTelemetry.currentProtein} / {userTelemetry.proteinTarget}g Protein</span>
          <span>·</span>
          <span className="text-[#10B981]">{userTelemetry.recoveryScore}% CNS Recovery</span>
        </div>
      </div>

      {/* Suggested Inquiries */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-[#94A3B8] block">
          Quick Inquiries for {ROLES.find((r) => r.id === selectedRole)?.label}:
        </span>
        <div className="flex flex-wrap gap-2">
          {getRolePrompts(selectedRole).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isGenerating}
              className="text-left text-xs px-3 py-1.5 rounded-lg bg-[#182022] border border-[#10B981]/20 text-[#94A3B8] hover:text-[#A3E635] hover:border-[#A3E635] transition-all disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="telemetry-card rounded-2xl p-5 sm:p-6 bg-[#111618] border border-[#10B981]/20 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {chatHistory.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#94A3B8]">
            <Brain className="w-10 h-10 text-[#64748B] mb-2" />
            <h3 className="font-display font-semibold text-base text-[#F8FAFC]">
              Start Consultation with {ROLES.find((r) => r.id === selectedRole)?.label}
            </h3>
            <p className="text-xs max-w-md mt-1 text-[#64748B]">
              Ask any question regarding training kinematics, Indian meal timing, protein bioavailability, or recovery protocols.
            </p>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isAi = msg.role === 'model';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-lg bg-[#182022] border border-[#10B981]/30 flex items-center justify-center text-[#A3E635] shrink-0 mt-1 shadow-[0_0_10px_rgba(163,230,53,0.15)]">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm transition-all ${
                    isAi
                      ? 'ai-coach-card shadow-[0_4px_25px_-5px_rgba(0,0,0,0.5)] text-[#F8FAFC]'
                      : 'bg-[#182022] border border-[#10B981]/25 text-[#F8FAFC] shadow-md'
                  }`}
                >
                  {/* Message Meta Header */}
                  <div className="flex items-center justify-between gap-3 text-[11px] mb-2 font-mono text-[#94A3B8]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[#A3E635]">
                        {isAi ? 'AURAMORPH BIO-ADVISOR' : 'ATHLETE'}
                      </span>
                      {isAi && msg.modelUsed && (
                        <span className="text-[10px] text-[#64748B] border border-[#10B981]/20 px-1 rounded">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Prose */}
                  <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm text-[#F8FAFC] font-sans">
                    {msg.text}
                  </div>

                  {/* Tags */}
                  {msg.tags && msg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#10B981]/15">
                      {msg.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111618] border border-[#10B981]/20 text-[#4ADE80]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action recommendation */}
                  {msg.actionRecommendation && (
                    <div className="mt-3 p-3 rounded-xl bg-[#111618] border border-[#A3E635]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-display font-bold text-[#A3E635]">
                          <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                          <span>{msg.actionRecommendation.title}</span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">
                          {msg.actionRecommendation.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (onApplyAction) onApplyAction(msg.actionRecommendation?.type || '');
                          confetti({ particleCount: 25, spread: 45, colors: ['#A3E635', '#10B981'] });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs glow-lime hover:scale-[1.02] transition-all flex items-center justify-center gap-1 shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Apply Action</span>
                      </button>
                    </div>
                  )}
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-lg bg-[#111618] border border-[#10B981]/20 flex items-center justify-center text-[#94A3B8] shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isGenerating && (
          <div className="flex gap-3 items-center text-xs text-[#94A3B8] font-mono">
            <div className="w-8 h-8 rounded-lg bg-[#182022] border border-[#10B981]/30 flex items-center justify-center text-[#A3E635]">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111618] border border-[#10B981]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-ping" />
              <span>
                {selectedModel === 'gemini-4-argon'
                  ? 'Gemini 4 Argon synthesizing deep biomechanical analysis...'
                  : selectedModel === 'gemini-3.1-flash-lite'
                  ? 'Gemini 3.1 Flash Lite streaming quick response...'
                  : 'Gemini 3.8 Flash calculating sports science recommendations...'}
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Error Banner if any */}
      {apiError && (
        <div className="p-3 rounded-xl bg-[#111618] border border-[#ffb4ab]/30 flex items-center justify-between text-xs text-[#ffb4ab]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiError}</span>
          </div>
          <button
            onClick={() => handleSendMessage()}
            className="px-2.5 py-1 rounded bg-[#182022] border border-[#ffb4ab]/40 text-xs font-mono hover:bg-[#ffb4ab] hover:text-[#0A0D0E] transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="sticky bottom-4 z-20 pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 p-1.5 rounded-xl glass-panel-elevated border border-[#10B981]/30 shadow-2xl"
        >
          <input
            type="text"
            placeholder={`Ask ${ROLES.find((r) => r.id === selectedRole)?.label} using ${selectedModel}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isGenerating}
            className="flex-1 bg-[#111618] rounded-lg border border-[rgba(148,163,184,0.15)] px-4 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none focus:border-[#A3E635] focus:shadow-[0_0_10px_rgba(163,230,53,0.2)] transition-all placeholder:text-[#64748B] disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="px-4 py-2.5 rounded-lg bg-[#A3E635] text-[#0A0D0E] font-display font-semibold text-xs sm:text-sm glow-lime hover:scale-[1.02] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shrink-0"
          >
            <span>Ask Coach</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
