import { config } from "../../config";
import {
  LocalStorageAdapter,
  R2StorageAdapter,
  S3StorageAdapter,
} from "./adapters";
import { IStorageAdapter } from "./adapters/interface";

export class StorageFactory {
  static createStorageAdapter(): IStorageAdapter {
    const storageProvider = config.STORAGE_PROVIDER;

    switch (storageProvider) {
      case "local":
        return new LocalStorageAdapter();
      case "r2":
        return new R2StorageAdapter();
      case "s3":
        return new S3StorageAdapter();
      default:
        return new LocalStorageAdapter();
    }
  }
}
