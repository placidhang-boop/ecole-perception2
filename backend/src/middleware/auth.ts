import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from './auth';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant.' });
  }

  const token = header.substring(7);
  const payload = verifyJwt(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token invalide.' });
  }

  (req as any).user = payload;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as { role?: string } | undefined;
  if (!user || !['ADMIN'].includes(user.role)) {
    return res.status(403).json({ error: 'Accès réservé à l’administrateur.' });
  }

  next();
}

export function requireAnyRole(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as { role?: string } | undefined;
  if (!user || !['ADMIN', 'PERCEPTEUR'].includes(user.role)) {
    return res.status(403).json({ error: 'Rôle non autorisé.' });
  }

  next();
}
