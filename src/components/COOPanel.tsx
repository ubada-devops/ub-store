import React, { useState } from 'react';
import { 
  Sliders, AlertCircle, Cpu, Users, Calendar, 
  FileText, ShieldCheck, CheckSquare, Settings
} from 'lucide-react';
import { 
  ProjectTask, LeadAssignment, ZohoContract 
} from '../types';

interface COOPanelProps {
  tasks: ProjectTask[];
  setTasks: React.Dispatch<React.SetStateAction<ProjectTask[]>>;
  leads: LeadAssignment[];
  setLeads: React.Dispatch<React.SetStateAction<LeadAssignment[]>>;
  contracts: ZohoContract[];
  setContracts: React.Dispatch<React.SetStateAction<ZohoContract[]>>;
  adSpend: number;
  setAdSpend: (val: number) => void;
  developerSlots: number;
  setDeveloperSlots: (val: number) => void;
  systemStatus: 'SECURE_SESSION' | 'LOCKOUT';
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
}

export const COOPanel: React.FC<COOPanelProps> = ({
  tasks,
  setTasks,
  leads,
  setLeads,
  contracts,
  setContracts,
  adSpend,
  setAdSpend,
  developerSlots,
  setDeveloperSlots,
  systemStatus,
  addToast
}) => {
  // State for Hardware/Software Kill-Switch (Client proxy blocking)
  const [hardwareKillActive, setHardwareKillActive] = useState(false);

  // Trigger Lead assignment override
  const handleAssignLead = (leadId: string, devAlias: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setLeads(prev => prev.filter(l => l.id !== leadId));
    
    const newTask: ProjectTask = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      name: lead.name,
      client: `${lead.name.split(' ')[0]} Corp`,
      tier: lead.suggestedTier as any,
      stage: 'Pipeline',
      description: `Dispatched assignment from COO lead pool. Suggested value: ${lead.value}`,
      assignedDev: devAlias,
      prsCount: 0,
      health: 'Stable'
    };

    setTasks(prev => [...prev, newTask]);
    addToast(`Lead successfully matched! Assigned ${lead.name} to ${devAlias}.`, 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* 1. Warning banner if hardware/software access is killed */}
      {hardwareKillActive && (
        <div className="bg-yellow-950/60 border-2 border-yellow-500 text-yellow-200 p-6 rounded-md flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse shadow-md">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-yellow-500 shrink-0" size={32} />
            <div>
              <div className="font-bold text-base">CLIENT SOFTWARE ACCESS IS SUSPENDED</div>
              <div className="text-sm text-zinc-300">Non-compliant clients have been temporarily locked out of active staging sandbox proxies.</div>
            </div>
          </div>
          <button 
            onClick={() => { setHardwareKillActive(false); addToast('Client software nodes restored.', 'success'); }}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase text-xs px-5 py-3 rounded shadow-md transition-colors w-full md:w-auto"
          >
            Unfreeze Client Access
          </button>
        </div>
      )}

      {/* CORE SINGLE VIEW CONTAINER */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <Sliders size={24} className="text-emerald-400" />
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 font-mono">Operations Command Gate</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">COO Workspace Overview</h1>
          <p className="text-sm text-zinc-400 mt-1">Direct controls to override lead dispatch allocations, scale active computing cores, manage sandboxes, and inspect compliance contracts.</p>
        </div>

        {/* Core Dynamic Controllers: Ad Spend & Compute Slots Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Meta Ad Spend Input */}
          <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
            <div>
              <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider block">Marketing Budget Allocation</span>
              <span className="text-sm text-zinc-400">Routes dynamic funds directly to Meta traffic conversion campaigns.</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-zinc-400">Monthly Budget allocation:</span>
                <span className="text-emerald-400 font-bold">₹{adSpend.toLocaleString()}</span>
              </div>
              <input 
                type="range"
                min="5000"
                max="150000"
                step="5000"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>MIN: ₹5,000</span>
                <span>Yield impact: {(adSpend * 0.003).toFixed(0)} Leads/cycle</span>
                <span>MAX: ₹1,50,000</span>
              </div>
            </div>
          </div>

          {/* Compute Slots */}
          <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
            <div>
              <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider block">Compute Resource Slots</span>
              <span className="text-sm text-zinc-400">Adjust active sandbox CPU allocations supporting developer staging testing.</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-zinc-400">Allocated CPU Node Slots:</span>
                <span className="text-emerald-400 font-bold">{developerSlots} Cores</span>
              </div>
              <input 
                type="range"
                min="5"
                max="50"
                step="1"
                value={developerSlots}
                onChange={(e) => setDeveloperSlots(Number(e.target.value))}
                className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>MIN: 5 CPU</span>
                <span>Cost Impact: ₹{(developerSlots * 420).toLocaleString()}/mo</span>
                <span>MAX: 50 CPU</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Assignment Override Hub */}
        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Lead Dispatch Override Center</h3>
          <p className="text-xs text-zinc-500">Unassigned client project leads awaiting builder assignments. Select a lead and assign instantly to route tasks to active developer pipelines.</p>
          
          {leads.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-xs uppercase font-mono">No unassigned leads in queue</div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded">
                  <div>
                    <div className="text-sm font-bold text-white">{lead.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Suggested: {lead.suggestedTier} ({lead.value}) | Origin: {lead.region}</div>
                  </div>
                  <div className="flex gap-2">
                    {['UB_DEV_14', 'UB_DEV_04'].map((dev) => (
                      <button
                        key={dev}
                        onClick={() => handleAssignLead(lead.id, dev)}
                        className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-emerald-500 text-[10px] text-emerald-400 hover:text-white uppercase font-mono transition-colors"
                      >
                        Assign {dev}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zoho Contract Sign status logs */}
        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
          <h3 className="text-xs text-zinc-300 uppercase font-bold tracking-wider">Zoho Sign Contract Signings</h3>
          <p className="text-xs text-zinc-500">Monitor active developer NDAs and client IP assignment agreements awaiting signature verification.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((con, i) => (
              <div key={i} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                <div>
                  <div className="font-bold text-zinc-300">{con.party}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{con.type} ({con.role})</div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${con.status === 'Signed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse'}`}>
                    {con.status}
                  </span>
                  <div className="text-[8px] text-zinc-600 mt-1 uppercase">{con.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware/Software Kill-Switch Toggle */}
        <div className="pt-6 border-t border-zinc-850 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 uppercase font-bold block">Clients Proxy Suspensions Controller</span>
            <p className="text-xs text-zinc-500 max-w-lg leading-relaxed">Lock access to preview sandboxes instantly for clients with delinquent or failed subscription payments.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className={`text-xs uppercase font-mono font-bold ${hardwareKillActive ? 'text-yellow-500 animate-pulse' : 'text-zinc-600'}`}>
              {hardwareKillActive ? 'Access Suspended' : 'Access Open'}
            </span>
            <button
              onClick={() => {
                setHardwareKillActive(!hardwareKillActive);
                addToast(hardwareKillActive ? 'Restored client workspace staging access.' : 'Client proxy blocks activated.', hardwareKillActive ? 'success' : 'warn');
              }}
              className={`flex-1 md:flex-initial px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded border transition-all ${hardwareKillActive ? 'bg-zinc-950 border-yellow-500 text-yellow-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
            >
              Toggle Lockout Switch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
