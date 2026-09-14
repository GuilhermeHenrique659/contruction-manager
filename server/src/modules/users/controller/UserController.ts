import { z } from 'zod';
import { validateInput } from '../../../shared/infra/http/ValidateInput.js';
import express from 'express';
import { db } from '../../../shared/infra/db/client.js';
import { DatabaseUserRepository } from '../repository/DatabaseUserRepository.js';
import { Login } from '../application/Login.js';
import { Register } from '../application/Register.js';

export const userRouter = express.Router();

userRouter.post('/register', validateInput(z.object({ name: z.string(), email: z.string() })), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseUserRepository(tx);
        const register = new Register(repo);
        return await register.execute(req.body);
    });
    res.json(result);
});

userRouter.post('/login', validateInput(z.object({ email: z.string(), password: z.string().optional() })), async (req, res) => {
    const result = await db.transaction(async (tx) => {
        const repo = new DatabaseUserRepository(tx);
        const login = new Login(repo);
        return await login.execute(req.body);
    });
    res.json(result);
});
