// Utility Functions

// Format response data
exports.formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    ...(data && { data }),
  };
};

// Calculate pagination
exports.calculatePagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

// Generate order/rental/ticket numbers
exports.generateUniqueNumber = (prefix) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${date}-${String(random).padStart(5, "0")}`;
};

// Calculate rental cost with discounts
exports.calculateRentalCost = (monthlyRent, days, discountPercent = 0) => {
  const baseAmount = (monthlyRent / 30) * days;
  const discount = (baseAmount * discountPercent) / 100;
  return {
    baseAmount,
    discount,
    finalAmount: baseAmount - discount,
  };
};

// Check if date is within rental period
exports.isWithinRentalPeriod = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate;
};

// Calculate overdue charges
exports.calculateOverdueCharges = (
  monthlyRent,
  daysOverdue,
  lateFeePercent = 10,
) => {
  const dailyRate = monthlyRent / 30;
  const baseCharge = dailyRate * daysOverdue;
  const lateFee = (baseCharge * lateFeePercent) / 100;
  return {
    baseCharge,
    lateFee,
    totalCharge: baseCharge + lateFee,
  };
};

// Get date difference in days
exports.getDaysDifference = (startDate, endDate) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((endDate - startDate) / millisecondsPerDay);
};

// Mask sensitive data for logging
exports.maskSensitiveData = (obj) => {
  const masked = { ...obj };
  if (masked.password) masked.password = "***";
  if (masked.email) masked.email = masked.email.replace(/(?<=.).(?=.*@)/, "*");
  if (masked.phone) masked.phone = masked.phone.replace(/.(?=.{4})/g, "*");
  return masked;
};

// Validate email format
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone format (Indian)
exports.isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

// Validate pincode format (Indian)
exports.isValidPincode = (pincode) => {
  return /^[0-9]{6}$/.test(pincode);
};

// Check if user is admin
exports.isAdmin = (user) => {
  return user && user.role === "admin";
};

// Check if password is strong
exports.isStrongPassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

// Convert object keys to camelCase
exports.toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(exports.toCamelCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = exports.toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Convert object keys to snake_case
exports.toSnakeCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(exports.toSnakeCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/([A-Z])/g, (g) => `_${g[0].toLowerCase()}`);
      result[snakeKey] = exports.toSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Get time remaining in rental
exports.getTimeRemaining = (endDate) => {
  const now = new Date();
  const remaining = endDate - now;
  if (remaining <= 0) return { days: 0, hours: 0, minutes: 0, isOverdue: true };

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isOverdue: false };
};

// Generate filter query from request params
exports.buildFilterQuery = (params) => {
  const filter = {};

  if (params.category) filter.category = params.category;
  if (params.status) filter.status = params.status;
  if (params.priority) filter.priority = params.priority;
  if (params.featured) filter.featured = params.featured === "true";

  if (params.minPrice || params.maxPrice) {
    filter.monthlyRent = {};
    if (params.minPrice) filter.monthlyRent.$gte = parseFloat(params.minPrice);
    if (params.maxPrice) filter.monthlyRent.$lte = parseFloat(params.maxPrice);
  }

  if (params.search) {
    filter.$text = { $search: params.search };
  }

  return filter;
};

// Build sort query from request params
exports.buildSortQuery = (sortParam) => {
  const sortMap = {
    "price-low": { monthlyRent: 1 },
    "price-high": { monthlyRent: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { rating: -1 },
    default: { createdAt: -1 },
  };

  return sortMap[sortParam] || sortMap.default;
};

// Validate object ID format
exports.isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Round number to 2 decimals
exports.round2Decimals = (value) => {
  return Math.round(value * 100) / 100;
};

// Get discount amount
exports.getDiscountAmount = (originalPrice, discount) => {
  if (discount <= 0) return 0;
  if (discount > 100) return originalPrice;
  return exports.round2Decimals((originalPrice * discount) / 100);
};

// Get final price after discount
exports.getPriceAfterDiscount = (originalPrice, discount) => {
  return exports.round2Decimals(
    originalPrice - exports.getDiscountAmount(originalPrice, discount),
  );
};
