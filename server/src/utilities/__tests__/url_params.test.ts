import { describe, it, expect } from '@jest/globals';
import urlParams from '../url_params';

describe('urlParams', () => {
  it('should stringify a simple object', () => {
    const params = { a: 1, b: 'test' };
    expect(urlParams(params)).toBe('a=1&b=test');
  });

  it('should handle empty object', () => {
    expect(urlParams({})).toBe('');
  });

  it('should encode special characters', () => {
    const params = { q: 'hello world', x: 'a&b' };
    expect(urlParams(params)).toBe('q=hello%20world&x=a%26b');
  });

  it('should handle array values', () => {
    const params = { arr: [1, 2, 3] };
    expect(urlParams(params)).toBe('arr=1&arr=2&arr=3');
  });

  it('should handle null and undefined values', () => {
    const params = { a: null, c: 1 };
    // query-string omits null/undefined by default
    expect(urlParams(params)).toBe('a&c=1');
  });
});
