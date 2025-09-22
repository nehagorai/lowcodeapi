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
    // qs uses bracket notation for arrays by default
    expect(urlParams(params)).toBe('arr%5B0%5D=1&arr%5B1%5D=2&arr%5B2%5D=3');
  });

  it('should handle null and undefined values', () => {
    const params = { a: null, c: 1 };
    // qs includes null values as empty strings
    expect(urlParams(params)).toBe('a=&c=1');
  });
});
