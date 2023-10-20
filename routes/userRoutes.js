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

router.get('/:id', validateToken, getUser);
router.post('/login', loginUser);
router.post('/', createUser);
router.put('/:id', validateToken, updateUser); 

module.exports = router;
