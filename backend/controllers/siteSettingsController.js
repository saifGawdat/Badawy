const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const SiteSettings = require('../models/SiteSettings');

const getOrCreateSettingsHelper = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
};

// @desc    Get site settings
// @route   GET /api/site-settings
// @access  Public
exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await getOrCreateSettingsHelper();
  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update site settings
// @route   PATCH /api/site-settings
// @access  Private
exports.updateSettings = asyncHandler(async (req, res, next) => {
  const { phone, whatsappPhone, location, locationAr, facebookUrl, instagramUrl } = req.body;

  const settings = await getOrCreateSettingsHelper();

  if (phone !== undefined) settings.phone = String(phone || "").trim();
  if (whatsappPhone !== undefined) {
    settings.whatsappPhone = String(whatsappPhone || "").trim();
  }
  if (location !== undefined) settings.location = String(location || "").trim();
  if (locationAr !== undefined) {
    settings.locationAr = String(locationAr || "").trim();
  }
  if (facebookUrl !== undefined) {
    settings.facebookUrl = String(facebookUrl || "").trim();
  }
  if (instagramUrl !== undefined) {
    settings.instagramUrl = String(instagramUrl || "").trim();
  }
  
  settings.updatedAt = new Date();
  const saved = await settings.save();

  res.status(200).json({
    success: true,
    data: saved
  });
});
