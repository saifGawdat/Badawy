const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema({
  whatsappPhone: {
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
