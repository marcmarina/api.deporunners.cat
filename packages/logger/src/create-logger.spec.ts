import pino from 'pino';

import { envIsDev, envIsTest } from '@deporunners/config';

import { createLogger } from './create-logger';

jest.mock('pino');
jest.mock('@deporunners/config');

describe('createLogger', () => {
  const mockedEnvIsDev = jest.mocked(envIsDev);
  const mockedEnvIsTest = jest.mocked(envIsTest);

  const mockedPino = jest.mocked(pino);
  mockedPino.mockReturnValue({} as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a logger with a trace log level if the environment is dev', () => {
    mockedEnvIsDev.mockReturnValue(true);
    mockedEnvIsTest.mockReturnValue(false);

    const logger = createLogger();

    expect(logger).toBeDefined();
    expect(pino).toHaveBeenCalledTimes(1);
    expect(pino).toHaveBeenCalledWith({
      level: 'trace',
      transport: { target: 'pino-pretty' },
    });
  });

  it('returns a logger with a silent log level if the environment is test', () => {
    mockedEnvIsDev.mockReturnValue(false);
    mockedEnvIsTest.mockReturnValue(true);

    const logger = createLogger();

    expect(logger).toBeDefined();
    expect(pino).toHaveBeenCalledTimes(1);
    expect(pino).toHaveBeenCalledWith({
      level: 'silent',
    });
  });

  it('returns a logger with a info log level if the environment is neither test nor dev', () => {
    mockedEnvIsDev.mockReturnValue(false);
    mockedEnvIsTest.mockReturnValue(false);

    const logger = createLogger();

    expect(logger).toBeDefined();
    expect(pino).toHaveBeenCalledTimes(1);
    expect(pino).toHaveBeenCalledWith({
      level: 'info',
    });
  });
});
