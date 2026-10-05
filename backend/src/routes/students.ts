import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', requireAuth, async (_req, res) => {
  const years = await prisma.schoolYear.findMany({
    orderBy: { startDate: 'desc' },
    include: { promotions: true }
  });

  res.json(years);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, startDate, endDate } = req.body as {
    name?: string;
    startDate?: string;
    endDate?: string;
  };

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ error: 'Nom, startDate et endDate requis.' });
  }

  const year = await prisma.schoolYear.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: false
    }
  });

  res.status(201).json(year);
});

router.patch('/:id/activate', requireAuth, requireAdmin, async (req, res) => {
  await prisma.schoolYear.updateMany({ data: { isActive: false } });
  const year = await prisma.schoolYear.update({
    where: { id: req.params.id },
    data: { isActive: true }
  });

  res.json(year);
});

router.post('/:id/promotions', requireAuth, requireAdmin, async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name) {
    return res.status(400).json({ error: 'Le nom de la promotion est requis.' });
  }

  const promotion = await prisma.promotion.create({
    data: {
      name,
      schoolYearId: req.params.id,
      isActive: true
    }
  });

  res.status(201).json(promotion);
});

export default router;
