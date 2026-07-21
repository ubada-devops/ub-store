import React, { useState, useEffect } from 'react';
import { GlobalShell } from './components/GlobalShell';
import { CEOPanel } from './components/CEOPanel';
import { CFOPanel } from './components/CFOPanel';
import { COOPanel } from './components/COOPanel';
import { CTOPanel } from './components/CTOPanel';
import { DeveloperPanel } from './components/DeveloperPanel';
import { ClientPanel } from './components/ClientPanel';
import { AnonymousChat } from './components/AnonymousChat';
import { 
  ProjectTask, LeadAssignment, EscrowTransaction, 
  ZohoContract, ChangeRequestTicket, SandboxStatus, ToastMessage, SessionRole 
} from './types';
import { 
  INITIAL_TASKS, INITIAL_LEADS, INITIAL_ESCROW, 
  ZOHO_CONTRACTS, INITIAL_SANDBOXES, DEFAULT_CHANGE_REQUESTS 
} from './data';

export default function App() {
  // Global Session Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Dashboard states
  const [activeRole, setActiveRole] = useState<SessionRole>('CEO');
  const [systemStatus, setSystemStatus] = useState<'SECURE_SESSION' | 'LOCKOUT'>('SECURE_SESSION');
  const [selectedEntity, setSelectedEntity] = useState<'UB Technologies' | 'UB CLUB'>('UB Technologies');
  const [founderFocus, setFounderFocus] = useState<'In Studio' | 'In Sprints' | 'Strategic' | 'Standby'>('In Studio');
  
  // Interactive finance & compute states shared across views
  const [adSpend, setAdSpend] = useState<number>(45000); // Meta spend set by COO, updates CEO's ROI
  const [developerSlots, setDeveloperSlots] = useState<number>(24); // compute slots set by COO, updates CEO's meter

  // Core Data models
  const [tasks, setTasks] = useState<ProjectTask[]>(INITIAL_TASKS);
  const [leads, setLeads] = useState<LeadAssignment[]>(INITIAL_LEADS);
  const [escrows, setEscrows] = useState<EscrowTransaction[]>(INITIAL_ESCROW);
  const [contracts, setContracts] = useState<ZohoContract[]>(ZOHO_CONTRACTS);
  const [sandboxes, setSandboxes] = useState<SandboxStatus[]>(INITIAL_SANDBOXES);
  const [changeRequests, setChangeRequests] = useState<ChangeRequestTicket[]>(DEFAULT_CHANGE_REQUESTS);

  // Toast Alerts (Req #20)
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Zero-latency skeleton loaders simulation state (Req #19)
  const [isLoading, setIsLoading] = useState(false);

  const addToast = (message: string, type: 'success' | 'error' | 'warn' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    const timestamp = new Date().toLocaleTimeString();
    setToasts(prev => [...prev, { id, message, type, timestamp }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auto-remove toasts after 4 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Simulate skeleton loaders upon role changes (Req #19)
  useEffect(() => {
    setIsLoading(true);
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 450); // High velocity zero-latency transition feel
    return () => clearTimeout(delay);
  }, [activeRole]);

  // Session Logins & Logouts
  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
    addToast('Welcome back. Secure biometric handshake complete.', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    addToast('Secure session terminated cleanly.', 'info');
  };

  // Render Skeleton Loader UI blocks (Req #19)
  const renderSkeleton = () => {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-zinc-900 border border-zinc-800 rounded-sm p-4 flex flex-col justify-between">
              <div className="h-2 w-1/3 bg-zinc-800 rounded" />
              <div className="h-4 w-2/3 bg-zinc-800 rounded" />
              <div className="h-2 w-1/2 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-zinc-900 border border-zinc-800 rounded-sm p-4 space-y-4">
            <div className="h-4 w-1/4 bg-zinc-800 rounded" />
            <div className="h-[1px] bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-10 bg-zinc-950 rounded-sm" />
              <div className="h-10 bg-zinc-950 rounded-sm" />
              <div className="h-10 bg-zinc-950 rounded-sm" />
            </div>
          </div>
          <div className="h-72 bg-zinc-900 border border-zinc-800 rounded-sm p-4 space-y-4">
            <div className="h-4 w-1/3 bg-zinc-800 rounded" />
            <div className="h-[1px] bg-zinc-800" />
            <div className="h-40 bg-zinc-950 rounded-sm" />
          </div>
        </div>
      </div>
    );
  };

  const renderActivePanel = () => {
    if (isLoading) {
      return renderSkeleton();
    }

    switch(activeRole) {
      case 'CEO':
        return (
          <CEOPanel
            tasks={tasks}
            adSpend={adSpend}
            developerSlots={developerSlots}
            founderFocus={founderFocus}
            setFounderFocus={setFounderFocus}
            systemStatus={systemStatus}
            setSystemStatus={setSystemStatus}
            addToast={addToast}
          />
        );
      case 'CFO':
        return (
          <CFOPanel
            tasks={tasks}
            escrows={escrows}
            setEscrows={setEscrows}
            addToast={addToast}
          />
        );
      case 'COO':
        return (
          <COOPanel
            tasks={tasks}
            setTasks={setTasks}
            leads={leads}
            setLeads={setLeads}
            contracts={contracts}
            setContracts={setContracts}
            adSpend={adSpend}
            setAdSpend={setAdSpend}
            developerSlots={developerSlots}
            setDeveloperSlots={setDeveloperSlots}
            systemStatus={systemStatus}
            addToast={addToast}
          />
        );
      case 'CTO':
        return (
          <CTOPanel
            tasks={tasks}
            setTasks={setTasks}
            contracts={contracts}
            sandboxes={sandboxes}
            setSandboxes={setSandboxes}
            addToast={addToast}
          />
        );
      case 'DEV':
        return (
          <DeveloperPanel
            tasks={tasks}
            setTasks={setTasks}
            leads={leads}
            setLeads={setLeads}
            addToast={addToast}
          />
        );
      case 'CLIENT':
        return (
          <ClientPanel
            tasks={tasks}
            escrows={escrows}
            sandboxes={sandboxes}
            changeRequests={changeRequests}
            setChangeRequests={setChangeRequests}
            addToast={addToast}
          />
        );
      case 'CHAT':
        return (
          <AnonymousChat
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            addToast={addToast}
            escrows={escrows}
          />
        );
      default:
        return null;
    }
  };

  return (
    <GlobalShell
      isAuthenticated={isAuthenticated}
      onLogin={handleLogin}
      onLogout={handleLogout}
      activeRole={activeRole}
      setActiveRole={setActiveRole}
      selectedEntity={selectedEntity}
      setSelectedEntity={setSelectedEntity}
      toasts={toasts}
      removeToast={removeToast}
      addToast={addToast}
    >
      {renderActivePanel()}
    </GlobalShell>
  );
}
