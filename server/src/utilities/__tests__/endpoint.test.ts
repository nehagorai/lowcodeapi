import { describe, it, expect } from '@jest/globals';

// Mock config and process.env before importing endpoint
jest.mock('../../config', () => ({
    APP_DOMAIN: 'app.example.com',
    PROTOCOL: 'https',
    API_ENDPOINT: 'api.example.com',
    BASE_PATH: '/base',
    LOGGING_ENDPOINT: 'log.example.com',
    UI_DOMAIN: 'ui.example.com',
  }));

import endpoint from '../endpoint';

describe('endpoint utility', () => {
  it('getOptions returns correct endpoints', () => {
    process.env.UI_DOMAIN = 'ui.example.com';
    const options = endpoint.getOptions();
    expect(options).toEqual({
      API_ENDPOINT: 'https://api.example.com',
      UI_ENDPOINT: 'https://ui.example.com',
      BACK_ENDPOINT: 'https://app.example.com',
      LOGGING_ENDPOINT: 'https://log.example.com',
    });
  });

  it('getBaseAppendedUrl returns correct path', () => {
    expect(endpoint.getBaseAppendedUrl('foo')).toBe('/foo');
  });

  it('getLoginUrl returns correct URL with message', () => {
    expect(endpoint.getLoginUrl('hello')).toBe('https://ui.example.com/base/login?message=hello');
  });

  it('getLoginUrl returns correct URL without message', () => {
    expect(endpoint.getLoginUrl('')).toBe('https://ui.example.com/base/login');
  });

  it('getEmailLoginLink returns signup link if isNew', () => {
    expect(endpoint.getEmailLoginLink('token123', true)).toBe(
      'https://app.example.com/account/action?token=token123&type=signup&first=1'
    );
  });

  it('getEmailLoginLink returns login link if not isNew', () => {
    expect(endpoint.getEmailLoginLink('token123', false)).toBe(
      'https://app.example.com/account/action?token=token123&type=login'
    );
  });

  it('redirectToUIPage returns correct URL', () => {
    expect(endpoint.redirectToUIPage('token123')).toBe('https://ui.example.com/base/login?token=token123');
  });

  it('providerSuccessRedirectUrl returns correct URL', () => {
    expect(endpoint.providerSuccessRedirectUrl('google')).toBe('https://ui.example.com/base/google?success=1');
  });

  it('providerFailureRedirectUrl returns correct URL with message', () => {
    expect(endpoint.providerFailureRedirectUrl('google', 'fail')).toBe(
      'https://ui.example.com/base/google?message=fail'
    );
  });

  it('providerFailureRedirectUrl returns default message if none provided', () => {
    expect(endpoint.providerFailureRedirectUrl('google', '')).toBe(
      'https://ui.example.com/base/google?message=google-oauth-authentication-failed-rejected-or-cancelled'
    );
  });

  it('sendEmail returns correct URL', () => {
    expect(endpoint.sendEmail('api_token_123')).toBe('https://api.example.com/email/send?api_token=api_token_123');
  });

  it('getChatGPTUrl returns correct URL', () => {
    expect(endpoint.getChatGPTUrl('api_token_123')).toBe(
      'https://api.example.com/openai/v1/chat/completions?api_token=api_token_123'
    );
  });
}); 