import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { encryptSensitive } from '../lib/crypto';

const router = Router();
const prisma = new PrismaClient();

router.get('/', requireAuth, async (_req, res) => {
  const students = await prisma.student.findMany({
    include: {
      schoolYear: true,
      promotion: true,
      category: true,
      parent: true,
      supporter: true,
      fees: { include: { feeType: true } },
      payments: true
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(students);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const body = req.body as {
    matricule?: string;
    firstName?: string;
    lastName?: string;
    postName?: string;
    gender?: string;
    birthDate?: string;
    address?: string;
    internalNumber?: string;
    schoolYearId?: string;
    promotionId?: string;
    categoryId?: string;
    parentName?: string;
    parentPhone?: string;
    supporterId?: string;
  };

  if (!body.matricule || !body.firstName || !body.lastName || !body.schoolYearId || !body.promotionId) {
    return res.status(400).json({ error: 'Matricule, prénom, nom, année scolaire et promotion requis.' });
  }

  let parent = null;
  if (body.parentName || body.parentPhone) {
    parent = await prisma.parent.create({
      data: {
        name: body.parentName || 'Parent',
        primaryPhone: body.parentPhone ? encryptSensitive(body.parentPhone) : null,
        address: body.address || null
      }
    });
  }

  const student = await prisma.student.create({
    data: {
      matricule: body.matricule,
      firstName: body.firstName,
      lastName: body.lastName,
      postName: body.postName || null,
      gender: body.gender || null,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
      address: body.address || null,
      internalNumber: body.internalNumber || null,
      schoolYearId: body.schoolYearId,
      promotionId: body.promotionId,
      categoryId: body.categoryId || null,
      parentId: parent?.id || null,
      supporterId: body.supporterId || null,
      status: 'ACTIVE'
    },
    include: {
      schoolYear: true,
      promotion: true,
      category: true,
      parent: true,
      supporter: true
    }
  });

  res.status(201).json(student);
});

export default router;
