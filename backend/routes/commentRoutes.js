const express = require('express');
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { protect } = require('../middleware/auth');
const {
  getComments,
  createComment,
  deleteComment
} = require('../controllers/commentController');

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

router.route('/')
  .get(getComments)
  .post(protect, upload.single("profilePhoto"), createComment);

router.route('/:id')
  .delete(protect, deleteComment);

module.exports = router;
