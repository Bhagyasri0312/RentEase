// Order Model
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        monthlyRent: Number,
        securityDeposit: Number,
        quantity: Number,
        rentalStartDate: Date,
        rentalEndDate: Date,
        rentalDuration: String,
        rentWithDiscount: Number,
      },
    ],
    shippingAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
        match: [/^[0-9]{5,10}$/, "Invalid pincode"],
      },
      country: {
        type: String,
        default: "India",
      },
      latitude: Number,
      longitude: Number,
      contactPerson: String,
      contactPhone: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    sameAsShipping: {
      type: Boolean,
      default: true,
    },
    paymentInfo: {
      method: {
        type: String,
        enum: ["Credit Card", "Debit Card", "Net Banking", "UPI", "Wallet"],
        required: true,
      },
      transactionId: {
        type: String,
        unique: true,
        sparse: true,
      },
      transactionDetails: {
        bank: String,
        cardLast4: String,
        timestamp: Date,
      },
      status: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunding", "Refunded"],
        default: "Pending",
      },
      failureReason: String,
    },
    rentalInfo: {
      expectedDelivery: Date,
      deliveryDate: Date,
      deliveredBy: {
        name: String,
        phone: String,
        photo: String,
      },
      deliveryProof: String,
      expectedReturn: Date,
      returnDate: Date,
      returnPickupScheduled: Date,
      deliveryLocation: String,
      notes: String,
    },
    pricing: {
      subtotalRent: {
        type: Number,
        required: true,
        min: 0,
      },
      totalDeposit: {
        type: Number,
        required: true,
        min: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      couponCode: String,
      deliveryCharges: {
        type: Number,
        default: 0,
        min: 0,
      },
      taxAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      amountPaid: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    orderStatus: {
      type: String,
      enum: [
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "InUse",
        "ReturnRequested",
        "Returned",
        "Cancelled",
      ],
      default: "Confirmed",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "PartiallyPaid", "Refunded"],
      default: "Pending",
    },
    cancellationReason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ["User", "Admin", "System"],
    },
    refundInfo: {
      refundAmount: Number,
      refundMethod: String,
      refundTransactionId: String,
      refundedAt: Date,
    },
    notes: String,
    timeline: [
      {
        action: String,
        status: String,
        description: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Pre-save hook to generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    this.orderNumber = `ORD-${date}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  const cancellableStatuses = ["Confirmed", "Processing"];
  return cancellableStatuses.includes(this.orderStatus);
};

// Method to add timeline entry
orderSchema.methods.addTimeline = function (action, status, description) {
  this.timeline.push({
    action,
    status,
    description,
    timestamp: new Date(),
  });
  return this;
};

// Method to calculate remaining amount
orderSchema.methods.getRemainingAmount = function () {
  return this.pricing.totalAmount - this.pricing.amountPaid;
};

// Static method to get user's orders
orderSchema.statics.getUserOrders = function (userId, limit = 10) {
  return this.find({ user: userId })
    .populate("user", "name email phone")
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("-paymentInfo.transactionDetails");
};

// Static method to get pending refunds
orderSchema.statics.getPendingRefunds = function () {
  return this.find({
    "paymentInfo.status": "Refunding",
    "refundInfo.refundedAt": { $exists: false },
  });
};

module.exports = mongoose.model("Order", orderSchema);
