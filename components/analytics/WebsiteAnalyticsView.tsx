
import React from 'react';
import Card from '../ui/Card';
import KpiCard from '../ui/KpiCard';
import ChartPlaceholder from '../ui/ChartPlaceholder';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { GlobeAltIcon, LinkIcon } from '../../constants';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';

interface WebsiteAnalyticsViewProps {
    data: { users: string, sessions: string, bounceRate: string };
}

const WebsiteAnalyticsView: React.FC<WebsiteAnalyticsViewProps> = ({ data }) => {
    const { currentBrand } = useCurrentBrand();

    if (!currentBrand?.integrations.find(i => i.id === 'googleAnalytics')?.connected) {
        return (
            <EmptyState
                icon={<LinkIcon />}
                title="Google Analytics Not Connected"
                message="Connect your Google Analytics account in the Integrations tab to see website traffic and performance data."
                // In a real app, this button would navigate to the integrations tab
                action={<Button>Go to Integrations</Button>}
            />
        );
    }
    
    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Users" value={data.users} icon={<GlobeAltIcon />} color="text-blue-500" />
                <KpiCard title="Sessions" value={data.sessions} icon={<GlobeAltIcon />} color="text-green-500" />
                <KpiCard title="Bounce Rate" value={data.bounceRate} icon={<GlobeAltIcon />} color="text-red-500" />
            </div>
             <Card>
                 <h3 className="text-lg font-bold text-brand-text mb-4">Traffic Over Time</h3>
                 <ChartPlaceholder />
             </Card>
        </div>
    );
};

export default WebsiteAnalyticsView;
