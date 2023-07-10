import pino from 'pino';

import { config, Environment } from '@deporunners/config';

import { createLogger } from './create-logger';

vi.mock('pino');
vi.mock('@deporunners/config');

const mockedConfig = vi.mocked(config);

const mockedPino = vi.mocked(pino);
mockedPino.mockReturnValue({} as any);

describe('createLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a logger with a trace log level if the environment is dev', () => {
    mockedConfig.environment = Environment.Dev;

    const logger = createLogger();

    expect(logger).toBeDefined();
    expect(pino).toHaveBeenCalledTimes(1);
    expect(pino).toHaveBeenCalledWith({
      level: 'trace',
      transport: { target: 'pino-pretty' },
    });
  });

  it('returns a logger with a silent log level if the environment is test', () => {
    mockedConfig.environment = Environment.Test;

    const logger = createLogger();

    expect(logger).toBeDefined();
    expect(pino).toHaveBeenCalledTimes(1);
    expect(pino).toHaveBeenCalledWith({
      level: 'silent',
    });
  });

  it('returns a logger with a info log level if the environment is neither test nor dev', () => {
    mockedConfig.environment = Environment.Production;

    const logger = createLogger();

    expect(logger).toBeDefined();
    expect(pino).toHaveBeenCalledTimes(1);
    expect(pino).toHaveBeenCalledWith({
      level: 'info',
    });
  });
});
