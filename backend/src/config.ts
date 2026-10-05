import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@school.local',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@123!',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db'
};
