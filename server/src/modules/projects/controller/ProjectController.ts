import { z } from 'zod';
import { validateInput } from '../../../shared/infra/http/ValidateInput';
import { authMiddleware } from '../../../shared/infra/http/AuthMiddleware';
import express from 'express';
import { db } from '../../../shared/infra/db/client';
import { CreateProject } from '../application/CreateProject';
import { ListVendors } from '../application/ListVendors';
import { ListItems } from '../application/ListItems';
import { ListProjects } from '../application/ListProjects';
import { DatabaseProjectRepository } from '../repository/DatabaseProjectRepository';

export const projectRouter = express.Router();

projectRouter.get('/:projectId/vendors', authMiddleware, async (req, res) => {
    const useCase = new ListVendors(db);
    const result = await useCase.execute({ projectId: req.params.projectId, name: req.query.name as string | undefined });
    res.json(result);
});

projectRouter.get('/:projectId/items', authMiddleware, async (req, res) => {
    const useCase = new ListItems(db);
    const result = await useCase.execute({ projectId: req.params.projectId });
    res.json(result);
});

projectRouter.get('/', authMiddleware, async (req, res) => {
    const useCase = new ListProjects(db);
    const result = await useCase.execute({ userId: (req as any).user.id });
    res.json(result);
});

projectRouter.post('/', authMiddleware, validateInput(z.object({ description: z.string() })), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseProjectRepository(tx);
        const useCase = new CreateProject(repo);
        return await useCase.execute({ description: req.body.description, creatorUserId: (req as any).user.id });
    });
    res.json(result);
});
