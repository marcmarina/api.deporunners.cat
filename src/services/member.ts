import bcrypt from 'bcrypt';

import Member, { IMember } from '../models/Member';

export const createMember = async (member: IMember): Promise<IMember> => {
  try {
    const hashedPassword = await bcrypt.hash(member.password, 12);
    member.password = hashedPassword;
    return await member.save();
  } catch (ex) {
    throw ex;
  }
};
