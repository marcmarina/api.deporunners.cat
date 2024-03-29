import jwt from 'jsonwebtoken';

import { config } from '@deporunners/config';

export function signJWT(data: any) {
  return jwt.sign(
    {
      ...data,
    },
    config.appSecretKey,
    {
      expiresIn: parseInt(config.jwtExpiration),
    },
  );
}

export function decodeJWT(token: string) {
  try {
    return jwt.verify(token, config.appSecretKey);
  } catch (ex) {
    return null;
  }
}
