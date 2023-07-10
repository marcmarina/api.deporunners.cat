import { IMember, IUser, Member, User } from '@deporunners/models';

import { getRefreshTokenOwner } from './get-refresh-token-owner';

vi.mock('@deporunners/models');

describe('getRefreshTokenOwner', () => {
  const mockedUser = {
    findOne: vi.mocked(User.findOne),
  };
  const mockedMember = {
    findOne: vi.mocked(Member.findOne),
  };

  beforeEach(() => {
    vi.clearAllMocks();
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
