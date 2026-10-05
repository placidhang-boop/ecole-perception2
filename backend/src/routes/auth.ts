import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { hashPassword, signJwt, verifyPassword } from '../lib/auth';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides.' });
  }

  const ok = await verifyPassword(user.password, password);
  if (!ok) {
    return res.status(401).json({ error: 'Identifiants invalides.' });
  }

  const token = signJwt({ userId: user.id, email: user.email, role: user.role as 'ADMIN' | 'PERCEPTEUR' });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: (req as any).user.email },
    select: { id: true, email: true, name: true, role: true, active: true, createdAt: true }
  });

  res.json({ user });
});

router.post('/register-admin', async (req, res) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, nom et mot de passe requis.' });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return res.status(409).json({ error: 'Un compte avec cet email existe déjà.' });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: await hashPassword(password),
      role: 'ADMIN'
    }
  });

  const token = signJwt({ userId: user.id, email: user.email, role: user.role as 'ADMIN' | 'PERCEPTEUR' });

  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.get('/seed-default', async (_req, res) => {
  const count = await prisma.user.count();
  if (count > 0) {
    return res.json({ seeded: false, message: 'Un compte existe déjà.' });
  }

  const password = await hashPassword(config.adminPassword);
  const user = await prisma.user.create({
    data: {
      email: config.adminEmail,
      name: 'Admin principal',
      password,
      role: 'ADMIN'
    }
  });

  res.json({ seeded: true, user: { id: user.id, email: user.email, role: user.role } });
});

export default router;
