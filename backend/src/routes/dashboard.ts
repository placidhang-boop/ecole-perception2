import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, requireAuth, requireAnyRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', requireAuth, async (_req, res) => {
  const payments = await prisma.payment.findMany({
    include: { student: true, feeType: true },
    orderBy: { createdAt: 'desc' }
  });

  res.json(payments);
});

router.post('/', requireAnyRole, async (req, res) => {
  const body = req.body as {
    studentId?: string;
    feeTypeId?: string;
    amount?: number;
    period?: string;
    date?: string;
    mode?: string;
    notes?: string;
    recordedBy?: string;
  };

  if (!body.studentId || !body.amount || !body.date) {
    return res.status(400).json({ error: 'Étudiant et montant requis.' });
  }

  const payment = await prisma.payment.create({
    data: {
      studentId: body.studentId,
      feeTypeId: body.feeTypeId || null,
      amount: Number(body.amount),
      period: body.period || null,
      date: new Date(body.date),
      mode: body.mode || 'ESPECES',
      notes: body.notes || null,
      recordedBy: body.recordedBy || 'Système'
    },
    include: { student: true, feeType: true }
  });

  const fee = await prisma.studentFee.findFirst({
    where: { studentId: body.studentId, feeTypeId: body.feeTypeId || undefined },
    orderBy: { createdAt: 'desc' }
  });

  if (fee) {
    const paid = Number(fee.paid) + Number(body.amount);
    const expected = Number(fee.expected || fee.amount);
    const balance = Math.max(expected - paid, 0);

    await prisma.studentFee.update({
      where: { id: fee.id },
      data: {
        paid,
        balance,
        status: balance > 0 ? 'PARTIAL' : 'PAID'
      }
    });
  }

  res.status(201).json(payment);
});

router.get('/summary', requireAuth, async (_req, res) => {
  const total = await prisma.payment.aggregate({ _sum: { amount: true } });
  res.json({ total: total._sum.amount || 0 });
});

router.post('/staff', requireAuth, requireAdmin, async (req, res) => {
  const body = req.body as {
    staffId?: string;
    amount?: number;
    reason?: string;
    paidAt?: string;
    recordedBy?: string;
  };

  if (!body.staffId || !body.amount || !body.paidAt) {
    return res.status(400).json({ error: 'Staff, montant et date requis.' });
  }

  const payment = await prisma.staffPayment.create({
    data: {
      staffId: body.staffId,
      amount: Number(body.amount),
      reason: body.reason || 'Paiement personnel',
      paidAt: new Date(body.paidAt),
      recordedBy: body.recordedBy || 'Admin'
    },
    include: { staff: true }
  });

  res.status(201).json(payment);
});

export default router;
