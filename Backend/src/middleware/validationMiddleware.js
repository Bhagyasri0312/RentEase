// Validation Middleware
const { body, param, query, validationResult } = require("express-validator");

// Auth validation
exports.validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone must be a valid 10-digit number"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

exports.validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("New passwords do not match");
    }
    return true;
  }),
];

// Product validation
exports.validateCreateProduct = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),
  body("description")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("category")
    .isIn(["Furniture", "Appliances", "Electronics", "Decor"])
    .withMessage("Invalid category"),
  body("monthlyRent")
    .isFloat({ min: 0 })
    .withMessage("Monthly rent must be a positive number"),
  body("securityDeposit")
    .isFloat({ min: 0 })
    .withMessage("Security deposit must be a positive number"),
];

exports.validateUpdateProduct = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("category")
    .optional()
    .isIn(["Furniture", "Appliances", "Electronics", "Decor"])
    .withMessage("Invalid category"),
  body("monthlyRent")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Monthly rent must be a positive number"),
  body("securityDeposit")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Security deposit must be a positive number"),
];

// Cart validation
exports.validateAddToCart = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("rentalStartDate").isISO8601().withMessage("Invalid start date"),
  body("rentalEndDate").isISO8601().withMessage("Invalid end date"),
  body("rentalDuration")
    .isIn(["1-month", "3-months", "6-months", "12-months"])
    .withMessage("Invalid rental duration"),
];

exports.validateUpdateCartItem = [
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("rentalStartDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date"),
  body("rentalEndDate").optional().isISO8601().withMessage("Invalid end date"),
  body("rentalDuration")
    .optional()
    .isIn(["1-month", "3-months", "6-months", "12-months"])
    .withMessage("Invalid rental duration"),
];

// Order validation
exports.validateCreateOrder = [
  body("shippingAddress")
    .isObject()
    .withMessage("Shipping address is required"),
  body("shippingAddress.street").notEmpty().withMessage("Street is required"),
  body("shippingAddress.city").notEmpty().withMessage("City is required"),
  body("shippingAddress.state").notEmpty().withMessage("State is required"),
  body("shippingAddress.pincode").notEmpty().withMessage("Pincode is required"),
  body("paymentInfo").isObject().withMessage("Payment info is required"),
  body("paymentInfo.method")
    .isIn(["Credit Card", "Debit Card", "Net Banking", "UPI", "Wallet"])
    .withMessage("Invalid payment method"),
];

// Maintenance validation
exports.validateCreateMaintenance = [
  body("rentalId").isMongoId().withMessage("Invalid rental ID"),
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("title")
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage("Title must be between 10 and 100 characters"),
  body("description")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),
  body("category")
    .isIn([
      "Damage",
      "Malfunction",
      "Missing Parts",
      "Cleaning Required",
      "Parts Replacement",
      "General Maintenance",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High", "Urgent"])
    .withMessage("Invalid priority"),
];

// ID validation
exports.validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

// Pagination validation
exports.validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

// Error handling middleware for validation
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};
