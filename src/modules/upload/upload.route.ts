import express from "express";
import { uploader } from "../../libs";
import { authenticate } from "../../middlewares";
import { uploadFile } from "./upload.controller";

export const uploadRouter = express.Router();

uploadRouter.post("/", authenticate(), uploader.single("file"), uploadFile);
