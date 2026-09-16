import { Project } from '../domain/Project';
import type { ProjectRepository } from '../repository/ProjectRepository';
import { ApplicationError } from '../../../shared/domain/ApplicationError';

type Input = {
  name: string;
  description: string;
  creatorUserId: string;
};

type Output = {
  id: string;
};

export class CreateProject {
    constructor(private readonly repo: ProjectRepository) {}

    async execute(input: Input): Promise<Output> {
        try {
            const project = Project.create(
                { name: input.name, description: input.description },
                input.creatorUserId
            );
            await this.repo.add(project);
            return { id: project.id };
        } catch (error) {
            if (error instanceof Error) {
                throw new ApplicationError(error.message);
            }
            throw new ApplicationError('Erro ao criar projeto');
        }
    }
}
