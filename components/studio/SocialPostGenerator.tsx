
import React, { useState, useEffect } from 'react';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import * as geminiService from '../../services/geminiService';
import { SocialPlatform, ToneOfVoice } from '../../types';
import AIToolContainer from './common/AIToolContainer';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import CopyButton from './common/CopyButton';
import SaveToCalendarButton from './common/SaveToCalendarButton';
import AISuggestionButton from '../ui/AISuggestionButton';
import SaveToAssetsButton from './common/SaveToAssetsButton';

const SocialPostGenerator: React.FC = () => {
  const { currentBrand } = useCurrentBrand();
  const [platform, setPlatform] = useState<SocialPlatform>(SocialPlatform.LinkedIn);
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState<ToneOfVoice>(ToneOfVoice.Professional);
  
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentBrand) {
      setAudience(currentBrand.audience || '');
      setTone(currentBrand.baseTone || ToneOfVoice.Professional);
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
      const post = await geminiService.generateSocialPost({
        brandId: currentBrand.id,
        platform,
        product,
        audience,
        tone
      });
      setResult(post);
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        id="platform"
        label="Social Media Platform"
        value={platform}
        onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
      >
        {Object.values(SocialPlatform).map(p => <option key={p} value={p}>{p}</option>)}
      </Select>
      <div>
        <Textarea
          id="product"
          label="Product / Service / Announcement"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="e.g., Our new line of eco-friendly sneakers"
          required
        />
        <AISuggestionButton 
            prompt="Suggest a creative product announcement idea for a social media post."
            onSuggestion={setProduct}
        />
      </div>
      <Input
        id="audience"
        label="Target Audience (override default)"
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
        placeholder={currentBrand?.audience || "e.g., Young professionals aged 25-35"}
        required
      />
      <Select
        id="tone"
        label="Tone of Voice (override default)"
        value={tone}
        onChange={(e) => setTone(e.target.value as ToneOfVoice)}
      >
        {Object.values(ToneOfVoice).map(t => <option key={t} value={t}>{t}</option>)}
      </Select>
      <Button type="submit" isLoading={isLoading} disabled={!currentBrand || !product || !audience}>
        Generate Post
      </Button>
    </form>
  );

  const resultDisplay = result ? (
    <div className="relative">
      <CopyButton textToCopy={result} />
      <p className="whitespace-pre-wrap">{result}</p>
      <div className="mt-4 pt-4 border-t flex gap-2">
        <SaveToCalendarButton
            title={`Social post for ${product.substring(0, 20)}...`}
            content={result}
            type="Social Post"
        />
        <SaveToAssetsButton
            name={`Social Post: ${product.substring(0, 30)}...`}
            type="Social Post"
            content={result}
        />
      </div>
    </div>
  ) : null;

  return (
    <AIToolContainer 
      title="Social Post Generator"
      description="Craft the perfect post for any social media channel. Brand defaults are applied automatically."
      form={form}
      result={resultDisplay}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default SocialPostGenerator;
