import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signJWT = (data: any) => {
  return jwt.sign(
    {
      ...data,
    },
    config.appSecretKey,
    {
      expiresIn: parseInt(config.jwtExpiration),
    },
  );
};
