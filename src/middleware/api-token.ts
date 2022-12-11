import { config } from '../config';

export const apiToken = (req, res, next) => {
  const token = req.headers['x-api-token'] as string;

  const isApiTokenValid = token === config.apiToken;

  if (isApiTokenValid) {
    next();
  } else {
    res.status(401).send(`Invalid API token - ${token}`);
  }
};
