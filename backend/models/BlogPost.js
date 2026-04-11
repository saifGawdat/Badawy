const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    titleAr: { type: String, default: "", trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    excerptAr: { type: String, default: "", trim: true },
    content: { type: String, required: true },
    contentAr: { type: String, default: "" },
    featuredImage: { type: String, required: true },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
    readingTimeMinutes: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);
