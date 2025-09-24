
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { BrandProfile, ToneOfVoice, Competitor, Integration } from '../types';
import * as apiService from '../services/apiService';

interface BrandContextType {
  currentBrand: BrandProfile | null;
  setCurrentBrand: (brand: BrandProfile | null) => void;
  brands: BrandProfile[];
  addBrand: (name: string) => Promise<BrandProfile>;
  updateBrandProfile: (id: string, updatedProfile: Partial<Omit<BrandProfile, 'competitors'>>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  addCompetitor: (brandId: string, competitorName: string) => Promise<void>;
  updateCompetitor: (brandId: string, competitorId: string, updatedCompetitor: Partial<Competitor>) => Promise<void>;
  removeCompetitor: (brandId: string, competitorId: string) => Promise<void>;
  updateBrandIntegration: (brandId: string, integrationId: Integration['id'], connected: boolean) => Promise<void>;
  isLoading: boolean;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<BrandProfile[]>([]);
  const [currentBrand, setCurrentBrand] = useState<BrandProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedBrands = await apiService.fetchBrands();
        setBrands(fetchedBrands);
        if (fetchedBrands.length > 0) {
          setCurrentBrand(fetchedBrands[0]);
        }
      } catch (error) {
        console.error("Failed to load brands from backend", error);
        // Handle error appropriately, maybe set an error state
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (currentBrand) {
      const updatedCurrentBrand = brands.find(b => b.id === currentBrand.id) || null;
      if (JSON.stringify(updatedCurrentBrand) !== JSON.stringify(currentBrand)) {
        setCurrentBrand(updatedCurrentBrand);
      }
    } else if (brands.length > 0) {
        setCurrentBrand(brands[0]);
    } else {
        setCurrentBrand(null);
    }
  }, [brands]);
  
  const addBrand = async (name: string): Promise<BrandProfile> => {
    const newBrand = await apiService.addBrand({ name });
    setBrands(prevBrands => [...prevBrands, newBrand]);
    return newBrand;
  };

  const updateBrandProfile = async (id: string, updatedProfile: Partial<BrandProfile>) => {
    const updatedBrand = await apiService.updateBrand(id, updatedProfile);
    setBrands(brands.map(brand => (brand.id === id ? updatedBrand : brand)));
  };

  const deleteBrand = async (id: string) => {
    await apiService.deleteBrand(id);
    const updatedBrands = brands.filter(brand => brand.id !== id);
    setBrands(updatedBrands);
  };

  const addCompetitor = async (brandId: string, competitorName: string) => {
    const newCompetitor = await apiService.addCompetitorToBrand(brandId, { name: competitorName });
    const updatedBrands = brands.map(brand => {
        if (brand.id === brandId) {
            return { ...brand, competitors: [...brand.competitors, newCompetitor] };
        }
        return brand;
    });
    setBrands(updatedBrands);
  };

  const updateCompetitor = async (brandId: string, competitorId: string, updatedCompetitor: Partial<Competitor>) => {
    const result = await apiService.updateBrandCompetitor(brandId, competitorId, updatedCompetitor);
     const updatedBrands = brands.map(brand => {
        if (brand.id === brandId) {
            return {
                ...brand,
                competitors: brand.competitors.map(c => c.id === competitorId ? result : c)
            };
        }
        return brand;
    });
    setBrands(updatedBrands);
  };

  const removeCompetitor = async (brandId: string, competitorId: string) => {
    await apiService.removeBrandCompetitor(brandId, competitorId);
    const updatedBrands = brands.map(brand => {
        if (brand.id === brandId) {
            return { ...brand, competitors: brand.competitors.filter(c => c.id !== competitorId) };
        }
        return brand;
    });
    setBrands(updatedBrands);
  };

  const updateBrandIntegration = async (brandId: string, integrationId: Integration['id'], connected: boolean) => {
    await apiService.updateBrandIntegration(brandId, { integrationId, connected });
    const updatedBrands = brands.map(brand => {
        if (brand.id === brandId) {
            return {
                ...brand,
                integrations: brand.integrations.map(i => 
                    i.id === integrationId ? { ...i, connected } : i
                )
            };
        }
        return brand;
    });
    setBrands(updatedBrands);
  };

  const value = useMemo(() => ({
    currentBrand,
    setCurrentBrand,
    brands,
    addBrand,
    updateBrandProfile,
    deleteBrand,
    addCompetitor,
    updateCompetitor,
    removeCompetitor,
    updateBrandIntegration,
    isLoading,
  }), [currentBrand, brands, isLoading]);

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};

export const useCurrentBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useCurrentBrand must be used within a BrandProvider');
  }
  return context;
};
