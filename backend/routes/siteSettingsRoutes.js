const express = require("express");
const router = express.Router();
const SiteSettings = require("../models/SiteSettings");
const { protect } = require("../middleware/auth");

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
};

// GET /api/site-settings - Public
router.get("/", async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/site-settings - Protected
router.patch("/", protect, async (req, res) => {
  const { whatsappPhone } = req.body;

  try {
    const settings = await getOrCreateSettings();
    settings.whatsappPhone = (whatsappPhone || "").trim();
    settings.updatedAt = new Date();
    const saved = await settings.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
