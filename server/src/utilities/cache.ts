import redisClient, { RedisClientType } from './redis-client';
import { loggerService } from '.';

class CacheService {
  private client: RedisClientType;

  constructor() {
    this.client = redisClient();

    this.client.on('error', (err: any) => {
      loggerService.error('Redis error', err);
    });
  }

  public cacheGet(key: string) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheSet(key: string, value: string, ttl: number) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (error: any) => {
        if (error) {
          return reject(error);
        }
        this.client.expire(key, ttl, () => {});
        resolve(null);
      });
    });
  }

  public cacheLPush(key: string, value: any) {
    return new Promise((resolve, reject) => {
      this.client.lpush(key, value, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheLPop(key: string) {
    return new Promise((resolve, reject) => {
      this.client.lpop(key, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheRPush(key: string, value: any) {
    return new Promise((resolve, reject) => {
      this.client.rpush(key, value, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheRPop(key: string) {
    return new Promise((resolve, reject) => {
      this.client.rpop(key, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheHGetAll(key: string, value: any) {
    return new Promise((resolve, reject) => {
      this.client.hgetall(key, value, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheSAdd(key: string, value: any) {
    return new Promise((resolve, reject) => {
      this.client.sadd(key, value, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheSMembers(key: string) {
    return new Promise((resolve, reject) => {
      this.client.smembers(key, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheDel(key: string) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheSRem(key: string, value: any) {
    return new Promise((resolve, reject) => {
      this.client.srem(key, value, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }

  public cacheHmset(key: string, value: any) {
    return new Promise((resolve, reject) => {
      this.client.hmset(key, value, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });
    });
  }
}

const cacheService = new CacheService();

export default cacheService;
