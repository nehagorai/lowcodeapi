import { describe, it, expect, jest } from '@jest/globals';
import response from '../response';

describe('response utility', () => {
  let res: any;

  beforeEach(() => {
    res = {
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should set content-type and call send if content-type does not match regex', () => {
    const options = { headers: { 'content-type': 'image/png' } };
    const resp = { foo: 'bar' };
    response(res, resp, options);
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/png');
    expect(res.send).toHaveBeenCalledWith(resp);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should call json with correct structure if content-type matches regex', () => {
    const options = { headers: { 'content-type': 'application/json' }, provider: 'test-provider' };
    const resp = { message: 'ok', data: 123 };
    response(res, resp, options);
    expect(res.json).toHaveBeenCalledWith({
      message: 'ok',
      provider: 'test-provider',
      result: resp,
      response_headers: options.headers,
    });
    expect(res.set).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should call json with default message if not present', () => {
    const options = {};
    const resp = { foo: 'bar' };
    response(res, resp, options);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Request completed',
      provider: undefined,
      result: resp,
      response_headers: undefined,
    });
  });

  it('should include response_headers as undefined if not provided', () => {
    const options = { provider: 'p' };
    const resp = { message: 'done' };
    response(res, resp, options);
    expect(res.json).toHaveBeenCalledWith({
      message: 'done',
      provider: 'p',
      result: resp,
      response_headers: undefined,
    });
  });
}); 