import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/finance', requireAuth, async (_req, res) => {
  const [payments, expenses, revenue, staffPayments] = await Promise.all([
    prisma.payment.findMany({ orderBy: { date: 'desc' }, take: 20 }),
    prisma.expense.findMany({ orderBy: { date: 'desc' }, take: 20 }),
    prisma.revenue.findMany({ orderBy: { date: 'desc' }, take: 20 }),
    prisma.staffPayment.findMany({ orderBy: { paidAt: 'desc' }, take: 20 })
  ]);

  res.json({ payments, expenses, revenue, staffPayments });
});

export default router;
