const express = require("express");
const router = express.Router();
const multer = require("multer");

// Cloudinary throws during import when CLOUDINARY_URL exists but is malformed.
// Fall back to explicit credentials in that case so the server can boot.
if (
  typeof process.env.CLOUDINARY_URL === "string" &&
  !process.env.CLOUDINARY_URL.startsWith("cloudinary://")
) {
  delete process.env.CLOUDINARY_URL;
}

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Item = require("../models/Item");
const { protect } = require("../middleware/auth");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "badawy_items",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

// GET /api/items - Public
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/items/:id - Public
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/items - Protected
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { title, titleAr, description, descriptionAr } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  const imageUrl = req.file.path;

  try {
    const newItem = new Item({
      title,
      titleAr: titleAr || "",
      description,
      descriptionAr: descriptionAr || "",
      imageUrl,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);  
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/items/:id - Protected
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  const { title, titleAr, description, descriptionAr } = req.body;
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.title = title || item.title;
    item.titleAr = titleAr ?? item.titleAr;
    item.description = description || item.description;
    item.descriptionAr = descriptionAr ?? item.descriptionAr;

    if (req.file) {
      item.imageUrl = req.file.path;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/items/:id - Protected
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await Item.deleteOne({ _id: req.params.id });
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
