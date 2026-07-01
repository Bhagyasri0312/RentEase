// Navigation
export const NAVIGATION = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: "/product",
  CART: "/cart",
  LOGIN: "/login",
  REGISTER: "/register",
};

// Categories
export const CATEGORIES = [
  {
    id: "furniture",
    name: "Furniture",
    description: "Sofas, beds, tables & more",
  },
  {
    id: "appliances",
    name: "Appliances",
    description: "Kitchen & home appliances",
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Gadgets & tech devices",
  },
  {
    id: "decor",
    name: "Decor",
    description: "Home decoration items",
  },
];

// Rental Plans
export const RENTAL_PLANS = [
  { period: "1-month", duration: "1 Month", label: "1 Month" },
  {
    period: "3-months",
    duration: "3 Months",
    label: "3 Months",
    popular: true,
  },
  { period: "6-months", duration: "6 Months", label: "6 Months" },
  { period: "1-year", duration: "1 Year", label: "1 Year" },
];

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  GET_PRODUCTS: "/api/products",
  GET_PRODUCT_DETAILS: "/api/products/:id",
  SEARCH_PRODUCTS: "/api/products/search",
  GET_FEATURED_PRODUCTS: "/api/products/featured",

  // Cart
  GET_CART: "/api/cart",
  ADD_TO_CART: "/api/cart/add",
  REMOVE_FROM_CART: "/api/cart/remove/:id",
  UPDATE_CART: "/api/cart/update",

  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  LOGOUT: "/api/auth/logout",
  GET_USER: "/api/auth/user",

  // Orders
  CREATE_ORDER: "/api/orders",
  GET_ORDERS: "/api/orders",
  GET_ORDER_DETAILS: "/api/orders/:id",

  // Wishlist
  GET_WISHLIST: "/api/wishlist",
  ADD_TO_WISHLIST: "/api/wishlist/add",
  REMOVE_FROM_WISHLIST: "/api/wishlist/remove/:id",
};

// Colors
export const COLORS = {
  primary: "#0ea5e9",
  secondary: "#4b5563",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  light: "#f3f4f6",
  dark: "#1f2937",
};

// Pagination
export const PAGINATION = {
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
};

// Sort Options
export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

// Messages
export const MESSAGES = {
  SUCCESS: {
    ADD_TO_CART: "Item added to cart successfully",
    REMOVE_FROM_CART: "Item removed from cart",
    LOGIN: "Logged in successfully",
    LOGOUT: "Logged out successfully",
    ORDER_PLACED: "Order placed successfully",
  },
  ERROR: {
    NETWORK_ERROR: "Network error. Please try again.",
    SERVER_ERROR: "Server error. Please try again later.",
    INVALID_EMAIL: "Please enter a valid email address",
    PASSWORD_MISMATCH: "Passwords do not match",
    PRODUCT_NOT_FOUND: "Product not found",
  },
  INFO: {
    LOADING: "Loading...",
    NO_PRODUCTS: "No products found",
    EMPTY_CART: "Your cart is empty",
  },
};
