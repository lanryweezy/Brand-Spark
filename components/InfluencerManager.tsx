import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { useInfluencers } from '../hooks/useInfluencers';
import { Influencer } from '../types';
import Button from './ui/Button';
import { PlusIcon, TagIcon, UserGroupIcon, TwitterIcon, InstagramIcon, TrashIcon, PencilIcon, LightBulbIcon } from '../constants';
import PageTitle from './ui/PageTitle';
import EmptyState from './ui/EmptyState';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import { useToast } from '../hooks/useToast';
import * as geminiService from '../services/geminiService';
import Textarea from './ui/Textarea';
import { motion } from 'framer-motion';
import OutreachModal from './OutreachModal';

const platformIcons: Record<Influencer['platform'], React.ReactNode> = {
    'Instagram': <InstagramIcon className="w-5 h-5" />,
    'TikTok': <UserGroupIcon className="w-5 h-5" />, // Placeholder
    'YouTube': <UserGroupIcon className="w-5 h-5" />, // Placeholder
    'Twitter/X': <TwitterIcon className="w-5 h-5" />,
};

const formatFollowers = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
};

const InfluencerCard: React.FC<{ influencer: Influencer, onEdit: () => void, onDelete: () => void, onOutreach: () => void }> = ({ influencer, onEdit, onDelete, onOutreach }) => (
    <Card className="flex flex-col justify-between h-full">
        <div>
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <img src={influencer.avatarUrl} alt={influencer.name} className="w-16 h-16 rounded-full" />
                    <div>
                        <h3 className="text-lg font-bold text-brand-text">{influencer.name}</h3>
                        <p className="text-sm text-gray-500">{influencer.handle}</p>
                    </div>
                </div>
                 <div className="text-gray-600">{platformIcons[influencer.platform]}</div>
            </div>
            <div className="mt-4 flex justify-around text-center">
                <div>
                    <p className="text-xl font-bold">{formatFollowers(influencer.followers)}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div>
                    <p className="text-xl font-bold">{influencer.engagementRate}%</p>
                    <p className="text-xs text-gray-500">Eng. Rate</p>
                </div>
            </div>
            {influencer.aiAnalysis && (
                <div className="mt-4 pt-4 border-t bg-brand-primary-light p-3 rounded-lg">
                    <h4 className="font-bold text-brand-primary text-sm mb-1">AI Analysis</h4>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap">{influencer.aiAnalysis}</p>
                </div>
            )}
        </div>
        <div className="flex justify-end gap-1 mt-4 pt-4 border-t">
            <Button size="sm" variant="ghost" onClick={onDelete}><TrashIcon /></Button>
            <Button size="sm" variant="ghost" onClick={onEdit}><PencilIcon /></Button>
            <Button size="sm" variant="secondary" onClick={onOutreach}>Outreach</Button>
        </div>
    </Card>
);

const InfluencerFormModal: React.FC<{ influencer: Influencer | null, onClose: () => void }> = ({ influencer, onClose }) => {
    const { addInfluencer, updateInfluencer } = useInfluencers();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();
    const [isVetting, setIsVetting] = useState(false);

    const [formState, setFormState] = useState({
        name: influencer?.name || '',
        handle: influencer?.handle || '',
        platform: influencer?.platform || 'Instagram',
        followers: influencer?.followers || 0,
        engagementRate: influencer?.engagementRate || 0,
        tags: influencer?.tags?.join(', ') || '',
        aiAnalysis: influencer?.aiAnalysis || null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleVetInfluencer = async () => {
        if (!currentBrand || !formState.handle) {
            addToast('Please enter a handle to vet.', 'error');
            return;
        }
        setIsVetting(true);
        try {
            const analysis = await geminiService.vetInfluencer({ brandId: currentBrand.id, handle: formState.handle });
            setFormState(prev => ({ ...prev, aiAnalysis: analysis }));
            addToast('AI analysis complete!', 'success');
        } catch (error) {
            addToast('Failed to get AI analysis.', 'error');
        } finally {
            setIsVetting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBrand) return;

        const influencerData = {
            brandId: currentBrand.id,
            name: formState.name,
            handle: formState.handle,
            platform: formState.platform as Influencer['platform'],
            followers: Number(formState.followers),
            engagementRate: Number(formState.engagementRate),
            tags: formState.tags.split(',').map(t => t.trim()).filter(Boolean),
            avatarUrl: influencer?.avatarUrl || `https://i.pravatar.cc/150?u=${formState.handle}`,
            aiAnalysis: formState.aiAnalysis,
        };

        try {
            if (influencer) {
                await updateInfluencer(influencer.id, influencerData);
                addToast('Influencer updated!', 'success');
            } else {
                await addInfluencer(influencerData);
                addToast('Influencer added!', 'success');
            }
            onClose();
        } catch (error) {
            addToast(`Error saving influencer: ${error}`, 'error');
        }
    };

    return (
        <Modal title={influencer ? 'Edit Influencer' : 'Add New Influencer'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" label="Name" value={formState.name} onChange={handleInputChange} required />
                <div className="relative">
                    <Input name="handle" label="Social Media Handle" value={formState.handle} onChange={handleInputChange} placeholder="@influencer" required />
                    <Button type="button" size="sm" variant="ghost" className="absolute right-0 bottom-0" onClick={handleVetInfluencer} isLoading={isVetting}>
                        <LightBulbIcon className="w-4 h-4 mr-1"/> AI Vet
                    </Button>
                </div>
                 {formState.aiAnalysis && (
                    <div className="p-3 bg-slate-50 rounded-md">
                        <h4 className="font-bold text-sm text-slate-700">AI Analysis</h4>
                        <p className="text-xs text-slate-600 whitespace-pre-wrap">{formState.aiAnalysis}</p>
                    </div>
                )}
                <Select name="platform" label="Platform" value={formState.platform} onChange={handleInputChange}>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>Twitter/X</option>
                </Select>
                 <div className="grid grid-cols-2 gap-4">
                    <Input name="followers" label="Followers" type="number" value={formState.followers} onChange={handleInputChange} />
                    <Input name="engagementRate" label="Engagement Rate (%)" type="number" step="0.1" value={formState.engagementRate} onChange={handleInputChange} />
                </div>
                <Textarea name="tags" label="Tags (comma-separated)" value={formState.tags} onChange={handleInputChange} placeholder="e.g., Fitness, Nutrition, Lifestyle" />
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{influencer ? 'Save Changes' : 'Add Influencer'}</Button>
                </div>
            </form>
        </Modal>
    );
};

const InfluencerManager: React.FC = () => {
    const { currentBrand } = useCurrentBrand();
    const { brandInfluencers, deleteInfluencer } = useInfluencers();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null);
    const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);
    const [outreachInfluencer, setOutreachInfluencer] = useState<Influencer | null>(null);

    const openModal = (influencer: Influencer | null = null) => {
        setEditingInfluencer(influencer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingInfluencer(null);
        setIsModalOpen(false);
    };

    const openOutreachModal = (influencer: Influencer) => {
        setOutreachInfluencer(influencer);
        setIsOutreachModalOpen(true);
    };

    const closeOutreachModal = () => {
        setOutreachInfluencer(null);
        setIsOutreachModalOpen(false);
    };

    const handleDelete = async (influencerId: string) => {
        if (window.confirm("Are you sure you want to delete this influencer?")) {
            await deleteInfluencer(influencerId);
            addToast("Influencer deleted.", "info");
        }
    };

    return (
        <div>
            <PageTitle
                title="Influencer Manager"
                subtitle="Discover, vet, and manage your influencer relationships."
                actions={
                    <Button onClick={() => openModal()} disabled={!currentBrand}>
                        <PlusIcon className="-ml-1 mr-2" /> Add Influencer
                    </Button>
                }
            />
            
            {currentBrand ? (
                brandInfluencers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {brandInfluencers.map(influencer => (
                            <motion.div
                                key={influencer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <InfluencerCard
                                    influencer={influencer}
                                    onEdit={() => openModal(influencer)}
                                    onDelete={() => handleDelete(influencer.id)}
                                    onOutreach={() => openOutreachModal(influencer)}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<UserGroupIcon />}
                        title="No Influencers Added"
                        message="Add your first influencer to start managing your campaigns."
                        action={<Button onClick={() => openModal()}>Add Influencer</Button>}
                    />
                )
            ) : (
                <EmptyState
                    icon={<UserGroupIcon />}
                    title="Select a Brand"
                    message="Please select a brand to manage its influencers."
                />
            )}

            {isModalOpen && (
                <InfluencerFormModal influencer={editingInfluencer} onClose={closeModal} />
            )}

            {isOutreachModalOpen && outreachInfluencer && (
                <OutreachModal influencer={outreachInfluencer} onClose={closeOutreachModal} />
            )}
        </div>
    );
};

export default InfluencerManager;