import express from "express";
import { check } from "express-validator";
import { getUsers, login, signup } from "../controllers/users-controller";
import fileUpload from "../middleware/file-upload";

const router = express.Router();

router.get("/", getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("name").not().isEmpty(),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  login
);

export default router;
