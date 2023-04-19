import jwt from 'jsonwebtoken';

import { decodeJWT } from './jwt-utils';

jest.mock('jsonwebtoken');

describe('decodeJWT', () => {
  const mockedJwt = {
    verify: jwt.verify as jest.Mock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the decoded token when the token is valid', () => {
    const token = 'token';

    mockedJwt.verify.mockReturnValueOnce({ id: 1 });

    const decodedToken = decodeJWT(token);

    expect(decodedToken).toEqual({ id: 1 });
  });

  it('returns null when the token is not valid', () => {
    const token = 'token';

    mockedJwt.verify.mockImplementationOnce(() => {
      throw new Error();
    });

    const decodedToken = decodeJWT(token);

    expect(decodedToken).toBeNull();
  });
});
