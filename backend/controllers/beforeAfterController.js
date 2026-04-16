const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const BeforeAfter = require('../models/BeforeAfter');
const { getImageUrl } = require('../config/cloudinary');

// @desc    Get all cases
// @route   GET /api/before-after
// @access  Public
exports.getCases = asyncHandler(async (req, res, next) => {
  const cases = await BeforeAfter.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: cases.length,
    data: cases
  });
});

// @desc    Create new case
// @route   POST /api/before-after
// @access  Private
exports.createCase = asyncHandler(async (req, res, next) => {
  const { title, titleAr } = req.body;
  const beforeImage = req.files?.beforeImage?.[0];
  const afterImage = req.files?.afterImage?.[0];

  if (!beforeImage || !afterImage) {
    return next(new ErrorResponse('Please upload both before and after images', 400));
  }

  const newCase = await BeforeAfter.create({
    title: title?.trim() || "Before / After Case",
    titleAr: titleAr?.trim() || "",
    beforeImageUrl: getImageUrl(beforeImage, "badawy_before_after"),
    afterImageUrl: getImageUrl(afterImage, "badawy_before_after"),
  });

  res.status(201).json({
    success: true,
    data: newCase
  });
});

// @desc    Delete case
// @route   DELETE /api/before-after/:id
// @access  Private
exports.deleteCase = asyncHandler(async (req, res, next) => {
  const existingCase = await BeforeAfter.findById(req.params.id);
  
  if (!existingCase) {
    return next(new ErrorResponse(`Case not found with id of ${req.params.id}`, 404));
  }

  await existingCase.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
