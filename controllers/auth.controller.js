const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const tokenModel = require("../models/token.model");
const asyncHandler = require("express-async-handler");
const { get } = require("mongoose");

const register = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, image } = req.body;

  const verifyEmail = await userModel.findOne({ email: email });
  try {
    if (verifyEmail) {
      return res.status(403).json({
        message: "Email already used",
      });
    } else {
      bcrypt.hash(password, 10).then((hash) => {
        const user = new userModel({
          fullName: fullName,
          username: username,
          email: email,
          password: hash,
          image: image,
        });

        user
          .save()
          .then((response) => {
            return res.status(201).json({
              message: "registered successfully!",
              result: response,
              success: true,
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            });
          });
      });
    }
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const cookies = req.cookies;
  const userAgent = req.header("user-agent");

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await userModel
    .findOne({ $or: [{ email: username }, { username: username }] })
    .exec();

  if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const jwtToken = jwt.sign(
      {
        username: foundUser.username,
        userId: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10s" }
    );
    const newRefreshToken = jwt.sign(
      {
        username: foundUser.username,
        userId: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
      process.env.REFRESH_TOKEN_SECRET
    );

    new tokenModel({
      userId: foundUser._id,
      token: newRefreshToken,
      device: userAgent,
    }).save();

    if (cookies?.jwt) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: jwtToken,
      user: {
        fullName: foundUser.fullName,
        username: foundUser.username,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
      },
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const fetchedRefreshToken = await tokenModel
    .findOne({ token: refreshToken })
    .populate("userId");
  if (!fetchedRefreshToken) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(500).json(err);
    let jwtToken = jwt.sign(
      {
        username: user.username,
        userId: user.userId,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: `${process.env.JWT_TOKEN_EXPIRY}`,
      }
    );
    res.json({
      accessToken: jwtToken,
      user: {
        fullName: fetchedRefreshToken.userId.fullName,
        username: fetchedRefreshToken.userId.username,
        email: fetchedRefreshToken.userId.email,
        isAdmin: fetchedRefreshToken.userId.isAdmin,
      },
    });
  });
});

const userProfile = asyncHandler(async (req, res) => {
  const id = req.userData.userId;

  try {
    const verifyUser = await userModel.findOne({ _id: id });
    if (!verifyUser) {
      return res.status(403).json({
        message: "user not found",
        success: false,
      });
    } else {
      return res.status(200).json({
        messgae: `user ${verifyUser.fullName}`,
        success: true,
      });
    }
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.jwt;
  if (!tokenModel.exists({ token: refreshToken })) return res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, _user) => {
      if (err) return res.status(403).json(err);
      const removedToken = await tokenModel.deleteOne({ token: refreshToken });
      if (removedToken) {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
        return res.status(200).json("Logout Successful");
      }
      return res.status(500).json("Something went wrong");
    }
  );
});

module.exports = {
  register,
  login,
  userProfile,
  refreshToken,
  logout,
};
