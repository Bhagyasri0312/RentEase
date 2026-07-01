import { Link } from "react-router-dom";

import {
  ArrowRight,
  Star,
  ChevronRight,
  Zap,
  Truck,
  Shield,
  TrendingUp,
  Users,
  Bed,
  Sofa,
  Wind,
  Droplet,
  PlusCircle,
  Monitor,
  Armchair,
  CheckCircle,
} from "lucide-react";
import { Button, ProductCard } from "../components";

// Import category images
import sofa from "../assets/products/sofa.jpg";
import refrigerator from "../assets/products/refrigerator.jpg";
import washingMachine from "../assets/products/washing-machine.jpg";
import ac from "../assets/products/ac.jpg";
import studyTable from "../assets/products/study-table.jpg";
import tv from "../assets/products/tv.jpg";
import bed from "../assets/products/bed.jpg";
import wardrobe from "../assets/products/wardrobe.jpg";

// Category images mapping
const categoryImages = {
  Beds: bed,
  Sofas: sofa,
  Refrigerators: refrigerator,
  "Washing Machines": washingMachine,
  AC: ac,
  "Study Tables": studyTable,
  TVs: tv,
  Wardrobes: wardrobe,
};

const Home = () => {
  // Featured Products
  const featuredProducts = [
    {
      id: "1",
      name: "Premium L-Shaped Sofa",
      price: 4999,
      originalPrice: 6999,
      discount: 29,
      image:
       sofa,
      category: "Sofas",
      badge: "Popular",
      rating: 4.8,
      reviews: 324,
      rentalPeriod: "Per month",
    },
    {
      id: "2",
      name: "Smart Refrigerator 500L",
      price: 3999,
      originalPrice: 5299,
      discount: 25,
      image:
        refrigerator,
      category: "Refrigerators",
      badge: "New",
      rating: 4.9,
      reviews: 412,
      rentalPeriod: "Per month",
    },
    {
      id: "3",
      name: "Automatic Washing Machine 7kg",
      price: 2499,
      originalPrice: 3299,
      discount: 24,
      image:
        washingMachine,
      category: "Washing Machines",
      rating: 4.7,
      reviews: 289,
      rentalPeriod: "Per month",
    },
    {
      id: "4",
      name: "Smart Window AC 1.5 Ton",
      price: 1999,
      originalPrice: 2999,
      discount: 33,
      image:
        ac,
      category: "AC",
      badge: "Trending",
      rating: 4.6,
      reviews: 198,
      rentalPeriod: "Per month",
    },
    {
      id: "5",
      name: "Modern Study Table",
      price: 1299,
      originalPrice: 1899,
      discount: 32,
      image:
        studyTable,
      category: "Study Tables",
      rating: 4.5,
      reviews: 156,
      rentalPeriod: "Per month",
    },
    {
      id: "6",
      name: '43" 4K Smart TV',
      price: 2799,
      originalPrice: 3999,
      discount: 30,
      image:
        tv,
      category: "TVs",
      rating: 4.7,
      reviews: 267,
      rentalPeriod: "Per month",
    },
    {
      id: "7",
      name: "Comfortable Queen Bed",
      price: 3299,
      originalPrice: 4699,
      discount: 30,
      image:
        bed,
      category: "Beds",
      badge: "Popular",
      rating: 4.8,
      reviews: 405,
      rentalPeriod: "Per month",
    },
    {
      id: "8",
      name: "Spacious Wardrobe",
      price: 2999,
      originalPrice: 4299,
      discount: 30,
      image:
        wardrobe,
      category: "Wardrobes",
      rating: 4.6,
      reviews: 178,
      rentalPeriod: "Per month",
    },
  ];

  // Category Cards with Icons and Images
  const categories = [
    {
      name: "Beds",
      icon: Bed,
      image:
        bed,
      description: "Comfortable beds",
      href: "/products?category=beds",
      color: "from-blue-400 to-blue-600",
      count: "120+ items",
    },
    {
      name: "Sofas",
      icon: Sofa,
      image:
       sofa,
      description: "Stylish sofas",
      href: "/products?category=sofas",
      color: "from-cyan-400 to-blue-600",
      count: "85+ items",
    },
    {
      name: "Refrigerators",
      icon: Wind,
      image:
        refrigerator,
      description: "Smart refrigerators",
      href: "/products?category=refrigerators",
      color: "from-teal-400 to-cyan-600",
      count: "45+ items",
    },
    {
      name: "Washing Machines",
      icon: Droplet,
      image:
        washingMachine,
      description: "Automatic washers",
      href: "/products?category=washing-machines",
      color: "from-blue-400 to-indigo-600",
      count: "35+ items",
    },
    {
      name: "AC",
      icon: Wind,
      image:
       ac,
      description: "Air conditioners",
      href: "/products?category=ac",
      color: "from-sky-400 to-blue-600",
      count: "50+ items",
    },
    {
      name: "Study Tables",
      icon: PlusCircle,
      image:
        studyTable,
      description: "Work desks",
      href: "/products?category=study-tables",
      color: "from-indigo-400 to-blue-600",
      count: "60+ items",
    },
    {
      name: "TVs",
      icon: Monitor,
      image:
        tv,
      description: "Smart televisions",
      href: "/products?category=tvs",
      color: "from-blue-500 to-purple-600",
      count: "40+ items",
    },
    {
      name: "Wardrobes",
      icon: Armchair,
      image:
        wardrobe,
      description: "Storage cabinets",
      href: "/products?category=wardrobes",
      color: "from-violet-400 to-purple-600",
      count: "55+ items",
    },
  ];

  // Why RentEase Features
  const features = [
    {
      icon: Zap,
      title: "Affordable Rentals",
      description: "Pay only for what you use, save up to 70% vs buying",
      color: "text-yellow-500",
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Doorstep delivery and installation included",
      color: "text-blue-500",
    },
    {
      icon: Shield,
      title: "Damage Protection",
      description: "Minimal maintenance charges, peace of mind assured",
      color: "text-green-500",
    },
    {
      icon: TrendingUp,
      title: "Flexible Terms",
      description: "Rent for 1 month to 12 months, cancel anytime",
      color: "text-purple-500",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Software Engineer",
      text: "RentEase made it so easy to get quality furniture for my new apartment. Great service!",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Interior Designer",
      text: "The variety of products and flexible rental periods are unbeatable. Highly recommended!",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Business Owner",
      text: "Perfect solution for furnishing office spaces. Professional service and great quality.",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5,
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Hero Section with Promotional Banner */}
      <section className="w-full py-8 px-4 md:px-8">
        <div className="w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Large Banner */}
            <div className="lg:col-span-1 h-96 lg:h-auto rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="relative h-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full -mr-32 -mt-32 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400 rounded-full -ml-24 -mb-24 opacity-20"></div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-8 text-white">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest opacity-90 mb-2">
                      Special Offer
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                      Premium <span className="text-cyan-200">Furniture</span>{" "}
                      at Unbeatable Prices
                    </h2>
                    <p className="text-lg opacity-95 mb-6">
                      Save up to 70% on premium furniture & appliances
                    </p>
                  </div>

                  <div>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-50 transition-all duration-300 group/btn"
                    >
                      Explore Now
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Decorative Image Placeholder */}
                <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl from-blue-800 to-transparent rounded-full opacity-40 transform group-hover:scale-110 transition-transform duration-500"></div>
              </div>
            </div>

            {/* Right Category Quick Access Grid - Modern Card Layout */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category, idx) => {
                const categoryImageUrl = categoryImages[category.name];

                return (
                  <Link
                    key={idx}
                    to={category.href}
                    className="group flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white"
                  >
                    {/* Image Section - Top */}
                    <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                      {/* High-quality Category Image */}
                      {categoryImageUrl && (
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url('${categoryImageUrl}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      )}

                      {/* Dark Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-50 group-hover:opacity-60 transition-opacity duration-300"></div>
                    </div>

                    {/* Content Section - Bottom */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {category.count}
                        </p>
                      </div>

                      {/* Subtle Hover Arrow */}
                      <div className="mt-3 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-xs font-semibold">Explore</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why RentEase Section */}
      <section className="w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold uppercase tracking-wider mb-4">
              Why Choose Us
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Smart Rental Solutions for Modern Living
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need, without the commitment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:shadow-lg"
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-white mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-blue-600 font-semibold uppercase tracking-wider mb-2">
                Our Collection
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
            >
              View All
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Button - Mobile */}
          <div className="mt-12 flex justify-center md:hidden">
            <Link to="/products" className="w-full">
              <Button variant="primary" size="lg" className="w-full">
                View All Products <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold uppercase tracking-wider mb-4">
              Customer Love
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-slate-600">
              Join happy customers who've transformed their spaces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="group p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-slate-700 text-lg mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-blue-100">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-slate-200">
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "10K+", label: "Products Available" },
              { number: "5M+", label: "Amount Saved" },
              { number: "4.8★", label: "Average Rating" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </p>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative group bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-3xl overflow-hidden shadow-2xl p-12 md:p-20 text-white">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full -mr-48 -mt-48 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400 rounded-full -ml-36 -mb-36 opacity-20"></div>

            {/* Content */}
            <div className="relative text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Ready to Transform Your Space?
              </h2>
              <p className="text-xl opacity-95 mb-10">
                Start your rental journey today and enjoy premium furniture &
                appliances without the burden of ownership.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="flex-1 sm:flex-none">
                  <Button variant="secondary" size="lg" className="w-full">
                    Browse Catalog <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <button className="px-8 py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="w-full py-12 px-4 md:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Quality Assured</h3>
              <p className="text-slate-300">
                Every product is carefully inspected
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-slate-300">
                Delivered within 2-3 working days
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-slate-300">Our team is always ready to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
