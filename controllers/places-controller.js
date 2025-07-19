const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlacebyId = async (req, res, next) => {
  const pid = req.params.pid;
  let place;
  try {
    place = await Place.findById(pid);
  } catch {
    const err = new HttpError(
      "Something went wrong , could not find a place",
      500
    );
    return next(err);
  }

  if (!place) {
    const err = new HttpError(
      "Could not find a place for the provided id",
      404
    );
    return next(err);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWhitPlaces;
  try {
    userWhitPlaces = await User.findById(userId).populate("places");
  } catch {
    const err = new HttpError("Could not find a places for user id", 500);
    return next(err);
  }

  if (!userWhitPlaces || userWhitPlaces.places.length === 0) {
    const err = new HttpError(
      "Could not find a places for the provided user id"
    );
    return next(err);
  }

  res.json({
    places: userWhitPlaces.placesf.map((i) => i.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    next(new HttpError("Invalid inputs paseed , please check your data.", 422));
  }

  const { title, description, creator, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    return next(err);
  }

  const createPlace = new Place({
    title,
    address,
    creator,
    description,
    image:
      "https://www.brussels.be/sites/default/files/styles/article_image__hd_/public/grand-place-photo_1.jpg?itok=g4nOYCT2",
    location: coordinates,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch {
    const err = new HttpError("Created plase failed , please try again.", 500);
    return next(err);
  }

  if (!user) {
    const err = new HttpError("Could not find user for provider id", 404);
    return next(err);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createPlace.save({ session: sess });
    user.places.push(createPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch {
    const err = new HttpError("Create place failed , please try again", 500);
    return next(err);
  }

  res.status(201).json({ place: createPlace.toObject({ getters: true }) });
};

const updatePlace = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    throw new HttpError("Invalid inputs paseed , please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid.trim();

  let place;
  try {
    place = await Place.findById(placeId);
  } catch {
    const err = new HttpError(
      "Something went wrong , could not update place",
      500
    );
    return next(err);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch {
    const err = new HttpError(
      "Something went wrong , could not update place",
      500
    );
    return next(err);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid.trim();

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch {
    const err = new HttpError(
      "Something went wrong , could not delete place",
      500
    );
    return next(err);
  }

  if (!place) {
    const err = new HttpError("Could not find place for this id", 404);
    return next(err);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (errs) {
    const err = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(err);
  }

  res.status(200).json({ message: "delete place." });
};

module.exports = {
  getPlacebyId,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
