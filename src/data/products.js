import sofa from "../assets/products/sofa.jpg";
import refrigerator from "../assets/products/refrigerator.jpg";
import washingMachine from "../assets/products/washing-machine.jpg";
import ac from "../assets/products/ac.jpg";
import studyTable from "../assets/products/study-table.jpg";
import tv from "../assets/products/tv.jpg";
import bed from "../assets/products/bed.jpg";
import wardrobe from "../assets/products/wardrobe.jpg";

const commonData = {
  rentalPlans: [
    { period: "1-month", duration: "1 Month", price: 4999 },
    { period: "3-months", duration: "3 Months", price: 13499, savings: 2497 },
    { period: "6-months", duration: "6 Months", price: 23999, savings: 6997 },
    { period: "12-months", duration: "1 Year", price: 39999, savings: 19993 },
  ],

  specifications: {
    Brand: "RentEase",
    Warranty: "2 Years",
    Material: "Premium Quality",
    Color: "As shown",
  },

  deliveryInfo: {
    "Delivery Time": "2-3 Business Days",
    "Delivery Charges": "Free",
    Installation: "Free",
    Packaging: "Secure",
  },

  features: [
    "Free Delivery",
    "Free Installation",
    "Insurance Included",
    "24/7 Customer Support",
  ],
};

const products = [
  {
    ...commonData,
    id: "1",
    name: "Modern L-Shaped Sofa",
    monthlyRent: 4999,
    securityDeposit: 14997,
    rating: 4.8,
    reviews: 342,
    availability: "In Stock",
    badge: "Popular",
    category: "Sofas",
    images: [sofa],
  },

  {
    ...commonData,
    id: "2",
    name: "Smart Refrigerator 500L",
    monthlyRent: 3999,
    securityDeposit: 11997,
    rating: 4.9,
    reviews: 456,
    availability: "In Stock",
    badge: "New",
    category: "Refrigerators",
    images: [
      refrigerator,
    ],
  },

  {
    ...commonData,
    id: "3",
    name: "Automatic Washing Machine 7kg",
    monthlyRent: 2499,
    securityDeposit: 7497,
    rating: 4.7,
    reviews: 212,
    availability: "In Stock",
    badge: "Best Seller",
    category: "Washing Machines",
    images: [
      washingMachine,
    ],
  },

  {
    ...commonData,
    id: "4",
    name: "Smart Window AC 1.5 Ton",
    monthlyRent: 1999,
    securityDeposit: 5997,
    rating: 4.6,
    reviews: 189,
    availability: "In Stock",
    badge: "Trending",
    category: "AC",
    images: [
      ac,
    ],
  },

  {
    ...commonData,
    id: "5",
    name: "Modern Study Table",
    monthlyRent: 1499,
    securityDeposit: 4497,
    rating: 4.5,
    reviews: 140,
    availability: "In Stock",
    badge: "Popular",
    category: "Study Tables",
    images: [
      studyTable,
    ],
  },

  {
    ...commonData,
    id: "6",
    name: '43" 4K Smart TV',
    monthlyRent: 2999,
    securityDeposit: 8997,
    rating: 4.7,
    reviews: 278,
    availability: "In Stock",
    badge: "Popular",
    category: "TVs",
    images: [
      tv,
    ],
  },

  {
    ...commonData,
    id: "7",
    name: "Comfortable Queen Bed",
    monthlyRent: 3499,
    securityDeposit: 10497,
    rating: 4.8,
    reviews: 198,
    availability: "In Stock",
    badge: "Popular",
    category: "Beds",
    images: [
      bed,
    ],
  },

  {
    ...commonData,
    id: "8",
    name: "Spacious Wardrobe",
    monthlyRent: 2799,
    securityDeposit: 8397,
    rating: 4.6,
    reviews: 165,
    availability: "In Stock",
    badge: "Popular",
    category: "Wardrobes",
    images: [
     wardrobe,
    ],
  },
];

export default products;
