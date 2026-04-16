const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Item = require('../models/Item');
const { getImageUrl } = require('../config/cloudinary');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getItems = asyncHandler(async (req, res, next) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private/Admin
exports.createItem = asyncHandler(async (req, res, next) => {
  const { title, titleAr, description, descriptionAr } = req.body;

  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  const imageUrl = getImageUrl(req.file, "badawy_items");

  const item = await Item.create({
    title,
    titleAr: titleAr || "",
    description,
    descriptionAr: descriptionAr || "",
    imageUrl,
  });

  res.status(201).json({
    success: true,
    data: item
  });
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private/Admin
exports.updateItem = asyncHandler(async (req, res, next) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
  }

  const { title, titleAr, description, descriptionAr } = req.body;

  const updateData = {
    title: title || item.title,
    titleAr: titleAr ?? item.titleAr,
    description: description || item.description,
    descriptionAr: descriptionAr ?? item.descriptionAr,
  };

  if (req.file) {
    updateData.imageUrl = getImageUrl(req.file, "badawy_items");
  }

  item = await Item.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private/Admin
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${req.params.id}`, 404));
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
