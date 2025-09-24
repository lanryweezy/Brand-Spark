
import React, { useState } from 'react';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import * as geminiService from '../../services/geminiService';
import { BlogIdea } from '../../types';
import AIToolContainer from './common/AIToolContainer';
import Button from '../ui/Button';
import Input from '../ui/Input';
import CopyButton from './common/CopyButton';
import AISuggestionButton from '../ui/AISuggestionButton';
import SaveToCalendarButton from './common/SaveToCalendarButton';
import SaveToAssetsButton from './common/SaveToAssetsButton';

const BlogIdeaGenerator: React.FC = () => {
  const { currentBrand } = useCurrentBrand();
  const [topic, setTopic] = useState('');
  
  const [result, setResult] = useState<BlogIdea[]>([]);
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
    setResult([]);

    try {
      const ideas = await geminiService.generateBlogIdeas({ brandId: currentBrand.id, topic });
      setResult(ideas);
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
          id="topic"
          label="Blog Topic or Keyword"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'Content marketing for startups'"
          required
        />
        <AISuggestionButton 
            prompt={`Suggest a broad blog topic for a company with the description: "${currentBrand?.description}"`}
            onSuggestion={setTopic}
        />
      </div>
      <Button type="submit" isLoading={isLoading} disabled={!currentBrand || !topic}>
        Generate Ideas
      </Button>
    </form>
  );

  const resultDisplay = result.length > 0 ? (
    <div className="space-y-4">
      {result.map((idea, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white relative">
            <CopyButton textToCopy={`Title: ${idea.title}\nDescription: ${idea.description}`} />
          <h4 className="font-bold text-brand-text">{idea.title}</h4>
          <p className="text-gray-600 mt-1">{idea.description}</p>
          <div className="mt-4 pt-4 border-t flex gap-2">
            <SaveToCalendarButton
                title={`Blog Idea: ${idea.title.substring(0, 20)}...`}
                content={`Title: ${idea.title}\nDescription: ${idea.description}`}
                type="Blog Idea"
            />
            <SaveToAssetsButton
                name={`Blog Idea: ${idea.title.substring(0, 30)}...`}
                type="Blog Idea"
                content={`Title: ${idea.title}\nDescription: ${idea.description}`}
            />
          </div>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <AIToolContainer 
      title="Blog Idea Generator"
      description="Beat writer's block. The AI will generate ideas tailored to your brand's audience."
      form={form}
      result={resultDisplay}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default BlogIdeaGenerator;
