// Rental Controller
const Rental = require("../models/Rental");
const Order = require("../models/Order");

// @desc    Get all rentals for user
// @route   GET /api/v1/rentals
// @access  Private
exports.getUserRentals = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let filter = { user: req.user.userId };
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Rental.countDocuments(filter);
    const rentals = await Rental.find(filter)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("products.product")
      .populate("order");

    res.status(200).json({
      success: true,
      count: rentals.length,
      total,
      pages: Math.ceil(total / limitNum),
      rentals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single rental
// @route   GET /api/v1/rentals/:id
// @access  Private
exports.getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("user")
      .populate("products.product")
      .populate("order");

    if (!rental) {
      return res
        .status(404)
        .json({ success: false, message: "Rental not found" });
    }

    // Check authorization
    if (
      rental.user._id.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to view this rental",
        });
    }

    res.status(200).json({
      success: true,
      rental,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start rental from order
// @route   POST /api/v1/rentals/start/:orderId
// @access  Private
exports.startRental = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryDetails } = req.body;

    // Get order
    const order = await Order.findById(orderId).populate("items.product");
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
        .json({ success: false, message: "Not authorized" });
    }

    // Extract product information from order
    const products = order.items.map((item) => ({
      product: item.product,
      productName: item.productName,
      quantity: item.quantity,
    }));

    // Create rental
    const rental = await Rental.create({
      order: orderId,
      user: req.user.userId,
      products,
      startDate: order.rentalInfo.deliveryDate || new Date(),
      endDate: order.rentalInfo.expectedReturn,
      expectedReturnDate: order.rentalInfo.expectedReturn,
      rentalDuration: order.items[0].rentalDuration,
      status: "Active",
      deliveryDetails: deliveryDetails || order.rentalInfo,
      condition: {
        initialCondition: "Good",
      },
      payment: {
        rentRemaining: order.pricing.subtotalRent,
        depositStatus: "Held",
      },
    });

    // Update order status
    await Order.findByIdAndUpdate(orderId, { orderStatus: "InUse" });

    res.status(201).json({
      success: true,
      message: "Rental started successfully",
      rental,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request rental return
// @route   PUT /api/v1/rentals/:id/request-return
// @access  Private
exports.requestReturn = async (req, res) => {
  try {
    const { returnCondition, damageNotes } = req.body;

    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res
        .status(404)
        .json({ success: false, message: "Rental not found" });
    }

    // Check authorization
    if (
      rental.user.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Update rental
    rental.status = "ReturnRequested";
    rental.condition.returnCondition = returnCondition;
    if (damageNotes) rental.condition.damageNotes = damageNotes;

    await rental.save();

    res.status(200).json({
      success: true,
      message: "Return requested successfully",
      rental,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete rental return
// @route   PUT /api/v1/rentals/:id/complete-return
// @access  Private/Admin
exports.completeReturn = async (req, res) => {
  try {
    const { actualReturnDate, depositReturnedAmount, penaltyCharges } =
      req.body;

    let rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res
        .status(404)
        .json({ success: false, message: "Rental not found" });
    }

    // Update rental
    rental.status = "Completed";
    rental.actualReturnDate = actualReturnDate || new Date();
    rental.payment.depositReturnedAmount = depositReturnedAmount || 0;
    rental.payment.penaltyCharges = penaltyCharges || 0;
    rental.payment.depositStatus =
      depositReturnedAmount > 0 ? "Returned" : "PartiallyReturned";

    await rental.save();

    // Update order status
    await Order.findByIdAndUpdate(rental.order, { orderStatus: "Returned" });

    res.status(200).json({
      success: true,
      message: "Return completed successfully",
      rental,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Extend rental
// @route   PUT /api/v1/rentals/:id/extend
// @access  Private
exports.extendRental = async (req, res) => {
  try {
    const { days, cost } = req.body;

    if (!days || !cost) {
      return res
        .status(400)
        .json({ success: false, message: "Days and cost are required" });
    }

    let rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res
        .status(404)
        .json({ success: false, message: "Rental not found" });
    }

    // Check authorization
    if (
      rental.user.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Extend rental
    rental.extendRental(days, cost);
    rental.payment.rentRemaining += cost;

    await rental.save();

    res.status(200).json({
      success: true,
      message: "Rental extended successfully",
      rental,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit rental review and rating
// @route   PUT /api/v1/rentals/:id/review
// @access  Private
exports.submitReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      {
        "ratings.rating": rating,
        "ratings.review": review,
        "ratings.ratedAt": new Date(),
      },
      { new: true },
    );

    if (!rental) {
      return res
        .status(404)
        .json({ success: false, message: "Rental not found" });
    }

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      rental,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active rentals (Admin only)
// @route   GET /api/v1/admin/rentals
// @access  Private/Admin
exports.getAllRentals = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Rental.countDocuments(filter);
    const rentals = await Rental.find(filter)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("user")
      .populate("products.product");

    res.status(200).json({
      success: true,
      count: rentals.length,
      total,
      pages: Math.ceil(total / limitNum),
      rentals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check for overdue rentals
// @route   GET /api/v1/rentals/overdue
// @access  Private
exports.getOverdueRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({
      user: req.user.userId,
      status: "Active",
      endDate: { $lt: new Date() },
    }).populate("products.product");

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
