const express = require("express");
const {
  getUser,
  refreshTokenUser,
  loginUser,
  createUser,
  updateUser,
  getUserProfile,
} = require("../controllers/userController");
const validateToken = require("../middleware/vallidateTokenHandler");

const router = express.Router();

router.get("/:id", validateToken, getUser);
// router.get("/:id", validateToken, getUser);
router.get("/profile/:id", getUserProfile);
router.get("/refresh-token", refreshTokenUser);
router.post("/login", loginUser);
router.post("/signup", createUser);
router.put("/:id", validateToken, updateUser);

module.exports = router;
