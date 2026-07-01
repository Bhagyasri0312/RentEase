# RentEase MongoDB Schemas Documentation

## Overview

This document provides comprehensive documentation of all MongoDB collections in RentEase, including validation rules, references, and business logic.

---

## 1. Users Collection

### Schema Fields

```javascript
{
  _id: ObjectId,                    // MongoDB unique identifier
  name: String,                     // Required, 3-50 chars, trimmed
  email: String,                    // Required, unique, valid email format
  phone: String,                    // Required, unique, valid international format
  password: String,                 // Required, 8+ chars, hashed with bcrypt
  role: String,                     // enum: ['user', 'admin'], default: 'user'

  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,               // Validated 5-10 digits
    country: String,               // Default: 'India'
    latitude: Number,
    longitude: Number,
    isDefault: Boolean             // Default: true
  },

  alternateAddresses: [{           // Maximum 5 addresses
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    label: String,                 // enum: ['Home', 'Office', 'Other']
    isDefault: Boolean
  }],

  // Verification & Status
  isVerified: Boolean,              // Email verification status
  verifiedAt: Date,
  accountStatus: String,            // enum: ['Active', 'Suspended', 'Deactivated', 'Blocked']
  isActive: Boolean,                // Default: true
  suspensionReason: String,
  suspendedAt: Date,
  resumedAt: Date,

  // Profile
  profileImage: {
    url: String,
    public_id: String,              // Cloudinary public ID
    uploadedAt: Date
  },

  // Preferences
  preferences: {
    newsletter: Boolean,            // Default: true
    notificationEmail: Boolean,     // Default: true
    notificationSMS: Boolean,       // Default: false
    language: String                // Default: 'en'
  },

  // KYC Verification
  kycDocuments: [{
    documentType: String,           // enum: ['Aadhar', 'PAN', 'DrivingLicense', 'Passport']
    documentNumber: String,
    documentURL: String,
    verificationStatus: String,     // enum: ['Pending', 'Verified', 'Rejected']
    uploadedAt: Date,
    verifiedAt: Date
  }],

  // Security
  loginAttempts: Number,            // Default: 0
  lockUntil: Date,                  // Account lock time (30 mins after 5 failed attempts)
  lastLoginAt: Date,

  // Statistics
  totalRentals: Number,             // Default: 0
  totalSpent: Number,               // Default: 0
  loyaltyPoints: Number,            // Default: 0

  // Timestamps
  createdAt: Date,                  // Indexed
  updatedAt: Date
}
```

### Validation Rules

- **name**: Min 3, Max 50 characters
- **email**: Must be valid email format, unique
- **phone**: Must match international phone pattern, unique
- **password**: Min 8 characters, hashed before saving
- **pincode**: 5-10 digits
- **alternateAddresses**: Maximum 5 addresses per user

### Indexes

```javascript
-email(unique) - phone(unique) - accountStatus - createdAt - isActive;
```

### Methods

```javascript
incrementLoginAttempts(); // Locks account after 5 attempts
resetLoginAttempts(); // Reset on successful login
isAccountLocked(); // Check if account is locked
addAddress(address); // Add max 5 addresses
setDefaultAddress(index); // Set default address
toJSON(); // Remove password from response
```

---

## 2. Categories Collection

### Schema Fields

```javascript
{
  _id: ObjectId,
  name: String,                    // Required, unique, 3-50 chars
  slug: String,                    // Auto-generated from name, unique, lowercase
  description: String,             // Required, 10-500 chars

  // Image & Icon
  image: {
    url: String,
    public_id: String
  },
  icon: String,                    // Font icon class name

  // Hierarchy
  parentCategory: ObjectId,        // Ref to Category (for subcategories)
  subCategories: [ObjectId],       // Refs to Category (array of subcategories)

  // Status & Display
  isActive: Boolean,               // Default: true, Indexed
  displayOrder: Number,            // For sorting categories

  // Statistics
  productCount: Number,            // Number of products in category

  // SEO
  metadata: {
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String]
  },

  // Audit
  createdBy: ObjectId,             // Ref to User (admin who created)
  createdAt: Date,                 // Indexed
  updatedAt: Date
}
```

### Validation Rules

- **name**: Min 3, Max 50 characters, unique
- **slug**: Auto-generated from name, unique
- **description**: Min 10, Max 500 characters
- **parentCategory**: Must be valid Category ObjectId or null

### Indexes

```javascript
-name(unique) - slug(unique) - isActive - createdAt;
```

### Methods

```javascript
// Pre-save hook generates slug from name
```

---

## 3. Products Collection

### Schema Fields

```javascript
{
  _id: ObjectId,
  name: String,                    // Required, unique, 3-100 chars, indexed
  slug: String,                    // Auto-generated, unique, indexed
  description: String,             // Required, 10-2000 chars

  // Category
  category: ObjectId,              // Required, Ref to Category, Indexed
  subcategory: String,

  // Pricing
  monthlyRent: Number,             // Required, min 0
  securityDeposit: Number,         // Required, min 0

  // Media
  images: [{
    url: String,                   // Required
    public_id: String,
    alt: String,
    uploadedAt: Date
  }],

  // Specifications
  specifications: [{
    key: String,                   // Required
    value: String                  // Required
  }],

  dimensions: {
    length: Number,                // in cm
    width: Number,
    height: Number,
    weight: Number                 // in kg
  },

  color: String,
  material: String,

  // *** INVENTORY MANAGEMENT ***
  inventory: {
    totalQuantity: Number,         // Required, min 1, default 1
    availableQuantity: Number,     // Required, min 0, default 1
    rentedQuantity: Number,        // Default 0, min 0
    maintenanceQuantity: Number,   // Default 0, min 0
    reservedQuantity: Number,      // Default 0, min 0 (reserved for pending orders)
    lastRestockedAt: Date,
    lowStockThreshold: Number      // Default 2 (alerts when below this)
  },

  inStock: Boolean,                // Auto-calculated from availableQuantity

  // Rental Options
  rentalDuration: [{
    period: String,                // enum: ['1-month', '3-months', '6-months', '12-months']
    discount: Number               // 0-100 (percentage discount)
  }],

  // Policies
  cancellationPolicy: {
    cancellationWindow: Number,    // Days before rental for free cancellation, default 2
    cancellationCharge: Number     // % of rent, default 10
  },

  damagePolicy: {
    normalWear: String,
    excessiveDamageDeduction: Number // % of deposit, default 50
  },

  // Ratings & Reviews
  rating: {
    averageRating: Number,         // 0-5, default 0
    reviewCount: Number,           // default 0
    reviews: [ObjectId]            // Refs to Review documents
  },

  // Featured & Badge
  featured: Boolean,               // Default false, indexed
  badge: String,                   // enum: ['New', 'Popular', 'Sale', 'Limited', null]

  // Vendor
  vendor: ObjectId,                // Ref to Vendor (optional)

  createdAt: Date,                 // Indexed
  updatedAt: Date
}
```

### Inventory Management Methods

```javascript
// Get current availability
getAvailability() -> {
  isAvailable: Boolean,
  availableQuantity: Number,
  totalQuantity: Number,
  rentedQuantity: Number,
  maintenanceQuantity: Number,
  reservedQuantity: Number,
  isLowStock: Boolean
}

// Reserve quantity for pending order
reserveQuantity(quantity) -> throws if insufficient
// Moves from available to reserved

// Confirm rental (after payment)
confirmRental(quantity) -> throws if insufficient reserved
// Moves from reserved to rented

// Release after rental completion
releaseQuantity(quantity) -> throws if insufficient rented
// Moves from rented back to available

// Move to maintenance
moveToMaintenance(quantity) -> throws if insufficient available
// Moves from available to maintenance

// Return from maintenance
returnFromMaintenance(quantity) -> throws if insufficient in maintenance
// Moves from maintenance back to available

// Get rental price with discount
getRentalPrice(duration) -> Number
// Returns monthlyRent with applied discount

// Check availability for date range (static)
checkAvailability(productId, startDate, endDate, quantity) -> {
  available: Boolean,
  message: String,
  availableQuantity: Number
}
```

### Inventory Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   PRODUCT INVENTORY FLOW                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  totalQuantity (Fixed)                                       │
│        ↓                                                     │
│  └─ availableQuantity ──→ (Reserve) ──→ reservedQuantity   │
│     └─ rentedQuantity   (Confirm)                           │
│     └─ maintenanceQuantity                                  │
│                                                              │
│  User Orders Product:                                        │
│  1. availableQuantity ↓, reservedQuantity ↑                │
│                                                              │
│  Payment Confirmed:                                          │
│  2. reservedQuantity ↓, rentedQuantity ↑                   │
│                                                              │
│  Rental Completed:                                           │
│  3. rentedQuantity ↓, availableQuantity ↑                  │
│                                                              │
│  Damage Found:                                               │
│  3. availableQuantity ↓, maintenanceQuantity ↑             │
│                                                              │
│  Maintenance Done:                                           │
│  4. maintenanceQuantity ↓, availableQuantity ↑             │
└─────────────────────────────────────────────────────────────┘
```

### Inventory Validations

- `availableQuantity <= totalQuantity`
- `rentedQuantity <= totalQuantity`
- `maintenanceQuantity <= totalQuantity`
- `reservedQuantity <= availableQuantity`
- Sum of quantities ≤ totalQuantity

### Indexes

```javascript
- name (unique)
- slug (unique)
- category
- featured
- createdAt
- Text search: name, description, subcategory
```

---

## 4. Orders Collection

### Schema Fields

```javascript
{
  _id: ObjectId,
  user: ObjectId,                  // Required, Ref to User, Indexed
  orderNumber: String,             // Required, unique, Indexed (auto-generated)

  // Items
  items: [{
    product: ObjectId,             // Required, Ref to Product
    productName: String,
    monthlyRent: Number,
    securityDeposit: Number,
    quantity: Number,
    rentalStartDate: Date,
    rentalEndDate: Date,
    rentalDuration: String,
    rentWithDiscount: Number
  }],

  // Shipping Address
  shippingAddress: {
    street: String,                // Required
    city: String,                  // Required
    state: String,                 // Required
    pincode: String,               // Required, validated 5-10 digits
    country: String,               // Default: 'India'
    latitude: Number,
    longitude: Number,
    contactPerson: String,
    contactPhone: String
  },

  // Billing Address
  billingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },

  sameAsShipping: Boolean,         // Default: true

  // Payment Information
  paymentInfo: {
    method: String,                // enum: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Wallet']
    transactionId: String,         // Unique, sparse
    transactionDetails: {
      bank: String,
      cardLast4: String,
      timestamp: Date
    },
    status: String,                // enum: ['Pending', 'Completed', 'Failed', 'Refunding', 'Refunded']
    failureReason: String
  },

  // Rental Information
  rentalInfo: {
    expectedDelivery: Date,
    deliveryDate: Date,
    deliveredBy: {
      name: String,
      phone: String,
      photo: String
    },
    deliveryProof: String,
    expectedReturn: Date,
    returnDate: Date,
    returnPickupScheduled: Date,
    deliveryLocation: String,
    notes: String
  },

  // Pricing
  pricing: {
    subtotalRent: Number,          // Required, min 0
    totalDeposit: Number,          // Required, min 0
    discountAmount: Number,        // Default 0, min 0
    couponCode: String,
    deliveryCharges: Number,       // Default 0, min 0
    taxAmount: Number,             // Default 0, min 0
    totalAmount: Number,           // Required, min 0
    amountPaid: Number             // Default 0, min 0
  },

  // Status
  orderStatus: String,             // enum: ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'InUse', 'ReturnRequested', 'Returned', 'Cancelled']
  paymentStatus: String,           // enum: ['Pending', 'Paid', 'PartiallyPaid', 'Refunded']

  // Cancellation & Refund
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: String,             // enum: ['User', 'Admin', 'System']

  refundInfo: {
    refundAmount: Number,
    refundMethod: String,
    refundTransactionId: String,
    refundedAt: Date
  },

  // Timeline
  timeline: [{
    action: String,
    status: String,
    description: String,
    timestamp: Date                // Default: Date.now
  }],

  notes: String,
  createdAt: Date,                 // Indexed
  updatedAt: Date
}
```

### Methods

```javascript
canBeCancelled() -> Boolean
// Returns true if order is in ['Confirmed', 'Processing'] status

addTimeline(action, status, description) -> Order
// Adds timeline entry with current timestamp

getRemainingAmount() -> Number
// Returns totalAmount - amountPaid

// Static Methods
getUserOrders(userId, limit = 10) -> Promise
// Gets user's orders sorted by createdAt, populated with user

getPendingRefunds() -> Promise
// Gets orders with status 'Refunding' and no refundedAt
```

### Indexes

```javascript
-orderNumber(unique) - user - orderStatus - paymentStatus - createdAt;
```

---

## 5. Rentals Collection

### Schema Fields

```javascript
{
  _id: ObjectId,
  order: ObjectId,                 // Required, Ref to Order, Indexed
  user: ObjectId,                  // Required, Ref to User, Indexed

  // Products
  products: [{
    product: ObjectId,             // Required, Ref to Product
    productName: String,
    quantity: Number
  }],

  rentalNumber: String,            // Required, unique, Indexed (auto-generated)

  // Dates
  startDate: Date,                 // Required, Indexed
  endDate: Date,                   // Required
  expectedReturnDate: Date,
  actualReturnDate: Date,
  rentalDuration: String,

  // Status
  status: String,                  // enum: ['Active', 'Paused', 'Completed', 'Cancelled', 'Overdue']

  // Delivery Details
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
    proofOfDelivery: String         // Image URL of POD
  },

  // Condition Tracking
  condition: {
    initialCondition: String,      // Description at delivery
    currentCondition: String,
    returnCondition: String,       // Description at return
    damageNotes: String,
    damageImages: [String]         // URLs of damage photos
  },

  // Payment Information
  payment: {
    rentAlready: Number,           // Default 0, min 0
    rentRemaining: Number,         // min 0
    depositStatus: String,         // enum: ['Held', 'PartiallyReturned', 'Returned', 'Forfeited']
    depositReturnedAmount: Number, // Default 0, min 0
    depositForfeited: Number,      // Default 0, min 0
    penaltyCharges: Number,        // Default 0, min 0
    lateFeePerDay: Number,         // Default 0, min 0
    totalLateFeesAccrued: Number   // Default 0, min 0
  },

  // Extension Information
  extension: {
    isExtended: Boolean,           // Default false
    originalEndDate: Date,
    newEndDate: Date,
    extensionDays: Number,
    extensionCost: Number
  },

  // Ratings & Reviews
  ratings: {
    rating: Number,                // 1-5
    review: String,
    ratedAt: Date
  },

  // Timeline
  timeline: [{
    action: String,
    description: String,
    performedBy: ObjectId,         // Ref to User
    timestamp: Date                // Default: Date.now
  }],

  notes: String,
  createdAt: Date,                 // Indexed
  updatedAt: Date
}
```

### Methods

```javascript
isOverdue() -> Boolean
// Returns true if status is 'Active' and now > endDate

extendRental(days, cost) -> Rental
// Extends rental period and updates timeline

addTimeline(action, description, performedBy) -> Rental
// Adds timeline entry

calculateLateFees() -> Number
// Calculates late fees for overdue rentals
// Returns: daysOverdue * lateFeePerDay

markAsCompleted(returnCondition, depositDeduction = 0) -> Rental
// Marks rental as completed and handles deposit return/forfeiture

// Static Methods
getOverdueRentals() -> Promise
// Gets all active rentals with endDate < now, populated with user and products

getUserRentals(userId) -> Promise
// Gets all rentals for user, sorted by createdAt desc
```

### Late Fee Calculation

```javascript
If status === 'Overdue':
  daysOverdue = Math.ceil((now - endDate) / (1000 * 60 * 60 * 24))
  lateFee = daysOverdue * lateFeePerDay

Deducted from deposit or charged additionally
```

### Indexes

```javascript
-order - user - rentalNumber(unique) - startDate - status - createdAt;
```

---

## 6. Maintenance Requests Collection

### Schema Fields

```javascript
{
  _id: ObjectId,
  user: ObjectId,                  // Required, Ref to User, Indexed
  rental: ObjectId,                // Required, Ref to Rental, Indexed
  product: ObjectId,               // Required, Ref to Product

  ticketNumber: String,            // Required, unique, Indexed (auto-generated)

  title: String,                   // Required, 10-100 chars
  description: String,             // Required, 20+ chars

  // Category & Priority
  category: String,                // enum: ['Damage', 'Malfunction', 'Missing Parts', ...]
  priority: String,                // enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium'

  // Status
  status: String,                  // enum: ['Open', 'InProgress', 'OnHold', 'Resolved', 'Closed', 'Rejected']

  // Images
  images: [{
    url: String,
    public_id: String,
    uploadedAt: Date
  }],

  // Cost Information
  estimatedCost: Number,           // Default 0, min 0
  actualCost: Number,              // Default 0, min 0
  costApprovedBy: ObjectId,        // Ref to User (admin)
  costApprovedAt: Date,

  // Assignment
  assignedTo: ObjectId,            // Ref to User (technician)
  assignedAt: Date,

  assignmentHistory: [{
    technicianId: ObjectId,
    assignedAt: Date,
    unassignedAt: Date,
    reason: String
  }],

  // Resolution
  resolution: {
    resolvedBy: ObjectId,          // Ref to User
    resolutionNotes: String,       // Min 10 chars
    resolutionDate: Date,
    partsReplaced: [String],
    workHours: Number
  },

  // User Feedback
  userFeedback: {
    satisfactionRating: Number,    // 1-5
    feedback: String,              // Max 500 chars
    feedbackDate: Date
  },

  // Timeline
  timeline: [{
    action: String,                // enum: ['Created', 'Assigned', 'InProgress', 'Resolved', 'Closed', ...]
    description: String,
    performedBy: ObjectId,         // Ref to User
    timestamp: Date                // Default: Date.now
  }],

  // Attachments
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: Date
  }],

  // Dates
  estimatedCompletionDate: Date,
  actualCompletionDate: Date,

  // Rejection
  rejectionReason: String,         // Max 300 chars

  notes: String,                   // Max 1000 chars
  createdAt: Date,                 // Indexed
  updatedAt: Date
}
```

### Methods

```javascript
assignTechnician(technicianId) -> MaintenanceRequest
// Assigns to technician, tracks assignment history, updates status to InProgress

resolveRequest(technicianId, resolutionNotes, partsReplaced = []) -> MaintenanceRequest
// Marks as Resolved, records resolution details and timeline

closeRequest(performedBy) -> MaintenanceRequest
// Marks as Closed after resolution

rejectRequest(reason, performedBy) -> MaintenanceRequest
// Rejects request with reason

putOnHold(reason, performedBy) -> MaintenanceRequest
// Puts request on hold

addFeedback(rating, feedback) -> MaintenanceRequest
// Adds user satisfaction feedback

// Static Methods
getPendingRequests() -> Promise
// Gets all Open and InProgress requests, sorted by priority, populated with user and assignedTo

getUnassignedRequests() -> Promise
// Gets all unassigned Open requests

getTechnicianWorkload(technicianId) -> Promise
// Gets technician's active maintenance requests
```

### Assignment History

- Tracks when technician was assigned and unassigned
- Records reason for reassignment
- Useful for performance analytics

### Indexes

```javascript
-ticketNumber(unique) - user - rental - priority - status - createdAt;
```

---

## Data Relationships

### Reference Diagram

```
┌──────────────┐
│    Users     │
└──────┬───────┘
       │
   ┌───┴────────────────────────────────────────────┐
   │                                                │
   │ 1:N                                       1:N  │ 1:1
   ↓                                           ↓    ↓
┌─────────┐    1:N    ┌─────────┐    1:N   ┌──────────┐
│ Orders  │◄──────────│ Products│────────►│Categories│
└────┬────┘          └────┬────┘         └──────────┘
     │                    │
     │                    │
  1:1│                 1:N│
     ↓                    ↓
 ┌────────┐          ┌──────────────┐
 │Rentals │          │Maintenance   │
 │        │          │Requests      │
 └────────┘          └──────────────┘
```

### Relationships

```
User 1:N Orders
User 1:N Rentals
User 1:N Maintenance Requests

Order 1:N Rentals (one order creates rental)
Order 1:N Items (each item is a product)

Product 1:1 Category

Rental 1:N Maintenance Requests
Rental 1:N Products

Maintenance 1:1 Rental
Maintenance 1:1 Product
```

---

## Validation Summary

| Collection  | Field                       | Validation                |
| ----------- | --------------------------- | ------------------------- |
| User        | name                        | 3-50 chars                |
| User        | email                       | Valid format, unique      |
| User        | phone                       | Valid intl format, unique |
| User        | password                    | 8+ chars, hashed          |
| User        | pincode                     | 5-10 digits               |
| Category    | name                        | 3-50 chars, unique        |
| Category    | slug                        | Auto-generated, unique    |
| Product     | name                        | 3-100 chars, unique       |
| Product     | monthlyRent                 | ≥ 0                       |
| Product     | inventory.totalQuantity     | ≥ 1                       |
| Product     | inventory.availableQuantity | ≥ 0                       |
| Order       | shippingAddress.pincode     | 5-10 digits               |
| Order       | totalAmount                 | ≥ 0                       |
| Rental      | startDate                   | Required, indexed         |
| Maintenance | title                       | 10-100 chars              |
| Maintenance | description                 | 20+ chars                 |

---

## Timestamps

All collections include:

- `createdAt`: Document creation timestamp (indexed)
- `updatedAt`: Last update timestamp

---

## Query Optimization

### Recommended Indexes

```javascript
// User Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { unique: true });
db.users.createIndex({ accountStatus: 1 });
db.users.createIndex({ createdAt: -1 });

// Product Indexes
db.products.createIndex({ name: 1 }, { unique: true });
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ featured: 1 });
db.products.createIndex({
  name: "text",
  description: "text",
  subcategory: "text",
});

// Order Indexes
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ orderStatus: 1 });
db.orders.createIndex({ createdAt: -1 });

// Rental Indexes
db.rentals.createIndex({ rentalNumber: 1 }, { unique: true });
db.rentals.createIndex({ user: 1 });
db.rentals.createIndex({ startDate: 1 });
db.rentals.createIndex({ status: 1 });

// Maintenance Indexes
db.maintenance.createIndex({ ticketNumber: 1 }, { unique: true });
db.maintenance.createIndex({ priority: 1 });
db.maintenance.createIndex({ status: 1 });
db.maintenance.createIndex({ createdAt: -1 });
```

---

## Business Logic Summary

### Product Availability

- Products must have `availableQuantity > 0` to be rentable
- When user adds to cart, quantity is reserved (not rented yet)
- On payment confirmation, reserved becomes rented
- On rental completion, rented becomes available again
- Maintenance items move to `maintenanceQuantity`

### Order Status Flow

```
Confirmed → Processing → Shipped → Delivered → InUse → ReturnRequested → Returned/Cancelled
```

### Rental Status Flow

```
Active → (Overdue if endDate < now) → Completed/Cancelled
```

### Maintenance Status Flow

```
Open → Assigned → InProgress → OnHold (optional) → Resolved → Closed/Rejected
```

---

## Backup & Recovery

### Essential Collections Order for Backup

1. Categories
2. Users
3. Products
4. Orders
5. Rentals
6. Maintenance Requests

### Foreign Key Constraints

- Delete User: Cascade delete related Orders, Rentals, Maintenance Requests
- Delete Product: Soft delete (mark inactive)
- Delete Category: Prevent if products exist

---

**Last Updated**: May 2026
**Version**: 1.0
**Status**: Production Ready ✅
