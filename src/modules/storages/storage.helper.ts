import { config } from "../../config";
import { LocalStorageAdapter } from "./adapters";
import { IStorageAdapter } from "./adapters/interface";

export class StorageFactory {
  static createStorageAdapter(): IStorageAdapter {
    const storageProvider = config.STORAGE_PROVIDER;

    switch (storageProvider) {
      case "local":
        return new LocalStorageAdapter();
      default:
        return new LocalStorageAdapter();
    }
  }
}
