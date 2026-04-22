import { logger } from "../../../libs";
import { IStorageAdapter } from "./interface";

export class S3StorageAdapter implements IStorageAdapter {
  constructor() {
    logger.error("[storage] S3 storage adapter not implemented");
  }

  uploadFile(filePath: string, directory?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  deleteFile(key: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
