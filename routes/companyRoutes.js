// routes/api.js
const express = require('express');
const { 
    getCompany,
    createCompany,
    updateCompany
} = require("../controllers/companyController");
const validateToken = require("../middleware/vallidateTokenHandler");

const router = express.Router();

router.get('/:id', validateToken, getCompany);
router.post('/', validateToken, createCompany);
router.put('/:id', validateToken, updateCompany); 

module.exports = router;
