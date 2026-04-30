
import React, { useState } from 'react';
import { useCurrentBrand } from '../../hooks/useCurrentBrand';
import { ai } from '../../services/aiProvider';
import { SEOKeyword } from '../../types';
import AIToolContainer from './common/AIToolContainer';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useToast } from '../../hooks/useToast';

const SEOKeywordGenerator: React.FC = () => {
  const { currentBrand } = useCurrentBrand();
  const { addToast } = useToast();
  const [topic, setTopic] = useState('');
  
  const [result, setResult] = useState<SEOKeyword[]>([]);
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
      const keywords = await ai.generateSEOKeywords({ brandId: currentBrand.id, topic }) as any;
      setResult(keywords.map((k: any) => ({...k, relevance: k.relevance || 'High', intent: k.intent || 'Informational'})));
      addToast('SEO keywords generated.', 'success');
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="topic"
        label="Core Topic or Product Category"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g., 'sustainable fashion'"
        required
      />
      <Button type="submit" isLoading={isLoading} disabled={!currentBrand || !topic}>
        Generate Keywords
      </Button>
    </form>
  );

  const resultDisplay = result.length > 0 ? (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relevance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intent</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {result.map((item, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.keyword}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.relevance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.intent}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  ) : null;

  return (
    <AIToolContainer 
      title="SEO Keyword Generator"
      description="Discover long-tail keywords to improve your search engine ranking for any topic."
      form={form}
      result={resultDisplay}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default SEOKeywordGenerator;
