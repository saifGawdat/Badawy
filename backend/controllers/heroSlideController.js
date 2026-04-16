const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const HeroSlide = require("../models/HeroSlide");
const { getImageUrl } = require("../config/cloudinary");

// @desc    Get all slides
// @route   GET /api/hero-slides
// @access  Public
exports.getSlides = asyncHandler(async (req, res, next) => {
  const slides = await HeroSlide.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: slides.length,
    data: slides
  });
});

// @desc    Create new slide
// @route   POST /api/hero-slides
// @access  Private
exports.createSlide = asyncHandler(async (req, res, next) => {
  const { title, titleAr, subtitle, subtitleAr, ctaText, ctaTextAr } = req.body;

  if (!req.file) {
    return next(new ErrorResponse('Please upload a hero image', 400));
  }

  const slide = await HeroSlide.create({
    title,
    titleAr: titleAr || "",
    subtitle,
    subtitleAr: subtitleAr || "",
    ctaText: ctaText?.trim() || "Read More",
    ctaTextAr: ctaTextAr?.trim() || "",
    imageUrl: getImageUrl(req.file, "badawy_hero_slides"),
  });

  res.status(201).json({
    success: true,
    data: slide
  });
});

// @desc    Delete slide
// @route   DELETE /api/hero-slides/:id
// @access  Private
exports.deleteSlide = asyncHandler(async (req, res, next) => {
  const slide = await HeroSlide.findById(req.params.id);

  if (!slide) {
    return next(new ErrorResponse(`Slide not found with id of ${req.params.id}`, 404));
  }

  await slide.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
