import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/app', requireAuth, async (_req, res) => {
  const feeTypes = await prisma.feeType.findMany({ orderBy: { name: 'asc' } });
  const supporters = await prisma.supporter.findMany({ orderBy: { name: 'asc' } });
  const categories = await prisma.studentCategory.findMany({ orderBy: { name: 'asc' } });

  res.json({ feeTypes, supporters, categories });
});

router.post('/fee-types', requireAuth, requireAdmin, async (req, res) => {
  const { name, description, amount, periodicity, isRequired } = req.body as {
    name?: string;
    description?: string;
    amount?: number;
    periodicity?: string;
    isRequired?: boolean;
  };

  if (!name) {
    return res.status(400).json({ error: 'Le nom du type de frais est requis.' });
  }

  const feeType = await prisma.feeType.create({
    data: {
      name,
      description: description || null,
      amount: Number(amount || 0),
      periodicity: periodicity || 'MONTHLY',
      isRequired: Boolean(isRequired)
    }
  });

  res.status(201).json(feeType);
});

router.post('/supporters', requireAuth, requireAdmin, async (req, res) => {
  const { name, description, contact, type, details } = req.body as {
    name?: string;
    description?: string;
    contact?: string;
    type?: string;
    details?: string;
  };

  if (!name) {
    return res.status(400).json({ error: 'Le nom du supporteur est requis.' });
  }

  const supporter = await prisma.supporter.create({
    data: {
      name,
      description: description || null,
      contact: contact || null,
      type: type || null,
      details: details || null
    }
  });

  res.status(201).json(supporter);
});

router.post('/categories', requireAuth, requireAdmin, async (req, res) => {
  const { name, description } = req.body as { name?: string; description?: string };
  if (!name) {
    return res.status(400).json({ error: 'Le nom de la catégorie est requis.' });
  }

  const category = await prisma.studentCategory.create({
    data: { name, description: description || null }
  });

  res.status(201).json(category);
});

export default router;
