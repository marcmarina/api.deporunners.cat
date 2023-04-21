import { IMember, IUser, Member, User } from '@deporunners/models';
import { Maybe } from '@deporunners/utils';

export async function getRefreshTokenOwner(
  refreshToken: string,
): Promise<Maybe<IUser | IMember>> {
  const results = await Promise.all([
    User.findOne({ refreshToken }),
    Member.findOne({ refreshToken }),
  ]);

  const model = results.find((result) => result);

  return model ?? null;
}
