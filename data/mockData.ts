import {
    Campaign, Asset, Client, Project, Task, AutomationWorkflow, Influencer, Budget, Expense, Invoice,
    ContentCalendarEvent, Collection, Goal, GeneratedContentType, AutomationNode
} from '../types';
import { MOCK_BRANDS } from './mockBrands';

const BRAND_1_ID = MOCK_BRANDS[0].id;
const BRAND_2_ID = MOCK_BRANDS[1].id;

const createDate = (daysAgo: number) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
const createDateFuture = (daysFuture: number) => new Date(Date.now() + daysFuture * 24 * 60 * 60 * 1000).toISOString();
const createISODateOnly = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};

// ================== Clients ==================
export const MOCK_CLIENTS: Client[] = [
    { id: 'client-1', name: 'Global Solutions Ltd.', contactEmail: 'contact@globalsolutions.com', brandIds: [BRAND_1_ID], lastContacted: createDate(5) },
    { id: 'client-2', name: 'The Green Collective', contactEmail: 'hello@greencollective.com', brandIds: [BRAND_2_ID], lastContacted: createDate(2) },
];

// ================== Projects ==================
export const MOCK_PROJECTS: Project[] = [
    { id: 'proj-1', brandId: BRAND_1_ID, name: 'Q3 Product Launch', description: 'Coordinate all marketing efforts for the launch of Project Titan.', status: 'In Progress', startDate: createDate(30), endDate: createDateFuture(60) },
    { id: 'proj-2', brandId: BRAND_1_ID, name: 'Website Redesign', description: 'Overhaul the corporate website with new branding and features.', status: 'Planning', startDate: createDateFuture(10), endDate: createDateFuture(100) },
    { id: 'proj-3', brandId: BRAND_2_ID, name: 'Holiday Gift Guide Campaign', description: 'Create and promote the 2024 Holiday Gift Guide.', status: 'In Progress', startDate: createDate(15), endDate: createDateFuture(45) },
    { id: 'proj-4', brandId: BRAND_2_ID, name: 'Supplier Transparency Report', description: 'Publish a report on our ethical sourcing practices.', status: 'Completed', startDate: createDate(90), endDate: createDate(10) },
];

// ================== Tasks ==================
export const MOCK_TASKS: Task[] = [
    { id: 'task-1', brandId: BRAND_1_ID, projectId: 'proj-1', title: 'Draft launch press release', dueDate: createISODateOnly(5), status: 'In Progress' },
    { id: 'task-2', brandId: BRAND_1_ID, projectId: 'proj-1', title: 'Finalize ad copy for LinkedIn', dueDate: createISODateOnly(10), status: 'To Do' },
    { id: 'task-3', brandId: BRAND_1_ID, projectId: 'proj-1', title: 'Schedule launch day social posts', dueDate: createISODateOnly(12), status: 'To Do' },
    { id: 'task-4', brandId: BRAND_2_ID, projectId: 'proj-3', title: 'Photoshoot for gift guide products', dueDate: createISODateOnly(-2), status: 'Completed' },
    { id: 'task-5', brandId: BRAND_2_ID, projectId: 'proj-3', title: 'Design email announcement', dueDate: createISODateOnly(3), status: 'In Progress' },
];

// ================== Campaigns ==================
export const MOCK_CAMPAIGNS: Campaign[] = [
    { id: 'camp-1', brandId: BRAND_1_ID, name: 'Project Titan Launch', description: 'Multi-channel campaign to launch our new flagship product.', startDate: createDate(10), endDate: createDateFuture(50), status: 'Active', kpis: [{ name: 'Leads Generated', target: 500, actual: 152 }], budget: 50000, linkedAssetIds: ['asset-1'] },
    { id: 'camp-2', brandId: BRAND_2_ID, name: 'Earth Month Promotion', description: 'Campaign celebrating Earth Month with special promotions and content.', startDate: createDate(60), endDate: createDate(30), status: 'Completed', kpis: [{ name: 'Sales', target: 20000, actual: 25400 }], budget: 15000, linkedAssetIds: ['asset-2', 'asset-3'] },
];

// ================== Assets & Collections ==================
export const MOCK_ASSETS: Asset[] = [
    { id: 'asset-1', brandId: BRAND_1_ID, name: 'Ad Copy: Titan Launch', type: 'Ad Copy', content: 'Unleash the power of AI with Project Titan. The future of business intelligence is here.', createdAt: createDate(8), tags: ['launch', 'ai', 'b2b'] },
    { id: 'asset-2', brandId: BRAND_2_ID, name: 'Image: Forest Canopy', type: 'Image', content: 'A lush green forest canopy from above.', imageUrl: 'https://picsum.photos/seed/forest/400/300', createdAt: createDate(40), tags: ['nature', 'eco', 'green'] },
    { id: 'asset-3', brandId: BRAND_2_ID, name: 'Blog Idea: 10 Ways to Reduce Plastic Waste', type: 'Blog Idea', content: 'Title: 10 Simple Swaps to Reduce Plastic Waste in Your Home\nDescription: An actionable guide for families looking to start their sustainability journey.', createdAt: createDate(35), tags: ['sustainability', 'blog', 'eco-friendly'] },
];

export const MOCK_COLLECTIONS: Collection[] = [
    { id: 'coll-1', brandId: BRAND_1_ID, name: 'Project Titan Assets', assetIds: ['asset-1'] },
    { id: 'coll-2', brandId: BRAND_2_ID, name: 'Earth Month Content', assetIds: ['asset-2', 'asset-3'] },
];

// ================== Goals & Calendar Events ==================
export const MOCK_GOALS: Goal[] = [
    { id: 'goal-1', brandId: BRAND_1_ID, title: 'Become a recognized thought leader in AI', subTasks: [{ id: 'gst-1', text: 'Publish 4 blog posts', completed: true }, { id: 'gst-2', text: 'Host 2 webinars', completed: false }] },
    { id: 'goal-2', brandId: BRAND_2_ID, title: 'Increase customer retention by 15%', subTasks: [{ id: 'gst-3', text: 'Launch loyalty program', completed: true }, { id: 'gst-4', text: 'Implement feedback survey', completed: true }] },
];

export const MOCK_CALENDAR_EVENTS: ContentCalendarEvent[] = [
    { id: 'calevent-1', brandId: BRAND_1_ID, date: createDateFuture(7), title: 'Webinar: The Future of BI', content: { type: 'Social Post', text: 'Join our webinar on the future of Business Intelligence! Register now.' } },
    { id: 'calevent-2', brandId: BRAND_2_ID, date: createDateFuture(3), title: 'Blog Post: Plastic Waste', content: { type: 'Blog Idea', text: 'Publish the blog post on 10 ways to reduce plastic waste.' } },
];

// ================== Automations & Influencers ==================
const mockNode = (id: string, type: AutomationNode['type'], name: string, description: string): AutomationNode => ({ id, type, name, description });
export const MOCK_AUTOMATIONS: AutomationWorkflow[] = [
    { id: 'auto-1', brandId: BRAND_1_ID, name: 'New Lead Nurturing', description: 'Sends a series of emails to new leads from Salesforce.', trigger: mockNode('n1', 'trigger', 'New Lead in Salesforce', ''), steps: [mockNode('n2', 'action', 'Send Welcome Email', ''), mockNode('n3', 'delay', 'Wait 3 Days', ''), mockNode('n4', 'action', 'Send Case Study', '')], active: true },
    { id: 'auto-2', brandId: BRAND_2_ID, name: 'Post-Purchase Follow-up', description: 'Follows up with customers after a Shopify purchase.', trigger: mockNode('n5', 'trigger', 'New Order in Shopify', ''), steps: [mockNode('n6', 'action', 'Send Thank You Email', ''), mockNode('n7', 'delay', 'Wait 14 Days', ''), mockNode('n8', 'action', 'Request a Review', '')], active: false },
];

export const MOCK_INFLUENCERS: Influencer[] = [
    { id: 'inf-1', brandId: BRAND_1_ID, name: 'TechVisionary', handle: '@techvisionary', platform: 'Twitter/X', followers: 125000, engagementRate: 3.5, avatarUrl: 'https://i.pravatar.cc/150?u=tech', tags: ['ai', 'tech', 'business'] },
    { id: 'inf-2', brandId: BRAND_2_ID, name: 'Sustainable Sarah', handle: '@sustainablesarah', platform: 'Instagram', followers: 82000, engagementRate: 5.2, avatarUrl: 'https://i.pravatar.cc/150?u=sarah', tags: ['eco', 'lifestyle', 'sustainable'] },
];

// ================== Financials ==================
export const MOCK_BUDGETS: Budget[] = [
    { id: 'bud-1', brandId: BRAND_1_ID, name: 'Q3 Marketing Budget', amount: 50000, startDate: createDate(30), endDate: createDateFuture(60) },
    { id: 'bud-2', brandId: BRAND_2_ID, name: 'Q3 Content Creation', amount: 10000, startDate: createDate(30), endDate: createDateFuture(60) },
];

export const MOCK_EXPENSES: Expense[] = [
    { id: 'exp-1', brandId: BRAND_1_ID, budgetId: 'bud-1', name: 'LinkedIn Ads', category: 'Advertising', amount: 5000, date: createDate(15) },
    { id: 'exp-2', brandId: BRAND_1_ID, budgetId: 'bud-1', name: 'Webinar Software Subscription', category: 'Software', amount: 500, date: createDate(10) },
    { id: 'exp-3', brandId: BRAND_2_ID, budgetId: 'bud-2', name: 'Influencer Payment (S. Sarah)', category: 'Influencers', amount: 1500, date: createDate(20) },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: 'inv-1', brandId: BRAND_1_ID, clientId: 'client-1', invoiceNumber: 'INV-001', amount: 25000, status: 'Paid', issueDate: createDate(45), dueDate: createDate(15), items: [{ description: 'Monthly Retainer', amount: 25000 }] },
    { id: 'inv-2', brandId: BRAND_2_ID, clientId: 'client-2', invoiceNumber: 'INV-002', amount: 10000, status: 'Sent', issueDate: createDate(10), dueDate: createDateFuture(20), items: [{ description: 'Campaign Management', amount: 8000 }, { description: 'Content Creation', amount: 2000 }] },
];
