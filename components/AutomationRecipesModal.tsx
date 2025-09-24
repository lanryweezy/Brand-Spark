
import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { AutomationRecipe } from '../types';
import { suggestAutomationRecipes } from '../services/geminiService';
import { useAutomations } from '../hooks/useAutomations';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { useToast } from '../hooks/useToast';
import Button from './ui/Button';

const AutomationRecipesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [recipes, setRecipes] = useState<AutomationRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addAutomation } = useAutomations();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();

    useEffect(() => {
        if (currentBrand) {
            setIsLoading(true);
            suggestAutomationRecipes(currentBrand)
                .then(setRecipes)
                .catch(err => {
                    addToast("Could not get AI recipes. Please try again.", "error");
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        }
    }, [currentBrand]);
    
    const handleAddRecipe = (recipe: AutomationRecipe) => {
        if (!currentBrand) return;
        addAutomation({
            ...recipe,
            brandId: currentBrand.id,
            active: false // default to inactive
        });
        addToast(`Recipe "${recipe.name}" added to your workflows!`, 'success');
    };

    return (
        <Modal title="AI Automation Recipe Book" onClose={onClose}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="text-center p-8">
                        <p>Finding the best automation recipes for {currentBrand?.name}...</p>
                    </div>
                ) : (
                    recipes.map((recipe, index) => (
                        <div key={index} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                            <h4 className="font-bold text-brand-text">{recipe.name}</h4>
                            <p className="text-sm text-slate-600 mt-1">{recipe.description}</p>
                            <div className="mt-2 text-right">
                                <Button size="sm" onClick={() => handleAddRecipe(recipe)}>Add to Workflows</Button>
                            </div>
                        </div>
                    ))
                )}
                {!isLoading && recipes.length === 0 && (
                    <div className="text-center p-8">
                        <p className="text-slate-500">Could not find any recipes.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AutomationRecipesModal;
