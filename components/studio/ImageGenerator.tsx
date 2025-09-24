
import React, { useState } from 'react';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import * as geminiService from '../../services/geminiService';
import AIToolContainer from './common/AIToolContainer';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import SaveToCalendarButton from './common/SaveToCalendarButton';
import AISuggestionButton from '../ui/AISuggestionButton';
import SaveToAssetsButton from './common/SaveToAssetsButton';

const ImageGenerator: React.FC = () => {
  const { currentBrand } = useCurrentBrand();
  const [prompt, setPrompt] = useState('');
  
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const imageUrl = await geminiService.generateMarketingImage({ brandId: currentBrand.id, prompt });
      setResult(imageUrl);
    } catch (err: any)
     {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          id="prompt"
          label="Image Description"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A flat lay of modern office supplies on a brightly colored background, minimalist style'"
          required
          rows={5}
        />
        <AISuggestionButton
            prompt={`Suggest a creative and visually interesting prompt for a marketing image for a brand that is "${currentBrand?.description}"`}
            onSuggestion={setPrompt}
        />
      </div>
      <Button type="submit" isLoading={isLoading} disabled={!currentBrand || !prompt}>
        Generate Image
      </Button>
    </form>
  );

  const resultDisplay = result ? (
    <div>
      <img src={result} alt="Generated marketing visual" className="rounded-lg shadow-md w-full" />
      <div className="mt-4 flex justify-between items-center">
        <a 
          href={result} 
          download={`brandspark-image-${Date.now()}.jpg`} 
          className="inline-block text-sm font-medium text-brand-primary hover:text-indigo-800"
        >
          Download Image
        </a>
        <div className="flex gap-2">
            <SaveToCalendarButton
                title={`Image for: ${prompt.substring(0, 20)}...`}
                content={prompt}
                type="Image"
                imageUrl={result}
            />
            <SaveToAssetsButton
                name={`Image: ${prompt.substring(0, 30)}...`}
                type="Image"
                content={prompt}
                imageUrl={result}
            />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <AIToolContainer 
      title="Marketing Image Generator"
      description="Create stunning visuals for your campaigns. The AI will use your brand colors and identity."
      form={form}
      result={resultDisplay}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default ImageGenerator;
