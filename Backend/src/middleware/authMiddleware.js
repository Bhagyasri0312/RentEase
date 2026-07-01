// Authentication Middleware
const { verifyToken } = require("../config/jwt");

// Middleware to verify JWT token and extract user info
exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res
      .status(401)
      .json({
        success: false,
        message: "Authentication failed",
        error: error.message,
      });
  }
};

// Middleware to check if user is admin
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "Forbidden: You do not have permission to access this resource",
        });
    }

    next();
  };
};

// Middleware to check if user is admin only
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  next();
};

// Middleware to check if user is authenticated
exports.requireAuth = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({
        success: false,
        message: "You must be logged in to access this resource",
      });
  }
  next();
};
