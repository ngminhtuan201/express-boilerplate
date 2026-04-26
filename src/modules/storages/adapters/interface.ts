export interface UploadFile {
  file: Express.Multer.File;
}

export interface UploadFileResult {
  key: string;
  url: string;
}

export interface IStorageAdapter {
  /**
   * Upload a file from local to storage
   */
  uploadFile(file: UploadFile): Promise<UploadFileResult>;

  /**
   * Delete a file from storage
   */
  deleteFile(key: string): Promise<void>;
}
