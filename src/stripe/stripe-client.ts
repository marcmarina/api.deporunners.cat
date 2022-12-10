import Stripe from 'stripe';
import { config } from '../config';

export const stripeClient = new Stripe(config.stripeKey, {
  apiVersion: '2022-08-01',
});
