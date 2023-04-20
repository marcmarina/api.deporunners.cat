export type PaymentResponse =
  | {
      success: true;
    }
  | {
      success: false;
    }
  | {
      payment_client_secret: string | null;
      requires_action: boolean;
    };
