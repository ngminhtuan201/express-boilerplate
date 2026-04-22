import { logger } from "../../../libs";
import { IStorageAdapter } from "./interface";

export class CloudinaryStorageAdapter implements IStorageAdapter {
  constructor() {
    logger.error("[storage] Cloudinary storage adapter not implemented");
  }

  uploadFile(filePath: string, directory?: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  deleteFile(key: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
