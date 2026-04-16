const express = require("express");
const router = express.Router();
const { createUpload } = require("../config/cloudinary");
const { protect } = require("../middleware/auth");
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/itemController");

const upload = createUpload("badawy_items");

router.route("/")
  .get(getItems)
  .post(protect, upload.single("image"), createItem);

router.route("/:id")
  .get(getItem)
  .put(protect, upload.single("image"), updateItem)
  .delete(protect, deleteItem);

module.exports = router;
