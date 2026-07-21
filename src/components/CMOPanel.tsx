import React, { useState } from 'react';
import { 
  TrendingUp, Megaphone, Target, DollarSign, Users, 
  ArrowUpRight, BarChart2, Plus, Sliders, CheckSquare, Gift, RefreshCw
} from 'lucide-react';

interface CMOPanelProps {
  addToast: (msg: string, type: 'success' | 'error' | 'warn' | 'info') => void;
}

export const CMOPanel: React.FC<CMOPanelProps> = ({ addToast }) => {
  const [activeCampaigns, setActiveCampaigns] = useState([
    { id: 'CMP-101', name: 'Developer Retainer Hub Acquisition', channels: 'Meta Ads', budget: 142000, ctr: '3.42%', status: 'Active' },
    { id: 'CMP-102', name: 'Startups 1 Crore Tech Stack Outreach', channels: 'LinkedIn Sponsored', budget: 98000, ctr: '2.84%', status: 'Active' },
    { id: 'CMP-103', name: 'Affiliate Growth Loop Campaign', channels: 'Influencer Referral', budget: 45000, ctr: '4.15%', status: 'Active' }
  ]);

  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignBudget, setNewCampaignBudget] = useState('');
  const [newCampaignChannel, setNewCampaignChannel] = useState('Meta Ads');

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim() || !newCampaignBudget.trim()) {
      addToast('Please fill out all campaign parameters.', 'error');
      return;
    }

    const campaign = {
      id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
      name: newCampaignName,
      channels: newCampaignChannel,
      budget: Number(newCampaignBudget),
      ctr: '0.00%',
      status: 'Active'
    };

    setActiveCampaigns(prev => [...prev, campaign]);
    setNewCampaignName('');
    setNewCampaignBudget('');
    addToast(`Marketing Strategy Deployed: "${campaign.name}" launched on ${campaign.channels}.`, 'success');
  };

  const totalBudget = activeCampaigns.reduce((sum, c) => sum + c.budget, 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Total Dispatched Budget</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">₹{totalBudget.toLocaleString()}</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Clearing source: CFO Ledger</span>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Overall Blended CAC</span>
          <div className="text-xl font-bold font-mono text-white mt-1">₹1,840</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Target Cap: ₹3,000</span>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Conversion Rate (L1)</span>
          <div className="text-xl font-bold font-mono text-white mt-1">4.82%</div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Leads to retainer conversions</span>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Traffic Traffic Volume</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-emerald-500" />
            42,800
          </div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono block mt-0.5">Unique edge hits (Vercel)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Launch Campaigns Form */}
        <form onSubmit={handleLaunchCampaign} className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Megaphone size={16} className="text-emerald-500" />
            Launch Strategic Campaign
          </h3>
          <p className="text-xs text-zinc-500">Configure Meta Ad sets, sponsored placements, and growth loops directly into automated targeting pools.</p>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Campaign Strategy Name</label>
              <input
                type="text"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                placeholder="e.g. Meta Retargeting Campaign v2"
                className="w-full bg-zinc-950 border border-zinc-850 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-100 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Budget Limit (INR)</label>
                <input
                  type="number"
                  value={newCampaignBudget}
                  onChange={(e) => setNewCampaignBudget(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full bg-zinc-950 border border-zinc-850 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-100 rounded"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Target Channel</label>
                <select
                  value={newCampaignChannel}
                  onChange={(e) => setNewCampaignChannel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 text-xs px-3 py-2.5 outline-none focus:border-emerald-500 text-zinc-400 font-mono rounded"
                >
                  <option value="Meta Ads">Meta Ads Pixel</option>
                  <option value="LinkedIn Sponsored">LinkedIn Sponsored</option>
                  <option value="X Ads">X Ads Platform</option>
                  <option value="Influencer Referral">Influencer Referral</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase py-3 text-xs flex items-center justify-center gap-2 transition-colors rounded shadow-md cursor-pointer"
            >
              <Plus size={12} />
              Deploy Campaign Strategy
            </button>
          </div>
        </form>

        {/* Active Campaigns List */}
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Target size={16} className="text-emerald-500" />
            Active Outreach Pipelines
          </h3>
          <p className="text-xs text-zinc-500">Live-audit ongoing acquisition funnels and pixel feedback indices.</p>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {activeCampaigns.map((camp) => (
              <div key={camp.id} className="p-3.5 bg-zinc-950 border border-zinc-850 rounded flex justify-between items-center text-xs font-mono">
                <div>
                  <div className="font-bold text-zinc-200">{camp.name}</div>
                  <div className="text-[9px] text-zinc-500 mt-1 uppercase font-bold">{camp.channels} // Id: {camp.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold">₹{camp.budget.toLocaleString()}</div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 mt-1 font-bold uppercase rounded inline-block">
                    CTR: {camp.ctr}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
