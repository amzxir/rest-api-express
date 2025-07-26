import express from "express";
import { check } from "express-validator";
import {
  createPlace,
  deletePlace,
  getPlacebyId,
  getPlacesByUserId,
  updatePlace,
} from "../controllers/places-controller";
import fileUpload from "../middleware/file-upload";
import checkAuth from "../middleware/check-auth";

const router = express.Router();

router.get("/:pid", getPlacebyId);

router.get("/user/:uid", getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);

router.delete("/:pid", deletePlace);

export default router;
