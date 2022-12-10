import { Router } from 'express';
import Stripe from 'stripe';
import { MemberService } from '../services';

const router = Router();

const memberService = new MemberService();

router.post('/webhooks', async (req, res, next) => {
  try {
    const event = req.body;

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const customer = paymentIntent.customer as string;

        if (customer) {
          await Promise.all([
            memberService.sendSignupEmail(customer),
            memberService.sendSignupEmailInternal(customer),
          ]);
        }

        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});

export default router;
