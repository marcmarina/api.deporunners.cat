import jwt from 'jsonwebtoken';
import { config } from '../config';

type ModelName = 'User' | 'Member';

export const signJWT = (data: any, modelName: ModelName) => {
  return jwt.sign(
    {
      ...data,
      model: modelName,
    },
    config.appSecretKey,
    {
      expiresIn: parseInt(config.jwtExpiration),
    },
  );
};
