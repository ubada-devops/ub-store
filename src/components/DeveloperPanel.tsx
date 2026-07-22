import React, { useState, useEffect } from 'react';
import { 
  Terminal, ShieldCheck, Play, Square, Send, Key, Coins, 
  ChevronRight, ClipboardCheck, ArrowUpRight, CheckCircle2,
  FolderOpen, AlertOctagon, RefreshCw, Send as TelegramIcon,
  BookOpen, LayoutGrid, Eye, Clock, ListChecks
} from 'lucide-react';
import { ProjectTask, LeadAssignment } from '../types';
import { supabase } from '../supabaseClient';


interface DeveloperPanelProps {
  tasks: ProjectTask[];
  setTasks: React.Dispatch<React.SetStateAction<ProjectTask[]>>;
  leads: LeadAssignment[];
  setLeads: React.Dispatch<React.SetStateAction<LeadAssignment[]>>;
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
  currentUser: any;
}

export const DeveloperPanel: React.FC<DeveloperPanelProps> = ({
  tasks,
  setTasks,
  leads,
  setLeads,
  addToast,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'workbench' | 'deliveries'>('workbench');

  // Timer State for Sprint Time Log Tracker
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Submit for Review states
  const [selectedTaskToSubmit, setSelectedTaskToSubmit] = useState('');
  const [repoUrlInput, setRepoUrlInput] = useState('');

  // Selected Task for PRD Viewer Panel
  const [activePrdTask, setActivePrdTask] = useState<ProjectTask | null>(tasks[0] || null);

  // Simulated Telegram broadcast input
  const [telegramMessage, setTelegramMessage] = useState('');

  // Copilot code copy indicator
  const [copilotCopied, setCopilotCopied] = useState(false);

  // Update timer every second
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const devAlias = currentUser?.alias_mask || 'UB_DEV_14';
  const myTasks = tasks.filter(t => t.assignedDev === devAlias);
  const taskCapacity = myTasks.length;

  // Claim Sprint from marketplace
  const handleClaimSprint = async (leadId: string) => {
    if (taskCapacity >= 4) {
      addToast('Sprinting Limit Warning: Maximum weekly capacity (4 projects) achieved.', 'error');
      return;
    }

    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setLeads(prev => prev.filter(l => l.id !== leadId));

    const claimedTask: ProjectTask = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      name: lead.name,
      client: `${lead.name.split(' ')[0]} Corp`,
      tier: lead.suggestedTier as any,
      stage: 'Development',
      description: `Claimed from lead marketplace. Standard payout: ${lead.value}.`,
      assignedDev: devAlias,
      prsCount: 1,
      health: 'Stable'
    };

    const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || 
                          import.meta.env.VITE_SUPABASE_URL === 'https://placeholder-project.supabase.co' ||
                          import.meta.env.VITE_SUPABASE_ANON_KEY === 'placeholder-anon-key';

    if (!isPlaceholder) {
      try {
        const { error } = await supabase.from('tasks').insert([
          {
            id: claimedTask.id,
            name: claimedTask.name,
            client: claimedTask.client,
            tier: claimedTask.tier,
            stage: claimedTask.stage,
            description: claimedTask.description,
            assigned_dev_id: currentUser?.id,
            assigned_dev_name: devAlias,
            prs_count: claimedTask.prsCount,
            health: claimedTask.health
          }
        ]);
        if (error) throw error;
      } catch (err: any) {
        console.error('Error adding task to Supabase:', err);
        addToast('Failed to claim task in database.', 'error');
      }
    }

    setTasks(prev => [...prev, claimedTask]);
    addToast(`Successfully claimed! ${lead.name} added to your workspace.`, 'success');
  };

  // Submit code for Ammar's validation
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToSubmit) {
      addToast('Please select a task to submit.', 'error');
      return;
    }
    if (!repoUrlInput.trim().startsWith('http')) {
      addToast('Please enter a valid GitHub repository URL.', 'error');
      return;
    }

    const taskToUpdate = tasks.find(t => t.id === selectedTaskToSubmit);
    const updatedPrCount = taskToUpdate ? taskToUpdate.prsCount + 1 : 1;

    try {
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ stage: 'QA', prs_count: updatedPrCount })
        .eq('id', selectedTaskToSubmit);
      if (taskError) throw taskError;

      const { error: submissionError } = await supabase
        .from('github_submissions')
        .insert([
          {
            task_id: selectedTaskToSubmit,
            repo_url: repoUrlInput,
            submitted_by: currentUser?.id
          }
        ]);
      if (submissionError) throw submissionError;

      setTasks(prev => prev.map(t => {
        if (t.id === selectedTaskToSubmit) {
          return { ...t, stage: 'QA', prsCount: updatedPrCount };
        }
        return t;
      }));

      setRepoUrlInput('');
      addToast(`Codebase submitted. Notifying AMMAR_CTO for PR review validation.`, 'success');
    } catch (err) {
      console.error('Error submitting code in Supabase:', err);
      addToast('Failed to save code submission in database.', 'error');
    }
  };

  // Broadcast to Telegram secure hook
  const handleTelegramBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramMessage.trim()) {
      addToast('Cannot broadcast empty message.', 'error');
      return;
    }
    addToast(`Broadcast dispatched: "${telegramMessage.substring(0, 20)}..." sent to corporate channel webhook.`, 'success');
    setTelegramMessage('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      
      {/* 1. Sprints Capacity Banner */}
      {taskCapacity >= 4 && (
        <div className="bg-yellow-950/60 border-2 border-yellow-500 text-yellow-200 p-6 rounded-md flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <AlertOctagon className="text-yellow-500 shrink-0" size={32} />
            <div>
              <div className="font-bold text-base">MAXIMUM WEEKLY CAPACITY REACHED (4 / 4)</div>
              <div className="text-xs text-zinc-300">You have hit your weekly concurrent project limits. Complete active sidetasks to release slots.</div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('workbench')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase text-xs px-5 py-3 rounded shadow-md transition-colors w-full md:w-auto"
          >
            Review Active Workbench
          </button>
        </div>
      )}

      {/* 2. Simplified Section Tab Switcher */}
      <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-md">
        <button
          onClick={() => setActiveTab('workbench')}
          className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'workbench' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <LayoutGrid size={16} />
          Active Workbench & Sprints Time logs
        </button>
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'deliveries' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Eye size={16} />
          Submit Code & Sprints Marketplace
        </button>
      </div>

      {/* MAIN SINGLE CARD FOCUS CONTAINER */}
      {activeTab === 'workbench' ? (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-zinc-800 pb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <Terminal size={24} className="text-emerald-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 font-mono">Developer Operations</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Freelancer Workbench Overview</h1>
            <p className="text-sm text-zinc-400 mt-1">Simple dashboard to log active development hours, track Sunday payout estimates, and complete assigned tasks.</p>
          </div>

          {/* Simple Stats Summary Rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sprints Capacity Meter */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-2">
              <div className="flex justify-between items-center text-xs text-zinc-500 font-bold uppercase">
                <span>Concurrency Capacity</span>
                <span className="text-emerald-400">{taskCapacity} / 4 projects</span>
              </div>
              <div className="h-3 bg-zinc-900 border border-zinc-800 rounded p-[1px]">
                <div 
                  className={`h-full rounded transition-all duration-500 ${taskCapacity === 4 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}
                  style={{ width: `${(taskCapacity / 4) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-500 block">Strict limit to maintain high quality.</span>
            </div>

            {/* Time log tracker */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-zinc-500 uppercase block font-bold">Active Sprint Hour Timer</span>
                <span className="text-2xl font-bold font-mono text-zinc-200 block">{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={() => {
                  setTimerActive(!timerActive);
                  addToast(timerActive ? 'Sprint stopwatch paused.' : 'Sprint stopwatch started.', 'info');
                }}
                className={`p-3 rounded-full border transition-all ${timerActive ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'}`}
              >
                {timerActive ? <Square size={16} /> : <Play size={16} />}
              </button>
            </div>

            {/* Sunday Payout Estimates */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-zinc-500 uppercase block font-bold">Sunday Payout Estimate</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 block">₹{(taskCapacity * 2800).toLocaleString()}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">₹2,800 / contractSunday</span>
              </div>
              <Coins size={32} className="text-emerald-500/60" />
            </div>
          </div>

          {/* Active Tasks list */}
          <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">My Active Developer Sprints</h3>
            <p className="text-xs text-zinc-500">Currently assigned contracts under active development. Keep codebases stable to clear Sunday payout audits.</p>
            
            {myTasks.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs font-mono uppercase">You have no active projects in progress</div>
            ) : (
              <div className="space-y-3">
                {myTasks.map((t) => (
                  <div key={t.id} className="p-4 bg-zinc-900 border border-zinc-800 flex justify-between items-center rounded">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 font-bold font-mono uppercase rounded-sm">{t.id}</span>
                        <span className="text-xs text-zinc-400 font-bold font-mono">Stage: {t.stage}</span>
                      </div>
                      <div className="text-sm font-bold text-white mt-1.5">{t.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">Client: {t.client} | Budget tier: {t.tier}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase rounded ${t.health === 'Stable' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'}`}>
                        {t.health}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Deliveries and Sprints marketplace header */}
          <div className="border-b border-zinc-800 pb-6">
            <span className="text-xs uppercase font-mono text-zinc-500 font-bold">Deliveries & Contracts</span>
            <h1 className="text-2xl font-bold text-zinc-100">Deliveries & Leads Marketplace</h1>
            <p className="text-sm text-zinc-400 mt-1">Submit completed codebases to Ammar for review, and claim new projects from the open leads queue.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Submit Code Form */}
            <form onSubmit={handleSubmitReview} className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-2">
                <ClipboardCheck size={16} className="text-emerald-500" />
                Submit Code for Validation
              </h3>
              <p className="text-xs text-zinc-500">Pushes active commits to staging pipelines and triggers pull requests automatically for CTO evaluation.</p>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Select Active Project Sidetask</label>
                  <select
                    value={selectedTaskToSubmit}
                    onChange={(e) => setSelectedTaskToSubmit(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-300 font-mono"
                  >
                    <option value="">-- Choose active sprint task --</option>
                    {myTasks.map(t => (
                      <option key={t.id} value={t.id}>{t.id} - {t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">GitHub Repository URL</label>
                  <input 
                    type="text"
                    value={repoUrlInput}
                    onChange={(e) => setRepoUrlInput(e.target.value)}
                    placeholder="e.g. https://github.com/ubtech/cardiocare"
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase py-2.5 text-xs rounded transition-colors shadow-md cursor-pointer"
                >
                  Request Pull Request Review
                </button>
              </div>
            </form>

            {/* Lead Marketplace list */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Unassigned Sprints Marketplace</h3>
              <p className="text-xs text-zinc-500">Claim available contracts to add immediately to your workbench pipeline. Strictly complies with the 4-task limit.</p>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {leads.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-xs uppercase font-mono">No available leads to claim</div>
                ) : (
                  leads.map((lead) => (
                    <div key={lead.id} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                      <div>
                        <div className="font-bold text-zinc-200">{lead.name}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Tier: {lead.suggestedTier} | Yield: {lead.value}</div>
                      </div>
                      <button
                        onClick={() => handleClaimSprint(lead.id)}
                        disabled={taskCapacity >= 4}
                        className="px-3 py-1 bg-zinc-950 hover:bg-emerald-500 border border-zinc-800 hover:border-emerald-500 disabled:opacity-50 text-emerald-400 hover:text-black font-bold uppercase tracking-wider text-[10px] transition-colors"
                      >
                        Claim
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* PRD Viewer Panel */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-2">
                  <BookOpen size={16} className="text-emerald-500" />
                  Sprint Specifications PRD Reader
                </h3>
              </div>
              <div className="space-y-3">
                <select
                  value={activePrdTask?.id || ''}
                  onChange={(e) => {
                    const found = tasks.find(t => t.id === e.target.value);
                    if (found) setActivePrdTask(found);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 outline-none focus:border-emerald-500 text-zinc-300 font-mono"
                >
                  <option value="">-- Choose project task to review --</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.id} - {t.name}</option>
                  ))}
                </select>

                {activePrdTask ? (
                  <div className="p-4 bg-zinc-900 border border-zinc-850 rounded text-xs space-y-2">
                    <div className="font-bold text-white uppercase font-mono">{activePrdTask.id} Requirements Spec:</div>
                    <p className="text-zinc-400 leading-relaxed font-sans">{activePrdTask.description}</p>
                    <div className="text-[10px] text-zinc-500 uppercase font-mono">Stage: <span className="text-emerald-400">{activePrdTask.stage}</span></div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-zinc-500 text-xs uppercase font-mono">Select a task above to read requirements</div>
                )}
              </div>
            </div>

            {/* Telegram broadcast channels */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-2">
                <TelegramIcon size={16} className="text-emerald-500" />
                Telegram Broadcast Channel Logger
              </h3>
              <p className="text-xs text-zinc-500 font-mono">Pushes status alerts and progress statements directly to corporate team broadcast hook channels.</p>
              
              <form onSubmit={handleTelegramBroadcast} className="space-y-3">
                <input 
                  type="text"
                  value={telegramMessage}
                  onChange={(e) => setTelegramMessage(e.target.value)}
                  placeholder="e.g. Completed Low-Level Design checklists on BOM-2204..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-100"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase py-2 text-xs rounded transition-colors shadow-md cursor-pointer"
                >
                  Disburse Broadcast
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
