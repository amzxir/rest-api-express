const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", userController.getUsers);

router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("name").not().isEmpty(),
  ],
  userController.signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.login
);

module.exports = router;
