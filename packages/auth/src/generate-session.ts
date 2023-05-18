import { getRefreshTokenOwner } from './get-refresh-token-owner';
import { decodeJWT, signJWT } from './jwt-utils';
import { PartialSession } from './types';

export async function generateSession(
  authToken: string | null,
  refreshToken: string | null,
): Promise<PartialSession> {
  if (!authToken || !refreshToken) {
    return {
      authToken: null,
      refreshToken: null,
      user: null,
    };
  }

  const decodedToken = decodeJWT(authToken);
  if (decodedToken) {
    return {
      authToken,
      refreshToken,
      user: decodedToken,
    };
  }

  const refreshTokenOwner = await getRefreshTokenOwner(refreshToken);
  if (refreshTokenOwner) {
    return {
      authToken: signJWT(refreshTokenOwner),
      refreshToken: refreshToken,
      user: refreshTokenOwner,
    };
  }

  return {
    authToken: null,
    refreshToken: null,
    user: null,
  };
}
