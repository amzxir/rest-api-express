const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch {
    const err = new HttpError("fetching data user , plwasw try again", 500);
    return next(err);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
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

  const { name, email, password } = req.body;

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

  const imagePath = `uploads/images/${req.file.filename}`;

  let hashPassword;

  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch {
    const err = new HttpError("Could not create user, please try again", 500);
    return next(err);
  }

  const createUSer = new User({
    email,
    password: hashPassword,
    name,
    image: imagePath,
    places: [],
  });

  try {
    await createUSer.save();
  } catch {
    const err = new HttpError("Signin up failed , please try again", 500);
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createUSer.id, email: createUSer.email },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );
  } catch {
    const err = new HttpError("SignUp faled , please try again", 500);
    return next(err);
  }

  res
    .status(201)
    .json({ userId: createUSer.id, email: createUSer.email, token });
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

  if (!hasUser) {
    const err = new HttpError("Invalid credentials could not log you in.", 401);
    return next(err);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, hasUser.password);
  } catch {
    const err = new HttpError(
      "Not log you in please check your crodentials and try agian",
      500
    );
    return next(err);
  }

  if (!isValidPassword) {
    const err = new HttpError("Invalid credentials could not log you in.", 401);
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: hasUser.id, email: hasUser.email },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );
  } catch {
    const err = new HttpError("SignUp faled , please try again", 500);
    return next(err);
  }

  res.json({ userId: hasUser.id, email: hasUser.email, token });
};

module.exports = { getUsers, signup, login };
