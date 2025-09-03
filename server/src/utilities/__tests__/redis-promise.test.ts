import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

describe('redis-promise', () => {
  let mockClient: { [key: string]: any };
  let mockPromisify: jest.Mock;
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    mockClient = {
      get: jest.fn(),
      set: jest.fn(),
      lpush: jest.fn(),
      lpop: jest.fn(),
      rpush: jest.fn(),
      rpop: jest.fn(),
      hgetall: jest.fn(),
      sadd: jest.fn(),
      smembers: jest.fn(),
      del: jest.fn(),
    };
    mockPromisify = jest.fn((fn) => fn);
    jest.doMock('util', () => ({ promisify: mockPromisify }));
    jest.doMock('../redis-client', () => ({ __esModule: true, default: () => mockClient }));
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should return all promisified methods bound to client', async () => {
    const getRedis = (await import('../redis-promise')).default;
    const redis = getRedis() as { [key: string]: any };
    const methods = ['get', 'set', 'lpush', 'lpop', 'rpush', 'rpop', 'hgetall', 'sadd', 'smembers', 'del'];
    methods.forEach((method) => {
      expect(typeof redis[method]).toBe('function');
      expect(mockPromisify).toHaveBeenCalledWith(mockClient[method]);
    });
    expect(mockPromisify).toHaveBeenCalledTimes(methods.length);
  });

  it('should throw an error if redis-client throws', async () => {
    jest.doMock('../redis-client', () => ({ __esModule: true, default: () => { throw new Error('fail'); } }));
    const getRedis = (await import('../redis-promise')).default;
    expect(() => getRedis()).toThrow('Redis conection issue');
  });
});
