export interface IPaymentAdapter {
  createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>,
  ): Promise<{ id: string; client_secret: string | null }>;

  constructEvent(payload: any, signature: string | string[]): any;
}
