
import React, { useState } from 'react';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import WebsiteAnalyticsView from './analytics/WebsiteAnalyticsView';
import SocialAnalyticsView from './analytics/SocialAnalyticsView';
import EmailAnalyticsView from './analytics/EmailAnalyticsView';
import AdsAnalyticsView from './analytics/AdsAnalyticsView';
import Card from './ui/Card';
// Fix: Import geminiService for AI-powered analytics functions.
import * as geminiService from '../services/geminiService';
import { ChartBarIcon, DocumentArrowDownIcon } from '../constants';
import PageTitle from './ui/PageTitle';
import Tabs from './ui/Tabs';
import EmptyState from './ui/EmptyState';
import Input from './ui/Input';
import Button from './ui/Button';
import { useToast } from '../hooks/useToast';
import Modal from './ui/Modal';
import { marked } from 'marked';

// Mock data for analytics views to use. In a real app, this would be fetched from the backend.
const mockAnalyticsData = {
    website: { users: '12,408', sessions: '29,123', bounceRate: '42.5%' },
    social: {
        twitter: { followers: '1.2M', engagement: '2.3%' },
        instagram: { followers: '540k', engagement: '4.1%' },
        facebook: { followers: '89k', engagement: '1.8%' },
        linkedin: { followers: '15k', engagement: '5.6%' },
    },
    email: { subscribers: '34,812', avgOpenRate: '28.3%', avgClickRate: '4.1%' },
    ads: { impressions: '1.4M', clicks: '78,245', avgCtr: '5.58%', totalCost: '$22,150' }
};

const Analytics: React.FC = () => {
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [reportContent, setReportContent] = useState('');
    
    const handleGenerateReport = async () => {
        if (!currentBrand) return;
        setIsLoadingReport(true);
        setIsReportModalOpen(true);
        try {
            // Fix: Use geminiService to generate the full report.
            const report = await geminiService.generateFullReport({ brandId: currentBrand.id });
            const html = await marked.parse(report);
            setReportContent(html);
        } catch(e) {
            setReportContent('<p class="text-red-500">Failed to generate report.</p>');
        } finally {
            setIsLoadingReport(false);
        }
    };

    const AskYourData: React.FC = () => {
        const [question, setQuestion] = useState('');
        const [answer, setAnswer] = useState('');
        const [isLoading, setIsLoading] = useState(false);

        const handleAsk = async () => {
            if (!question || !currentBrand) return;
            setIsLoading(true);
            setAnswer('');
            try {
                // Fix: Use geminiService to answer data questions.
                const result = await geminiService.answerDataQuestion({ question, brandId: currentBrand.id });
                setAnswer(result);
            } catch (e) {
                setAnswer('Sorry, I could not answer that question.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
             <Card>
                <h3 className="text-xl font-bold text-brand-text">Ask Your Data</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">Ask a question in plain English about your marketing performance.</p>
                <div className="flex gap-2">
                    <Input label="" id="data-question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g., Which social platform has the best engagement?" />
                    <Button onClick={handleAsk} isLoading={isLoading}>Ask</Button>
                </div>
                { (isLoading || answer) && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                        {isLoading ? <p>Thinking...</p> : <p className="text-slate-700 whitespace-pre-wrap">{answer}</p>}
                    </div>
                )}
            </Card>
        )
    };
    
    // This component will now get mock data. Real integration would involve passing fetched data.
    const analyticsTabs = [
      { label: 'Website', content: <WebsiteAnalyticsView data={mockAnalyticsData.website} /> },
      { label: 'Social', content: <SocialAnalyticsView data={mockAnalyticsData.social} /> },
      { label: 'Email', content: <EmailAnalyticsView data={mockAnalyticsData.email} /> },
      { label: 'Ads', content: <AdsAnalyticsView data={mockAnalyticsData.ads} /> },
    ];

  return (
    <div>
        <PageTitle 
            title="Analytics & Intelligence"
            subtitle="Measure and optimize your marketing performance."
            actions={
                <Button onClick={handleGenerateReport} variant="secondary" isLoading={isLoadingReport && isReportModalOpen}>
                    <DocumentArrowDownIcon className="mr-2" /> Generate Full Report
                </Button>
            }
        />
        {currentBrand ? (
            <div className="space-y-8">
                <AskYourData />
                <Tabs tabs={analyticsTabs} />
            </div>
        ) : (
            <EmptyState
                icon={<ChartBarIcon/>}
                title="Select a Brand"
                message="Please select a brand to view its analytics dashboard."
            />
        )}
        
        {isReportModalOpen && (
            <Modal title="Internal Performance Report" onClose={() => setIsReportModalOpen(false)}>
                {isLoadingReport ? (
                    <div className="text-center p-12">Generating...</div>
                ) : (
                    <div className="prose prose-slate max-w-none max-h-[70vh] overflow-y-auto" dangerouslySetInnerHTML={{ __html: reportContent }} />
                )}
            </Modal>
        )}
    </div>
  );
};

export default Analytics;
