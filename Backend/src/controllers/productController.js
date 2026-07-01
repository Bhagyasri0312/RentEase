// Product Controller
const Product = require("../models/Product");
const { validationResult } = require("express-validator");

// @desc    Get all products with filtering and sorting
// @route   GET /api/v1/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      featured,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    let filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = true;
    if (minPrice || maxPrice) {
      filter.monthlyRent = {};
      if (minPrice) filter.monthlyRent.$gte = parseFloat(minPrice);
      if (maxPrice) filter.monthlyRent.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sortObj = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case "price-low":
          sortObj = { monthlyRent: 1 };
          break;
        case "price-high":
          sortObj = { monthlyRent: -1 };
          break;
        case "newest":
          sortObj = { createdAt: -1 };
          break;
        case "popular":
          sortObj = { rating: -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Get products
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product (Admin only)
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      name,
      description,
      category,
      monthlyRent,
      securityDeposit,
      specifications,
      images,
      rentalDuration,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      category,
      monthlyRent,
      securityDeposit,
      specifications: specifications || [],
      images: images || [],
      rentalDuration: rentalDuration || [],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      monthlyRent,
      securityDeposit,
      specifications,
      images,
      rentalDuration,
      inStock,
      totalQuantity,
      availableQuantity,
      featured,
      badge,
    } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (monthlyRent) product.monthlyRent = monthlyRent;
    if (securityDeposit) product.securityDeposit = securityDeposit;
    if (specifications) product.specifications = specifications;
    if (images) product.images = images;
    if (rentalDuration) product.rentalDuration = rentalDuration;
    if (inStock !== undefined) product.inStock = inStock;
    if (totalQuantity) product.totalQuantity = totalQuantity;
    if (availableQuantity) product.availableQuantity = availableQuantity;
    if (featured !== undefined) product.featured = featured;
    if (badge) product.badge = badge;

    product = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product rating
// @route   PUT /api/v1/products/:id/rating
// @access  Private
exports.updateProductRating = async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update rating (simple average)
    const totalRating = product.rating * product.reviewCount + rating;
    product.reviewCount += 1;
    product.rating = totalRating / product.reviewCount;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(6);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get products by category
// @route   GET /api/v1/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 12, page = 1 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments({ category });
    const products = await Product.find({ category })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search products
// @route   GET /api/v1/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { query, limit = 12, page = 1 } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments({ $text: { $search: query } });
    const products = await Product.find({ $text: { $search: query } })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
