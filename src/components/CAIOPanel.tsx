import React, { useState, useEffect } from 'react';
import { 
  Brain, Cpu, Mic, Play, RefreshCw, Layers,
  Activity, Sliders, Radio, AlertCircle, Sparkles, Send, Database, Compass
} from 'lucide-react';

interface CAIOPanelProps {
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
}

export const CAIOPanel: React.FC<CAIOPanelProps> = ({ addToast }) => {
  const [selectedAgent, setSelectedAgent] = useState('Sales Qualifier Voice Bot');
  const [promptInput, setPromptInput] = useState('You are an expert sales qualifier for UB CLUB. Keep replies under 2 sentences and focus on retainer value...');
  const [isPromptSaving, setIsPromptSaving] = useState(false);
  const [isTestingCall, setIsTestingCall] = useState(false);
  const [activeCallLogs, setActiveCallLogs] = useState<string[]>([
    '[SYSTEM] Retell AI voice session initialized.',
    '[AGENT] Hello, thank you for contacting UB CLUB. How can I help you today?',
    '[USER] Hi, I want to build a clinic scraping dashboard.'
  ]);

  // Simulate WebRTC voice activity
  const [volumeLevel, setVolumeLevel] = useState(0);
  useEffect(() => {
    if (!isTestingCall) {
      setVolumeLevel(0);
      return;
    }
    const timer = setInterval(() => {
      setVolumeLevel(Math.floor(Math.random() * 85) + 15);
      const userReplies = [
        '[USER] Yes, the budget is around 5 lakhs.',
        '[AGENT] Got it. Our Enterprise package starts at ₹4,999/mo.',
        '[USER] Perfect, does that include Skydo webhook integration?',
        '[AGENT] Yes, Skydo and Stripe are fully integrated.'
      ];
      if (Math.random() > 0.6) {
        const randomReply = userReplies[Math.floor(Math.random() * userReplies.length)];
        setActiveCallLogs(prev => [...prev, randomReply]);
      }
    }, 1200);
    return () => clearInterval(timer);
  }, [isTestingCall]);

  const handleUpdatePrompt = () => {
    setIsPromptSaving(true);
    addToast('Parsing prompt parameters and semantic token size...', 'info');
    setTimeout(() => {
      setIsPromptSaving(false);
      addToast('AI System Prompt updated and synced with Retell API nodes.', 'success');
    }, 1500);
  };

  const handleTestCall = () => {
    setIsTestingCall(!isTestingCall);
    addToast(isTestingCall ? 'Voice WebRTC call disconnected.' : 'Voice WebRTC call established. Speak now.', isTestingCall ? 'info' : 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Daily API Token Consumption</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">1,842,400</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Quota: 5,000,000 / day</span>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Retell Voice Streams</span>
          <div className="text-xl font-bold font-mono text-white mt-1">4 Active</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">WebRTC Latency: 120ms</span>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Vector Store Cache Hit</span>
          <div className="text-xl font-bold font-mono text-white mt-1">94.2%</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">PgVector storage index</span>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">AI Agent Pipeline Status</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-2">
            <Radio size={16} className="text-emerald-500 animate-pulse" />
            STABLE
          </div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Llama-3 Edge node</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Retell Voice Bot Agent Controller */}
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Mic size={16} className="text-emerald-500" />
            Retell AI Voice Agent Sandbox
          </h3>
          <p className="text-xs text-zinc-500">Live-audit and test voice responses for qualifiers and lead collectors using WebRTC voice streams.</p>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Select Active Bot Profile</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-300 font-mono rounded"
              >
                <option value="Sales Qualifier Voice Bot">Sales Qualifier Voice Bot (Meta Ads lead)</option>
                <option value="Customer Support Voice Bot">Customer Support Voice Bot (Retainer portal)</option>
                <option value="Tech Screening Bot">Tech Screening Bot (Freelancer validation)</option>
              </select>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-850 rounded flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-zinc-200 block">WebRTC Stethoscope Tester</span>
                <span className="text-[10px] text-zinc-500 font-mono uppercase mt-0.5">Click to establish real-time test audio</span>
              </div>
              <button
                onClick={handleTestCall}
                className={`px-4 py-2 text-xs font-bold uppercase rounded transition-colors ${isTestingCall ? 'bg-red-500 text-white' : 'bg-emerald-500 text-black hover:bg-emerald-400'}`}
              >
                {isTestingCall ? 'Disconnect' : 'Connect Voice'}
              </button>
            </div>

            {isTestingCall && (
              <div className="space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase font-mono block font-bold">Input Amplitude Levels:</span>
                <div className="h-2.5 bg-zinc-950 rounded overflow-hidden border border-zinc-850 flex items-center">
                  <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${volumeLevel}%` }} />
                </div>
              </div>
            )}

            {/* Live call transcript logs */}
            <div className="space-y-2">
              <span className="text-[9px] text-zinc-500 uppercase font-mono block font-bold">Real-time Call Transcript Logs:</span>
              <div className="bg-zinc-950 border border-zinc-850 p-4 font-mono text-[10px] text-emerald-400 space-y-1.5 h-36 overflow-y-auto rounded custom-scrollbar">
                {activeCallLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed border-b border-zinc-900/40 pb-1 last:border-0">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LLM System Prompts Playground */}
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Brain size={16} className="text-emerald-500" />
            LLM System Prompt Playground
          </h3>
          <p className="text-xs text-zinc-500">Configure prompt logic governing agent routing gates, extraction constraints, and model thresholds.</p>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">System Directive Core Instruction</label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={5}
                className="w-full bg-zinc-950 border border-zinc-850 rounded p-3 font-mono text-xs text-zinc-300 outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
              <span>Approx size: 142 tokens</span>
              <button
                onClick={handleUpdatePrompt}
                disabled={isPromptSaving}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs rounded transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isPromptSaving ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    Deploy LLM Prompt
                  </>
                )}
              </button>
            </div>

            {/* Model deployments tracker */}
            <div className="p-4 bg-zinc-950 border border-zinc-850 rounded space-y-2.5">
              <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold flex items-center gap-1.5">
                <Layers size={12} className="text-emerald-500" />
                Active Inference Deployments
              </span>
              <div className="space-y-2 text-[10px] font-mono">
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-500">retell-voice-alpha</span>
                  <span className="text-emerald-400 font-bold">llama-3-70b-groq [DEPLOYED]</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-500">rag-embedding-vector</span>
                  <span className="text-emerald-400 font-bold">text-embedding-3-small [DEPLOYED]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">autonomous-grader-eval</span>
                  <span className="text-zinc-400">gpt-4o-mini [STANDBY]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
