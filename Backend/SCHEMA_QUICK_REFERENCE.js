// Quick Reference: MongoDB Schema Methods & Inventory Management
// ============================================================

/**
 * PRODUCT INVENTORY MANAGEMENT
 * ============================
 */

// 1. CHECK PRODUCT AVAILABILITY
async checkProductAvailability(productId, quantity) {
  const product = await Product.findById(productId);
  const availability = product.getAvailability();
  
  /*
  Returns:
  {
    isAvailable: true/false,
    availableQuantity: 10,
    totalQuantity: 20,
    rentedQuantity: 8,
    maintenanceQuantity: 2,
    reservedQuantity: 0,
    isLowStock: false
  }
  */
}

// 2. RESERVE QUANTITY (When User Adds to Cart)
async reserveProduct(productId, quantity) {
  const product = await Product.findById(productId);
  
  try {
    product.reserveQuantity(quantity);
    // availableQuantity ↓, reservedQuantity ↑
    await product.save();
    return { success: true, message: 'Quantity reserved' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 3. CONFIRM RENTAL (When Payment Succeeds)
async confirmRental(productId, quantity) {
  const product = await Product.findById(productId);
  
  try {
    product.confirmRental(quantity);
    // reservedQuantity ↓, rentedQuantity ↑
    await product.save();
    return { success: true, message: 'Rental confirmed' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 4. RELEASE QUANTITY (When Rental Completes)
async completeRental(productId, quantity) {
  const product = await Product.findById(productId);
  
  try {
    product.releaseQuantity(quantity);
    // rentedQuantity ↓, availableQuantity ↑
    await product.save();
    return { success: true, message: 'Product released to inventory' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 5. SEND FOR MAINTENANCE
async sendToMaintenance(productId, quantity) {
  const product = await Product.findById(productId);
  
  try {
    product.moveToMaintenance(quantity);
    // availableQuantity ↓, maintenanceQuantity ↑
    await product.save();
    return { success: true, message: 'Product in maintenance' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 6. RETURN FROM MAINTENANCE
async returnFromMaintenance(productId, quantity) {
  const product = await Product.findById(productId);
  
  try {
    product.returnFromMaintenance(quantity);
    // maintenanceQuantity ↓, availableQuantity ↑
    await product.save();
    return { success: true, message: 'Product returned to inventory' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 7. GET RENTAL PRICE WITH DISCOUNT
async getRentalPrice(productId, duration) {
  const product = await Product.findById(productId);
  
  // duration: '1-month', '3-months', '6-months', '12-months'
  const price = product.getRentalPrice(duration);
  
  return {
    originalPrice: product.monthlyRent,
    discountedPrice: price,
    duration: duration
  };
}

/**
 * USER MANAGEMENT
 * ===============
 */

// 1. HANDLE FAILED LOGIN ATTEMPTS
async loginUser(email, password) {
  let user = await User.findOne({ email }).select('+password');
  
  if (!user || !await user.comparePassword(password)) {
    // Increment failed attempts
    await user.incrementLoginAttempts();
    
    if (user.isAccountLocked()) {
      return { success: false, message: 'Account locked. Try again in 30 minutes' };
    }
    
    return { success: false, message: 'Invalid credentials' };
  }
  
  // Success: Reset attempts
  await user.resetLoginAttempts();
  return { success: true, user };
}

// 2. ADD ALTERNATE ADDRESS
async addUserAddress(userId, addressData) {
  const user = await User.findById(userId);
  
  try {
    user.addAddress(addressData);
    // addressData: { street, city, state, pincode, country, label }
    await user.save();
    return { success: true, message: 'Address added' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 3. SET DEFAULT ADDRESS
async setDefaultAddress(userId, addressIndex) {
  const user = await User.findById(userId);
  
  user.setDefaultAddress(addressIndex);
  // addressIndex: 0 = primary, 1+ = alternate addresses
  await user.save();
  return { success: true };
}

/**
 * ORDER MANAGEMENT
 * ================
 */

// 1. CREATE ORDER WITH TIMELINE
async createOrder(orderData) {
  const order = new Order(orderData);
  
  // Pre-save hook auto-generates orderNumber: ORD-YYYYMMDD-00001
  await order.save();
  
  // Add to timeline
  order.addTimeline('Order Confirmed', 'Confirmed', 'Order placed successfully');
  order.addTimeline('Payment Pending', 'Confirmed', 'Awaiting payment confirmation');
  await order.save();
  
  return order;
}

// 2. UPDATE ORDER STATUS WITH TIMELINE
async updateOrderStatus(orderId, newStatus) {
  const order = await Order.findById(orderId);
  
  const oldStatus = order.orderStatus;
  order.orderStatus = newStatus;
  
  order.addTimeline(
    'Status Changed',
    newStatus,
    `Status changed from ${oldStatus} to ${newStatus}`
  );
  
  await order.save();
  return order;
}

// 3. PROCESS REFUND
async processRefund(orderId, reason) {
  const order = await Order.findById(orderId);
  
  if (!order.canBeCancelled()) {
    return { success: false, message: 'Order cannot be cancelled at this stage' };
  }
  
  order.orderStatus = 'Cancelled';
  order.cancellationReason = reason;
  order.cancelledAt = new Date();
  order.cancelledBy = 'User';
  
  order.paymentInfo.status = 'Refunding';
  
  order.refundInfo = {
    refundAmount: order.pricing.totalAmount,
    refundMethod: order.paymentInfo.method,
    refundTransactionId: `REF-${Date.now()}`,
    refundedAt: new Date()
  };
  
  order.addTimeline('Refund Initiated', 'Cancelled', reason);
  
  await order.save();
  return { success: true, order };
}

// 4. GET USER ORDERS
async getUserOrders(userId) {
  const orders = await Order.getUserOrders(userId, 10);
  // Returns last 10 orders populated with user info
  return orders;
}

/**
 * RENTAL MANAGEMENT
 * =================
 */

// 1. CHECK IF RENTAL IS OVERDUE
async checkRentalStatus(rentalId) {
  const rental = await Rental.findById(rentalId);
  
  const isOverdue = rental.isOverdue();
  
  if (isOverdue) {
    rental.status = 'Overdue';
    const lateFees = rental.calculateLateFees();
    
    rental.payment.totalLateFeesAccrued = lateFees;
    await rental.save();
  }
  
  return { isOverdue, lateFees: rental.payment.totalLateFeesAccrued };
}

// 2. EXTEND RENTAL
async extendRental(rentalId, additionalDays, cost) {
  const rental = await Rental.findById(rentalId);
  
  if (rental.status !== 'Active') {
    return { success: false, message: 'Can only extend active rentals' };
  }
  
  rental.extendRental(additionalDays, cost);
  rental.addTimeline('Extended', `Extended for ${additionalDays} days`, rental.user);
  
  await rental.save();
  return { success: true, rental };
}

// 3. COMPLETE RENTAL WITH DAMAGE ASSESSMENT
async completeRental(rentalId, returnCondition, damageDeduction) {
  const rental = await Rental.findById(rentalId);
  
  rental.markAsCompleted(returnCondition, damageDeduction);
  rental.addTimeline('Completed', 'Rental period completed', rental.user);
  
  // Calculate deposit refund
  const depositRefund = rental.payment.depositReturnedAmount;
  
  await rental.save();
  
  return {
    success: true,
    depositDeducted: damageDeduction,
    depositRefund: depositRefund,
    rental
  };
}

// 4. GET OVERDUE RENTALS
async getOverdueRentals() {
  const overdueRentals = await Rental.getOverdueRentals();
  // Returns all overdue rentals with user and product info
  return overdueRentals;
}

// 5. ADD RENTAL REVIEW
async addRentalReview(rentalId, rating, review) {
  const rental = await Rental.findById(rentalId);
  
  rental.ratings = {
    rating,
    review,
    ratedAt: new Date()
  };
  
  await rental.save();
  return { success: true };
}

/**
 * MAINTENANCE REQUEST MANAGEMENT
 * ===============================
 */

// 1. CREATE MAINTENANCE REQUEST
async createMaintenanceRequest(requestData) {
  const maintenance = new MaintenanceRequest(requestData);
  
  // Pre-save hook auto-generates ticketNumber: TKT-YYYYMMDD-00001
  await maintenance.save();
  
  maintenance.addTimeline('Created', 'Open', 'Maintenance request created');
  await maintenance.save();
  
  return maintenance;
}

// 2. ASSIGN TO TECHNICIAN
async assignToTechnician(maintenanceId, technicianId) {
  const maintenance = await MaintenanceRequest.findById(maintenanceId);
  
  maintenance.assignTechnician(technicianId);
  // Auto-updates status to 'InProgress'
  // Tracks assignment history
  
  await maintenance.save();
  return maintenance;
}

// 3. RESOLVE MAINTENANCE
async resolveMaintenance(maintenanceId, technicianId, notes, partsReplaced = []) {
  const maintenance = await MaintenanceRequest.findById(maintenanceId);
  
  maintenance.resolveRequest(technicianId, notes, partsReplaced);
  await maintenance.save();
  
  return maintenance;
}

// 4. CLOSE MAINTENANCE REQUEST
async closeMaintenanceRequest(maintenanceId, adminId) {
  const maintenance = await MaintenanceRequest.findById(maintenanceId);
  
  if (maintenance.status !== 'Resolved') {
    return { success: false, message: 'Can only close resolved requests' };
  }
  
  maintenance.closeRequest(adminId);
  await maintenance.save();
  
  return { success: true };
}

// 5. ADD USER FEEDBACK
async addMaintenanceFeedback(maintenanceId, rating, feedback) {
  const maintenance = await MaintenanceRequest.findById(maintenanceId);
  
  maintenance.addFeedback(rating, feedback);
  await maintenance.save();
  
  return { success: true };
}

// 6. GET PENDING REQUESTS
async getPendingMaintenance() {
  const pending = await MaintenanceRequest.getPendingRequests();
  // Returns all Open and InProgress requests sorted by priority
  return pending;
}

// 7. GET TECHNICIAN WORKLOAD
async getTechnicianWorkload(technicianId) {
  const workload = await MaintenanceRequest.getTechnicianWorkload(technicianId);
  // Returns active requests assigned to technician
  return workload;
}

/**
 * COMMON VALIDATION PATTERNS
 * ==========================
 */

// Validate address
const validateAddress = (address) => {
  const { street, city, state, pincode, country } = address;
  
  if (!street || !city || !state || !pincode) {
    return { valid: false, message: 'Missing required address fields' };
  }
  
  if (!/^\d{5,10}$/.test(pincode)) {
    return { valid: false, message: 'Invalid pincode format' };
  }
  
  return { valid: true };
};

// Validate rental dates
const validateRentalDates = (startDate, endDate) => {
  const now = new Date();
  
  if (startDate < now) {
    return { valid: false, message: 'Start date cannot be in the past' };
  }
  
  if (endDate <= startDate) {
    return { valid: false, message: 'End date must be after start date' };
  }
  
  const minDays = 30;
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  if (days < minDays) {
    return { valid: false, message: `Minimum rental period is ${minDays} days` };
  }
  
  return { valid: true };
};

// Error handling wrapper
async function handleDatabaseOperation(operation, errorContext) {
  try {
    return await operation();
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return { success: false, message: `${field} already exists` };
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return { success: false, message: messages.join(', ') };
    }
    
    console.error(`Database error in ${errorContext}:`, error);
    return { success: false, message: 'Database operation failed' };
  }
}

module.exports = {
  validateAddress,
  validateRentalDates,
  handleDatabaseOperation
};
