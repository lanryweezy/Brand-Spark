
import React, { useState } from 'react';
import { useAssets } from '../../../hooks/useAssets';
import { useCurrentBrand } from '../../../hooks/useCurrentBrand';
import { GeneratedContentType, Asset } from '../../../types';
import Button from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import * as geminiService from '../../../services/geminiService';

interface SaveToAssetsButtonProps {
    name: string;
    type: GeneratedContentType;
    content: string;
    imageUrl?: string;
}

const SaveToAssetsButton: React.FC<SaveToAssetsButtonProps> = ({ name, type, content, imageUrl }) => {
    const { addAsset } = useAssets();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async () => {
        if (!currentBrand) {
            addToast("Please select a brand first", "error");
            return;
        }
        
        setIsSaving(true);
        addToast("Saving and analyzing asset...", 'info');

        let tags: string[] = [];
        try {
            if (type !== 'Image') { // Tagging is best for text content
                tags = await geminiService.generateAssetTags({ content, type });
            }
        } catch (error) {
            console.error("Failed to generate tags:", error);
            addToast("Couldn't generate AI tags, but the asset will be saved without them.", "info");
        }

        const assetData: Omit<Asset, 'id' | 'createdAt'> = {
            brandId: currentBrand.id,
            name,
            type,
            content,
            imageUrl,
            tags,
        };

        await addAsset(assetData);
        addToast('Saved to Asset Repository!', 'success');
        setIsSaved(true);
        setIsSaving(false);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <Button onClick={handleSave} disabled={isSaved || isSaving} isLoading={isSaving} variant="secondary" size="sm">
            {isSaving ? 'Saving...' : isSaved ? 'Saved to Assets!' : 'Save to Assets'}
        </Button>
    );
};

export default SaveToAssetsButton;
