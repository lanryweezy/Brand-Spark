

import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Integration } from '../../types';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { 
    TwitterIcon, FacebookIcon, InstagramIcon, LinkedInIcon, GlobeAltIcon, GoogleAdsIcon, SparklesIcon,
    MailchimpIcon, SalesforceIcon, SlackIcon, HootsuiteIcon
} from '../../constants';
import Modal from '../ui/Modal';
import { useToast } from '../../hooks/useToast';

interface IntegrationCardProps {
    integration: Integration;
}

const icons: Record<Integration['id'], React.ReactNode> = {
    googleAnalytics: <GlobeAltIcon className="w-8 h-8 text-orange-500" />,
    googleAds: <GoogleAdsIcon className="w-8 h-8" />,
    twitter: <TwitterIcon className="w-8 h-8 text-[#1DA1F2]" />,
    facebook: <FacebookIcon className="w-8 h-8 text-[#1877F2]" />,
    instagram: <InstagramIcon className="w-8 h-8 text-[#E4405F]" />,
    linkedin: <LinkedInIcon className="w-8 h-8 text-[#0A66C2]" />,
    wordpress: <svg className="w-8 h-8 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 16.5L4 12l4.5-4.5L11 12l-2.5 4.5zM15.5 16.5L11 12l2.5-4.5L18 12l-2.5 4.5z"/></svg>,
    shopify: <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.43 14H7.57a1.5 1.5 0 0 1-1.5-1.5v-5a1.5 1.5 0 0 1 1.5-1.5h8.86a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5z"/></svg>,
    mailchimp: <MailchimpIcon />,
    salesforce: <SalesforceIcon />,
    slack: <SlackIcon />,
    hootsuite: <HootsuiteIcon />,
};

const unlockedFeatures: Record<Integration['id'], string[]> = {
    googleAnalytics: ["Website Traffic Analysis", "Audience Demographics"],
    googleAds: ["Ad Campaign Performance", "Cost Per Click Tracking"],
    twitter: ["Follower Growth", "Tweet Engagement"],
    facebook: ["Page Likes", "Post Reach & Engagement"],
    instagram: ["Follower Demographics", "Story Views", "Post Interactions"],
    linkedin: ["Company Page Analytics", "Content Engagement"],
    wordpress: ["Publish Content Directly", "Track Post Performance"],
    shopify: ["Sales Data Sync", "Abandoned Cart Automation"],
    mailchimp: ["Sync Audiences", "Email Campaign Automations"],
    salesforce: ["Sync Leads & Contacts", "Track Campaign ROI in CRM"],
    slack: ["Send Notifications to Channels", "Team Collaboration on Assets"],
    hootsuite: ["Schedule Posts in Bulk", "Monitor Social Mentions"],
};


const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration }) => {
    const { currentBrand, updateBrandIntegration } = useCurrentBrand();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [liveData, setLiveData] = useState<string | number>('');

    useEffect(() => {
        // Fix: Use 'number' for setInterval return type in browser environments instead of 'NodeJS.Timeout'.
        let interval: number | null = null;
        if (integration.connected) {
            const updateData = () => {
                switch(integration.id) {
                    case 'googleAnalytics': setLiveData(Math.floor(Math.random() * 100) + 10); break;
                    case 'shopify': setLiveData(`$${(Math.random() * 500 + 200).toFixed(2)}`); break;
                    default: setLiveData('');
                }
            }
            updateData();
            interval = setInterval(updateData, 5000);
        }
        return () => {
            if(interval) clearInterval(interval);
        }
    }, [integration.connected, integration.id]);

    const handleConnect = () => {
        setIsModalOpen(true);
    };

    const handleDisconnect = () => {
        if (currentBrand && window.confirm(`Are you sure you want to disconnect ${integration.name}?`)) {
            updateBrandIntegration(currentBrand.id, integration.id, false);
            addToast(`${integration.name} disconnected.`, 'info');
        }
    };

    const handleConfirmConnect = () => {
        if (!currentBrand) return;
        setIsConnecting(true);
        setTimeout(() => {
            updateBrandIntegration(currentBrand.id, integration.id, true);
            setIsConnecting(false);
            setIsModalOpen(false);
            addToast(`${integration.name} connected successfully!`, 'success');
        }, 1500);
    };

    return (
        <>
            <Card className="flex flex-col">
                <div className="flex-grow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            {icons[integration.id]}
                            <div className="ml-4">
                                <h3 className="font-bold text-lg text-brand-text">{integration.name}</h3>
                            </div>
                        </div>
                         <div className={`px-2.5 py-1 text-xs font-bold rounded-full ${integration.connected ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'}`}>
                            {integration.connected ? 'Connected' : 'Not Connected'}
                        </div>
                    </div>
                    {integration.connected ? (
                        <div className="space-y-3">
                            {liveData && (
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase">
                                        {integration.id === 'googleAnalytics' ? 'Live Users' : "Today's Sales"}
                                    </span>
                                    <p className="text-2xl font-bold text-brand-text">{liveData}</p>
                                </div>
                            )}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-600 mb-1">Unlocked Features:</h4>
                                <ul className="list-disc list-inside text-sm text-slate-500 space-y-0.5">
                                    {unlockedFeatures[integration.id].map(feat => <li key={feat}>{feat}</li>)}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 min-h-[80px]">Connect to sync data and unlock automation features for {integration.name}.</p>
                    )}
                </div>
                <div className="mt-4 pt-4 border-t">
                    <Button 
                        onClick={integration.connected ? handleDisconnect : handleConnect} 
                        variant={integration.connected ? 'secondary' : 'primary'}
                        className="w-full"
                        disabled={!currentBrand}
                    >
                        {integration.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                </div>
            </Card>

            {isModalOpen && (
                 <Modal title={`Connect to ${integration.name}`} onClose={() => setIsModalOpen(false)}>
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                           {icons[integration.id]}
                        </div>
                        <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">Permission Request</h3>
                        <div className="mt-2 px-7 py-3">
                            <p className="text-sm text-gray-500">
                                BrandSpark AI Studio is requesting permission to access your {integration.name} data.
                            </p>
                        </div>
                        <div className="items-center px-4 py-3">
                            <div className="flex justify-center gap-4">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isConnecting}>
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmConnect} isLoading={isConnecting}>
                                    {isConnecting ? 'Connecting...' : 'Allow Access'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default IntegrationCard;
