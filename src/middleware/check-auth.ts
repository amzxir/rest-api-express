import HttpError from "../models/http-error";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userData?: { userId: string };
}

const checkAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.method === "OPTION") {
    return next();
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authentication failed!");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_KEY as string
    ) as JwtPayload;

    req.userData = { userId: decodedToken.userId };
    next();
  } catch {
    const err = new HttpError("Authentication failed", 401);
    return next(err);
  }
};

export default checkAuth;
