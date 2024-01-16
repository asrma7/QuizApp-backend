const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "TokenExpired",
    });
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    if (!decoded.isAdmin)
      return res.status(403).json({ message: "Not authorization" });
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentification Failed",
    });
  }
};

module.exports = { verifyToken, verifyAdmin };
