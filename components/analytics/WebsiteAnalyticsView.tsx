import React from 'react';
import Card from '../ui/Card';
import KpiCard from '../ui/KpiCard';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { GlobeAltIcon, LinkIcon } from '../../constants';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WebsiteAnalyticsViewProps {
    data: { users: string, sessions: string, bounceRate: string };
}

const chartData = [
  { name: 'Jan', users: 4000, sessions: 2400 },
  { name: 'Feb', users: 3000, sessions: 1398 },
  { name: 'Mar', users: 2000, sessions: 9800 },
  { name: 'Apr', users: 2780, sessions: 3908 },
  { name: 'May', users: 1890, sessions: 4800 },
  { name: 'Jun', users: 2390, sessions: 3800 },
  { name: 'Jul', users: 3490, sessions: 4300 },
];

const WebsiteAnalyticsView: React.FC<WebsiteAnalyticsViewProps> = ({ data }) => {
    const { currentBrand } = useCurrentBrand();

    if (!currentBrand?.integrations.find(i => i.id === 'googleAnalytics')?.connected) {
        return (
            <EmptyState
                icon={<LinkIcon />}
                title="Google Analytics Not Connected"
                message="Connect your Google Analytics account in the Integrations tab to see website traffic and performance data."
                action={<Button>Go to Integrations</Button>}
            />
        );
    }
    
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Users" value={data.users} icon={<GlobeAltIcon />} color="text-blue-500" />
                <KpiCard title="Sessions" value={data.sessions} icon={<GlobeAltIcon />} color="text-green-500" />
                <KpiCard title="Bounce Rate" value={data.bounceRate} icon={<GlobeAltIcon />} color="text-red-500" />
            </div>
             <Card>
                 <h3 className="text-lg font-bold text-brand-text mb-4">Traffic Over Time</h3>
                 <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#5c22d9" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#5c22d9" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                          <Tooltip
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="users" stroke="#5c22d9" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                          <Area type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
                        </AreaChart>
                     </ResponsiveContainer>
                 </div>
             </Card>
        </div>
    );
};

export default WebsiteAnalyticsView;
