const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { protect } = require("../middleware/auth");

// POST /api/appointments - Public
router.post("/", async (req, res) => {
  const { fullName, email, phone, procedure, message } = req.body;

  if (!fullName || !email || !phone || !procedure) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const appointment = new Appointment({
      fullName,
      email,
      phone,
      procedure,
      message: message || "",
    });

    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/appointments - Protected
router.get("/", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/appointments/:id/status - Protected
router.patch("/:id/status", protect, async (req, res) => {
  const { status } = req.body;
  if (!["new", "contacted"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/appointments/:id - Protected
router.delete("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await Appointment.deleteOne({ _id: req.params.id });
    res.json({ message: "Appointment removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
