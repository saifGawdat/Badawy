const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Visit = require("../models/Visits");

/** Best-effort client IP (supports reverse proxies via X-Forwarded-For / X-Real-IP). */
const getClientIp = (req) => {
  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    const raw = Array.isArray(xff) ? xff[0] : xff;
    const first = raw.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = req.headers["x-real-ip"];
  if (realIp && typeof realIp === "string") return realIp.trim();

  let ip = req.socket?.remoteAddress || req.ip || "";
  if (typeof ip === "string" && ip.startsWith("::ffff:")) ip = ip.slice(7);
  return ip || "unknown";
};

// @desc    Track visit
// @route   POST /api/visits/track
// @access  Public
exports.trackVisit = asyncHandler(async (req, res, next) => {
  const ip = getClientIp(req);
  const { path: pathBody, userAgent } = req.body || {};
  const path =
    typeof pathBody === "string" && pathBody.trim()
      ? pathBody.trim().slice(0, 500)
      : "/";
  const ua =
    typeof userAgent === "string" ? userAgent.slice(0, 1000) : "";

  await Visit.create({ ip, path, userAgent: ua });
  res.status(201).json({ success: true, ip });
});

// @desc    Get visit stats
// @route   GET /api/visits/stats
// @access  Private
exports.getStats = asyncHandler(async (req, res, next) => {
  const total = await Visit.countDocuments();
  const uniqueIps = await Visit.distinct("ip");
  res.status(200).json({
    success: true,
    data: {
      total,
      uniqueVisitors: uniqueIps.length
    }
  });
});

// @desc    Get all visits
// @route   GET /api/visits
// @access  Private
exports.getVisits = asyncHandler(async (req, res, next) => {
  const limit = Math.min(Math.max(parseInt(String(req.query.limit), 10) || 100, 1), 500);
  const skip = Math.max(parseInt(String(req.query.skip), 10) || 0, 0);
  
  const visits = await Visit.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
  res.status(200).json({
    success: true,
    count: visits.length,
    data: visits
  });
});
