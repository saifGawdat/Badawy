const express = require("express");
const router = express.Router();
const { createUpload } = require("../config/cloudinary");
const { protect } = require("../middleware/auth");
const { getSlides, createSlide, deleteSlide } = require("../controllers/heroSlideController");

const upload = createUpload("badawy_hero_slides");

router.route("/")
  .get(getSlides)
  .post(protect, upload.single("image"), createSlide);

router.route("/:id")
  .delete(protect, deleteSlide);

module.exports = router;
