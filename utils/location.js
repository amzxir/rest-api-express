const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  const res = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = res.data;

  if (!data) {
    throw new HttpError(
      "Could not find location for the specified address.",
      422
    );
  }

  const coordinates = data.results[0].geometry;

  return coordinates;
}

module.exports = getCoordsForAddress;
