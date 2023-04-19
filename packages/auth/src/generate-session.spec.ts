import { generateSession } from './generate-session';
import { getRefreshTokenOwner } from './get-refresh-token-owner';
import { decodeJWT, signJWT } from './jwt-utils';

jest.mock('./jwt-utils');
jest.mock('./get-refresh-token-owner');

describe('generateSession', () => {
  const mockedValidateJWT = decodeJWT as jest.Mock;
  const mockedSignJWT = signJWT as jest.Mock;

  const mockedGetRefreshTokenOwner = getRefreshTokenOwner as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates a session when the user has a valid auth and refresh token', async () => {
    const authToken = 'authToken';
    const refreshToken = 'refreshToken';

    mockedValidateJWT.mockReturnValueOnce({ id: 1 });

    const session = generateSession(authToken, refreshToken);

    await expect(session).resolves.toEqual({
      user: {
        id: 1,
      },
      refreshToken,
      authToken,
    });
  });

  it("generates a session when the user doesn't have a valid auth but has a valid refresh token", async () => {
    const authToken = 'authToken';
    const refreshToken = 'refreshToken';

    mockedValidateJWT.mockReturnValueOnce(null);
    mockedGetRefreshTokenOwner.mockReturnValueOnce({ id: 1 });
    mockedSignJWT.mockReturnValueOnce('authToken');

    const session = generateSession(authToken, refreshToken);

    await expect(session).resolves.toEqual({
      user: {
        id: 1,
      },
      refreshToken,
      authToken,
    });
  });

  it("returns null when the user doesn't have valid tokens", async () => {
    const authToken = 'authToken';
    const refreshToken = 'refreshToken';

    mockedValidateJWT.mockReturnValueOnce(null);
    mockedGetRefreshTokenOwner.mockReturnValueOnce(null);

    const session = generateSession(authToken, refreshToken);

    await expect(session).resolves.toEqual({
      authToken: null,
      refreshToken: null,
      user: null,
    });
  });

  it("returns null when the user doesn't have any tokens", async () => {
    const authToken = null;
    const refreshToken = null;

    const session = generateSession(authToken, refreshToken);

    await expect(session).resolves.toEqual({
      authToken: null,
      refreshToken: null,
      user: null,
    });
  });
});
