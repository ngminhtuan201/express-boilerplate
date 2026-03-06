import mongoose from "mongoose";
import { config } from "../config";
import { logger } from "../libs";

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      connectTimeoutMS: 5000,
    });
  } catch (error) {
    logger.error(`❌ Connect to mongodb failed\n${error}`);
    process.exit(1);
  }
};
