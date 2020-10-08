import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error('Not authenticated.');
      throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.APP_SECRET_KEY);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }
    if (!decodedToken) {
      const error = new Error('Not authenticated.');
      throw error;
    }
    req.userId = decodedToken._id;
    next();
  } catch (ex) {
    next(ex);
  }
};
