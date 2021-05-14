import eventEmitter from '../events/EventEmitter';
import { MemberService } from '../services/MemberService';
import Context from '../utils/Context';
import checkForErrors from '../utils/ErrorThrowing';
import { stripeClient } from '../stripe/stripe-client';

const service = new MemberService();

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);

    const result = await service.createMember({ ...req.body });

    res.status(201).json(result);
  } catch (ex) {
    next(ex);
  }
};

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await service.getAllMembers());
  } catch (ex) {
    next(ex);
  }
};

export const find = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json(await service.findById(id));
  } catch (ex) {
    next(ex);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json(await service.deleteById(id));
  } catch (ex) {
    next(ex);
  }
};

export const put = async (req, res, next) => {
  try {
    checkForErrors(req);
    const member = req.body;
    res.status(200).json(await service.update(member));
  } catch (ex) {
    next(ex);
  }
};

export const login = async (req, res, next) => {
  try {
    checkForErrors(req);
    const { username, password } = req.body;
    const { authToken, refreshToken } = await service.loginCredentials(
      username,
      password
    );
    res.set({
      'x-refresh-token': refreshToken,
    });
    res.status(200).json(authToken);
  } catch (ex) {
    next(ex);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    checkForErrors(req);

    const { oldPassword, newPassword } = req.body;

    res
      .status(200)
      .json(await service.updatePassword(oldPassword, newPassword));
  } catch (ex) {
    next(ex);
  }
};

export const signupSecret = async (req, res, next) => {
  try {
    const intent = await stripeClient.paymentIntents.create({
      amount: 4000,
      currency: 'eur',
      description: 'Pagament quota Deporunners',
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    res.status(200).json({ clientSecret: intent.client_secret });
  } catch (ex) {
    next(ex);
  }
};

export const expoToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    res.status(200).json(await service.registerToken(token));
  } catch (ex) {
    next(ex);
  }
};

export const self = async (req, res, next) => {
  try {
    res.status(200).json(await service.findById(Context.getUserId()));
  } catch (ex) {
    next(ex);
  }
};

export const signupSuccess = async (req, res, next) => {
  try {
    const { id } = req.params;

    eventEmitter.emit('memberSignup', id);

    res.status(200).json();
  } catch (ex) {
    next(ex);
  }
};

export const signupFailure = async (req, res, next) => {
  try {
    const { id } = req.params;

    res.status(200).json(await service.deleteById(id));
  } catch (ex) {
    next(ex);
  }
};
