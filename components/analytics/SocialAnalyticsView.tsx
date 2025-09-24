
import React from 'react';
import Card from '../ui/Card';
import KpiCard from '../ui/KpiCard';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { TwitterIcon, InstagramIcon, FacebookIcon, LinkedInIcon, LinkIcon } from '../../constants';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';

interface SocialAnalyticsViewProps {
    data: any;
}

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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {connectedSocials.map(social => {
                    const platformData = data[social.id as keyof typeof data];
                    if (!platformData) return null;
                    
                    return (
                        <Card key={social.id}>
                            <div className="flex items-center mb-4">
                                <div className="text-gray-600">
                                {platformIcons[social.id]}
                                </div>
                                <h3 className="ml-3 text-xl font-bold text-brand-text">{social.name}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <KpiCard title="Followers" value={platformData.followers} icon={<></>} color="text-gray-500" />
                                <KpiCard title="Engagement" value={platformData.engagement} icon={<></>} color="text-gray-500" />
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default SocialAnalyticsView;
