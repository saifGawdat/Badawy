const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  procedure: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    default: "",
    trim: true,
  },
  status: {
    type: String,
    enum: ["new", "contacted"],
    default: "new",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
