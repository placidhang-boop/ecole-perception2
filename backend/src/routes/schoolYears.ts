import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const schoolYears = await prisma.schoolYear.findMany({
    orderBy: { startDate: 'desc' }
  });

  res.json(schoolYears);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, startDate, endDate } = req.body as {
    name?: string;
    startDate?: string;
    endDate?: string;
  };

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ error: 'Nom, date de début et date de fin requis.' });
  }

  const schoolYear = await prisma.schoolYear.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: false
    }
  });

  res.status(201).json(schoolYear);
});

router.patch('/:id/activate', requireAuth, requireAdmin, async (req, res) => {
  await prisma.schoolYear.updateMany({ data: { isActive: false } });
  const schoolYear = await prisma.schoolYear.update({
    where: { id: req.params.id },
    data: { isActive: true }
  });

  res.json(schoolYear);
});

export default router;
