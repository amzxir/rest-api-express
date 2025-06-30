const express = require("express");
const placeControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", placeControllers.getPlacebyId);

router.get("/user/:uid", placeControllers.getPlaceByUserId);

module.exports = router;
