import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import xl from 'excel4node';
import * as z from 'zod';

import mailService from '../mail/mailService';
import MemberModel from '../models/Member';
import { generateToken, getPugTemplate } from '../utils/Utils';
import { ITShirtSize } from '../models/TShirtSize';
import Context from '../utils/Context';
import { Member } from '../graphql/codegen-types';

export class MemberService {
  async getAllMembers() {
    return MemberModel.find().sort({ numMember: 'asc' });
  }

  async findById(id: string): Promise<Member> {
    const member = await MemberModel.findOne({ _id: id });

    return member;
  }

  async createMember(member: Member): Promise<Member> {
    const hashedPassword = await bcrypt.hash(member.dni, 12);
    member.password = hashedPassword;

    const highestMemberNum = await MemberModel.findOne({}).sort('-numMember');
    member.numMember = highestMemberNum ? highestMemberNum.numMember + 1 : 1;

    const newMember = new MemberModel(member);

    const saved = await newMember.save();
    return memberSchema.parse(saved);
  }

  async sendSignupEmail(id: Schema.Types.ObjectId) {
    const member = await MemberModel.findById(id);
    if (!member)
      throw {
        status: 404,
        msg: 'Invalid member id',
      };

    return mailService.sendMail({
      to: member.email,
      subject: 'Benvingut/da a Deporunners!',
      html: await getPugTemplate('emails/member/newMember.pug', {
        member: {
          dni: member.dni,
        },
      }),
    });
  }

  async deleteById(id: string) {
    return MemberModel.findByIdAndDelete(id);
  }

  // TODO Change type
  async update(member: any) {
    return MemberModel.updateOne({ _id: member._id }, member);
  }

  // async loginCredentials(username: string, password: string) {
  //   let member: IMember;

  //   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (re.test(username)) {
  //     member = await MemberModel.findOne({ email: username });
  //     if (!member) {
  //       const error = {
  //         status: 400,
  //         msg: 'These credentials are invalid.',
  //       };
  //       throw error;
  //     }
  //   } else {
  //     member = await MemberModel.findOne({ dni: username });
  //     if (!member) {
  //       const error = {
  //         status: 400,
  //         msg: 'These credentials are invalid.',
  //       };
  //       throw error;
  //     }
  //   }

  //   const validPassword = await bcrypt.compare(password, member.password);

  //   if (!validPassword) {
  //     const error = {
  //       status: 400,
  //       msg: 'These credentials are invalid.',
  //     };
  //     throw error;
  //   }

  //   if (!member.refreshToken) {
  //     member = await this.createSessionToken(member);
  //   }

  //   const token = signJWT({ _id: member._id }, 'Member');

  //   return {
  //     authToken: token,
  //     refreshToken: member.refreshToken,
  //   };
  // }

  async updatePassword(oldPassword: string, newPassword: string) {
    const member = await MemberModel.findById(Context.getUserId());
    if (!member)
      throw {
        status: 400,
        msg: 'The member id is not valid',
      };

    const validPassword = await bcrypt.compare(oldPassword, member.password);
    if (!validPassword)
      throw {
        status: 400,
        msg: 'The old password is not valid',
      };

    member.password = await bcrypt.hash(newPassword, 12);
    return member.save();
  }

  async registerToken(token: string) {
    const member = await MemberModel.findById(Context.getUserId());

    if (!member)
      throw {
        status: 404,
        msg: 'The member id is not valid',
      };

    member.expoPushToken = token;

    return member.save();
  }

  // TODO Change type
  createSessionToken(member: any) {
    const refreshToken = generateToken(64);
    member.refreshToken = refreshToken;
    return member.save();
  }

  async generateExcel() {
    const members = await MemberModel.find().populate('tshirtSize');

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
  }
}

const memberSchema = z.object({
  id: z.string(),
  numMember: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  dni: z.string(),
  iban: z.string().nullable(),
  telephone: z.string(),
  refreshToken: z.string().nullable(),
  expoPushToken: z.string().nullable(),
});
