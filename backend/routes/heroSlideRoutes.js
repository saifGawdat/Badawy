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
const HeroSlide = require("../models/HeroSlide");
const { protect } = require("../middleware/auth");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "badawy_hero_slides",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// GET /api/hero-slides - Public
router.get("/", async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ createdAt: -1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/hero-slides - Protected
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { title, titleAr, subtitle, subtitleAr, ctaText, ctaTextAr } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Please upload a hero image" });
  }

  try {
    const slide = new HeroSlide({
      title,
      titleAr: titleAr || "",
      subtitle,
      subtitleAr: subtitleAr || "",
      ctaText: ctaText?.trim() || "Read More",
      ctaTextAr: ctaTextAr?.trim() || "",
      imageUrl: req.file.path,
    });

    const savedSlide = await slide.save();
    res.status(201).json(savedSlide);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/hero-slides/:id - Protected
router.delete("/:id", protect, async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    await HeroSlide.deleteOne({ _id: req.params.id });
    res.json({ message: "Slide removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
