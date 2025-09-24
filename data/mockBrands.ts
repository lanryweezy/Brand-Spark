import { BrandProfile, ToneOfVoice, Competitor, Integration } from '../types';

const allIntegrations: Omit<Integration, 'connected'>[] = [
    { id: 'googleAnalytics', name: 'Google Analytics', category: 'Analytics' },
    { id: 'googleAds', name: 'Google Ads', category: 'Ads' },
    { id: 'twitter', name: 'Twitter / X', category: 'Social' },
    { id: 'facebook', name: 'Facebook', category: 'Social' },
    { id: 'instagram', name: 'Instagram', category: 'Social' },
    { id: 'linkedin', name: 'LinkedIn', category: 'Social' },
    { id: 'wordpress', name: 'WordPress', category: 'Publishing' },
    { id: 'shopify', name: 'Shopify', category: 'Commerce' },
    { id: 'mailchimp', name: 'Mailchimp', category: 'Email' },
    { id: 'salesforce', name: 'Salesforce', category: 'CRM' },
    { id: 'slack', name: 'Slack', category: 'Communication' },
    { id: 'hootsuite', name: 'Hootsuite', category: 'Social' },
];

const mockCompetitors1: Competitor[] = [
    { id: 'comp-1', name: 'FutureScape Inc.', website: 'futurescape.com', analysis: 'Strong focus on B2B enterprise clients. Weak social media presence.' },
    { id: 'comp-2', name: 'Innovate Solutions', website: 'innovatesolutions.com', analysis: 'Aggressive ad spend on LinkedIn. Recently launched a popular podcast.' },
];

const mockCompetitors2: Competitor[] = [
    { id: 'comp-3', name: 'EcoLiving Co.', website: 'ecoliving.com', analysis: 'Dominates Pinterest and Instagram with visual content. Strong brand loyalty.' },
    { id: 'comp-4', name: 'GreenCart', website: 'greencart.com', analysis: 'Heavily reliant on influencer marketing. Runs frequent sales promotions.' },
];

export const MOCK_BRANDS: BrandProfile[] = [
    {
        id: 'brand-1',
        name: 'QuantumLeap Tech',
        logo: 'https://i.picsum.photos/id/1079/100/100.jpg',
        secondaryLogo: 'https://i.picsum.photos/id/1079/50/50.jpg',
        website: 'https://quantumleap.tech',
        description: 'Pioneering the future of AI-driven business intelligence solutions.',
        audience: 'Enterprise-level executives and tech enthusiasts',
        baseTone: ToneOfVoice.Professional,
        messagingPillars: ['Innovation', 'Efficiency', 'Security'],
        dos: ['Use data-driven language', 'Focus on ROI', 'Be forward-thinking'],
        donts: ['Use slang or overly casual terms', 'Overpromise on capabilities', 'Ignore data privacy'],
        colors: { primary: '#5c22d9', secondary: '#1f2937' },
        fonts: { primary: 'Inter', secondary: 'Roboto Slab' },
        approvedImages: ['https://picsum.photos/seed/tech1/400/300', 'https://picsum.photos/seed/tech2/400/300'],
        mission: 'To empower businesses with actionable insights through cutting-edge artificial intelligence.',
        values: ['Integrity', 'Innovation', 'Customer Success'],
        competitors: mockCompetitors1,
        integrations: allIntegrations.map(i => ({ ...i, connected: ['googleAnalytics', 'linkedin', 'twitter', 'salesforce'].includes(i.id) })),
    },
    {
        id: 'brand-2',
        name: 'Evergreen Goods',
        logo: 'https://i.picsum.photos/id/1015/100/100.jpg',
        secondaryLogo: 'https://i.picsum.photos/id/1015/50/50.jpg',
        website: 'https://evergreengoods.com',
        description: 'Sustainable and ethically sourced products for a conscious lifestyle.',
        audience: 'Eco-conscious millennials and families',
        baseTone: ToneOfVoice.Casual,
        messagingPillars: ['Sustainability', 'Quality', 'Community'],
        dos: ['Be authentic and transparent', 'Use warm, inviting language', 'Highlight eco-friendly aspects'],
        donts: ['Greenwashing', 'Use corporate jargon', 'Be preachy'],
        colors: { primary: '#10b981', secondary: '#475569' },
        fonts: { primary: 'Poppins', secondary: 'Lora' },
        approvedImages: ['https://picsum.photos/seed/eco1/400/300', 'https://picsum.photos/seed/eco2/400/300'],
        mission: 'To make sustainable living beautiful, accessible, and affordable for everyone.',
        values: ['Ethical Sourcing', 'Environmental Stewardship', 'Community'],
        competitors: mockCompetitors2,
        integrations: allIntegrations.map(i => ({ ...i, connected: ['instagram', 'facebook', 'shopify', 'mailchimp'].includes(i.id) })),
    },
];
