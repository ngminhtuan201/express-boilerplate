import mongoose from "mongoose";

export interface RefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
}

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = mongoose.model<RefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
);
