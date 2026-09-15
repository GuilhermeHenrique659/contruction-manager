import { z } from 'zod';
import { validateInput } from '../../../shared/infra/http/ValidateInput';
import { authMiddleware } from '../../../shared/infra/http/AuthMiddleware';
import express from 'express';
import { db } from '../../../shared/infra/db/client';
import { CreateItem } from '../application/CreateItem';
import { AddOrderToItem } from '../application/AddOrderToItem';
import { DatabaseItemRepository } from '../repository/DatabaseItemRepository';
import { DatabaseProjectRepository } from '../repository/DatabaseProjectRepository';
import { DatabaseCategoryRepository } from '../repository/DatabaseCategoryRepository';
import { DatabaseVendorRepository } from '../repository/DatabaseVendorRepository';

export const itemRouter = express.Router();

itemRouter.post('/', authMiddleware, validateInput(z.object({
    description: z.string(),
    categoryId: z.string(),
    projectId: z.string(),
})), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const itemRepo = new DatabaseItemRepository(tx);
        const projectRepo = new DatabaseProjectRepository(tx);
        const categoryRepo = new DatabaseCategoryRepository(tx);
        const useCase = new CreateItem(itemRepo, projectRepo, categoryRepo);
        return await useCase.execute(req.body);
    });
    res.json(result);
});

itemRouter.post('/:itemId/orders', authMiddleware, validateInput(z.object({
    itemId: z.string(),
    quantity: z.number(),
    price: z.number(),
    vendorId: z.string(),
    status: z.enum(['pending_payment', 'paid']).optional(),
    purchasedAt: z.string().optional(),
})), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const itemRepo = new DatabaseItemRepository(tx);
        const vendorRepo = new DatabaseVendorRepository(tx);
        const useCase = new AddOrderToItem(itemRepo, vendorRepo);
        return await useCase.execute({
            ...req.body,
            itemId: req.params.itemId,
        });
    });
    res.json(result);
});
