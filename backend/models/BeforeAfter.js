const mongoose = require("mongoose");

const beforeAfterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  beforeImageUrl: {
    type: String,
    required: true,
  },
  afterImageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BeforeAfter", beforeAfterSchema);
