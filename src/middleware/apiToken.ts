export default (req, res, next) => {
  try {
    const apiToken = req.get('x-api-token');
    if (!apiToken) {
      throw {
        status: 401,
        msg: 'No API Token provided',
      };
    } else if (apiToken !== process.env.API_TOKEN) {
      throw {
        status: 401,
        msg: 'API Token is not valid',
      };
    }
    next();
  } catch (ex) {
    next(ex);
  }
};
