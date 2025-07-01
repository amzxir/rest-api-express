const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

const DUMMUY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "An old man would see you in the neighborhood every day. A",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "with tattered shoes and naked feet playing with plastic balls",
    creator: "u1",
  },
];

const getPlacebyId = (req, res, next) => {
  const pid = req.params.pid;
  const places = DUMMUY_PLACES.find((i) => i.id === pid);

  if (!places) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }

  res.json({ places });
};

const getPlaceByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const places = DUMMUY_PLACES.find((i) => i.creator === uid);

  if (!places) {
    return next(
      new HttpError("Could not find a place for the provided user id")
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const { title, description, creator, address, coordinates } = req.body;
  const createPlace = {
    id: uuidv4(),
    location: coordinates,
    title,
    description,
    creator,
    address,
  };

  DUMMUY_PLACES.push(createPlace);

  res.status(201).json({ place: createPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid.trim();

  const updatedPlace = { ...DUMMUY_PLACES.find((i) => i.id === placeId) };
  const placeIndex = DUMMUY_PLACES.findIndex((i) => i.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMUY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {};

module.exports = {
  getPlacebyId,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
