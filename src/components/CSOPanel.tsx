import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Key, Lock, Eye, AlertOctagon, 
  Terminal, Shield, Radio, CheckSquare, RefreshCw, ServerCrash
} from 'lucide-react';

interface CSOPanelProps {
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
}

export const CSOPanel: React.FC<CSOPanelProps> = ({ addToast }) => {
  const [ddosBlocked, setDdosBlocked] = useState(1480);
  const [securityScore, setSecurityScore] = useState(99.4);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([
    '[FIREWALL] Rule breach: Blocked unauthorized API key scan on edge endpoint /api/v1/auth',
    '[SECURITY-DAEMON] Validated RLS table policies on tasks table.',
    '[SYSTEM] Penetration test script v1.0.4 completed. 0 critical vulnerabilities found.'
  ]);

  // Simulate incoming attacks blocked
  useEffect(() => {
    const timer = setInterval(() => {
      setDdosBlocked(prev => prev + Math.floor(Math.random() * 3) + 1);
      if (Math.random() > 0.8) {
        const attackLogs = [
          `[WAF] Blocked cross-site script request from IP 42.128.4.15 on payload check.`,
          `[RLS-MONITOR] Alert: User roleDEV attempted to mutate row tasks.id=TSK-102. Action BLOCKED.`,
          `[FIREWALL] Blocked SQL inject payload: "SELECT * FROM users; --" on endpoint /api/v1/profiles`
        ];
        const log = attackLogs[Math.floor(Math.random() * attackLogs.length)];
        setActiveAlerts(prev => [log, ...prev.slice(0, 10)]);
        addToast('Security Intrusion Blocked & Logged.', 'warn');
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">WAF Intrusion Detections</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{ddosBlocked}</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Blocked malicious Edge requests</span>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Overall Security Score</span>
          <div className="text-xl font-bold font-mono text-white mt-1">{securityScore}%</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Compliant to SOC2 Standard</span>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Supabase RLS Status</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            SECURED
          </div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Policies audited hourly</span>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">SSL Certificate Health</span>
          <div className="text-xl font-bold font-mono text-white mt-1">320 Days Left</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Auto-renewal verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Intrusion Detection Stream Console */}
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Lock size={16} className="text-red-400" />
            Edge WAF Shield & Intrusion Stream
          </h3>
          <p className="text-xs text-zinc-500">Live feed tracking rate-limit triggers, firewall blocks, and access authorization checks.</p>
          
          <div className="bg-zinc-950 border border-zinc-850 p-4 font-mono text-[10px] text-red-400 space-y-1.5 h-64 overflow-y-auto rounded custom-scrollbar">
            {activeAlerts.map((log, i) => (
              <div key={i} className="leading-relaxed border-b border-zinc-900/40 pb-1.5 last:border-0 last:pb-0">{log}</div>
            ))}
          </div>
        </div>

        {/* Security Compliance Audit Checklist */}
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            CSO Compliance Checklist
          </h3>
          <p className="text-xs text-zinc-500">Master configuration rules required to achieve fully certified production standards.</p>
          
          <div className="space-y-3.5 text-xs font-mono">
            {[
              { rule: 'Supabase RLS enabled on all tables', status: 'COMPLIANT' },
              { rule: 'DDoS rate limiting configs on edge routes', status: 'COMPLIANT' },
              { rule: 'PII encryption hooks on database logs', status: 'COMPLIANT' },
              { rule: 'CFO payment release secure auth triggers', status: 'COMPLIANT' },
              { rule: 'Double-signature ledger release policies', status: 'COMPLIANT' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b border-zinc-900 pb-2 last:border-0 last:pb-0">
                <span className="text-zinc-400">{item.rule}</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 font-bold uppercase rounded">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
