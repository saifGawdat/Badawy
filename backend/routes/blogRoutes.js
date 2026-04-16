const express = require("express");
const router = express.Router();
const { createUpload } = require("../config/cloudinary");
const { protect } = require("../middleware/auth");
const {
  uploadInlineImage,
  getPostForAdmin,
  getPostsForAdmin,
  getPostBySlug,
  getSitemapData,
  getPublishedPosts,
  createPost,
  updatePost,
  deletePost
} = require("../controllers/blogController");

const uploadFeatured = createUpload("badawy_blog_featured");
const uploadInline = createUpload("badawy_blog_inline", ["jpg", "png", "jpeg", "webp", "gif"]);

// Base routes
router.route("/")
  .get(getPublishedPosts)
  .post(protect, uploadFeatured.single("featuredImage"), createPost);

// Admin management routes
router.get("/manage", protect, getPostsForAdmin);
router.get("/manage/:id", protect, getPostForAdmin);

// Specialized public routes
router.get("/slug/:slug", getPostBySlug);
router.get("/sitemap-data", getSitemapData);

// Utility routes
router.post("/upload-image", protect, uploadInline.single("image"), uploadInlineImage);

// Individual post routes (admin/protected edits)
router.route("/:id")
  .put(protect, uploadFeatured.single("featuredImage"), updatePost)
  .delete(protect, deletePost);

module.exports = router;
