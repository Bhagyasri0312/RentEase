import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import { WishlistProvider } from "./context/WishlistContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { ReviewsProvider } from "./context/ReviewsContext";

// Main entry point with Router and Context providers
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <NotificationsProvider>
          <ReviewsProvider>
            <CartProvider>
              <AdminProvider>
                <App />
              </AdminProvider>
            </CartProvider>
          </ReviewsProvider>
        </NotificationsProvider>
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>,
);
