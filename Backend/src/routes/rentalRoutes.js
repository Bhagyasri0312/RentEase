// Rental Routes
const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const {
  authenticateToken,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  validateMongoId,
  validatePagination,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

// Private routes (user)
router.use(authenticateToken);
router.get(
  "/",
  validatePagination,
  handleValidationErrors,
  rentalController.getUserRentals,
);
router.get("/overdue", rentalController.getOverdueRentals);
router.post(
  "/start/:orderId",
  validateMongoId,
  handleValidationErrors,
  rentalController.startRental,
);
router.get(
  "/:id",
  validateMongoId,
  handleValidationErrors,
  rentalController.getRental,
);
router.put(
  "/:id/request-return",
  validateMongoId,
  handleValidationErrors,
  rentalController.requestReturn,
);
router.put(
  "/:id/extend",
  validateMongoId,
  handleValidationErrors,
  rentalController.extendRental,
);
router.put(
  "/:id/review",
  validateMongoId,
  handleValidationErrors,
  rentalController.submitReview,
);

// Admin routes
router.get(
  "/admin/all",
  adminOnly,
  validatePagination,
  handleValidationErrors,
  rentalController.getAllRentals,
);
router.put(
  "/:id/complete-return",
  adminOnly,
  validateMongoId,
  handleValidationErrors,
  rentalController.completeReturn,
);

module.exports = router;
