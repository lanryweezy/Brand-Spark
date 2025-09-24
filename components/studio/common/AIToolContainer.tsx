
import React from 'react';
import Card from '../../ui/Card';
import { SparklesIcon } from '../../../constants';

interface AIToolContainerProps {
  title: string;
  description: string;
  form: React.ReactNode;
  result: React.ReactNode;
  isLoading: boolean;
  error: string | null;
}

const AIToolContainer: React.FC<AIToolContainerProps> = ({ title, description, form, result, isLoading, error }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-brand-text">{title}</h3>
            <p className="mt-1 text-slate-500">{description}</p>
          </div>
          {form}
        </div>
      </Card>
      <Card className="bg-slate-50 sticky top-8">
        <h3 className="text-lg font-bold text-brand-text mb-4">Generated Content</h3>
        <div className="relative min-h-[300px] bg-white rounded-lg border border-slate-200 p-6 overflow-y-auto">
            {isLoading && (
                 <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
                    <SparklesIcon className="h-10 w-10 text-purple-500 animate-pulse" />
                    <p className="mt-4 text-slate-600 font-semibold">Generating Magic...</p>
                 </div>
            )}
            {error && (
                <div className="text-red-700 bg-red-100 p-4 rounded-lg border border-red-200">
                    <p className="font-bold">An error occurred</p>
                    <p className="mt-1">{error}</p>
                </div>
            )}
            {!isLoading && !error && (
                <div className="prose prose-sm max-w-none text-slate-800">
                    {result ? result : <p className="text-slate-400 text-center py-20">Your generated content will appear here.</p>}
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default AIToolContainer;