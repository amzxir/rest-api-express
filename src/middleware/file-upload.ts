import multer from "multer";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const MINE_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const uploadPath = path.join(__dirname, "../uploads", "images");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const fileUpload = multer({
  limits: { fileSize: 500000 },
  storage: multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, uploadPath);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      const ext = MINE_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null) => void
  ) => {
    const isValid = !!MINE_TYPE_MAP[file.mimetype];
    if (!isValid) {
      return cb(new Error("Invalid mime type!"));
    }
    cb(null);
  },
});

export default fileUpload;
