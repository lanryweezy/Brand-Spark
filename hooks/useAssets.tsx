
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Asset } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface AssetsContextType {
  assets: Asset[];
  brandAssets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => Promise<void>;
  updateAsset: (assetId: string, updatedAsset: Partial<Asset>) => Promise<void>;
  deleteAsset: (assetId: string) => Promise<void>;
  getAssetById: (assetId: string) => Asset | undefined;
  isLoading: boolean;
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export const AssetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedAssets = await apiService.fetchAssets();
        setAssets(fetchedAssets);
      } catch (error) {
        console.error("Failed to load assets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const addAsset = async (asset: Omit<Asset, 'id' | 'createdAt'>) => {
    const newAsset = await apiService.addAsset(asset);
    setAssets(prev => [newAsset, ...prev]);
  };

  const updateAsset = async (assetId: string, updatedAsset: Partial<Asset>) => {
    const result = await apiService.updateAsset(assetId, updatedAsset);
    setAssets(prev => prev.map(a => a.id === assetId ? result : a));
  };

  const deleteAsset = async (assetId: string) => {
    await apiService.deleteAsset(assetId);
    setAssets(prev => prev.filter(a => a.id !== assetId));
  };

  const getAssetById = (assetId: string) => {
      return assets.find(a => a.id === assetId);
  }

  const brandAssets = useMemo(() => {
    if (!currentBrand) return [];
    return assets.filter(a => a.brandId === currentBrand.id);
  }, [assets, currentBrand]);

  const value = useMemo(() => ({
    assets,
    brandAssets,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetById,
    isLoading
  }), [assets, brandAssets, isLoading]);

  return (
    <AssetsContext.Provider value={value}>
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssets = (): AssetsContextType => {
  const context = useContext(AssetsContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within a AssetsProvider');
  }
  return context;
};
