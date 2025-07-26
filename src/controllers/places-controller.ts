import fs from "fs";
import { Request, Response, NextFunction } from "express";
import HttpError from "../models/http-error";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import getCoordsForAddress from "../utils/location";
import User, { IUser } from "../models/user";
import Place, { IPlace } from "../models/place";
import { ReqsPlace } from "../types/placeController";


const getPlacebyId = async (
  req: Request<{ pid: string }>,
  res: Response,
  next: NextFunction
) => {
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

const getPlacesByUserId = async (req: Request<{ uid: string }>, res:Response, next:NextFunction) => {
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
    places: userWhitPlaces.places.map((i:any) => i.toObject({ getters: true })),
  });
};

const createPlace = async (req:ReqsPlace, res:Response, next:NextFunction) => {
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

  const imagePath = `uploads/images/${req.file?.filename}`;

  const createPlace = new Place({
    title,
    address,
    creator: req.userData?.userId,
    description,
    image: imagePath,
    location: coordinates,
  });

  let user;
  try {
    user = await User.findById(req.userData?.userId);
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
    user.places.push(createPlace._id as mongoose.Types.ObjectId);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch {
    const err = new HttpError("Create place failed , please try again", 500);
    return next(err);
  }

  res.status(201).json({ place: createPlace.toObject({ getters: true }) });
};

const updatePlace = async (req:ReqsPlace, res:Response, next:NextFunction) => {
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

  if (!place) {
    const err = new HttpError("Place not found", 404);
    return next(err);
  }

  if (place.creator.toString() !== req.userData?.userId) {
    const err = new HttpError("You are not allowed to edit this place", 403);
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

const deletePlace = async (req:ReqsPlace, res:Response, next:NextFunction) => {
  const placeId = req.params.pid.trim();

  let place;
  try {
    place = await Place.findById(placeId).populate("creator") as unknown as IPlace & { creator: IUser };

  } catch {
    const err = new HttpError(
      "Something went wrong , could not delete place",
      500
    );
    return next(err);
  }

  if (!place) {
    const err = new HttpError("Place not found", 404);
    return next(err);
  }

  if (place?.creator.id !== req.userData?.userId) {
    const err = new HttpError("You are not allowed to delete this place", 403);
    return next(err);
  }

  if (!place) {
    const err = new HttpError("Could not find place for this id", 404);
    return next(err);
  }

  const imagePath = place.image;

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

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "delete place." });
};

export {
  getPlacebyId,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
