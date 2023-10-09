const asyncHandler = require("express-async-handler"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel');
const { json } = require("express");
const crypto = require('crypto');


async function createUser(req, res) {
  try {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;

    // Generate a random 45-character hexadecimal ID
    const userId = crypto.randomBytes(22).toString('hex');

    // Call the model to create the user in the database
    const user = await userModel.createUser({
      id: userId,
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await userModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, password } = req.body;

    // Check if the user exists before updating
    const existingUser = await userModel.getUserById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // You can add more validation here if needed


    // Call the model to update the user in the database
    const updatedUser = await userModel.updateUser(userId, {
      id: userId,
      firstName,
      lastName,
      email,
      password,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  getUser,
  createUser,
  updateUser,
};
