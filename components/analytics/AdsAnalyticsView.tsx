import React from 'react';
import Card from '../ui/Card';
import KpiCard from '../ui/KpiCard';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { ChartBarIcon, LinkIcon } from '../../constants';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const adsData = [
  { name: 'Mon', impressions: 4000, clicks: 240 },
  { name: 'Tue', impressions: 3000, clicks: 139 },
  { name: 'Wed', impressions: 2000, clicks: 980 },
  { name: 'Thu', impressions: 2780, clicks: 390 },
  { name: 'Fri', impressions: 1890, clicks: 480 },
  { name: 'Sat', impressions: 2390, clicks: 380 },
  { name: 'Sun', impressions: 3490, clicks: 430 },
];

const AdsAnalyticsView = ({ data }: { data: any }) => {
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Impressions" value={data.impressions} icon={<ChartBarIcon />} color="text-purple-500" />
                <KpiCard title="Clicks" value={data.clicks} icon={<ChartBarIcon />} color="text-blue-500" />
                <KpiCard title="Avg CTR" value={data.avgCtr} icon={<ChartBarIcon />} color="text-green-500" />
                <KpiCard title="Total Cost" value={data.totalCost} icon={<ChartBarIcon />} color="text-red-500" />
            </div>
             <Card>
                 <h3 className="text-lg font-bold text-brand-text mb-4">Ad Performance (7 Days)</h3>
                 <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={adsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          <Area type="monotone" dataKey="impressions" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorImpressions)" />
                        </AreaChart>
                     </ResponsiveContainer>
                 </div>
             </Card>
        </div>
    );
};

export default AdsAnalyticsView;
