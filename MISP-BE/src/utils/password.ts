import bcrypt from 'bcrypt';

export const DEFAULT_PIN = '123456';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const isBcryptHash = (value?: string | null): boolean => !!value && /^\$2[aby]\$\d{2}\$/.test(value);

// PINs written before hashing was introduced are plain text; accept them once so login can upgrade them
export const compareSecret = async (raw: string, stored?: string | null): Promise<boolean> => {
  if (!raw || !stored) return false;
  return isBcryptHash(stored) ? bcrypt.compare(raw, stored) : raw === stored;
};
