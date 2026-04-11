const express = require('express');
const router = express.Router();
const multer = require("multer");

if (
  typeof process.env.CLOUDINARY_URL === "string" &&
  !process.env.CLOUDINARY_URL.startsWith("cloudinary://")
) {
  delete process.env.CLOUDINARY_URL;
}

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "badawy_comments",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// GET /api/comments - Public
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/comments - Protected (Admin only)
router.post('/', protect, upload.single("profilePhoto"), async (req, res) => {
  const { username, description, descriptionAr, profilePhoto } = req.body;
  const profilePhotoUrl = req.file?.path || profilePhoto;

  if (!profilePhotoUrl) {
    return res.status(400).json({ message: 'Please upload a profile photo' });
  }

  try {
    const newComment = new Comment({
      username,
      description,
      descriptionAr: descriptionAr || "",
      profilePhoto: profilePhotoUrl
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/comments/:id - Protected (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    await Comment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
