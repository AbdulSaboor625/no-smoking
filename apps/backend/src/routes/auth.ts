import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { profiles } from '../db/schema.js';

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

export async function authRoutes(fastify: FastifyInstance) {
  // Check if email exists
  fastify.post('/auth/check-email', async (request, reply) => {
    try {
      const body = checkEmailSchema.parse(request.body);

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

      // Generate user ID
      const userId = Math.random().toString(36).substring(7);

      // Create profile in database with password hash
      // User starts with 'incomplete' status - they need to provide payment details to start trial
      await db.insert(profiles).values({
        id: userId,
        email: body.email,
        username: body.username,
        passwordHash: passwordHash,
        subscriptionStatus: 'incomplete',
        trialStartDate: null,
        trialEndDate: null,
      });

      // Generate JWT
      const token = jwt.sign({ userId, email: body.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return reply.send({
        user: {
          id: userId,
          email: body.email,
          username: body.username,
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

      // Find user in database
      const userProfiles = await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, body.email))
        .limit(1);

      if (userProfiles.length === 0) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      const profile = userProfiles[0];

      // Check if password hash exists
      if (!profile.passwordHash) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const validPassword = await bcrypt.compare(body.password, profile.passwordHash);
      if (!validPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ userId: profile.id, email: profile.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return reply.send({
        user: {
          id: profile.id,
          email: profile.email,
          username: profile.username,
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

    // Get user from database
    const userProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (userProfiles.length === 0) {
      return reply.code(404).send({ error: 'User not found' });
    }

    const profile = userProfiles[0];

    return reply.send({
      id: profile.id,
      email: profile.email,
      username: profile.username,
    });
  });

  // Logout (client-side only, just removes token)
  fastify.post('/auth/logout', async (_request, reply) => {
    return reply.send({ message: 'Logged out successfully' });
  });
}
