import { z } from 'zod';
import { validateInput } from '../../../shared/infra/http/ValidateInput';
import { authMiddleware } from '../../../shared/infra/http/AuthMiddleware';
import express from 'express';
import { db } from '../../../shared/infra/db/client';
import { CreateCategory } from '../application/CreateCategory';
import { DatabaseCategoryRepository } from '../repository/DatabaseCategoryRepository';

export const categoryRouter = express.Router();

categoryRouter.post('/', authMiddleware, validateInput(z.object({
    description: z.string(),
})), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseCategoryRepository(tx);
        const useCase = new CreateCategory(repo);
        return await useCase.execute(req.body);
    });
    res.json(result);
});
