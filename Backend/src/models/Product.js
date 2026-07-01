// Product Model
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please provide a category"],
      index: true,
    },
    subcategory: {
      type: String,
      default: null,
    },
    monthlyRent: {
      type: Number,
      required: [true, "Please provide monthly rent price"],
      min: [0, "Price cannot be negative"],
    },
    securityDeposit: {
      type: Number,
      required: [true, "Please provide security deposit amount"],
      min: [0, "Deposit cannot be negative"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: String,
        alt: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    specifications: [
      {
        key: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    dimensions: {
      length: { type: Number, default: null }, // in cm
      width: { type: Number, default: null },
      height: { type: Number, default: null },
      weight: { type: Number, default: null }, // in kg
    },
    color: {
      type: String,
      default: null,
    },
    material: {
      type: String,
      default: null,
    },
    // Inventory Management
    inventory: {
      totalQuantity: {
        type: Number,
        required: [true, "Please provide total quantity"],
        min: [1, "Minimum quantity must be 1"],
        default: 1,
      },
      availableQuantity: {
        type: Number,
        required: true,
        min: [0, "Available quantity cannot be negative"],
        default: 1,
      },
      rentedQuantity: {
        type: Number,
        default: 0,
        min: 0,
      },
      maintenanceQuantity: {
        type: Number,
        default: 0,
        min: 0,
      },
      reservedQuantity: {
        type: Number,
        default: 0,
        min: 0,
      },
      lastRestockedAt: Date,
      lowStockThreshold: {
        type: Number,
        default: 2,
      },
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    rentalDuration: [
      {
        period: {
          type: String,
          enum: ["1-month", "3-months", "6-months", "12-months"],
          required: true,
        },
        discount: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
      },
    ],
    cancellationPolicy: {
      cancellationWindow: {
        type: Number,
        default: 2,
        description: "Days before rental start for free cancellation",
      },
      cancellationCharge: {
        type: Number,
        default: 10,
        description: "Percentage of rent charged if cancelled within window",
      },
    },
    damagePolicy: {
      normalWear: String,
      excessiveDamageDeduction: {
        type: Number,
        default: 50,
        description: "Percentage of deposit deducted for excessive damage",
      },
    },
    rating: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      reviewCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    badge: {
      type: String,
      enum: ["New", "Popular", "Sale", "Limited", null],
      default: null,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
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

// Text search index
productSchema.index({ name: "text", description: "text", subcategory: "text" });

// Pre-save hook to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Update inStock based on available quantity
  this.inStock = this.inventory.availableQuantity > 0;

  next();
});

// Methods for inventory management
productSchema.methods.getAvailability = function () {
  return {
    isAvailable: this.inventory.availableQuantity > 0,
    availableQuantity: this.inventory.availableQuantity,
    totalQuantity: this.inventory.totalQuantity,
    rentedQuantity: this.inventory.rentedQuantity,
    maintenanceQuantity: this.inventory.maintenanceQuantity,
    reservedQuantity: this.inventory.reservedQuantity,
    isLowStock:
      this.inventory.availableQuantity <= this.inventory.lowStockThreshold,
  };
};

// Reserve quantity for a rental
productSchema.methods.reserveQuantity = function (quantity) {
  if (this.inventory.availableQuantity < quantity) {
    throw new Error(
      `Insufficient quantity. Available: ${this.inventory.availableQuantity}, Required: ${quantity}`,
    );
  }

  this.inventory.availableQuantity -= quantity;
  this.inventory.reservedQuantity += quantity;
  this.inStock = this.inventory.availableQuantity > 0;

  return this;
};

// Confirm rental (move from reserved to rented)
productSchema.methods.confirmRental = function (quantity) {
  if (this.inventory.reservedQuantity < quantity) {
    throw new Error(`Insufficient reserved quantity`);
  }

  this.inventory.reservedQuantity -= quantity;
  this.inventory.rentedQuantity += quantity;

  return this;
};

// Release quantity after rental completion
productSchema.methods.releaseQuantity = function (quantity) {
  if (this.inventory.rentedQuantity < quantity) {
    throw new Error(`Cannot release more than rented quantity`);
  }

  this.inventory.rentedQuantity -= quantity;
  this.inventory.availableQuantity += quantity;
  this.inStock = this.inventory.availableQuantity > 0;

  return this;
};

// Move to maintenance
productSchema.methods.moveToMaintenance = function (quantity) {
  if (this.inventory.availableQuantity < quantity) {
    throw new Error(`Insufficient available quantity for maintenance`);
  }

  this.inventory.availableQuantity -= quantity;
  this.inventory.maintenanceQuantity += quantity;
  this.inStock = this.inventory.availableQuantity > 0;

  return this;
};

// Return from maintenance
productSchema.methods.returnFromMaintenance = function (quantity) {
  if (this.inventory.maintenanceQuantity < quantity) {
    throw new Error(`Insufficient quantity in maintenance`);
  }

  this.inventory.maintenanceQuantity -= quantity;
  this.inventory.availableQuantity += quantity;
  this.inStock = this.inventory.availableQuantity > 0;

  return this;
};

// Get rental price with discount
productSchema.methods.getRentalPrice = function (duration) {
  const rentalOption = this.rentalDuration.find(
    (option) => option.period === duration,
  );

  if (!rentalOption) {
    return this.monthlyRent;
  }

  const discount = rentalOption.discount;
  return this.monthlyRent * (1 - discount / 100);
};

// Check availability for specific date range
productSchema.statics.checkAvailability = function (
  productId,
  startDate,
  endDate,
  quantity,
) {
  return this.findById(productId).then((product) => {
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.inventory.availableQuantity < quantity) {
      return {
        available: false,
        message: `Only ${product.inventory.availableQuantity} units available`,
        availableQuantity: product.inventory.availableQuantity,
      };
    }

    return {
      available: true,
      message: "Product available for rental",
      availableQuantity: product.inventory.availableQuantity,
    };
  });
};

module.exports = mongoose.model("Product", productSchema);
