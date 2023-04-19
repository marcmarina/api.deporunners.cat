import { config } from '@deporunners/config';
import Stripe from 'stripe';

export const stripeClient = new Stripe(config.stripeKey, {
  apiVersion: '2022-08-01',
});
