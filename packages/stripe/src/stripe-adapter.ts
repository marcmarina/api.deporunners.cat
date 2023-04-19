import { z } from 'zod';

import { stripeClient } from './stripe-client';

export class StripeAdapter {
  async fetchProduct(id: string): Promise<StripeProduct> {
    const product = await stripeClient.products.retrieve(id);

    return productSchema.parse(product);
  }

  async fetchPrices(product: StripeProduct): Promise<StripePrices> {
    const prices = await stripeClient.prices.list({
      product: product.id,
      currency: 'eur',
    });

    return pricesSchema.parse(prices);
  }
}

const productSchema = z.object({
  id: z.string(),
  description: z.string(),
});
type StripeProduct = z.infer<typeof productSchema>;

const pricesSchema = z.object({
  data: z.array(
    z.object({
      unit_amount: z.number(),
      currency: z.string(),
    }),
  ),
});
type StripePrices = z.infer<typeof pricesSchema>;
