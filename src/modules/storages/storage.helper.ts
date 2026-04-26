import { config } from "../../config";
import { StorageProvider } from "../../enums";
import { LocalStorageAdapter } from "./adapters";
import { IStorageAdapter } from "./adapters/interface";

export class StorageFactory {
  static getAdapter(): IStorageAdapter {
    const storageProvider = config.STORAGE_PROVIDER;

    switch (storageProvider) {
      case StorageProvider.LOCAL:
        return new LocalStorageAdapter();
      default:
        return new LocalStorageAdapter();
    }
  }
}
