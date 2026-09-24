import { z } from 'zod';
import { validateInput } from '../../../shared/infra/http/ValidateInput';
import { authMiddleware } from '../../../shared/infra/http/AuthMiddleware';
import express from 'express';
import { db } from '../../../shared/infra/db/client';
import { CreateVendor } from '../application/CreateVendor';
import { UpdateVendor } from '../application/UpdateVendor';
import { DatabaseVendorRepository } from '../repository/DatabaseVendorRepository';
import { Authorizer } from '../../users/application/Authorizer';

export const vendorRouter = express.Router();

vendorRouter.post('/', authMiddleware, validateInput(z.object({ name: z.string(), paymentDay: z.number().nullable(), projectId: z.string().uuid() })), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseVendorRepository(tx);
        const useCase = new Authorizer(new CreateVendor(repo), db);
        return await useCase.execute({ ...req.body, userId: (req as any).user.id, paymentDay: req.body.paymentDay !== null ? Number(req.body.paymentDay) : null }, ['vendor:create']);
    });
    res.json(result);
});

vendorRouter.put('/:id', authMiddleware, validateInput(z.object({ id: z.string().uuid(), name: z.string().optional(), paymentDay: z.number().nullable().optional() })), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseVendorRepository(tx);
        const useCase = new UpdateVendor(repo);
        return await useCase.execute({ id: req.params.id, ...req.body });
    });
    res.json(result);
});
