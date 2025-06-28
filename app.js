const express = require("express");
const bodyParser = require("body-parser");

const placesRouters = require("./routes/places-route");

const app = express();

app.use("/api/places", placesRouters);

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurend !" });
});

app.listen(3001);
