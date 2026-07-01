// Rental Model
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        quantity: Number,
      },
    ],
    rentalNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      index: true,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    expectedReturnDate: Date,
    actualReturnDate: Date,
    rentalDuration: String,
    status: {
      type: String,
      enum: ["Active", "Paused", "Completed", "Cancelled", "Overdue"],
      default: "Active",
      index: true,
    },
    deliveryDetails: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      latitude: Number,
      longitude: Number,
      deliveryDate: Date,
      deliveryPersonName: String,
      deliveryPersonPhone: String,
      proofOfDelivery: String,
    },
    condition: {
      initialCondition: String,
      currentCondition: String,
      returnCondition: String,
      damageNotes: String,
      damageImages: [String],
    },
    payment: {
      rentAlready: {
        type: Number,
        default: 0,
        min: 0,
      },
      rentRemaining: {
        type: Number,
        min: 0,
      },
      depositStatus: {
        type: String,
        enum: ["Held", "PartiallyReturned", "Returned", "Forfeited"],
        default: "Held",
      },
      depositReturnedAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      depositForfeited: {
        type: Number,
        default: 0,
        min: 0,
      },
      penaltyCharges: {
        type: Number,
        default: 0,
        min: 0,
      },
      lateFeePerDay: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalLateFeesAccrued: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    extension: {
      isExtended: {
        type: Boolean,
        default: false,
      },
      originalEndDate: Date,
      newEndDate: Date,
      extensionDays: Number,
      extensionCost: Number,
    },
    ratings: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: String,
      ratedAt: Date,
    },
    notes: String,
    timeline: [
      {
        action: String,
        description: String,
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
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

// Pre-save hook to generate rental number
rentalSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    this.rentalNumber = `RENT-${date}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

// Method to check if rental is overdue
rentalSchema.methods.isOverdue = function () {
  return this.status === "Active" && new Date() > this.endDate;
};

// Method to extend rental
rentalSchema.methods.extendRental = function (days, cost) {
  this.extension.isExtended = true;
  this.extension.originalEndDate = this.endDate;
  this.extension.newEndDate = new Date(
    this.endDate.getTime() + days * 24 * 60 * 60 * 1000,
  );
  this.extension.extensionDays = days;
  this.extension.extensionCost = cost;
  this.endDate = this.extension.newEndDate;

  this.addTimeline(
    "Extended",
    "Active",
    `Rental extended by ${days} days for $${cost}`,
  );

  return this;
};

// Method to add timeline entry
rentalSchema.methods.addTimeline = function (action, description, performedBy) {
  this.timeline.push({
    action,
    description,
    performedBy,
    timestamp: new Date(),
  });
  return this;
};

// Calculate late fees
rentalSchema.methods.calculateLateFees = function () {
  if (this.status !== "Overdue") {
    return 0;
  }

  const now = new Date();
  const daysOverdue = Math.ceil((now - this.endDate) / (1000 * 60 * 60 * 24));
  const lateFee = daysOverdue * (this.payment.lateFeePerDay || 0);

  this.payment.totalLateFeesAccrued = lateFee;

  return lateFee;
};

// Method to mark as completed
rentalSchema.methods.markAsCompleted = function (
  returnCondition,
  depositDeduction,
) {
  this.status = "Completed";
  this.actualReturnDate = new Date();
  this.condition.returnCondition = returnCondition;

  if (depositDeduction > 0) {
    this.payment.depositForfeited = depositDeduction;
    this.payment.depositReturnedAmount =
      (this.order.pricing?.totalDeposit || 0) - depositDeduction;
    this.payment.depositStatus = "PartiallyReturned";
  } else {
    this.payment.depositReturnedAmount = this.order.pricing?.totalDeposit || 0;
    this.payment.depositStatus = "Returned";
  }

  return this;
};

// Static method to get overdue rentals
rentalSchema.statics.getOverdueRentals = function () {
  return this.find({
    status: "Active",
    endDate: { $lt: new Date() },
  })
    .populate("user", "name email phone")
    .populate("products.product", "name monthlyRent");
};

// Static method to get user rentals
rentalSchema.statics.getUserRentals = function (userId) {
  return this.find({ user: userId })
    .populate("order", "orderNumber")
    .populate("products.product", "name category")
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model("Rental", rentalSchema);
