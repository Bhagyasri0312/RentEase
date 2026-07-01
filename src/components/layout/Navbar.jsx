import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  LogIn,
} from "lucide-react";
import Button from "../common/Button";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { Bell } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { notifications } = useNotifications();
  const { wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;
  console.log("Navbar cart:", cartItems);
  console.log("Navbar cartItems:", cartItems);
  console.log(
    "Navbar count:",
    cartItems.reduce((sum, item) => sum + item.quantity, 0),
  );
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
    }
  };
  const categories = [
    { name: "Furniture", href: "/category/furniture" },
    { name: "Appliances", href: "/category/appliances" },
    { name: "Electronics", href: "/category/electronics" },
    { name: "Decor", href: "/category/decor" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-secondary-100 shadow-soft">
      <div className="container-max">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">
                RE
              </span>
            </div>
            <span className="hidden sm:block font-bold text-lg md:text-xl text-secondary-800">
              RentEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="px-4 py-2 text-lg font-bold text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4 lg:mx-6">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="input-field text-sm"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                size={18}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <Search size={20} className="text-secondary-700" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <Heart
                size={20}
                className={
                  wishlistCount > 0 ? "text-red-500" : "text-secondary-700"
                }
              />

              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <Bell size={20} className="text-secondary-700" />

              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Link>
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ShoppingCart size={20} className="text-secondary-700" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {/* Login/Register - Desktop */}
            <Link to="/login" className="hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogIn size={16} />
                <span className="hidden md:inline">Login</span>
              </Button>
            </Link>

            {/* User Menu - Future */}
            <button className="hidden sm:p-2 hover:bg-secondary-100 rounded-lg transition-colors">
              <User size={20} className="text-secondary-700" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              {isOpen ? (
                <X size={24} className="text-secondary-700" />
              ) : (
                <Menu size={24} className="text-secondary-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 border-t border-secondary-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="input-field text-sm"
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                size={18}
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-secondary-100 bg-secondary-50 animate-slide-up">
            <div className="px-4 py-4 space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="block px-4 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-white rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-secondary-200">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors sm:hidden"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
