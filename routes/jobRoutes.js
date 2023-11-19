// routes/api.js
const express = require('express');
const { 
    getJobs,
    getJobByIdAdmin,
    getJobById,
    createJob,
    updateJob
} = require("../controllers/jobController");
const validateToken = require("../middleware/vallidateTokenHandler");

const router = express.Router();

// routes: /api/v1/jobs
router.get('/', getJobs);
router.get('/admin/:id', validateToken, getJobByIdAdmin);
router.get('/:id', getJobById);
router.post('/', validateToken, createJob);
router.put('/:id', validateToken, updateJob); 

module.exports = router;
