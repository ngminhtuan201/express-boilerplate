import fs from "fs";
import { errors } from "../../errors";
import { IStorageAdapter } from "./adapters";
import { StorageFactory } from "./storage.helper";

const storageAdapter: IStorageAdapter = StorageFactory.createStorageAdapter();

const uploadFile = async (
  filePath: string,
  directory: string,
): Promise<string> => {
  if (!fs.existsSync(filePath)) {
    throw errors.FileMissing;
  }

  return await storageAdapter.uploadFile(filePath, directory);
};

const deleteFile = async () => {};

export const storageService = {
  uploadFile,
  deleteFile,
};
