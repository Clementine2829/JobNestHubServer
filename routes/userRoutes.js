// routes/api.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users/:id', userController.getUser);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser); 

module.exports = router;
