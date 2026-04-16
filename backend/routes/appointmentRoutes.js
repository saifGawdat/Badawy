const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
} = require("../controllers/appointmentController");

router.route("/")
  .post(createAppointment)
  .get(protect, getAppointments);

router.route("/:id")
  .delete(protect, deleteAppointment);

router.patch("/:id/status", protect, updateAppointmentStatus);

module.exports = router;
