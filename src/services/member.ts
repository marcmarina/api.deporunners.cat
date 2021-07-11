import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import xl from 'excel4node';

import mailService, { getTemplate } from '../mail/mailService';
import Member, { IMember } from '../models/Member';
import { signJWT } from '../utils/SessionManagement';
import { generateToken } from '../utils/Utils';
import { ITShirtSize } from '../models/TShirtSize';
import dayjs from 'dayjs';

export const getAllMembers = async () => {
  return Member.find().sort({ numMember: 'asc' });
};

export const findMemberById = async (id: string) => {
  const member = await Member.findOne({ _id: id });
  if (!member)
    throw {
      status: 404,
      message: 'Member id invalid',
    };
  return member;
};

export const createMember = async (member: IMember): Promise<IMember> => {
  const hashedPassword = await bcrypt.hash(member.dni, 12);
  member.password = hashedPassword;

  const highestMemberNum = await Member.findOne({}).sort('-numMember');
  member.numMember = highestMemberNum ? highestMemberNum.numMember + 1 : 1;

  const newMember = new Member(member);

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
    subject: 'Benvingut/da a Deporunners!',
    html: await getTemplate('emails/member/newMember.pug', {
      member: {
        dni: member.dni,
      },
    }),
  });
};

export const sendSignupEmailInternal = async (id: Schema.Types.ObjectId) => {
  const member = await Member.findById(id);
  if (!member)
    throw {
      status: 404,
      message: 'Invalid member id',
    };

  return mailService.sendMail({
    to: member.email,
    subject: "S'ha registrat un nou soci",
    html: await getTemplate('emails/member/newMemberInternal.pug', {
      member,
      dateString: dayjs().format('DD-MM-YYYY'),
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

const createSessionToken = async (member: IMember) => {
  const refreshToken = await generateToken(64);
  member.refreshToken = refreshToken;
  return member.save();
};

export const generateExcel = async () => {
  const members = await Member.find().populate('tshirtSize');

  const wb = new xl.Workbook();

  const ws = wb.addWorksheet('Sheet 1');

  ws.cell(1, 1).string('Nom');
  ws.cell(1, 2).string('Cognoms');
  ws.cell(1, 3).string('Email');
  ws.cell(1, 4).string('DNI');
  ws.cell(1, 5).string('Num. Soci');
  ws.cell(1, 6).string('IBAN');
  ws.cell(1, 7).string('Talla');
  ws.cell(1, 8).string('Telefon');

  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    ws.cell(i + 2, 1).string(member.firstName);
    ws.cell(i + 2, 2).string(member.lastName);
    ws.cell(i + 2, 3).string(member.email);
    ws.cell(i + 2, 4).string(member.dni);
    ws.cell(i + 2, 5).number(member.numMember);
    ws.cell(i + 2, 6).string(member.iban);
    ws.cell(i + 2, 7).string((member.tshirtSize as ITShirtSize).name);
    ws.cell(i + 2, 8).string(member.telephone);
  }

  return wb.writeToBuffer('Excel.xlsx');
};
