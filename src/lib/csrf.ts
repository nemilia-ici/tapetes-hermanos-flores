import csrf from 'csrf';

const csrfProtection = csrf();

export function generateCsrfToken(): string {
  // Usar una clave secreta desde variables de entorno
  const secret = process.env.CSRF_SECRET || 'fallback-secret-cambiame';
  return csrfProtection.create(secret);
}

export function verifyCsrfToken(token: string): boolean {
  const secret = process.env.CSRF_SECRET || 'fallback-secret-cambiame';
  try {
    return csrfProtection.verify(secret, token);
  } catch {
    return false;
  }
}
