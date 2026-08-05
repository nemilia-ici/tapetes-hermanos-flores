import csrf from 'csrf';

const csrfProtection = csrf({ cookie: true });

export function generateCsrfToken(): string {
  return csrfProtection.create('secret-key');
}

export function verifyCsrfToken(token: string): boolean {
  return csrfProtection.verify('secret-key', token);
}
