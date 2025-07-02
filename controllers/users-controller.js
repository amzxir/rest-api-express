const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

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

const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((i) => i.email === email);

  if (hasUser) {
    throw new HttpError("Could not create user , email alerty exits.", 422);
  }

  const createUSer = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createUSer);

  res.status(201).json({ user: createUSer });
};

const login = (req, res, next) => {
  const { password, email } = req.body;
  const identifiedUSer = DUMMY_USERS.find((i) => i.email === email);

  if (!identifiedUSer || identifiedUSer.password !== password) {
    throw new HttpError(
      "Could not indentify user, credentials seem to be wrong.",
      401
    );
  }

  res.json({ message: "logged in !" });
};

module.exports = { getUsers, signup, login };
