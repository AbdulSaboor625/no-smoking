import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { profiles } from '../db/schema.js';
import { calculateTrialEndDate } from '../lib/stripe.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(50).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const checkEmailSchema = z.object({
  email: z.string().email(),
});

// Temporary users table (in-memory for now, should be in database)
interface User {
  id: string;
  email: string;
  passwordHash: string;
  username?: string;
  createdAt: Date;
}

const users: Map<string, User> = new Map();

export async function authRoutes(fastify: FastifyInstance) {
  // Check if email exists
  fastify.post('/auth/check-email', async (request, reply) => {
    try {
      const body = checkEmailSchema.parse(request.body);

      // Check if user exists in memory
      const existingUser = Array.from(users.values()).find((u) => u.email === body.email);
      if (existingUser) {
        return reply.send({ exists: true });
      }

      // Check if email exists in database
      const existingProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, body.email))
        .limit(1);

      return reply.send({ exists: existingProfile.length > 0 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      throw error;
    }
  });

  // Signup
  fastify.post('/auth/signup', async (request, reply) => {
    try {
      console.log('📥 Signup request body:', request.body);
      const body = signupSchema.parse(request.body);

      // Check if user already exists in memory
      const existingUser = Array.from(users.values()).find((u) => u.email === body.email);
      if (existingUser) {
        return reply.code(400).send({ error: 'User already exists' });
      }

      // Check if email already exists in database (emails must be unique)
      const existingProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, body.email))
        .limit(1);

      if (existingProfile.length > 0) {
        return reply.code(400).send({ error: 'Email already registered. Please use a different email or login.' });
      }

      // Note: Usernames can be duplicate - no validation needed

      // Hash password
      const passwordHash = await bcrypt.hash(body.password, 10);

      // Create user
      const user: User = {
        id: Math.random().toString(36).substring(7),
        email: body.email,
        passwordHash,
        username: body.username,
        createdAt: new Date(),
      };

      users.set(user.id, user);

      // Calculate trial end date (7 days from now)
      const trialStartDate = new Date();
      const trialEndDate = calculateTrialEndDate(trialStartDate);

      // Create profile in database with trial dates
      await db.insert(profiles).values({
        id: user.id,
        email: user.email,
        username: body.username,
        subscriptionStatus: 'trialing',
        trialStartDate,
        trialEndDate,
      });

      // Generate JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      throw error;
    }
  });

  // Login
  fastify.post('/auth/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);

      // Find user
      const user = Array.from(users.values()).find((u) => u.email === body.email);
      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const validPassword = await bcrypt.compare(body.password, user.passwordHash);
      if (!validPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      throw error;
    }
  });

  // Get current user (protected route)
  fastify.get('/auth/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const userId = (request as any).user.userId;
    const user = users.get(userId);

    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    return reply.send({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  });

  // Logout (client-side only, just removes token)
  fastify.post('/auth/logout', async (_request, reply) => {
    return reply.send({ message: 'Logged out successfully' });
  });
}
