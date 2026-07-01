// Order Routes
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  authenticateToken,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  validateCreateOrder,
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
  orderController.getUserOrders,
);
router.post(
  "/",
  validateCreateOrder,
  handleValidationErrors,
  orderController.createOrder,
);
router.get(
  "/:id",
  validateMongoId,
  handleValidationErrors,
  orderController.getOrder,
);
router.put(
  "/:id/cancel",
  validateMongoId,
  handleValidationErrors,
  orderController.cancelOrder,
);

// Admin routes
router.get(
  "/admin/all",
  adminOnly,
  validatePagination,
  handleValidationErrors,
  orderController.getAllOrders,
);
router.put(
  "/:id/status",
  adminOnly,
  validateMongoId,
  handleValidationErrors,
  orderController.updateOrderStatus,
);
router.put(
  "/:id/payment",
  adminOnly,
  validateMongoId,
  handleValidationErrors,
  orderController.updatePaymentStatus,
);

module.exports = router;
