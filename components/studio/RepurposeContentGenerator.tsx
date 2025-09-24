
import React, { useState } from 'react';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
// Fix: Import geminiService for AI-powered content repurposing.
import * as geminiService from '../../services/geminiService';
import AIToolContainer from './common/AIToolContainer';
import Button from '../ui/Button';
import Select from '../ui/Select';
import CopyButton from './common/CopyButton';
import SaveToAssetsButton from './common/SaveToAssetsButton';
import { useAssets } from '../../hooks/useAssets';

const REPURPOSE_FORMATS = [
    "Tweet Thread",
    "LinkedIn Article",
    "Facebook Post",
    "Email Newsletter Blurb",
    "Short Blog Post (200 words)",
    "Instagram Caption",
];

const RepurposeContentGenerator: React.FC = () => {
    const { currentBrand } = useCurrentBrand();
    const { brandAssets } = useAssets();
    
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [targetFormat, setTargetFormat] = useState(REPURPOSE_FORMATS[0]);

    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const textBasedAssets = brandAssets.filter(asset => asset.type !== 'Image');
    const selectedAsset = brandAssets.find(asset => asset.id === selectedAssetId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBrand) {
            setError("Please select a brand first.");
            return;
        }
        if (!selectedAsset) {
            setError("Please select an asset to repurpose.");
            return;
        }
        setError(null);
        setIsLoading(true);
        setResult('');

        try {
            const originalContent = selectedAsset.type === 'Email' 
                ? JSON.parse(selectedAsset.content).body 
                : selectedAsset.content;
            
            // Fix: Use geminiService to repurpose content.
            const repurposed = await geminiService.repurposeContent({
                brandId: currentBrand.id,
                originalContent,
                targetFormat
            });
            setResult(repurposed);
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setIsLoading(false);
        }
    };

    const form = (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Select
                id="source-asset"
                label="Select Content to Repurpose"
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                disabled={textBasedAssets.length === 0}
            >
                <option value="">{textBasedAssets.length > 0 ? 'Choose an asset...' : 'No text assets available'}</option>
                {textBasedAssets.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                ))}
            </Select>

            <Select
                id="target-format"
                label="New Format"
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
            >
                {REPURPOSE_FORMATS.map(format => <option key={format} value={format}>{format}</option>)}
            </Select>
            
            <Button type="submit" isLoading={isLoading} disabled={!currentBrand || !selectedAssetId}>
                Repurpose Content
            </Button>
        </form>
    );

    const resultDisplay = result ? (
        <div className="relative">
            <CopyButton textToCopy={result} />
            <p className="whitespace-pre-wrap">{result}</p>
            <div className="mt-4 pt-4 border-t flex gap-2">
                <SaveToAssetsButton
                    name={`${targetFormat}: ${selectedAsset?.name.substring(0, 20)}...`}
                    type="Repurposed Content"
                    content={result}
                />
            </div>
        </div>
    ) : null;

    return (
        <AIToolContainer 
            title="Repurpose Content"
            description="Turn one piece of content into many. Select an existing asset and a new format."
            form={form}
            result={resultDisplay}
            isLoading={isLoading}
            error={error}
        />
    );
};

export default RepurposeContentGenerator;
