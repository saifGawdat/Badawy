const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
  },
  descriptionAr: {
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

module.exports = mongoose.model("Item", itemSchema);
