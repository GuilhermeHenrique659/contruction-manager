import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export function generateTestToken(userId: string = 'test-user-id') {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}
