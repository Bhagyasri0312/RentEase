# React + Vite Debugging Guide: White Screen of Death

## 🔍 Issue Identified & Fixed

**Problem**: Empty AdminDashboard.jsx file causing import error → Blank white screen
**Solution**: Recreated AdminDashboard.jsx with complete component implementation

---

## ✅ Step-by-Step Debugging Process

### Step 1: Check Browser Console (MOST IMPORTANT)

```
1. Open your browser
2. Press F12 or Right-click → Inspect
3. Go to Console tab
4. Look for red error messages
5. Screenshot or copy the error
```

**Most Common Console Errors**:

```
❌ "Cannot find module 'xyz'"
→ File doesn't exist or wrong path

❌ "Failed to resolve 'xyz'"
→ Import statement is incorrect

❌ "Unexpected token"
→ Syntax error in JSX

❌ "useAdmin is not defined"
→ Hook not imported or component not wrapped with Provider

❌ "Router must be at root"
→ BrowserRouter not wrapping the whole app
```

### Step 2: Check main.jsx Setup

**Requirements**:

- ✅ React strict mode enabled
- ✅ Root element exists in HTML
- ✅ CSS imported FIRST
- ✅ Context providers wrap App
- ✅ App is inside providers

**Correct Structure**:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // CSS FIRST!
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
```

### Step 3: Check App.jsx Router Setup

**Requirements**:

- ✅ BrowserRouter wraps all Routes
- ✅ All Route imports exist
- ✅ No circular imports
- ✅ Path syntax correct
- ✅ Element prop uses JSX

**Common Mistakes**:

```jsx
❌ WRONG: <Route path="/admin" element={AdminDashboard} />
✅ RIGHT: <Route path="/admin" element={<AdminDashboard />} />

❌ WRONG: <Route path="/products/:id" element={<Products />} />
✅ RIGHT: <Route path="/products/:id" element={<ProductDetails />} />

❌ WRONG: No BrowserRouter
✅ RIGHT: Wrap Routes in <Router>
```

### Step 4: Verify All Imports

**File: src/App.jsx**

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import { Home, Products, ProductDetails, Cart } from "./pages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
```

**Each imported file must:**

1. ✅ Exist in the correct path
2. ✅ Have default export
3. ✅ Be a valid React component
4. ✅ Not be empty

### Step 5: Test Import Chain

Run in browser console:

```javascript
// Open DevTools Console and test each import
import("./src/pages/AdminDashboard.jsx")
  .then((m) => console.log("AdminDashboard loaded:", m))
  .catch((e) => console.error("Error:", e));
```

---

## 🛠️ How to Fix White Screen

### Method 1: Eliminate Routes

**Temporary Debugging** - Comment out problematic routes:

```jsx
// Only keep login route temporarily
<Route path="/login" element={<Login />} />
<Route path="/" element={<div>Home placeholder</div>} />
```

### Method 2: Test Each Component

Create a test file to verify each component renders:

```jsx
// src/Test.jsx
import Login from "./pages/Login";

export default function Test() {
  return <Login />;
}

// Then in App.jsx temporarily:
import Test from "./Test";
<Route path="/" element={<Test />} />;
```

### Method 3: Check Network Requests

**DevTools → Network tab**:

1. Look for failed requests (red)
2. Check file sizes loaded
3. Check response status codes
4. Look for 404 errors

### Method 4: Use React DevTools

```
1. Install: React Developer Tools browser extension
2. Open DevTools
3. Switch to React tab
4. Check component tree
5. Look for errors in red
6. Check props/state values
```

---

## 📋 Checklist for White Screen Debugging

- [ ] Browser console has NO errors
- [ ] Network tab shows successful JavaScript loads
- [ ] All imports resolve (check in console)
- [ ] AdminDashboard.jsx is NOT empty
- [ ] BrowserRouter wraps Routes
- [ ] main.jsx loads CSS first
- [ ] Root element exists in index.html
- [ ] All context providers are nested correctly
- [ ] No circular imports
- [ ] No syntax errors in components
- [ ] All required dependencies installed

---

## 🚨 Emergency Reset Instructions

If nothing works, start fresh:

```bash
# 1. Clear cache
npm cache clean --force

# 2. Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# 3. Reinstall dependencies
npm install

# 4. Start dev server fresh
npm run dev
```

---

## 🔧 Correct File Structure

```
src/
├── main.jsx                 ← Entry point
├── App.jsx                  ← Router setup
├── index.css                ← CSS
├── pages/
│   ├── Home.jsx            ✅ Exists
│   ├── Login.jsx            ✅ Exists
│   ├── Register.jsx         ✅ Exists
│   ├── Products.jsx         ✅ Exists
│   ├── Cart.jsx             ✅ Exists
│   ├── Checkout.jsx         ✅ Exists
│   ├── ProductDetails.jsx   ✅ Exists
│   ├── AdminDashboard.jsx   ✅ NOT EMPTY (FIXED)
│   └── index.js             ← Exports
├── components/
│   ├── Layout.jsx           ✅ Exists
│   ├── Navbar.jsx           ✅ Exists
│   ├── Footer.jsx           ✅ Exists
│   └── index.js             ← Exports
├── context/
│   ├── AuthContext.jsx      ✅ Exists
│   ├── CartContext.jsx      ✅ Exists
│   └── AdminContext.jsx     ✅ Exists
├── hooks/
│   ├── useAuth.js           ✅ Exists
│   ├── useCart.js           ✅ Exists
│   └── useAdmin.js          ✅ Exists
└── index.html               ← <div id="root"></div>
```

---

## 📝 index.html Setup

**Must contain**:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RentEase - Furniture & Appliance Rental Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- ← React mounts here -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 🎯 Vite Configuration Check

**vite.config.js should have**:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

---

## 🧪 Testing the Fix

1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Refresh page**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. **Open DevTools**: F12
4. **Check Console**: Should see NO errors
5. **Navigate to localhost:5173 or localhost:5174**

---

## ✨ Signs Everything Works

✅ Page loads without errors  
✅ Navbar/Footer appear  
✅ Tailwind CSS classes work (colors visible)  
✅ Can click buttons and navigate  
✅ Console has NO red errors  
✅ React DevTools shows component tree

---

## 📚 Common Mistakes List

| Mistake                 | Fix                                |
| ----------------------- | ---------------------------------- |
| Empty .jsx file         | Add default export component       |
| No default export       | Add `export default ComponentName` |
| Wrong import path       | Check file location                |
| Circular imports        | Reorganize file structure          |
| Missing provider        | Add to main.jsx                    |
| Router not at root      | Move `<Router>` up                 |
| CSS not imported        | Add `import './index.css'` first   |
| Syntax error in JSX     | Check quotes, brackets, tags       |
| Component not rendering | Check conditional logic            |
| Props undefined         | Check prop passing                 |

---

## 🔗 Debugging Resources

**Browser DevTools Shortcuts**:

```
F12          → Open DevTools
Cmd+Shift+I  → Open DevTools (Mac)
Ctrl+Shift+I → Open DevTools (Windows)
Cmd+Option+U → View Page Source (Mac)
Ctrl+U       → View Page Source (Windows)
```

**Console Commands**:

```javascript
// Check React version
React.version;

// Check if root is rendered
document.getElementById("root");

// Check if styles loaded
document.styleSheets;

// Find component in tree
const element = document.querySelector('[data-testid="login"]');
```

---

## ✅ Status: FIXED

**Root Cause**: AdminDashboard.jsx was empty (0 bytes)
**Solution Applied**: Recreated with full component implementation
**Result**: All imports now resolve correctly

**Next Steps**:

1. Refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Check browser console for any remaining errors
3. Test navigation between pages
4. Verify Admin Dashboard loads at /admin

---

**Last Updated**: 2024
**React Version**: 19.2.6
**Vite Version**: 8.0.14
**React Router**: 6.20.0
