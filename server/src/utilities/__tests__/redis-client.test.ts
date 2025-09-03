import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

describe('redis-client', () => {
  const OLD_ENV = process.env;
  let createClientMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    createClientMock = jest.fn();
    jest.doMock('redis', () => ({
      createClient: createClientMock,
    }));
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should return the client when createClient succeeds', async () => {
    const fakeClient = { connected: true };
    createClientMock.mockReturnValue(fakeClient);
    const getClient = (await import('../redis-client')).default;
    const client = getClient();
    expect(client).toBe(fakeClient);
    expect(createClientMock).toHaveBeenCalled();
  });

  it('should throw an error when createClient throws', async () => {
    createClientMock.mockImplementation(() => { throw new Error('fail'); });
    const getClient = (await import('../redis-client')).default;
    expect(() => getClient()).toThrow('Redis conection issue');
  });

  it('should use host and port from env vars', async () => {
    process.env.REDIS_HOST = 'myhost';
    process.env.REDIS_PORT = '1234';
    createClientMock.mockReturnValue({});
    const getClient = (await import('../redis-client')).default;
    getClient();
    expect(createClientMock).toHaveBeenCalledWith({ host: 'myhost', port: 'myhost' });
  });
}); 