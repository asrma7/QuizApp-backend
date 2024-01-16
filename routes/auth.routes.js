const express = require("express");
const router = express.Router();

const {
  regsiterValidation,
  loginValidation,
  tokenValidation,
} = require("../middlewares/authvalidation.middleware");

const {
  refreshToken,
  login,
  register,
  userProfile,
  logout,
} = require("../controllers/auth.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/register", regsiterValidation, register);
router.post("/login", loginValidation, login);
router.post("/token", tokenValidation, refreshToken);
router.get("/profile", verifyToken, userProfile);
router.delete("/logout", tokenValidation, logout);

module.exports = router;
