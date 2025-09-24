
import React, { useState } from 'react';
import Button from './Button';
import { LightBulbIcon } from '../../constants';
// Fix: Import geminiService for AI-powered suggestions.
import * as geminiService from '../../services/geminiService';
import { useToast } from '../../hooks/useToast';

interface AISuggestionButtonProps {
    prompt: string;
    onSuggestion: (suggestion: string) => void;
    className?: string;
}

const AISuggestionButton: React.FC<AISuggestionButtonProps> = ({ prompt, onSuggestion, className = '' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const handleClick = async () => {
        setIsLoading(true);
        try {
            // Fix: Use geminiService to generate suggestions.
            const suggestion = await geminiService.generateSuggestion({ prompt });
            onSuggestion(suggestion);
        } catch (error) {
            console.error("Failed to get AI suggestion:", error);
            addToast("Sorry, we couldn't get a suggestion at this time.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex justify-end -mt-1 ${className}`}>
            <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleClick}
                isLoading={isLoading}
                disabled={isLoading}
            >
                <LightBulbIcon className="w-4 h-4 mr-1.5" />
                {isLoading ? 'Thinking...' : 'AI Suggest'}
            </Button>
        </div>
    );
};

export default AISuggestionButton;
