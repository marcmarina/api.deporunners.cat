import { captureException } from '@sentry/node';

import { config, Environment } from '@deporunners/config';

import { logger } from './logger';

vi.mock('@sentry/node');
vi.mock('./create-logger');
vi.mock('@deporunners/config');

const mockedConfig = vi.mocked(config);
const mockedCaptureException = vi.mocked(captureException);

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends an error to Sentry if the environment is not development or testing', () => {
    mockedConfig.environment = Environment.Production;

    logger.error(new Error('test'));

    expect(mockedCaptureException).toHaveBeenCalledTimes(1);
  });

  it('bypasses environments and sends an error to sentry if the logToSentry flag is true', () => {
    mockedConfig.environment = Environment.Test;

    logger.error(new Error('test'), true);

    expect(mockedCaptureException).toHaveBeenCalledTimes(1);
  });

  it("doesn't send an error to sentry if the environment is test", () => {
    mockedConfig.environment = Environment.Test;

    logger.error(new Error('test'));

    expect(mockedCaptureException).not.toHaveBeenCalled();
  });

  it("doesn't send an error to sentry if the environment is dev", () => {
    mockedConfig.environment = Environment.Dev;

    logger.error(new Error('test'));

    expect(mockedCaptureException).not.toHaveBeenCalled();
  });
});
