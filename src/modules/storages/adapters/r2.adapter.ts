import { logger } from "../../../libs";
import { IStorageAdapter } from "./interface";

export class R2StorageAdapter implements IStorageAdapter {
  constructor() {
    logger.error("[storage] R2 storage adapter not implemented");
  }

  uploadFile(filePath: string, directory?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  deleteFile(key: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
