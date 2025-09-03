import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

describe('notify', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should log info if notification is disabled', async () => {
    jest.mock('axios');
    jest.mock('../index', () => ({
      safePromise: jest.fn(),
      loggerService: { info: jest.fn() },
    }));

    process.env.INTERNAL_API_ENDPOINT = '';
    process.env.INTERNAL_API_TOKEN = '';
    process.env.INTERNAL_TELEGRAM_CHAT_ID = '';
    process.env.INTERNAL_TELEGRAM_CHAT_ID_FOR_ERROR = '';

    const { loggerService } = await import('../index');
    const notify = (await import('../notify')).default;
    const axios = (await import('axios')).default;

    await notify('test message');
    expect(loggerService.info).toHaveBeenCalled();
    expect(axios).not.toHaveBeenCalled();
  });

  it('should call axios if notification is enabled', async () => {
    jest.mock('axios');
    jest.mock('../index', () => ({
      safePromise: jest.fn((promise: Promise<any>) => promise.then((res: any) => [null, res])),
      loggerService: { info: jest.fn() },
    }));

    process.env.INTERNAL_API_ENDPOINT = 'http://api';
    process.env.INTERNAL_API_TOKEN = 'token';
    process.env.INTERNAL_TELEGRAM_CHAT_ID = 'chatid';

    const notify = (await import('../notify')).default;
    const axios = (await import('axios')).default;
    (axios as any).mockResolvedValue({});

    await notify('test message');
    expect(axios).toHaveBeenCalled();
  });

  it('should log to console if axios fails', async () => {
    jest.mock('axios');
    jest.mock('../index', () => ({
      safePromise: (jest.fn() as any).mockResolvedValueOnce(['error', null]),
      loggerService: { info: jest.fn() },
    }));

    process.env.INTERNAL_API_ENDPOINT = 'http://api';
    process.env.INTERNAL_API_TOKEN = 'token';
    process.env.INTERNAL_TELEGRAM_CHAT_ID = 'chatid';

    const notify = (await import('../notify')).default;
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await notify('test message');
    expect(consoleSpy).toHaveBeenCalledWith('Telegram error', 'error');
    consoleSpy.mockRestore();
  });
}); 