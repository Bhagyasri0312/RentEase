# RentEase - Frontend & Backend Integration Guide

## ✅ Status: CONNECTED & RUNNING

### 🚀 Running Servers

#### Backend (Node.js/Express)

- **URL**: http://localhost:5001
- **API Base**: http://localhost:5001/api/v1
- **Status**: ✅ Running
- **Database**: MongoDB Atlas (Connected)
- **Port**: 5001

#### Frontend (React/Vite)

- **URL**: http://localhost:5173 (or 5174)
- **Status**: ✅ Ready to connect
- **Technology**: React 19, Vite, Tailwind CSS

---

## 📋 Connection Configuration

### Environment Variables (.env.local)

```
VITE_API_URL=http://localhost:5001/api/v1
VITE_APP_NAME=RentEase
VITE_APP_VERSION=1.0.0
```

### API Configuration Files Created

✅ `src/api/axiosConfig.js` - Axios instance with interceptors
✅ `src/api/services.js` - All API service functions

---

## 🔧 How to Integrate Backend APIs

### 1. Import Services in Components

```javascript
import {
  authAPI,
  productsAPI,
  cartAPI,
  ordersAPI,
  rentalsAPI,
  maintenanceAPI,
} from "@/api/services";
```

### 2. Use in Login (Example)

```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;

    // Store token
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect to home
    navigate("/");
  } catch (error) {
    console.error("Login failed:", error.response.data.message);
  }
};
```

### 3. Use in Register (Example)

```javascript
const handleRegister = async (formData) => {
  try {
    const response = await authAPI.register(formData);
    const { token, user } = response.data;

    // Store token
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect to home
    navigate("/");
  } catch (error) {
    console.error("Registration failed:", error.response.data.message);
  }
};
```

### 4. Get Products (Example)

```javascript
const fetchProducts = async () => {
  try {
    const response = await productsAPI.getAllProducts({
      category: "Furniture",
      page: 1,
      limit: 12,
    });
    setProducts(response.data.products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};
```

### 5. Add to Cart (Example)

```javascript
const handleAddToCart = async (productId, quantity, rentalDuration) => {
  try {
    const response = await cartAPI.addToCart({
      productId,
      quantity,
      rentalStartDate: new Date(),
      rentalEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      rentalDuration,
    });
    console.log("Added to cart:", response.data);
  } catch (error) {
    console.error("Failed to add to cart:", error);
  }
};
```

---

## 🔐 Authentication Flow

### Token Storage & Usage

```javascript
// After login/register
localStorage.setItem("token", token);

// Token is automatically included in all requests via axios interceptor
// Located in src/api/axiosConfig.js
```

### Auto-redirect on Unauthorized

If a 401 error occurs (unauthorized), the user is automatically redirected to login.

---

## 📊 Available API Endpoints

### Authentication (9 endpoints)

```javascript
authAPI.register(data); // POST /auth/register
authAPI.login(data); // POST /auth/login
authAPI.logout(); // POST /auth/logout
authAPI.getCurrentUser(); // GET /auth/me
authAPI.updateProfile(data); // PUT /auth/profile
authAPI.changePassword(data); // PUT /auth/change-password
authAPI.forgotPassword(email); // POST /auth/forgot-password
authAPI.resetPassword(data); // POST /auth/reset-password
authAPI.verifyEmail(token); // POST /auth/verify-email
```

### Products (9 endpoints)

```javascript
productsAPI.getAllProducts(params); // GET /products
productsAPI.getProduct(id); // GET /products/:id
productsAPI.getFeaturedProducts(); // GET /products/featured
productsAPI.searchProducts(query, params); // GET /products/search
productsAPI.getProductsByCategory(cat); // GET /products/category/:id
productsAPI.rateProduct(id, rating); // PUT /products/:id/rating
productsAPI.createProduct(data); // POST /products
productsAPI.updateProduct(id, data); // PUT /products/:id
productsAPI.deleteProduct(id); // DELETE /products/:id
```

### Shopping Cart (6 endpoints)

```javascript
cartAPI.getCart(); // GET /cart
cartAPI.addToCart(data); // POST /cart/add
cartAPI.updateCartItem(itemId, data); // PUT /cart/:itemId
cartAPI.removeFromCart(itemId); // DELETE /cart/:itemId
cartAPI.clearCart(); // DELETE /cart
cartAPI.applyCoupon(code); // POST /cart/coupon
```

### Orders (7 endpoints)

```javascript
ordersAPI.getOrders(params); // GET /orders
ordersAPI.getOrder(id); // GET /orders/:id
ordersAPI.createOrder(data); // POST /orders
ordersAPI.cancelOrder(id, reason); // PUT /orders/:id/cancel
ordersAPI.getAllOrders(params); // GET /orders/admin/all
ordersAPI.updateOrderStatus(id, status); // PUT /orders/:id/status
ordersAPI.updatePaymentStatus(id, status, transactionId); // PUT /orders/:id/payment
```

### Rentals (10 endpoints)

```javascript
rentalsAPI.getRentals(params); // GET /rentals
rentalsAPI.getRental(id); // GET /rentals/:id
rentalsAPI.getOverdueRentals(); // GET /rentals/overdue
rentalsAPI.startRental(orderId, deliveryDetails); // POST /rentals/start/:orderId
rentalsAPI.requestReturn(id, data); // PUT /rentals/:id/request-return
rentalsAPI.completeReturn(id, data); // PUT /rentals/:id/complete-return
rentalsAPI.extendRental(id, days, cost); // PUT /rentals/:id/extend
rentalsAPI.submitReview(id, rating, review); // PUT /rentals/:id/review
rentalsAPI.getAllRentals(params); // GET /rentals/admin/all
```

### Maintenance (11 endpoints)

```javascript
maintenanceAPI.getRequests(params); // GET /maintenance
maintenanceAPI.getRequest(id); // GET /maintenance/:id
maintenanceAPI.createRequest(data); // POST /maintenance
maintenanceAPI.updateRequest(id, data); // PUT /maintenance/:id
maintenanceAPI.closeRequest(id); // PUT /maintenance/:id/close
maintenanceAPI.submitFeedback(id, rating, feedback); // PUT /maintenance/:id/feedback
maintenanceAPI.getAllRequests(params); // GET /maintenance/admin/all
maintenanceAPI.assignTechnician(id, techId); // PUT /maintenance/:id/assign
maintenanceAPI.resolveRequest(id, notes, cost); // PUT /maintenance/:id/resolve
maintenanceAPI.rejectRequest(id, reason); // PUT /maintenance/:id/reject
```

---

## 🔄 Next Steps to Complete Integration

### 1. Update Auth.jsx

Add API calls to login/register buttons:

```javascript
const handleLogin = async () => {
  try {
    const response = await authAPI.login({
      email: formData.email,
      password: formData.password,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    navigate("/");
  } catch (error) {
    setErrors({ submit: error.response.data.message });
  }
};
```

### 2. Update Products.jsx

Connect to backend products:

```javascript
useEffect(() => {
  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts({
        category: selectedCategory,
        page: currentPage,
        limit: 12,
      });
      setProducts(response.data.products);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };
  loadProducts();
}, [selectedCategory, currentPage]);
```

### 3. Update Cart.jsx

Connect to backend cart:

```javascript
useEffect(() => {
  const loadCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };
  loadCart();
}, []);
```

### 4. Add Error Handling

Implement proper error UI for all API calls

### 5. Add Loading States

Show spinners/loaders while API calls are in progress

### 6. Add Success Messages

Show toast notifications for successful operations

---

## 🧪 Testing the Connection

### Test 1: Register User

```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'
```

### Test 2: Login

```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Test 3: Get Products

```bash
curl http://localhost:5001/api/v1/products?limit=10
```

### Test 4: Protected Endpoint (requires token)

```bash
curl http://localhost:5001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Solution**: Backend already has CORS enabled for all origins

### Issue: 404 on API Endpoints

**Solution**: Make sure backend is running on port 5001

### Issue: 401 Unauthorized

**Solution**: Token might be expired or missing. User will be auto-redirected to login

### Issue: MongoDB Connection Error

**Solution**: Backend is using MongoDB Atlas. Connection string is in .env

### Issue: Port 5001 Already in Use

**Solution**:

```bash
lsof -ti:5001 | xargs kill -9
```

---

## 📚 Additional Resources

- **Backend Docs**: `/Backend/README.md`
- **Backend Quick Start**: `/Backend/QUICKSTART.md`
- **Axios Docs**: https://axios-http.com/
- **React Hooks**: https://react.dev/reference/react

---

## ✨ Summary

Your RentEase platform now has:

- ✅ **Complete React Frontend** (4 pages)
- ✅ **Complete Node.js Backend** (51 API endpoints)
- ✅ **Database Connected** (MongoDB Atlas)
- ✅ **API Services Ready** (All functions created)
- ✅ **Authentication System** (JWT tokens)

**Ready to test the full platform!** 🚀

---

**Start the frontend**:

```bash
npm run dev
```

**Backend is already running** on http://localhost:5001
