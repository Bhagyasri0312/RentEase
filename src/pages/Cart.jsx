import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../hooks/useCart";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, calculateTotals } =
    useCart();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const totals = calculateTotals();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">Your cart items</p>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add items to your cart and they will appear here
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-500 transition-all font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Cart Items</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.category}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-blue-600">
                            ₹{item.price}
                          </span>
                          {item.tenure && (
                            <span className="text-sm text-gray-600">
                              Tenure: {item.tenure} months
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.tenure,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.tenure,
                                item.quantity + 1,
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => setShowDeleteConfirm(item.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="text-lg font-bold text-gray-800">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm === item.id && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-4">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-800 flex-1">
                          Remove this item from cart?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              removeFromCart(item.id, item.tenure);
                              setShowDeleteConfirm(null);
                            }}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow-lg p-6 text-white sticky top-8">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-blue-300">
                <div className="flex justify-between">
                  <span className="text-blue-100">Subtotal</span>
                  <span className="font-semibold">₹{totals.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Security Deposit</span>
                  <span className="font-semibold">
                    ₹{totals.securityDeposit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Delivery Charge</span>
                  <span className="font-semibold">₹{totals.deliveryFee}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total Amount</span>
                <span>₹{totals.total}</span>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  to="/checkout"
                  className="block w-full bg-white text-blue-600 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors text-center"
                >
                  <span className="flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>

                <Link
                  to="/products"
                  className="block w-full border-2 border-white text-white py-3 rounded-lg font-semibold text-center hover:bg-white/10 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
                <p className="text-sm text-blue-100">
                  ✓ Free cancellation within 24 hours
                </p>
                <p className="text-sm text-blue-100 mt-2">
                  ✓ Flexible tenure options
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
