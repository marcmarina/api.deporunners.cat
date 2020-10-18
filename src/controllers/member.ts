import Stripe from 'stripe';
import eventEmitter from '../events/EventEmitter';

import {
  createMember,
  getAllMembers,
  findMemberById,
  deleteById,
  update,
  loginCredentials,
  updatePassword,
  sendSignupEmail,
  registerToken,
} from '../services/member';
import checkForErrors from '../utils/ErrorThrowing';

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);

    const result = await createMember({ ...req.body });

    eventEmitter.emit('memberSignup', result._id);

    res.status(201).json(result);
  } catch (ex) {
    next(ex);
  }
};

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await getAllMembers());
  } catch (ex) {
    next(ex);
  }
};

export const find = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json(await findMemberById(id));
  } catch (ex) {
    next(ex);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json(await deleteById(id));
  } catch (ex) {
    next(ex);
  }
};

export const put = async (req, res, next) => {
  try {
    checkForErrors(req);
    const member = req.body;
    res.status(200).json(await update(member));
  } catch (ex) {
    next(ex);
  }
};

export const login = async (req, res, next) => {
  try {
    checkForErrors(req);
    const { username, password } = req.body;
    const { authToken, refreshToken } = await loginCredentials(
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
    const { id } = req.params;

    res.status(200).json(await updatePassword(id, oldPassword, newPassword));
  } catch (ex) {
    next(ex);
  }
};

export const signupSecret = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });

    const intent = await stripe.paymentIntents.create({
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
    const { userId } = req;
    res.status(200).json(await registerToken(userId, token));
  } catch (ex) {
    next(ex);
  }
};

export const self = async (req, res, next) => {
  try {
    const { userId } = req;
    res.status(200).json(await findMemberById(userId));
  } catch (ex) {
    next(ex);
  }
};
