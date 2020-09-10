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

export const findMemberById = async (id: string) => {
  try {
    const member = await Member.findById(id).populate('address.town');
    return member;
  } catch (ex) {
    throw ex;
  }
};

export const deleteById = async (id: string) => {
  try {
    return await Member.findByIdAndDelete(id);
  } catch (ex) {
    throw ex;
  }
};

export const update = async (member: IMember) => {
  try {
    return await Member.updateOne({ _id: member._id }, member);
  } catch (ex) {
    throw ex;
  }
};
