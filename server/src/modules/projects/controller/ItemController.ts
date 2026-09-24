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
import { Authorizer } from '../../users/application/Authorizer';

export const itemRouter = express.Router();

itemRouter.post('/', authMiddleware, validateInput(z.object({
    description: z.string(),
    categoryId: z.string().uuid(),
    projectId: z.string().uuid(),
})), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const itemRepo = new DatabaseItemRepository(tx);
        const projectRepo = new DatabaseProjectRepository(tx);
        const categoryRepo = new DatabaseCategoryRepository(tx);
        const useCase = new Authorizer(new CreateItem(itemRepo, projectRepo, categoryRepo), db);
        return await useCase.execute({ userId: (req as any).user.id, ...req.body }, ['item:create']);
    });
    res.json(result);
});

itemRouter.post('/:itemId/orders', authMiddleware, validateInput(z.object({
    itemId: z.string().uuid(),
    projectId: z.string().uuid(),
    quantity: z.number(),
    price: z.number(),
    vendorId: z.string().uuid(),
    status: z.enum(['pending_payment', 'paid']).optional(),
    purchasedAt: z.string().optional(),
})), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const itemRepo = new DatabaseItemRepository(tx);
        const vendorRepo = new DatabaseVendorRepository(tx);
        const useCase = new Authorizer(new AddOrderToItem(itemRepo, vendorRepo), db);
        return await useCase.execute({
            ...req.body,
            itemId: req.params.itemId,
            userId: (req as any).user.id,
        }, ['order:create']);
    });
    res.json(result);
});
