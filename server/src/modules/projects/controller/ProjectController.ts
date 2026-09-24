import { z } from 'zod';
import { validateInput } from '../../../shared/infra/http/ValidateInput';
import { authMiddleware } from '../../../shared/infra/http/AuthMiddleware';
import express from 'express';
import { db } from '../../../shared/infra/db/client';
import { CreateProject } from '../application/CreateProject';
import { ListVendors } from '../application/ListVendors';
import { ListItems } from '../application/ListItems';
import { ListProjects } from '../application/ListProjects';
import { GetProjectById } from '../application/GetProjectById';
import { DatabaseProjectRepository } from '../repository/DatabaseProjectRepository';
import { Authorizer } from '../../users/application/Authorizer';

export const projectRouter = express.Router();

projectRouter.get('/:projectId/vendors', authMiddleware, async (req, res) => {
    const useCase = new Authorizer(new ListVendors(db), db);
    const result = await useCase.execute({ projectId: req.params.projectId, userId: (req as any).user.id, name: req.query.name as string | undefined }, ['vendor:read']);
    res.json(result);
});

projectRouter.get('/:projectId/items', authMiddleware, async (req, res) => {
    const useCase = new Authorizer(new ListItems(db), db);
    const result = await useCase.execute({ projectId: req.params.projectId, userId: (req as any).user.id }, ['item:read']);
    res.json(result);
});

projectRouter.get('/', authMiddleware, async (req, res) => {
    const useCase = new ListProjects(db);
    const result = await useCase.execute({ userId: (req as any).user.id });
    res.json(result);
});

projectRouter.get('/:projectId', authMiddleware, async (req, res) => {
    const useCase = new Authorizer(new GetProjectById(db), db);
    const result = await useCase.execute({ projectId: req.params.projectId, userId: (req as any).user.id }, ['project:read']);
    return res.json(result);
});

projectRouter.post('/', authMiddleware, validateInput(z.object({ name: z.string(), description: z.string() })), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseProjectRepository(tx);
        const useCase = new CreateProject(repo);
        return await useCase.execute({ name: req.body.name, description: req.body.description, creatorUserId: (req as any).user.id });
    });
    res.json(result);
});
