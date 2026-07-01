# RentEase Database Schema Overview

## Database Collections (6)

```
┌────────────────────────────────────────────────────────────────┐
│                    RentEase Collections                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📋 Users                    🛍️ Categories                    │
│  ├─ User authentication      ├─ Hierarchical categories      │
│  ├─ Multiple addresses       ├─ SEO metadata                │
│  ├─ KYC verification        ├─ Auto-generated slugs         │
│  ├─ Account locks           └─ Product count tracking       │
│  └─ Login tracking                                           │
│                                                               │
│  🏷️ Products                 📦 Orders                      │
│  ├─ Inventory tracking      ├─ Auto-generated numbers      │
│  ├─ Rental discounts        ├─ Shipping & billing          │
│  ├─ Damage policies         ├─ Payment tracking            │
│  ├─ Availability logic      ├─ Refund management           │
│  └─ Low stock alerts        └─ Timeline history            │
│                                                               │
│  🔄 Rentals                 🔧 Maintenance Requests        │
│  ├─ Rental tracking         ├─ Ticket management           │
│  ├─ Overdue detection       ├─ Technician assignment       │
│  ├─ Late fee calculation    ├─ Priority workflows          │
│  ├─ Condition assessment    ├─ Cost approval              │
│  └─ Extension management    └─ Feedback tracking           │
│                                                               │
└────────────────────────────────────────────────────────────────┘
```

## Complete Inventory Flow

```
                         PRODUCT INVENTORY LIFECYCLE
                         ==============================

    Initial State: totalQuantity = 20
    ┌─────────────────────────────────────┐
    │ availableQuantity  = 20             │
    │ rentedQuantity     = 0              │
    │ maintenanceQuantity= 0              │
    │ reservedQuantity   = 0              │
    └─────────────────────────────────────┘
                    │
                    ↓
    User adds product to cart (reserve 3 units)
    ┌─────────────────────────────────────┐
    │ availableQuantity  = 17   ↓         │
    │ rentedQuantity     = 0              │
    │ maintenanceQuantity= 0              │
    │ reservedQuantity   = 3    ↑         │
    └─────────────────────────────────────┘
                    │
                    ↓
    Payment confirmed (confirm rental)
    ┌─────────────────────────────────────┐
    │ availableQuantity  = 17             │
    │ rentedQuantity     = 3    ↑         │
    │ maintenanceQuantity= 0              │
    │ reservedQuantity   = 0    ↓         │
    └─────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ↓                       ↓

    [Normal Path]          [Damage Path]
    Rental Complete         Product Damaged
        ↓                       ↓
    releaseQuantity()      moveToMaintenance()
        │                       │
    ┌─────────────────┐    ┌──────────────────┐
    │ availableQty: 20│    │ availableQty: 17 │
    │ rentedQty: 0   │    │ maintenanceQty: 3│
    └─────────────────┘    └──────────────────┘
        │                       │
        │                       ↓
        │                  returnFromMaintenance()
        │                       │
        └───────────┬───────────┘
                    │
            ┌───────↓───────┐
            │               │
            ✅ Back to      ✅ Restored
            Available       to Available
```

## User Status Lifecycle

```
                    USER ACCOUNT LIFECYCLE
                    =======================

NEW USER
   │
   ├─→ Email Verification
   │   ├─→ ✓ Verified (isVerified: true)
   │   └─→ ✗ Failed (Resend verification)
   │
   └─→ Active Account
       accountStatus: "Active"
       isActive: true
       │
       ├─→ Failed Login (5 times)
       │   └─→ Account Locked
       │       lockUntil: Date + 30 mins
       │       (Auto-unlock after 30 mins)
       │
       ├─→ Admin Suspension
       │   └─→ accountStatus: "Suspended"
       │       suspensionReason: "Reason"
       │       suspendedAt: Date
       │       └─→ Can be resumed
       │           accountStatus: "Active"
       │           resumedAt: Date
       │
       └─→ User Deactivation
           accountStatus: "Deactivated"
           (User can reactivate)
           │
           └─→ Admin Block
               accountStatus: "Blocked"
               (Cannot reactivate)
```

## Order Status & Payment Flow

```
                        ORDER LIFECYCLE
                        ================

Confirmed (Payment Pending)
   │
   ├─→ Payment Failed → PaymentStatus: Failed → Can Retry
   │
   └─→ Payment Successful → PaymentStatus: Paid
       │
       ├─→ Processing
       │   (Preparing for shipment)
       │
       ├─→ Shipped
       │   (In transit)
       │
       ├─→ Delivered
       │   (Item received)
       │
       ├─→ InUse
       │   (Rental active)
       │   │
       │   ├─→ Overdue?
       │   │   (Late fees accumulate)
       │   │
       │   └─→ ReturnRequested
       │       (Ready to return)
       │
       ├─→ Returned
       │   └─→ Deposit Refund?
       │       ├─→ Full Refund (no damage)
       │       ├─→ Partial Refund (slight damage)
       │       └─→ Forfeited (excessive damage)
       │
       └─→ Cancelled (anytime before InUse)
           └─→ PaymentStatus: Refunding
               └─→ PaymentStatus: Refunded
```

## Maintenance Request Workflow

```
                   MAINTENANCE LIFECYCLE
                   =======================

OPEN (Unassigned)
 │
 ├─→ assignTechnician()
 │   │
 │   └─→ IN PROGRESS
 │       │
 │       ├─→ putOnHold(reason)
 │       │   └─→ ON HOLD
 │       │       └─→ Continue work
 │       │           └─→ Back to IN PROGRESS
 │       │
 │       ├─→ resolveRequest(notes, parts)
 │       │   │
 │       │   └─→ RESOLVED
 │       │       └─→ awaitingUserFeedback
 │       │           └─→ addFeedback(rating, review)
 │       │               └─→ closeRequest()
 │       │                   └─→ CLOSED ✓
 │       │
 │       └─→ rejectRequest(reason)
 │           └─→ REJECTED
 │               (Reassign if needed)
 │
 └─→ rejectRequest(reason)
     └─→ REJECTED
         (Close or reassign)

PRIORITY LEVELS:
 • Low    - Non-urgent, can wait
 • Medium - Should fix soon
 • High   - Affects usability
 • Urgent - Critical, immediate action
```

## Rental Late Fee Calculation

```
                      LATE FEE MANAGEMENT
                      ===================

IF endDate < NOW:
   status = "Overdue"
   │
   daysOverdue = ceil((NOW - endDate) / (24 hours))
   │
   lateFeePerDay = configured amount (e.g., $5)
   │
   totalLateFees = daysOverdue × lateFeePerDay
   │
   ├─→ Deduct from deposit first
   │   deposithForfeited += totalLateFees
   │
   ├─→ If fees exceed deposit
   │   amount owed = totalLateFees - deposit
   │   (User charged additional amount)
   │
   └─→ On rental completion
       Show late fee breakdown
       Calculate final deposit refund


EXAMPLE:
 • endDate: 2026-05-20
 • currentDate: 2026-05-25
 • lateFeePerDay: $5
 • originalDeposit: $100

 daysOverdue = 5 days
 totalLateFees = 5 × $5 = $25

 Deposit refund = $100 - $25 = $75
```

## Address Management

```
                       USER ADDRESSES
                       ==============

Primary Address (required)
├─ street
├─ city
├─ state
├─ pincode
├─ country
├─ latitude/longitude (GPS)
└─ isDefault: true

Alternate Addresses (max 5)
├─ Address 1
│  ├─ label: "Home" / "Office" / "Other"
│  └─ isDefault: false
├─ Address 2
│  ├─ label: "Home"
│  └─ isDefault: false (can set as default)
├─ Address 3
├─ Address 4
└─ Address 5

setDefaultAddress(index):
 • index 0 = primary becomes default
 • index 1+ = alternate becomes default
 • Only one can be default
```

## Product Discount Structure

```
                    RENTAL DISCOUNTS
                    ================

Base Price: $100/month

Rental Duration Discounts:
├─ 1-month    → 0% discount   = $100
├─ 3-months   → 10% discount  = $90
├─ 6-months   → 20% discount  = $80
└─ 12-months  → 35% discount  = $65

Calculation:
 discountedPrice = monthlyRent × (1 - discount/100)

EXAMPLE:
 Select 3-month rental
 discountedPrice = $100 × (1 - 10/100)
                 = $100 × 0.9
                 = $90/month
 Total for 3 months = $270
```

## Database Indexes

```
                    INDEX OPTIMIZATION
                    ==================

UNIQUE INDEXES (Prevent duplicates):
 • User.email
 • User.phone
 • Product.name
 • Product.slug
 • Order.orderNumber
 • Rental.rentalNumber
 • Maintenance.ticketNumber

SINGLE FIELD INDEXES (Fast lookups):
 • User.accountStatus
 • Product.featured
 • Order.user
 • Order.orderStatus
 • Rental.user
 • Rental.status
 • Maintenance.priority
 • Maintenance.status

COMPOUND INDEXES (Multi-field searches):
 • Product: [name: text, description: text, category: text]

SORTED INDEXES (Efficient sorting):
 • User.createdAt ↓
 • Product.createdAt ↓
 • Order.createdAt ↓
 • Rental.createdAt ↓
 • Maintenance.createdAt ↓
```

## Data Validation Rules

```
                    VALIDATION RULES
                    ================

USER FIELDS:
 • name: 3-50 characters
 • email: valid format, unique
 • phone: valid intl format, unique
 • password: 8+ chars, hashed
 • pincode: 5-10 digits
 • addresses: max 5 alternate

PRODUCT FIELDS:
 • name: 3-100 chars, unique
 • monthlyRent: ≥ 0
 • securityDeposit: ≥ 0
 • totalQuantity: ≥ 1
 • availableQuantity: 0 to totalQuantity
 • rentalDuration: 1/3/6/12 months
 • rating: 0-5 stars

ORDER FIELDS:
 • totalAmount: ≥ 0
 • pincode: 5-10 digits
 • paymentMethod: required
 • orderStatus: predefined enum
 • paymentStatus: predefined enum

RENTAL FIELDS:
 • startDate: required, > now
 • endDate: > startDate
 • minDuration: 30 days
 • status: predefined enum

MAINTENANCE FIELDS:
 • title: 10-100 chars
 • description: 20+ chars
 • priority: Low/Medium/High/Urgent
 • category: predefined enum
 • status: predefined enum
```

## Query Patterns

```
                    COMMON QUERIES
                    ==============

GET USER'S ORDERS:
 db.orders.find({ user: userId })
           .populate('user products')
           .sort({ createdAt: -1 })
           .limit(10)

GET PRODUCT AVAILABILITY:
 db.products.findById(productId)
           .select('inventory')

GET OVERDUE RENTALS:
 db.rentals.find({ status: 'Active', endDate: { $lt: now } })
          .populate('user products')

GET PENDING MAINTENANCE:
 db.maintenance.find({ status: { $in: ['Open', 'InProgress'] } })
               .sort({ priority: -1, createdAt: 1 })

GET LOW STOCK PRODUCTS:
 db.products.find({
   'inventory.availableQuantity': {
     $lte: 'inventory.lowStockThreshold'
   }
 })

GET USER'S ADDRESS:
 User.findById(userId)
     .select('address alternateAddresses')
```

## File Structure

```
Backend/
├── src/
│   ├── models/
│   │   ├── User.js                 ✅ Enhanced
│   │   ├── Category.js             ✅ NEW
│   │   ├── Product.js              ✅ Enhanced
│   │   ├── Order.js                ✅ Enhanced
│   │   ├── Rental.js               ✅ Enhanced
│   │   ├── MaintenanceRequest.js   ✅ Enhanced
│   │   └── Cart.js                 ✅ Existing
│   │
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── index.js
│
├── MONGODB_SCHEMAS.md              📄 1000+ lines
├── SCHEMAS_SUMMARY.md              📄 Comprehensive guide
├── SCHEMA_QUICK_REFERENCE.js       📄 Code examples
└── package.json

```

---

**Created**: May 22, 2026  
**Status**: ✅ Production Ready  
**Version**: 1.0
