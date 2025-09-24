
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { AutomationWorkflow } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface AutomationsContextType {
  automations: AutomationWorkflow[];
  brandAutomations: AutomationWorkflow[];
  addAutomation: (automation: Omit<AutomationWorkflow, 'id'>) => Promise<void>;
  updateAutomation: (automationId: string, updatedAutomation: Partial<AutomationWorkflow>) => Promise<void>;
  deleteAutomation: (automationId: string) => Promise<void>;
  isLoading: boolean;
}

const AutomationsContext = createContext<AutomationsContextType | undefined>(undefined);

export const AutomationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [automations, setAutomations] = useState<AutomationWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedAutomations = await apiService.fetchAutomations();
        setAutomations(fetchedAutomations);
      } catch (error) {
        console.error("Failed to load automations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const addAutomation = async (automation: Omit<AutomationWorkflow, 'id'>) => {
    const newAutomation = await apiService.addAutomation(automation);
    setAutomations(prev => [...prev, newAutomation]);
  };

  const updateAutomation = async (automationId: string, updatedAutomation: Partial<AutomationWorkflow>) => {
    const result = await apiService.updateAutomation(automationId, updatedAutomation);
    setAutomations(prev => prev.map(a => a.id === automationId ? result : a));
  };
  
  const deleteAutomation = async (automationId: string) => {
    await apiService.deleteAutomation(automationId);
    setAutomations(prev => prev.filter(a => a.id !== automationId));
  };

  const brandAutomations = useMemo(() => {
    if (!currentBrand) return [];
    return automations.filter(a => a.brandId === currentBrand.id);
  }, [automations, currentBrand]);


  const value = useMemo(() => ({
    automations,
    brandAutomations,
    addAutomation,
    updateAutomation,
    deleteAutomation,
    isLoading
  }), [automations, brandAutomations, isLoading]);

  return (
    <AutomationsContext.Provider value={value}>
      {children}
    </AutomationsContext.Provider>
  );
};

export const useAutomations = (): AutomationsContextType => {
  const context = useContext(AutomationsContext);
  if (context === undefined) {
    throw new Error('useAutomations must be used within a AutomationsProvider');
  }
  return context;
};
