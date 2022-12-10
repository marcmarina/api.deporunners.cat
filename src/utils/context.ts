import httpContext from 'express-http-context';

const USER_KEY = 'user';

const setUserId = (id: string) => httpContext.set(USER_KEY, id);

const getUserId = (): string => httpContext.get(USER_KEY);

export const context = {
  setUserId,
  getUserId,
};
