// routes/api.js
const express = require("express");
const multer = require("multer");
const {
  getJobs,
  getJobByIdAdmin,
  getJobById,
  updateJob,
  getJobApplications,
  getJobApplication,
  applyForJob,
  getRelatedJobs,
  getJobsByCompany,
} = require("../controllers/jobController");
const validateToken = require("../middleware/vallidateTokenHandler");

const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Multer middleware applied to the route
const uploadMiddleware = upload.single("cvFile");

// routes: /api/v1/jobs
router.get("/", getJobs);
router.get("/related/:category", getRelatedJobs);
router.get("/company/:id", getJobsByCompany);
router.get("/admin/:id", validateToken, getJobByIdAdmin);
router.get("/applications", validateToken, getJobApplications);
router.get("/applications/:userId/:jobId", validateToken, getJobApplication);
router.get("/:id", getJobById);
router.post("/applications/:jobId/apply", uploadMiddleware, applyForJob);
// router.post("/applications/:jobId/apply", validateToken, applyForJob);
router.post("/update/:id", validateToken, updateJob);
router.post("/update", validateToken, updateJob);
// router.put("/:id", validateToken, updateJob);

module.exports = router;
