
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { Project } from '../types';
import * as apiService from '../services/apiService';
import { useCurrentBrand } from './useCurrentBrand';

interface ProjectsContextType {
  projects: Project[];
  brandProjects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (projectId: string, updatedProject: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  getProjectById: (projectId: string) => Project | undefined;
  isLoading: boolean;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentBrand } = useCurrentBrand();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedProjects = await apiService.fetchProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const addProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
    const newProject = await apiService.addProject(project);
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = async (projectId: string, updatedProject: Partial<Project>) => {
    const result = await apiService.updateProject(projectId, updatedProject);
    setProjects(prev => prev.map(p => p.id === projectId ? result : p));
  };
  
  const deleteProject = async (projectId: string) => {
    await apiService.deleteProject(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const getProjectById = (projectId: string) => {
      return projects.find(p => p.id === projectId);
  }

  const brandProjects = useMemo(() => {
    if (!currentBrand) return [];
    return projects.filter(p => p.brandId === currentBrand.id);
  }, [projects, currentBrand]);

  const value = useMemo(() => ({
    projects,
    brandProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    isLoading
  }), [projects, brandProjects, isLoading]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
