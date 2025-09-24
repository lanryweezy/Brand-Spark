
import React from 'react';
import SocialPostGenerator from './studio/SocialPostGenerator';
import AdCopyGenerator from './studio/AdCopyGenerator';
import BlogIdeaGenerator from './studio/BlogIdeaGenerator';
import ImageGenerator from './studio/ImageGenerator';
import EmailCampaignGenerator from './studio/EmailCampaignGenerator';
import SEOKeywordGenerator from './studio/SEOKeywordGenerator';
import PageTitle from './ui/PageTitle';
import Tabs from './ui/Tabs';
import RepurposeContentGenerator from './studio/RepurposeContentGenerator';

const AIStudio: React.FC = () => {
    const aiTools = [
        { label: 'Social Post', content: <SocialPostGenerator /> },
        { label: 'Ad Copy', content: <AdCopyGenerator /> },
        { label: 'Email Campaign', content: <EmailCampaignGenerator /> },
        { label: 'SEO Keywords', content: <SEOKeywordGenerator /> },
        { label: 'Blog Ideas', content: <BlogIdeaGenerator /> },
        { label: 'Image Gen', content: <ImageGenerator /> },
        { label: 'Repurpose', content: <RepurposeContentGenerator /> },
    ];

    return (
        <div>
            <PageTitle 
                title="AI Studio"
                subtitle="Your creative partner for marketing content. Choose a tool to begin."
            />
            <Tabs tabs={aiTools} />
        </div>
    );
};

export default AIStudio;
