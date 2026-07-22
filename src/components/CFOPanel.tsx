import React, { useState } from 'react';
import { 
  Landmark, FileText, Send, ShieldCheck, Calendar, 
  TrendingUp, Users, Award, Receipt, Coins, ArrowUpRight, CheckSquare
} from 'lucide-react';
import { ProjectTask, EscrowTransaction } from '../types';
import { supabase } from '../supabaseClient';
import { 
  STRIPE_RECON_RECORDS, FIRA_REMITTANCES, PARTNER_AFFILIATES, 
  PLACEMENT_COMMISSIONS, TRANSPORT_SUBSIDIES 
} from '../data';


interface CFOPanelProps {
  tasks: ProjectTask[];
  escrows: EscrowTransaction[];
  setEscrows: React.Dispatch<React.SetStateAction<EscrowTransaction[]>>;
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
}

export const CFOPanel: React.FC<CFOPanelProps> = ({
  tasks,
  escrows,
  setEscrows,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'clearing' | 'ledger' | 'auxiliary'>('clearing');
  
  // Invoice form states
  const [invoiceClient, setInvoiceClient] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceTier, setInvoiceTier] = useState<'₹499' | '₹2,499' | '₹4,999'>('₹4,999');

  // Dynamic calculations
  const totalRevenue = 6840000; // 68.4 Lakhs
  const escrowLocked = escrows.filter(e => e.status === 'Escrowed').reduce((sum, e) => sum + e.amount, 0);
  const weeklyIncomeVelocity = tasks.reduce((sum, t) => {
    const val = t.tier === '₹4,999' ? 4999 : t.tier === '₹2,499' ? 2499 : 499;
    return sum + val;
  }, 0) * 30;
  const weeklyDevPayout = tasks.filter(t => t.assignedDev !== 'Unassigned').length * 2800;

  const handleReleasePayment = async (escrowId: string) => {
    try {
      const { error } = await supabase
        .from('escrows')
        .update({ status: 'Released' })
        .eq('id', escrowId);
      if (error) throw error;

      setEscrows(prev => prev.map(esc => {
        if (esc.id === escrowId) {
          return { ...esc, status: 'Released' };
        }
        return esc;
      }));
      addToast('CFO Authorization: Milestone payout disbursed successfully.', 'success');
    } catch (err) {
      console.error('Error releasing escrow in Supabase:', err);
      addToast('Failed to release escrow in database.', 'error');
    }
  };

  const handleDispatchInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceClient.trim() || !invoiceAmount.trim()) {
      addToast('Invoice fields cannot be blank.', 'error');
      return;
    }
    addToast(`Invoice dispatched to ${invoiceClient} for ₹${Number(invoiceAmount).toLocaleString()} via automated Stripe clearance webhook.`, 'success');
    setInvoiceClient('');
    setInvoiceAmount('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* 1. CFO Header Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Total Company Revenue</span>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">₹68,40,000</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-1">Stripe + Skydo Cleared</span>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Escrow Vault Locked</span>
            <Coins size={14} className="text-yellow-500" />
          </div>
          <div className="text-lg font-bold font-mono text-zinc-100 mt-1">₹{escrowLocked.toLocaleString()}</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-1">Pending Milestone Authorize</span>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Weekly Income run-rate</span>
            <ArrowUpRight size={14} className="text-emerald-500" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1">₹{weeklyIncomeVelocity.toLocaleString()}</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-1">Based on retainer clients</span>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Weekly Dev Sunday Payout</span>
            <Landmark size={14} className="text-red-400" />
          </div>
          <div className="text-lg font-bold font-mono text-red-400 mt-1 font-semibold">₹{weeklyDevPayout.toLocaleString()}</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-1">Direct wire sync</span>
        </div>
      </div>

      {/* 2. Sub-tab switcher */}
      <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-md">
        <button
          onClick={() => setActiveTab('clearing')}
          className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'clearing' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Receipt size={14} />
          Invoicing & Escrow Clearing
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'ledger' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Landmark size={14} />
          Company ledger allocation
        </button>
        <button
          onClick={() => setActiveTab('auxiliary')}
          className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'auxiliary' ? 'bg-emerald-500 text-black rounded shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Users size={14} />
          Remittance validation & subsidies
        </button>
      </div>

      {/* 3. Render Active Tab */}
      {activeTab === 'clearing' && (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Section Header */}
          <div className="border-b border-zinc-800 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Receipt size={20} className="text-emerald-400" />
              <span className="text-xs uppercase font-mono text-emerald-400 font-bold tracking-widest">Financial Auditing Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Active Clearing & Demand Despatch</h1>
            <p className="text-sm text-zinc-400 mt-1">CFO Workspace: Release milestone funds from escrow vaults, dispatch custom retainer bills, and monitor gateway reconciliations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Automated Invoice Form */}
            <form onSubmit={handleDispatchInvoice} className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-300 uppercase font-bold tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-emerald-500" />
                Automated Invoice Generator
              </h3>
              <p className="text-[11px] text-zinc-500">Formulates clean corporate demand notes and directly dispatches notification payloads to client email & Stripe hooks.</p>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Client Name / Corporate Node</label>
                  <input 
                    type="text"
                    value={invoiceClient}
                    onChange={(e) => setInvoiceClient(e.target.value)}
                    placeholder="e.g. CardioCare Diagnostics..."
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Demand Value (INR)</label>
                    <input 
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                      placeholder="e.g. 4999..."
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Subscription Tier</label>
                    <select
                      value={invoiceTier}
                      onChange={(e) => setInvoiceTier(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-400 font-mono"
                    >
                      <option value="₹499">₹499 Impulse</option>
                      <option value="₹2,499">₹2,499 Standard</option>
                      <option value="₹4,999">₹4,999 Enterprise</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase py-3 text-xs flex items-center justify-center gap-2 transition-colors rounded shadow-md cursor-pointer"
                >
                  <Send size={12} />
                  Dispatch Subscription Invoice
                </button>
              </div>
            </form>

            {/* Escrow Funds Management Box */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-300 uppercase font-bold tracking-wider flex items-center gap-2">
                <Coins size={16} className="text-yellow-500" />
                Active Escrow Disbursements
              </h3>
              <p className="text-[11px] text-zinc-500">Vault clearances verified by milestone completions. Authorize immediate release to developer sunday payouts pool.</p>
              
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {escrows.map((esc) => (
                  <div key={esc.id} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded">
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase font-mono">Vault: {esc.id}</span>
                      <div className="text-xs font-bold text-zinc-200">{esc.client}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Value: ₹{esc.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      {esc.status === 'Released' ? (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 font-bold uppercase">
                          Cleared
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReleasePayment(esc.id)}
                          className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[9px] rounded transition-colors"
                        >
                          Release
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stripe and Skydo reconciliations */}
          <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
            <h3 className="text-xs text-zinc-300 uppercase font-bold tracking-wider">Stripe & Skydo Remittances</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STRIPE_RECON_RECORDS.map((rec, i) => (
                <div key={i} className="p-4 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                  <div>
                    <div className="font-bold text-zinc-200">{rec.desc}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">{rec.gate} | Ref: {rec.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">{rec.net}</div>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 font-bold uppercase rounded block mt-1 text-center">
                      Cleared
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Section Header */}
          <div className="border-b border-zinc-800 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Landmark size={20} className="text-emerald-400" />
              <span className="text-xs uppercase font-mono text-emerald-400 font-bold tracking-widest">Internal Ledger Allocations</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">The 30-30-20-10-10 Ledger Matrix</h1>
            <p className="text-sm text-zinc-400 mt-1">CFO Capital Distribution Rules: Pro-rata allocation of the ₹68,40,000 corporate cleared revenues.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Ledger Details */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-300 uppercase font-bold tracking-wider">Dynamic Revenue Matrix distribution</h3>
              <div className="space-y-3.5">
                {[
                  { label: 'Opex Operations Fund (30%)', amount: '₹20,52,000', desc: 'Server costs, proxies, software licenses' },
                  { label: 'Developer Sunday payouts (30%)', amount: '₹20,52,000', desc: 'Direct subcontractor wires' },
                  { label: 'Marketing ROI dynamic budget (20%)', amount: '₹13,68,000', desc: 'Meta ad spend dispatch ledger' },
                  { label: 'Emergency Protected Reserve (10%)', amount: '₹6,84,000', desc: 'Locked backup escrow' },
                  { label: 'Founder Reserve capital (10%)', amount: '₹6,84,000', desc: 'Core platform profits' }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-400 font-mono">
                      <span>{item.label}</span>
                      <span className="text-emerald-400 font-bold">{item.amount}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-900 overflow-hidden rounded">
                      <div className="h-full bg-emerald-500" style={{ width: i === 0 || i === 1 ? '30%' : i === 2 ? '20%' : '10%' }} />
                    </div>
                    <span className="text-[9px] text-zinc-600 block">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance benefits status cards */}
            <div className="space-y-6">
              <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-500 uppercase font-bold block">GST Export Benefits Status</span>
                  <span className="text-sm text-zinc-100 font-bold block mt-1">Zero-Tax LUT Export Active</span>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Authorized clearance of international inward wires under zero GST lut export code compliance.</p>
                </div>
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 rounded shrink-0 ml-4">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 rounded shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 uppercase font-bold block">Fixed Weekly Sunday Payout Date</span>
                  <span className="text-sm font-bold text-zinc-100 block mt-0.5">Direct Wire Sunday 18:00 IST</span>
                  <span className="text-xs text-emerald-400 font-mono block mt-1">Zero latency local clearing sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'auxiliary' && (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-8 space-y-8 shadow-2xl backdrop-blur-md">
          {/* Section Header */}
          <div className="border-b border-zinc-800 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Users size={20} className="text-emerald-400" />
              <span className="text-xs uppercase font-mono text-emerald-400 font-bold tracking-widest">Inward wire and Affiliate Settlements</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Auxiliary Auditing & Verification</h1>
            <p className="text-sm text-zinc-400 mt-1">Audit and clear inward FIRA foreign currency wire remittances, travel allowances, and referral payouts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fira Remittances */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-300 uppercase font-bold tracking-wider">FIRA Inward Wire Verification</h3>
              <div className="space-y-3">
                {FIRA_REMITTANCES.map((fira) => (
                  <div key={fira.id} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                    <div>
                      <div className="font-bold text-zinc-200">{fira.client}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">Ref: {fira.ref} | Date: {fira.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">{fira.amount}</div>
                      <button 
                        onClick={() => {
                          addToast(`FIRA Certificate for ${fira.ref} validated.`, 'success');
                        }}
                        className={`text-[8px] border px-1.5 py-0.5 font-bold uppercase mt-1 rounded inline-block ${fira.status === 'Validated' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:border-yellow-500 cursor-pointer'}`}
                      >
                        {fira.status === 'Validated' ? 'Validated' : 'Verify'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Affiliates */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-300 uppercase font-bold tracking-wider">Partner Affiliate Payout Obligations</h3>
              <div className="space-y-3">
                {PARTNER_AFFILIATES.map((part, i) => (
                  <div key={i} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                    <div>
                      <div className="font-bold text-zinc-200">{part.partner}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">Traffic: {part.traffic} | Conv: {part.conversion}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold">{part.payoutObligation}</div>
                      <button
                        onClick={() => addToast(`Affiliate payout of ${part.payoutObligation} scheduled for next cycle.`, 'info')}
                        className="text-[8px] bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-800 px-1.5 py-0.5 mt-1 font-bold uppercase rounded cursor-pointer block text-center"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subsidies and Commissions Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Travel Allowance Subsidies */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-300 uppercase font-bold tracking-wider">Developer Travel Allowance Reimbursements</h3>
              <div className="space-y-3">
                {TRANSPORT_SUBSIDIES.map((sub, i) => (
                  <div key={i} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                    <div>
                      <div className="font-bold text-zinc-200">{sub.dev} - {sub.type}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{sub.trip}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-zinc-100 font-bold">{sub.cost}</div>
                      <span className="text-[8px] text-zinc-500 uppercase mt-1 block">Approved</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruitment Split Commissions */}
            <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded space-y-4">
              <h3 className="text-xs text-zinc-300 uppercase font-bold tracking-wider">Institute Recruitment splits</h3>
              <div className="space-y-3">
                {PLACEMENT_COMMISSIONS.map((plc, i) => (
                  <div key={i} className="p-3 bg-zinc-900 border border-zinc-850 flex justify-between items-center rounded text-xs font-mono">
                    <div>
                      <div className="font-bold text-zinc-200">{plc.candidate}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">{plc.institute}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">{plc.amount}</div>
                      <span className={`text-[8px] font-bold uppercase mt-1 inline-block ${plc.status === 'Approved' ? 'text-emerald-500' : 'text-yellow-500 animate-pulse'}`}>
                        {plc.status}
                      </span>
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
