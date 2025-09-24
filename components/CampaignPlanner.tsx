
import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useCampaigns } from '../hooks/useCampaigns';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import { Campaign, Asset } from '../types';
import { PlusIcon, TrashIcon, PencilIcon, RocketLaunchIcon, LightBulbIcon } from '../constants';
import { useAssets } from '../hooks/useAssets';
import PageTitle from './ui/PageTitle';
import EmptyState from './ui/EmptyState';
import { useToast } from '../hooks/useToast';
import * as geminiService from '../services/geminiService';
import Tabs from './ui/Tabs';

const CampaignFormModal: React.FC<{
    campaign: Campaign | null;
    onClose: () => void;
}> = ({ campaign, onClose }) => {
    const { addCampaign, updateCampaign } = useCampaigns();
    const { currentBrand } = useCurrentBrand();
    const { brandAssets } = useAssets();
    const { addToast } = useToast();

    const [name, setName] = useState(campaign?.name || '');
    const [description, setDescription] = useState(campaign?.description || '');
    const [startDate, setStartDate] = useState(campaign?.startDate || '');
    const [endDate, setEndDate] = useState(campaign?.endDate || '');
    const [status, setStatus] = useState<'Planning' | 'Active' | 'Completed' | 'Archived'>(campaign?.status || 'Planning');
    const [budget, setBudget] = useState(campaign?.budget || 0);
    const [kpis, setKpis] = useState(campaign?.kpis || []);
    const [linkedAssetIds, setLinkedAssetIds] = useState(campaign?.linkedAssetIds || []);
    
    const [aiGoal, setAiGoal] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateBrief = async () => {
        if (!currentBrand || !aiGoal) {
            addToast('Please provide a goal for the AI.', 'error');
            return;
        }
        setIsGenerating(true);
        try {
            const brief = await geminiService.generateCampaignBrief({ brandId: currentBrand.id, goal: aiGoal });
            setName(brief.name);
            setDescription(brief.description);
            setKpis(brief.kpis.map(k => ({ ...k, actual: 0 })));
            addToast('Campaign brief generated!', 'success');
        } catch (error) {
            addToast('Failed to generate brief. Please try again.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleKpiChange = (index: number, field: 'name' | 'target' | 'actual', value: string | number) => {
        const newKpis = [...kpis];
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        newKpis[index] = { ...newKpis[index], [field]: field === 'name' ? value : numValue };
        setKpis(newKpis);
    };
    const addKpi = () => setKpis([...kpis, { name: '', target: 0, actual: 0 }]);
    const removeKpi = (index: number) => setKpis(kpis.filter((_, i) => i !== index));

    const handleAssetToggle = (assetId: string) => {
        setLinkedAssetIds(prev => prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBrand) return;
        const campaignData = { brandId: currentBrand.id, name, description, startDate, endDate, status, budget, kpis, linkedAssetIds };
        
        try {
            if (campaign) {
                await updateCampaign(campaign.id, campaignData);
                addToast('Campaign updated!', 'success');
            } else {
                await addCampaign(campaignData);
                addToast('Campaign created!', 'success');
            }
            onClose();
        } catch(error) {
            addToast(`Error saving campaign: ${error}`, 'error');
        }
    };

    const TABS = [
        {
            label: 'Details',
            content: (
                <div className="space-y-4">
                     <div className="p-4 bg-brand-primary-light rounded-lg space-y-3">
                         <h4 className="font-bold text-brand-primary">Generate with AI</h4>
                         <Textarea id="ai-goal" label="Campaign Goal" value={aiGoal} onChange={e => setAiGoal(e.target.value)} placeholder="e.g., Increase brand awareness among young professionals for our new product." />
                         <Button type="button" onClick={handleGenerateBrief} isLoading={isGenerating}>
                             <LightBulbIcon className="mr-2"/>
                             {isGenerating ? 'Generating...' : 'Generate Brief'}
                         </Button>
                     </div>
                    <Input id="name" label="Campaign Name" value={name} onChange={e => setName(e.target.value)} required />
                    <Textarea id="description" label="Description" value={description} onChange={e => setDescription(e.target.value)} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input id="startDate" label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        <Input id="endDate" label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select id="status" label="Status" value={status} onChange={e => setStatus(e.target.value as any)}>
                            <option value="Planning">Planning</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Archived">Archived</option>
                        </Select>
                        <Input id="budget" label="Budget ($)" type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} />
                    </div>
                </div>
            )
        },
        {
            label: `KPIs (${kpis.length})`,
            content: (
                <div className="space-y-3">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                            <Input label="" id={`kpi-name-${index}`} value={kpi.name} onChange={e => handleKpiChange(index, 'name', e.target.value)} placeholder="KPI Name (e.g., Sign-ups)" className="flex-grow" />
                            <Input label="" id={`kpi-target-${index}`} type="number" value={kpi.target} onChange={e => handleKpiChange(index, 'target', e.target.value)} placeholder="Target" />
                            <Button variant="ghost" size="sm" onClick={() => removeKpi(index)}><TrashIcon/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" onClick={addKpi}><PlusIcon/> Add KPI</Button>
                </div>
            )
        },
        {
            label: `Assets (${linkedAssetIds.length})`,
            content: (
                 <div className="space-y-2 max-h-64 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                    {brandAssets.length > 0 ? brandAssets.map(asset => (
                        <div key={asset.id} className="flex items-center p-2 rounded hover:bg-slate-100">
                            <input
                                type="checkbox"
                                id={`asset-${asset.id}`}
                                checked={linkedAssetIds.includes(asset.id)}
                                onChange={() => handleAssetToggle(asset.id)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                            />
                            <label htmlFor={`asset-${asset.id}`} className="ml-3 text-sm text-slate-700">{asset.name}</label>
                        </div>
                    )) : <p className="text-sm text-slate-500 text-center py-2">No assets found in repository.</p>}
                </div>
            )
        },
    ];

    return (
        <Modal title={campaign ? 'Edit Campaign' : 'Create New Campaign'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <Tabs tabs={TABS} />
                <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{campaign ? 'Save Changes' : 'Create Campaign'}</Button>
                </div>
            </form>
        </Modal>
    )
};


const CampaignCard: React.FC<{ campaign: Campaign, onEdit: () => void, onDelete: () => void }> = ({ campaign, onEdit, onDelete }) => {
    const { brandAssets } = useAssets();
    const { updateCampaign } = useCampaigns();

    const handleKpiActualChange = async (kpiName: string, newActual: number) => {
        const updatedKpis = campaign.kpis.map(kpi => 
            kpi.name === kpiName ? { ...kpi, actual: newActual } : kpi
        );
        await updateCampaign(campaign.id, { kpis: updatedKpis });
    };

    const linkedAssets = brandAssets.filter(asset => campaign.linkedAssetIds?.includes(asset.id));

    return (
        <Card className="flex flex-col">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-brand-text flex-1 pr-2">{campaign.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        {'Planning': 'bg-blue-100 text-blue-800', 'Active': 'bg-green-100 text-green-800', 'Completed': 'bg-slate-200 text-slate-800', 'Archived': 'bg-red-100 text-red-800'}[campaign.status]
                    }`}>{campaign.status}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</p>
                <p className="text-slate-600 mt-4 text-sm">{campaign.description}</p>
                
                <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm mb-2">Key Performance Indicators</h4>
                    {campaign.kpis.length > 0 ? (
                        <ul className="text-sm text-slate-600 space-y-3">
                        {campaign.kpis.map(kpi => {
                            const progress = kpi.target > 0 ? (kpi.actual / kpi.target) * 100 : 0;
                            return (
                                <li key={kpi.name}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">{kpi.name}</span>
                                        <div>
                                            <input type="number" defaultValue={kpi.actual} onBlur={(e) => handleKpiActualChange(kpi.name, Number(e.target.value))} className="w-20 text-right p-1 rounded bg-slate-100 focus:ring-brand-primary focus:border-brand-primary" />
                                            <span className="text-slate-500"> / {kpi.target}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                    </div>
                                </li>
                            )
                        })}
                        </ul>
                    ) : <p className="text-sm text-slate-500 mt-2">No KPIs defined.</p>}
                </div>
                {linkedAssets.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-2">Linked Assets</h4>
                        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                            {linkedAssets.map(asset => <li key={asset.id} className="truncate">{asset.name}</li>)}
                        </ul>
                    </div>
                )}
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button size="sm" variant="ghost" onClick={onDelete}><TrashIcon/></Button>
                <Button size="sm" variant="secondary" onClick={onEdit}><PencilIcon className="mr-2"/> Edit</Button>
            </div>
        </Card>
    );
};


const CampaignPlanner: React.FC = () => {
    const { brandCampaigns, deleteCampaign } = useCampaigns();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    const openModal = (campaign: Campaign | null = null) => {
        setEditingCampaign(campaign);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCampaign(null);
    };

    const handleDelete = async (campaignId: string) => {
        if(window.confirm('Are you sure you want to delete this campaign?')) {
            await deleteCampaign(campaignId);
            addToast('Campaign deleted.', 'info');
        }
    }
    
    return (
        <div>
            <PageTitle
                title="Campaign Planner"
                subtitle="Strategize and organize your marketing initiatives."
                actions={
                    <Button onClick={() => openModal()} disabled={!currentBrand}>
                        <PlusIcon className="-ml-1 mr-2" />
                        New Campaign
                    </Button>
                }
            />

            {currentBrand ? (
                 brandCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {brandCampaigns.map(campaign => (
                            <CampaignCard 
                                key={campaign.id} 
                                campaign={campaign}
                                onEdit={() => openModal(campaign)}
                                onDelete={() => handleDelete(campaign.id)}
                            />
                        ))}
                    </div>
                 ) : (
                    <EmptyState
                        icon={<RocketLaunchIcon />}
                        title="No Campaigns Yet"
                        message="Get started by creating your first marketing campaign to organize your initiatives."
                        action={<Button onClick={() => openModal()}>Create First Campaign</Button>}
                    />
                 )
            ) : (
                 <EmptyState
                    icon={<RocketLaunchIcon />}
                    title="Select a Brand"
                    message="Please select a brand to start planning and managing its campaigns."
                />
            )}

            {isModalOpen && (
                <CampaignFormModal campaign={editingCampaign} onClose={closeModal} />
            )}
        </div>
    );
};

export default CampaignPlanner;
