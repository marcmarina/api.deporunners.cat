import bcrypt from 'bcrypt';

import Member, { IMember } from '../models/Member';

export const createMember = async (member: IMember): Promise<IMember> => {
  try {
    const hashedPassword = await bcrypt.hash(member.dni, 12);
    member.password = hashedPassword;

    const highestMemberNum = await Member.findOne({}).sort('-numMember');
    member.numMember = highestMemberNum ? highestMemberNum.numMember + 1 : 1;
    return await member.save();
  } catch (ex) {
    throw ex;
  }
};

export const getAllMembers = async () => {
  try {
    const members = await Member.find();
    return members;
  } catch (ex) {
    throw ex;
  }
};
