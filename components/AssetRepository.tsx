
import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import { useAssets } from '../hooks/useAssets';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { GeneratedContentType, Asset, Collection } from '../types';
import { TrashIcon, MegaphoneIcon, PlusIcon, TagIcon } from '../constants';
import Button from './ui/Button';
import PageTitle from './ui/PageTitle';
import EmptyState from './ui/EmptyState';
import { useToast } from '../hooks/useToast';
import { useCollections } from '../hooks/useCollections';
import Input from './ui/Input';
import Modal from './ui/Modal';
import Select from './ui/Select';

const AssetRepository: React.FC = () => {
    const { brandAssets, deleteAsset } = useAssets();
    const { currentBrand } = useCurrentBrand();
    const { brandCollections, createCollection, addAssetToCollection, deleteCollection } = useCollections();
    const { addToast } = useToast();

    const [filterType, setFilterType] = useState<GeneratedContentType | 'All'>('All');
    const [filterCollection, setFilterCollection] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    const filteredAssets = useMemo(() => {
        let assets = brandAssets;

        if (filterType !== 'All') {
            assets = assets.filter(asset => asset.type === filterType);
        }
        
        if (filterCollection !== 'All') {
            const collection = brandCollections.find(c => c.id === filterCollection);
            if(collection) {
                const assetIdsInCollection = new Set(collection.assetIds);
                assets = assets.filter(asset => assetIdsInCollection.has(asset.id));
            }
        }

        if (searchTerm.trim() !== '') {
            const lowercasedTerm = searchTerm.toLowerCase();
            assets = assets.filter(asset =>
                asset.name.toLowerCase().includes(lowercasedTerm) ||
                (asset.content && asset.content.toLowerCase().includes(lowercasedTerm)) ||
                (asset.tags || []).some(tag => tag.toLowerCase().includes(lowercasedTerm))
            );
        }

        return assets;
    }, [brandAssets, filterType, filterCollection, searchTerm, brandCollections]);

    const assetTypes: GeneratedContentType[] = ['Social Post', 'Ad Copy', 'Blog Idea', 'Image', 'Email', 'Repurposed Content'];

    const handleDelete = async (assetId: string) => {
        if (window.confirm('Are you sure you want to permanently delete this asset?')) {
            await deleteAsset(assetId);
            addToast('Asset deleted.', 'info');
        }
    };

    const handleCreateCollection = async () => {
        if (newCollectionName.trim()) {
            await createCollection(newCollectionName.trim());
            addToast(`Collection "${newCollectionName.trim()}" created!`, 'success');
            setNewCollectionName('');
            setIsCollectionModalOpen(false);
        }
    };

    const AssetCard: React.FC<{ asset: Asset }> = ({ asset }) => {
        const [isAddToCollectionOpen, setIsAddToCollectionOpen] = useState(false);
        
        const handleAddAsset = async (collectionId: string) => {
            await addAssetToCollection(collectionId, asset.id);
            addToast(`Asset added to collection.`, 'success');
            setIsAddToCollectionOpen(false);
        }

        return (
            <Card className="flex flex-col">
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-brand-primary-light text-brand-primary">{asset.type}</span>
                        <div className="relative">
                            <button onClick={() => setIsAddToCollectionOpen(v => !v)} className="p-1 text-slate-400 hover:text-brand-primary rounded-full hover:bg-brand-primary-light" title="Add to collection">
                                <PlusIcon className="w-4 h-4" />
                            </button>
                            {isAddToCollectionOpen && brandCollections.length > 0 && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 border">
                                    {brandCollections.map(c => (
                                        <button key={c.id} onClick={() => handleAddAsset(c.id)} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <h3 className="font-bold my-2 text-brand-text">{asset.name}</h3>
                    {asset.type === 'Image' && asset.imageUrl ? (
                        <img src={asset.imageUrl} alt={asset.name} className="rounded-md object-cover h-40 w-full" />
                    ) : (
                        <p className="text-gray-600 text-sm line-clamp-3">{asset.type === 'Email' ? JSON.parse(asset.content).subject : asset.content}</p>
                    )}
                     <div className="mt-4 flex flex-wrap gap-1.5">
                        {(asset.tags || []).map(tag => (
                            <span key={tag} className="flex items-center text-xs font-medium bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                                <TagIcon className="w-3 h-3 mr-1"/>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                 <div className="flex justify-between items-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-200">
                    <span>Created: {new Date(asset.createdAt).toLocaleDateString()}</span>
                     <button 
                        onClick={() => handleDelete(asset.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <div>
            <PageTitle 
                title="Asset Repository"
                subtitle="Your centralized library for all generated content and images."
            />
            
            {currentBrand ? (
                <>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <Input label="Search Assets" id="search-assets" placeholder="Search by name, content, or tag..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <Select label="Filter by Collection" id="filter-collection" value={filterCollection} onChange={e => setFilterCollection(e.target.value)}>
                            <option value="All">All Collections</option>
                            {brandCollections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                        <Button variant="secondary" onClick={() => setIsCollectionModalOpen(true)}><PlusIcon /> New Collection</Button>
                    </div>

                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6 overflow-x-auto">
                                <button
                                    onClick={() => setFilterType('All')}
                                    className={`${
                                        filterType === 'All'
                                        ? 'border-brand-primary text-brand-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                                >
                                    All Assets
                                </button>
                                {assetTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`${
                                        filterType === type
                                            ? 'border-brand-primary text-brand-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                                    >
                                        {type}s
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                     {filteredAssets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAssets.map(asset => <AssetCard key={asset.id} asset={asset} />)}
                        </div>
                     ) : (
                         <EmptyState
                            icon={<MegaphoneIcon />}
                            title="No Assets Found"
                            message="No assets match your current filters. Try adjusting your search or creating new content in the AI Studio."
                        />
                     )}
                </>
            ) : (
                 <EmptyState
                    icon={<MegaphoneIcon />}
                    title="Select a Brand"
                    message="Please select a brand to view its asset repository."
                />
            )}

            {isCollectionModalOpen && (
                <Modal title="Create New Collection" onClose={() => setIsCollectionModalOpen(false)}>
                    <div className="space-y-4">
                        <Input label="Collection Name" id="new-collection" value={newCollectionName} onChange={e => setNewCollectionName(e.target.value)} placeholder="e.g., Q4 Campaign Visuals" />
                        <div className="flex justify-end gap-2">
                             <Button variant="secondary" onClick={() => setIsCollectionModalOpen(false)}>Cancel</Button>
                             <Button onClick={handleCreateCollection}>Create</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AssetRepository;
