# 🧪 Cart & Checkout Testing Guide

## Quick Start Test

### 1. Test Empty Cart

```
URL: http://localhost:5174/cart
Expected: Empty state with "Your Cart is Empty" message and "Continue Shopping" button
```

### 2. Mock Add to Cart (for testing)

Open browser console and run:

```javascript
// Get cart context (mock)
const mockProduct = {
  id: "123",
  name: "Modern Sofa",
  price: 5000,
  image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
  category: "Furniture",
};

// This would work if addToCart was called from Products.jsx
// For now, we need to update Products.jsx with the button
```

### 3. Test Cart Page Features

Once items are added:

**✅ Test Quantity Controls**

- Click + button → quantity increases
- Click - button → quantity decreases
- Prices recalculate in real-time

**✅ Test Tenure Selection**

- Change dropdown from 1 month to 3 months
- Verify totals update
- Try 6, 12, 24 month options

**✅ Test Delivery Details**

- Click "Set Delivery Details" button
- Button text changes to "Hide"
- Date picker appears
- Expands/collapses smoothly

**✅ Test Remove Item**

- Click trash icon
- Item disappears
- Total recalculates
- If last item: shows empty state

**✅ Test Order Summary (Sidebar)**

- Subtotal = Monthly Rent × Tenure
- Security Deposit = Monthly Rent × 1
- Delivery Fee = ₹100 per item
- Total = Subtotal + Deposit + Delivery

### 4. Test Checkout - Step 1 (Delivery)

```
URL: http://localhost:5174/checkout

Form Fields (All Required):
- Full Name: "John Doe"
- Email: "john@example.com"
- Phone: "9876543210"
- Address: "123 Main Street"
- City: "Mumbai"
- State: "Maharashtra"
- Pincode: "400001"

✅ Submit without data → Shows error messages
✅ Fill all fields → "Continue to Payment" enabled
✅ Validation in real-time as you type
```

### 5. Test Checkout - Step 2 (Payment)

```
Expected: Radio buttons for:
- Credit/Debit Card (default selected)
- UPI Payment
- Net Banking

✅ Click each option → Highlight changes to blue
✅ Back button → Returns to Step 1
✅ Continue button → Goes to Step 3
```

### 6. Test Checkout - Step 3 (Review)

```
Expected: Shows
- Your entered address
- Order items with quantities
- Payment method selected
- Back button
- "Complete Order" button

✅ Back → Returns to Step 2
✅ Complete Order → Shows loading spinner
✅ After 2 seconds → Shows confirmation
```

### 7. Test Checkout - Step 4 (Confirmation)

```
Expected:
- Success checkmark icon (green)
- "Order Confirmed!" heading
- Order ID: ORD-XXXXXX (unique)
- Total amount displayed
- Delivery city shown
- "Continue Shopping" button

✅ Click "Continue Shopping" → Redirects to /products
✅ Cart should be empty now (cleared)
```

## Progress Indicator Testing

```
Step 1: ⓵ → empty circle
Step 2: ⓵ → ⓶ (progress bar filled between)
Step 3: ⓵ → ⓶ → ⓷ (all progress bars filled)
Step 4: Confirmation page (steps hidden)
```

## Responsive Design Testing

### Mobile (iPhone size - 375px)

```
Safari DevTools → Responsive Design Mode
Size: 375 × 667

Expected:
- Single column layout
- Full-width buttons
- Stacked form fields
- Readable text
- Touch-friendly buttons (48px min height)
```

### Tablet (iPad - 768px)

```
Size: 768 × 1024

Expected:
- 2 columns where possible
- Sidebar visible
- Grid layouts
```

### Desktop (1440px+)

```
Size: 1440 × 900

Expected:
- 3 column checkout (form + summary + sidebar)
- Sticky sidebars
- Full form layouts
```

## localStorage Testing

### Test Persistence

1. Go to `/products` and add items to cart (once we update Products.jsx)
2. Go to `/cart` - verify items show
3. Open DevTools → Application → localStorage
4. Find `rentease_cart` key
5. Refresh page - items should still be there
6. Close and reopen browser - items persist
7. Clear localStorage - cart becomes empty

```javascript
// In DevTools Console
JSON.parse(localStorage.getItem("rentease_cart"));
// Shows array of cart items
```

## Calculation Testing

### Example Cart

```
Item 1: Sofa @ ₹5000/month × Qty 1 × Tenure 3 months
Item 2: Chair @ ₹2000/month × Qty 2 × Tenure 6 months

Calculation:
Item 1: 5000 × 1 × 3 = ₹15,000
Item 2: 2000 × 2 × 6 = ₹24,000
Subtotal: 15,000 + 24,000 = ₹39,000

Security Deposit:
Item 1 Monthly: 5000 × 1 = ₹5,000
Item 2 Monthly: 2000 × 2 = ₹4,000
Total Deposit: 5,000 + 4,000 = ₹9,000

Delivery:
Item 1: 1 × ₹100 = ₹100
Item 2: 2 × ₹100 = ₹200
Total Delivery: ₹300

Total: 39,000 + 9,000 + 300 = ₹48,300
```

## Error Testing

### Form Validation

1. **Empty fields** → All show red border with error message
2. **Invalid email** → "Invalid email" message
3. **Short phone** → "Please enter valid 10-digit number"
4. **No address** → "Address is required"
5. **As you type** → Errors clear when field is edited

### Empty Cart Handling

- Go to `/cart` with empty cart → Shows empty state
- Go to `/checkout` with empty cart → Shows "Empty cart" message with link

## UI/UX Testing

### Colors (Modern Blue Theme)

- Primary buttons: Gradient blue-600 to indigo-600
- Hover state: Darker gradient
- Active state: Scale down effect
- Error fields: Red border with red-50 background
- Success: Green checkmark

### Icons (Lucide React)

- Shopping cart (empty state)
- Trash (remove item)
- Plus/Minus (quantity)
- Calendar (delivery)
- Map pin (address)
- Phone, Mail, User icons
- Checkmark (confirmation)

### Animations

- Button scale on hover (105%)
- Button scale on click (95%)
- Loading spinner (rotating)
- Smooth transitions on all interactive elements

## Performance Testing

### Check Network Tab (DevTools)

1. Go to `/cart`
2. Open DevTools → Network
3. Refresh
4. Check:
   - All assets loaded
   - No 404 errors
   - Bundle size reasonable

### Check Console

1. No JavaScript errors
2. No console warnings
3. localStorage operations working

---

## After Products.jsx Update

Once you add "Add to Cart" button to Products page:

```jsx
// In ProductDetails.jsx or ProductCard.jsx
import { useCart } from "../hooks/useCart";

function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [tenure, setTenure] = useState(3);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, tenure, quantity);
    alert("Added to cart!");
  };

  return (
    <div>
      <select
        value={tenure}
        onChange={(e) => setTenure(parseInt(e.target.value))}
      >
        <option value={1}>1 Month</option>
        <option value={3}>3 Months</option>
        <option value={6}>6 Months</option>
        <option value={12}>12 Months</option>
      </select>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

---

## ✅ Complete Test Checklist

- [ ] Empty cart displays correctly
- [ ] Quantity controls work
- [ ] Tenure selector works
- [ ] Price calculations are correct
- [ ] Remove item works
- [ ] Delivery details expand/collapse
- [ ] Checkout Step 1 validates form
- [ ] Checkout Step 2 shows payment methods
- [ ] Checkout Step 3 shows review
- [ ] Checkout Step 4 confirms order
- [ ] Progress indicator updates
- [ ] Mobile responsive layout
- [ ] Tablet responsive layout
- [ ] Desktop layout looks good
- [ ] localStorage persists cart
- [ ] localStorage key named correctly
- [ ] No console errors
- [ ] No 404 errors
- [ ] All icons display
- [ ] Colors match blue theme
- [ ] Hover/active states work
- [ ] Form validation shows errors
- [ ] Back buttons work correctly
- [ ] Order ID is unique each time

---

**Happy Testing! 🎉**
