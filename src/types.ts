export type SessionRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CAIO' | 'CMO' | 'CSO' | 'DEV' | 'CLIENT' | 'CHAT';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warn' | 'info';
  timestamp: string;
}

export interface ProjectTask {
  id: string;
  name: string;
  client: string;
  tier: '₹499' | '₹2,499' | '₹4,999';
  stage: 'Pipeline' | 'Development' | 'QA' | 'Production';
  description: string;
  assignedDev: string; // e.g., 'UB_DEV_14' or 'Unassigned'
  prsCount: number;
  health: 'Stable' | 'Warning' | 'Error';
}

export interface LeadAssignment {
  id: string;
  name: string;
  value: string;
  region: string;
  suggestedTier: string;
}

export interface EscrowTransaction {
  id: string;
  client: string;
  project: string;
  amount: number;
  status: 'Escrowed' | 'Released' | 'Refused';
}

export interface ZohoContract {
  id: string;
  party: string;
  role: string;
  type: 'NDA' | 'Contractor Agreement' | 'IP Assignment';
  status: 'Signed' | 'Pending' | 'Review';
  date: string;
}

export interface ChangeRequestTicket {
  id: string;
  clientName: string;
  type: 'UI Adjustment' | 'Logic Bug' | 'API Modification';
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  timestamp: string;
}

export interface SandboxStatus {
  id: string;
  url: string;
  status: 'Online' | 'Offline' | 'Staging';
  healthScore: number;
}

export interface ScraperLog {
  timestamp: string;
  targetNode: string;
  status: 'Success' | 'Parsing' | 'Timeout';
  payloadSize: string;
}

export interface FiraRemittance {
  id: string;
  ref: string;
  client: string;
  amount: string;
  status: 'Validated' | 'Pending Verification';
  date: string;
}

export interface PartnerAffiliate {
  partner: string;
  traffic: string;
  clicks: number;
  conversion: string;
  payoutObligation: string;
}

export interface SystemState {
  isAuthenticated: boolean;
  activeRole: SessionRole;
  systemStatus: 'SECURE_SESSION' | 'LOCKOUT';
  selectedEntity: 'UB Technologies' | 'UB CLUB';
  founderFocus: 'In Studio' | 'In Sprints' | 'Strategic' | 'Standby';
  adSpend: number; // slider for COO, Meta spend
  developerSlots: number; // compute slots
  systemUptime: string;
  edgeSpeed: string;
}
