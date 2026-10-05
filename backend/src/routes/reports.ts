import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/summary', requireAuth, async (_req, res) => {
  const [students, payments, staff, expenses, revenue, schoolYears, notifications] = await Promise.all([
    prisma.student.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.staffMember.count(),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.revenue.aggregate({ _sum: { amount: true } }),
    prisma.schoolYear.count(),
    prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 10 })
  ]);

  const totalRevenue = Number(payments._sum.amount || 0) + Number(revenue._sum.amount || 0);
  const totalExpenses = Number(expenses._sum.amount || 0);

  res.json({
    summary: {
      students,
      payments: totalRevenue,
      staff,
      schoolYears,
      expenses: totalExpenses,
      net: totalRevenue - totalExpenses
    },
    notifications
  });
});

export default router;
