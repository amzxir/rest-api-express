import { Request } from "express";

interface ReqsPlace extends Request {
  userData?: { userId: string };
  file?: { filename: string };
}

