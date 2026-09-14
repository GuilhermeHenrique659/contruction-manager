import type { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { InvalidPayloadError } from '../../domain/InvalidPayloadError.js';

export function validateInput(schema: z.ZodObject<unknown>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            throw new InvalidPayloadError();
        }
        req.body = result.data;
        next();
    };
}
