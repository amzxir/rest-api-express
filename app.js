const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");

const placesRouters = require("./routes/places-route");
const usersRouters = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const swaggerSpec = require("./swagger");

const app = express();

app.use(bodyParser.json());

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

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurend !" });
});

mongoose
  .connect(
    "mongodb+srv://amzxir:3jvgBMPMi8T6Beus@cluster0.h2k0nrd.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(3002);
  })
  .catch((err) => {
    console.log(err);
  });
