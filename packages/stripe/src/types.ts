import { Maybe } from '@deporunners/utils';

export type PaymentResponse =
  | {
      success: true;
    }
  | {
      success: false;
    }
  | {
      payment_client_secret: Maybe<string>;
      requires_action: boolean;
    };
