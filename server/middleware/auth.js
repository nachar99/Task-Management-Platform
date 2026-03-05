const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

function authenticateToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "token expired , login again",
      });
    }

    return res.status(401).json({
      error: "invalid token",
    });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "access denied , admin role required",
    });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
