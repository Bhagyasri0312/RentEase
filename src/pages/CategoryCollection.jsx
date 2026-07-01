import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../hooks";
import { getCategoryById, getCategoryProducts } from "../utils/categoryConfig";
import { Pagination } from "../components";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "../hooks/useWishlist";
import { useNotifications } from "../hooks/useNotifications";
import sofa from "../assets/products/sofa.jpg";
import refrigerator from "../assets/products/refrigerator.jpg";
import washingMachine from "../assets/products/washing-machine.jpg";
import oven from "../assets/products/oven.jpg";
import tv from "../assets/products/tv.jpg";
import laptop from "../assets/products/laptop.jpg";
import dining from "../assets/products/dining.jpg";
import furniture from "../assets/products/furniture.jpg";
import areaRug from "../assets/products/area-rug.jpg";
import bluetoothSpeaker from "../assets/products/bluetooth-speaker.jpg";
import ledCeilingLight from "../assets/products/led-ceiling-light.jpg";
import wallMirror from "../assets/products/wall-mirror.jpg";

// Mock product data - replace with API call
const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Modern Sofa",
    category: "furniture",
    price: 15000,
    image: sofa,
    rating: 4.5,
    reviews: 24,
    description: "Beautiful modern sofa perfect for your living room",
  },
  {
    id: 2,
    name: "Dining Table",
    category: "furniture",
    price: 8000,
    image: dining,
    rating: 4.2,
    reviews: 18,
    description: "Elegant dining table for 6 people",
  },
  {
    id: 3,
    name: "Office Chair",
    category: "furniture",
    price: 5000,
    image: furniture,
    rating: 4.7,
    reviews: 32,
    description: "Ergonomic office chair with lumbar support",
  },
  {
    id: 4,
    name: "Refrigerator",
    category: refrigerator,
    price: 25000,
    image: refrigerator,
    rating: 4.6,
    reviews: 15,
    description: "Double-door refrigerator with ice maker",
  },
  {
    id: 5,
    name: "Washing Machine",
    category: "appliances",
    price: 18000,
    image: washingMachine,
    rating: 4.4,
    reviews: 22,
    description: "Automatic washing machine, 7kg capacity",
  },
  {
    id: 6,
    name: "Microwave Oven",
    category: "appliances",
    price: 8000,
    image: oven,
    rating: 4.3,
    reviews: 12,
    description: "Digital microwave with multiple heating modes",
  },
  {
    id: 7,
    name: "4K Smart TV",
    category: "electronics",
    price: 35000,
    image: tv,
    rating: 4.8,
    reviews: 45,
    description: "55-inch 4K Smart TV with WiFi",
  },
  {
    id: 8,
    name: "Laptop",
    category: "electronics",
    price: 45000,
    image: laptop,
    rating: 4.7,
    reviews: 38,
    description: "High-performance laptop for work and gaming",
  },
  {
    id: 9,
    name: "Bluetooth Speaker",
    category: "electronics",
    price: 5000,
    image: bluetoothSpeaker,
    rating: 4.5,
    reviews: 28,
    description: "Portable Bluetooth speaker with 12-hour battery",
  },
  {
    id: 10,
    name: "LED Ceiling Light",
    category: "decor",
    price: 2000,
    image: ledCeilingLight,
    rating: 4.4,
    reviews: 16,
    description: "Modern LED ceiling light, dimmable",
  },
  {
    id: 11,
    name: "Wall Mirror",
    category: "decor",
    price: 3000,
    image: wallMirror,
    rating: 4.6,
    reviews: 19,
    description: "Large decorative wall mirror with frame",
  },
  {
    id: 12,
    name: "Area Rug",
    category: "decor",
    price: 4500,
    image: areaRug,
    rating: 4.5,
    reviews: 14,
    description: "Premium area rug, 8x10 feet",
  },
];

const ITEMS_PER_PAGE = 9;

export default function CategoryCollection() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addNotification } = useNotifications();
  const [currentPage, setCurrentPage] = useState(1);

  const categoryData = getCategoryById(category);
  const products = getCategoryProducts(category, ALL_PRODUCTS);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Category Not Found
          </h1>
          <button onClick={() => navigate("/")} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    addNotification(`${product.name} added to cart!`, "success");
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      addNotification(`${product.name} removed from wishlist`, "info");
    } else {
      addToWishlist(product);
      addNotification(`${product.name} added to wishlist!`, "success");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full max-w-screen-2xl mx-auto px-8 py-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <categoryData.icon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {categoryData.label} Collection
              </h1>
              <p className="text-gray-600 mt-1">{categoryData.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Showing {products.length} products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-screen-2xl mx-auto px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No products found in this category
            </h2>
            <p className="text-gray-500 mb-6">
              Check back later for new products!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="btn-primary"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-100 h-48">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                        isInWishlist(product.id)
                          ? "bg-red-100 text-red-600"
                          : "bg-white text-gray-400 hover:text-red-600"
                      }`}
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={
                          isInWishlist(product.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {"★".repeat(Math.floor(product.rating))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        ₹{product.price.toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  maxVisible={5}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
