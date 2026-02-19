
import { 
    SocialPlatform, ToneOfVoice, BlogIdea, BrandProfile, SEOKeyword, EmailContent, Campaign, CampaignBrief, 
    SuggestedTask, Project, Budget, Expense, Invoice, Client, GeneratedContentType, CalendarSuggestion, 
    Integration, AutomationWorkflow, Competitor, BrainstormIdea, AutomationRecipe, InfluencerOutreach, 
    Influencer, Goal 
} from '../types';

const API_BASE_URL = '/api'; // This will be proxied to your Python backend in a production setup.
const USE_MOCKS = (import.meta as any).env?.VITE_USE_MOCKS === 'true';

// Lightweight mock responder used in Demo mode to avoid network calls.
function mockResponse(endpoint: string, body: any): any {
  switch (endpoint) {
    case '/generate/text':
      return { generated_text: `Demo response for: ${body?.prompt || 'N/A'}` };
    case '/generate/social-post':
      return `Demo social post for ${body?.platform || 'platform'} about ${body?.product || 'product'} in ${body?.tone || 'neutral'} tone.`;
    case '/generate/ad-copy':
      return `Demo ad copy highlighting: ${body?.sellingPoints || 'benefits'}.`;
    case '/generate/blog-ideas':
      return [{ title: `Demo ideas on ${body?.topic || 'your topic'}`, outline: 'Intro, Points, CTA' }];
    case '/generate/image':
      return { imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...' };
    case '/generate/seo-keywords':
      return [{ keyword: body?.topic || 'demo', volume: 100, difficulty: 20 }];
    case '/generate/email-campaign':
      return { subject: `Demo: ${body?.goal || 'Campaign'}`, body: 'This is a demo email body.' };
    case '/generate/repurpose':
      return 'Demo repurposed content.';
    case '/generate/tags':
      return ['demo', 'brandspark', 'ai'];
    case '/generate/suggestion':
      return 'Demo suggestion text.';
    case '/generate/competitor-analysis':
      return { analysis: 'Demo competitor analysis.' };
    case '/generate/calendar-suggestions':
      return (body?.emptyDates || []).map((d: string) => ({ date: d, suggestion: 'Post a demo update' }));
    case '/generate/automation-workflow':
      return { name: 'Demo Workflow', steps: [{ name: 'Demo step', action: 'notify' }] };
    case '/generate/vet-influencer':
      return { analysis: 'Demo influencer vetting result.' };
    case '/generate/integration-insights':
      return { insight: 'Demo integration insights.' };
    case '/generate/financial-summary':
      return { summary: 'Demo financial summary.' };
    case '/generate/invoice-email':
      return { subject: 'Demo invoice subject', body: 'Demo invoice email body.' };
    case '/generate/client-report':
      return { report: 'Demo client report.' };
    case '/generate/project-tasks':
      return [{ title: 'Demo Task', description: 'Do something demo' }];
    case '/generate/goal-breakdown':
      return [{ text: 'Demo goal breakdown item' }];
    case '/generate/data-qa':
      return 'Demo data answer.';
    case '/generate/full-report':
      return 'Demo full report content.';
    case '/generate/brainstorm-ideas':
      return [{ idea: `Demo idea about ${body?.topic || 'topic'}` }];
    case '/generate/automation-recipes':
      return [{ name: 'Demo Recipe', description: 'A helpful demo automation.' }];
    case '/generate/influencer-outreach':
      return { subject: 'Demo Outreach', body: 'Hello influencer, demo message.' };
    case '/generate/campaign-brief':
      return { summary: 'Demo campaign brief' };
    default:
      return {};
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An unknown error occurred');
  }
  return response.json();
}

async function post<T>(endpoint: string, body: any): Promise<T> {
  if (USE_MOCKS) {
    // Return deterministic mock data in Demo mode without any network calls.
    return Promise.resolve(mockResponse(endpoint, body) as T);
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}


// =================================
// AI Generation API
// =================================

export const generateText = (data: { brandId: string, prompt: string }) =>
  post<{ generated_text: string }>('/generate/text', data).then(res => res.generated_text);

export const generateSocialPost = (data: { brandId: string, platform: SocialPlatform, product: string, audience: string, tone: ToneOfVoice }) =>
  post<string>('/generate/social-post', data);

export const generateAdCopy = (data: { brandId: string, product: string, sellingPoints: string, tone: ToneOfVoice }) =>
  post<string>('/generate/ad-copy', data);

export const generateBlogIdeas = (data: { brandId: string, topic: string }) =>
  post<BlogIdea[]>('/generate/blog-ideas', data);

export const generateMarketingImage = (data: { brandId: string, prompt: string }) =>
  post<{ imageUrl: string }>('/generate/image', data).then(res => res.imageUrl);

export const generateSEOKeywords = (data: { brandId: string, topic: string }) =>
  post<SEOKeyword[]>('/generate/seo-keywords', data);

export const generateEmailCampaign = (data: { brandId: string, goal: string, productInfo: string, tone: ToneOfVoice }) =>
  post<EmailContent>('/generate/email-campaign', data);

export const repurposeContent = (data: { brandId: string, originalContent: string, targetFormat: string }) =>
  post<string>('/generate/repurpose', data);

export const generateAssetTags = (data: { content: string, type: GeneratedContentType }) =>
  post<string[]>('/generate/tags', data);

export const generateSuggestion = (data: { prompt: string }) =>
  post<string>('/generate/suggestion', data);

export const analyzeCompetitor = (data: { brandId: string, competitor: { name: string, website?: string } }) =>
  post<{ analysis: string }>('/generate/competitor-analysis', data).then(res => res.analysis);
  
export const generateCalendarSuggestions = (data: { brandId: string, emptyDates: string[] }) =>
  post<CalendarSuggestion[]>('/generate/calendar-suggestions', data);

export const generateAutomationWorkflow = (data: { brandId: string, goal: string }) =>
  post<Omit<AutomationWorkflow, 'id' | 'brandId' | 'active'>>('/generate/automation-workflow', data);
  
export const vetInfluencer = (data: { brandId: string, handle: string }) =>
  post<{ analysis: string }>('/generate/vet-influencer', data).then(res => res.analysis);
  
export const generateIntegrationInsights = (data: { brandId: string, integrations: Integration[] }) =>
  post<{ insight: string }>('/generate/integration-insights', data).then(res => res.insight);
  
export const generateFinancialSummary = (brand: BrandProfile, financials: { budgets: Budget[], expenses: Expense[], invoices: Invoice[] }) =>
  post<{ summary: string }>('/generate/financial-summary', { brand, financials }).then(res => res.summary);

export const generateInvoiceEmail = (brand: BrandProfile, client: Client, invoice: Invoice) =>
  post<{ subject: string, body: string }>('/generate/invoice-email', { brand, client, invoice });

export const generateClientReport = (client: Client, brands: BrandProfile[], campaigns: Campaign[], projects: Project[], invoices: Invoice[], dateRange: { start: string, end: string }) =>
  post<{ report: string }>('/generate/client-report', { client, brands, campaigns, projects, invoices, dateRange }).then(res => res.report);
  
export const generateProjectTasks = (data: { name: string, description: string }) =>
  post<SuggestedTask[]>('/generate/project-tasks', data);

export const generateGoalBreakdown = (data: { brandId: string, goal: string }) =>
  post<{ text: string }[]>('/generate/goal-breakdown', data).then(res => res.map(r => ({text: r} as any)));
  
export const answerDataQuestion = (data: { question: string, brandId: string }) =>
  post<string>('/generate/data-qa', data);
  
export const generateFullReport = (data: { brandId: string }) =>
  post<string>('/generate/full-report', data);
  
export const generateBrainstormIdeas = (topic: string) =>
  post<BrainstormIdea[]>('/generate/brainstorm-ideas', { topic });

export const suggestAutomationRecipes = (brand: BrandProfile) =>
  post<AutomationRecipe[]>('/generate/automation-recipes', { brand });

export const generateInfluencerOutreach = (brand: BrandProfile, influencer: Influencer, goal: string) =>
  post<InfluencerOutreach>('/generate/influencer-outreach', { brand, influencer, goal });

export const generateCampaignBrief = (data: { brandId: string, goal: string }) =>
    post<CampaignBrief>('/generate/campaign-brief', data);
