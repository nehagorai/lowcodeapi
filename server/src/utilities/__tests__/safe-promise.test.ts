import { describe, it, expect } from '@jest/globals';
import safePromise from '../safe-promise';

describe('safePromise', () => {
  it('should resolve and return [null, data] for a successful promise', async () => {
    const promise = Promise.resolve('success');
    const [err, data] = await safePromise(promise);
    expect(err).toBeNull();
    expect(data).toBe('success');
  });

  it('should catch and return [error] for a rejected promise', async () => {
    const error = new Error('fail');
    const promise = Promise.reject(error);
    const [err, data] = await safePromise(promise);
    expect(err).toBe(error);
    expect(data).toBeUndefined();
  });

  it('should handle non-Error rejection values', async () => {
    const promise = Promise.reject('fail-string');
    const [err, data] = await safePromise(promise);
    expect(err).toBe('fail-string');
    expect(data).toBeUndefined();
  });
});
