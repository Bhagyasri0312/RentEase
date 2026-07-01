import { createContext, useState, useCallback, useEffect, useRef } from "react";

// Create Cart Context
export const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage
    try {
      const savedCart = localStorage.getItem("rentease_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("Error loading cart:", err);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);
  useEffect(() => {
    console.log("Cart Updated:", cartItems);
  }, [cartItems]);
  // Save cart to localStorage whenever it changes (after first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("rentease_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  
  const addToCart = useCallback((product, tenure = 3, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.tenure === tenure,
      );

      if (existingItem) {
        // Update quantity if item already exists with same tenure
        return prevItems.map((item) =>
          item.id === product.id && item.tenure === tenure
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      
      // Add new item to cart
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.monthlyRent || product.price,
          image: product.image || product.images?.[0],
          category: product.category,
          quantity,
          tenure, // months
          deliveryDate: null,
          address: null,
        },
      ];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((itemId, tenure) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === itemId && item.tenure === tenure),
      ),
    );
  }, []);

  // Update quantity
  const updateQuantity = useCallback(
    (itemId, tenure, quantity) => {
      if (quantity <= 0) {
        removeFromCart(itemId, tenure);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId && item.tenure === tenure
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [removeFromCart],
  );

  // Update tenure
  const updateTenure = useCallback((itemId, oldTenure, newTenure) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === itemId && item.tenure === newTenure,
      );

      if (existingItem) {
        // If item with new tenure exists, merge quantities
        return prevItems
          .filter((item) => !(item.id === itemId && item.tenure === oldTenure))
          .map((item) =>
            item.id === itemId && item.tenure === newTenure
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
      }

      // Update tenure for existing item
      return prevItems.map((item) =>
        item.id === itemId && item.tenure === oldTenure
          ? { ...item, tenure: newTenure }
          : item,
      );
    });
  }, []);

  // Update delivery date
  const updateDeliveryDate = useCallback((itemId, tenure, date) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.tenure === tenure
          ? { ...item, deliveryDate: date }
          : item,
      ),
    );
  }, []);

  // Update address
  const updateAddress = useCallback((itemId, tenure, address) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.tenure === tenure
          ? { ...item, address }
          : item,
      ),
    );
  }, []);

  // Calculate cart totals
  const calculateTotals = useCallback(() => {
    let subtotal = 0;
    let securityDeposit = 0;
    let deliveryFee = 0;

    cartItems.forEach((item) => {
      const monthlyRent = item.price * item.quantity;
      const totalRent = monthlyRent * item.tenure;
      subtotal += totalRent;

      // Security deposit: 1 month's rent
      securityDeposit += monthlyRent;

      // Delivery fee: 100 per item (can be modified)
      deliveryFee += 100 * item.quantity;
    });

    const total = subtotal + securityDeposit + deliveryFee;

    return {
      subtotal,
      securityDeposit,
      deliveryFee,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [cartItems]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Get cart count
  const getCartCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateTenure,
    updateDeliveryDate,
    updateAddress,
    calculateTotals,
    clearCart,
    getCartCount,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
