/**
 * Rental Extension and Return Scheduling
 */

export const calculateExtensionCost = (monthlyRate, extensionMonths) => {
  return monthlyRate * extensionMonths;
};

export const requestRentalExtension = (rentalId, currentEndDate, extensionMonths) => {
  const currentEnd = new Date(currentEndDate);
  const newEndDate = new Date(currentEnd.getFullYear(), currentEnd.getMonth() + extensionMonths, currentEnd.getDate());
  
  return {
    rentalId,
    originalEndDate: currentEndDate,
    newEndDate: newEndDate.toISOString(),
    extensionMonths,
    requestDate: new Date().toISOString(),
    status: 'pending',
  };
};

export const scheduleReturn = (rentalId, returnDate, returnType = 'pickup') => {
  return {
    rentalId,
    scheduledReturnDate: returnDate,
    returnType, // 'pickup' or 'drop-off'
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    reminderSent: false,
  };
};

export const calculateRentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const estimateReturnCost = (monthlyRate, rentalDays) => {
  // Charge based on actual days used (prorated)
  return (monthlyRate / 30) * rentalDays;
};

export const getReturnTimeSlots = () => {
  const slots = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    slots.push({
      date: date.toISOString().split('T')[0],
      times: [
        { slot: '09:00 AM - 12:00 PM', id: `${date.toISOString()}_morning` },
        { slot: '12:00 PM - 03:00 PM', id: `${date.toISOString()}_afternoon` },
        { slot: '03:00 PM - 06:00 PM', id: `${date.toISOString()}_evening` },
      ],
    });
  }
  
  return slots;
};

export const generateReturnLabel = (rentalId, trackingNumber) => {
  return {
    rentalId,
    trackingNumber,
    labelUrl: `https://api.rentease.com/return-labels/${trackingNumber}`,
    qrCode: `QR_${trackingNumber}`,
    generatedAt: new Date().toISOString(),
  };
};

export const calculateLateFees = (dueDate, returnDate, dailyRate) => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const diffTime = returned - due;
  
  if (diffTime <= 0) return 0; // Returned on time
  
  const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const lateFee = dailyRate * lateDays;
  
  return {
    lateDays,
    dailyRate,
    lateFee,
    totalWithFee: lateFee,
  };
};

export const sendReturnReminder = (rentalId, customerEmail, returnDate) => {
  // This would typically call an API to send email
  return {
    success: true,
    message: `Return reminder sent to ${customerEmail}`,
    rentalId,
    returnDate,
    sentAt: new Date().toISOString(),
  };
};

export const generateReturnReport = (rental) => {
  return {
    rentalId: rental.id,
    product: rental.product,
    startDate: rental.startDate,
    endDate: rental.endDate,
    returnDate: rental.returnDate || 'Not returned',
    rentalDays: calculateRentalDays(rental.startDate, rental.endDate),
    monthlyRate: rental.monthlyRate,
    totalCost: rental.totalCost,
    damageReport: rental.damageReport || 'No damage',
    status: rental.status,
    generatedAt: new Date().toISOString(),
  };
};
