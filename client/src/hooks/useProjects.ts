import { useState, useEffect, useCallback } from 'react';
import { Project } from '../features/projects/model/ProjectModel';
import { ListProjects } from '../features/projects/application/ListProjects';
import { CreateProject } from '../features/projects/application/CreateProject';
import { FetchProjectGateway } from '../features/projects/gateway/FetchProjectGateway';

const gateway = new FetchProjectGateway();
const listProjectsUseCase = new ListProjects(gateway);
const createProjectUseCase = new CreateProject(gateway);

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { projects: loadedProjects } = await listProjectsUseCase.execute({});
      setProjects(loadedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (input: { name: string; description: string }) => {
    setIsCreating(true);
    setError(null);
    try {
      const createdProject = await createProjectUseCase.execute(input);
      // Fetch the full project with members
      if (createdProject) {
        setProjects(prev => [createdProject, ...prev]);
      } else {
        setProjects(prev => [createdProject, ...prev]);
      }
      return createdProject || createdProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto');
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    isCreating,
    error,
    createProject,
    refetch: loadProjects,
  };
}