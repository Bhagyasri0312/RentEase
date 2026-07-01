import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout, ErrorBoundary } from "./components";
import {
  Home,
  Products,
  ProductDetails,
  Cart,
  Wishlist,
  RentalExtension,
} from "./pages";
import CategoryCollection from "./pages/CategoryCollection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Auth Routes (No Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main Routes with Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/products"
            element={
              <Layout>
                <Products />
              </Layout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <Layout>
                <ProductDetails />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          
          {/* Checkout Route */}
          <Route
            path="/checkout"
            element={
              <Layout>
                <Checkout />
              </Layout>
            }
          />

          {/* Wishlist Route */}
          <Route
            path="/wishlist"
            element={
              <Layout>
                <Wishlist />
              </Layout>
            }
          />

          {/* Rental Extension Route */}
          <Route
            path="/rental-extension"
            element={
              <Layout>
                <RentalExtension />
              </Layout>
            }
          />

          {/* Category Routes */}
          <Route
            path="/category/:category"
            element={
              <Layout>
                <CategoryCollection />
              </Layout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/notifications"
            element={
              <Layout>
                <Notifications />
              </Layout>
            }
          />
          {/* 404 Page */}
          <Route
            path="*"
            element={
              <Layout>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-5xl font-bold text-secondary-800 mb-4">
                      404
                    </h1>
                    <p className="text-xl text-secondary-600 mb-8">
                      Page not found
                    </p>
                    <a href="/" className="btn-primary">
                      Go Home
                    </a>
                  </div>
                </div>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
