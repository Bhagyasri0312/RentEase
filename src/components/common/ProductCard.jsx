import PropTypes from "prop-types";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart, onWishlist }) => {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="card-hover group cursor-pointer overflow-hidden h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-secondary-100 h-48 sm:h-56">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.discount && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{product.discount}%
            </div>
          )}
          {product.badge && (
            <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {product.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-secondary-600 font-medium uppercase tracking-wide">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-xs text-secondary-600">
                  {product.rating}
                </span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-semibold text-secondary-800 mb-2 truncate-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-secondary-600 mb-3 truncate-2">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-primary-600">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-secondary-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <p className="text-xs text-secondary-600 mt-1">
              {product.rentalPeriod || "Per month"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product.id);
              }}
              className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Add</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onWishlist?.(product.id);
              }}
              className="btn-outline px-3 py-2"
            >
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string,
    description: PropTypes.string,
    originalPrice: PropTypes.number,
    discount: PropTypes.number,
    badge: PropTypes.string,
    rating: PropTypes.number,
    rentalPeriod: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func,
  onWishlist: PropTypes.func,
};

export default ProductCard;
