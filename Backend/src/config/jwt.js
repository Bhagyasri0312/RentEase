// JWT Configuration
const jwt = require("jsonwebtoken");

const generateToken = (userId, role = "user") => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "your-secret-key-change-in-production",
    { expiresIn: process.env.JWT_EXPIRY || "7d" },
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
    );
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
