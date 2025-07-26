import fs from "fs";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import { Request, Response, NextFunction } from "express";

import placesRouters from "./routes/places-route";
import usersRouters from "./routes/users-routes";
import HttpError from "./models/http-error";
import swaggerSpec from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin , X-Requested-With, Content-Type, Accept , Authorization"
  );

  res.setHeader("Access-Control-Allow-Methods", "GET , POST,PATCH , DELETE");
  next();
});

app.use("/api/places", placesRouters);
app.use("/api/users", usersRouters);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  const err = new HttpError("Cloud not find this route.", 404);
  throw err;
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurend !" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h2k0nrd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
