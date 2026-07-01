# RentEase Backend - Quick Start Guide

## ⚡ Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd Backend
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rentease
JWT_SECRET=your_super_secret_key_here
```

### Step 3: Start MongoDB

```bash
# If MongoDB is installed locally
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI with your Atlas connection string in .env
```

### Step 4: Run Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### Step 5: Verify It Works

```bash
curl http://localhost:5000/api/health
```

You should see:

```json
{ "success": true, "message": "Server is running" }
```

---

## 📚 API Quick Reference

### Register User

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Use Token in Requests

```bash
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Get All Products

```bash
GET /api/v1/products?category=Furniture&limit=10&page=1
```

### Add to Cart

```bash
POST /api/v1/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2,
  "rentalStartDate": "2024-01-15",
  "rentalEndDate": "2024-02-15",
  "rentalDuration": "1-month"
}
```

### Create Order

```bash
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Delhi",
    "state": "DL",
    "pincode": "110001",
    "country": "India"
  },
  "paymentInfo": {
    "method": "Credit Card"
  },
  "rentalInfo": {
    "expectedDelivery": "2024-01-16",
    "expectedReturn": "2024-02-16"
  }
}
```

---

## 🗂️ Project Structure

```
Backend/
├── src/
│   ├── config/           → Database & JWT config
│   ├── models/           → MongoDB schemas (6 models)
│   ├── controllers/      → Business logic (6 controllers)
│   ├── routes/           → API endpoints (6 route files)
│   ├── middleware/       → Auth, validation, error handling
│   ├── utils/            → Helper functions
│   └── index.js          → Main server
├── package.json          → Dependencies
├── .env.example          → Configuration template
└── README.md             → Full documentation
```

---

## 🔑 Key Features

✅ **User Management**

- Register, Login, Password Reset
- Profile Updates
- Email Verification
- Role-based Access (User/Admin)

✅ **Product Catalog**

- Browse Products
- Search & Filter
- Product Ratings
- Product Management (Admin)

✅ **Shopping Cart**

- Add/Remove Items
- Update Quantities
- Calculate Totals
- Apply Coupons

✅ **Orders**

- Create Orders from Cart
- Track Order Status
- Cancel Orders
- Payment Status

✅ **Rentals**

- Start Rental from Order
- Track Rental Status
- Extend Rental
- Request Return
- Submit Reviews

✅ **Maintenance**

- Create Support Tickets
- Track Maintenance Status
- Assign Technicians (Admin)
- Resolve Issues
- Submit Feedback

---

## 📊 API Endpoints Summary

| Module      | Count  | Key Routes                                |
| ----------- | ------ | ----------------------------------------- |
| Auth        | 9      | register, login, profile, change-password |
| Products    | 9      | get all, search, category, ratings        |
| Cart        | 6      | get, add, update, remove, clear           |
| Orders      | 7      | create, get, cancel, admin status         |
| Rentals     | 9      | get, start, extend, review, return        |
| Maintenance | 11     | create, assign, resolve, reject, feedback |
| **Total**   | **51** | **Full REST API**                         |

---

## 🧪 Testing with Postman

1. **Import Collection**: Create new collection named "RentEase"

2. **Setup Variables**: In collection variables
   - `base_url` = http://localhost:5000/api/v1
   - `token` = (will be set after login)

3. **Auth Requests**:
   - Register: `POST {{base_url}}/auth/register`
   - Login: `POST {{base_url}}/auth/login`
   - Copy token from response

4. **Protected Requests**: Add header
   - Key: `Authorization`
   - Value: `Bearer {{token}}`

---

## 🐛 Common Issues & Solutions

**MongoDB Connection Failed**

- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- Verify credentials if using Atlas

**Port Already in Use**

- Change PORT in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill -9`

**Token Invalid**

- Tokens expire after 7 days
- Login again to get new token
- Check `JWT_SECRET` is consistent

**CORS Errors**

- Set `FRONTEND_URL` in `.env`
- Ensure CORS middleware is enabled

---

## 📦 Dependencies

### Core

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing

### Utilities

- `express-validator` - Input validation
- `cors` - CORS support
- `morgan` - HTTP logging
- `dotenv` - Environment config

### Dev

- `nodemon` - Auto-reload
- `eslint` - Code linting
- `jest` - Testing

---

## 🚀 Next Steps

1. **Create Admin User**
   - Manually set role to 'admin' in MongoDB

2. **Add Products**
   - Use POST `/api/v1/products` (Admin only)

3. **Enable Payment Gateway**
   - Add Stripe keys to `.env`
   - Implement payment processing

4. **File Uploads**
   - Integrate Cloudinary/AWS S3
   - Update product/user controllers

5. **Email Notifications**
   - Add nodemailer
   - Send confirmation emails

6. **Deploy**
   - Push to GitHub
   - Deploy to Heroku/Railway/AWS

---

## 📚 Documentation

Full documentation available in `README.md`:

- Complete API reference
- Database models
- Authentication flow
- Error handling
- Security best practices
- Deployment guide

---

## 💡 Pro Tips

- Use environment variables for sensitive data
- Test with Postman before frontend integration
- Keep MongoDB connection string secure
- Use strong JWT secret (min 32 characters)
- Enable HTTPS in production
- Set up rate limiting for production

---

## 🎉 You're All Set!

Your RentEase backend is ready. Start the server and begin building! 🚀

Questions? Check the full README.md for comprehensive documentation.
