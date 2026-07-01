import { Sofa, Zap, Monitor, Sparkles } from 'lucide-react';

// Category configuration - easy to add more categories
export const CATEGORIES = [
  { 
    id: 'furniture', 
    label: 'Furniture', 
    icon: Sofa, 
    path: '/category/furniture',
    description: 'Sofas, tables, chairs, and more' 
  },
  { 
    id: 'appliances', 
    label: 'Appliances', 
    icon: Zap, 
    path: '/category/appliances',
    description: 'Refrigerators, washing machines, and more' 
  },
  { 
    id: 'electronics', 
    label: 'Electronics', 
    icon: Monitor, 
    path: '/category/electronics',
    description: 'TVs, laptops, speakers, and more' 
  },
  { 
    id: 'decor', 
    label: 'Decor', 
    icon: Sparkles, 
    path: '/category/decor',
    description: 'Lighting, mirrors, rugs, and more' 
  },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find((cat) => cat.id === id);
};

export const getAllCategories = () => CATEGORIES;

export const getCategoryProducts = (category, allProducts) => {
  if (!allProducts) return [];
  return allProducts.filter((product) => 
    product.category && product.category.toLowerCase() === category.toLowerCase()
  );
};
