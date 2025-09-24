
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Collection } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface CollectionsContextType {
  collections: Collection[];
  brandCollections: Collection[];
  createCollection: (name: string) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  addAssetToCollection: (collectionId: string, assetId: string) => Promise<void>;
  removeAssetFromCollection: (collectionId: string, assetId: string) => Promise<void>;
  isLoading: boolean;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export const CollectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedCollections = await apiService.fetchCollections();
        setCollections(fetchedCollections);
      } catch (error) {
        console.error("Failed to load collections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const createCollection = async (name: string) => {
    if (!currentBrand) return;
    const newCollection = await apiService.addCollection({ name, brandId: currentBrand.id, assetIds: [] });
    setCollections(prev => [...prev, newCollection]);
  };

  const deleteCollection = async (collectionId: string) => {
    await apiService.deleteCollection(collectionId);
    setCollections(prev => prev.filter(c => c.id !== collectionId));
  };
  
  const addAssetToCollection = async (collectionId: string, assetId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;
    
    const newAssetIds = collection.assetIds.includes(assetId) ? collection.assetIds : [...collection.assetIds, assetId];
    const updatedCollection = await apiService.updateCollection(collectionId, { assetIds: newAssetIds });
    
    setCollections(prev => prev.map(c => c.id === collectionId ? updatedCollection : c));
  };

  const removeAssetFromCollection = async (collectionId: string, assetId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    const newAssetIds = collection.assetIds.filter(id => id !== assetId);
    const updatedCollection = await apiService.updateCollection(collectionId, { assetIds: newAssetIds });

     setCollections(prev => prev.map(c => c.id === collectionId ? updatedCollection : c));
  };

  const brandCollections = useMemo(() => {
    if (!currentBrand) return [];
    return collections.filter(c => c.brandId === currentBrand.id);
  }, [collections, currentBrand]);

  const value = useMemo(() => ({
    collections,
    brandCollections,
    createCollection,
    deleteCollection,
    addAssetToCollection,
    removeAssetFromCollection,
    isLoading
  }), [collections, brandCollections, isLoading]);

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = (): CollectionsContextType => {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
};
