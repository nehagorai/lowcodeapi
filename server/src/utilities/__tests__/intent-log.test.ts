import { describe, it, expect, jest } from '@jest/globals';
import intentLog from '../intent-log';

describe('intentLog', () => {
  it('should log the correct message to the console', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await intentLog('provider1', 'GET', 'intentA', 'user123');
    expect(spy).toHaveBeenCalledWith(
      'intent log',
      'provider1',
      'GET',
      'intentA',
      'user123',
    );
    spy.mockRestore();
  });
});
