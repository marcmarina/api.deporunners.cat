import { captureException } from '@sentry/node';

import { envIsDev, envIsTest } from '@deporunners/config';

import { logger } from './logger';

jest.mock('@sentry/node');
jest.mock('./create-logger');
jest.mock('@deporunners/config');

describe('logger', () => {
  const mockedCaptureException = captureException as jest.MockedFunction<
    typeof captureException
  >;

  const mockedEnvIsDev = envIsDev as jest.MockedFunction<typeof envIsDev>;
  const mockedEnvIsTest = envIsTest as jest.MockedFunction<typeof envIsTest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends an error to Sentry if the environment is not development or testing', () => {
    mockedEnvIsDev.mockReturnValue(false);
    mockedEnvIsTest.mockReturnValue(false);

    logger.error(new Error('test'));

    expect(mockedCaptureException).toHaveBeenCalledTimes(1);
  });

  it('bypasses environments and sends an error to sentry if the logToSentry flag is true', () => {
    mockedEnvIsDev.mockReturnValue(true);
    mockedEnvIsTest.mockReturnValue(true);

    logger.error(new Error('test'), true);

    expect(mockedCaptureException).toHaveBeenCalledTimes(1);
  });

  it("doesn't send an error to sentry if the environment is test", () => {
    mockedEnvIsDev.mockReturnValue(false);
    mockedEnvIsTest.mockReturnValue(true);

    logger.error(new Error('test'));

    expect(mockedCaptureException).not.toHaveBeenCalled();
  });

  it("doesn't send an error to sentry if the environment is dev", () => {
    mockedEnvIsDev.mockReturnValue(true);
    mockedEnvIsTest.mockReturnValue(false);

    logger.error(new Error('test'));

    expect(mockedCaptureException).not.toHaveBeenCalled();
  });
});
