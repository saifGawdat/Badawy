const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getSettings, updateSettings } = require("../controllers/siteSettingsController");

router.route("/")
  .get(getSettings)
  .patch(protect, updateSettings);

module.exports = router;
