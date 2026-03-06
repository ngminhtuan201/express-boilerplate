import { Worker } from "bullmq";
import { config } from "../../../config";
import { logger } from "../../../libs";
import { emailService } from "../../../modules/emails/email.service";
import { ISendEmailJob } from "./send-email.job";
import { SEND_EMAIL_QUEUE_NAME } from "./send-email.queue";

const worker = new Worker<ISendEmailJob>(
  SEND_EMAIL_QUEUE_NAME,
  async (job) => {
    const { id: jobId, data: jobData } = job;
    logger.info(`Processing ${job.name} job ${jobId}`);

    try {
      // TODO: implement email sending logic

      logger.info(`Processed ${job.name} job ${jobId}`);
    } catch (error) {
      logger.error(`Failed to process ${job.name} job ${jobId}\n${error}`);
      throw error;
    }
  },
  {
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      username: config.REDIS_USERNAME,
      password: config.REDIS_PASSWORD,
    },
    // Add logic to prevent connection if not running as worker?
    // Usually fine, but in server app we don't want to process jobs.
    // The processor file should likely only be imported in worker.ts.
  },
);

export const sendEmailProcessor = worker;
