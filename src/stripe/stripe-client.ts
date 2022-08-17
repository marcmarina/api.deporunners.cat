import Stripe from 'stripe';
import config from '../config/config';

export const stripeClient = new Stripe(config.stripeKey, {
  apiVersion: '2022-08-01',
});
