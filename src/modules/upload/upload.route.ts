import express from "express";
import multer from "multer";
import { uploadController } from "./upload.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadController.uploadFile);

export const uploadRouter = router;
