export const auth = async (_req, res, next) => {
  const user = res.locals.user;

  if (user) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};
