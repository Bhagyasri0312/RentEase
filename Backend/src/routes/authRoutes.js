// Authentication Routes
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

// Public routes
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  authController.register,
);
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  authController.login,
);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-email", authController.verifyEmail);

// Private routes
router.get("/me", authenticateToken, authController.getMe);
router.post("/logout", authenticateToken, authController.logout);
router.put("/profile", authenticateToken, authController.updateProfile);
router.put(
  "/change-password",
  authenticateToken,
  validateChangePassword,
  handleValidationErrors,
  authController.changePassword,
);

module.exports = router;
