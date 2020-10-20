import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';

import mailService, { getTemplate } from '../mail/mailService';
import Member, { IMember } from '../models/Member';
import { signJWT } from '../utils/SessionManagement';
import { generateToken } from '../utils/Utils';

export const getAllMembers = async () => {
  const members = await Member.find();
  return members;
};

export const findMemberById = async (id: string) => {
  const member = await Member.findOne({ _id: id });
  return member;
};

export const createMember = async (member: IMember): Promise<IMember> => {
  const hashedPassword = await bcrypt.hash(member.dni, 12);
  member.password = hashedPassword;

  const highestMemberNum = await Member.findOne({}).sort('-numMember');
  member.numMember = highestMemberNum ? highestMemberNum.numMember + 1 : 1;

  const newMember = new Member({ ...member });

  return newMember.save();
};

export const sendSignupEmail = async (id: Schema.Types.ObjectId) => {
  const member = await Member.findById(id);
  if (!member)
    throw {
      status: 404,
      message: 'Invalid member id',
    };

  return mailService.sendMail({
    to: member.email,
    from: 'marc.marina.miravitlles@gmail.com',
    subject: 'Benvingut/da a Deporunners!',
    html: await getTemplate('member/newMember.pug', {
      member: {
        dni: member.dni,
      },
    }),
  });
};

export const deleteById = async (id: string) => {
  return Member.findByIdAndDelete(id);
};

export const update = async (member: IMember) => {
  return Member.updateOne({ _id: member._id }, member);
};

export const loginCredentials = async (username: string, password: string) => {
  let member: IMember;

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (re.test(username)) {
    member = await Member.findOne({ email: username });
    if (!member) {
      const error = {
        status: 400,
        message: 'These credentials are invalid.',
      };
      throw error;
    }
  } else {
    member = await Member.findOne({ dni: username });
    if (!member) {
      const error = {
        status: 400,
        message: 'These credentials are invalid.',
      };
      throw error;
    }
  }

  const validPassword = await bcrypt.compare(password, member.password);

  if (!validPassword) {
    const error = {
      status: 400,
      message: 'These credentials are invalid.',
    };
    throw error;
  }

  if (!member.refreshToken) {
    member = await createSessionToken(member);
  }

  const token = signJWT({ _id: member._id }, 'Member');

  return {
    authToken: token,
    refreshToken: member.refreshToken,
  };
};

export const updatePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  const member = await Member.findById(id);
  if (!member)
    throw {
      status: 400,
      message: 'The member id is not valid',
    };

  const validPassword = await bcrypt.compare(oldPassword, member.password);
  if (!validPassword)
    throw {
      status: 400,
      message: 'The old password is not valid',
    };

  member.password = await bcrypt.hash(newPassword, 12);
  return member.save();
};

export const registerToken = async (memberId: string, token: string) => {
  const member = await Member.findById(memberId);

  if (!member)
    throw {
      status: 404,
      message: 'The member id is not valid',
    };

  member.expoPushToken = token;

  return member.save();
};

const createSessionToken = async (mebmer: IMember) => {
  const refreshToken = await generateToken(64);
  mebmer.refreshToken = refreshToken;
  return mebmer.save();
};
