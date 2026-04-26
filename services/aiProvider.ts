// Simple AI provider abstraction to prepare for multi-provider support and caching.
// Current default routes to backend endpoints and leverages existing mock guards in geminiService.ts.

type ProviderName = 'gemini' | 'openai' | 'claude';

interface ProviderOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

interface AIProvider {
  name: ProviderName;
  post<T>(endpoint: string, body: any): Promise<T>;
}

// Utility: read env flags
const USE_MOCKS = (import.meta as any).env?.VITE_USE_MOCKS === 'true';
const API_BASE_URL = '/_/backend';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An unknown error occurred');
  }
  return response.json();
}

// Lightweight mock responder used in Demo mode to avoid network calls.
// Mirrors mock behavior in services/geminiService.ts for consistency.
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

// Default Gemini-like provider that posts to backend endpoints.
// Future: add OpenAI/Claude providers and dynamic routing/fallbacks.
class BackendProvider implements AIProvider {
  name: ProviderName = 'gemini';
  constructor(private options?: ProviderOptions) {}

  async post<T>(endpoint: string, body: any): Promise<T> {
    if (USE_MOCKS) {
      return Promise.resolve(mockResponse(endpoint, body) as T);
    }
    const response = await fetch(`${this.options?.baseUrl || API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(this.options?.headers || {}) },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  }
}

// Registry and selection
let currentProvider: AIProvider = new BackendProvider();

export function setProvider(provider: AIProvider) {
  currentProvider = provider;
}

export function getProvider(): AIProvider {
  return currentProvider;
}

// Convenience wrappers (map common operations)
export const ai = {
  generateText: (data: { brandId: string; prompt: string }) =>
    currentProvider.post<{ generated_text: string }>('/generate/text', data).then(r => r.generated_text),
  generateSocialPost: (data: { brandId: string; platform: string; product: string; audience: string; tone: string }) =>
    currentProvider.post<string>('/generate/social-post', data),
  generateAdCopy: (data: { brandId: string; product: string; sellingPoints: string; tone: string }) =>
    currentProvider.post<string>('/generate/ad-copy', data),
  generateBlogIdeas: (data: { brandId: string; topic: string }) =>
    currentProvider.post<Array<{ title: string; outline: string }>>('/generate/blog-ideas', data),
  generateSEOKeywords: (data: { brandId: string; topic: string }) =>
    currentProvider.post<Array<{ keyword: string; volume?: number; difficulty?: number }>>('/generate/seo-keywords', data),
  generateEmailCampaign: (data: { brandId: string; goal: string; productInfo: string; tone: string }) =>
    currentProvider.post<{ subject: string; body: string }>('/generate/email-campaign', data),
  generateTags: (data: { content: string; type: string }) =>
    currentProvider.post<string[]>('/generate/tags', data),
};