import express from "express";
import multer from "multer";
import { uploadFile } from "./upload.controller";

export const uploadRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.post("/", upload.single("file"), uploadFile);
