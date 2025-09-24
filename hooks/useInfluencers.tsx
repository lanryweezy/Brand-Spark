
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Influencer } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface InfluencersContextType {
  influencers: Influencer[];
  brandInfluencers: Influencer[];
  addInfluencer: (influencer: Omit<Influencer, 'id'>) => Promise<void>;
  updateInfluencer: (influencerId: string, updatedInfluencer: Partial<Influencer>) => Promise<void>;
  deleteInfluencer: (influencerId: string) => Promise<void>;
  isLoading: boolean;
}

const InfluencersContext = createContext<InfluencersContextType | undefined>(undefined);

export const InfluencersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedInfluencers = await apiService.fetchInfluencers();
        setInfluencers(fetchedInfluencers);
      } catch (error) {
        console.error("Failed to load influencers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const addInfluencer = async (influencer: Omit<Influencer, 'id'>) => {
    const newInfluencer = await apiService.addInfluencer(influencer);
    setInfluencers(prev => [newInfluencer, ...prev]);
  };

  const updateInfluencer = async (influencerId: string, updatedInfluencer: Partial<Influencer>) => {
    const result = await apiService.updateInfluencer(influencerId, updatedInfluencer);
    setInfluencers(prev => prev.map(i => i.id === influencerId ? result : i));
  };
  
  const deleteInfluencer = async (influencerId: string) => {
    await apiService.deleteInfluencer(influencerId);
    setInfluencers(prev => prev.filter(i => i.id !== influencerId));
  };

  const brandInfluencers = useMemo(() => {
    if (!currentBrand) return [];
    return influencers.filter(i => i.brandId === currentBrand.id);
  }, [influencers, currentBrand]);

  const value = useMemo(() => ({
    influencers,
    brandInfluencers,
    addInfluencer,
    updateInfluencer,
    deleteInfluencer,
    isLoading
  }), [influencers, brandInfluencers, isLoading]);

  return (
    <InfluencersContext.Provider value={value}>
      {children}
    </InfluencersContext.Provider>
  );
};

export const useInfluencers = (): InfluencersContextType => {
  const context = useContext(InfluencersContext);
  if (context === undefined) {
    throw new Error('useInfluencers must be used within a InfluencersProvider');
  }
  return context;
};
