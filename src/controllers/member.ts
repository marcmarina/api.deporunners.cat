import Stripe from 'stripe';

import { checkForErrors } from '@deporunners/errors';
import { stripeClient } from '@deporunners/stripe';

import { MemberService } from '../services';

const service = new MemberService();

type PaymentResponse =
  | {
      success: boolean;
    }
  | {
      payment_client_secret: string | null;
      requires_action: boolean;
    };

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);

    const { member } = req.body;

    const createdMember = await service.createMember(member);

    res.status(201).json({ member: createdMember });
  } catch (ex) {
    next(ex);
  }
};

export const signupPayment = async (req, res, next) => {
  try {
    let response: PaymentResponse;

    const { memberId } = req.body;

    const intent: Stripe.PaymentIntent = req.body.payment_method_id
      ? await service.createSignupIntent(memberId, req.body.payment_method_id)
      : await stripeClient.paymentIntents.confirm(req.body.payment_intent_id);

    if (
      intent.status === 'requires_action' &&
      intent.next_action?.type === 'use_stripe_sdk'
    ) {
      response = {
        requires_action: true,
        payment_client_secret: intent.client_secret,
      };
    } else if (intent.status === 'succeeded') {
      response = {
        success: true,
      };
    } else {
      response = {
        success: false,
      };
    }

    return res.send(response);
  } catch (ex) {
    next(ex);
  }
};

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await service.getAll());
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
      password,
    );
    res.set({
      'x-refresh-token': refreshToken,
    });
    res.status(200).json(authToken);
  } catch (ex) {
    next(ex);
  }
};

export const loginV2 = async (req, res, next) => {
  try {
    checkForErrors(req);

    const { username, password } = req.body;
    const session = await service.loginV2(username, password);

    if (!session) {
      return res.status(401).send('Invalid credentials');
    }

    res.set({
      'x-refresh-token': session.refreshToken,
      'x-auth-token': session.authToken,
    });
    res.status(200).json(session);
  } catch (ex) {
    next(ex);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    checkForErrors(req);

    const userId = res.locals.user._id;
    const { oldPassword, newPassword } = req.body;

    res
      .status(200)
      .json(await service.updatePassword(userId, oldPassword, newPassword));
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
    const userId = res.locals.user._id;

    res.status(200).json(await service.registerToken(userId, token));
  } catch (ex) {
    next(ex);
  }
};

export const self = async (req, res, next) => {
  try {
    const userId = res.locals.user._id;

    res.status(200).json(await service.findById(userId));
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
