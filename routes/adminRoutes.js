const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getAdminStats } = require("../controllers/usercontroller");

// GET /api/v1/admin/stats
router.get("/stats", protect, authorize("admin"), getAdminStats);

module.exports = router;