import { getRefreshTokenOwner } from './get-refresh-token-owner';
import { signJWT, decodeJWT } from './jwt-utils';

type Session = {
  authToken: string | null;
  refreshToken: string | null;
  user: any;
};

export async function generateSession(
  authToken,
  refreshToken,
): Promise<Session> {
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
