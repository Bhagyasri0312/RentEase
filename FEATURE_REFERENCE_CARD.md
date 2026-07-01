# 🎯 RentEase v2.0 - Feature Reference Card

## Quick Reference Guide

### 🔗 Import Paths

```javascript
// Contexts
import { WishlistContext, WishlistProvider } from './context/WishlistContext';
import { NotificationsContext, NotificationsProvider } from './context/NotificationsContext';
import { ReviewsContext, ReviewsProvider } from './context/ReviewsContext';

// Hooks
import { useWishlist } from './hooks/useWishlist';
import { useNotifications } from './hooks/useNotifications';
import { useReviews } from './hooks/useReviews';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Pagination } from './components/Pagination';
import { LazyLoadImage } from './components/LazyLoadImage';
import { NotificationBell } from './components/NotificationBell';

// Utilities
import { downloadInvoice, generateInvoice, printInvoice } from './utils/invoiceGenerator';
import { setSeoMeta, getSeoData, addStructuredData } from './utils/seoOptimization';
import { requestRentalExtension, scheduleReturn, calculateLateFees } from './utils/rentalManagement';
```

---

## 📱 Routes

| Route | Component | Usage |
|-------|-----------|-------|
| `/` | Home | Landing page |
| `/products` | Products | Browse all products |
| `/products/:id` | ProductDetails | Single product view |
| `/wishlist` | Wishlist | Saved items |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Payment page |
| `/rental-extension` | RentalExtension | Manage rentals |
| `/login` | Login | User login |
| `/register` | Register | New user signup |
| `/admin` | AdminDashboard | Admin panel |

---

## 🎨 Component Usage

### LoadingSkeleton
```javascript
<LoadingSkeleton variant="product-grid" count={8} />
// Variants: card, text, avatar, product-grid
```

### Pagination
```javascript
<Pagination 
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
  maxVisible={5}
/>
```

### LazyLoadImage
```javascript
<LazyLoadImage 
  src="url"
  alt="Product"
  className="w-full h-48"
  placeholder="bg-gray-200"
/>
```

### NotificationBell
```javascript
<NotificationBell />
// Place in Navbar for global access
```

### ErrorBoundary
```javascript
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
// Already wraps entire App in App.jsx
```

---

## 🎯 Hook Usage

### useWishlist
```javascript
const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount } = useWishlist();

// Add to wishlist
addToWishlist(product);

// Check if in wishlist
if (isInWishlist(productId)) { ... }

// Get count
const count = getWishlistCount();

// Remove
removeFromWishlist(productId);
```

### useNotifications
```javascript
const { addNotification, removeNotification, clearAll, notifications } = useNotifications();

// Add notification (auto-removes after 3 seconds)
addNotification('Success!', 'success', 3000);

// Types: 'success', 'error', 'warning', 'info'
addNotification('Error occurred', 'error');

// Manual remove
removeNotification(id);

// Clear all
clearAll();
```

### useReviews
```javascript
const { 
  addReview, 
  getProductReviews, 
  getAverageRating, 
  markHelpful, 
  deleteReview 
} = useReviews();

// Add review
addReview(productId, {
  rating: 5,
  title: 'Great product!',
  comment: 'Excellent quality',
  author: 'John'
});

// Get reviews for product
const reviews = getProductReviews(productId);

// Get average rating
const avg = getAverageRating(productId); // 0-5

// Mark helpful
markHelpful(reviewId);

// Delete
deleteReview(reviewId);
```

---

## 📊 Utility Functions

### Invoice Generator
```javascript
import { 
  generateInvoice, 
  downloadInvoice, 
  printInvoice,
  formatInvoiceAsHTML 
} from './utils/invoiceGenerator';

// Generate
const invoice = generateInvoice({
  customerName: 'John',
  items: [{ name: 'Sofa', price: 5000, quantity: 1 }],
  deposit: 1000,
  email: 'john@example.com'
});

// Download
downloadInvoice(invoice);

// Print
printInvoice(invoice);

// Get HTML
const html = formatInvoiceAsHTML(invoice);
```

### SEO Optimization
```javascript
import { 
  setSeoMeta, 
  getSeoData, 
  addStructuredData,
  generateSchemaMarkup 
} from './utils/seoOptimization';

// Set meta tags
const seo = getSeoData('productDetails', {
  productName: 'Sofa',
  price: 5000,
  category: 'Sofas'
});
setSeoMeta(seo.title, seo.description, seo.keywords);

// Add schema markup
const schema = generateSchemaMarkup('product', productData);
addStructuredData(schema);

// Set robots
generateMetaRobots(true, true); // index, follow
```

### Rental Management
```javascript
import { 
  requestRentalExtension,
  calculateExtensionCost,
  scheduleReturn,
  getReturnTimeSlots,
  calculateLateFees,
  generateReturnReport 
} from './utils/rentalManagement';

// Extend rental
const extension = requestRentalExtension(
  rentalId, 
  currentEndDate, 
  3 // months
);

// Calculate cost
const cost = calculateExtensionCost(monthlyRate, 3);

// Schedule return
const scheduled = scheduleReturn(rentalId, returnDate, 'pickup');

// Get time slots
const slots = getReturnTimeSlots();

// Calculate late fees
const fees = calculateLateFees(dueDate, returnDate, dailyRate);

// Generate report
const report = generateReturnReport(rental);
```

---

## 🔧 Integration Examples

### Add Wishlist Button to Product Card
```javascript
import { useWishlist } from '../hooks/useWishlist';
import { Heart } from 'lucide-react';

function ProductCard({ product }) {
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const isFav = isInWishlist(product.id);

  return (
    <button
      onClick={() => isFav 
        ? removeFromWishlist(product.id) 
        : addToWishlist(product)
      }
      className={isFav ? 'text-red-500' : 'text-gray-400'}
    >
      <Heart fill={isFav ? 'currentColor' : 'none'} />
    </button>
  );
}
```

### Add Review Form to Product Page
```javascript
import ProductReviews from './pages/Reviews';
import { useParams } from 'react-router-dom';

function ProductPage() {
  const { id } = useParams();
  
  return (
    <div>
      {/* Product info */}
      <ProductReviews productId={id} />
    </div>
  );
}
```

### Show Notification on Action
```javascript
import { useNotifications } from '../hooks/useNotifications';

function CheckoutButton() {
  const { addNotification } = useNotifications();

  const handleCheckout = async () => {
    try {
      await checkout();
      addNotification('Order placed!', 'success');
    } catch (err) {
      addNotification(`Error: ${err.message}`, 'error');
    }
  };

  return <button onClick={handleCheckout}>Checkout</button>;
}
```

### Use Pagination
```javascript
import { useState } from 'react';
import { Pagination } from '../components';

function ProductsList({ allProducts }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const products = allProducts.slice(start, end);
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
```

### Load Images Lazily
```javascript
import { LazyLoadImage } from '../components';

function Gallery() {
  return (
    <div className="grid gap-4">
      {images.map(img => (
        <LazyLoadImage
          key={img.id}
          src={img.url}
          alt={img.title}
          className="w-full h-48 object-cover rounded"
          placeholder="bg-gray-200"
        />
      ))}
    </div>
  );
}
```

### Show Skeletons While Loading
```javascript
import { LoadingSkeleton } from '../components';
import { useState, useEffect } from 'react';

function ProductsList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSkeleton variant="product-grid" count={8} />;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

---

## 📋 Checklists

### Before Deployment
- [ ] Hard refresh browser
- [ ] Check console (F12) - no errors
- [ ] Test all routes
- [ ] Test wishlist persistence
- [ ] Test notifications
- [ ] Test reviews form
- [ ] Test rental extension
- [ ] Generate sample invoice
- [ ] Check SEO tags (DevTools)
- [ ] Test on mobile
- [ ] Test error boundary

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check user reviews
- [ ] Verify notifications sending
- [ ] Check wishlist functionality
- [ ] Monitor performance
- [ ] Update SEO if needed
- [ ] Gather user feedback

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Wishlist not persisting | Check localStorage permissions |
| Notifications not showing | Verify NotificationsProvider in main.jsx |
| Reviews not appearing | Hard refresh, check ReviewsProvider |
| Lazy images not loading | Check image URLs, network tab |
| Error boundary not catching | Ensure wrapped correctly in App.jsx |
| Routes not working | Check imports in App.jsx |
| Styles not applying | Clear cache, verify Tailwind config |

---

## 📞 Support Resources

- **Advanced Features Guide**: `ADVANCED_FEATURES_GUIDE.md`
- **Quick Start**: `PRODUCTION_FEATURES_QUICKSTART.md`
- **Complete Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Checklist**: `FEATURES_COMPLETE_CHECKLIST.md`
- **Inline Code Comments**: All source files

---

## ✅ Version Information

- **Version**: 2.0 Advanced Features
- **Status**: Production Ready
- **Last Updated**: May 31, 2026
- **Quality**: Enterprise Grade

---

**Ready to use all 12 advanced features in your RentEase application!** 🚀

