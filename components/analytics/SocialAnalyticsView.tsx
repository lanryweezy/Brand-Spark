import React from 'react';
import Card from '../ui/Card';
import KpiCard from '../ui/KpiCard';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { TwitterIcon, InstagramIcon, FacebookIcon, LinkedInIcon, LinkIcon } from '../../constants';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SocialAnalyticsViewProps {
    data: any;
}

const engagementData = [
  { name: 'Twitter', followers: 1200000, engagement: 23000 },
  { name: 'Instagram', followers: 540000, engagement: 41000 },
  { name: 'Facebook', followers: 89000, engagement: 1800 },
  { name: 'LinkedIn', followers: 15000, engagement: 5600 },
];

const SocialAnalyticsView: React.FC<SocialAnalyticsViewProps> = ({ data }) => {
    const { currentBrand } = useCurrentBrand();
    const connectedSocials = currentBrand?.integrations.filter(i => i.category === 'Social' && i.connected) || [];

    const platformIcons: Record<string, React.ReactNode> = {
        twitter: <TwitterIcon />,
        instagram: <InstagramIcon />,
        facebook: <FacebookIcon />,
        linkedin: <LinkedInIcon />,
    };
    
    if (connectedSocials.length === 0) {
        return (
            <EmptyState
                icon={<LinkIcon />}
                title="No Social Accounts Connected"
                message="Connect your social media accounts in the Integrations tab to see your performance data."
                action={<Button>Go to Integrations</Button>}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {connectedSocials.map(social => {
                    const platformData = data[social.id as keyof typeof data];
                    if (!platformData) return null;
                    return (
                        <KpiCard
                            key={social.id}
                            title={`${social.name} Followers`}
                            value={platformData.followers}
                            icon={platformIcons[social.id]}
                            color="text-slate-700 dark:text-slate-200"
                        />
                    );
                })}
            </div>
            <Card>
                <h3 className="text-lg font-bold text-brand-text mb-4">Platform Comparison</h3>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={engagementData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                            <YAxis yAxisId="left" orientation="left" stroke="#5c22d9" axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="followers" fill="#5c22d9" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar yAxisId="right" dataKey="engagement" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default SocialAnalyticsView;
