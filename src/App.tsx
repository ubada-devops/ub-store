import React, { useState, useEffect } from 'react';
import { GlobalShell } from './components/GlobalShell';
import { CEOPanel } from './components/CEOPanel';
import { CFOPanel } from './components/CFOPanel';
import { COOPanel } from './components/COOPanel';
import { CTOPanel } from './components/CTOPanel';
import { DeveloperPanel } from './components/DeveloperPanel';
import { ClientPanel } from './components/ClientPanel';
import { AnonymousChat } from './components/AnonymousChat';
import { CAIOPanel } from './components/CAIOPanel';
import { supabase } from './supabaseClient';
import { CMOPanel } from './components/CMOPanel';
import { CSOPanel } from './components/CSOPanel';
import { 
  ProjectTask, LeadAssignment, EscrowTransaction, 
  ZohoContract, ChangeRequestTicket, SandboxStatus, ToastMessage, SessionRole 
} from './types';




export default function App() {
  // Global Session Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Dashboard states
  const [activeRole, setActiveRole] = useState<SessionRole>('CEO');
  const [systemStatus, setSystemStatus] = useState<'SECURE_SESSION' | 'LOCKOUT'>('SECURE_SESSION');
  const [selectedEntity, setSelectedEntity] = useState<'UB Technologies' | 'UB CLUB'>('UB Technologies');
  const [founderFocus, setFounderFocus] = useState<'In Studio' | 'In Sprints' | 'Strategic' | 'Standby'>('In Studio');
  
  // Interactive finance & compute states shared across views
  const [adSpend, setAdSpend] = useState<number>(45000); // Meta spend set by COO, updates CEO's ROI
  const [developerSlots, setDeveloperSlots] = useState<number>(24); // compute slots set by COO, updates CEO's meter

  // Core Data models
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [leads, setLeads] = useState<LeadAssignment[]>([]);
  const [escrows, setEscrows] = useState<EscrowTransaction[]>([]);
  const [contracts, setContracts] = useState<ZohoContract[]>([]);
  const [sandboxes, setSandboxes] = useState<SandboxStatus[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequestTicket[]>([]);

  // Restore session from Supabase on reload
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile) {
            setIsAuthenticated(true);
            setActiveRole(profile.role as SessionRole);
            setCurrentUser(profile);
            addToast(`Session restored. Welcome back, ${profile.full_name}.`, 'success');
          }
        }
      } catch (e) {
        console.error('Session restore error:', e);
      }
    };
    checkSession();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile) {
            setIsAuthenticated(true);
            setActiveRole(profile.role as SessionRole);
            setCurrentUser(profile);
          }
        } catch (e) {
          console.error('Auth state change profile fetch error:', e);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Live database fetcher when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDatabaseData = async () => {
      try {
        // 1. Fetch Tasks
        const { data: dbTasks } = await supabase
          .from('tasks')
          .select('*');
        if (dbTasks) {
          setTasks(dbTasks.map(t => ({
            id: t.id,
            name: t.name,
            client: t.client,
            tier: t.tier,
            stage: t.stage,
            description: t.description,
            assignedDev: t.assigned_dev_name,
            prsCount: t.prs_count,
            health: t.health
          })));
        }

        // 2. Fetch Escrows
        const { data: dbEscrows } = await supabase
          .from('escrows')
          .select('*');
        if (dbEscrows) {
          setEscrows(dbEscrows.map(e => ({
            id: e.id,
            client: e.client_name,
            project: e.project_name,
            amount: Number(e.amount),
            status: e.status
          })));
        }
      } catch (err) {
        console.error('Database fetch error:', err);
      }
    };

    fetchDatabaseData();
  }, [isAuthenticated]);

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
  const handleLogin = (token: string, role: SessionRole, profile: any) => {
    setIsAuthenticated(true);
    setActiveRole(role);
    setCurrentUser(profile);
    addToast(`Access authorized. Welcome back, ${profile.full_name || 'user'}.`, 'success');
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
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
            currentUser={currentUser}
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
      case 'CAIO':
        return <CAIOPanel addToast={addToast} />;
      case 'CMO':
        return <CMOPanel addToast={addToast} />;
      case 'CSO':
        return <CSOPanel addToast={addToast} />;
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
      currentUser={currentUser}
    >
      {renderActivePanel()}
    </GlobalShell>
  );
}
