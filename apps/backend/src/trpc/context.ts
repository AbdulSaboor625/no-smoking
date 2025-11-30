import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface CreateContextOptions {
  req: FastifyRequest;
  res: FastifyReply;
}

export async function createContext({ req, res }: CreateContextOptions) {
  // Get user from JWT token
  let userId: string | undefined;

  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      userId = decoded.userId;
    }
  } catch (error) {
    // Token invalid or expired, userId remains undefined
    console.error('JWT verification failed:', error);
  }

  return {
    req,
    res,
    db,
    userId,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
