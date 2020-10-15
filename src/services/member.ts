import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';

import mailService, { getTemplate } from '../mail/mailService';
import Member, { IMember } from '../models/Member';

export const createMember = async (member: IMember): Promise<IMember> => {
  try {
    const hashedPassword = await bcrypt.hash(member.dni, 12);
    member.password = hashedPassword;

    const highestMemberNum = await Member.findOne({}).sort('-numMember');
    member.numMember = highestMemberNum ? highestMemberNum.numMember + 1 : 1;

    const newMember = new Member({ ...member });

    return await newMember.save();
  } catch (ex) {
    throw ex;
  }
};

export const sendSignupEmail = async (id: Schema.Types.ObjectId) => {
  try {
    const member = await Member.findById(id);
    if (!member)
      throw {
        status: 404,
        message: 'Invalid member id',
      };

    return await mailService.sendMail({
      to: member.email,
      from: 'marc.marina.miravitlles@gmail.com',
      subject: 'Benvingut/da a Deporunners!',
      html: await getTemplate('member/newMember.pug', {
        member: {
          dni: member.dni,
        },
      }),
    });
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
    const member = await Member.findOne({ _id: id });
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

export const loginCredentials = async (
  username: string,
  password: string
): Promise<string> => {
  try {
    let member: IMember;

    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    const token = jwt.sign(
      {
        ...member.toObject(),
      },
      process.env.APP_SECRET_KEY
    );

    return token;
  } catch (ex) {
    throw ex;
  }
};

export const updatePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
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
    return await member.save();
  } catch (ex) {
    throw ex;
  }
};

export const registerToken = async (memberId: string, token: string) => {
  try {
    const member = await Member.findById(memberId);

    if (!member)
      throw {
        status: 404,
        message: 'The member id is not valid',
      };

    member.expoPushToken = token;

    return await member.save();
  } catch (ex) {
    throw ex;
  }
};
