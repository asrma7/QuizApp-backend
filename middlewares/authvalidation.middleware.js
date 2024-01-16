const validator = require("../utils/validate");
const regsiterValidation = async (req, res, next) => {
  const validateRule = {
    fullName: "required|string|min:3",
    username: "required|string|min:3",
    email: "required|email",
    password: "required|min:6",
    image: "url",
  };

  await validator(req.body, validateRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const loginValidation = async (req, res, next) => {
  const validateRule = {
    username: "required|min:3",
    password: "required|min:6",
  };

  await validator(req.body, validateRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const tokenValidation = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  next();
};

module.exports = {
  regsiterValidation,
  loginValidation,
  tokenValidation,
};
