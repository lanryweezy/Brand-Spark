import React from 'react';
import Card from '../ui/Card';
import KpiCard from '../ui/KpiCard';
import { EnvelopeIcon } from '../../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const emailData = [
  { name: 'Week 1', openRate: 24, clickRate: 3.2 },
  { name: 'Week 2', openRate: 26, clickRate: 3.5 },
  { name: 'Week 3', openRate: 28, clickRate: 4.1 },
  { name: 'Week 4', openRate: 32, clickRate: 5.2 },
];

const EmailAnalyticsView = ({ data }: { data: any }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Subscribers" value={data.subscribers} icon={<EnvelopeIcon />} color="text-indigo-500" />
                <KpiCard title="Avg Open Rate" value={data.avgOpenRate} icon={<EnvelopeIcon />} color="text-blue-500" />
                <KpiCard title="Avg Click Rate" value={data.avgClickRate} icon={<EnvelopeIcon />} color="text-teal-500" />
            </div>
            <Card>
                <h3 className="text-lg font-bold text-brand-text mb-4">Engagement Trends</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={emailData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Line yAxisId="left" type="monotone" dataKey="openRate" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                            <Line yAxisId="right" type="monotone" dataKey="clickRate" stroke="#14b8a6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default EmailAnalyticsView;
