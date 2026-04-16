const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const BlogPost = require('../models/BlogPost');
const { getImageUrl } = require('../config/cloudinary');

const slugify = (input) => {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const readingTimeFromMarkdown = (md) => {
  const text = String(md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#*_`>|[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

// @desc    Upload inline image
// @route   POST /api/blog/upload-image
// @access  Private
exports.uploadInlineImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }
  res.status(200).json({
    success: true,
    url: getImageUrl(req.file, "badawy_blog_inline")
  });
});

// @desc    Get full post for admin editor
// @route   GET /api/blog/manage/:id
// @access  Private
exports.getPostForAdmin = asyncHandler(async (req, res, next) => {
  const post = await BlogPost.findById(req.params.id).lean();
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Get list for admin
// @route   GET /api/blog/manage
// @access  Private
exports.getPostsForAdmin = asyncHandler(async (req, res, next) => {
  const posts = await BlogPost.find()
    .select("-content -contentAr")
    .sort({ updatedAt: -1 })
    .lean();
  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Get published post by slug
// @route   GET /api/blog/slug/:slug
// @access  Public
exports.getPostBySlug = asyncHandler(async (req, res, next) => {
  const post = await BlogPost.findOne({
    slug: req.params.slug,
    published: true,
  }).lean();
  
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Get all slugs for sitemap
// @route   GET /api/blog/sitemap-data
// @access  Public
exports.getSitemapData = asyncHandler(async (req, res, next) => {
  const posts = await BlogPost.find({ published: true })
    .select("slug updatedAt")
    .lean();
  res.status(200).json({
    success: true,
    data: posts
  });
});

// @desc    Get published posts
// @route   GET /api/blog
// @access  Public
exports.getPublishedPosts = asyncHandler(async (req, res, next) => {
  const posts = await BlogPost.find({ published: true })
    .select("-content -contentAr")
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();
  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Create new post
// @route   POST /api/blog
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
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
    return next(new ErrorResponse('Title, excerpt, and content are required', 400));
  }
  if (!req.file?.path) {
    return next(new ErrorResponse('Featured image is required', 400));
  }

  let slug = slugify(slugBody || title);
  if (!slug) slug = `post-${Date.now()}`;

  const exists = await BlogPost.findOne({ slug });
  if (exists) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const isPublished = published === true || published === "true";
  const readingTimeMinutes = readingTimeFromMarkdown(content);

  const post = await BlogPost.create({
    title: title.trim(),
    titleAr: (titleAr || "").trim(),
    slug,
    excerpt: excerpt.trim(),
    excerptAr: (excerptAr || "").trim(),
    content,
    contentAr: contentAr || "",
    featuredImage: getImageUrl(req.file, "badawy_blog_featured"),
    published: isPublished,
    publishedAt: isPublished ? new Date() : undefined,
    metaTitle: (metaTitle || "").trim(),
    metaDescription: (metaDescription || "").trim(),
    readingTimeMinutes,
  });

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/blog/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

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
        return next(new ErrorResponse('Slug already in use', 400));
      }
      post.slug = newSlug;
    }
  }

  if (published !== undefined) {
    const nextVal = published === true || published === "true";
    if (nextVal && !post.published) post.publishedAt = new Date();
    post.published = nextVal;
  }

  if (req.file) post.featuredImage = getImageUrl(req.file, "badawy_blog_featured");

  await post.save();
  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/blog/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }
  await post.deleteOne();
  res.status(200).json({
    success: true,
    data: {}
  });
});
