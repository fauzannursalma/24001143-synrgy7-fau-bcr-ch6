import multer, { Multer } from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.memoryStorage();

const upload: Multer = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      throw new Error("Only images are allowed");
    }
    cb(null, true);
  },
});

export default upload;
