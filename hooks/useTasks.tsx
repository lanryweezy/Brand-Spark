
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Task } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface TasksContextType {
  tasks: Task[];
  brandTasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTasksByProjectId: (projectId: string) => Task[];
  isLoading: boolean;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await apiService.fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const addTask = async (task: Omit<Task, 'id'>) => {
    const newTask = await apiService.addTask(task);
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    const result = await apiService.updateTask(taskId, updatedTask);
    setTasks(prev => prev.map(t => t.id === taskId ? result : t));
  };
  
  const deleteTask = async (taskId: string) => {
    await apiService.deleteTask(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const brandTasks = useMemo(() => {
    if (!currentBrand) return [];
    return tasks.filter(t => t.brandId === currentBrand.id);
  }, [tasks, currentBrand]);

  const getTasksByProjectId = (projectId: string) => {
    return brandTasks.filter(t => t.projectId === projectId);
  };

  const value = useMemo(() => ({
    tasks,
    brandTasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByProjectId,
    isLoading
  }), [tasks, brandTasks, getTasksByProjectId, isLoading]);

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
