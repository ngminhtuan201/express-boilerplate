import fs from "fs";
import path from "path";
import { config } from "../../../config";
import { logger } from "../../../libs";
import { IStorageAdapter } from "./interface";

export class LocalStorageAdapter implements IStorageAdapter {
  private readonly _rootDir = config.LOCAL_STORAGE_DIR;

  constructor(rootDir?: string) {
    logger.info("📦 [storage] Local storage adapter initialized");

    if (rootDir) {
      this._rootDir = rootDir;
    }

    if (!fs.existsSync(this._rootDir)) {
      fs.mkdirSync(this._rootDir, { recursive: true });
    }
  }

  async uploadFile(filePath: string, directory: string): Promise<string> {
    const targetDir = path.join(this._rootDir, directory);
    fs.mkdirSync(targetDir, { recursive: true });

    const filename = `${Date.now()}_${path.basename(filePath)}`;
    const destinationPath = path.join(targetDir, filename);
    fs.copyFileSync(filePath, destinationPath);

    const relativeKey = directory ? path.join(directory, filename) : filename;

    return relativeKey.replace(/\\/g, "/"); // fix windows path
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this._rootDir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
