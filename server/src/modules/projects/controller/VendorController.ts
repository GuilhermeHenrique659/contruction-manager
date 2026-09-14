import { z } from 'zod';
import { validateInput } from '../../../shared/infra/http/ValidateInput.js';
import { authMiddleware } from '../../../shared/infra/http/AuthMiddleware.js';
import express from 'express';
import { db } from '../../../shared/infra/db/client.js';
import { CreateVendor } from '../application/CreateVendor.js';
import { UpdateVendor } from '../application/UpdateVendor.js';
import { DatabaseVendorRepository } from '../repository/DatabaseVendorRepository.js';

export const vendorRouter = express.Router();

vendorRouter.post('/', authMiddleware, validateInput(z.object({ name: z.string(), paymentDay: z.number().nullable(), projectId: z.string() })), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseVendorRepository(tx);
        const useCase = new CreateVendor(repo);
        return await useCase.execute({ ...req.body, paymentDay: req.body.paymentDay !== null ? Number(req.body.paymentDay) : null });
    });
    res.json(result);
});

vendorRouter.put('/:id', authMiddleware, validateInput(z.object({ id: z.string(), name: z.string().optional(), paymentDay: z.number().nullable().optional() })), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseVendorRepository(tx);
        const useCase = new UpdateVendor(repo);
        return await useCase.execute({ id: req.params.id, ...req.body });
    });
    res.json(result);
});
