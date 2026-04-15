const express = require("express");
const router = express.Router();
const { createUpload, getImageUrl } = require("../config/cloudinary");
const Item = require("../models/Item");
const { protect } = require("../middleware/auth");

const upload = createUpload("badawy_items");

// GET /api/items - Public
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("GET /api/items error:", error.stack || error);
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
    console.error("GET /api/items/:id error:", error.stack || error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/items - Protected
router.post("/", protect, upload.single("image"), async (req, res) => {
  const { title, titleAr, description, descriptionAr } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  const imageUrl = getImageUrl(req.file, "badawy_items");

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
    console.error("GET /api/items error:", error);
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
      item.imageUrl = getImageUrl(req.file);
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error("PUT /api/items/:id error:", error.stack || error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
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
    console.error("DELETE /api/items/:id error:", error.stack || error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
