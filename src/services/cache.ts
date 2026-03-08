import { createClient, RedisClientType } from 'redis';
import config from '../config';

let client: RedisClientType | null = null;

export async function connectRedis(): Promise<RedisClientType> {
  if (client) return client;
  
  client = createClient({
    url: config.redis.url,
  });
  
  client.on('error', (err) => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('✅ Redis connected'));
  
  await client.connect();
  return client;
}

export async function getRedis(): Promise<RedisClientType> {
  if (!client) {
    return connectRedis();
  }
  return client;
}

// 缓存工具函数
export const CacheService = {
  async get<T>(key: string): Promise<T | null> {
    const redis = await getRedis();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const redis = await getRedis();
    const serialized = JSON.stringify(value);
    
    if (ttlSeconds) {
      await redis.setEx(key, ttlSeconds, serialized);
    } else {
      await redis.set(key, serialized);
    }
  },
  
  async del(key: string): Promise<void> {
    const redis = await getRedis();
    await redis.del(key);
  },
  
  async delPattern(pattern: string): Promise<void> {
    const redis = await getRedis();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  },
  
  // 缓存包装器
  wrap: async function<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttlSeconds: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;
    
    const data = await fetcher();
    await this.set(key, data, ttlSeconds);
    return data;
  }
};

export default CacheService;