import { IMember, IUser, Member, User } from '@deporunners/models';

export async function getRefreshTokenOwner(
  refreshToken: string,
): Promise<IUser | IMember | null> {
  const results = await Promise.all([
    User.findOne({ refreshToken }),
    Member.findOne({ refreshToken }),
  ]);

  const model = results.find((result) => result);

  return model ?? null;
}
