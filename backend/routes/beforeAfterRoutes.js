const express = require("express");
const router = express.Router();
const { createUpload, getImageUrl } = require("../config/cloudinary");
const BeforeAfter = require("../models/BeforeAfter");
const { protect } = require("../middleware/auth");

const upload = createUpload("badawy_before_after");

// GET /api/before-after - Public
router.get("/", async (req, res) => {
  try {
    const cases = await BeforeAfter.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/before-after - Protected
router.post(
  "/",
  protect,
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  async (req, res) => {
    const { title, titleAr } = req.body;
    const beforeImage = req.files?.beforeImage?.[0];
    const afterImage = req.files?.afterImage?.[0];

    if (!beforeImage || !afterImage) {
      return res
        .status(400)
        .json({ message: "Please upload both before and after images" });
    }

    try {
      const newCase = new BeforeAfter({
        title: title?.trim() || "Before / After Case",
        titleAr: titleAr?.trim() || "",
        beforeImageUrl: getImageUrl(beforeImage, "badawy_before_after"),
        afterImageUrl: getImageUrl(afterImage, "badawy_before_after"),
      });

      const savedCase = await newCase.save();
      res.status(201).json(savedCase);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /api/before-after/:id - Protected
router.delete("/:id", protect, async (req, res) => {
  try {
    const existingCase = await BeforeAfter.findById(req.params.id);
    if (!existingCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    await BeforeAfter.deleteOne({ _id: req.params.id });
    res.json({ message: "Case removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
