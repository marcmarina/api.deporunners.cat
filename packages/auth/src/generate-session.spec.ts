import { IMember } from '@deporunners/models';

import { generateSession } from './generate-session';
import { getRefreshTokenOwner } from './get-refresh-token-owner';
import { decodeJWT, signJWT } from './jwt-utils';

vi.mock('./jwt-utils');
vi.mock('./get-refresh-token-owner');

describe('generateSession', () => {
  const mockedDecodeJWT = vi.mocked(decodeJWT);
  const mockedSignJWT = vi.mocked(signJWT);

  const mockedGetRefreshTokenOwner = vi.mocked(getRefreshTokenOwner);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates a session when the user has a valid auth and refresh token', async () => {
    const authToken = 'authToken';
    const refreshToken = 'refreshToken';

    mockedDecodeJWT.mockReturnValueOnce({ id: 1 });

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

    mockedDecodeJWT.mockReturnValueOnce(null);
    mockedGetRefreshTokenOwner.mockResolvedValueOnce({ id: 1 } as IMember);
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

    mockedDecodeJWT.mockReturnValueOnce(null);
    mockedGetRefreshTokenOwner.mockResolvedValueOnce(null);

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
