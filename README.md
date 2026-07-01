# RentEase - Furniture & Appliance Rental Platform

A modern, responsive frontend application for a premium furniture and appliance rental platform. Built with React.js, Vite, and Tailwind CSS.

## 🚀 Features

- **Product Browsing**: Browse furniture, appliances, electronics, and home decor
- **Advanced Filtering**: Filter by category, price range, and ratings
- **Product Details**: Comprehensive product information with multiple images
- **Flexible Rental Plans**: Choose from 1-month to 1-year rental periods
- **Shopping Cart**: Add items to cart with quantity management
- **User Authentication**: Login and registration with form validation
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Premium blue theme with smooth animations and transitions
- **Trust Signals**: Security badges and trust indicators throughout the app

## 📋 Tech Stack

- **Frontend Framework**: React.js 19.2.6
- **Build Tool**: Vite 8.0.12
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router DOM 6.20.0
- **Icons**: Lucide React 0.294.0
- **Form Handling**: Native HTML5 with custom hooks
- **State Management**: React Hooks (useState, useContext)
- **Build Automation**: PostCSS, Autoprefixer

## 📂 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx              # Reusable button component
│   │   └── ProductCard.jsx         # Product card component
│   ├── layout/
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── Footer.jsx              # Footer section
│   │   └── Layout.jsx              # Main layout wrapper
│   └── index.js                    # Component exports
├── pages/
│   ├── Home.jsx                    # Home page with hero, categories, products
│   ├── Products.jsx                # Product listing with filters
│   ├── ProductDetails.jsx          # Detailed product view
│   ├── Cart.jsx                    # Shopping cart
│   ├── Auth.jsx                    # Login/Register page
│   └── index.js                    # Page exports
├── constants/
│   └── index.js                    # App constants and configuration
├── utils/
│   └── index.js                    # Utility functions (formatting, validation)
├── hooks/
│   └── index.js                    # Custom React hooks
├── assets/
│   ├── images/                     # Image assets
│   └── icons/                      # Icon assets
├── App.jsx                         # Main app component with routing
├── index.css                       # Global styles with Tailwind
└── main.jsx                        # React DOM render
```

## 🎨 Design System

### Color Palette

- **Primary Blue**: `#0ea5e9` (Sky Blue)
- **Secondary**: `#4b5563` (Dark Gray)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)

### Typography

- **Font Family**: Inter, system fonts
- **Heading**: Bold (600-700 weight)
- **Body**: Regular (400 weight)
- **Sizes**: Responsive with mobile-first approach

### Components

#### Buttons

- **Primary**: Blue background, white text
- **Secondary**: Light gray background
- **Outline**: Blue border, blue text
- **Ghost**: Transparent, blue text on hover
- **Danger**: Red background for destructive actions

#### Cards

- Rounded corners (lg: 1rem)
- Soft shadows for depth
- Hover effects (scale, shadow increase)
- Smooth transitions

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/rentease.git
   cd rentease
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📱 Pages Overview

### Home Page (`/`)

- Hero section with call-to-action
- Category grid (4 main categories)
- Featured products carousel
- "Why RentEase?" benefits section
- Customer testimonials
- Final CTA section

### Products Page (`/products`)

- Product grid with 2-4 columns (responsive)
- Sidebar filters (desktop)
- Mobile filter modal
- Sort options
- Product cards with add to cart

### Product Details (`/product/:id`)

- Image gallery with thumbnails
- Product information
- Rental plan selector (1/3/6/12 months)
- Quantity selector
- Related products
- Specifications section
- Trust signals

### Shopping Cart (`/cart`)

- Cart items list
- Quantity controls
- Order summary
- Promo code input
- Checkout button
- Continue shopping link

### Login/Register (`/login`, `/register`)

- Email and password input
- Name field for registration
- Show/hide password toggle
- Social login buttons
- Form validation
- Remember me checkbox
- Forgot password link

## 🔧 Configuration

### Tailwind Configuration

Customize colors, spacing, and other styles in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { ... },
        secondary: { ... },
      },
    },
  },
}
```

### Constants

Update app configuration in `src/constants/index.js`:

- Navigation routes
- Categories
- API endpoints
- Pagination settings

## 📝 Available Scripts

| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start development server         |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint checks                |

## 🎯 Component Usage Examples

### Button Component

```jsx
import { Button } from "./components";

<Button variant="primary" size="lg">
  Click me
</Button>;
```

### ProductCard Component

```jsx
import { ProductCard } from "./components";

<ProductCard
  product={productData}
  onAddToCart={handleAddToCart}
  onWishlist={handleWishlist}
/>;
```

### Using Custom Hooks

```jsx
import { useForm, useLocalStorage } from "./hooks";

const { values, handleChange, handleSubmit } = useForm(
  { email: "", password: "" },
  handleFormSubmit,
);

const [cart, setCart] = useLocalStorage("cart", []);
```

## 🔒 Security

- Form validation for email and password
- No sensitive data in localStorage (use secure HTTP-only cookies in production)
- HTTPS required for production
- Environment variables for API endpoints

## 📊 Performance Optimization

- Code splitting with React Router
- Lazy loading images
- Optimized bundle with Vite
- CSS minification with Tailwind
- Image optimization recommendations

## 🌐 Responsive Design

- **Mobile**: 375px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large Desktop**: 1280px and up

Breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### GitHub Pages

Configure `vite.config.js` with base path and deploy dist/ folder

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to your branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Frontend Architecture: Senior Frontend Architect
- Design Inspiration: Rentomojo, Modern Rental Platforms

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Last Updated**: May 21, 2026
**Version**: 1.0.0
**Status**: Initial Release ✅
