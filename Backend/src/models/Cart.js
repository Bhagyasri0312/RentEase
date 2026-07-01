// Cart Model
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
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
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        rentalStartDate: Date,
        rentalEndDate: Date,
        rentalDuration: String, // '1-month', '3-months', etc.
        rentWithDiscount: Number,
        totalPrice: Number,
      },
    ],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalRent: {
      type: Number,
      default: 0,
    },
    totalDeposit: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
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

// Method to calculate totals
cartSchema.methods.calculateTotals = function () {
  this.totalItems = this.items.length;
  this.totalRent = this.items.reduce(
    (sum, item) => sum + (item.rentWithDiscount || 0),
    0,
  );
  this.totalDeposit = this.items.reduce(
    (sum, item) => sum + (item.securityDeposit || 0),
    0,
  );
  this.totalAmount = this.totalRent + this.totalDeposit;
  return this;
};

module.exports = mongoose.model("Cart", cartSchema);
