
import React, { useMemo, useState, useEffect } from 'react';
import Card from './ui/Card';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import IntegrationCard from './integrations/IntegrationCard';
import { LinkIcon, LightBulbIcon } from '../constants';
import { Integration } from '../types';
import PageTitle from './ui/PageTitle';
import EmptyState from './ui/EmptyState';
// Fix: Import geminiService for AI-powered insights.
import * as geminiService from '../services/geminiService';

const AIIntegrationInsights: React.FC = () => {
    const { currentBrand } = useCurrentBrand();
    const [insight, setInsight] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentBrand?.integrations) {
            setIsLoading(true);
            // Fix: Use geminiService to generate integration insights.
            geminiService.generateIntegrationInsights({ brandId: currentBrand.id, integrations: currentBrand.integrations })
                .then(setInsight)
                .catch(err => {
                    console.error(err);
                    setInsight("Could not load insights at this time.");
                })
                .finally(() => setIsLoading(false));
        }
    }, [currentBrand]);

    return (
        <Card>
            <h3 className="text-xl font-bold text-brand-text mb-4">AI Integration Insights</h3>
            {isLoading ? (
                <p className="text-slate-500">Generating insights based on your connections...</p>
            ) : (
                <div className="bg-brand-primary-light p-4 rounded-lg flex items-start gap-3">
                    <LightBulbIcon className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1"/>
                    <p className="text-sm text-slate-700">{insight}</p>
                </div>
            )}
        </Card>
    )
}

const Integrations: React.FC = () => {
    const { currentBrand } = useCurrentBrand();

    const integrationsByCategory = useMemo(() => {
        if (!currentBrand) return {};
        return (currentBrand.integrations || []).reduce((acc, integration) => {
            const category = integration.category || 'Other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(integration);
            return acc;
        }, {} as Record<string, Integration[]>);
    }, [currentBrand]);

    return (
         <div>
            <PageTitle
                title="Integrations Hub"
                subtitle="Connect your marketing tools to unlock new capabilities."
            />
            
            {!currentBrand ? (
                <EmptyState
                    icon={<LinkIcon />}
                    title="Select a Brand"
                    message="Please select a brand to manage its integrations."
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {Object.entries(integrationsByCategory).map(([category, integrations]) => (
                            <div key={category}>
                                <h3 className="text-2xl font-bold text-brand-text mb-4">{category}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {integrations.map(integration => (
                                        <IntegrationCard key={integration.id} integration={integration} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="lg:col-span-1">
                        <AIIntegrationInsights />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Integrations;
