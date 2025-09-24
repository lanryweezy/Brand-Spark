
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Campaign } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface CampaignsContextType {
  campaigns: Campaign[];
  brandCampaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id'>) => Promise<void>;
  updateCampaign: (campaignId: string, updatedCampaign: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  isLoading: boolean;
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined);

export const CampaignsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedCampaigns = await apiService.fetchCampaigns();
        setCampaigns(fetchedCampaigns);
      } catch (error) {
        console.error("Failed to load campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const addCampaign = async (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign = await apiService.addCampaign(campaign);
    setCampaigns(prev => [...prev, newCampaign]);
  };

  const updateCampaign = async (campaignId: string, updatedCampaign: Partial<Campaign>) => {
    const result = await apiService.updateCampaign(campaignId, updatedCampaign);
    setCampaigns(prev => prev.map(c => c.id === campaignId ? result : c));
  };
  
  const deleteCampaign = async (campaignId: string) => {
    await apiService.deleteCampaign(campaignId);
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  };

  const brandCampaigns = useMemo(() => {
    if (!currentBrand) return [];
    return campaigns.filter(c => c.brandId === currentBrand.id);
  }, [campaigns, currentBrand]);


  const value = useMemo(() => ({
    campaigns,
    brandCampaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    isLoading
  }), [campaigns, brandCampaigns, isLoading]);

  return (
    <CampaignsContext.Provider value={value}>
      {children}
    </CampaignsContext.Provider>
  );
};

export const useCampaigns = (): CampaignsContextType => {
  const context = useContext(CampaignsContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignsProvider');
  }
  return context;
};
