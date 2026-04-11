const express = require("express");
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
const mongoose = require("mongoose");
const BlogPost = require("../models/BlogPost");
const { protect } = require("../middleware/auth");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const featuredStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "badawy_blog_featured",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const inlineStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "badawy_blog_inline",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
  },
});

const uploadFeatured = multer({ storage: featuredStorage });
const uploadInline = multer({ storage: inlineStorage });

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function readingTimeFromMarkdown(md) {
  const text = String(md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#*_`>|[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// POST upload inline image for markdown (returns URL)
router.post(
  "/upload-image",
  protect,
  uploadInline.single("image"),
  async (req, res) => {
    if (!req.file?.path) {
      return res.status(400).json({ message: "Please upload an image" });
    }
    res.json({ url: req.file.path });
  }
);

// GET full post for admin editor
router.get("/manage/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const post = await BlogPost.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET list for admin (no heavy content in list)
router.get("/manage", protect, async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .select("-content -contentAr")
      .sort({ updatedAt: -1 })
      .lean();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET published post by slug (public)
router.get("/slug/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET all slugs for sitemap (public, published only)
router.get("/sitemap-data", async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .select("slug updatedAt")
      .lean();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET published posts (public)
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .select("-content -contentAr")
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", protect, uploadFeatured.single("featuredImage"), async (req, res) => {
  const {
    title,
    titleAr,
    slug: slugBody,
    excerpt,
    excerptAr,
    content,
    contentAr,
    metaTitle,
    metaDescription,
    published,
  } = req.body;

  if (!title || !excerpt || !content) {
    return res.status(400).json({ message: "Title, excerpt, and content are required" });
  }
  if (!req.file?.path) {
    return res.status(400).json({ message: "Featured image is required" });
  }

  let slug = slugify(slugBody || title);
  if (!slug) slug = `post-${Date.now()}`;

  const exists = await BlogPost.findOne({ slug });
  if (exists) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const isPublished = published === true || published === "true";
  const readingTimeMinutes = readingTimeFromMarkdown(content);

  try {
    const post = await BlogPost.create({
      title: title.trim(),
      titleAr: (titleAr || "").trim(),
      slug,
      excerpt: excerpt.trim(),
      excerptAr: (excerptAr || "").trim(),
      content,
      contentAr: contentAr || "",
      featuredImage: req.file.path,
      published: isPublished,
      publishedAt: isPublished ? new Date() : undefined,
      metaTitle: (metaTitle || "").trim(),
      metaDescription: (metaDescription || "").trim(),
      readingTimeMinutes,
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Blog create error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, uploadFeatured.single("featuredImage"), async (req, res) => {
  const {
    title,
    titleAr,
    slug: slugBody,
    excerpt,
    excerptAr,
    content,
    contentAr,
    metaTitle,
    metaDescription,
    published,
  } = req.body;

  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (title != null) post.title = String(title).trim();
    if (titleAr != null) post.titleAr = String(titleAr).trim();
    if (excerpt != null) post.excerpt = String(excerpt).trim();
    if (excerptAr != null) post.excerptAr = String(excerptAr).trim();
    if (content != null) {
      post.content = content;
      post.readingTimeMinutes = readingTimeFromMarkdown(content);
    }
    if (contentAr != null) post.contentAr = contentAr;
    if (metaTitle != null) post.metaTitle = String(metaTitle).trim();
    if (metaDescription != null) post.metaDescription = String(metaDescription).trim();

    if (slugBody != null && String(slugBody).trim()) {
      const newSlug = slugify(slugBody);
      if (newSlug && newSlug !== post.slug) {
        const taken = await BlogPost.findOne({ slug: newSlug, _id: { $ne: post._id } });
        if (taken) {
          return res.status(400).json({ message: "Slug already in use" });
        }
        post.slug = newSlug;
      }
    }

    if (published !== undefined) {
      const next = published === true || published === "true";
      if (next && !post.published) post.publishedAt = new Date();
      post.published = next;
    }

    if (req.file?.path) post.featuredImage = req.file.path;

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Blog update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await BlogPost.deleteOne({ _id: req.params.id });
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
