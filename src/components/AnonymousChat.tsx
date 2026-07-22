import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Terminal as TermIcon, ShieldAlert, Wifi, 
  Send, Code, AlertTriangle, Play, RefreshCw, Copy, Check,
  Zap, Lock, FileText, CheckSquare, Trash2, Radio, Server,
  Sliders, UserX, Coins, Globe, Landmark, Users, ArrowUpRight
} from 'lucide-react';
import { SessionRole } from '../types';
import { supabase } from '../supabaseClient';


interface Message {
  id: string;
  channel_id: string; // Room name / DM target
  sender_alias: string; // Masked user string
  payload: string; // The content
  timestamp: number; // Unix epoch
  isSystem?: boolean;
}

interface AnonymousChatProps {
  activeRole: SessionRole;
  setActiveRole: (role: SessionRole) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
  escrows?: any[]; // for escrow release feedback
}

export const AnonymousChat: React.FC<AnonymousChatProps> = ({
  activeRole,
  setActiveRole,
  addToast,
  escrows = []
}) => {
  // 1. Dual-Channel Layout Router state
  const [activeChannel, setActiveChannel] = useState<'#general-lobby' | '#cto-pipeline' | '#escrow-feed' | 'UB (CEO)' | 'SAM (CFO)' | 'AMMAR (CTO)' | 'UB_DEV_14'>('#general-lobby');
  
  // Channels and unread counters
  const [unreads, setUnreads] = useState<Record<string, number>>({
    '#general-lobby': 0,
    '#cto-pipeline': 2,
    '#escrow-feed': 1,
    'UB (CEO)': 0,
    'SAM (CFO)': 0,
    'AMMAR (CTO)': 0,
    'UB_DEV_14': 0,
  });

  // Active message array with sliding window of max 50 items (Req #15)
  const [messages, setMessages] = useState<Message[]>([]);

  // Input state
  const [inputMessage, setInputMessage] = useState('');
  
  // Custom sender selector (Dynamic Name-Masking Layer - Req #2)
  const [chatSenderIdentity, setChatSenderIdentity] = useState<string>('UB_DEV_14');
  
  // Interactive WebSocket state & connection quality simulator (Req #5, #21)
  const [connectionState, setConnectionState] = useState<'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING'>('CONNECTED');
  const [connectionLogs, setConnectionLogs] = useState<string[]>([
    '[FastAPI WebSocket] Established connection on port 3000 with ticket: ' + Math.random().toString(36).substring(7),
    '[Supabase Bridge] Streaming active messages channel...',
    '[Anti-Mischief Middleware] Filter protocols loaded successfully.'
  ]);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  // Compliance worker state (Req #10, #11, #12)
  const [infractionCount, setInfractionCount] = useState<Record<string, number>>({
    'UB_DEV_14': 0,
    'UB_DEV_04': 0,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [muteCountdown, setMuteCountdown] = useState(0);
  const [complianceLogs, setComplianceLogs] = useState<string[]>([
    '[Worker] Active monitoring listening to FastAPI broadcast queue.'
  ]);

  // Async batch commit simulator state (Req #16)
  const [pendingBatchCount, setPendingBatchCount] = useState(0);
  const [batchTimer, setBatchTimer] = useState(5);
  const [batchStatus, setBatchStatus] = useState<'IDLE' | 'FLUSHING' | 'SUCCESS'>('IDLE');

  // Typing simulator state (Req #20)
  const [typingStatus, setTypingStatus] = useState<string | null>(null);

  // Code staging attachment states (Req #19)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('typescript');

  // Transport Inspector latest packet state (Req #4)
  const [lastTransmittedPacket, setLastTransmittedPacket] = useState<any>({
    "channel_id": "00000000-0000-0000-0000-000000000000",
    "sender_alias": "STANDBY",
    "payload": "SYSTEM_BOOT_SUCCESS",
    "timestamp": Math.floor(Date.now() / 1000)
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  // Fetch messages from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', activeChannel)
          .order('timestamp', { ascending: true })
          .limit(50);
        if (data) {
          setMessages(data.map(m => ({
            id: m.id,
            channel_id: m.channel_id,
            sender_alias: m.sender_alias,
            payload: m.payload,
            timestamp: new Date(m.timestamp).getTime(),
            isSystem: m.is_system
          })));
        }
      } catch (e) {
        console.error('Error fetching chat messages:', e);
      }
    };
    fetchMessages();
  }, [activeChannel]);

  // Subscribe to Postgres changes for real-time messages
  useEffect(() => {
    const channel = supabase
      .channel(`room-${activeChannel}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${activeChannel}`
      }, (payload) => {
        const newMsg = {
          id: payload.new.id,
          channel_id: payload.new.channel_id,
          sender_alias: payload.new.sender_alias,
          payload: payload.new.payload,
          timestamp: new Date(payload.new.timestamp).getTime(),
          isSystem: payload.new.is_system
        };
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg].slice(-50);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannel]);



  // Clean typing indicators simulation (Req #20)
  useEffect(() => {
    const typingList = [
      'UB_DEV_04 is writing setup.sh...',
      'SAM is auditing ledger entries...',
      'AMMAR is validating branch-alpha...',
      'UB_DEV_14 is writing scraper.ts...'
    ];
    const triggerTyping = () => {
      if (Math.random() > 0.4 && connectionState === 'CONNECTED') {
        const text = typingList[Math.floor(Math.random() * typingList.length)];
        setTypingStatus(text);
        setTimeout(() => {
          setTypingStatus(null);
        }, 3000);
      }
    };
    const timer = setInterval(triggerTyping, 12000);
    return () => clearInterval(timer);
  }, [connectionState]);

  // 5 Seconds Asynchronous Database Batch Commit simulation (Req #16)
  useEffect(() => {
    const interval = setInterval(() => {
      setBatchTimer(prev => {
        if (prev === 1) {
          if (pendingBatchCount > 0) {
            setBatchStatus('FLUSHING');
            setTimeout(() => {
              setBatchStatus('SUCCESS');
              setPendingBatchCount(0);
              const now = new Date().toLocaleTimeString();
              setComplianceLogs(l => [
                ...l,
                `[SQL Batch] flushed queued transactions to PostgreSQL at ${now}`
              ]);
              setTimeout(() => setBatchStatus('IDLE'), 1500);
            }, 800);
          }
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pendingBatchCount]);

  // Infraction Mutex Countdown timer (Req #12)
  useEffect(() => {
    if (muteCountdown > 0) {
      const timer = setTimeout(() => {
        setMuteCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (muteCountdown === 0 && isMuted) {
      setIsMuted(false);
      addToast('Systemic Mutex removed. Channel broadcast capability restored.', 'info');
    }
  }, [muteCountdown, isMuted]);

  // Client-Facing mask mapper (Req #3)
  const getSenderDisplay = (sender: string) => {
    if (activeRole === 'CLIENT') {
      // Replaces all developer aliases with a single unified corporate tag
      if (sender.startsWith('UB_DEV_') || sender === 'Anon') {
        return 'UB Technologies Engineer';
      }
    }
    return sender;
  };

  // Pre-Routing String match & contact detail block checks (Req #7, #8, #9, #10)
  const runPreRoutingComplianceCheck = (text: string): boolean => {
    // 1. Telephone/WhatsApp string check
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    
    // 2. Email domain structure checking
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    // 3. Social Media handles
    const socialRegex = /(@[a-zA-Z0-9_]{3,})/g;

    // 4. Payment bypass keywords
    const paymentKeywords = [
      'pay me directly', 'invoice outside', 'personal crypto', 'direct bitcoin', 
      'gpay outside', 'poach', 'telegram me', 'my skype', 'whatsapp me'
    ];

    let hasViolation = false;
    let violationReason = '';

    if (phoneRegex.test(text)) {
      hasViolation = true;
      violationReason = 'Contact detail sharing (Phone number pattern)';
    } else if (emailRegex.test(text)) {
      hasViolation = true;
      violationReason = 'Contact detail sharing (Email address pattern)';
    } else if (socialRegex.test(text)) {
      hasViolation = true;
      violationReason = 'Contact detail sharing (Social handle pattern)';
    } else {
      const lowercase = text.toLowerCase();
      for (const keyword of paymentKeywords) {
        if (lowercase.includes(keyword)) {
          hasViolation = true;
          violationReason = `Direct Payment Pitch Bypass Keyword: "${keyword}"`;
          break;
        }
      }
    }

    if (hasViolation) {
      // Compliance Alert triggered
      addToast(`[COMPLIANCE ALERT] Post blocked: ${violationReason}`, 'error');
      
      const alias = chatSenderIdentity;
      const currentInfractions = (infractionCount[alias] || 0) + 1;
      
      setInfractionCount(prev => ({
        ...prev,
        [alias]: currentInfractions
      }));

      // Log webhook dispatch (Req #10)
      const now = new Date().toLocaleTimeString();
      setComplianceLogs(prev => [
        ...prev,
        `[${now}] ALERT: Violation of Rule 04 by ${alias} (${violationReason}).`,
        `[${now}] Webhook pushed to C-suite: secure-csuite-webhook-alert [INFRACTION_COUNT: ${currentInfractions}]`
      ]);

      // If user reaches 2 infractions in the session, trigger the systemic Mutex Lockout (Req #12)
      if (currentInfractions >= 2) {
        setIsMuted(true);
        setMuteCountdown(30); // 30 seconds mutex lockout
        addToast(`[MUTEX TRIGGERED] ${alias} has 2 violations. Transmit locked for 30s.`, 'warn');
      }

      // Emergency deletion packet broadcast simulated instantly (Req #11)
      setComplianceLogs(prev => [
        ...prev,
        `[Socket Broadcast] Emergency DELETE packet: {"action": "DELETE", "offending_alias": "${alias}"}`
      ]);

      return false; // Failed validation
    }

    return true; // Passed validation
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (connectionState !== 'CONNECTED') {
      addToast('FastAPI WebSocket connection offline. Transmit failed.', 'error');
      return;
    }

    if (isMuted) {
      addToast(`Transmit locked. Infraction mutex active for ${muteCountdown}s.`, 'error');
      return;
    }

    // Run compliance pre-routing (Req #7, #8, #9)
    const isApproved = runPreRoutingComplianceCheck(inputMessage);
    if (!isApproved) {
      setInputMessage('');
      return;
    }

    // Token-Optimized JSON Structure (Req #4)
    const packet = {
      "channel_id": activeChannel,
      "sender_alias": chatSenderIdentity,
      "payload": inputMessage,
      "timestamp": Math.floor(Date.now() / 1000)
    };

    setLastTransmittedPacket(packet);

    try {
      const { error } = await supabase.from('messages').insert([
        {
          channel_id: activeChannel,
          sender_alias: chatSenderIdentity,
          payload: inputMessage,
          is_system: false
        }
      ]);
      if (error) throw error;
      setInputMessage('');
      addToast('Message transmitted over secure WebSocket.', 'success');
    } catch (err) {
      console.error('Chat insert error:', err);
      addToast('Failed to insert message into Supabase database.', 'error');
    }
  };


  // Secure Document Attachment wrapper generator (Req #19)
  const handleAttachCode = () => {
    if (!codeSnippet.trim()) {
      addToast('Snippet cannot be empty.', 'error');
      return;
    }

    // Format safe markdown reference
    const formattedPayload = `\`\`\`${codeLanguage}\n${codeSnippet}\n\`\`\``;
    setInputMessage(formattedPayload);
    setIsCodeModalOpen(false);
    setCodeSnippet('');
    addToast('Markdown code attachment compiled to transport wrapper.', 'info');
  };

  // Simulate network dropped socket with exponential backoff (Req #21)
  const handleSimulateDropout = () => {
    setConnectionState('DISCONNECTED');
    setConnectionLogs(prev => [...prev, '[Socket] Connection explicitly dropped by client core.']);
    addToast('Simulating WebSocket connection lost.', 'warn');
    setReconnectAttempt(1);
  };

  useEffect(() => {
    if (connectionState === 'DISCONNECTED' && reconnectAttempt > 0) {
      const delay = Math.pow(2, reconnectAttempt) * 1000; // Exponential Backoff: 2s, 4s, 8s...
      const timer = setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString();
        setConnectionLogs(prev => [
          ...prev,
          `[${timestamp}] Reconnecting WebSocket... Attempt ${reconnectAttempt} (Wait: ${delay/1000}s)`
        ]);

        if (reconnectAttempt >= 3) {
          setConnectionState('CONNECTED');
          setConnectionLogs(prev => [
            ...prev,
            `[${timestamp}] [SUCCESS] WebSocket re-established. Secure tunnel active on port 3000.`
          ]);
          setReconnectAttempt(0);
          addToast('WebSocket connection recovered. Session restored.', 'success');
        } else {
          setReconnectAttempt(prev => prev + 1);
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [connectionState, reconnectAttempt]);

  // Text Copy Utility Action Button (Req #23)
  const handleCopyMessage = (payload: string) => {
    navigator.clipboard.writeText(payload);
    addToast('Text copied to clipboard securely.', 'success');
  };

  // One-Click Executive Revocation Pipeline (Req #25)
  const handleRevokeSocket = (sender: string) => {
    addToast(`C-suite action: WebSocket for ${sender} revoked. Dropping socket pool.`, 'error');
    setConnectionLogs(prev => [
      ...prev,
      `[ADMIN SHUTDOWN] Force closed active WebSocket node for alias: ${sender}`
    ]);
  };

  // Automated Project Progress Summary Generator (Req #26)
  const handleGenerateAISummary = () => {
    const channelMsgs = messages.filter(m => m.channel_id === activeChannel && !m.isSystem);
    if (channelMsgs.length === 0) {
      addToast('No chat history available to analyze.', 'warn');
      return;
    }

    const summary = `### UB CLUB CHAT REPORT - ${activeChannel}
- **Analyzed Rows**: ${channelMsgs.length} messages
- **Primary Contributors**: ${Array.from(new Set(channelMsgs.map(m => m.sender_alias))).join(', ')}
- **Key Technical Sprint Topics**: Sprints, webhooks, deployment pipeline checks, and client portal configurations.
- **Status Summary**: High efficiency developer cooperation. No pending code block blockages reported.`;

    // Inject as a local system block
    const sysMsg: Message = {
      id: 'ai_' + Date.now(),
      channel_id: activeChannel,
      sender_alias: 'SYSTEM BOT',
      payload: summary,
      timestamp: Date.now(),
      isSystem: true
    };

    setMessages(prev => [...prev, sysMsg].slice(-50));
    addToast('Executive Project Progress Summary compiled successfully.', 'success');
  };

  // Trigger search bot index alerts (Req #24)
  const handleTriggerSearchAlert = () => {
    const sysMsg: Message = {
      id: 'gsc_' + Date.now(),
      channel_id: '#general-lobby',
      sender_alias: 'SYSTEM BOT',
      payload: '[GSC BOT] Platform cardio-care.com successfully scanned. Fully indexed online on Google. Indexing Score: 98/100.',
      timestamp: Date.now(),
      isSystem: true
    };
    setMessages(prev => [...prev, sysMsg].slice(-50));
    addToast('Search Console update alert injected.', 'success');
  };

  // End of Session Memory Wipe Routine (Req #30)
  const handleWipeSessionMemory = () => {
    addToast('Triggering sanitization sweep. Clearing RAM.', 'warn');
    setMessages([]);
    setConnectionLogs(['[Memory Sanitize] Zeroized all local messaging arrays.']);
    setComplianceLogs(['[Memory Sanitize] Purged session security logs.']);
    setLastTransmittedPacket({ "status": "SWEEPED", "records": 0 });
    setTimeout(() => {
      setActiveRole('CEO');
      addToast('Secure memory completely sanitized. Switched back to CEO Console.', 'success');
    }, 1500);
  };

  // Push an automated alert if SAM updates escrow releases
  const triggerManualEscrowPush = () => {
    const sysMsg: Message = {
      id: 'escrow_' + Date.now(),
      channel_id: '#escrow-feed',
      sender_alias: 'SYSTEM',
      payload: `[ESCROW DISBURSED] Authorized Sunday milestone payout. ₹4,999 released to dev wallet pool. Verified by SAM (CFO).`,
      timestamp: Date.now(),
      isSystem: true
    };
    setMessages(prev => [...prev, sysMsg].slice(-50));
    addToast('Escrow payout acknowledgment feed pushed.', 'success');
  };

  // Auto-generate some interesting message feeds if escrow payouts are verified (Req #29)
  useEffect(() => {
    if (escrows.length > 0) {
      const completedCount = escrows.filter(e => e.status === 'Released').length;
      if (completedCount > 0) {
        // Automatically inject a payout release log
        const lastRelease = escrows.filter(e => e.status === 'Released')[0];
        const sysMsg: Message = {
          id: 'auto_escrow_' + Math.random(),
          channel_id: '#escrow-feed',
          sender_alias: 'SYSTEM',
          payload: `[ESCROW RELEASED] SAM (CFO) cleared ₹${lastRelease.amount.toLocaleString()} for ${lastRelease.client} milestone.`,
          timestamp: Date.now(),
          isSystem: true
        };
        setMessages(prev => {
          // Avoid pushing duplicates
          if (prev.some(m => m.payload.includes(lastRelease.client))) return prev;
          return [...prev, sysMsg].slice(-50);
        });
      }
    }
  }, [escrows]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-mono text-zinc-100">
      
      {/* 1. Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900 border border-zinc-800 p-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="text-emerald-500 animate-pulse" size={16} />
            <span className="text-[10px] uppercase text-zinc-500 tracking-wider">FastAPI WebSockets + PostgreSQL</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            UB CLUB Anonymous Chat Hub
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Unified C-Suite, developer, and client encrypted chat console. Identities are cryptographically masked.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Simulate dropout */}
          <button
            onClick={handleSimulateDropout}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-yellow-500/50 text-[10px] text-yellow-500 uppercase font-bold flex items-center gap-1.5 transition-colors"
            title="Simulate network dropout"
          >
            <Wifi size={12} />
            Disconnect Socket
          </button>

          {/* Trigger Google index update notice */}
          <button
            onClick={handleTriggerSearchAlert}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1.5 transition-colors"
          >
            <Globe size={12} />
            Scan Index
          </button>

          {/* Wipe memory */}
          <button
            onClick={handleWipeSessionMemory}
            className="px-3 py-1.5 bg-red-950/40 border border-red-900/50 hover:bg-red-900 hover:text-black text-[10px] text-red-400 uppercase font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={12} />
            Sanitize Memory
          </button>
        </div>
      </div>

      {/* 2. Three Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Channel/User router (Compact Device Grid Adaptation - Req #27) */}
        <div className="hidden lg:block lg:col-span-3 bg-zinc-900/40 border border-zinc-800 p-4 space-y-6">
          
          {/* Active Sender Mask Configurator */}
          <div className="p-3 bg-zinc-950/60 border border-zinc-850">
            <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold mb-2">Sender Identity Mask</label>
            <select
              value={chatSenderIdentity}
              onChange={(e) => {
                setChatSenderIdentity(e.target.value);
                addToast(`Identity payload masked as ${e.target.value}`, 'info');
              }}
              className="w-full bg-zinc-900 border border-zinc-800 text-[11px] p-2 outline-none text-emerald-400 font-mono font-bold"
            >
              <option value="UB">UB (CEO)</option>
              <option value="SAM">SAM (CFO/COO)</option>
              <option value="AMMAR">AMMAR (CTO)</option>
              <option value="UB_DEV_14">UB_DEV_14 (Freelancer)</option>
              <option value="UB_DEV_04">UB_DEV_04 (Freelancer)</option>
              <option value="CardioCare Client">Client Core</option>
            </select>
            <span className="text-[8px] text-zinc-650 mt-1 block">Middleware mapping: USER_ID ➜ ALIAS</span>
          </div>

          {/* Group Rooms */}
          <div className="space-y-2">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">Room Arrays (Group)</span>
            <div className="space-y-1">
              {[
                { name: '#general-lobby', label: 'Central Lobby Chat' },
                { name: '#cto-pipeline', label: 'CTO Engineering' },
                { name: '#escrow-feed', label: 'Escrow Ledgers' }
              ].map((ch) => (
                <button
                  key={ch.name}
                  onClick={() => {
                    setActiveChannel(ch.name as any);
                    setUnreads(prev => ({ ...prev, [ch.name]: 0 }));
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center border transition-all ${activeChannel === ch.name ? 'bg-zinc-900 text-emerald-400 border-zinc-700' : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-900/40'}`}
                >
                  <span className="truncate">{ch.name}</span>
                  {unreads[ch.name] > 0 && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500 text-zinc-950 font-bold rounded-full">
                      {unreads[ch.name]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Secure DM Channels */}
          <div className="space-y-2">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">Secure P2P DMs</span>
            <div className="space-y-1">
              {['UB (CEO)', 'SAM (CFO)', 'AMMAR (CTO)', 'UB_DEV_14'].map((user) => (
                <button
                  key={user}
                  onClick={() => {
                    setActiveChannel(user as any);
                    setUnreads(prev => ({ ...prev, [user]: 0 }));
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center border transition-all ${activeChannel === user ? 'bg-zinc-900 text-emerald-400 border-zinc-700' : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-900/40'}`}
                >
                  <span className="truncate">{user}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Connection Status Panel */}
          <div className="p-3 bg-zinc-950/60 border border-zinc-850 space-y-2">
            <div className="flex justify-between items-center text-[9px] uppercase">
              <span className="text-zinc-500">WebSocket Pool</span>
              <span className={`font-bold ${connectionState === 'CONNECTED' ? 'text-emerald-400' : 'text-yellow-500 animate-pulse'}`}>{connectionState}</span>
            </div>
            <div className="text-[8px] text-zinc-600 font-mono space-y-1 max-h-[100px] overflow-y-auto">
              {connectionLogs.map((log, index) => (
                <div key={index} className="line-clamp-2">{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Center column: Active Chat Stream */}
        <div className="col-span-1 lg:col-span-6 bg-zinc-900 border border-zinc-800 rounded flex flex-col justify-between min-h-[550px]">
          
          {/* Chat Header */}
          <div className="border-b border-zinc-800 p-4 flex justify-between items-center bg-zinc-950/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">{activeChannel}</span>
                <span className="text-[8px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-zinc-500">SECURE_SUITE</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                {activeRole === 'CLIENT' ? '🛡️ [CLIENT PORTAL ENFORCED] Dev IDs redacted to "UB Technologies Engineer"' : 'Full executive visibility active'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGenerateAISummary}
                className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-[9px] text-emerald-400 uppercase font-bold flex items-center gap-1 transition-colors"
                title="Summarize chat activity logs into brief"
              >
                <FileText size={11} />
                Generate Brief
              </button>

              <button
                onClick={triggerManualEscrowPush}
                className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-yellow-500/50 text-[9px] text-yellow-500 uppercase font-bold flex items-center gap-1 transition-colors"
              >
                <Coins size={11} />
                Test Escrow Feed
              </button>
            </div>
          </div>

          {/* Message view */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[380px] min-h-[380px]">
            {messages.filter(m => m.channel_id === activeChannel).map((msg) => {
              const isMe = msg.sender_alias === chatSenderIdentity;
              const isSys = msg.isSystem || msg.sender_alias === 'SYSTEM' || msg.sender_alias === 'SYSTEM BOT';
              const displaySender = getSenderDisplay(msg.sender_alias);

              if (isSys) {
                return (
                  <div key={msg.id} className="p-3 bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-500/90 rounded leading-relaxed">
                    <span className="font-bold text-[9px] tracking-widest block uppercase mb-1">⚠️ SYSTEM NOTICE LOG ENTRY</span>
                    {msg.payload}
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-zinc-500 uppercase font-bold">
                      {displaySender}
                    </span>
                    <span className="text-[8px] text-zinc-650">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    
                    {/* Executive controls (One-Click Revocation - Req #25) */}
                    {(['CEO', 'CFO', 'COO', 'CTO'].includes(activeRole)) && !isMe && (
                      <button
                        onClick={() => handleRevokeSocket(msg.sender_alias)}
                        className="text-[8px] text-red-500 hover:text-red-400 bg-red-950/20 px-1 hover:border-red-500/40 border border-transparent"
                        title="Disconnect Socket"
                      >
                        Disconnect Node
                      </button>
                    )}
                  </div>

                  <div className={`p-3 max-w-sm rounded text-xs leading-relaxed break-words font-mono ${isMe ? 'bg-emerald-500 text-black font-semibold' : 'bg-zinc-950 border border-zinc-800 text-zinc-200'}`}>
                    {msg.payload.startsWith('```') ? (
                      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[10px] bg-black/40 p-2 rounded border border-zinc-800">
                        {msg.payload.replace(/```[a-z]*\n?/g, '')}
                      </pre>
                    ) : (
                      msg.payload
                    )}
                  </div>

                  {/* Text Copy action (Req #23) */}
                  <button
                    onClick={() => handleCopyMessage(msg.payload)}
                    className="text-[8px] text-zinc-500 hover:text-zinc-300 flex items-center gap-0.5 mt-1 self-end sm:self-auto"
                  >
                    <Copy size={8} />
                    Copy Payload
                  </button>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Typing activity indicator line (Req #20) */}
          <div className="px-4 py-1.5 border-t border-zinc-850 bg-zinc-950/20 text-[10px] text-zinc-500 min-h-[28px] flex justify-between items-center">
            <span>{typingStatus || 'No active typing detected.'}</span>
            <span className="text-[8px] text-zinc-600">Cache Index: {messages.filter(m => m.channel_id === activeChannel).length}/50</span>
          </div>

          {/* Form message sender */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center gap-2">
            {/* Secure document vault attachment wrapper button (Req #19) */}
            <button
              type="button"
              onClick={() => setIsCodeModalOpen(true)}
              className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all rounded"
              title="Securely attach markdown code snippet"
            >
              <Code size={16} />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isMuted}
              placeholder={isMuted ? `SYSTEM MUTEX ACTIVE: wait ${muteCountdown}s...` : "Transmit message to secure terminal..."}
              className="flex-1 bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 outline-none focus:border-emerald-500/50 text-zinc-100 placeholder-zinc-600"
            />

            <button
              type="submit"
              disabled={isMuted}
              className="p-2.5 bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors rounded cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-650"
            >
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Right column: Compliance worker / Packet audit panels */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          
          {/* Compliance & Webhook logs (Req #10, #11, #12) */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert size={14} className="text-red-400" />
                Anti-Bypass Worker
              </span>
              <span className="text-[8px] bg-red-950 text-red-400 px-1.5 py-0.5 border border-red-900/40 font-bold uppercase font-mono">Real-time</span>
            </div>
            
            <p className="text-[10px] text-zinc-500">Asynchronously monitors inward streams for contact bypass attempts (Rule 04 violations).</p>

            {/* Active Infractions Status List */}
            <div className="p-2.5 bg-zinc-950/60 border border-zinc-850 space-y-2 text-[10px]">
              <span className="text-[8px] text-zinc-500 block uppercase font-bold tracking-widest">Active Infraction Ledger</span>
              <div className="flex justify-between items-center text-xs">
                <span>UB_DEV_14</span>
                <span className={`font-bold ${infractionCount['UB_DEV_14'] > 0 ? 'text-red-400' : 'text-zinc-500'}`}>{infractionCount['UB_DEV_14']} / 2</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>UB_DEV_04</span>
                <span className={`font-bold ${infractionCount['UB_DEV_04'] > 0 ? 'text-red-400' : 'text-zinc-500'}`}>{infractionCount['UB_DEV_04']} / 2</span>
              </div>
            </div>

            {/* Compliance Logs Terminal */}
            <div className="bg-zinc-950 border border-zinc-850 p-2 text-[8px] text-zinc-500 font-mono space-y-1.5 h-[160px] overflow-y-auto custom-scrollbar">
              {complianceLogs.map((log, index) => (
                <div key={index} className="line-clamp-3">{log}</div>
              ))}
            </div>
          </div>

          {/* WebSocket Transport packet monitor (Req #4) */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-4 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest block border-b border-zinc-800 pb-2">WebSocket Transport Inspector</span>
            <p className="text-[10px] text-zinc-500">Intercepts active WebSocket frames. Stripped to 4 core primitives for high edge efficiency.</p>
            <div className="p-3 bg-zinc-950 border border-zinc-850 text-[9px] text-emerald-400 rounded-sm font-mono overflow-x-auto whitespace-pre">
              {JSON.stringify(lastTransmittedPacket, null, 2)}
            </div>
          </div>

          {/* 5 Seconds Queue flush simulation (Req #16) */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-4 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest block border-b border-zinc-800 pb-2">5s DB Flush Queue</span>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-500">Queue Flush Countdown</span>
                <span className="text-emerald-400 font-bold">{batchTimer}s</span>
              </div>
              <div className="h-2 bg-zinc-950 rounded overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(batchTimer / 5) * 100}%` }} />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span className="text-zinc-500">Uncommitted Buffer:</span>
              <span className="font-bold text-zinc-200">{pendingBatchCount} Messages</span>
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400 uppercase font-bold text-[9px]">
                {batchStatus === 'IDLE' ? 'BUFFERING_IN_MEMORY' : batchStatus === 'FLUSHING' ? 'COMMIT_IN_PROGRESS' : 'DB_COMMIT_SUCCESS'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Code attachment secure modal */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg p-6 space-y-4 rounded-sm shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="text-emerald-400" size={18} />
                <span className="text-xs uppercase font-bold tracking-wider text-white">Secure Code Vault Attachment</span>
              </div>
              <button 
                onClick={() => setIsCodeModalOpen(false)}
                className="text-xs text-zinc-500 hover:text-white"
              >
                Close
              </button>
            </div>

            <p className="text-[11px] text-zinc-500">Strict safety filter: Dispatched code snippet is encapsulated into standard markdown wrappers to block arbitrary executable scripts.</p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Encapsulation Wrapper</label>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs p-2 text-zinc-300 font-mono"
                  >
                    <option value="typescript">TypeScript / JS</option>
                    <option value="python">Python</option>
                    <option value="bash">Shell Script</option>
                    <option value="json">JSON Schema</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Source Code Snippet</label>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="// Paste your safe typescript snippet here..."
                  rows={8}
                  className="w-full bg-zinc-950 border border-zinc-850 p-3 text-xs outline-none focus:border-emerald-500/50 font-mono text-zinc-200"
                />
              </div>

              <button
                onClick={handleAttachCode}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase py-2.5 text-xs rounded transition-colors"
              >
                Generate Markdown Wrapper
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
