export enum Role {
    Admin = 'Admin',
    Member = 'Member',
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: Role;
}

export enum ToneOfVoice {
  Professional = 'Professional',
  Casual = 'Casual',
  Witty = 'Witty',
  Enthusiastic = 'Enthusiastic',
  Formal = 'Formal',
  Humorous = 'Humorous',
}

export interface Competitor {
    id: string;
    name: string; // e.g., "Nike", "Adidas"
    website?: string;
    analysis?: string | null; // AI-generated analysis
}

export interface Integration {
    id: 'googleAnalytics' | 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'wordpress' | 'shopify' | 'googleAds' | 'mailchimp' | 'salesforce' | 'slack' | 'hootsuite';
    name: string;
    connected: boolean;
    category: 'Analytics' | 'Social' | 'Publishing' | 'Commerce' | 'Ads' | 'Email' | 'CRM' | 'Communication';
}

export interface BrandProfile {
  id: string;
  name: string;
  logo: string; // URL to logo
  secondaryLogo?: string; // URL to secondary logo/favicon
  website?: string;
  description?: string;
  audience?: string;
  baseTone?: ToneOfVoice;
  messagingPillars?: string[];
  dos?: string[];
  donts?: string[];
  colors?: {
    primary: string;
    secondary: string;
  };
  fonts?: {
    primary: string;
    secondary: string;
  };
  approvedImages?: string[];
  mission?: string;
  values?: string[];
  competitors: Competitor[];
  integrations: Integration[];
}

export interface Task {
  id: string;
  brandId: string;
  projectId?: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string for date part
  status: 'To Do' | 'In Progress' | 'Completed';
  assignee?: string;
}

export interface Project {
  id: string;
  brandId: string;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string; // ISO string
  endDate: string; // ISO string
}

export interface Client {
    id: string;
    name: string;
    contactEmail: string;
    brandIds: string[]; // List of BrandProfile IDs associated with this client
    notes?: string;
    lastContacted?: string; // ISO string
}

export interface Budget {
    id: string;
    brandId: string;
    name: string; // e.g., "Q3 Marketing Budget", "Project Phoenix Budget"
    amount: number;
    startDate: string;
    endDate: string;
}

export interface Expense {
    id: string;
    brandId: string;
    budgetId: string; // Which budget this expense draws from
    name: string;
    category: 'Advertising' | 'Software' | 'Content Creation' | 'Influencers' | 'Other';
    amount: number;
    date: string; // ISO string
}

export interface Invoice {
    id: string;
    brandId: string;
    clientId: string;
    invoiceNumber: string;
    amount: number;
    status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
    issueDate: string;
    dueDate: string;
    items: {
        description: string;
        amount: number;
    }[];
}

export interface Goal {
  id: string;
  brandId: string;
  title: string;
  subTasks: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export enum View {
  Dashboard = 'DASHBOARD',
  AIStudio = 'AI_STUDIO',
  BrandSettings = 'BRAND_SETTINGS',
  ContentCalendar = 'CONTENT_CALENDAR',
  CampaignPlanner = 'CAMPAIGN_PLANNER',
  Projects = 'PROJECTS',
  AssetRepository = 'ASSET_REPOSITORY',
  Automation = 'AUTOMATION',
  InfluencerManager = 'INFLUENCER_MANAGER',
  Analytics = 'ANALYTICS',
  Integrations = 'INTEGRATIONS',
  Clients = 'CLIENTS',
  Financials = 'FINANCIALS',
  TeamManagement = 'TEAM_MANAGEMENT',
}

export enum SocialPlatform {
  Twitter = 'Twitter/X',
  Instagram = 'Instagram',
  LinkedIn = 'LinkedIn',
  Facebook = 'Facebook',
}

export interface BlogIdea {
  title: string;
  description: string;
}

export interface NavItem {
    name: string;
    view: View;
    icon: React.ReactNode;
}

export interface NavStructureItem {
    type: 'link' | 'heading';
    name: string;
    view?: View;
    icon?: React.ReactNode;
}

export interface SEOKeyword {
  keyword: string;
  relevance: 'High' | 'Medium' | 'Low';
  intent: 'Informational' | 'Commercial' | 'Navigational' | 'Transactional';
}

export interface EmailContent {
    subject: string;
    previewText: string;
    body: string;
}

export interface ContentCalendarEvent {
    id: string;
    brandId: string;
    date: string; // ISO string
    title: string;
    content: {
        type: GeneratedContentType;
        text: string;
        imageUrl?: string;
    };
}

export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Planning' | 'Active' | 'Completed' | 'Archived';
  kpis: {
    name: string;
    target: number;
    actual: number;
  }[];
  budget?: number;
  linkedAssetIds?: string[];
}

export type GeneratedContentType = 'Social Post' | 'Ad Copy' | 'Blog Idea' | 'Image' | 'Email' | 'Repurposed Content';

export interface Asset {
  id: string;
  brandId: string;
  name: string;
  type: GeneratedContentType;
  content: string;
  imageUrl?: string;
  createdAt: string;
  tags?: string[];
}

export interface Collection {
  id: string;
  brandId: string;
  name: string;
  assetIds: string[];
}

export interface AutomationNode {
    id: string;
    type: 'trigger' | 'action' | 'delay' | 'condition';
    name: string;
    description: string;
}

export interface AutomationWorkflow {
    id: string;
    brandId: string;
    name: string;
    description: string;
    trigger: AutomationNode;
    steps: AutomationNode[];
    active: boolean;
}

export interface Influencer {
    id: string;
    brandId: string;
    name: string;
    handle: string;
    platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter/X';
    followers: number;
    engagementRate: number; // as a percentage
    avatarUrl: string;
    tags: string[];
    aiAnalysis?: string | null;
}

export interface SuggestedTask {
  title: string;
  description: string;
}

export interface CampaignBrief {
  name: string;
  description: string;
  kpis: {
    name: string;
    target: number;
  }[];
}

export interface CalendarSuggestion {
  date: string;
  title: string;
  content: {
      type: GeneratedContentType;
      text: string;
  }
}

export interface BrainstormIdea {
  text: string;
  category: 'Practical Task' | 'Big Concept' | 'Wildcard Idea';
}

export interface AutomationRecipe {
    name: string;
    description: string;
    trigger: AutomationNode;
    steps: AutomationNode[];
}

export interface InfluencerOutreach {
    subject: string;
    body: string;
}
