
import React, { useState, useEffect } from 'react';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { ai } from '../../services/aiProvider';
import { ToneOfVoice } from '../../types';
import AIToolContainer from './common/AIToolContainer';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import CopyButton from './common/CopyButton';
import SaveToCalendarButton from './common/SaveToCalendarButton';
import AISuggestionButton from '../ui/AISuggestionButton';
import SaveToAssetsButton from './common/SaveToAssetsButton';
import { useToast } from '../../hooks/useToast';

const AdCopyGenerator: React.FC = () => {
  const { currentBrand } = useCurrentBrand();
  const { addToast } = useToast();
  const [product, setProduct] = useState('');
  const [sellingPoints, setSellingPoints] = useState('');
  const [tone, setTone] = useState<ToneOfVoice>(ToneOfVoice.Witty);
  
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (currentBrand) {
      setTone(currentBrand.baseTone || ToneOfVoice.Witty);
    }
  }, [currentBrand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBrand) {
      setError("Please select a brand first.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult('');

    try {
      const copy = await ai.generateAdCopy({
          brandId: currentBrand.id,
          product,
          sellingPoints,
          tone
      });
      setResult(copy);
      addToast('Ad copy generated.', 'success');
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="product"
        label="Product / Service Name"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="e.g., The 'Zen' Noise-Cancelling Headphones"
        required
      />
      <div>
        <Textarea
          id="selling-points"
          label="Key Selling Points / Features"
          value={sellingPoints}
          onChange={(e) => setSellingPoints(e.target.value)}
          placeholder="e.g., 40-hour battery life, crystal clear audio, plush memory foam earcups"
          required
        />
        <AISuggestionButton 
            prompt={`<task>Suggest 3 key selling points</task>
<brand>
name: ${currentBrand?.name}
description: ${currentBrand?.description}
</brand>
<product>${product}</product>
<constraints>Concise, benefit-focused, customer language</constraints>
<format>bullet list</format>`}
            onSuggestion={setSellingPoints}
        />
      </div>
      <Select
        id="tone"
        label="Tone of Voice (override default)"
        value={tone}
        onChange={(e) => setTone(e.target.value as ToneOfVoice)}
      >
        {Object.values(ToneOfVoice).map(t => <option key={t} value={t}>{t}</option>)}
      </Select>
      <Button type="submit" isLoading={isLoading} disabled={!currentBrand || !product || !sellingPoints}>
        Generate Ad Copy
      </Button>
    </form>
  );

  const resultDisplay = result ? (
    <div className="relative">
        <CopyButton textToCopy={result} />
        <div className="whitespace-pre-wrap">{result}</div>
        <div className="mt-4 pt-4 border-t flex gap-2">
            <SaveToCalendarButton
                title={`Ad Copy for ${product.substring(0, 20)}...`}
                content={result}
                type="Ad Copy"
            />
            <SaveToAssetsButton
                name={`Ad Copy: ${product.substring(0, 30)}...`}
                type="Ad Copy"
                content={result}
            />
        </div>
    </div>
  ) : null;

  return (
    <AIToolContainer 
      title="Ad Copy Generator"
      description="Create high-converting ad copy. Your brand's audience and tone are automatically applied."
      form={form}
      result={resultDisplay}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default AdCopyGenerator;
