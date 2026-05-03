const express = require("express");
const router = express.Router();

const {
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobcontroller");

const { protect, authorize } = require("../middleware/auth");

router.get("/", getJobs);
router.post("/", protect, authorize("recruiter"), createJob);
router.get("/:id", getJobById);
router.patch("/:id", protect, authorize("recruiter"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);

module.exports = router;