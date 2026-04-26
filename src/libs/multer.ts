import multer from "multer";
import { config } from "../config";

export const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.UPLOAD_SIZE_LIMIT,
  },

  // TODO: Add file filter
});
