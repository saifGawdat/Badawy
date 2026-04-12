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
  const { phone, whatsappPhone, location, locationAr, facebookUrl, instagramUrl } = req.body;

  try {
    const settings = await getOrCreateSettings();
    if (phone !== undefined) settings.phone = String(phone || "").trim();
    if (whatsappPhone !== undefined) {
      settings.whatsappPhone = String(whatsappPhone || "").trim();
    }
    if (location !== undefined) settings.location = String(location || "").trim();
    if (locationAr !== undefined) {
      settings.locationAr = String(locationAr || "").trim();
    }
    if (facebookUrl !== undefined) {
      settings.facebookUrl = String(facebookUrl || "").trim();
    }
    if (instagramUrl !== undefined) {
      settings.instagramUrl = String(instagramUrl || "").trim();
    }
    settings.updatedAt = new Date();
    const saved = await settings.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
