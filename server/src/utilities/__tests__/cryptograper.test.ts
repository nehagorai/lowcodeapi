import { describe, it, expect, jest } from '@jest/globals';

// Mock config before importing cryptograper
jest.mock('../../config', () => ({
  ENCRYPTION_KEY: 'test_secret_key',
}));

import CryptoJS from 'crypto-js';
import cryptograper from '../cryptograper';

const TEST_KEY = { foo: 'bar', baz: 'qux' };

describe('cryptograper', () => {
  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt an object correctly', () => {
      const { value } = cryptograper.encrypt(TEST_KEY);
      const decrypted = cryptograper.decrypt(value);
      expect(JSON.parse(decrypted)).toEqual(TEST_KEY);
    });

    it('should throw if ENCRYPTION_KEY is missing', () => {
      jest.resetModules();
      jest.doMock('../../config', () => ({ ENCRYPTION_KEY: undefined }));
      const cryptograperNoKey = require('../cryptograper').default;
      expect(() => cryptograperNoKey.encrypt(TEST_KEY)).toThrow('ENCRYPTION_KEY is not define in .env');
    });
  });

  describe('maskKeys', () => {
    it('should mask all values in an object', () => {
      const masked = cryptograper.maskKeys({ a: '1234567890', b: 'abcdefghij' });
      expect(masked.a).toMatch(/^[a-zA-Z0-9]{1,4}\*{16}[a-zA-Z0-9]{1,4}$/);
      expect(masked.b).toMatch(/^[a-zA-Z0-9]{1,4}\*{16}[a-zA-Z0-9]{1,4}$/);
    });
  });

  describe('generateMD5', () => {
    it('should return the correct MD5 hash', () => {
      const hash = cryptograper.generateMD5('hello');
      expect(hash).toBe(CryptoJS.MD5('hello').toString());
    });
  });

  describe('edge cases', () => {
    it('should handle empty object for maskKeys', () => {
      expect(cryptograper.maskKeys({})).toEqual({});
    });
    it('should handle short tokens in maskKeys', () => {
      const masked = cryptograper.maskKeys({ a: 'abc' });
      expect(masked.a).toContain('*');
    });
  });
});
