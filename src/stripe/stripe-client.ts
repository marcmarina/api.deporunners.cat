import Stripe from 'stripe';

import { config } from '@deporunners/config';

export const stripeClient = new Stripe(config.stripeKey, {
  apiVersion: '2022-08-01',
});
