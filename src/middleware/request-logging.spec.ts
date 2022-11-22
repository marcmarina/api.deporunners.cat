import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import requestLogging from './request-logging';

jest.mock('../utils/logger');

describe('request-logging', () => {
  const next = jest.fn();
  const req = {
    path: '/health',
    originalUrl: '/health',
    ip: '127.0.0.1',
  };
  const res = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not log blacklisted routes', () => {
    requestLogging(req as Request, res as Response, next as NextFunction);

    expect(logger.request).not.toHaveBeenCalled();
  });

  it('should log non-blacklisted routes', () => {
    req.path = '/test';
    req.originalUrl = '/test';

    requestLogging(req as Request, res as Response, next as NextFunction);

    expect(logger.request).toHaveBeenCalled();
  });
});
