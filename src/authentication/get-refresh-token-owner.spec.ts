import { Member, User } from '../models';

import { getRefreshTokenOwner } from './get-refresh-token-owner';

jest.mock('../models');

describe('getRefreshTokenOwner', () => {
  const mockedUser = {
    findOne: User.findOne as jest.Mock,
  };
  const mockedMember = {
    findOne: Member.findOne as jest.Mock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a user when a user matches the refresh token', async () => {
    const refreshToken = 'refreshToken';

    const user = {
      id: 1,
      refreshToken,
    };

    mockedUser.findOne.mockResolvedValueOnce(user);
    mockedMember.findOne.mockResolvedValueOnce(null);

    const tokenOwner = await getRefreshTokenOwner(refreshToken);

    expect(tokenOwner).toEqual(user);
  });

  it('returns a member when a member matches the refresh token', async () => {
    const refreshToken = 'refreshToken';

    const member = {
      id: 1,
      refreshToken,
    };

    mockedUser.findOne.mockResolvedValueOnce(null);
    mockedMember.findOne.mockResolvedValueOnce(member);

    const tokenOwner = await getRefreshTokenOwner(refreshToken);

    expect(tokenOwner).toEqual(member);
  });

  it('returns a null when no user or members match the refresh token', async () => {
    const refreshToken = 'refreshToken';

    mockedUser.findOne.mockResolvedValueOnce(null);
    mockedMember.findOne.mockResolvedValueOnce(null);

    const tokenOwner = await getRefreshTokenOwner(refreshToken);

    expect(tokenOwner).toBeNull();
  });
});
