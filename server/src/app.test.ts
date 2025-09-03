// src/app.test.ts

import 'dotenv/config';
import { jest, describe, it, beforeAll, afterAll, expect } from '@jest/globals'; // eslint-disable-line
import request from 'supertest';
import { Server } from 'http';
import { loggerService } from './utilities';

// Mock loggerService before importing app
jest.mock('./utilities', () => ({
  loggerService: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Redis client before importing app
jest.mock('redis', () => jest.requireActual('redis-mock'));

import app from './app'; // eslint-disable-line

describe('App', () => {
  let server: Server;

  beforeAll(async () => {
    server = app.listen(0);
  });

  afterAll(async () => {
    server.close();
  });

  it('should be defined', async () => {
    expect(app).toBeDefined();
  });

  it('should return 200 and status ok for /api/v1/health-check', async () => {
    const res = await request(server).get('/api/v1/health-check');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(server).get('/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('should handle errors and return JSON message', async () => {
    // Simulate an error by calling the error handler directly
    const err = new Error('Test error');
    const req = { app: { get: () => 'development' }, path: '/error' } as any;
    const res = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    } as any;
    const next = jest.fn();

    // Find the error handler middleware
    const errorHandler = app._router.stack // eslint-disable-line
      .map((layer: any) => layer.handle)
      .find((fn: any) => fn.length === 4);

    expect(errorHandler).toBeInstanceOf(Function);

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
  });
  it('should call loggerService.info when ready event is emitted', async () => {
    app.set('port', 12345); // Set a test port
    app.emit('ready');
    expect(loggerService.info).toHaveBeenCalledWith('Application started on port:12345');
  });
  it('logs x-forwarded-for IP', async () => {
    const res = await request(app).get('/api/v1/health-check');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('logs x-real-ip if x-forwarded-for is missing', async () => {
    await request(app)
      .get('/api/v1/health-check')
      .set('x-real-ip', '5.6.7.8');
    expect(loggerService.info).toHaveBeenCalledWith(
      expect.stringContaining('Request from IP: 5.6.7.8'),
      '/api/v1/health-check',
    );
  });
});
