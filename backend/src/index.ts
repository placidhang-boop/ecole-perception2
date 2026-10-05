import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { config } from './config';
import authRouter from './routes/auth';
import schoolYearRouter from './routes/schoolYears';
import studentRouter from './routes/students';
import paymentRouter from './routes/payments';
import dashboardRouter from './routes/dashboard';
import reportRouter from './routes/reports';
import settingRouter from './routes/settings';

const app = express();
const prisma = new PrismaClient();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", 'http://localhost:3000'],
        objectSrc: ["'none'"]
      }
    }
  })
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/school-years', schoolYearRouter);
app.use('/api/students', studentRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportRouter);
app.use('/api/settings', settingRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

async function start() {
  await prisma.$connect();
  console.log('Prisma connected');

  app.listen(config.port, () => {
    console.log(`Backend running on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error('Startup failed:', error);
  process.exit(1);
});
