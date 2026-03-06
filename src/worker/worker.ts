// Modules
import "./modules/emails/send-email.processor";
import "./modules/audio/audio.processor";

import { connectToMongoDB, initRedis } from "../dbs";
import { logger } from "../libs";

const startWorker = async () => {
  try {
    logger.info("👷 [worker] Starting worker...");

    // MongoDB
    logger.info("📦 [mongodb] Connecting...");
    await connectToMongoDB();
    logger.info("📦 [mongodb] Connection initialized successfully");

    // Redis
    logger.info("📦 [redis] Connecting...");
    initRedis();

    logger.info("🚀 [worker] Worker started successfully");
  } catch (error) {
    logger.error(`❌ [worker] Worker initialization failed\n${error}`);
    process.exit(1);
  }
};

startWorker();
