// Product Routes
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {
  authenticateToken,
  authorize,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateMongoId,
  validatePagination,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

// Public routes
router.get(
  "/",
  validatePagination,
  handleValidationErrors,
  productController.getAllProducts,
);
router.get("/featured", productController.getFeaturedProducts);
router.get("/search", productController.searchProducts);
router.get(
  "/category/:category",
  validatePagination,
  handleValidationErrors,
  productController.getProductsByCategory,
);
router.get(
  "/:id",
  validateMongoId,
  handleValidationErrors,
  productController.getProduct,
);

// Private routes
router.put(
  "/:id/rating",
  authenticateToken,
  productController.updateProductRating,
);

// Admin routes
router.post(
  "/",
  authenticateToken,
  adminOnly,
  validateCreateProduct,
  handleValidationErrors,
  productController.createProduct,
);
router.put(
  "/:id",
  authenticateToken,
  adminOnly,
  validateUpdateProduct,
  handleValidationErrors,
  productController.updateProduct,
);
router.delete(
  "/:id",
  authenticateToken,
  adminOnly,
  validateMongoId,
  handleValidationErrors,
  productController.deleteProduct,
);

module.exports = router;
