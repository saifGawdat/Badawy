const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { trackVisit, getStats, getVisits } = require("../controllers/visitController");

router.post("/track", trackVisit);
router.get("/stats", protect, getStats);
router.get("/", protect, getVisits);

module.exports = router;
