const express = require("express");
const router = express.Router();
const { createUpload } = require("../config/cloudinary");
const { protect } = require("../middleware/auth");
const {
  getCases,
  createCase,
  deleteCase
} = require("../controllers/beforeAfterController");

const upload = createUpload("badawy_before_after");

router.route("/")
  .get(getCases)
  .post(
    protect,
    upload.fields([
      { name: "beforeImage", maxCount: 1 },
      { name: "afterImage", maxCount: 1 },
    ]),
    createCase
  );

router.route("/:id")
  .delete(protect, deleteCase);

module.exports = router;
