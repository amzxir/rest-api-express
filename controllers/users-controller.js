const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Amir Ahmadi",
    email: "test@test.com",
    password: "test123",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    const err = new HttpError(
      "Invalid inputs paseed , please check your data",
      422
    );
    return next(err);
  }

  const { name, email, password, places } = req.body;

  let hasUser;
  try {
    hasUser = await User.findOne({ email });
  } catch (error) {
    const err = new HttpError("Signin up failed , please try again later");
    return next(err);
  }

  if (hasUser) {
    const err = new HttpError(
      "user exists aleady , please login instead.",
      422
    );
    return next(err);
  }

  const createUSer = new User({
    email,
    password,
    name,
    image: "https://i.sstatic.net/l60Hf.png",
    places,
  });

  try {
    await createUSer.save();
  } catch {
    const err = new HttpError("Signin up failed , please try again", 500);
    return next(err);
  }

  res.status(201).json({ user: createUSer.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    const err = new HttpError(
      "Invalid inputs paseed , please check your data",
      422
    );
    return next(err);
  }
  const { password, email } = req.body;

  let hasUser;
  try {
    hasUser = await User.findOne({ email });
  } catch (error) {
    const err = new HttpError("loggin in failed , please try again later");
    return next(err);
  }

  if (!hasUser || hasUser.password !== password) {
    const err = new HttpError("Invalid credentials could not log you in.", 401);
    return next(err);
  }

  res.json({ message: "logged in !" });
};

module.exports = { getUsers, signup, login };
