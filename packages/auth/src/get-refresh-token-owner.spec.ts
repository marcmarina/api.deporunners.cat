import { IMember, IUser, Member, User } from '@deporunners/models';

import { getRefreshTokenOwner } from './get-refresh-token-owner';

jest.mock('@deporunners/models');

describe('getRefreshTokenOwner', () => {
  const mockedUser = {
    findOne: User.findOne as jest.MockedFunction<typeof User.findOne>,
  };
  const mockedMember = {
    findOne: Member.findOne as jest.MockedFunction<typeof Member.findOne>,
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

    mockedUser.findOne.mockResolvedValueOnce(user as IUser);
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
    mockedMember.findOne.mockResolvedValueOnce(member as IMember);

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
