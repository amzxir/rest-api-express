const express = require("express");
const bodyParser = require("body-parser");

const placesRouters = require("./routes/places-route");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRouters);

app.use((req, res, next) => {
  const err = new HttpError("Cloud not find this route.", 404);
  throw err;
});

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurend !" });
});

app.listen(3001);
