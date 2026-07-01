// Cart Controller
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product",
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      rentalStartDate,
      rentalEndDate,
      rentalDuration,
    } = req.body;

    // Validate inputs
    if (
      !productId ||
      !quantity ||
      !rentalStartDate ||
      !rentalEndDate ||
      !rentalDuration
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (!product.inStock || product.availableQuantity < quantity) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Product is not available in requested quantity",
        });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      // Update quantity if product already in cart
      existingItem.quantity += quantity;
    } else {
      // Find rental duration discount
      const durationObj = product.rentalDuration.find(
        (d) => d.period === rentalDuration,
      );
      const discount = durationObj ? durationObj.discount : 0;
      const rentWithDiscount = product.monthlyRent * (1 - discount / 100);

      // Add new item to cart
      cart.items.push({
        product: productId,
        productName: product.name,
        monthlyRent: product.monthlyRent,
        securityDeposit: product.securityDeposit,
        quantity,
        rentalStartDate,
        rentalEndDate,
        rentalDuration,
        rentWithDiscount,
        totalPrice: rentWithDiscount * quantity,
      });
    }

    // Calculate totals
    cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Remove item
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    // Calculate totals
    cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, rentalStartDate, rentalEndDate, rentalDuration } =
      req.body;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find((i) => i._id.toString() === itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    // Verify product availability
    const product = await Product.findById(item.product);
    if (quantity > product.availableQuantity) {
      return res
        .status(400)
        .json({ success: false, message: "Requested quantity not available" });
    }

    // Update item
    if (quantity) item.quantity = quantity;
    if (rentalStartDate) item.rentalStartDate = rentalStartDate;
    if (rentalEndDate) item.rentalEndDate = rentalEndDate;
    if (rentalDuration) {
      const durationObj = product.rentalDuration.find(
        (d) => d.period === rentalDuration,
      );
      const discount = durationObj ? durationObj.discount : 0;
      item.rentWithDiscount = product.monthlyRent * (1 - discount / 100);
      item.rentalDuration = rentalDuration;
    }

    item.totalPrice = item.rentWithDiscount * item.quantity;

    // Calculate totals
    cart.calculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/v1/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.userId },
      {
        items: [],
        totalItems: 0,
        totalRent: 0,
        totalDeposit: 0,
        totalAmount: 0,
      },
      { new: true },
    );

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply coupon code
// @route   POST /api/v1/cart/coupon
// @access  Private
exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    // TODO: Implement coupon logic with Coupon model
    // This is a placeholder for coupon functionality

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
