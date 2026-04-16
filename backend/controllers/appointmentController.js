const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Appointment = require('../models/Appointment');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
exports.createAppointment = asyncHandler(async (req, res, next) => {
  const { fullName, email, phone, procedure, message } = req.body;

  if (!fullName || !email || !phone || !procedure) {
    return next(new ErrorResponse('Please fill all required fields', 400));
  }

  const appointment = await Appointment.create({
    fullName,
    email,
    phone,
    procedure,
    message: message || "",
  });

  res.status(201).json({
    success: true,
    data: appointment
  });
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!["new", "contacted"].includes(status)) {
    return next(new ErrorResponse('Invalid status value', 400));
  }

  let appointment = await Appointment.findById(req.params.id);
  
  if (!appointment) {
    return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
  }

  appointment.status = status;
  await appointment.save();

  res.status(200).json({
    success: true,
    data: appointment
  });
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
