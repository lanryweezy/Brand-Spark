
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Client } from '../types';
import * as apiService from '../services/apiService';

interface ClientsContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (clientId: string, updatedClient: Partial<Client>) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  getClientById: (clientId: string) => Client | undefined;
  isLoading: boolean;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedClients = await apiService.fetchClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Failed to load clients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const addClient = async (client: Omit<Client, 'id'>) => {
    const newClient = await apiService.addClient(client);
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = async (clientId: string, updatedClient: Partial<Client>) => {
    const result = await apiService.updateClient(clientId, updatedClient);
    setClients(prev => prev.map(c => c.id === clientId ? result : c));
  };
  
  const deleteClient = async (clientId: string) => {
    await apiService.deleteClient(clientId);
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const getClientById = (clientId: string) => {
      return clients.find(c => c.id === clientId);
  }

  const value = useMemo(() => ({
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    isLoading,
  }), [clients, isLoading]);

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = (): ClientsContextType => {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};
