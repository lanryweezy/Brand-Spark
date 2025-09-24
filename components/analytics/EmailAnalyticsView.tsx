
import React from 'react';
import Card from '../ui/Card';
import KpiCard from '../ui/KpiCard';
import ChartPlaceholder from '../ui/ChartPlaceholder';
import { EnvelopeIcon } from '../../constants';

interface EmailAnalyticsViewProps {
    data: { subscribers: string, avgOpenRate: string, avgClickRate: string };
}

const EmailAnalyticsView: React.FC<EmailAnalyticsViewProps> = ({ data }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Subscribers" value={data.subscribers} icon={<EnvelopeIcon />} color="text-purple-500" />
                <KpiCard title="Avg Open Rate" value={data.avgOpenRate} icon={<EnvelopeIcon />} color="text-orange-500" />
                <KpiCard title="Avg Click Rate" value={data.avgClickRate} icon={<EnvelopeIcon />} color="text-teal-500" />
            </div>
             <Card>
                <h3 className="text-lg font-bold text-brand-text mb-4">Campaign Performance</h3>
                <ChartPlaceholder />
             </Card>
        </div>
    );
};

export default EmailAnalyticsView;
