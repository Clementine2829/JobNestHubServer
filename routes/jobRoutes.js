// routes/api.js
const express = require("express");
const {
  getJobs,
  getJobByIdAdmin,
  getJobById,
  createJob,
  updateJob,
  getJobApplications,
  getJobApplication,
  applyForJob,
} = require("../controllers/jobController");
const validateToken = require("../middleware/vallidateTokenHandler");

const router = express.Router();

// routes: /api/v1/jobs
router.get("/", getJobs);
router.get("/admin/:id", validateToken, getJobByIdAdmin);
router.get("/:id", getJobById);
router.get("/applications/:id", validateToken, getJobApplications);
router.get("/applications/:userId/:jobId", validateToken, getJobApplication);
router.post("/applications/:jobId", validateToken, applyForJob);
router.post("/", validateToken, createJob);
router.put("/:id", validateToken, updateJob);

module.exports = router;
