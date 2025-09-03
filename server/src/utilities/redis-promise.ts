import { promisify } from 'util';
import redisClient, { RedisClientType } from './redis-client';

export default () => {
  let client : RedisClientType = null;
  try {
    client = redisClient();
    const redis = {
      get: promisify(client.get).bind(client),
      set: promisify(client.set).bind(client),
      lpush: promisify(client.lpush).bind(client),
      lpop: promisify(client.lpop).bind(client),
      rpush: promisify(client.rpush).bind(client),
      rpop: promisify(client.rpop).bind(client),
      hgetall: promisify(client.hgetall).bind(client),
      sadd: promisify(client.sadd).bind(client),
      smembers: promisify(client.smembers).bind(client),
      del: promisify(client.del).bind(client),
    };
    return redis;
  } catch (e) {
    throw new Error('Redis conection issue');
  }
};
