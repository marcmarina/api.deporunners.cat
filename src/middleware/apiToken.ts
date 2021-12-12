import config from '../config/config';

export default (req, res, next) => {
  try {
    checkToken(req);
    next();
  } catch (ex) {
    next(ex);
  }
};

export const checkToken = (req) => {
  const apiToken = req.headers['x-api-token'];
  if (!apiToken) {
    throw {
      status: 401,
      msg: 'No API Token provided',
    };
  } else if (apiToken !== config.apiToken()) {
    throw {
      status: 401,
      msg: 'API Token is not valid',
    };
  }
};
