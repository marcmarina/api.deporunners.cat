import { Member, User } from '../models';

export async function getRefreshTokenOwner(refreshToken: string) {
  const results = await Promise.all([
    User.findOne({ refreshToken }),
    Member.findOne({ refreshToken }),
  ]);

  const model = results.find((result) => result);

  return model;
}
