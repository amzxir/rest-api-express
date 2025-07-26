import * as express from "express";
import { File as MulterFile } from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: MulterFile;
    }
  }
}
