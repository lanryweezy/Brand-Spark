
import React from 'react';
import Card from '../../ui/Card';
import { SparklesIcon } from '../../../constants';
import { Skeleton } from '../../ui/Skeleton';

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
        <div className="relative min-h-[300px] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
            {isLoading && (
                 <div className="flex flex-col space-y-4 animate-pulse">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="pt-4">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3 mt-2" />
                    </div>
                 </div>
            )}
            {error && (
                <div className="text-red-700 bg-red-100 p-4 rounded-lg border border-red-200">
                    <p className="font-bold">An error occurred</p>
                    <p className="mt-1">{error}</p>
                </div>
            )}
            {!isLoading && !error && (
                <div className="prose prose-sm max-w-none text-slate-800 dark:text-slate-300">
                    {result ? result : <p className="text-slate-400 text-center py-20">Your generated content will appear here.</p>}
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default AIToolContainer;