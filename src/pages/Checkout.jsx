import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  Zap,
} from "lucide-react";
import { useCart } from "../hooks/useCart";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, calculateTotals, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "card",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId] = useState(
    () => `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  );

  const totals = calculateTotals();
  const steps = ["Delivery", "Payment", "Confirmation"];

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate delivery form
  const validateDeliveryForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    }

    return newErrors;
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      const newErrors = validateDeliveryForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  // Handle order completion
  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(4);
    }, 2000);
  };

  // Redirect if cart is empty
  if (cartItems.length === 0 && currentStep !== 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-6">
            Please add items to your cart before checking out.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your rental order</p>
        </div>

        {currentStep !== 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex-1">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                          idx + 1 <= currentStep
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 transition-all ${
                            idx + 1 < currentStep
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <p className="text-sm font-medium mt-2 text-gray-700">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Step 1: Delivery Details */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Delivery Address
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.fullName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.email
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.phone
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Pincode */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.pincode
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.pincode && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.pincode}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.address
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.city
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.state
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Navigation Button */}
                  <button
                    onClick={handleNextStep}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {[
                      { id: "card", name: "Credit/Debit Card", icon: Lock },
                      { id: "upi", name: "UPI Payment", icon: Zap },
                      { id: "netbanking", name: "Net Banking", icon: Lock },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={handleInputChange}
                            className="w-5 h-5"
                          />
                          <Icon className="w-5 h-5 ml-3 text-blue-600" />
                          <span className="ml-3 font-medium text-gray-700">
                            {method.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Secure Message */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      🔒 Your payment is secure and encrypted. We never store
                      your card details.
                    </p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-lg transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      Review Order <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Review Your Order
                  </h2>

                  {/* Delivery Address Summary */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-gray-800 mb-3">
                      Delivery Address
                    </h3>
                    <p className="text-gray-700">{formData.fullName}</p>
                    <p className="text-gray-700">{formData.address}</p>
                    <p className="text-gray-700">
                      {formData.city}, {formData.state} - {formData.pincode}
                    </p>
                    <p className="text-gray-700 mt-2">
                      {formData.email} | {formData.phone}
                    </p>
                  </div>

                  {/* Items Summary */}
                  <div className="border-t pt-6">
                    <h3 className="font-bold text-gray-800 mb-3">
                      Order Items
                    </h3>
                    <div className="space-y-2">
                      {cartItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-gray-700"
                        >
                          <span>
                            {item.name} × {item.quantity} ({item.tenure}m)
                          </span>
                          <span>
                            ₹
                            {(
                              item.price *
                              item.quantity *
                              item.tenure
                            ).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-lg transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCompleteOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Order <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="flex justify-between text-gray-700">
                        <span>{item.name}</span>
                        <span className="font-semibold">
                          ₹
                          {(
                            item.price *
                            item.quantity *
                            item.tenure
                          ).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.quantity}x {item.tenure} months
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Security Deposit</span>
                    <span>₹{totals.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span>₹{totals.deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{totals.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Confirmation */}
        {currentStep === 4 && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 mb-6">
                Your rental order has been successfully placed.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mb-8 text-left">
                <p className="text-sm text-gray-600 mb-2">Order Details:</p>
                <p className="text-2xl font-bold text-blue-600 mb-3">
                  {orderId}
                </p>
                <p className="text-gray-700">
                  <strong>Total Amount:</strong> ₹
                  {totals.total.toLocaleString()}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Delivery to:</strong> {formData.city}
                </p>
              </div>

              <button
                onClick={() => {
                  clearCart();
                  navigate("/products");
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
