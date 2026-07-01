import { useState } from "react";
import { useParams } from "react-router-dom";
import products from "../data/products";
import sofa from "../assets/products/sofa.jpg";
import refrigerator from "../assets/products/refrigerator.jpg";
import washingMachine from "../assets/products/washing-machine.jpg";
import { useCart } from "../hooks";
import { useNotifications } from "../hooks/useNotifications";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Clock,
  ChevronDown,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("3-months");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);
  const { addNotification } = useNotifications();
  const { addToCart } = useCart();
  // Mock product data with enhanced rental information
  const product = products.find((p) => p.id === id);
  if (!product) {
    return <h1 className="text-center mt-20">Product not found</h1>;
  }
  const relatedProducts = [
    {
      id: "2",
      name: "Smart Refrigerator 500L",
      monthlyRent: 3999,
      image: sofa,
      rating: 4.9,
      availability: "In Stock",
    },
    {
      id: "3",
      name: "Washing Machine 7kg",
      monthlyRent: 2499,
      image: refrigerator,
      rating: 4.7,
      availability: "In Stock",
    },
    {
      id: "9",
      name: "King Size Bed Frame",
      monthlyRent: 3699,
      image: washingMachine,
      rating: 4.8,
      availability: "In Stock",
    },
  ];

  // Customer reviews data
  const customerReviews = [
    {
      id: 1,
      author: "Rajesh Kumar",
      rating: 5,
      date: "15 May 2024",
      title: "Excellent Quality & Service",
      content:
        "The sofa is amazing! Delivery was on time, installation was hassle-free, and the quality is outstanding. Highly recommended!",
      helpful: 45,
      verified: true,
    },
    {
      id: 2,
      author: "Priya Singh",
      rating: 4,
      date: "12 May 2024",
      title: "Great Value for Money",
      content:
        "Good quality product. The rental plan is flexible and affordable. Customer service was responsive and helpful.",
      helpful: 32,
      verified: true,
    },
    {
      id: 3,
      author: "Amit Patel",
      rating: 5,
      date: "8 May 2024",
      title: "Perfect for My Apartment",
      content:
        "Fits perfectly in my small apartment. The quality is premium and the rental terms are reasonable. Will definitely rent more!",
      helpful: 28,
      verified: true,
    },
    {
      id: 4,
      author: "Neha Desai",
      rating: 4,
      date: "5 May 2024",
      title: "Good Product, Quick Delivery",
      content:
        "Sofa arrived within 2 days. Very comfortable and looks even better in person. Maintenance support is helpful.",
      helpful: 19,
      verified: true,
    },
  ];

  // FAQs data
  const faqs = [
    {
      id: 1,
      question: "What is included in the rental?",
      answer:
        "The rental includes delivery, professional installation, insurance coverage, free monthly maintenance, and 24/7 customer support. All charges are transparent with no hidden fees.",
    },
    {
      id: 2,
      question: "Can I extend my rental period?",
      answer:
        "Yes! You can easily extend your rental period at any time. Simply contact our support team, and we'll help you extend the rental at the same or better rates.",
    },
    {
      id: 3,
      question: "What if the product gets damaged?",
      answer:
        "Our comprehensive insurance covers accidental damage. In case of damage, we'll either repair or replace the product at no additional cost.",
    },
    {
      id: 4,
      question: "What is the return policy?",
      answer:
        "You can return the product within 30 days of rental for a full refund (minus delivery charges). After the rental period ends, you can either continue renting or return it.",
    },
    {
      id: 5,
      question: "Is there a security deposit?",
      answer:
        "Yes, a refundable security deposit is required based on the product value. It's returned in full after the rental period ends, provided there's no damage beyond normal wear and tear.",
    },
    {
      id: 6,
      question: "How is maintenance handled?",
      answer:
        "Free maintenance and repairs are included in the rental. Our service team will visit your location for any maintenance needs at no extra cost.",
    },
  ];

  const handleAddToCart = () => {
    const tenure = parseInt(selectedPlan.split("-")[0]);

    console.log("Product:", product);

    addToCart( tenure, quantity);
    addToCart(product);

    addNotification(`${product.name} added to cart!`, "success");
    console.log("Cart add called");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8 flex-wrap">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Home
          </a>
          <span className="text-slate-400">/</span>
          <a
            href="/products"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Products
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-slate-800 font-medium">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-96 md:h-[500px]">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {product.badge}
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-slate-900/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
                {selectedImage + 1}/{product.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? "border-blue-600 ring-2 ring-blue-400"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header & Title */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-slate-600">
                      ({product.reviews} reviews)
                    </span>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ {product.availability}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${
                    isWishlisted
                      ? "bg-red-100 text-red-600 shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Heart
                    size={24}
                    className={isWishlisted ? "fill-current" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="space-y-4">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">
                    Monthly Rent
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-blue-600">
                      ₹{product.monthlyRent.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-600">/month</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-200">
                  <p className="text-slate-600 text-sm font-medium mb-2">
                    Security Deposit (Refundable)
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    ₹{product.securityDeposit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Tenure Selection */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">
                Choose Rental Duration
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {product.rentalPlans.map((plan) => (
                  <button
                    key={plan.period}
                    onClick={() => setSelectedPlan(plan.period)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedPlan === plan.period
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <p className="font-semibold text-slate-900 mb-1">
                      {plan.duration}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      ₹{plan.price.toLocaleString()}
                    </p>
                    {plan.savings && (
                      <p className="text-xs text-green-600 font-semibold mt-1">
                        Save ₹{plan.savings.toLocaleString()}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900">Quantity</h3>
              <div className="flex items-center gap-4 w-fit bg-white border border-slate-200 rounded-xl p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  −
                </button>
                <span className="text-xl font-bold text-slate-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 rounded-xl transition-all duration-300">
                Rent Now
              </button>
            </div>

            {/* Trust Signals */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-slate-900 mb-4">
                Why Choose RentEase?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <Truck
                    className="text-blue-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      Free Delivery & Installation
                    </p>
                    <p className="text-slate-600 text-xs">
                      Pan-India delivery included
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield
                    className="text-blue-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      Full Insurance Coverage
                    </p>
                    <p className="text-slate-600 text-xs">
                      Damage protection included
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <RotateCcw
                    className="text-blue-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      Easy Returns
                    </p>
                    <p className="text-slate-600 text-xs">
                      30-day return guarantee
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check
                    className="text-blue-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      24/7 Support
                    </p>
                    <p className="text-slate-600 text-xs">
                      Round-the-clock assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Delivery & Logistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(product.deliveryInfo).map(([key, value]) => (
              <div key={key} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {key === "Delivery Time" && (
                    <Clock className="text-blue-600" size={24} />
                  )}
                  {key === "Delivery Charges" && (
                    <Truck className="text-blue-600" size={24} />
                  )}
                  {key === "Installation" && (
                    <Check className="text-blue-600" size={24} />
                  )}
                  {key === "Packaging" && (
                    <Shield className="text-blue-600" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">{key}</p>
                  <p className="text-slate-600">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Product Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-start pb-4 border-b border-slate-200"
              >
                <span className="font-semibold text-slate-700">{key}</span>
                <span className="text-slate-600 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            What's Included in Your Rental
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Check
                  className="text-green-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Customer Reviews
            </h2>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">
                {product.rating}
              </p>
              <div className="flex gap-1 justify-end mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Based on {product.reviews} reviews
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {customerReviews.map((review) => (
              <div
                key={review.id}
                className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900">
                        {review.author}
                      </p>
                      {review.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{review.date}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  {review.title}
                </h4>
                <p className="text-slate-700 text-sm mb-3">{review.content}</p>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors"
                >
                  <p className="font-semibold text-slate-900 text-left">
                    {faq.question}
                  </p>
                  <div
                    className={`flex-shrink-0 transition-transform duration-300 ${openFAQ === faq.id ? "rotate-180" : ""}`}
                  >
                    <ChevronDown className="text-slate-600" size={20} />
                  </div>
                </button>
                {openFAQ === faq.id && (
                  <div className="px-6 py-4 bg-blue-50 border-t border-slate-200">
                    <p className="text-slate-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Similar Products You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((prod) => (
              <a key={prod.id} href={`/products/${prod.id}`} className="group">
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden h-48 bg-slate-100">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-slate-900 shadow-md">
                      ₹{prod.monthlyRent}/mo
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {prod.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="text-sm font-semibold text-slate-700">
                          {prod.rating}
                        </span>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                        {prod.availability}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
