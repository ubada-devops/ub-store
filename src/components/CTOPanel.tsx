import React, { useState, useEffect } from 'react';
import { 
  GitBranch, GitPullRequest, Eye, CheckCircle2, XCircle, Play, 
  Cpu, Key, Database, RefreshCw, FolderGit2, FolderOpen,
  ClipboardCheck, BarChart2, Radio, Server, AlertTriangle, FileCode, LayoutGrid, RadioTower
} from 'lucide-react';
import { 
  ProjectTask, SandboxStatus, ScraperLog, ZohoContract 
} from '../types';
import { 
  CLINIC_SCRAPER_ROWS, VAPI_DIAGNOSTICS, SHARED_TEMPLATES 
} from '../data';

interface CTOPanelProps {
  tasks: ProjectTask[];
  setTasks: React.Dispatch<React.SetStateAction<ProjectTask[]>>;
  contracts: ZohoContract[];
  sandboxes: SandboxStatus[];
  setSandboxes: React.Dispatch<React.SetStateAction<SandboxStatus[]>>;
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
}

export const CTOPanel: React.FC<CTOPanelProps> = ({
  tasks,
  setTasks,
  contracts,
  sandboxes,
  setSandboxes,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'engineering' | 'infrastructure'>('engineering');

  // Pull Requests mock state
  const [pendingPRs, setPendingPRs] = useState([
    { id: 'PR-901', title: 'feat: add headless clinical appointment pipeline', dev: 'UB_DEV_14', file: 'scraper.ts', changes: '+142 -20 lines', targetTask: 'TSK-201' },
    { id: 'PR-902', title: 'fix: restrict wire callback verification protocols', dev: 'UB_DEV_04', file: 'skydo-webhook.ts', changes: '+40 -5 lines', targetTask: 'TSK-202' }
  ]);

  // LLD Checklist State
  const [lldChecklist, setLldChecklist] = useState([
    { id: 'lld-1', text: 'Configure rate-limiting hooks on server.ts endpoint checks', checked: true },
    { id: 'lld-2', text: 'Establish deep validation schema sanitizer on customer payloads', checked: true },
    { id: 'lld-3', text: 'Add PII text bot filtering rules inside client messages', checked: false },
    { id: 'lld-4', text: 'Set up auto-escalation backup nodes for weekend support runs', checked: false }
  ]);

  // Private API Token Generator state
  const [selectedDevKey, setSelectedDevKey] = useState('UB_DEV_14');
  const [generatedKey, setGeneratedKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // System Build Failure Toggle State
  const [buildFailureActive, setBuildFailureActive] = useState(false);

  // Self-Healing Script Logs state
  const [selfHealLogs, setSelfHealLogs] = useState<string[]>([
    '[SELF-HEAL-DAEMON] Starting background network diagnostics...',
    '[SELF-HEAL-DAEMON] Checking proxy health bounds on port 3000...',
    '[SELF-HEAL-DAEMON] Staging Alpha Sandbox server reporting 99% health.',
    '[SELF-HEAL-DAEMON] Scanning clinical scraper logs for potential bottlenecks...'
  ]);

  // Simulate scrolling live self-healing console daemon output
  useEffect(() => {
    const intervals = [
      'Scanning middleware sanitized collections: clear.',
      'Analyzing Retell AI audio endpoint logs: stable.',
      'Re-routing edge compute node to secondary region: successful.',
      'Validating central Stripe webhook listener: verified.'
    ];
    let count = 0;
    const timer = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      setSelfHealLogs(prev => [
        ...prev.slice(-8), 
        `[${now}] ${intervals[count % intervals.length]}`
      ]);
      count++;
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleMergePR = (prId: string, taskId: string) => {
    setPendingPRs(prev => prev.filter(pr => pr.id !== prId));
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        addToast(`PR ${prId} successfully merged. Deploying changes to Staging.`, 'success');
        return { ...t, prsCount: Math.max(0, t.prsCount - 1), stage: 'QA' };
      }
      return t;
    }));
  };

  const handleGenerateToken = () => {
    const keyStr = `ub_sec_token_${Math.random().toString(36).substring(2, 10)}_${selectedDevKey.toLowerCase()}`;
    setGeneratedKey(keyStr);
    setCopiedKey(false);
    addToast(`Private API credentials generated for ${selectedDevKey}.`, 'success');
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    addToast('Credentials copied to clipboard securely.', 'success');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const toggleLLD = (id: string) => {
    setLldChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const state = !item.checked;
        addToast(`LLD Item updated: ${item.text.substring(0, 20)}...`, 'info');
        return { ...item, checked: state };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      
      {/* 1. Toggleable Build Failure Screen Banner */}
      {buildFailureActive && (
        <div className="bg-red-950/60 border-2 border-red-500 text-red-200 p-6 rounded-md flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce shadow-lg">
          <div className="flex items-center gap-4">
            <XCircle className="text-red-500 shrink-0 animate-spin" size={32} />
            <div>
              <div className="font-bold text-base">BUILD PIPELINE FAILING [STAGING]</div>
              <div className="text-xs text-zinc-300">Webpack module compiling failed on dependency resolution. Rollback initialized automatically.</div>
            </div>
          </div>
          <button 
            onClick={() => { setBuildFailureActive(false); addToast('Staging build pipeline restored to STABLE.', 'success'); }}
            className="bg-red-500 hover:bg-red-600 text-black font-bold uppercase text-xs px-5 py-3 rounded shadow-md transition-colors w-full md:w-auto"
          >
            Acknowledge & Restore Build
          </button>
        </div>
      )}

      {/* 2. Simplified Section Tab Switcher */}
      <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-md">
        <button
          onClick={() => setActiveTab('engineering')}
          className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'engineering' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <LayoutGrid size={16} />
          Code Reviews & Standards Checklist
        </button>
        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`flex-1 py-3 text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'infrastructure' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <RadioTower size={16} />
          Infrastructure Streams & Security API Keys
        </button>
      </div>

      {/* MAIN SINGLE CARD FOCUS LAYOUT */}
      {activeTab === 'engineering' ? (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-zinc-800 pb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <GitPullRequest size={24} className="text-emerald-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 font-mono">CTO Terminal Gateway</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">CTO Workspace Overview</h1>
            <p className="text-sm text-zinc-400 mt-1">Simple hub to merge incoming pull requests from developers, enforce master code sanitation sign-offs, and debug pipeline failures on demand.</p>
          </div>

          {/* Simple CI/CD Diagnostics controller */}
          <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs text-zinc-500 uppercase font-bold block">Continuous Integration Pipeline Diagnostic</span>
              <span className="text-sm text-zinc-300 block font-mono mt-0.5">Toggle build status to simulate and dry-run extreme server compile failures.</span>
            </div>
            <button
              onClick={() => {
                setBuildFailureActive(!buildFailureActive);
                addToast(buildFailureActive ? 'Continuous Integration restored.' : 'Build Failure state triggered successfully.', buildFailureActive ? 'success' : 'warn');
              }}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider rounded border transition-all w-full md:w-auto text-center ${buildFailureActive ? 'bg-red-500 text-black border-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
            >
              {buildFailureActive ? 'Restore Staging Pipeline' : 'Inject Staging Compile Failure'}
            </button>
          </div>

          {/* Pull Request Reviews List */}
          <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Incoming Pull Request Reviews</h3>
            <p className="text-xs text-zinc-500">Developers push branches for integration here. Review changes and merge directly into staging master nodes.</p>
            
            {pendingPRs.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs uppercase font-mono">No pending pull requests to review</div>
            ) : (
              <div className="space-y-3">
                {pendingPRs.map((pr) => (
                  <div key={pr.id} className="p-4 bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 font-bold font-mono uppercase">{pr.id}</span>
                        <span className="text-xs text-zinc-400 font-mono">By {pr.dev} ({pr.changes})</span>
                      </div>
                      <div className="text-sm font-bold text-white mt-1.5">{pr.title}</div>
                      <div className="text-xs text-zinc-500 mt-1">Impacted File: <span className="font-mono text-zinc-400">{pr.file}</span></div>
                    </div>
                    <button
                      onClick={() => handleMergePR(pr.id, pr.targetTask)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-xs rounded transition-colors w-full sm:w-auto"
                    >
                      Merge & Deploy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low-Level Design Sign-off Checklist */}
          <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Ammar's LLD Master Code Sanitization Checks</h3>
            <p className="text-xs text-zinc-500">Security gates mandated before merging files into active production. Complete each validation item below.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lldChecklist.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleLLD(item.id)}
                  className={`p-4 border rounded flex items-start gap-3 cursor-pointer transition-colors ${item.checked ? 'bg-emerald-500/5 border-emerald-500/20 text-zinc-200' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  <div className={`w-5 h-5 border flex items-center justify-center rounded-sm shrink-0 mt-0.5 ${item.checked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-700'}`}>
                    {item.checked && <CheckCircle2 size={12} className="text-black" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{item.text}</span>
                    <span className="text-[10px] text-zinc-500 uppercase mt-1 block font-mono">
                      {item.checked ? 'Sanitized & Verified' : 'Awaiting Review'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Advanced Infrastructure Header */}
          <div className="border-b border-zinc-800 pb-6">
            <span className="text-xs uppercase font-mono text-zinc-500 font-bold">API sandboxes & scrapers</span>
            <h1 className="text-2xl font-bold text-zinc-100">Staging Infrastructure & Telemetry</h1>
            <p className="text-sm text-zinc-400 mt-1">Audit self-healing daemons, configure sandbox staging nodes, and allocate API developer keys securely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Private API Token Allocator System */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-2">
                  <Key size={16} className="text-emerald-500" />
                  Private API Token Allocator System
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Distribute sandboxed keys and server authorization credentials directly to contracted freelancers.</p>
                
                <div className="space-y-4 mt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Target Freelancer Alias</label>
                    <select
                      value={selectedDevKey}
                      onChange={(e) => setSelectedDevKey(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-300 font-mono"
                    >
                      <option value="UB_DEV_14">UB_DEV_14 (MVP)</option>
                      <option value="UB_DEV_04">UB_DEV_04 (Senior QA)</option>
                      <option value="UB_DEV_09">UB_DEV_09 (Data Scrapers)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateToken}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase py-2.5 text-xs rounded transition-colors cursor-pointer"
                  >
                    Generate Security Key
                  </button>

                  {generatedKey && (
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-xs space-y-2">
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">Active Developer Key:</span>
                      <div className="font-mono text-emerald-400 break-all select-all">{generatedKey}</div>
                      <button
                        onClick={handleCopyToken}
                        className="text-xs text-emerald-500 hover:underline uppercase font-bold font-mono"
                      >
                        {copiedKey ? 'COPIED!' : 'Copy to Clipboard'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Self-Healing Daemon log console */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4 overflow-hidden">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-2">
                <Cpu size={16} className="text-emerald-500" />
                Self-Healing Agent Console Stream
              </h3>
              <p className="text-xs text-zinc-500">Live logs tracking background repair daemons auditing staging sandboxes and proxies.</p>
              
              <div className="bg-zinc-950 border border-zinc-900 p-4 font-mono text-xs text-emerald-500 space-y-1.5 h-60 overflow-y-auto rounded scrollbar-none">
                {selfHealLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed border-b border-zinc-900/40 pb-1 last:border-0 last:pb-0">{log}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Scraper Logs & Retell AI */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Layer-1 Clinical Scrapers Log</h3>
              <div className="space-y-2">
                {CLINIC_SCRAPER_ROWS.map((row, i) => (
                  <div key={i} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                    <div>
                      <div className="font-bold text-zinc-300">{row.patientId}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Parameters: {row.parameters}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">{row.status}</span>
                      <div className="text-[10px] text-zinc-500">{row.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staging Sandbox Proxy Status list */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Staging Sandbox Proxy Status</h3>
              <div className="space-y-3">
                {sandboxes.map((box, i) => (
                  <div key={i} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                    <div>
                      <div className="font-bold text-zinc-300">{box.id}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{box.url}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${box.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse'}`}>
                        {box.status}
                      </span>
                      <div className="text-[9px] text-zinc-500 mt-1 uppercase">Score: {box.healthScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
