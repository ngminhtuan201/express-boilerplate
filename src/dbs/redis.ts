import IORedis from "ioredis";
import { config } from "../config";
import { logger } from "../libs";

let redis: IORedis | null = null;

export const initRedis = (): IORedis => {
  if (redis) {
    return redis;
  }

  redis = new IORedis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    username: config.REDIS_USERNAME,
    password: config.REDIS_PASSWORD,
  });

  redis.on("connect", () => {
    logger.info("📦 [redis] Connected successfully");
  });

  redis.on("error", (error) => {
    logger.error(`❌ [redis] Connection failed\n${error}`);
  });

  return redis;
};

export const getRedis = (): IORedis => {
  if (!redis) {
    throw new Error("Redis not initialized");
  }
  return redis;
};

export const REDIS_KEYS = {
  VOICES: "voices",
};
