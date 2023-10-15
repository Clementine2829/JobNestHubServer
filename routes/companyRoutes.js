// routes/api.js
const express = require('express');
const { 
    getCompany,
    createCompany,
    updateCompany
} = require("../controllers/companyController");
const validateToken = require("../middleware/vallidateTokenHandler");

const router = express.Router();

router.get('/companies/:id', validateToken, getCompany);
router.post('/companies', validateToken, createCompany);
router.put('/companies/:id', validateToken, updateCompany); 

module.exports = router;
