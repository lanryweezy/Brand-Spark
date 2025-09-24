
import React from 'react';
import Card from '../ui/Card';
import KpiCard from '../ui/KpiCard';
import ChartPlaceholder from '../ui/ChartPlaceholder';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { ChartBarIcon, LinkIcon } from '../../constants';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';

interface AdsAnalyticsViewProps {
    data: { impressions: string, clicks: string, avgCtr: string, totalCost: string };
}

const AdsAnalyticsView: React.FC<AdsAnalyticsViewProps> = ({ data }) => {
    const { currentBrand } = useCurrentBrand();

    if (!currentBrand?.integrations.find(i => i.id === 'googleAds')?.connected) {
        return (
             <EmptyState
                icon={<LinkIcon />}
                title="Google Ads Not Connected"
                message="Connect your Google Ads account in the Integrations tab to see campaign performance data."
                action={<Button>Go to Integrations</Button>}
            />
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Impressions" value={data.impressions} icon={<ChartBarIcon />} color="text-blue-500" />
                <KpiCard title="Clicks" value={data.clicks} icon={<ChartBarIcon />} color="text-green-500" />
                <KpiCard title="Avg. CTR" value={data.avgCtr} icon={<ChartBarIcon />} color="text-yellow-500" />
                <KpiCard title="Total Cost" value={data.totalCost} icon={<ChartBarIcon />} color="text-red-500" />
            </div>
             <Card>
                 <h3 className="text-lg font-bold text-brand-text mb-4">Cost vs. Clicks</h3>
                 <ChartPlaceholder />
             </Card>
        </div>
    );
};

export default AdsAnalyticsView;
