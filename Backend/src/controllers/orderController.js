// Order Controller
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Create new order from cart
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentInfo, rentalInfo } = req.body;

    // Validate required fields
    if (!shippingAddress || !paymentInfo || !rentalInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Calculate pricing
    let subtotalRent = 0;
    let totalDeposit = 0;

    const orderItems = cart.items.map((item) => {
      subtotalRent += item.rentWithDiscount || 0;
      totalDeposit += item.securityDeposit * item.quantity;
      return {
        product: item.product._id,
        productName: item.productName,
        monthlyRent: item.monthlyRent,
        securityDeposit: item.securityDeposit,
        quantity: item.quantity,
        rentalStartDate: item.rentalStartDate,
        rentalEndDate: item.rentalEndDate,
        rentalDuration: item.rentalDuration,
        rentWithDiscount: item.rentWithDiscount,
      };
    });

    const deliveryCharges = 0; // Can be calculated based on location
    const discountAmount = 0; // Can be from coupons
    const totalAmount =
      subtotalRent + totalDeposit + deliveryCharges - discountAmount;

    // Create order
    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      shippingAddress,
      paymentInfo,
      rentalInfo,
      pricing: {
        subtotalRent,
        totalDeposit,
        discountAmount,
        deliveryCharges,
        totalAmount,
      },
    });

    // TODO: Process payment here

    // Clear user's cart after order creation
    await Cart.findOneAndUpdate(
      { user: req.user.userId },
      {
        items: [],
        totalItems: 0,
        totalRent: 0,
        totalDeposit: 0,
        totalAmount: 0,
      },
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders for user
// @route   GET /api/v1/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let filter = { user: req.user.userId };
    if (status) filter.orderStatus = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("user");

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check if user owns this order (unless admin)
    if (
      order.user._id.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check authorization
    if (
      order.user.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to cancel this order",
        });
    }

    // Can only cancel if not yet shipped
    if (
      ["Shipped", "Delivered", "InUse", "Returned"].includes(order.orderStatus)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot cancel order in current status",
        });
    }

    order.orderStatus = "Cancelled";
    order.cancellationReason = cancellationReason;
    order.cancelledAt = new Date();

    // Initiate refund
    order.paymentStatus = "Refunded";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = [
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "InUse",
      "ReturnRequested",
      "Returned",
      "Cancelled",
    ];
    if (!validStatuses.includes(orderStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    let order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true },
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payment status (Admin/Payment gateway)
// @route   PUT /api/v1/orders/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;

    const validStatuses = ["Pending", "Paid", "PartiallyPaid", "Refunded"];
    if (!validStatuses.includes(paymentStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment status" });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    if (transactionId) {
      order.paymentInfo.transactionId = transactionId;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/v1/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, sortBy = "-createdAt" } = req.query;

    let filter = {};
    if (status) filter.orderStatus = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .populate("user");

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
