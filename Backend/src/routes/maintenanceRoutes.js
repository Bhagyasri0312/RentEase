// Maintenance Request Routes
const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");
const {
  authenticateToken,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  validateCreateMaintenance,
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
  maintenanceController.getUserRequests,
);
router.post(
  "/",
  validateCreateMaintenance,
  handleValidationErrors,
  maintenanceController.createRequest,
);
router.get(
  "/:id",
  validateMongoId,
  handleValidationErrors,
  maintenanceController.getRequest,
);
router.put(
  "/:id",
  validateMongoId,
  handleValidationErrors,
  maintenanceController.updateRequest,
);
router.put(
  "/:id/close",
  validateMongoId,
  handleValidationErrors,
  maintenanceController.closeRequest,
);
router.put(
  "/:id/feedback",
  validateMongoId,
  handleValidationErrors,
  maintenanceController.submitFeedback,
);

// Admin routes
router.get(
  "/admin/all",
  adminOnly,
  validatePagination,
  handleValidationErrors,
  maintenanceController.getAllRequests,
);
router.put(
  "/:id/assign",
  adminOnly,
  validateMongoId,
  handleValidationErrors,
  maintenanceController.assignTechnician,
);
router.put(
  "/:id/resolve",
  adminOnly,
  validateMongoId,
  handleValidationErrors,
  maintenanceController.resolveRequest,
);
router.put(
  "/:id/reject",
  adminOnly,
  validateMongoId,
  handleValidationErrors,
  maintenanceController.rejectRequest,
);

module.exports = router;
