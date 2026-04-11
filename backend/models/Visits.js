const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true, index: true },
    userAgent: { type: String, default: "" },
    path: { type: String, default: "/" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visit", visitSchema);
