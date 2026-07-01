# RentEase Backend API Documentation

## Overview

RentEase is a furniture and appliance rental platform backend API built with **Node.js**, **Express.js**, and **MongoDB**. It provides comprehensive REST APIs for managing product rentals, user accounts, orders, and maintenance requests.

## Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB 7.0.0 (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator
- **HTTP Logging**: morgan
- **CORS**: cors 2.8.5
- **Environment**: dotenv for configuration

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── jwt.js               # JWT token management
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product catalog
│   │   ├── Cart.js              # Shopping cart
│   │   ├── Order.js             # Rental orders
│   │   ├── Rental.js            # Active rentals
│   │   └── MaintenanceRequest.js # Support tickets
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── productController.js    # Product management
│   │   ├── cartController.js       # Cart operations
│   │   ├── orderController.js      # Order processing
│   │   ├── rentalController.js     # Rental management
│   │   └── maintenanceController.js # Support tickets
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── productRoutes.js        # Product endpoints
│   │   ├── cartRoutes.js           # Cart endpoints
│   │   ├── orderRoutes.js          # Order endpoints
│   │   ├── rentalRoutes.js         # Rental endpoints
│   │   └── maintenanceRoutes.js    # Maintenance endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT authentication
│   │   ├── validationMiddleware.js # Input validation
│   │   └── errorMiddleware.js      # Error handling
│   ├── utils/                   # Helper utilities
│   └── index.js                 # Main server file
├── package.json                 # Project manifest
├── .env.example                 # Environment template
└── README.md                    # This file
```

## Installation & Setup

### Prerequisites

- Node.js v14+ installed
- MongoDB running locally or MongoDB Atlas account
- npm or yarn package manager

### Steps

1. **Install dependencies**:

```bash
cd Backend
npm install
```

2. **Setup environment variables**:

```bash
cp .env.example .env
```

Edit `.env` and configure:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key for JWT
- `PORT`: Server port (default: 5000)

3. **Start the server**:

**Development** (with auto-reload):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

4. **Verify it's running**:

```
GET http://localhost:5000/api/health
```

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint           | Description               | Auth       |
| ------ | ------------------ | ------------------------- | ---------- |
| POST   | `/register`        | Register new user         | ✓ Public   |
| POST   | `/login`           | User login                | ✓ Public   |
| GET    | `/me`              | Get current user          | ✓ Required |
| PUT    | `/profile`         | Update profile            | ✓ Required |
| PUT    | `/change-password` | Change password           | ✓ Required |
| POST   | `/logout`          | Logout user               | ✓ Required |
| POST   | `/forgot-password` | Request password reset    | ✓ Public   |
| POST   | `/reset-password`  | Reset password with token | ✓ Public   |
| POST   | `/verify-email`    | Verify email address      | ✓ Public   |

### Products (`/api/v1/products`)

| Method | Endpoint              | Description           | Auth       |
| ------ | --------------------- | --------------------- | ---------- |
| GET    | `/`                   | Get all products      | ✓ Public   |
| GET    | `/featured`           | Get featured products | ✓ Public   |
| GET    | `/search`             | Search products       | ✓ Public   |
| GET    | `/category/:category` | Get by category       | ✓ Public   |
| GET    | `/:id`                | Get single product    | ✓ Public   |
| PUT    | `/:id/rating`         | Submit product rating | ✓ Required |
| POST   | `/`                   | Create product        | ✓ Admin    |
| PUT    | `/:id`                | Update product        | ✓ Admin    |
| DELETE | `/:id`                | Delete product        | ✓ Admin    |

### Cart (`/api/v1/cart`)

| Method | Endpoint   | Description       | Auth       |
| ------ | ---------- | ----------------- | ---------- |
| GET    | `/`        | Get user's cart   | ✓ Required |
| POST   | `/add`     | Add item to cart  | ✓ Required |
| PUT    | `/:itemId` | Update cart item  | ✓ Required |
| DELETE | `/:itemId` | Remove from cart  | ✓ Required |
| DELETE | `/`        | Clear entire cart | ✓ Required |
| POST   | `/coupon`  | Apply coupon code | ✓ Required |

### Orders (`/api/v1/orders`)

| Method | Endpoint       | Description           | Auth       |
| ------ | -------------- | --------------------- | ---------- |
| GET    | `/`            | Get user's orders     | ✓ Required |
| POST   | `/`            | Create new order      | ✓ Required |
| GET    | `/:id`         | Get single order      | ✓ Required |
| PUT    | `/:id/cancel`  | Cancel order          | ✓ Required |
| GET    | `/admin/all`   | Get all orders        | ✓ Admin    |
| PUT    | `/:id/status`  | Update order status   | ✓ Admin    |
| PUT    | `/:id/payment` | Update payment status | ✓ Admin    |

### Rentals (`/api/v1/rentals`)

| Method | Endpoint               | Description           | Auth       |
| ------ | ---------------------- | --------------------- | ---------- |
| GET    | `/`                    | Get user's rentals    | ✓ Required |
| GET    | `/:id`                 | Get single rental     | ✓ Required |
| GET    | `/overdue`             | Check overdue rentals | ✓ Required |
| POST   | `/start/:orderId`      | Start rental          | ✓ Required |
| PUT    | `/:id/request-return`  | Request return        | ✓ Required |
| PUT    | `/:id/extend`          | Extend rental         | ✓ Required |
| PUT    | `/:id/review`          | Submit review         | ✓ Required |
| GET    | `/admin/all`           | Get all rentals       | ✓ Admin    |
| PUT    | `/:id/complete-return` | Complete return       | ✓ Admin    |

### Maintenance (`/api/v1/maintenance`)

| Method | Endpoint        | Description         | Auth       |
| ------ | --------------- | ------------------- | ---------- |
| GET    | `/`             | Get user's requests | ✓ Required |
| POST   | `/`             | Create request      | ✓ Required |
| GET    | `/:id`          | Get single request  | ✓ Required |
| PUT    | `/:id`          | Update request      | ✓ Required |
| PUT    | `/:id/close`    | Close request       | ✓ Required |
| PUT    | `/:id/feedback` | Submit feedback     | ✓ Required |
| GET    | `/admin/all`    | Get all requests    | ✓ Admin    |
| PUT    | `/:id/assign`   | Assign technician   | ✓ Admin    |
| PUT    | `/:id/resolve`  | Resolve request     | ✓ Admin    |
| PUT    | `/:id/reject`   | Reject request      | ✓ Admin    |

## Database Models

### User

```javascript
{
  name: String,
  email: String (unique),
  phone: String (10 digits, unique),
  password: String (hashed),
  role: 'user' | 'admin',
  address: { street, city, state, pincode, country },
  isVerified: Boolean,
  isActive: Boolean,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product

```javascript
{
  name: String,
  description: String,
  category: 'Furniture' | 'Appliances' | 'Electronics' | 'Decor',
  monthlyRent: Number,
  securityDeposit: Number,
  images: [{ url, public_id }],
  specifications: [{ key, value }],
  inStock: Boolean,
  availableQuantity: Number,
  rentalDuration: [{ period, discount }],
  rating: Number (0-5),
  featured: Boolean
}
```

### Cart

```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    rentalStartDate: Date,
    rentalEndDate: Date,
    rentalDuration: String,
    rentWithDiscount: Number,
    totalPrice: Number
  }],
  totalItems: Number,
  totalRent: Number,
  totalDeposit: Number,
  totalAmount: Number
}
```

### Order

```javascript
{
  user: ObjectId,
  orderNumber: String (unique),
  items: [...],
  shippingAddress: { street, city, state, pincode },
  paymentInfo: { method, transactionId, status },
  pricing: { subtotalRent, totalDeposit, totalAmount },
  orderStatus: String,
  paymentStatus: String
}
```

### Rental

```javascript
{
  order: ObjectId,
  user: ObjectId,
  rentalNumber: String (unique),
  startDate: Date,
  endDate: Date,
  status: 'Active' | 'Completed' | 'Cancelled',
  deliveryDetails: {...},
  condition: { initialCondition, currentCondition, returnCondition },
  payment: { rentRemaining, depositStatus },
  extension: { isExtended, newEndDate, extensionDays },
  ratings: { rating, review }
}
```

### MaintenanceRequest

```javascript
{
  user: ObjectId,
  rental: ObjectId,
  product: ObjectId,
  ticketNumber: String (unique),
  title: String,
  description: String,
  category: String,
  priority: 'Low' | 'Medium' | 'High' | 'Urgent',
  status: 'Open' | 'InProgress' | 'Resolved' | 'Closed',
  assignedTo: ObjectId,
  timeline: [{ action, description, performedBy, timestamp }]
}
```

## Authentication

### JWT Flow

1. **Register/Login**: User receives JWT token
2. **Requests**: Include token in `Authorization` header:
   ```
   Authorization: Bearer <token>
   ```
3. **Token Verification**: Middleware validates token on protected routes
4. **Expiry**: Tokens expire after 7 days (configurable)

### User Roles

- **user**: Regular users (default)
- **admin**: Administrative access

Role-based access is enforced via middleware on protected routes.

## Validation & Error Handling

### Input Validation

All inputs are validated using `express-validator`:

- Email format validation
- Phone number validation (10 digits)
- Password strength requirements (8+ chars)
- Mongoose schema validation

### Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Scripts

```bash
# Development with auto-reload
npm run dev

# Production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Deployment

### Environment Variables

Set these in production:

- `NODE_ENV=production`
- `MONGODB_URI`: Atlas connection string
- `JWT_SECRET`: Strong random secret
- Stripe, Cloudinary, AWS keys (if using)

### Recommended Platforms

- **Heroku**: `npm start` runs on assigned PORT
- **AWS EC2**: Node.js runtime + PM2 process manager
- **DigitalOcean**: Simple droplet with Node.js
- **Railway**: Deploy from GitHub

### Database

Use MongoDB Atlas for production:

1. Create cluster on Atlas
2. Generate connection string
3. Set `MONGODB_URI` in environment

## Security Best Practices

✅ **Implemented**:

- JWT authentication with token expiry
- Password hashing with bcryptjs (10 salt rounds)
- CORS configured
- Input validation on all endpoints
- Error messages don't expose sensitive info
- Role-based access control

✅ **Recommended Additional**:

- Rate limiting (express-rate-limit)
- HTTPS only in production
- Helmet.js for security headers
- MongoDB injection prevention
- Sensitive data logging disabled in production

## API Testing

### Using Postman

1. Import the API endpoints
2. Set `Authorization` header with Bearer token
3. Test each endpoint with sample data

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","phone":"1234567890","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Products
curl -X GET "http://localhost:5000/api/v1/products?category=Furniture&limit=10"
```

## Troubleshooting

### MongoDB Connection Failed

- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running: `mongod`
- For Atlas: Verify IP whitelist

### JWT Token Errors

- Token may be expired
- Check `JWT_SECRET` is consistent
- Include `Bearer` prefix in Authorization header

### CORS Errors

- Verify `FRONTEND_URL` in `.env`
- Check CORS middleware is enabled in index.js

## Future Enhancements

- [ ] Email notifications (nodemailer)
- [ ] Payment gateway integration (Stripe)
- [ ] File uploads (Cloudinary/AWS S3)
- [ ] Real-time notifications (Socket.io)
- [ ] Advanced search with Elasticsearch
- [ ] API rate limiting
- [ ] Swagger/OpenAPI documentation
- [ ] GraphQL support
- [ ] Automated testing (Jest)
- [ ] CI/CD pipeline

## Support

For issues or questions:

1. Check API documentation above
2. Review error messages and logs
3. Check MongoDB connection
4. Verify environment variables

## License

MIT License - feel free to use this project as a template!

---

**Happy coding! 🚀**
