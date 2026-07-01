// User Model
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
      unique: true,
      lowercase: true,
      index: true,
      sparse: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
        "Please provide a valid phone number",
      ],
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      street: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      pincode: {
        type: String,
        match: [/^[0-9]{5,10}$/, "Please provide a valid pincode"],
        default: null,
      },
      country: {
        type: String,
        default: "India",
      },
      latitude: Number,
      longitude: Number,
      isDefault: {
        type: Boolean,
        default: true,
      },
    },
    alternateAddresses: [
      {
        street: String,
        city: String,
        state: String,
        pincode: {
          type: String,
          match: [/^[0-9]{5,10}$/, "Please provide a valid pincode"],
        },
        country: String,
        label: { type: String, enum: ["Home", "Office", "Other"] },
        isDefault: Boolean,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    profileImage: {
      url: String,
      public_id: String,
      uploadedAt: Date,
    },
    preferences: {
      newsletter: { type: Boolean, default: true },
      notificationEmail: { type: Boolean, default: true },
      notificationSMS: { type: Boolean, default: false },
      language: { type: String, default: "en" },
    },
    kycDocuments: [
      {
        documentType: {
          type: String,
          enum: ["Aadhar", "PAN", "DrivingLicense", "Passport"],
        },
        documentNumber: String,
        documentURL: String,
        verificationStatus: {
          type: String,
          enum: ["Pending", "Verified", "Rejected"],
          default: "Pending",
        },
        uploadedAt: Date,
        verifiedAt: Date,
      },
    ],
    accountStatus: {
      type: String,
      enum: ["Active", "Suspended", "Deactivated", "Blocked"],
      default: "Active",
      index: true,
    },
    suspensionReason: String,
    suspendedAt: Date,
    resumedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    totalRentals: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1;

  // Lock account after 5 failed attempts for 30 minutes
  if (this.loginAttempts >= 5 && !this.lockUntil) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
  }

  return this.save();
};

// Method to reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  this.lastLoginAt = new Date();

  return this.save();
};

// Check if account is locked
userSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > new Date();
};

// Method to add address
userSchema.methods.addAddress = function (address) {
  if (this.alternateAddresses.length >= 5) {
    throw new Error("Cannot add more than 5 addresses");
  }

  this.alternateAddresses.push(address);
  return this;
};

// Method to update default address
userSchema.methods.setDefaultAddress = function (addressIndex) {
  if (addressIndex === 0) {
    this.address.isDefault = true;
  } else if (addressIndex - 1 < this.alternateAddresses.length) {
    this.address.isDefault = false;
    this.alternateAddresses.forEach((addr, idx) => {
      addr.isDefault = idx === addressIndex - 1;
    });
  }

  return this;
};

// Calculate rental history statistics
userSchema.statics.getRentalStats = function (userId) {
  return this.findById(userId).select(
    "totalRentals totalSpent loyaltyPoints accountStatus",
  );
};

module.exports = mongoose.model("User", userSchema);
