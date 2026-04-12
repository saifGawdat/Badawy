const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema({
  phone: {
    type: String,
    default: "",
    trim: true,
  },
  whatsappPhone: {
    type: String,
    default: "",
    trim: true,
  },
  location: {
    type: String,
    default: "",
    trim: true,
  },
  locationAr: {
    type: String,
    default: "",
    trim: true,
  },
  facebookUrl: {
    type: String,
    default: "",
    trim: true,
  },
  instagramUrl: {
    type: String,
    default: "",
    trim: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
