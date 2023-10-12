// routes/api.js
const express = require('express');
const { 
    getUser,
    loginUser,
    createUser, 
    updateUser
} = require("../controllers/userController");
const validateToken = require("../middleware/vallidateTokenHandler");

const router = express.Router();

router.get('/users/:id', validateToken, getUser);
router.post('/users/login', loginUser);
router.post('/users', createUser);
router.put('/users/:id', validateToken, updateUser); 

module.exports = router;
