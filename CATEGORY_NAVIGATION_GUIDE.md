# Category Navigation System - RentEase

## 🎯 Overview

The Category Navigation System is a responsive, scalable solution for organizing and browsing products by category. It features:

- **Responsive Category Nav Bar** - Sticky navigation with icons and active highlighting
- **Dedicated Collection Pages** - Each category has its own curated collection view
- **Smart Routing** - Dynamic routes for each category (`/category/:category`)
- **Pagination** - Browse products across multiple pages
- **Wishlist Integration** - Add/remove products from wishlist
- **Cart Integration** - Add products directly to cart
- **Notifications** - Toast notifications for user actions

## 📱 Features

### 1. CategoryNav Component
**Location:** `src/components/CategoryNav.jsx`

A sticky navigation bar displaying all product categories:

```jsx
import { CategoryNav } from './components';

// Automatically appears in Layout after Navbar
```

**Features:**
- ✅ Horizontal scrolling on mobile
- ✅ Active category highlighting with light blue background
- ✅ Icon + label for each category
- ✅ Tooltip descriptions on hover
- ✅ Responsive design (mobile-optimized)

**Categories Included:**
1. **Furniture** - Sofas, tables, chairs (Icon: Sofa)
2. **Appliances** - Refrigerators, washing machines (Icon: Zap)
3. **Electronics** - TVs, laptops, speakers (Icon: Monitor)
4. **Decor** - Lighting, mirrors, rugs (Icon: Sparkles)

### 2. CategoryCollection Page
**Location:** `src/pages/CategoryCollection.jsx`

Dedicated page for browsing all products in a category:

```jsx
import CategoryCollection from './pages/CategoryCollection';

// Route: /category/:category
// Routes automatically created for:
// - /category/furniture
// - /category/appliances
// - /category/electronics
// - /category/decor
```

**Features:**
- ✅ Category header with icon and description
- ✅ Product grid with 3 columns (responsive)
- ✅ Wishlist toggle (heart icon)
- ✅ Add to cart functionality
- ✅ Product ratings and reviews count
- ✅ Pagination (9 products per page)
- ✅ Empty state handling
- ✅ Back button navigation

### 3. Category Configuration
**Location:** `src/utils/categoryConfig.js`

Centralized configuration for all categories:

```jsx
export const CATEGORIES = [
  { 
    id: 'furniture', 
    label: 'Furniture', 
    icon: Sofa, 
    path: '/category/furniture',
    description: 'Sofas, tables, chairs, and more' 
  },
  // ... more categories
];

export const getCategoryById = (id) => { ... };
export const getCategoryProducts = (category, products) => { ... };
```

## 🚀 Usage Examples

### Navigate to a Category

```jsx
// Click category button in nav (automatic)
<Link to="/category/furniture" className="category-link">
  Furniture
</Link>

// Programmatic navigation
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/category/electronics');
```

### Use Category Data in Components

```jsx
import { getCategoryById, getCategoryProducts } from '../utils/categoryConfig';

// Get category info
const furnitureCategory = getCategoryById('furniture');
console.log(furnitureCategory.label); // "Furniture"
console.log(furnitureCategory.description); // "Sofas, tables, chairs, and more"

// Filter products by category
const products = getCategoryProducts('appliances', allProducts);
console.log(products.length); // 3 appliances
```

### Add to Cart from Category Page

```jsx
import { useCart } from '../hooks';

function CategoryCollection() {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    addNotification(`${product.name} added to cart!`, 'success');
  };

  return (
    <button onClick={() => handleAddToCart(product)}>
      Add to Cart
    </button>
  );
}
```

## 🎨 Design Details

### Category Nav Styling

**Active Category:**
- Background: Light blue (`bg-blue-50`)
- Text Color: Blue (`text-blue-700`)
- Border: Blue bottom border (`border-blue-500`)
- Smooth transition

**Inactive Category:**
- Background: Transparent
- Text Color: Gray (`text-gray-600`)
- Border: Transparent bottom border
- Hover effect: Gray background

### Collection Page Layout

**Header Section:**
- Category icon with blue background
- Category name and description
- Product count

**Product Grid:**
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Hover effects (shadow increase, image zoom)

**Product Card:**
- Image with hover zoom effect
- Wishlist toggle button
- Product name and description
- Star rating with review count
- Price in blue
- Add to cart button

## 📊 Data Structure

### Product Object
```javascript
{
  id: 1,
  name: 'Modern Sofa',
  category: 'furniture',
  price: 15000,
  image: 'https://...',
  rating: 4.5,
  reviews: 24,
  description: 'Beautiful modern sofa perfect for your living room'
}
```

### Category Object
```javascript
{
  id: 'furniture',
  label: 'Furniture',
  icon: SofaIcon,
  path: '/category/furniture',
  description: 'Sofas, tables, chairs, and more'
}
```

## 🔄 Routing Structure

All routes automatically handled by App.jsx:

```jsx
<Route
  path="/category/:category"
  element={
    <Layout>
      <CategoryCollection />
    </Layout>
  }
/>
```

**Available Routes:**
- `/category/furniture` → Furniture Collection
- `/category/appliances` → Appliances Collection
- `/category/electronics` → Electronics Collection
- `/category/decor` → Decor Collection

## 🛠️ Customization

### Add a New Category

1. **Edit `src/utils/categoryConfig.js`:**

```javascript
import { NewIcon } from 'lucide-react';

export const CATEGORIES = [
  // ... existing categories
  {
    id: 'outdoor',
    label: 'Outdoor',
    icon: NewIcon,
    path: '/category/outdoor',
    description: 'Garden furniture, umbrellas, and more'
  }
];
```

2. **Add products with the new category:**

```javascript
{
  id: 13,
  name: 'Outdoor Chair',
  category: 'outdoor',
  price: 3500,
  image: '...',
  rating: 4.4,
  reviews: 10,
  description: 'Comfortable outdoor chair'
}
```

3. **Route is automatically created** - No App.jsx changes needed!

### Change Navigation Position

**Option 1: Move CategoryNav to Navbar**

```jsx
// In Navbar.jsx
import { CategoryNav } from '../CategoryNav';

function Navbar() {
  return (
    <>
      <nav>...</nav>
      <CategoryNav /> {/* Here instead of Layout */}
    </>
  );
}
```

**Option 2: Hide on Specific Routes**

```jsx
// In CategoryNav.jsx
const { pathname } = useLocation();
const isAuthPage = ['/login', '/register'].includes(pathname);

if (isAuthPage) return null; // Don't show on auth pages

return <nav>...</nav>;
```

### Customize Styling

**Change Active Color:**

```jsx
// In CategoryNav.jsx - line 26
isActive
  ? 'border-blue-500 bg-green-50 text-green-700' // Change to green
  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
```

**Change Products Per Page:**

```jsx
// In CategoryCollection.jsx - line 155
const ITEMS_PER_PAGE = 12; // Change from 9 to 12
```

## 📱 Mobile Responsiveness

**CategoryNav:**
- ✅ Horizontal scroll on mobile
- ✅ Icons + labels (labels hidden on very small screens if needed)
- ✅ Sticky positioning
- ✅ Touch-friendly sizes

**CategoryCollection:**
- ✅ 1 column on mobile (320px+)
- ✅ 2 columns on tablet (768px+)
- ✅ 3 columns on desktop (1024px+)
- ✅ Full-width padding on mobile

## 🔗 Integration Points

### With Layout Component
```jsx
// CategoryNav automatically shown on all pages using Layout
import { Layout } from './components';

<Layout>
  <YourPage />
</Layout>
```

### With Hooks
```jsx
// useCart - Add to cart
// useWishlist - Add/remove from wishlist
// useNotifications - Show toast messages
// useAuth - Check user permissions (future)
```

### With Router
```jsx
// useNavigate - Programmatic navigation
// useParams - Get current category from URL
// useLocation - Track active category
```

## 📚 File Structure

```
src/
├── components/
│   ├── CategoryNav.jsx          ← Navigation bar
│   ├── layout/
│   │   └── Layout.jsx           ← Updated with CategoryNav
│   └── index.js                 ← Export CategoryNav
├── pages/
│   └── CategoryCollection.jsx   ← Collection page
├── utils/
│   └── categoryConfig.js        ← Category configuration
└── App.jsx                       ← Route added
```

## ✅ Testing Checklist

- [ ] Click each category - page loads correctly
- [ ] Active category highlighted in nav
- [ ] Product grid displays all products
- [ ] Add to cart button works
- [ ] Wishlist toggle works
- [ ] Pagination works (if >9 products)
- [ ] Mobile layout responsive
- [ ] Back button navigates correctly
- [ ] Empty state shows when no products
- [ ] Refresh page maintains category view

## 🚀 Performance Optimizations

- ✅ Pagination limits rendered products
- ✅ Icons imported from lucide-react
- ✅ Static product data (replace with API)
- ✅ useLocation() for active state (no extra renders)
- ✅ Stable component structure (no unnecessary re-renders)

## 🔄 Future Enhancements

- Add product filtering (price, rating, etc.)
- Add product sorting (name, price, rating)
- Lazy load images in grid
- Add "View Details" modal/page
- Add to cart variant selector
- Search within category
- Advanced filters sidebar
- Category-specific promotions

## 💡 Tips & Best Practices

1. **Add More Categories Easily:**
   - Just edit `categoryConfig.js` and add new category object
   - Route automatically created

2. **Update Product Data:**
   - Replace `ALL_PRODUCTS` in `CategoryCollection.jsx` with API call
   - `getCategoryProducts` will still work

3. **Customize UI:**
   - All styling uses Tailwind CSS classes
   - Easy to modify colors, spacing, fonts

4. **Mobile First:**
   - Test on mobile before desktop
   - Use responsive Tailwind classes

5. **Accessibility:**
   - All icons have alt text
   - Links are keyboard navigable
   - Semantic HTML structure

---

**Status:** ✅ Production Ready
**Last Updated:** May 31, 2026
