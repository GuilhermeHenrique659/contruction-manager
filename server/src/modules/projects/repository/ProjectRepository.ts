import { type Project } from "../domain/Project";

export interface ProjectRepository {
  getById(id: string): Promise<Project | null>;
  add(project: Project): Promise<void>;
  update(project: Project): Promise<void>;  
}
