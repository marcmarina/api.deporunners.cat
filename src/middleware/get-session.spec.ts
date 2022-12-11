import { getSession } from './get-session';
import { generateSession } from '../authentication';

jest.mock('../authentication');

describe('getSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockedGenerateSession = generateSession as jest.Mock;

  it('populates the user in the response if the session is valid', async () => {
    const req = {
      headers: {
        'x-auth-token': 'authToken',
        'x-refresh-token': 'refreshToken',
      },
    };
    const res = {
      locals: {} as any,
      set: jest.fn(),
    };
    const next = jest.fn();

    mockedGenerateSession.mockResolvedValueOnce({
      user: { id: 1 },
      authToken: 'authToken',
      refreshToken: 'refreshToken',
    });

    await getSession(req as any, res as any, next);

    expect(res.locals.user).toEqual({ id: 1 });
    expect(res.set).toHaveBeenCalledWith({
      'x-auth-token': 'authToken',
      'x-refresh-token': 'refreshToken',
    });
    expect(next).toHaveBeenCalled();
  });

  it('set the user as null in the response if the session is not valid', async () => {
    const req = {
      headers: {
        'x-auth-token': 'authToken',
        'x-refresh-token': 'refreshToken',
      },
    };
    const res = {
      locals: {} as any,
      set: jest.fn(),
    };
    const next = jest.fn();

    mockedGenerateSession.mockResolvedValueOnce({
      user: null,
      authToken: null,
      refreshToken: null,
    });

    await getSession(req as any, res as any, next);

    expect(res.locals.user).toEqual(null);
    expect(res.set).toHaveBeenCalledWith({
      'x-auth-token': null,
      'x-refresh-token': null,
    });
    expect(next).toHaveBeenCalled();
  });
});
