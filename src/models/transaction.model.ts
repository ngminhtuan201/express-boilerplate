import mongoose, { Document, Schema } from "mongoose";
import { User } from "./user.model";

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Transaction extends Document {
  userId: User["_id"];
  amount: number;
  currency: string;
  status: TransactionStatus;
  stripePaymentIntentId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<Transaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "usd",
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

export const TransactionModel = mongoose.model<Transaction>(
  "Transaction",
  transactionSchema,
);
