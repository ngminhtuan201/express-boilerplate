export interface UploadFile {
  file: Express.Multer.File;
}

export interface UploadFileResult {
  key: string;
  url: string;
}

export interface IStorageAdapter {
  uploadFile(file: UploadFile): Promise<UploadFileResult>;
  deleteFile(key: string): Promise<void>;
}
