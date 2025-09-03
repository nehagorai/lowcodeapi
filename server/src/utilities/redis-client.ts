// @ts-ignore
import redis, { RedisClientType } from 'redis';

export default () => {
  let client = null;
  try {
    client = redis.createClient({ host: process.env.REDIS_HOST || 'localhost', port: process.env.REDIS_HOST || 6379 });
    return client;
  } catch (e) {
    throw new Error('Redis conection issue');
  }
};

export { RedisClientType };
