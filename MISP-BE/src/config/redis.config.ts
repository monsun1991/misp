import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => {
    // Retry up to 3 times, then back off gracefully
    if (times > 3) return null;
    return Math.min(times * 100, 2000);
  },
  maxRetriesPerRequest: 1,
};

export const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('error', (error) => {
  // Avoid crashing app if Redis has a transient error
  console.warn('⚠️ Redis error:', error.message);
});

export default redisConfig;
