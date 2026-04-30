
import React, { useState, useEffect } from 'react';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { ai } from '../../services/aiProvider';
import { EmailContent, ToneOfVoice } from '../../types';
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

const EmailCampaignGenerator: React.FC = () => {
  const { currentBrand } = useCurrentBrand();
  const { addToast } = useToast();
  const [goal, setGoal] = useState('');
  const [productInfo, setProductInfo] = useState('');
  const [tone, setTone] = useState<ToneOfVoice>(ToneOfVoice.Professional);
  
  const [result, setResult] = useState<EmailContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentBrand) {
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
    setResult(null);

    try {
      const emailContent = await ai.generateEmailCampaign({
          brandId: currentBrand.id,
          goal,
          productInfo,
          tone
      }) as any;
      setResult({...emailContent, previewText: emailContent.previewText || emailContent.body?.substring(0, 50) || ''});
      addToast('Email content generated.', 'success');
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          id="goal"
          label="Goal of the Email"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Announce a new feature, promote a sale"
          required
        />
        <AISuggestionButton
            prompt={`<task>Suggest a clear, compelling email campaign goal</task>
<brand>
name: ${currentBrand?.name}
description: ${currentBrand?.description}
audience: ${currentBrand?.audience}
baseTone: ${currentBrand?.baseTone}
</brand>
<constraints>Measurable, aligned with brand, action-oriented</constraints>
<format>short goal phrase</format>`}
            onSuggestion={setGoal}
        />
      </div>
      <Textarea
        id="productInfo"
        label="Product / Service / Announcement Details"
        value={productInfo}
        onChange={(e) => setProductInfo(e.target.value)}
        placeholder="e.g., 20% off all summer collection until Friday."
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
      <Button type="submit" isLoading={isLoading} disabled={!currentBrand || !goal || !productInfo}>
        Generate Email
      </Button>
    </form>
  );

  const resultDisplay = result ? (
    <div className="space-y-4">
      <div className="relative">
        <h4 className="font-bold text-brand-text">Subject</h4>
        <p className="mt-1 p-2 bg-gray-100 rounded">{result.subject}</p>
        <CopyButton textToCopy={result.subject} />
      </div>
      <div className="relative">
        <h4 className="font-bold text-brand-text">Preview Text</h4>
        <p className="mt-1 p-2 bg-gray-100 rounded">{result.previewText}</p>
         <CopyButton textToCopy={result.previewText} />
      </div>
       <div className="relative">
        <h4 className="font-bold text-brand-text">Body</h4>
        <div 
            className="mt-1 p-2 border rounded prose prose-sm max-w-none" 
            dangerouslySetInnerHTML={{ __html: result.body }}
        />
         <CopyButton textToCopy={result.body} />
      </div>
       <div className="mt-4 pt-4 border-t flex gap-2">
            <SaveToCalendarButton
                title={`Email: ${result.subject.substring(0, 20)}...`}
                content={JSON.stringify(result)}
                type="Email"
            />
            <SaveToAssetsButton
                name={`Email: ${result.subject.substring(0, 30)}...`}
                type="Email"
                content={JSON.stringify(result)}
            />
        </div>
    </div>
  ) : null;

  return (
    <AIToolContainer 
      title="Email Campaign Generator"
      description="Craft compelling emails from a simple prompt. Your brand's identity is automatically used."
      form={form}
      result={resultDisplay}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default EmailCampaignGenerator;
