import { z } from 'zod';
import { validateInput } from '../../../shared/infra/http/ValidateInput.js';
import { authMiddleware } from '../../../shared/infra/http/AuthMiddleware.js';
import express from 'express';
import { db } from '../../../shared/infra/db/client.js';
import { CreateProject } from '../application/CreateProject.js';
import { DatabaseProjectRepository } from '../repository/DatabaseProjectRepository.js';

export const projectRouter = express.Router();

projectRouter.post('/', authMiddleware, validateInput(z.object({ description: z.string(), creatorUserId: z.string() })), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseProjectRepository(tx);
        const useCase = new CreateProject(repo);
        return await useCase.execute(req.body);
    });
    res.json(result);
});
