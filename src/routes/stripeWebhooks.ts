import { Router } from 'express';
import Stripe from 'stripe';
import { MemberService } from '../services/member-service';

const router = Router();

const memberService = new MemberService();

router.post('/webhooks', async (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const customer = paymentIntent.customer as string;

      if (customer) {
        await memberService.sendSignupEmail(customer);
        await memberService.sendSignupEmailInternal(customer);
      }

      break;
    }
  }

  res.json({ received: true });
});

export default router;
