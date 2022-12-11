import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import xl from 'excel4node';

import { config } from '../config';
import { AuthError, ServiceError } from '../errors';
import { getEmailTemplate, mailService } from '../mail';
import { Member, IMember, ITShirtSize } from '../models';
import { signJWT } from '../authentication';
import { StripeAdapter, stripeClient } from '../stripe';
import { generateToken } from '../utils';

type Session = {
  authToken: string;
  refreshToken: string;
};

const stripeAdapter = new StripeAdapter();

export class MemberService {
  async getAllMembers(): Promise<IMember[]> {
    return Member.find().sort({ numMember: 'asc' });
  }

  async findById(id: string) {
    const member = await Member.findOne({ _id: id });
    if (!member)
      throw {
        status: 404,
        msg: 'Member id invalid',
      };
    return member;
  }

  async createMember(member: IMember): Promise<IMember> {
    const hashedPassword = await bcrypt.hash(member.dni, 12);
    member.password = hashedPassword;

    const highestMemberNum = await Member.findOne({}).sort('-numMember');
    member.numMember = highestMemberNum ? highestMemberNum.numMember + 1 : 1;

    const newMember = new Member(member);

    const stripeCustomer = await stripeClient.customers.create({
      name: `${newMember.firstName} ${newMember.lastName}`,
      email: newMember.email,
      phone: newMember.telephone,
    });

    newMember.stripeId = stripeCustomer.id;

    return await newMember.save();
  }

  async createSignupIntent(stripeId: string, payment_method_id: string) {
    const product = await stripeAdapter.fetchProduct(config.stripeFeeProductId);

    const prices = await stripeAdapter.fetchPrices(product);

    const price = prices.data[0];

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: price.unit_amount,
      description: product.description ?? 'Description',
      currency: price.currency,
      payment_method_types: ['card'],
      customer: stripeId,
      setup_future_usage: 'on_session',
      payment_method: payment_method_id,
      confirm: true,
      confirmation_method: 'manual',
    });

    return paymentIntent;
  }

  async sendSignupEmail(stripeId: string) {
    try {
      const member = await Member.findOne({
        stripeId,
      });

      if (!member) return null;

      return mailService.sendMail({
        to: member.email,
        subject: 'Benvingut/da a Deporunners!',
        html: await getEmailTemplate('member/newMember.pug', {
          member: {
            dni: member.dni,
          },
        }),
      });
    } catch (err) {
      throw new ServiceError({
        message: err.message,
        method: 'sendSignupEmail',
        service: 'MemberService',
      });
    }
  }

  async sendSignupEmailInternal(stripeId: string) {
    try {
      const member = await Member.findOne({
        stripeId,
      });

      if (!member) return null;

      return mailService.sendMail({
        to: config.emailFrom,
        subject: "S'ha registrat un nou soci",
        html: await getEmailTemplate('member/newMemberInternal.pug', {
          member,
          dateString: dayjs().format('DD-MM-YYYY'),
        }),
      });
    } catch (err) {
      throw new ServiceError({
        message: err.message,
        method: 'sendSignupEmailInternal',
        service: 'MemberService',
      });
    }
  }

  async deleteById(id: string) {
    return Member.findByIdAndDelete(id);
  }

  async update(member: IMember) {
    return Member.updateOne({ _id: member._id }, member);
  }

  async loginCredentials(username: string, password: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let member = re.test(username)
      ? await Member.findOne({ email: username })
      : await Member.findOne({ dni: username });

    if (!member) throw new AuthError('These credentials are invalid');

    const validPassword = bcrypt.compareSync(password, member.password);

    if (!validPassword) throw new AuthError('These credentials are invalid');

    if (!member.refreshToken) {
      member = await this.createSessionToken(member);
    }

    const token = signJWT({ _id: member._id, modelName: 'Member' });

    return {
      authToken: token,
      refreshToken: member.refreshToken,
    };
  }

  async loginV2(username: string, password: string): Promise<Session | null> {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const filter = re.test(username) ? { email: username } : { dni: username };

    const member = await Member.findOne(filter);

    if (!member) return null;

    const isPasswordValid = await this.validatePassword(
      password,
      member.password,
    );

    if (!isPasswordValid) return null;

    const session = await this.createSession(member);

    member.refreshToken = session.refreshToken;

    await member.save();

    return session;
  }

  private async validatePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async createSession(member: IMember): Promise<{
    authToken: string;
    refreshToken: string;
  }> {
    return {
      authToken: signJWT(member),
      refreshToken: member.refreshToken ?? generateToken(32),
    };
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string) {
    const member = await Member.findById(id);
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

  async registerToken(id: string, token: string) {
    const member = await Member.findById(id);

    if (!member)
      throw {
        status: 404,
        msg: 'The member id is not valid',
      };

    member.expoPushToken = token;

    return member.save();
  }

  createSessionToken(member: IMember) {
    const refreshToken = generateToken(32);
    member.refreshToken = refreshToken;
    return member.save();
  }

  async generateExcel() {
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
  }
}
