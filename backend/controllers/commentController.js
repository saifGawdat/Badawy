const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Comment = require('../models/Comment');

// @desc    Get all comments
// @route   GET /api/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private/Admin
exports.createComment = asyncHandler(async (req, res, next) => {
  const { username, description, descriptionAr, profilePhoto } = req.body;
  const profilePhotoUrl = req.file?.path || profilePhoto;

  if (!profilePhotoUrl) {
    return next(new ErrorResponse('Please upload a profile photo', 400));
  }

  const comment = await Comment.create({
    username,
    description,
    descriptionAr: descriptionAr || "",
    profilePhoto: profilePhotoUrl
  });

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private/Admin
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
