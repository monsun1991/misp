import { redisClient } from "../config/redis.config";

// In-memory fallback if Redis is unreachable
const memoryFallback = new Map<string, { value: string; expiresAt: number }>();

export const getFromCache = async <T = any>(key: string): Promise<T | null> => {
  try {
    const value = await redisClient.get(key);
    if (value) {
      return JSON.parse(value) as T;
    }
  } catch (_error) {
    const item = memoryFallback.get(key);
    if (item && item.expiresAt > Date.now()) {
      return JSON.parse(item.value) as T;
    }
    memoryFallback.delete(key);
  }
  return null;
};

export const storeIntoCache = async (
  key: string,
  value: any,
  expiresAt: number = 3600
): Promise<boolean> => {
  const valueString = JSON.stringify(value);
  try {
    await redisClient.setex(key, expiresAt, valueString);
    return true;
  } catch (_error) {
    memoryFallback.set(key, {
      value: valueString,
      expiresAt: Date.now() + expiresAt * 1000,
    });
    return true;
  }
};

export const deleteFromCache = async (key: string): Promise<boolean> => {
  try {
    await redisClient.del(key);
  } catch (_error) {
    memoryFallback.delete(key);
  }
  return true;
};
