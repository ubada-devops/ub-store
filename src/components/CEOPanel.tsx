import React, { useState } from 'react';
import { 
  TrendingUp, Users, Award, AlertTriangle, AlertOctagon, HelpCircle, Activity,
  Globe, Landmark, ShieldAlert, Sparkles, Database, LayoutGrid, Eye
} from 'lucide-react';
import { ProjectTask } from '../types';
import { BACKUP_ROSTER, MAANG_JOBS, REGIONAL_INCOME } from '../data';

interface CEOPanelProps {
  tasks: ProjectTask[];
  adSpend: number;
  developerSlots: number;
  founderFocus: 'In Studio' | 'In Sprints' | 'Strategic' | 'Standby';
  setFounderFocus: (focus: 'In Studio' | 'In Sprints' | 'Strategic' | 'Standby') => void;
  systemStatus: 'SECURE_SESSION' | 'LOCKOUT';
  setSystemStatus: (status: 'SECURE_SESSION' | 'LOCKOUT') => void;
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
}

export const CEOPanel: React.FC<CEOPanelProps> = ({
  tasks,
  adSpend,
  developerSlots,
  founderFocus,
  setFounderFocus,
  systemStatus,
  setSystemStatus,
  addToast
}) => {
  const [showKillModal, setShowKillModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'essentials' | 'advanced'>('essentials');
  const [complianceCounter, setComplianceCounter] = useState(2);

  // Dynamic calculations
  const activeClients = tasks.length;
  const totalDevPayout = tasks.filter(t => t.assignedDev !== 'Unassigned').length * 2800;
  const targetRevenue = 10000000; // 1 Crore
  const currentRevenue = 6000000 + tasks.reduce((sum, t) => {
    const val = t.tier === '₹4,999' ? 4999 : t.tier === '₹2,499' ? 2499 : 499;
    return sum + val;
  }, 0) * 200; // Scaled to reflect overall pipeline yield
  const revenuePercent = Math.min((currentRevenue / targetRevenue) * 100, 100);
  const weeklyVelocity = 384615;
  const actualWeeklyRunRate = tasks.reduce((sum, t) => {
    const val = t.tier === '₹4,999' ? 4999 : t.tier === '₹2,499' ? 2499 : 499;
    return sum + val;
  }, 0) * 30;

  const marketingROI = adSpend > 0 ? (1200000 / adSpend).toFixed(2) : '4.82';
  const impulseCount = tasks.filter(t => t.tier === '₹499').length;
  const enterpriseCount = tasks.filter(t => t.tier === '₹4,999').length;

  const handleTriggerKillSwitch = () => {
    if (systemStatus === 'LOCKOUT') {
      setSystemStatus('SECURE_SESSION');
      addToast('System lockout terminated. Database nodes restored.', 'success');
    } else {
      setSystemStatus('LOCKOUT');
      addToast('EMERGENCY KILL-SWITCH ENGAGED! System Lockout Activated.', 'error');
    }
    setShowKillModal(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* 1. Critical Warning Banner */}
      {systemStatus === 'LOCKOUT' && (
        <div className="bg-red-950/60 border-2 border-red-500 text-red-200 p-6 rounded-md flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse shadow-lg">
          <div className="flex items-center gap-4">
            <AlertOctagon className="text-red-500 shrink-0" size={32} />
            <div>
              <div className="font-bold text-lg">SYSTEM IS LOCKED OUT!</div>
              <div className="text-sm text-red-300">All external staging sandboxes are frozen. Database connections suspended.</div>
            </div>
          </div>
          <button 
            onClick={() => { setSystemStatus('SECURE_SESSION'); addToast('Database connections restored.', 'success'); }}
            className="bg-red-500 hover:bg-red-600 text-black font-bold uppercase text-xs px-5 py-3 rounded shadow-md transition-colors w-full md:w-auto"
          >
            Clear Lockout Mode
          </button>
        </div>
      )}

      {/* 2. Unified High-Impact Control Tab Switcher */}
      <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-md">
        <button
          onClick={() => setActiveTab('essentials')}
          className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'essentials' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <LayoutGrid size={16} />
          Primary Dashboard Focus
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'advanced' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Eye size={16} />
          Detailed Audits & Backstage Logs
        </button>
      </div>

      {/* MAIN SINGLE FOCUS CARD LAYOUT */}
      {activeTab === 'essentials' ? (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-zinc-800 pb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <Sparkles size={24} className="text-emerald-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 font-mono">Executive Control Hub</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">CEO Workspace Overview</h1>
            <p className="text-sm text-zinc-400 mt-1">Simple high-level control panel tracking company growth targets, core statuses, and active focus operations.</p>
          </div>

          {/* Core Target Progress */}
          <div className="space-y-4 bg-zinc-950/50 p-6 border border-zinc-850 rounded">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
              <div>
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider block">Annual Revenue Target Progress</span>
                <span className="text-2xl font-bold text-zinc-100">₹68,40,000 completed</span>
              </div>
              <div className="text-right">
                <span className="text-lg text-emerald-400 font-bold font-mono">Target: ₹1,00,00,000 ({revenuePercent.toFixed(1)}%)</span>
              </div>
            </div>
            
            <div className="h-6 bg-zinc-900 border border-zinc-800 rounded-full p-1 relative overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] transition-all duration-1000"
                style={{ width: `${revenuePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>PROGRESS STATE: ACTIVE ADVANCEMENT</span>
              <span>₹31,60,000 remaining to 1 Crore goal</span>
            </div>
          </div>

          {/* Simple Core Numbers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-500 uppercase block font-bold">Clients on Retainer</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">{activeClients} accounts</span>
              </div>
              <Users size={32} className="text-emerald-500/80" />
            </div>

            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-500 uppercase block font-bold">Weekly Income Velocity</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">₹{actualWeeklyRunRate.toLocaleString('en-IN')}</span>
              </div>
              <TrendingUp size={32} className="text-emerald-500/80" />
            </div>

            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-500 uppercase block font-bold">Weekly Developer Payout</span>
                <span className="text-2xl font-bold font-mono text-red-400 mt-1 block">₹{totalDevPayout.toLocaleString()}</span>
              </div>
              <Landmark size={32} className="text-red-400/80" />
            </div>
          </div>

          {/* Founder Status Selector (Extremely Clean) */}
          <div className="pt-4 border-t border-zinc-850">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Founder Active Focus Mode</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['In Studio', 'In Sprints', 'Strategic', 'Standby'] as const).map(focus => (
                <button
                  key={focus}
                  onClick={() => {
                    setFounderFocus(focus);
                    addToast(`Founder status updated: ${focus}.`, 'success');
                  }}
                  className={`p-4 text-center rounded transition-all duration-200 border cursor-pointer ${founderFocus === focus ? 'bg-emerald-500 text-black border-emerald-500 font-bold shadow-lg shadow-emerald-500/10' : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'}`}
                >
                  <div className="text-xs font-bold uppercase font-mono">{focus}</div>
                  <span className="text-[10px] text-zinc-500 font-normal uppercase block mt-1">
                    {focus === 'In Studio' && 'Directing Operations'}
                    {focus === 'In Sprints' && 'Engineering Audit'}
                    {focus === 'Strategic' && 'Leveraging Leads'}
                    {focus === 'Standby' && 'Edge Alert'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Zone: Clean Emergency Box */}
          <div className="pt-6 border-t border-zinc-850 flex flex-col md:flex-row items-center justify-between gap-4 bg-red-950/5 p-6 border border-red-950/20 rounded">
            <div className="space-y-1">
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest block">System Security Control</span>
              <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">Engage emergency lockout protocol in case of cyber breach. This locks access keys and sandboxes instantly across all developer workstations.</p>
            </div>
            <button
              onClick={() => setShowKillModal(true)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider rounded border transition-all w-full md:w-auto shadow-md ${systemStatus === 'LOCKOUT' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' : 'bg-red-950 border-red-500 text-red-200 hover:bg-red-900/40'}`}
            >
              {systemStatus === 'LOCKOUT' ? 'De-activate Lockout Mode' : 'Emergency System Kill-Switch'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Advanced header */}
          <div className="border-b border-zinc-800 pb-6 flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-mono text-zinc-500 font-bold">Backstage Diagnostics</span>
              <h1 className="text-2xl font-bold text-zinc-100">Audit & Logging Central</h1>
            </div>
            <span className="text-xs font-mono bg-zinc-950 px-3 py-1.5 border border-zinc-800 text-zinc-500">CONSOLIDATED ACCESS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MAANG Global Industry Benchmarks */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">MAANG Competence Benchmarks</h3>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 font-bold uppercase font-mono">Market Rates</span>
              </div>
              <p className="text-xs text-zinc-500">Tracking global equivalents to ensure our custom developer sprints match industry-leading L6+ standards.</p>
              <div className="space-y-3">
                {MAANG_JOBS.map((job, i) => (
                  <div key={i} className="p-3 bg-zinc-900 border border-zinc-850 rounded text-xs">
                    <div className="flex justify-between items-start font-mono">
                      <div>
                        <span className="font-bold text-white">{job.company}</span>
                        <span className="text-zinc-500 text-[10px] block mt-0.5">{job.title}</span>
                      </div>
                      <span className="text-emerald-400 font-bold font-mono">{job.pay}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.matches.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[9px] bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 text-zinc-400 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Income & MVP Indicator */}
            <div className="space-y-6">
              <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-3">
                <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Global Regional Heatmap</h3>
                <div className="space-y-2.5">
                  {REGIONAL_INCOME.map((reg, i) => (
                    <div key={i} className="flex justify-between text-xs font-mono pb-2 border-b border-zinc-900 last:border-0 last:pb-0">
                      <span className="text-zinc-300">{reg.region}</span>
                      <span className="text-zinc-500">{reg.clientsCount} clients</span>
                      <span className="text-emerald-400 font-bold">{reg.volume}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MVP badge */}
              <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Award size={24} />
                </div>
                <div>
                  <span className="text-xs uppercase text-zinc-500 font-bold block">MVP Developer of Sprints</span>
                  <span className="text-sm font-bold font-mono text-zinc-100 block">UB_DEV_14</span>
                  <span className="text-xs text-zinc-500">Lead time of 1.4 Days to active production deployments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Third row: marketing calculations & compliance logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Marketing yield estimation */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-3">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Dynamic Marketing ROI Indicator</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white font-mono">{marketingROI}x</span>
                <span className="text-xs text-emerald-400 font-mono">Meta Ad Campaign Yield</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Estimates the ratio of leads processed relative to Meta Ad spend allocations dispatched from operations. Currently set at ₹{adSpend.toLocaleString()} spend per cycle.</p>
            </div>

            {/* Compliance Infractions list */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Compliance Monitor & Bots</h3>
                <span className="text-xs bg-red-950/30 text-red-400 border border-red-900/40 px-2 py-0.5 rounded">FILTER ALERTS</span>
              </div>
              <div className="flex justify-between items-center bg-zinc-900 p-4 border border-zinc-850">
                <div>
                  <span className="text-sm text-zinc-200 block font-bold">Active Filter Infractions: {complianceCounter}</span>
                  <span className="text-xs text-zinc-500">Logs flag any client messages breaching security parameters.</span>
                </div>
                <button 
                  onClick={() => { setComplianceCounter(0); addToast('Compliance infractions cleared.', 'success'); }}
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 uppercase font-mono"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Backup Roster Status Strip */}
          <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
            <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">On-Call Standby Engineer Roster</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BACKUP_ROSTER.map((dev, i) => (
                <div key={i} className="bg-zinc-900 p-3 border border-zinc-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block font-mono">{dev.id}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block">{dev.focus}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 font-bold uppercase">
                    {dev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kill Switch Trigger Confirmation Modal */}
      {showKillModal && (
        <>
          <div className="fixed inset-0 bg-black/85 z-[150] backdrop-blur-sm" onClick={() => setShowKillModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-950 border-2 border-red-500 p-8 z-[160] font-mono shadow-2xl shadow-red-500/20 rounded-none">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={24} className="animate-bounce" />
              <h2 className="text-lg font-bold tracking-tighter uppercase">HIGH RISK SYSTEM ACTION</h2>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 uppercase">
              You are about to engage the Emergency Kill-Switch. This will revoke database credentials, freeze sandboxes, and lock access keys across all active dev workspaces.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowKillModal(false)}
                className="flex-1 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 py-3 uppercase font-bold"
              >
                Cancel Protocol
              </button>
              <button
                onClick={handleTriggerKillSwitch}
                className="flex-1 bg-red-500 text-black text-xs py-3 font-bold uppercase hover:bg-red-400"
              >
                {systemStatus === 'LOCKOUT' ? 'Restore DB access' : 'CONFIRM LOCKOUT'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
