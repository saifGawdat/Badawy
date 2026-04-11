const express = require("express");
const router = express.Router();
const Visit = require("../models/Visits");
const { protect } = require("../middleware/auth");

/** Best-effort client IP (supports reverse proxies via X-Forwarded-For / X-Real-IP). */
function getClientIp(req) {
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
}

// POST /api/visits/track — public; IP is always taken from the request (not from body)
router.post("/track", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const { path: pathBody, userAgent } = req.body || {};
    const path =
      typeof pathBody === "string" && pathBody.trim()
        ? pathBody.trim().slice(0, 500)
        : "/";
    const ua =
      typeof userAgent === "string" ? userAgent.slice(0, 1000) : "";

    await Visit.create({ ip, path, userAgent: ua });
    res.status(201).json({ ok: true, ip });
  } catch (error) {
    console.error("Visit track error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/visits/stats — protected
router.get("/stats", protect, async (req, res) => {
  try {
    const total = await Visit.countDocuments();
    const uniqueIps = await Visit.distinct("ip");
    res.json({ total, uniqueVisitors: uniqueIps.length });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/visits — protected
router.get("/", protect, async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(String(req.query.limit), 10) || 100, 1), 500);
    const skip = Math.max(parseInt(String(req.query.skip), 10) || 0, 0);
    const visits = await Visit.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
