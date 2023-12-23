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
  getRelatedJobs,
  getJobsByCompany,
} = require("../controllers/jobController");
const validateToken = require("../middleware/vallidateTokenHandler");

const router = express.Router();

// routes: /api/v1/jobs
router.get("/", getJobs);
router.get("/related/:category", getRelatedJobs);
router.get("/company/:id", getJobsByCompany);
router.get("/admin/:id", validateToken, getJobByIdAdmin);
router.get("/applications", validateToken, getJobApplications);
router.get("/applications/:userId/:jobId", validateToken, getJobApplication);
router.get("/:id", getJobById);
router.post("/applications/:jobId/apply", validateToken, applyForJob);
router.post("/", validateToken, createJob);
router.put("/:id", validateToken, updateJob);

module.exports = router;
