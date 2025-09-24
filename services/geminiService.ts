
import { 
    SocialPlatform, ToneOfVoice, BlogIdea, BrandProfile, SEOKeyword, EmailContent, Campaign, CampaignBrief, 
    SuggestedTask, Project, Budget, Expense, Invoice, Client, GeneratedContentType, CalendarSuggestion, 
    Integration, AutomationWorkflow, Competitor, BrainstormIdea, AutomationRecipe, InfluencerOutreach, 
    Influencer, Goal 
} from '../types';

const API_BASE_URL = '/api'; // This will be proxied to your Python backend in a production setup.

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An unknown error occurred');
  }
  return response.json();
}

async function post<T>(endpoint: string, body: any): Promise<T> {
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
