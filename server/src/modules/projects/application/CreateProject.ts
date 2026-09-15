import { Project } from '../domain/Project';
import type { ProjectRepository } from '../repository/ProjectRepository';

type Input = {
  description: string;
  creatorUserId: string;
};

type Output = {
  id: string;
};

export class CreateProject {
    constructor(private readonly repo: ProjectRepository) {}

    async execute(input: Input): Promise<Output> {
        const project = Project.create(
            { description: input.description },
            input.creatorUserId
        );
        await this.repo.add(project);
        return { id: project.id };
    }
}
