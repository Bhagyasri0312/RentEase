import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X, Search, Heart, Star, MapPin, Shield } from "lucide-react";
import { Button } from "../components";

import sofa from "../assets/products/sofa.jpg";
import refrigerator from "../assets/products/refrigerator.jpg";
import washingMachine from "../assets/products/washing-machine.jpg";
import ac from "../assets/products/ac.jpg";
import studyTable from "../assets/products/study-table.jpg";
import tv from "../assets/products/tv.jpg";
import bed from "../assets/products/bed.jpg";
import wardrobe from "../assets/products/wardrobe.jpg";

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("search") || "";
  });
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 10000],
    rentalDuration: "",
    availability: "",
    rating: 0,
    sortBy: "popular",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  // Memoize products array to prevent useMemo dependency issues
  const allProducts = useMemo(
    () => [
      {
        id: "1",
        name: "Modern L-Shaped Sofa",
        monthlyRent: 4999,
        securityDeposit: 14997,
        category: "Sofas",
        image: sofa,
        rating: 4.8,
        reviews: 342,
        availability: "In Stock",
        rentalDuration: "1-12 months",
        description:
          "Comfortable L-shaped sectional sofa perfect for living rooms",
        badge: "Popular",
        deliveryDays: "2-3 days",
      },
      {
        id: "2",
        name: "Smart Refrigerator 500L",
        monthlyRent: 3999,
        securityDeposit: 11997,
        category: "Refrigerators",
        image: refrigerator,
        rating: 4.9,
        reviews: 456,
        availability: "In Stock",
        rentalDuration: "1-24 months",
        description: "Energy-efficient frost-free refrigerator",
        badge: "Best Seller",
        deliveryDays: "1-2 days",
      },
      {
        id: "3",
        name: "Automatic Washing Machine 7kg",
        monthlyRent: 2499,
        securityDeposit: 7497,
        category: "Washing Machines",
        image: washingMachine,
        rating: 4.7,
        reviews: 289,
        availability: "In Stock",
        rentalDuration: "1-24 months",
        description: "Fully automatic front-load washing machine",
        deliveryDays: "2-3 days",
      },
      {
        id: "4",
        name: "Smart Window AC 1.5 Ton",
        monthlyRent: 2999,
        securityDeposit: 8997,
        category: "AC",
        image: ac,
        rating: 4.6,
        reviews: 198,
        availability: "Limited Stock",
        rentalDuration: "3-24 months",
        description: "Energy-efficient split AC with smart controls",
        deliveryDays: "3-4 days",
      },
      {
        id: "5",
        name: "Wooden Dining Table Set",
        monthlyRent: 3499,
        securityDeposit: 10497,
        category: "Dining Tables",
        image: studyTable,
        rating: 4.5,
        reviews: 156,
        availability: "In Stock",
        rentalDuration: "1-12 months",
        description: "Beautiful 6-seater wooden dining table with chairs",
        badge: "New",
        deliveryDays: "5-7 days",
      },
      {
        id: "6",
        name: "Ergonomic Office Chair",
        monthlyRent: 1999,
        securityDeposit: 5997,
        category: "Study Tables",
        image: studyTable,
        rating: 4.4,
        reviews: 223,
        availability: "In Stock",
        rentalDuration: "1-12 months",
        description: "Premium ergonomic mesh office chair",
        deliveryDays: "2-3 days",
      },
      {
        id: "7",
        name: '43" 4K Smart TV',
        monthlyRent: 2799,
        securityDeposit: 8397,
        category: "TVs",
        image: tv,
        rating: 4.7,
        reviews: 267,
        availability: "In Stock",
        rentalDuration: "1-24 months",
        description: "4K UHD Smart TV with built-in streaming apps",
        deliveryDays: "3-4 days",
      },
      {
        id: "8",
        name: "Queen Size Bed Frame",
        monthlyRent: 3299,
        securityDeposit: 9897,
        category: "Beds",
        image: bed,
        rating: 4.8,
        reviews: 405,
        availability: "In Stock",
        rentalDuration: "1-12 months",
        description: "Spacious queen-size wooden bed frame",
        deliveryDays: "5-7 days",
      },
      {
        id: "9",
        name: "Spacious 3-Door Wardrobe",
        monthlyRent: 2999,
        securityDeposit: 8997,
        category: "Wardrobes",
        image: wardrobe,
        rating: 4.6,
        reviews: 178,
        availability: "In Stock",
        rentalDuration: "1-24 months",
        description: "Wooden wardrobe with spacious storage",
        deliveryDays: "7-10 days",
      },
      {
        id: "10",
        name: "Microwave Oven 25L",
        monthlyRent: 1299,
        securityDeposit: 3897,
        category: "Kitchen Appliances",
        image:
          "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
        rating: 4.5,
        reviews: 134,
        availability: "In Stock",
        rentalDuration: "1-12 months",
        description: "Convection microwave oven for cooking",
        deliveryDays: "2-3 days",
      },
      {
        id: "11",
        name: "Study Table with Storage",
        monthlyRent: 1499,
        securityDeposit: 4497,
        category: "Study Tables",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        rating: 4.3,
        reviews: 92,
        availability: "In Stock",
        rentalDuration: "1-12 months",
        description: "Compact study table with built-in storage",
        deliveryDays: "3-4 days",
      },
      {
        id: "12",
        name: "Double Bed Mattress",
        monthlyRent: 1799,
        securityDeposit: 5397,
        category: "Beds",
        image: bed,
        rating: 4.6,
        reviews: 267,
        availability: "Out of Stock",
        rentalDuration: "1-24 months",
        description: "Premium foam mattress for double bed",
        deliveryDays: "3-4 days",
      },
    ],
    [],
  );

  const categories = [
    "All",
    "Sofas",
    "Beds",
    "Refrigerators",
    "Washing Machines",
    "AC",
    "Study Tables",
    "TVs",
    "Dining Tables",
    "Wardrobes",
    "Kitchen Appliances",
  ];
  const rentalDurations = [
    "All",
    "1-3 months",
    "1-12 months",
    "1-24 months",
    "3-24 months",
  ];
  const availabilityOptions = [
    "All",
    "In Stock",
    "Limited Stock",
    "Out of Stock",
  ];
  const ratings = [0, 3, 3.5, 4, 4.5, 5];
  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Top Rated" },
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        // Search filter
        const searchMatch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const categoryMatch =
          !filters.category ||
          filters.category === "All" ||
          product.category === filters.category;

        // Price filter
        const priceMatch =
          product.monthlyRent >= filters.priceRange[0] &&
          product.monthlyRent <= filters.priceRange[1];

        // Rental duration filter
        const durationMatch =
          !filters.rentalDuration ||
          filters.rentalDuration === "All" ||
          product.rentalDuration.includes(filters.rentalDuration.split("-")[0]);

        // Availability filter
        const availabilityMatch =
          !filters.availability ||
          filters.availability === "All" ||
          product.availability === filters.availability;

        // Rating filter
        const ratingMatch =
          filters.rating === 0 || product.rating >= filters.rating;

        return (
          searchMatch &&
          categoryMatch &&
          priceMatch &&
          durationMatch &&
          availabilityMatch &&
          ratingMatch
        );
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price-low":
            return a.monthlyRent - b.monthlyRent;
          case "price-high":
            return b.monthlyRent - a.monthlyRent;
          case "rating":
            return b.rating - a.rating;
          case "newest":
            return parseInt(b.id) - parseInt(a.id);
          case "popular":
          default:
            return b.reviews - a.reviews;
        }
      });
  }, [searchQuery, filters, allProducts]);

  // Handler functions
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handlePriceChange = (value) => {
    setFilters((prev) => ({ ...prev, priceRange: [0, value] }));
  };

  const handleDurationChange = (duration) => {
    setFilters((prev) => ({ ...prev, rentalDuration: duration }));
  };

  const handleAvailabilityChange = (availability) => {
    setFilters((prev) => ({ ...prev, availability }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const handleSortChange = (sortBy) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({
      category: "",
      priceRange: [0, 10000],
      rentalDuration: "",
      availability: "",
      rating: 0,
      sortBy: "popular",
    });
  };

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  // Custom Product Card Component
  const ProductCardComponent = ({ product }) => (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300">
      {/* Image Container */}
      <div className="relative h-56 md:h-64 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </div>
        )}
        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              wishlist.has(product.id)
                ? "fill-red-500 text-red-500"
                : "text-slate-400"
            }`}
          />
        </button>
        {/* Availability Badge */}
        <div
          className={`absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold text-white ${
            product.availability === "In Stock"
              ? "bg-green-500"
              : product.availability === "Limited Stock"
                ? "bg-orange-500"
                : "bg-red-500"
          }`}
        >
          {product.availability}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-3 line-clamp-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-700 ml-1">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Pricing */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-slate-600">Monthly Rent</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{product.monthlyRent.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600">Security Deposit</p>
              <p className="text-lg font-semibold text-slate-900">
                ₹{product.securityDeposit.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600">✓ {product.rentalDuration}</p>
        </div>

        {/* Delivery */}
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-200">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Delivery in {product.deliveryDays}</span>
        </div>

        {/* Rent Now Button */}
        <button
          onClick={() => navigate(`/products/${product.id}`)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <span>Rent Now</span>
          <Shield className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="w-full px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            Browse Our Collection
          </h1>
          <p className="text-lg text-slate-600">
            Find the perfect items for your home and office
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, category..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-slate-900 placeholder-slate-500 transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 space-y-6 border border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center justify-between">
                  Filters
                  {(filters.category ||
                    filters.rating ||
                    filters.priceRange[1] < 10000 ||
                    filters.rentalDuration ||
                    filters.availability) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-lg"
                    >
                      Clear All
                    </button>
                  )}
                </h3>
              </div>

              {/* Category Filter */}
              <div className="border-b border-slate-200 pb-6">
                <h4 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">
                  Category
                </h4>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={
                          filters.category === cat ||
                          (cat === "All" && !filters.category)
                        }
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 accent-blue-600"
                      />
                      <span className="text-slate-700 group-hover:text-blue-600 transition-colors text-sm">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="border-b border-slate-200 pb-6">
                <h4 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">
                  Price Range
                </h4>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-sm text-slate-600 mt-4 font-semibold">
                  <span>₹{filters.priceRange[0].toLocaleString()}</span>
                  <span>₹{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Rental Duration Filter */}
              <div className="border-b border-slate-200 pb-6">
                <h4 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">
                  Rental Duration
                </h4>
                <div className="space-y-3">
                  {rentalDurations.map((duration) => (
                    <label
                      key={duration}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="duration"
                        value={duration}
                        checked={
                          filters.rentalDuration === duration ||
                          (duration === "All" && !filters.rentalDuration)
                        }
                        onChange={(e) => handleDurationChange(e.target.value)}
                        className="w-4 h-4 text-blue-600 accent-blue-600"
                      />
                      <span className="text-slate-700 group-hover:text-blue-600 transition-colors text-sm">
                        {duration}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="border-b border-slate-200 pb-6">
                <h4 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">
                  Availability
                </h4>
                <div className="space-y-3">
                  {availabilityOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="availability"
                        value={option}
                        checked={
                          filters.availability === option ||
                          (option === "All" && !filters.availability)
                        }
                        onChange={(e) =>
                          handleAvailabilityChange(e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 accent-blue-600"
                      />
                      <span className="text-slate-700 group-hover:text-blue-600 transition-colors text-sm">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">
                  Rating
                </h4>
                <div className="space-y-3">
                  {ratings.map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={() => handleRatingChange(rating)}
                        className="w-4 h-4 text-blue-600 accent-blue-600"
                      />
                      <span className="text-slate-700 group-hover:text-blue-600 transition-colors text-sm">
                        {rating === 0 ? "All Ratings" : `${rating}+ ⭐`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort Bar & Mobile Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl shadow-md p-4 border border-slate-200">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-semibold"
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>

              <div className="w-full sm:w-auto">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-600 focus:outline-none bg-white text-slate-900 font-semibold cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <option value="">Sort By</option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-slate-600 font-semibold">
                {filteredProducts.length} products found
              </div>
            </div>

            {/* Mobile Filter Modal */}
            {isFilterOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto rounded-l-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 text-xl">
                      Filters
                    </h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X size={24} className="text-slate-600" />
                    </button>
                  </div>

                  {/* Mobile Filters Content */}
                  <div className="space-y-6">
                    {/* Category */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Category
                      </h4>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <label
                            key={cat}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="category"
                              value={cat}
                              checked={
                                filters.category === cat ||
                                (cat === "All" && !filters.category)
                              }
                              onChange={(e) =>
                                handleCategoryChange(e.target.value)
                              }
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-slate-700">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Price Range
                      </h4>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          handlePriceChange(parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-slate-600 mt-2">
                        <span>₹{filters.priceRange[0]}</span>
                        <span>₹{filters.priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Rental Duration
                      </h4>
                      <div className="space-y-2">
                        {rentalDurations.map((duration) => (
                          <label
                            key={duration}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="duration"
                              value={duration}
                              checked={
                                filters.rentalDuration === duration ||
                                (duration === "All" && !filters.rentalDuration)
                              }
                              onChange={(e) =>
                                handleDurationChange(e.target.value)
                              }
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-slate-700">{duration}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Availability
                      </h4>
                      <div className="space-y-2">
                        {availabilityOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="availability"
                              value={option}
                              checked={
                                filters.availability === option ||
                                (option === "All" && !filters.availability)
                              }
                              onChange={(e) =>
                                handleAvailabilityChange(e.target.value)
                              }
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Rating
                      </h4>
                      <div className="space-y-2">
                        {ratings.map((rating) => (
                          <label
                            key={rating}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="rating"
                              value={rating}
                              checked={filters.rating === rating}
                              onChange={() => handleRatingChange(rating)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>
                              {rating === 0 ? "All Ratings" : `${rating}+ ⭐`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCardComponent key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="col-span-full bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No products found
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  We couldn't find any products matching your filters. Try
                  adjusting your search criteria or clearing your filters to see
                  more options.
                </p>
                <Button
                  onClick={handleClearFilters}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
