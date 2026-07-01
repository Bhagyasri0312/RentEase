import { createContext, useState, useCallback, useEffect, useRef } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem("rentease_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error loading wishlist:", err);
      return [];
    }
  });

  const isFirstRender = useRef(true);

  // Save wishlist to localStorage
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("rentease_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add to wishlist
  const addToWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  }, []);

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // Check if in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some((item) => item.id === productId);
    },
    [wishlistItems],
  );

  // Get wishlist count
  const getWishlistCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  // Clear wishlist
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
