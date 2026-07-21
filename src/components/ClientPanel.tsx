import React, { useState } from 'react';
import { 
  Milestone, ShieldCheck, UploadCloud, MessageSquare, Landmark, 
  HelpCircle, CheckCircle2, Sliders, Key, Gift, Lock, Globe,
  Star, MessageCircle, AlertCircle, ArrowUpRight, Check,
  Download, LayoutGrid, Eye, BellRing, ChevronRight
} from 'lucide-react';
import { 
  ProjectTask, ChangeRequestTicket, ZohoContract, 
  EscrowTransaction, SandboxStatus 
} from '../types';

interface ClientPanelProps {
  tasks: ProjectTask[];
  escrows: EscrowTransaction[];
  sandboxes: SandboxStatus[];
  changeRequests: ChangeRequestTicket[];
  setChangeRequests: React.Dispatch<React.SetStateAction<ChangeRequestTicket[]>>;
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
}

export const ClientPanel: React.FC<ClientPanelProps> = ({
  tasks,
  escrows,
  sandboxes,
  changeRequests,
  setChangeRequests,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'support'>('roadmap');

  // State for Drag and Drop Uploader
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Rating state
  const [clientRating, setClientRating] = useState(5);

  // Upgrade Plan state
  const [selectedPlanTier, setSelectedPlanTier] = useState<'₹499' | '₹2,499' | '₹4,999'>('₹4,999');

  // Opt-in notification states
  const [smsPing, setSmsPing] = useState(true);
  const [emailPing, setEmailPing] = useState(true);
  const [whatsappPing, setWhatsappPing] = useState(false);

  // New Ticket State
  const [ticketType, setTicketType] = useState<'UI Adjustment' | 'Logic Bug' | 'API Modification'>('UI Adjustment');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [ticketDesc, setTicketDesc] = useState('');

  // Roadmap active step - 6 steps
  const [activeRoadmapStep, setActiveRoadmapStep] = useState(4); // Staging QA
  const roadmapSteps = [
    { label: 'Contract Signed', desc: 'NDA and IP terms authorized.' },
    { label: 'Architecture LLD', desc: 'Low-level schema signed off by Ammar.' },
    { label: 'Core Scraper Dev', desc: 'Headless browser indexing validated.' },
    { label: 'Staging Sandbox', desc: 'Access active on preview endpoints.' },
    { label: 'Compliance Audit', desc: 'Database middleware sanitizes clear.' },
    { label: 'Production Handover', desc: 'Unlock final repository zip files.' }
  ];

  // Check if Escrow is cleared for the first project (CardioCare) to unlock repo
  const isEscrowCleared = escrows.find(esc => esc.client === 'CardioCare Diagnostics')?.status === 'Released';

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileName = e.dataTransfer.files[0].name;
      setUploadedFiles(prev => [...prev, fileName]);
      addToast(`Asset uploaded securely: ${fileName}. Encrypting file...`, 'success');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setUploadedFiles(prev => [...prev, fileName]);
      addToast(`Asset uploaded: ${fileName}. Masked on Cloud Drive.`, 'success');
    }
  };

  // Submit Change Request Ticket
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) {
      addToast('Ticket description cannot be empty.', 'error');
      return;
    }

    const newTicket: ChangeRequestTicket = {
      id: `CR-${Math.floor(100 + Math.random() * 900)}`,
      clientName: 'CardioCare Diagnostics',
      type: ticketType,
      description: ticketDesc,
      priority: ticketPriority,
      status: 'Open',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setChangeRequests(prev => [newTicket, ...prev]);
    addToast('Change-Request ticket logged securely. Assigned to Dev pipeline.', 'success');
    setTicketDesc('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      
      {/* 1. Interactive Tab Switcher */}
      <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-md">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'roadmap' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <LayoutGrid size={16} />
          Roadmap, Milestones & Handover
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'support' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Eye size={16} />
          Uploader, Tickets & Feedback
        </button>
      </div>

      {/* MAIN SINGLE CARD FOCUS CONTAINER */}
      {activeTab === 'roadmap' ? (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Milestone size={24} className="text-emerald-400" />
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 font-mono font-bold">Client Workspace Transparency</span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">CardioCare Diagnostics Portal</h1>
              <p className="text-sm text-zinc-400 mt-1">Direct view into your live project stages, assigned developer, and final ZIP handovers.</p>
            </div>
            
            {/* Assigned Builder Pill */}
            <div className="bg-zinc-950 p-4 border border-zinc-800 flex items-center gap-3 rounded shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">Builder Assigned</span>
                <span className="text-sm font-bold text-zinc-200 block font-mono">UB_DEV_14 [MVP]</span>
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Supervised by Ammar // CTO</span>
              </div>
            </div>
          </div>

          {/* Interactive Delivery Timeline Roadmap */}
          <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono">Real-Time Delivery Roadmap Line</h3>
            <p className="text-xs text-zinc-500">Click any milestone below to simulate real-time client status inspections and navigate active roadmap delivery dates.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-2">
              {roadmapSteps.map((step, i) => {
                const stepNumber = i + 1;
                const isPassed = stepNumber < activeRoadmapStep;
                const isActive = stepNumber === activeRoadmapStep;
                
                return (
                  <div 
                    key={i} 
                    onClick={() => {
                      setActiveRoadmapStep(stepNumber);
                      addToast(`Inspecting milestone node ${stepNumber}: ${step.label}`, 'info');
                    }}
                    className={`p-4 border text-center transition-all cursor-pointer select-none rounded ${isActive ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg' : isPassed ? 'bg-zinc-900/50 border-emerald-500/20 text-zinc-300' : 'bg-zinc-950/20 border-zinc-850 text-zinc-600'}`}
                  >
                    <div className="font-mono text-xs font-bold">{stepNumber.toString().padStart(2, '0')}</div>
                    <div className="text-xs font-bold uppercase mt-2 truncate">{step.label}</div>
                    <span className="text-[10px] text-zinc-500 block mt-1 line-clamp-2 leading-relaxed">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Handover & Upgrades Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Repo Handover Trigger Box */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Lock size={16} className="text-emerald-500" />
                  Final Repository Handover Node
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Instantly compiles and downloads your project codebase. This unlocks automatically once payment clearing is released from escrow.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-bold">Escrow Deposit Status:</span>
                  <span className={`font-bold uppercase font-mono ${isEscrowCleared ? 'text-emerald-400' : 'text-yellow-500 animate-pulse'}`}>
                    {isEscrowCleared ? 'Released & Verified' : 'Awaiting Release'}
                  </span>
                </div>
                <p className="text-zinc-500 mt-2 text-[10px] leading-relaxed">Milestone payouts are cleared securely by Sam on the COO console. Once cleared, compilation codes unlock.</p>
              </div>

              {isEscrowCleared ? (
                <button
                  onClick={() => addToast('Downloading consolidated repository ZIP bundle...', 'success')}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase py-3 text-xs rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={14} />
                  Download Complete Repository ZIP
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-500 font-bold uppercase py-3 text-xs rounded cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock size={14} />
                  Handover Locked (Awaiting Escrow)
                </button>
              )}
            </div>

            {/* Service Plan Upgrade Slider */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders size={16} className="text-emerald-500" />
                  Service Plan Upgrade Slider Layout
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Select and request on-demand subscription upgrades. Higher tiers unlock more slots and faster turn-arounds.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Selected retainer level:</span>
                  <span className="text-emerald-400 font-bold">{selectedPlanTier === '₹4,999' ? '₹4,999 Enterprise' : selectedPlanTier === '₹2,499' ? '₹2,499 Standard' : '₹499 Impulse'}</span>
                </div>
                
                <input 
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={selectedPlanTier === '₹499' ? 1 : selectedPlanTier === '₹2,499' ? 2 : 3}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const tier = val === 1 ? '₹499' : val === 2 ? '₹2,499' : '₹4,999';
                    setSelectedPlanTier(tier);
                    addToast(`Retainer selection changed: ${tier}.`, 'info');
                  }}
                  className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>₹499 Impulse</span>
                  <span>₹2,4Standard</span>
                  <span>₹4,9Enterprise</span>
                </div>
              </div>

              <button
                onClick={() => addToast(`Subscription upgrade request logged for ${selectedPlanTier} retainer.`, 'success')}
                className="w-full bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-400 font-bold uppercase py-2.5 text-xs border border-emerald-500/20 rounded transition-all cursor-pointer"
              >
                Request Upgraded Retainer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Uploader and support tickets Header */}
          <div className="border-b border-zinc-800 pb-6">
            <span className="text-xs uppercase font-mono text-zinc-500 font-bold font-bold">Feedback & Deliveries</span>
            <h1 className="text-2xl font-bold text-zinc-100 font-bold">Uploader, Tickets & Billing Records</h1>
            <p className="text-sm text-zinc-400 mt-1">Upload files securely, raise ticket adjustments to senior developers, and track billing summaries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Drag and drop Uploader */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Secure Drag-and-Drop Uploader</h3>
              <p className="text-xs text-zinc-500">Provide brand files, copy briefs, or specifications. Encrypts and masks payloads onto cloud archives automatically.</p>
              
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed p-8 text-center transition-all ${dragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'} relative cursor-pointer`}
              >
                <input 
                  type="file"
                  id="client-file-upload"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="client-file-upload" className="cursor-pointer space-y-2 block">
                  <UploadCloud size={32} className="text-zinc-500 mx-auto" />
                  <span className="text-xs text-zinc-400 block font-bold">Drag files here or <span className="text-emerald-500 underline">Browse files</span></span>
                  <span className="text-[10px] text-zinc-600 uppercase block font-mono">SUPPORTED: PDF, PNG, JPG, ZIP (MAX 24MB)</span>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="p-3 bg-zinc-900 border border-zinc-850 rounded text-xs space-y-1.5 font-mono">
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">Encrypted Assets:</span>
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex justify-between items-center text-emerald-400">
                      <span>{file}</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded uppercase font-bold">Masked</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Change-Request Ticket Box */}
            <form onSubmit={handleSubmitTicket} className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Structured Change-Request Ticket Box</h3>
              <p className="text-xs text-zinc-500">Log adjustments directly to senior developer pipelines. Tickets are processed and updated transparently.</p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Adjustment Category</label>
                    <select
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 outline-none focus:border-emerald-500 text-zinc-300 font-mono"
                    >
                      <option value="UI Adjustment">UI Adjustment</option>
                      <option value="Logic Bug">Logic Bug</option>
                      <option value="API Modification">API Modification</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Priority Status</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 outline-none focus:border-emerald-500 text-zinc-300 font-mono"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Adjustment Details</label>
                  <input 
                    type="text"
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="e.g. Center the main header text and double margins..."
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase py-2.5 text-xs rounded transition-colors shadow-md cursor-pointer"
                >
                  Log Change Ticket
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Ticket list */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Historical Change Log</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {changeRequests.map((ticket, i) => (
                  <div key={i} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                    <div>
                      <div className="font-bold text-zinc-200">{ticket.id} // {ticket.type}</div>
                      <p className="text-zinc-500 text-[10px] mt-0.5 max-w-xs">{ticket.description}</p>
                    </div>
                    <span className="text-yellow-500 border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 rounded font-bold uppercase text-[10px] animate-pulse">
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Ledger & Ratings / Triggers */}
            <div className="space-y-6">
              <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Developer Trust Ratings</h3>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => {
                          setClientRating(star);
                          addToast(`Feedback registered: ${star} Stars. Thank you!`, 'success');
                        }}
                        className="p-0.5 focus:outline-none"
                      >
                        <Star size={16} fill={star <= clientRating ? 'currentColor' : 'transparent'} />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-500">Rate your assigned developer to log trust status onto the CEO and COO consoles.</p>
              </div>

              {/* Ping notification configurations */}
              <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
                <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-2">
                  <BellRing size={16} className="text-emerald-500" />
                  Real-time Delivery Logs Triggers
                </h3>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={smsPing}
                      onChange={() => setSmsPing(!smsPing)}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    SMS
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={emailPing}
                      onChange={() => setEmailPing(!emailPing)}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    Email
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={whatsappPing}
                      onChange={() => setWhatsappPing(!whatsappPing)}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    WhatsApp
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
