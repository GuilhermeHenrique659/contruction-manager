import type { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { InvalidPayloadError } from '../../domain/InvalidPayloadError.js';

export function validateInput(schema: z.ZodObject<any>) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse({...req.params, ...req.body, ...req.query});
        if (!result.success) {
            throw new InvalidPayloadError();
        }
        req.body = result.data;
        next();
    };
}
