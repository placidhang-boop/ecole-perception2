import crypto from 'crypto';

export function encryptSensitive(value: string): string {
  const key = crypto.createHash('sha256').update(process.env.FIELD_ENC_KEY || 'dev-field-key').digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptSensitive(value: string): string {
  const key = crypto.createHash('sha256').update(process.env.FIELD_ENC_KEY || 'dev-field-key').digest();
  const [ivHex, encryptedHex] = value.split(':');
  if (!ivHex || !encryptedHex) return value;

  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
}
