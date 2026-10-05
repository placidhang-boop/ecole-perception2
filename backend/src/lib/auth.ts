import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export type AuthPayload = {
  userId: string;
  email: string;
  role: 'ADMIN' | 'PERCEPTEUR';
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwt(payload: AuthPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '8h' });
}

export function verifyJwt(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthPayload;
    return decoded;
  } catch {
    return null;
  }
}
