const asyncHandler = require("express-async-handler"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { json } = require("express");
const crypto = require('crypto');


//@desc Register a new user
//@route POST api/users/register
//@access public 
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if(!firstName || !lastName || !email || !password){
    res.status(400);
    throw new Error("All fields are required");
  }

  const userAvailable = await User.findUserByEmail(email);
  if(userAvailable){
      res.status(400);
      throw new Error("User already registered");
  }

  // Generate a random 45-character hexadecimal ID
  const userId = crypto.randomBytes(22).toString('hex');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.createUser({
    id: userId,
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if(user){
    res.status(200).json({id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email});
  }else{
      res.status(400);
      throw new Error("User data is not valid");
  }
})

//@desc Login user
//@route POST api/users/login
//@access public 
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
      res.status(400);
      throw new Error("Invalid user credentials");
  }

  const user = await User.findUserByEmail(email);
  // compare user password with the hashed password in db
  if(user && (await bcrypt.compare(password, user.password))){
      // when signing the access token, decide what you want to put inside
      const accessToken = jwt.sign({
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
          },
      }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: "30m"}
      );
      console.log(accessToken)
      res.status(200).json({ accessToken });
  }else{
      res.status(401);
      throw new Error("Invalid user credentials")
  }
})
//@desc Get user profile
//@route POST api/users/:id
//@access private 
const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findUserById(userId);

    if (user) {
      res.status(200).json(user);
    }else{
      res.status(404);
      throw new Error("User not found")
    }
})

//@desc Update user
//@route POST api/users/login
//@access private  
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email } = req.body;

  // Check if the user exists before updating
  const existingUser = await User.findUserById(userId);

  if (!existingUser) {
    res.status(404);
    throw new Error("User not found")
  }
  
  const updatedUser = await User.updateUser({
    id: userId,
    firstName,
    lastName,
    email,
  });

  if (updatedUser === 1) {
    res.status(200).json({id: userId, firstName, lastName, email});
  } else {
    res.status(401);
    throw new Error('User update failed.');
  }
});

module.exports = {
  loginUser,
  getUser,
  createUser,
  updateUser,
};
