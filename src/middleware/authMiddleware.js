const jwt = require("jsonwebtoken");

const authmiddleWare = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header is missing",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authmiddleWare;
