const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  titleAr: {
    type: String,
    default: "",
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  subtitleAr: {
    type: String,
    default: "",
  },
  ctaText: {
    type: String,
    default: "Read More",
  },
  ctaTextAr: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
