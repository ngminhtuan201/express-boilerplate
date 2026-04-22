export interface IStorageAdapter {
  /**
   * Upload a file from local to storage
   */
  uploadFile(
    filePath: string,
    directory: string,
    prefix?: boolean,
  ): Promise<string>;
  deleteFile(key: string): Promise<void>;
}
