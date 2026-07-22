import React, { useState, useEffect } from 'react';
import { 
  Terminal, Search, Bell, Clock, LogOut, Menu, X, 
  Wifi, HelpCircle, Key, Activity, ShieldCheck, 
  Settings, UserCheck, AlertOctagon, HelpCircle as HelpIcon,
  ChevronRight, ArrowRight, CornerDownRight, CheckCircle2,
  FileText, Landmark, MessageSquare, Brain, TrendingUp, ShieldAlert
} from 'lucide-react';
import { SessionRole, ToastMessage } from '../types';
import { supabase } from '../supabaseClient';


interface GlobalShellProps {
  isAuthenticated: boolean;
  onLogin: (token: string, role: SessionRole, profile: any) => void;
  onLogout: () => void;
  activeRole: SessionRole;
  setActiveRole: (role: SessionRole) => void;
  selectedEntity: 'UB Technologies' | 'UB CLUB';
  setSelectedEntity: (entity: 'UB Technologies' | 'UB CLUB') => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
  currentUser: any;
  children: React.ReactNode;
}

export const GlobalShell: React.FC<GlobalShellProps> = ({
  isAuthenticated,
  onLogin,
  onLogout,
  activeRole,
  setActiveRole,
  selectedEntity,
  setSelectedEntity,
  toasts,
  removeToast,
  addToast,
  currentUser,
  children
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<SessionRole>('DEV');
  const [isSignUp, setIsSignUp] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const getAlias = (role: SessionRole): string => {
    switch(role) {
      case 'CEO': return 'UB // CEO';
      case 'CFO': return 'SAM // CFO';
      case 'COO': return 'SAM // COO';
      case 'CTO': return 'AMMAR // CTO';
      case 'CAIO': return 'UB // CAIO';
      case 'CMO': return 'UB // CMO';
      case 'CSO': return 'UB // CSO';
      case 'DEV': return 'UB_DEV_14';
      case 'CLIENT': return 'CardioCare // Client';
      case 'CHAT': return 'Anonymous Chat Hub';
    }
  };

  const isCSuite = currentUser && ['CEO', 'CFO', 'COO', 'CTO', 'CAIO', 'CMO', 'CSO'].includes(currentUser.role);

  // System Time & Timezone update (Req #10)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Local Time with Timezone short abbreviation
      setLocalTime(now.toLocaleString('en-US', { hour12: false }) + ' ' + Intl.DateTimeFormat().resolvedOptions().timeZone);
      // UTC Time
      setUtcTime(now.toUTCString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ctrl+K to open Search (Req #8)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please enter both email and password.', 'error');
      return;
    }
    
    setIsLoggingIn(true);
    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          addToast('Full name is required for registration.', 'error');
          setIsLoggingIn(false);
          return;
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        if (data.user) {
          const alias = selectedRole === 'DEV' 
            ? `UB_DEV_${Math.floor(10 + Math.random() * 90)}` 
            : selectedRole === 'CLIENT' 
              ? `${fullName} // Client` 
              : `UB // ${selectedRole}`;

          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: data.user.id,
              email,
              full_name: fullName,
              role: selectedRole,
              alias_mask: alias
            }
          ]);
          if (profileError) throw profileError;
          
          if (data.session) {
            addToast('Registration successful! Logging in...', 'success');
            onLogin(data.session.access_token, selectedRole, {
              id: data.user.id,
              email,
              full_name: fullName,
              role: selectedRole,
              alias_mask: alias
            });
          } else {
            addToast('Registration successful! Please check your email or log in.', 'success');
            setIsSignUp(false);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError || !profile) {
            throw new Error('Profile not found in database. Contact administrator.');
          } else {
            onLogin(data.session?.access_token || 'session-token', profile.role as SessionRole, profile);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Authentication failed.', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };



  // Login view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-between text-zinc-100 font-mono relative overflow-hidden antialiased">
        {/* Abstract cyber grid backdrops */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
        
        {/* Background glow node */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-4000" />

        <header className="p-6 flex justify-between items-center z-10 border-b border-zinc-900/40 bg-zinc-950/20 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Terminal size={18} className="text-black" />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-zinc-400 font-display">UB TECHNOLOGIES // TERMINAL</span>
          </div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-2">
            <Wifi size={12} className="text-emerald-500 animate-pulse" />
            <span>Vercel Edge Gateway: 14ms</span>
          </div>
        </header>

        {/* Magic Link Input Card Container (Req #5) */}
        <main className="flex-1 flex items-center justify-center p-4 z-10">
          <div className="w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 shadow-2xl shadow-emerald-500/[0.02] backdrop-blur-md p-8 rounded-sm relative transition-all duration-300 hover:border-emerald-500/30">
            <div className="absolute top-0 right-0 p-2 text-[9px] text-emerald-400 font-mono bg-emerald-500/10 border-l border-b border-zinc-800/80 uppercase tracking-widest font-bold">
              L1 Secure Lock
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter text-white font-display">UB CLUB PORTAL</h2>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                  Decentralized builder entry gate. Authorized credentials unlock instant access to multi-role IDE operations dashboards for UB, SAM, AMMAR, and Corporate Clients.
                </p>
              </div>

              <div className="flex border-b border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-widest ${!isSignUp ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-zinc-500'}`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-widest ${isSignUp ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-zinc-500'}`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ubadah Dev"
                      className="w-full bg-zinc-950/80 border border-zinc-800/80 focus:border-emerald-500/60 text-emerald-400 font-mono text-xs px-4 py-2.5 outline-none placeholder:text-zinc-700"
                      disabled={isLoggingIn}
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. dev@ub.technology"
                    className="w-full bg-zinc-950/80 border border-zinc-800/80 focus:border-emerald-500/60 text-emerald-400 font-mono text-xs px-4 py-2.5 outline-none placeholder:text-zinc-700"
                    disabled={isLoggingIn}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Secure Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/80 border border-zinc-800/80 focus:border-emerald-500/60 text-emerald-400 font-mono text-xs px-4 py-2.5 outline-none placeholder:text-zinc-700"
                    disabled={isLoggingIn}
                  />
                </div>

                {isSignUp && (
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Target Workspace Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as SessionRole)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono text-xs px-4 py-2.5 outline-none focus:border-emerald-500/60"
                      disabled={isLoggingIn}
                    >
                      <option value="DEV">DEV (Freelancer Builder)</option>
                      <option value="CLIENT">CLIENT (Corporate Client)</option>
                      <option value="CEO">CEO (UB / Executive Founder)</option>
                      <option value="CFO">CFO (SAM / Finance lead)</option>
                      <option value="COO">COO (SAM / Operations lead)</option>
                      <option value="CTO">CTO (AMMAR / Tech lead)</option>
                      <option value="CAIO">CAIO (Chief AI Officer)</option>
                      <option value="CMO">CMO (Chief Marketing Officer)</option>
                      <option value="CSO">CSO (Chief Security Officer)</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider py-3 text-xs flex items-center justify-center gap-2 transition-all active:translate-y-[1px] disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Processing Credentials...
                    </>
                  ) : (
                    <>
                      {isSignUp ? 'Register Account' : 'Authenticate Session'}
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              <div className="border-t border-zinc-800/40 pt-4 flex justify-between items-center text-[10px] text-zinc-600">
                <span>ACTIVE DEV NODES: 30 / 30</span>
                <span>BUILD: v4.2.0-STABLE</span>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-6 border-t border-zinc-900/40 text-center text-[9px] text-zinc-600 bg-zinc-950/10">
          COPYRIGHT &copy; 2026 UB TECHNOLOGIES. ALL RIGHTS RESERVED. SECURE DEPLOYMENT NODE.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono antialiased flex flex-col relative">
      
      {/* 1. Entity Switcher Accent Banner (Req #33) */}
      <div className="bg-zinc-950/60 border-b border-zinc-900/40 px-4 py-1.5 flex justify-between items-center text-[9px] backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="text-zinc-600 font-bold uppercase tracking-wider">Entity Config:</span>
          <div className="flex gap-1.5 bg-zinc-950/40 p-0.5 border border-zinc-900/60 rounded">
            <button 
              onClick={() => setSelectedEntity('UB Technologies')}
              className={`px-2 py-0.5 rounded-sm transition-colors font-bold uppercase ${selectedEntity === 'UB Technologies' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              UB Technologies
            </button>
            <button 
              onClick={() => setSelectedEntity('UB CLUB')}
              className={`px-2 py-0.5 rounded-sm transition-colors font-bold uppercase ${selectedEntity === 'UB CLUB' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              UB CLUB
            </button>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-zinc-500">
          <span>UTC TIME: {utcTime}</span>
        </div>
      </div>

      {/* 2. Sticky Terminal Top-Nav Shell (Req #2) */}
      <nav className="h-14 border-b border-zinc-900/40 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-[60] flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* Mobile Hamburger Drawer Trigger (Req #7) */}
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden text-zinc-400 hover:text-zinc-100 p-1"
          >
            <Menu size={18} />
          </button>

          {/* Founder Signature Badge (Req #3) */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-500 flex items-center justify-center rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Terminal size={14} className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold font-display tracking-tight text-white leading-none">UB Technologies</span>
              <span className="text-[9px] text-emerald-500 font-bold tracking-widest uppercase leading-none mt-1">UB CLUB // CORE</span>
            </div>
          </div>

          {/* Active System Health Node (Req #4) & Network Speed Indicator (Req #13) */}
          <div className="hidden md:flex items-center gap-4 border-l border-zinc-900/60 pl-6 text-[10px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="uppercase text-[9px] font-bold">EDGE_NODE: SYNCHRONIZED</span>
            </div>
            <span>Vercel Edge Speed: <span className="text-emerald-500 font-bold">14ms</span></span>
          </div>
        </div>

        {/* Command Utilities & Roles Switcher Panel (Req #9) */}
        <div className="flex items-center gap-4">
          
          {/* Inline Quick Search Shell Trigger (Req #8) */}
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="hidden lg:flex items-center gap-2.5 bg-zinc-900/40 hover:bg-zinc-800/40 border border-zinc-800/60 px-3 py-1.5 cursor-pointer transition-colors"
          >
            <Search size={13} className="text-zinc-500" />
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Search Console...</span>
            <kbd className="text-[8px] bg-zinc-950 px-1 py-0.5 rounded border border-zinc-800/60 text-zinc-500">Ctrl+K</kbd>
          </div>

          {/* Role Switcher Selector Mock Panel (Req #9) */}
          {isCSuite && (
            <div className="hidden sm:flex items-center gap-1 bg-zinc-950/60 border border-zinc-900/60 p-0.5">
              {(['CEO', 'CFO', 'COO', 'CTO', 'CAIO', 'CMO', 'CSO', 'DEV', 'CLIENT', 'CHAT'] as SessionRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    setActiveRole(role);
                    addToast(`Access matrix switched to ${role} workspace.`, 'info');
                  }}
                  className={`px-2.5 py-1 text-[8px] font-bold transition-all ${activeRole === role ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.25)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}

          {/* Quick-select switcher specifically for mobile */}
          {isCSuite && (
            <div className="sm:hidden">
              <select
                value={activeRole}
                onChange={(e) => {
                  setActiveRole(e.target.value as SessionRole);
                  addToast(`Switched to ${e.target.value} console.`, 'info');
                }}
                className="bg-zinc-950 border border-zinc-800 text-[9px] text-emerald-500 font-bold px-2 py-1 outline-none focus:border-emerald-500/50"
              >
                <option value="CEO">CEO (UB)</option>
                <option value="CFO">CFO (SAM)</option>
                <option value="COO">COO (SAM)</option>
                <option value="CTO">CTO (AMMAR)</option>
                <option value="CAIO">CAIO (AI Systems)</option>
                <option value="CMO">CMO (Marketing Growth)</option>
                <option value="CSO">CSO (SecOps Portal)</option>
                <option value="DEV">DEV (Anon)</option>
                <option value="CLIENT">Client</option>
                <option value="CHAT">Chat Hub</option>
              </select>
            </div>
          )}

          <div className="h-6 w-[1px] bg-zinc-900/60" />

          {/* Interactive User Status Quick-Badge (Req #11) */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900/30 backdrop-blur-sm border border-zinc-850 text-[10px] rounded-sm">
            <UserCheck size={11} className="text-emerald-500" />
            <span className="text-zinc-300 text-[9px] font-bold">{getAlias(activeRole)}</span>
          </div>

          {/* Notification Bell Dropdown Button (Req #12) */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-1.5 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all duration-200 relative"
            >
              <Bell size={14} />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>

            {/* Notification Dropdown Pane */}
            {isNotificationOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-80 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-2 border-b border-zinc-800/60 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Edge Alert logs</span>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 border border-emerald-500/20 font-bold uppercase tracking-wider">LATEST_4</span>
                  </div>
                  <div className="space-y-1 mt-1.5 max-h-64 overflow-y-auto">
                    {[
                      { priority: 'high', type: 'FINANCE', label: 'Skydo Wire Cleared', desc: 'USD $120.00 converted for CardioCare', time: '1m' },
                      { priority: 'medium', type: 'CTO_PIPELINE', label: 'PR Approved', desc: 'PR #104 merged into main-prod by AMMAR_CTO', time: '12m' },
                      { priority: 'warn', type: 'COMPLIANCE', label: 'Sanitizer Action', desc: 'PII removed from appointment logger node', time: '1h' },
                      { priority: 'low', type: 'ADMIN', label: 'Roster Standby Active', desc: 'All 4 backup engineers confirmed alertable', time: '3h' }
                    ].map((n, i) => (
                      <div key={i} className="p-2 border-b border-zinc-850/40 hover:bg-zinc-950/60 transition-colors">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-[8px] px-1 font-bold ${n.priority === 'high' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : n.priority === 'warn' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                            {n.type}
                          </span>
                          <span className="text-[7px] text-zinc-650 font-mono">{n.time} ago</span>
                        </div>
                        <div className="text-[10px] font-bold text-zinc-200">{n.label}</div>
                        <div className="text-[9px] text-zinc-500 line-clamp-1">{n.desc}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-1 border-t border-zinc-800/65 mt-2 text-center">
                    <button className="text-[8px] text-emerald-500 hover:underline uppercase font-bold tracking-wider" onClick={() => setIsNotificationOpen(false)}>
                      Dismiss System Logs
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* System Logout Button (Req #14) */}
          <button
            onClick={onLogout}
            className="p-1.5 bg-zinc-900/40 border border-zinc-800/80 text-zinc-500 hover:text-red-400 hover:border-red-900/40 transition-all duration-200"
            title="Terminate secure session"
          >
            <LogOut size={14} />
          </button>
        </div>
      </nav>

      {/* Main Core Flex Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Mobile Hamburger IDE Drawer (Req #7) */}
        {isMobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-xs" onClick={() => setIsMobileOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 bg-zinc-950 border-r border-zinc-800 z-[80] p-6 flex flex-col justify-between animate-in slide-in-from-left duration-300">
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-emerald-500" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">UB CLUB Drawer</span>
                  </div>
                  <button onClick={() => setIsMobileOpen(false)} className="text-zinc-500 hover:text-zinc-100">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest px-2 mb-2">Workspace Roles</div>
                  {(['CEO', 'CFO', 'COO', 'CTO', 'DEV', 'CLIENT', 'CHAT'] as SessionRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setActiveRole(role);
                        setIsMobileOpen(false);
                        addToast(`Workspace role updated to ${role}.`, 'info');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold font-mono transition-all flex items-center justify-between ${activeRole === role ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
                    >
                      <span>{getAlias(role)}</span>
                      <ChevronRight size={12} className="opacity-40" />
                    </button>
                  ))}
                </div>

                <div className="space-y-3 px-2 pt-4 border-t border-zinc-900">
                  <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Active Channels</div>
                  <a href="#" className="text-[10px] text-zinc-500 hover:text-emerald-500 flex items-center gap-1">
                    <CornerDownRight size={10} /> Secure Telegram Webhook
                  </a>
                  <a href="#" className="text-[10px] text-zinc-500 hover:text-emerald-500 flex items-center gap-1">
                    <CornerDownRight size={10} /> Operations WhatsApp Anchor
                  </a>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/50 border border-zinc-800">
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest">System Latency</div>
                <div className="text-xs font-bold text-emerald-500 mt-1 flex items-center gap-2">
                  <Wifi size={12} /> 14ms [SYDNEY-EDGE]
                </div>
              </div>
            </div>
          </>
        )}

        {/* 3. Horizontal and vertical boundaries styled elegantly */}
        {/* Desktop Sidebar Navigation Shell (Req #7) */}
        <aside className="hidden md:flex w-16 border-r border-zinc-900/50 bg-zinc-950/40 backdrop-blur-md flex-col items-center py-6 justify-between text-zinc-600">
          <div className="flex flex-col items-center gap-6">
            {isCSuite && (
              <>
                <button 
                  onClick={() => { setActiveRole('CEO'); addToast('CEO view active.', 'info'); }}
                  className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'CEO' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
                  title="CEO Console (UB)"
                >
                  <Activity size={18} />
                </button>
                <button 
                  onClick={() => { setActiveRole('CFO'); addToast('CFO ledger console active.', 'info'); }}
                  className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'CFO' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
                  title="CFO Ledger (SAM)"
                >
                  <Landmark size={18} />
                </button>
                <button 
                  onClick={() => { setActiveRole('COO'); addToast('COO console active.', 'info'); }}
                  className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'COO' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
                  title="COO Ops (SAM)"
                >
                  <Settings size={18} />
                </button>
                <button 
                  onClick={() => { setActiveRole('CTO'); addToast('CTO workspace active.', 'info'); }}
                  className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'CTO' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
                  title="CTO Terminal (AMMAR)"
                >
                  <UserCheck size={18} />
                </button>
                <button 
                  onClick={() => { setActiveRole('CAIO'); addToast('CAIO workspace active.', 'info'); }}
                  className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'CAIO' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
                  title="CAIO Agent Control"
                >
                  <Brain size={18} />
                </button>
                <button 
                  onClick={() => { setActiveRole('CMO'); addToast('CMO growth metrics console active.', 'info'); }}
                  className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'CMO' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
                  title="CMO Campaigns"
                >
                  <TrendingUp size={18} />
                </button>
                <button 
                  onClick={() => { setActiveRole('CSO'); addToast('CSO security gateway active.', 'info'); }}
                  className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'CSO' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
                  title="CSO Intrusion Guard"
                >
                  <ShieldAlert size={18} />
                </button>
              </>
            )}
            {(isCSuite || (currentUser && currentUser.role === 'DEV')) && (
              <button 
                onClick={() => { setActiveRole('DEV'); addToast('Developer workbench active.', 'info'); }}
                className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'DEV' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
                title="Freelancer Workspace"
              >
                <Terminal size={18} />
              </button>
            )}
            {(isCSuite || (currentUser && currentUser.role === 'CLIENT')) && (
              <button 
                onClick={() => { setActiveRole('CLIENT'); addToast('Client Transparency Gateway active.', 'info'); }}
                className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'CLIENT' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
                title="Client Transparency Gateway"
              >
                <ShieldCheck size={18} />
              </button>
            )}
            <button 
              onClick={() => { setActiveRole('CHAT'); addToast('Anonymous Chat Console active.', 'info'); }}
              className={`p-2.5 rounded-sm transition-all hover:text-emerald-400 hover:bg-zinc-900/30 relative ${activeRole === 'CHAT' ? 'text-emerald-400 bg-zinc-900/50 border-r-2 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]' : ''}`}
              title="Anonymous Terminal Chat"
            >
              <MessageSquare size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-4 text-zinc-800">
            <HelpIcon size={16} className="hover:text-zinc-500 cursor-help transition-colors" />
          </div>
        </aside>

        {/* Core Canvas Body */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 sm:p-6 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>

      {/* 4. Interactive Search Console / Palette Overlay (Req #8) */}
      {isSearchOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[120] backdrop-blur-xs" onClick={() => setIsSearchOpen(false)} />
          <div className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-lg bg-zinc-900 border border-zinc-800 shadow-2xl z-[130] p-2 rounded-sm animate-in zoom-in-95 duration-150">
            <div className="flex items-center px-3 py-2 border-b border-zinc-800 gap-3">
              <Search size={16} className="text-emerald-500" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search console (e.g. released escrow, PRD specs, Skydo)..."
                className="flex-1 bg-transparent border-none text-xs text-emerald-400 font-mono outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-[9px] bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-zinc-500"
              >
                ESC
              </button>
            </div>
            
            <div className="p-2 space-y-1">
              <div className="text-[8px] text-zinc-600 uppercase tracking-widest px-2 py-1">Command Index</div>
              {[
                { title: 'GOTO_CEO_CONSOLE', role: 'CEO', desc: 'Jump to ₹1 Cr Target Dashboard' },
                { title: 'SKYDO_RECON_TABLE', role: 'CFO', desc: 'Audit multi-currency clears' },
                { title: 'DISPATCH_INVOICE_CFO', role: 'CFO', desc: 'Generate and clear corporate demands' },
                { title: 'GIT_MASTER_WEBHOOK', role: 'CTO', desc: 'Inspect live developer code commits' },
                { title: 'CLAIM_SPRINT_LEADS', role: 'DEV', desc: 'Browse and claim open project contracts' },
                { title: 'CLIENT_INDEX_VERIFY', role: 'CLIENT', desc: 'Run Google Search Console diagnostic' }
              ]
              .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    setActiveRole(item.role as SessionRole);
                    setIsSearchOpen(false);
                    addToast(`Navigating to ${item.role} via Search Command console.`, 'success');
                  }}
                  className="p-2 hover:bg-emerald-500/10 rounded cursor-pointer group flex justify-between items-center transition-colors"
                >
                  <div>
                    <div className="text-[10px] font-bold text-zinc-300 group-hover:text-emerald-400 font-mono">{`> ${item.title}`}</div>
                    <div className="text-[8px] text-zinc-600 uppercase mt-0.5">{item.desc}</div>
                  </div>
                  <ChevronRight size={12} className="text-zinc-800 group-hover:text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 5. Error Alert Toast Container (Req #20) */}
      <div className="fixed bottom-4 right-4 z-[200] space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="pointer-events-auto bg-zinc-950/95 border border-emerald-500/20 shadow-xl shadow-emerald-500/5 p-3.5 flex items-start gap-3 relative animate-in slide-in-from-bottom-2 duration-200"
          >
            {toast.type === 'error' ? (
              <AlertOctagon size={16} className="text-red-500 mt-0.5 shrink-0" />
            ) : toast.type === 'warn' ? (
              <AlertOctagon size={16} className="text-yellow-500 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 font-mono text-[10px]">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-zinc-500 uppercase tracking-widest font-bold">
                  {toast.type === 'error' ? 'Compliance Breach' : toast.type === 'warn' ? 'Infrastructure Alerts' : 'Secure Sync'}
                </span>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="text-zinc-700 hover:text-zinc-400 font-sans font-bold"
                >
                  &times;
                </button>
              </div>
              <div className="text-zinc-200 leading-normal">{toast.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
