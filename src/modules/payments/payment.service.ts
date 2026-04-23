import {
  PaymentProvider,
  TransactionStatus,
  TransactionType,
} from "../../enums";
import { documentId } from "../../libs";
import { Transaction, TransactionModel } from "../../models";
import { PaymentSession } from "./adapters";
import { CreatePaymentDto } from "./dtos";
import { PaymentAdapterFactory } from "./payment.helper";

export const createPaymentSession = async (
  userId: string,
  provider: PaymentProvider,
  dto: CreatePaymentDto,
): Promise<PaymentSession> => {
  const paymentAdapter = PaymentAdapterFactory.getAdapter(provider);

  const transactionId = documentId();
  const paymentSession = await paymentAdapter.createPaymentSession(
    transactionId,
    dto,
  );

  const newTransaction: Transaction = {
    id: transactionId,
    userId: userId,
    type: TransactionType.PURCHASE,
    amount: dto.amount,
    currency: dto.currency,
    status: TransactionStatus.PENDING,
    provider: provider,
    providerRefId: paymentSession.providerRefId,
    metadata: (paymentSession.raw as Record<string, unknown>) || {},
  };

  await TransactionModel.create(newTransaction);

  return paymentSession;
};

export const handleWebhook = async (
  provider: PaymentProvider,
  payload: unknown,
  headers: Record<string, string | string[] | undefined>,
) => {
  const paymentAdapter = PaymentAdapterFactory.getAdapter(provider);
  return paymentAdapter.handleWebhook(payload, headers);
};
