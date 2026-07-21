import { 
  ProjectTask, LeadAssignment, EscrowTransaction, ZohoContract, 
  ChangeRequestTicket, SandboxStatus, ScraperLog, FiraRemittance, PartnerAffiliate 
} from './types';

export const BACKUP_ROSTER = [
  { id: 'UB_BACKUP_01', status: 'Standby - On Demand', speed: '98%', focus: 'Fullstack' },
  { id: 'UB_BACKUP_02', status: 'Standby - Off Cycle', speed: '94%', focus: 'Scrapers' },
  { id: 'UB_BACKUP_03', status: 'Standby - Active', speed: '99%', focus: 'AI Integration' },
  { id: 'UB_BACKUP_04', status: 'Standby - Weekend', speed: '95%', focus: 'NextJS/Tailwind' }
];

export const MAANG_JOBS = [
  { company: 'Meta', title: 'Senior Product Engineer (L6)', location: 'Remote / NYC', pay: '$240k - $310k', matches: ['NextJS', 'Agentic Workflows'] },
  { company: 'Google', title: 'Staff Frontend Engineer (L7)', location: 'Remote / Mountain View', pay: '$280k - $360k', matches: ['Tailwind', 'Web Performance'] },
  { company: 'Netflix', title: 'UI Lead Architect', location: 'Los Gatos / Hybrid', pay: '$300k - $450k', matches: ['TypeScript', 'Design Systems'] },
  { company: 'Apple', title: 'Embedded Agent Developer', location: 'Sunnyvale', pay: '$220k - $290k', matches: ['Scraper Optimization', 'C++ Layer'] }
];

export const INITIAL_TASKS: ProjectTask[] = [
  {
    id: 'TSK-201',
    name: 'Layer-1 Clinic Scraper Pipeline',
    client: 'CardioCare Diagnostics',
    tier: '₹4,999',
    stage: 'Development',
    description: 'Establish secure headless browser scraper to index patient appointment matrices.',
    assignedDev: 'UB_DEV_14',
    prsCount: 3,
    health: 'Stable'
  },
  {
    id: 'TSK-202',
    name: 'Skydo Global Webhook Handler',
    client: 'Apex Fintech Ltd',
    tier: '₹4,999',
    stage: 'QA',
    description: 'Construct real-time multi-currency remittance clearance handlers and invoice generators.',
    assignedDev: 'UB_DEV_04',
    prsCount: 5,
    health: 'Stable'
  },
  {
    id: 'TSK-203',
    name: 'Static Portfolio Impulse Page',
    client: 'Local Coffee Roasters',
    tier: '₹499',
    stage: 'Production',
    description: 'High-speed minimalist single-view layout optimized for mobile loads.',
    assignedDev: 'UB_DEV_07',
    prsCount: 1,
    health: 'Stable'
  },
  {
    id: 'TSK-204',
    name: 'Retell Outreach Audio Endpoint',
    client: 'MedScribe Wellness',
    tier: '₹2,499',
    stage: 'Pipeline',
    description: 'Configuring interactive audio-agent workflows to trigger follow-up patient calls.',
    assignedDev: 'Unassigned',
    prsCount: 0,
    health: 'Warning'
  },
  {
    id: 'TSK-205',
    name: 'Stripe Escrow Split Manager',
    client: 'HyperMart Logistics',
    tier: '₹4,999',
    stage: 'Development',
    description: 'Integrate automated contractor payouts upon milestone releases.',
    assignedDev: 'UB_DEV_22',
    prsCount: 2,
    health: 'Stable'
  }
];

export const INITIAL_LEADS: LeadAssignment[] = [
  { id: 'LD-401', name: 'Premium Healthcare API Engine', value: '₹4,999/mo', region: 'North America', suggestedTier: '₹4,999' },
  { id: 'LD-402', name: 'Realestate Micro-Impulse Site', value: '₹499/mo', region: 'Europe', suggestedTier: '₹499' },
  { id: 'LD-403', name: 'E-commerce Pipeline Upgrade', value: '₹2,499/mo', region: 'Middle East', suggestedTier: '₹2,499' },
  { id: 'LD-404', name: 'Clinic Scheduling Webhook Adapter', value: '₹4,999/mo', region: 'North America', suggestedTier: '₹4,999' }
];

export const INITIAL_ESCROW: EscrowTransaction[] = [
  { id: 'ESC-901', client: 'CardioCare Diagnostics', project: 'Layer-1 Clinic Scraper Pipeline', amount: 4999, status: 'Escrowed' },
  { id: 'ESC-902', client: 'Apex Fintech Ltd', project: 'Skydo Global Webhook Handler', amount: 4999, status: 'Released' },
  { id: 'ESC-903', client: 'MedScribe Wellness', project: 'Retell Outreach Audio Endpoint', amount: 2499, status: 'Escrowed' },
  { id: 'ESC-904', client: 'HyperMart Logistics', project: 'Stripe Escrow Split Manager', amount: 4999, status: 'Escrowed' }
];

export const STRIPE_RECON_RECORDS = [
  { id: 'STR-4421', desc: 'Subscription Clear - ₹4,999 Enterprise', fee: '₹145', net: '₹4,854', gate: 'Stripe Global', date: '2026-07-19' },
  { id: 'SKY-2204', desc: 'Direct Inward Wire - USD $120.00', fee: '₹80', net: '₹9,840', gate: 'Skydo Remit', date: '2026-07-18' },
  { id: 'STR-4420', desc: 'Subscription Clear - ₹499 Impulse', fee: '₹15', net: '₹484', gate: 'Stripe Global', date: '2026-07-17' },
  { id: 'SKY-2203', desc: 'Direct Inward Wire - USD $60.00', fee: '₹40', net: '₹4,920', gate: 'Skydo Remit', date: '2026-07-16' }
];

export const ZOHO_CONTRACTS: ZohoContract[] = [
  { id: 'ZOHO-001', party: 'UB_DEV_14 (Anon Profile)', role: 'Senior Developer', type: 'NDA', status: 'Signed', date: '2026-07-02' },
  { id: 'ZOHO-002', party: 'UB_DEV_04 (Anon Profile)', role: 'Core Architect', type: 'Contractor Agreement', status: 'Signed', date: '2026-07-05' },
  { id: 'ZOHO-003', party: 'CardioCare Diagnostics', role: 'Corporate Client', type: 'IP Assignment', status: 'Pending', date: '2026-07-14' },
  { id: 'ZOHO-004', party: 'UB_DEV_22 (Anon Profile)', role: 'Junior Builder', type: 'NDA', status: 'Signed', date: '2026-07-18' },
  { id: 'ZOHO-005', party: 'MedScribe Wellness', role: 'Corporate Client', type: 'IP Assignment', status: 'Review', date: '2026-07-19' }
];

export const FIRA_REMITTANCES: FiraRemittance[] = [
  { id: 'FIRA-228', ref: 'BOM-2204-98', client: 'CardioCare Diagnostics', amount: '$120.00', status: 'Validated', date: '2026-07-14' },
  { id: 'FIRA-229', ref: 'BOM-2204-99', client: 'HyperMart Logistics', amount: '$240.00', status: 'Pending Verification', date: '2026-07-19' },
  { id: 'FIRA-230', ref: 'BOM-2204-100', client: 'MedScribe Wellness', amount: '$60.00', status: 'Validated', date: '2026-07-19' }
];

export const PARTNER_AFFILIATES: PartnerAffiliate[] = [
  { partner: 'GeekForce Institute', traffic: '2,400 hits', clicks: 1420, conversion: '6.2%', payoutObligation: '₹14,500' },
  { partner: 'Developer Guild Kerala', traffic: '1,800 hits', clicks: 940, conversion: '4.8%', payoutObligation: '₹8,400' },
  { partner: 'BuildSpace Referral Node', traffic: '850 hits', clicks: 430, conversion: '9.1%', payoutObligation: '₹12,000' }
];

export const PLACEMENT_COMMISSIONS = [
  { id: 'PLC-101', candidate: 'Rohan Sharma', institute: 'GeekForce Institute', amount: '₹12,500 (50% Split)', status: 'Approved', clearanceDate: '2026-07-25' },
  { id: 'PLC-102', candidate: 'Nikhil Nair', institute: 'Developer Guild Kerala', amount: '₹7,500 (50% Split)', status: 'Disbursing', clearanceDate: '2026-07-25' }
];

export const TRANSPORT_SUBSIDIES = [
  { id: 'SUB-401', dev: 'UB_DEV_14', trip: 'Studio Hub ↔ Bangalore Core', cost: '₹1,200', type: 'Travel Allowance', date: '2026-07-19' },
  { id: 'SUB-402', dev: 'UB_DEV_04', trip: 'Onsite Client Run - CardioCare', cost: '₹1,850', type: 'Car Rental', date: '2026-07-20' },
  { id: 'SUB-403', dev: 'UB_DEV_22', trip: 'Studio Run - Weekend Sprint', cost: '₹850', type: 'Travel Allowance', date: '2026-07-20' }
];

export const CLINIC_SCRAPER_ROWS = [
  { patientId: 'PID-9021', status: 'Cleaned', timestamp: '02:30:14', parameters: 'BP: 120/80, HR: 72bpm' },
  { patientId: 'PID-9022', status: 'Cleaned', timestamp: '02:31:05', parameters: 'BP: 135/85, HR: 88bpm' },
  { patientId: 'PID-9023', status: 'Sanitized', timestamp: '02:32:41', parameters: 'BP: 110/70, HR: 65bpm' },
  { patientId: 'PID-9024', status: 'Cleaned', timestamp: '02:35:19', parameters: 'BP: 128/82, HR: 74bpm' }
];

export const VAPI_DIAGNOSTICS = [
  { callId: 'VAPI-99402', endpoint: 'vapi-alpha-us', duration: '2m 14s', latency: '142ms', status: 'Stable' },
  { callId: 'VAPI-99403', endpoint: 'vapi-beta-eu', duration: '1m 05s', latency: '198ms', status: 'Warning' },
  { callId: 'VAPI-99404', endpoint: 'vapi-alpha-us', duration: '3m 41s', latency: '135ms', status: 'Stable' }
];

export const SHARED_TEMPLATES = [
  { name: 'Headless Scraper Wrapper', file: 'scraper.ts', lines: 140, usageCount: 14 },
  { name: 'Skydo Remittance Webhook Hook', file: 'skydo-webhook.ts', lines: 95, usageCount: 22 },
  { name: 'Meta Pixel Conversion Proxy', file: 'meta-pixel.ts', lines: 60, usageCount: 8 }
];

export const REGIONAL_INCOME = [
  { region: 'North America (US/CA)', volume: '₹48,20,000', ratio: '48%', clientsCount: 64 },
  { region: 'Europe (UK/DE)', volume: '₹28,10,000', ratio: '28%', clientsCount: 38 },
  { region: 'Middle East (UAE/SA)', volume: '₹24,10,000', ratio: '24%', clientsCount: 40 }
];

export const DEFAULT_CHANGE_REQUESTS: ChangeRequestTicket[] = [
  {
    id: 'CR-101',
    clientName: 'CardioCare Diagnostics',
    type: 'UI Adjustment',
    description: 'Add real-time filter by location in patient appointment grid on clinical staging portal.',
    priority: 'Medium',
    status: 'In Progress',
    timestamp: '2026-07-20 01:12'
  },
  {
    id: 'CR-102',
    clientName: 'Apex Fintech Ltd',
    type: 'API Modification',
    description: 'Provide payload backup encryption keys inside response headers of Skydo verification callbacks.',
    priority: 'High',
    status: 'Open',
    timestamp: '2026-07-20 02:22'
  }
];

export const INITIAL_SANDBOXES: SandboxStatus[] = [
  { id: 'SND-ALPHA', url: 'https://staging.alpha.ub.technology', status: 'Online', healthScore: 99 },
  { id: 'SND-BETA', url: 'https://staging.beta.ub.technology', status: 'Online', healthScore: 94 },
  { id: 'SND-GAMMA', url: 'https://staging.gamma.ub.technology', status: 'Online', healthScore: 100 }
];
