
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Goal } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface GoalsContextType {
  goals: Goal[];
  brandGoals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<Goal>;
  updateGoal: (goalId: string, updatedGoal: Partial<Goal>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  toggleSubTask: (goalId: string, subTaskId: string) => Promise<void>;
  isLoading: boolean;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedGoals = await apiService.fetchGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error("Failed to load goals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const addGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
    const newGoal = await apiService.addGoal(goal);
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = async (goalId: string, updatedGoal: Partial<Goal>) => {
    const result = await apiService.updateGoal(goalId, updatedGoal);
    setGoals(prev => prev.map(g => g.id === goalId ? result : g));
  };
  
  const deleteGoal = async (goalId: string) => {
    await apiService.deleteGoal(goalId);
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };
  
  const toggleSubTask = async (goalId: string, subTaskId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedSubTasks = goal.subTasks.map(st => 
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
    );

    await updateGoal(goalId, { subTasks: updatedSubTasks });
  };

  const brandGoals = useMemo(() => {
    if (!currentBrand) return [];
    return goals.filter(g => g.brandId === currentBrand.id);
  }, [goals, currentBrand]);

  const value = useMemo(() => ({
    goals,
    brandGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleSubTask,
    isLoading,
  }), [goals, brandGoals, isLoading]);

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = (): GoalsContextType => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};
