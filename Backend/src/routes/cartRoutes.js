// Cart Routes
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  validateAddToCart,
  validateUpdateCartItem,
  validateMongoId,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

// All cart routes require authentication
router.use(authenticateToken);

router.get("/", cartController.getCart);
router.post(
  "/add",
  validateAddToCart,
  handleValidationErrors,
  cartController.addToCart,
);
router.put(
  "/:itemId",
  validateMongoId,
  validateUpdateCartItem,
  handleValidationErrors,
  cartController.updateCartItem,
);
router.delete(
  "/:itemId",
  validateMongoId,
  handleValidationErrors,
  cartController.removeFromCart,
);
router.delete("/", cartController.clearCart);
router.post("/coupon", cartController.applyCoupon);

module.exports = router;
