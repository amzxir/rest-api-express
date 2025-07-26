import { Request } from "express";

interface ReqsUser extends Request {
  userData?: { userId: string };
  file?: { filename: string };
}

